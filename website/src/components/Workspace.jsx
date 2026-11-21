'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Play, Send, CheckCircle2, XCircle, Loader2, Lightbulb, RotateCcw, ArrowRight } from 'lucide-react';
import ResultTable from './ResultTable';
import SqlEditor from './SqlEditor';
import SqlError, { ErrorModeToggle } from './SqlError';
import { runOnSample, submit, describeTables } from '../lib/sql/browser.mjs';

const DIALECTS = [
  { id: 'postgres', label: 'PostgreSQL' },
  { id: 'mysql', label: 'MySQL' },
  { id: 'sqlserver', label: 'SQL Server' },
];

const STARTER = '-- write your query here\nSELECT\n';

const storeKey = (set, q) => `sqlnotes:problem:${set}/${q}`;
export const solvedKey = (set, q) => `sqlnotes:solved:${set}/${q}`;

function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function errorText(e) {
  return String(e?.message || e).split('\n')[0];
}

export default function Workspace({ set, question, prev, next }) {
  const [tab, setTab] = useState('question');
  const [code, setCode] = useState(STARTER);
  const [dialect, setDialect] = useState('postgres');
  const [busy, setBusy] = useState(null);
  const [output, setOutput] = useState(null);
  const [outTab, setOutTab] = useState('yours');
  const [tables, setTables] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [hintsShown, setHintsShown] = useState(0);
  const [showExplain, setShowExplain] = useState(false);
  const [solved, setSolved] = useState(false);
  const loaded = useRef(false);
  const expectedSample = question.expected?.sample;

  // everything resets when you move to another question
  useEffect(() => {
    loaded.current = false;
    const saved = load(storeKey(set.slug, question.slug));
    setCode(saved?.code || STARTER);
    if (saved?.dialect) setDialect(saved.dialect);
    setSolved(load(solvedKey(set.slug, question.slug)) === true);
    setHintsShown(0);
    setShowExplain(false);
    setOutput(null);
    setOutTab('yours');
    setTab('question');
    loaded.current = true;
  }, [set.slug, question.slug]);

  useEffect(() => {
    if (loaded.current) save(storeKey(set.slug, question.slug), { code, dialect });
  }, [code, dialect, set.slug, question.slug]);

  useEffect(() => {
    if (tab !== 'tables' || tables) return;
    describeTables(set, question.slug)
      .then(setTables)
      .catch((e) => setTablesError(errorText(e)));
  }, [tab, tables, set, question.slug]);

  const run = useCallback(async () => {
    if (busy) return;
    setBusy('run');
    try {
      const { result, ms, rowCount, ranAs, hash, columns } = await runOnSample(set, question.slug, code, dialect);
      setOutput({
        kind: 'run',
        result,
        ms,
        rowCount,
        ranAs,
        matches: expectedSample ? hash === expectedSample.hash : null,
        check: expectedSample
          ? { columns, rows: rowCount, expectedColumns: expectedSample.columns, expectedRows: expectedSample.rowCount }
          : null,
      });
    } catch (e) {
      setOutput({ kind: 'error', message: errorText(e), names: e?.names });
    } finally {
      setOutTab('yours');
      setBusy(null);
    }
  }, [busy, set, question.slug, code, dialect, expectedSample]);

  const doSubmit = useCallback(async () => {
    if (busy) return;
    setBusy('submit');
    setOutTab('yours');
    try {
      const onUpdate = (results) => setOutput({ kind: 'submit', results, done: false });
      const { results, ranAs } = await submit(set, question, code, dialect, onUpdate);
      const pass = results.length > 0 && results.every((r) => r.status === 'pass');
      if (pass) {
        save(solvedKey(set.slug, question.slug), true);
        setSolved(true);
      }
      setOutput({ kind: 'submit', results, done: true, pass, ranAs });
    } catch (e) {
      setOutput({ kind: 'error', message: errorText(e), names: e?.names });
    } finally {
      setBusy(null);
    }
  }, [busy, set, question, code, dialect]);

  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) doSubmit();
      else run();
      return;
    }
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      const el = e.currentTarget;
      const { selectionStart: s, selectionEnd: end } = el;
      const nextCode = code.slice(0, s) + '  ' + code.slice(end);
      setCode(nextCode);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = s + 2;
      });
    }
  };

  const reset = () => {
    if (code === STARTER || window.confirm('clear the editor and start this question over?')) setCode(STARTER);
  };

  const visibleTables = question.tables.length ? question.tables : Object.keys(tables || {});

  return (
    <div className="ws">
      <section className="ws-left">
        <div className="ws-tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'question'} onClick={() => setTab('question')}>
            question
          </button>
          <button role="tab" aria-selected={tab === 'tables'} onClick={() => setTab('tables')}>
            tables
          </button>
          <button role="tab" aria-selected={tab === 'rules'} onClick={() => setTab('rules')}>
            rules
          </button>
        </div>

        <div className="ws-pane">
          {tab === 'question' && (
            <>
              <div className="ws-meta">
                <span className={`diff ${question.difficulty}`}>{question.difficulty}</span>
                <span className="muted">
                  {set.title} · Q{question.number}
                </span>
                {solved && (
                  <span className="solved-badge">
                    <CheckCircle2 className="w-4 h-4" /> solved
                  </span>
                )}
              </div>
              {question.tags?.length > 0 && (
                <div className="ws-tags">
                  {question.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="ws-title">{question.title}</h1>
              <div className="doc" dangerouslySetInnerHTML={{ __html: question.html }} />
              {question.output.length > 0 && (
                <div className="ws-output-cols">
                  <span className="muted">output columns</span>
                  <div>
                    {question.output.map((c) => (
                      <code key={c}>{c}</code>
                    ))}
                  </div>
                </div>
              )}
              {question.tables.length > 0 && (
                <p className="muted small">
                  uses{' '}
                  {question.tables.map((t, i) => (
                    <span key={t}>
                      {i > 0 && ', '}
                      <button className="link-btn" onClick={() => setTab('tables')}>
                        {t}
                      </button>
                    </span>
                  ))}
                </p>
              )}

              {question.learn?.length > 0 && (
                <p className="muted small ws-learn">
                  new to this? learn it first:{' '}
                  {question.learn.map((l, i) => (
                    <span key={l.id}>
                      {i > 0 && ' · '}
                      <Link href={l.href}>{l.title}</Link>
                    </span>
                  ))}
                </p>
              )}

              {question.hints?.length > 0 && (
                <div className="ws-hints">
                  {question.hints.slice(0, hintsShown).map((h, i) => (
                    <p key={i} className="ws-hint-item">
                      <span className="ws-hint-num">hint {i + 1}</span>
                      <span dangerouslySetInnerHTML={{ __html: h }} />
                    </p>
                  ))}
                  {hintsShown < question.hints.length && (
                    <button className="btn small" onClick={() => setHintsShown((n) => n + 1)}>
                      <Lightbulb className="w-4 h-4" />
                      {hintsShown === 0 ? 'stuck? get a hint' : 'one more hint'}
                      <span className="muted">
                        {hintsShown}/{question.hints.length}
                      </span>
                    </button>
                  )}
                </div>
              )}

              {question.explanation &&
                (solved || showExplain ? (
                  <div className="ws-explain">
                    <h3>{solved ? 'nice one. here is the thinking behind it' : 'the thinking behind it'}</h3>
                    <div className="doc" dangerouslySetInnerHTML={{ __html: question.explanation }} />
                  </div>
                ) : (
                  <button
                    className="link-btn small ws-spoiler"
                    onClick={() => {
                      if (window.confirm('this gives away the approach. tried the hints already? press OK to see it.'))
                        setShowExplain(true);
                    }}
                  >
                    show the explanation (spoiler)
                  </button>
                ))}
            </>
          )}

          {tab === 'tables' && (
            <>
              <p className="muted small">
                sample rows only. Submissions are also checked against hidden test cases, random data and a large dataset.
              </p>
              {tablesError && <p className="error-text">{tablesError}</p>}
              {!tables && !tablesError && (
                <p className="muted">
                  <Loader2 className="spin inline w-4 h-4" /> loading database...
                </p>
              )}
              {tables &&
                visibleTables.map((name) =>
                  tables[name] ? (
                    <div key={name} className="ws-table">
                      <h3>{name}</h3>
                      <p className="ws-cols">
                        {tables[name].columns.map((c) => (
                          <span key={c.column_name}>
                            <code>{c.column_name}</code> <span className="muted">{c.data_type}</span>
                          </span>
                        ))}
                      </p>
                      <ResultTable result={tables[name].rows} />
                    </div>
                  ) : null
                )}
              {tables && question.tables.length > 0 && Object.keys(tables).some((n) => !question.tables.includes(n)) && (
                <details className="ws-other-tables">
                  <summary className="muted small">other tables in this set</summary>
                  {Object.keys(tables)
                    .filter((n) => !question.tables.includes(n))
                    .map((name) => (
                      <div key={name} className="ws-table">
                        <h3>{name}</h3>
                        <ResultTable result={tables[name].rows} />
                      </div>
                    ))}
                </details>
              )}
            </>
          )}

          {tab === 'rules' && <div className="doc" dangerouslySetInnerHTML={{ __html: set.introHtml }} />}
        </div>

        <nav className="ws-nav">
          {prev ? <Link href={`/problems/${set.slug}/${prev.slug}`}>← Q{prev.number}</Link> : <span />}
          <Link href="/problems">all problems</Link>
          {next ? <Link href={`/problems/${set.slug}/${next.slug}`}>Q{next.number} →</Link> : <span />}
        </nav>
      </section>

      <section className="ws-right">
        <div className="ws-toolbar">
          <div className="ws-toolbar-left">
            <label className="ws-dialect">
              <span className="sr-only">SQL dialect</span>
              <select value={dialect} onChange={(e) => setDialect(e.target.value)}>
                {DIALECTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>
            <button className="icon-btn" onClick={reset} title="start over" aria-label="Clear the editor">
              <RotateCcw className="w-4 h-4" />
            </button>
            <ErrorModeToggle />
          </div>
          <div className="ws-actions">
            <button className="btn" onClick={run} disabled={!!busy} title="Ctrl+Enter">
              {busy === 'run' ? <Loader2 className="spin w-4 h-4" /> : <Play className="w-4 h-4" />}
              run
            </button>
            <button className="btn primary" onClick={doSubmit} disabled={!!busy} title="Ctrl+Shift+Enter">
              {busy === 'submit' ? <Loader2 className="spin w-4 h-4" /> : <Send className="w-4 h-4" />}
              submit
            </button>
          </div>
        </div>

        {dialect !== 'postgres' && (
          <p className="ws-dialect-note">
            {DIALECTS.find((d) => d.id === dialect).label} queries are translated to postgres before running.
            Common syntax and functions work (TOP, ISNULL, IFNULL, DATEADD, DATEDIFF, brackets, backticks...). If
            something doesn't translate, try writing it in postgres.
          </p>
        )}

        <SqlEditor value={code} onChange={setCode} onKeyDown={onKeyDown} />
        <p className="ws-hint muted small">ctrl + enter to run on the sample data · ctrl + shift + enter to submit</p>

        <div className="ws-output" aria-live="polite">
          {expectedSample?.output && (
            <div className="out-tabs" role="tablist">
              <button role="tab" aria-selected={outTab === 'yours'} onClick={() => setOutTab('yours')}>
                your output
              </button>
              <button role="tab" aria-selected={outTab === 'expected'} onClick={() => setOutTab('expected')}>
                expected output
              </button>
              {output?.kind === 'run' && output.matches !== null && (
                <span className={`match ${output.matches ? 'yes' : 'no'}`}>
                  {output.matches ? '✓ matches the sample' : "✗ doesn't match yet"}
                </span>
              )}
            </div>
          )}

          {outTab === 'expected' && expectedSample?.output && (
            <>
              <p className="muted small">
                what the right answer returns on the sample data. Row order doesn't matter. Matching this is a good
                start, then submit to check the hidden tests too.
              </p>
              <ResultTable result={expectedSample.output} />
            </>
          )}

          {outTab === 'yours' && (
            <>
              {!output && (
                <p className="muted">
                  run your query to see the output here (ctrl + enter). Submit checks it against the sample data,
                  hidden test cases, random data and a large dataset.
                </p>
              )}

              {output?.kind === 'error' && <SqlError message={output.message} sql={code} names={output.names} />}

              {output?.kind === 'run' && (
                <>
                  <p className="muted small">
                    {output.rowCount} row{output.rowCount === 1 ? '' : 's'} · {output.ms} ms · sample data
                    {output.rowCount > output.result.rows.length && ` · showing first ${output.result.rows.length}`}
                  </p>
                  {output.matches === false && output.check && (
                    <p className="small run-reason">
                      <XCircle className="inline w-4 h-4" />
                      <CheckHint check={output.check} />
                    </p>
                  )}
                  <ResultTable result={output.result} />
                </>
              )}

              {output?.kind === 'submit' && <SubmitReport output={output} set={set} next={next} />}

              {output?.ranAs && (
                <details className="ran-as">
                  <summary className="muted small">ran as postgres</summary>
                  <pre>{output.ranAs}</pre>
                </details>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

const STATUS_ICON = {
  pass: '✓',
  fail: '✗',
  timeout: '⏱',
  error: '✗',
  skipped: '–',
  waiting: '·',
  preparing: '…',
  running: '…',
};

function SubmitReport({ output, set, next }) {
  const { results, done, pass } = output;
  const sample = results.find((r) => r.kind === 'sample');
  const cases = results.filter((r) => r.kind === 'case');
  const randoms = results.filter((r) => r.kind === 'random');
  const large = results.find((r) => r.kind === 'large');
  const passedCount = results.filter((r) => r.status === 'pass').length;
  const preparingLarge = large?.status === 'preparing';

  return (
    <>
      <div className={`verdict ${!done ? 'pending' : pass ? 'good' : 'bad'}`}>
        {!done ? (
          <Loader2 className="spin w-4 h-4" />
        ) : pass ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : (
          <XCircle className="w-4 h-4" />
        )}
        <div>
          <strong>
            {!done ? 'checking...' : pass ? 'correct!' : 'not quite'}{' '}
            <span className="muted">
              {passedCount}/{results.length} tests passed
            </span>
          </strong>
          {preparingLarge && <p className="muted small">building the large dataset, only slow the first time...</p>}
          <ul className="checks">
            {sample && <TestLine r={sample} />}
            {cases.map((r) => (
              <TestLine key={r.id} r={r} />
            ))}
            {randoms.length > 0 && <RandomLine results={randoms} />}
            {large && <TestLine r={large} showTime />}
          </ul>
          {done && pass && (
            <p className="small next-up">
              {next ? (
                <Link href={`/problems/${set.slug}/${next.slug}`}>
                  next up: {next.title} <ArrowRight className="inline w-4 h-4" />
                </Link>
              ) : (
                <Link href="/problems">
                  that was the last one in this set, pick another <ArrowRight className="inline w-4 h-4" />
                </Link>
              )}
            </p>
          )}
          {done && !pass && (
            <p className="small muted">
              tip: check the expected output tab, and the hints on the left if you're stuck.
            </p>
          )}
        </div>
      </div>
      {sample?.result && (
        <>
          <p className="muted small">your output on the sample data</p>
          <ResultTable result={sample.result} />
        </>
      )}
    </>
  );
}

function TestLine({ r, showTime }) {
  return (
    <li className={`test ${r.status}`}>
      <span className="test-icon">{STATUS_ICON[r.status]}</span>
      <span>
        {r.name}
        {showTime && r.ms != null && (
          <span className="muted"> · {r.ms < 1000 ? `${r.ms} ms` : `${(r.ms / 1000).toFixed(1)}s`}</span>
        )}
        {r.status === 'fail' && <CheckHint check={r} />}
        {r.status === 'timeout' && <span className="hint"> · {r.error}</span>}
        {r.status === 'error' && <span className="hint"> · {r.error}</span>}
      </span>
    </li>
  );
}

function RandomLine({ results }) {
  const finished = results.filter((r) => !['waiting', 'preparing', 'running'].includes(r.status));
  const passed = results.filter((r) => r.status === 'pass');
  const failed = results.filter((r) => r.status === 'fail' || r.status === 'timeout');
  const status =
    finished.length < results.length ? 'running' : passed.length === results.length ? 'pass' : failed.length ? 'fail' : 'skipped';
  return (
    <li className={`test ${status}`}>
      <span className="test-icon">{STATUS_ICON[status]}</span>
      <span>
        random datasets{' '}
        <span className="muted">
          {passed.length}/{results.length}
        </span>
        {failed.length > 0 && (
          <span className="hint">
            {' '}
            · failed on {failed.map((r) => '#' + r.id.split('-')[1]).join(', ')}
            {failed[0].status === 'fail' && <CheckHint check={failed[0]} />}
          </span>
        )}
      </span>
    </li>
  );
}

function CheckHint({ check }) {
  const want = check.expectedColumns || [];
  const sameCols = want.length === check.columns.length && want.every((c, i) => c === check.columns[i]);
  if (want.length && !sameCols) {
    return (
      <span className="hint">
        {' '}
        · your columns are <code>{check.columns.join(', ') || 'none'}</code>, they should be{' '}
        <code>{want.join(', ')}</code> (same names, same order, use <code>AS</code> to rename)
      </span>
    );
  }
  if (check.rows !== check.expectedRows) {
    return (
      <span className="hint">
        {' '}
        · expected {check.expectedRows} row{check.expectedRows === 1 ? '' : 's'}, you returned {check.rows}
      </span>
    );
  }
  return <span className="hint"> · right number of rows, but some values are different</span>;
}
