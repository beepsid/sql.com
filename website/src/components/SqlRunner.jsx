'use client';

import { useState } from 'react';
import { Play, Pencil, RotateCcw, Loader2 } from 'lucide-react';
import ResultTable from './ResultTable';
import SqlEditor from './SqlEditor';
import SqlError from './SqlError';
import { runPlayground, isReady } from '../lib/sql/browser.mjs';

// Run / Edit controls for one sql example. The example's own code block stays
// on the page; while editing, `onEditing(true)` lets the parent hide it.
export default function SqlRunner({ code, dataset, onEditing, label = 'run' }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(code);
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState(null);

  const current = editing ? value : code;

  const [warming, setWarming] = useState(false);

  const run = async () => {
    if (busy) return;
    setBusy(true);
    setWarming(!isReady(dataset.key));
    try {
      const r = await runPlayground(dataset, current);
      setOut({ kind: 'ok', ...r });
    } catch (e) {
      setOut({ kind: 'error', message: String(e?.message || e), names: e?.names });
    } finally {
      setBusy(false);
      setWarming(false);
    }
  };

  const toggleEdit = () => {
    const next = !editing;
    setEditing(next);
    if (next) setValue(code);
    onEditing?.(next);
  };

  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      run();
    }
  };

  return (
    <div className="runner">
      {editing && (
        <div className="runner-editor">
          <SqlEditor value={value} onChange={setValue} onKeyDown={onKeyDown} />
        </div>
      )}
      <div className="runner-bar">
        <button type="button" className="btn small primary" onClick={run} disabled={busy}>
          {busy ? <Loader2 className="spin w-4 h-4" /> : <Play className="w-4 h-4" />}
          {label}
        </button>
        <button type="button" className="btn small" onClick={toggleEdit}>
          {editing ? <RotateCcw className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
          {editing ? 'back to the example' : 'edit & try your own'}
        </button>
        {busy && warming && <span className="muted small">starting the database, the first run takes a few seconds...</span>}
        {out?.kind === 'ok' && (
          <span className="muted small">
            {out.results.length ? `${out.rowCount} row${out.rowCount === 1 ? '' : 's'}` : 'done'} · {out.ms} ms
          </span>
        )}
        {out && (
          <button type="button" className="link-btn small runner-clear" onClick={() => setOut(null)}>
            hide result
          </button>
        )}
      </div>

      {out?.kind === 'error' && <SqlError message={out.message} sql={current} names={out.names} />}

      {out?.kind === 'ok' && (
        <div className="runner-out">
          {out.results.length === 0 && (
            <p className="muted small">
              ran fine{out.affected ? `, ${out.affected} row${out.affected === 1 ? '' : 's'} changed` : ''}. Changes are
              undone after every run, so the sample data always stays the same.
            </p>
          )}
          {out.results.map((r, i) => (
            <div key={i}>
              {out.results.length > 1 && <p className="muted small">result {i + 1}</p>}
              <ResultTable result={r} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
