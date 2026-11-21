'use client';

import { useEffect, useState } from 'react';
import { XCircle } from 'lucide-react';
import { explainError } from '../lib/sql/friendly.mjs';

const KEY = 'sqlnotes:errorMode';
const EVENT = 'sqlnotes:errormode';

// 'beginner' shows errors in plain english, 'pro' shows exactly what postgres said.
// one setting for the whole site, remembered in the browser.
export function useErrorMode() {
  const [mode, setMode] = useState('beginner');
  useEffect(() => {
    const read = () => {
      try {
        setMode(localStorage.getItem(KEY) === 'pro' ? 'pro' : 'beginner');
      } catch {}
    };
    read();
    window.addEventListener(EVENT, read);
    window.addEventListener('storage', read);
    return () => {
      window.removeEventListener(EVENT, read);
      window.removeEventListener('storage', read);
    };
  }, []);
  const update = (next) => {
    try {
      localStorage.setItem(KEY, next);
    } catch {}
    setMode(next);
    window.dispatchEvent(new Event(EVENT));
  };
  return [mode, update];
}

export function ErrorModeToggle({ compact = false }) {
  const [mode, setMode] = useErrorMode();
  return (
    <div className={`mode-toggle ${compact ? 'compact' : ''}`} role="group" aria-label="How errors are shown">
      {!compact && <span className="muted">errors:</span>}
      <button type="button" aria-pressed={mode === 'beginner'} onClick={() => setMode('beginner')} title="Explain errors in plain english">
        beginner
      </button>
      <button type="button" aria-pressed={mode === 'pro'} onClick={() => setMode('pro')} title="Show the exact postgres error">
        postgres
      </button>
    </div>
  );
}

// **bold** and `code` in tips
function Rich({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, i) =>
    p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p.startsWith('`') ? <code key={i}>{p.slice(1, -1)}</code> : p
  );
}

export default function SqlError({ message, sql, names }) {
  const [mode] = useErrorMode();
  const friendly = mode === 'beginner' ? explainError(message, { sql, ...(names || {}) }) : null;
  const firstLine = String(message).split('\n')[0];

  return (
    <div className="verdict bad sql-error">
      <XCircle className="w-4 h-4" />
      <div>
        {friendly ? (
          <>
            <strong>{friendly.title}</strong>
            <p className="error-tip">
              <Rich text={friendly.tip} />
            </p>
            <details className="raw-error">
              <summary>what postgres actually said</summary>
              <pre className="error-pre">{firstLine}</pre>
            </details>
          </>
        ) : (
          <>
            <strong>error</strong>
            <pre className="error-pre">{firstLine}</pre>
            {mode === 'beginner' && (
              <p className="error-tip">
                Errors usually name the word or column they got stuck on, look right before it in your query.
              </p>
            )}
          </>
        )}
        <div className="error-footer">
          <ErrorModeToggle compact />
        </div>
      </div>
    </div>
  );
}
