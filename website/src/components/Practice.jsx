'use client';

import { useEffect, useMemo, useState } from 'react';
import { Play, CheckCircle2, XCircle, Eye, EyeOff, Loader2, ClipboardCheck } from 'lucide-react';
import hljs from 'highlight.js/lib/core';
import sql from 'highlight.js/lib/languages/sql';
import SqlEditor from './SqlEditor';
import SqlError from './SqlError';
import SqlRunner from './SqlRunner';
import ResultTable from './ResultTable';
import { runPlayground, isReady } from '../lib/sql/browser.mjs';

hljs.registerLanguage('sql', sql);

const STARTER = '-- your answer here\nSELECT ';
const solvedKey = (topic, n) => `sqlnotes:practice:${topic}:${n}`;

function load(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function save(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
}

const mine_extra = (out) => out.cols && out.expected?.cols && out.cols.length > out.expected.cols.length;

function Highlighted({ code }) {
  const html = useMemo(() => hljs.highlight(code, { language: 'sql', ignoreIllegals: true }).value, [code]);
  return (
    <pre className="practice-answer">
      <code className="hljs language-sql" dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}

function Question({ q, topic, dataset }) {
  const draftKey = `sqlnotes:practice-draft:${topic}:${q.n}`;
  const [code, setCode] = useState(STARTER);
  const [busy, setBusy] = useState(null);
  const [out, setOut] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [solved, setSolved] = useState(false);
  const [answerRun, setAnswerRun] = useState(null);

  useEffect(() => {
    setCode(load(draftKey) || STARTER);
    setSolved(load(solvedKey(topic, q.n)) === '1');
  }, [draftKey, topic, q.n]);

  const change = (v) => {
    setCode(v);
    save(draftKey, v);
  };

  const answerResult = async () => {
    if (answerRun) return answerRun;
    try {
      const r = await runPlayground(dataset, q.answer);
      setAnswerRun(r);
      return r;
    } catch {
      return null;
    }
  };

  const run = async () => {
    setBusy('run');
    try {
      setOut({ kind: 'run', ...(await runPlayground(dataset, code)) });
    } catch (e) {
      setOut({ kind: 'error', message: String(e?.message || e), names: e?.names });
    } finally {
      setBusy(null);
    }
  };

  const check = async () => {
    setBusy('check');
    try {
      const mine = await runPlayground(dataset, code);
      const theirs = await answerResult();
      let verdict;
      if (!theirs || !theirs.rowsHash) verdict = 'manual';
      else if (mine.rowsHash === theirs.rowsHash) verdict = 'pass';
      else if (!mine.rowsHash) verdict = 'no-rows';
      else if (mine.rowCount !== theirs.rowCount) verdict = 'count';
      else verdict = 'values';
      let missing = [];
      if (verdict === 'values' && mine.cols && theirs.cols) {
        const have = new Set(mine.cols.map((c) => c.sig));
        const want = new Set(theirs.cols.map((c) => c.sig));
        missing = theirs.cols.filter((c) => !have.has(c.sig)).map((c) => c.name);
        // every answer column is in yours (maybe with extra ones): that's right
        if (missing.length === 0) verdict = 'pass';
        // all of yours are right, you're just missing some
        else if (mine.cols.every((c) => want.has(c.sig))) verdict = 'missing';
      }
      if (verdict === 'pass') {
        save(solvedKey(topic, q.n), '1');
        setSolved(true);
      }
      setOut({ kind: 'check', verdict, missing, ...mine, expected: theirs });
    } catch (e) {
      setOut({ kind: 'error', message: String(e?.message || e), names: e?.names });
    } finally {
      setBusy(null);
    }
  };

  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) check();
      else run();
    }
  };

  const results = out && (out.kind === 'run' || out.kind === 'check') ? out.results : null;
  // answers that are only comments are "what would happen if..." questions
  const thinking = !q.answer.replace(/--.*$/gm, '').trim();

  return (
    <li className={`practice-q ${solved ? 'solved' : ''}`}>
      <p className="practice-text">
        <span className="practice-num">{solved ? <CheckCircle2 className="w-4 h-4" /> : q.n}</span>
        {q.text}
      </p>
      <div className="practice-editor">
        <SqlEditor value={code} onChange={change} onKeyDown={onKeyDown} />
      </div>
      <div className="runner-bar">
        <button type="button" className="btn small" onClick={run} disabled={!!busy}>
          {busy === 'run' ? <Loader2 className="spin w-4 h-4" /> : <Play className="w-4 h-4" />}
          run
        </button>
        {thinking ? (
          <span className="muted small">a thinking question: try things out, then compare with the answer</span>
        ) : (
          <button type="button" className="btn small primary" onClick={check} disabled={!!busy}>
            {busy === 'check' ? <Loader2 className="spin w-4 h-4" /> : <ClipboardCheck className="w-4 h-4" />}
            check my answer
          </button>
        )}
        <button type="button" className="btn small" onClick={() => setShowAnswer((s) => !s)}>
          {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showAnswer ? 'hide answer' : 'show answer'}
        </button>
      </div>

      {busy && !isReady(dataset.key) && (
        <p className="muted small">starting the database, the first run takes a few seconds...</p>
      )}

      {out?.kind === 'error' && <SqlError message={out.message} sql={code} names={out.names} />}

      {out?.kind === 'check' && (
        <div className={`verdict ${out.verdict === 'pass' ? 'good' : out.verdict === 'manual' ? 'pending' : 'bad'}`}>
          {out.verdict === 'pass' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          <div>
            <strong>
              {out.verdict === 'pass' && 'nice, you got the same result as the answer!'}
              {out.verdict === 'manual' && "this one changes data instead of returning rows, so it can't be checked automatically. Compare with the answer."}
              {out.verdict === 'no-rows' && "your query didn't return any rows, but the answer does."}
              {out.verdict === 'count' && `not yet: you got ${out.rowCount} row${out.rowCount === 1 ? '' : 's'}, the answer has ${out.expected.rowCount}.`}
              {out.verdict === 'values' && 'close: right number of rows, but some values are different.'}
              {out.verdict === 'missing' && (
                <>
                  almost! everything you have is right, but the answer also shows{' '}
                  {out.missing.map((m, i) => (
                    <span key={m}>
                      {i > 0 && ', '}
                      <code>{m}</code>
                    </span>
                  ))}
                  .
                </>
              )}
            </strong>
            {out.verdict === 'pass' && mine_extra(out) && <p className="small">(you have extra columns too, that's fine)</p>}
            {out.verdict !== 'pass' && out.verdict !== 'manual' && (
              <p className="small">
                Column names and order don't matter here, only the values. Compare your output with the expected one
                below.
              </p>
            )}
          </div>
        </div>
      )}

      {results && (
        <div className="runner-out">
          {out.kind === 'check' && <p className="muted small">your output</p>}
          {results.length === 0 ? (
            <p className="muted small">ran fine, no rows to show.</p>
          ) : (
            results.slice(-1).map((r, i) => <ResultTable key={i} result={r} />)
          )}
          {out.kind === 'check' && out.verdict !== 'pass' && out.expected?.results?.length > 0 && (
            <>
              <p className="muted small">expected output</p>
              <ResultTable result={out.expected.results[out.expected.results.length - 1]} />
            </>
          )}
        </div>
      )}

      {showAnswer && <Highlighted code={q.answer} />}
    </li>
  );
}

export default function Practice({ practice, topic, dataset, fullFile }) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    const count = () => setDone(practice.questions.filter((q) => load(solvedKey(topic, q.n)) === '1').length);
    count();
    const id = setInterval(count, 1500);
    return () => clearInterval(id);
  }, [practice, topic]);

  return (
    <>
      <p className="practice-intro">
        Write your query in the box, hit <strong>run</strong> to see what it returns, then <strong>check my answer</strong>{' '}
        to compare with ours. Stuck? <strong>show answer</strong>. Nothing to install, it all runs on the{' '}
        <a href="/sample-data/">sample data</a> right in your browser.{' '}
        <span className="muted">
          {done}/{practice.questions.length} done
        </span>
      </p>
      <ol className="practice-list">
        {practice.questions.map((q) => (
          <Question key={q.n} q={q} topic={topic} dataset={dataset} />
        ))}
      </ol>
      {practice.examples && (
        <details className="practice-more">
          <summary>more examples from this topic</summary>
          <Highlighted code={practice.examples} />
          <SqlRunner code={practice.examples} dataset={dataset} label="run all of them" />
        </details>
      )}
      <details className="practice-more">
        <summary>the whole practice file (to copy into your own database)</summary>
        <Highlighted code={fullFile} />
      </details>
    </>
  );
}
