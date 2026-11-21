'use client';

import { useMemo, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import sql from 'highlight.js/lib/languages/sql';

hljs.registerLanguage('sql', sql);

// a plain textarea with a highlighted copy of the same text drawn underneath it.
// the textarea text is transparent, so you see the colours but type in a real
// textarea (undo, selection, mobile keyboards all just work).
export default function SqlEditor({ value, onChange, onKeyDown }) {
  const hlRef = useRef(null);
  const html = useMemo(() => hljs.highlight(value, { language: 'sql', ignoreIllegals: true }).value, [value]);

  const syncScroll = (e) => {
    if (!hlRef.current) return;
    hlRef.current.scrollTop = e.currentTarget.scrollTop;
    hlRef.current.scrollLeft = e.currentTarget.scrollLeft;
  };

  return (
    <div className="ws-editor-wrap">
      <pre className="ws-editor-hl" ref={hlRef} aria-hidden="true">
        {/* trailing newline keeps the last empty line the same height in both layers */}
        <code dangerouslySetInnerHTML={{ __html: html + '\n' }} />
      </pre>
      <textarea
        className="ws-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onScroll={syncScroll}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        aria-label="SQL editor"
      />
    </div>
  );
}
