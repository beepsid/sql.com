'use client';

import { forwardRef, memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import SqlRunner from './SqlRunner';
import { isRunnable } from '../lib/sql/runnable.mjs';

// the markdown html lives in its own memoized element so React never touches
// it again after the first render. Doc adds buttons and runner slots into it.
const Html = memo(
  forwardRef(function Html({ html }, ref) {
    return <div ref={ref} className="doc" dangerouslySetInnerHTML={{ __html: html }} />;
  })
);

// Renders a topic's markdown html. Every code block gets a copy button, and
// when a `dataset` is given, every runnable sql block also gets Run / Edit.
export default function Doc({ html, dataset }) {
  const ref = useRef(null);
  const [runners, setRunners] = useState([]);

  useEffect(() => {
    const cleanup = [];
    const found = [];
    ref.current?.querySelectorAll('pre').forEach((pre, i) => {
      let wrap = pre.parentElement;
      if (!wrap.classList.contains('pre-wrap')) {
        wrap = document.createElement('div');
        wrap.className = 'pre-wrap';
        pre.replaceWith(wrap);
        wrap.appendChild(pre);
      }
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-btn pre-copy';
      btn.textContent = 'copy';
      btn.setAttribute('aria-label', 'Copy code');
      btn.addEventListener('click', async () => {
        await navigator.clipboard.writeText(pre.innerText);
        btn.textContent = 'copied';
        setTimeout(() => (btn.textContent = 'copy'), 1500);
      });
      wrap.appendChild(btn);
      cleanup.push(() => btn.remove());

      const code = pre.querySelector('code');
      if (dataset && code?.classList.contains('language-sql') && isRunnable(code.textContent)) {
        const slot = document.createElement('div');
        slot.className = 'runner-slot';
        wrap.after(slot);
        cleanup.push(() => slot.remove());
        found.push({ id: `${i}`, slot, pre, code: code.textContent.trim() });
      }
    });
    setRunners(found);
    return () => cleanup.forEach((f) => f());
    // dataset comes from the server and doesn't change for a page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html]);

  return (
    <>
      <Html ref={ref} html={html} />
      {runners.map((r) =>
        createPortal(
          <SqlRunner
            code={r.code}
            dataset={dataset}
            onEditing={(on) => (r.pre.parentElement.style.display = on ? 'none' : '')}
          />,
          r.slot,
          r.id
        )
      )}
    </>
  );
}
