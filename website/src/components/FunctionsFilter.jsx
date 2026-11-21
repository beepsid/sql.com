'use client';

import { useEffect, useRef, useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

// the tables are plain server rendered html (so google sees all of it), this just hides rows that don't match
export default function FunctionsFilter({ html }) {
  const ref = useRef(null);
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(null);
  const inputRef = useRef(null);

  // the browser can refill the box on back / reload before react knows about it
  useEffect(() => {
    if (inputRef.current?.value) setQuery(inputRef.current.value);
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const q = query.trim().toLowerCase();
    let count = 0;
    root.querySelectorAll('tbody tr').forEach((tr) => {
      const hit = !q || tr.textContent.toLowerCase().includes(q);
      tr.hidden = !hit;
      if (hit) count++;
    });
    // hide a whole section (heading, notes line, table) when none of its rows match
    root.querySelectorAll('table').forEach((table) => {
      const any = !q || table.querySelector('tbody tr:not([hidden])');
      let el = table;
      const group = [table];
      while ((el = el.previousElementSibling) && el.tagName !== 'H2') group.push(el);
      if (el) group.push(el);
      group.forEach((g) => g.classList.toggle('fn-hidden', !any));
    });
    // the intro paragraphs only show when there's no filter
    root.querySelectorAll(':scope > p').forEach((p) => p.classList.toggle('fn-hidden', !!q));
    setShown(q ? count : null);
  }, [query, html]);

  return (
    <>
      <div className="fn-filter">
        <SearchIcon className="w-4 h-4" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="filter, e.g. substring, date_add, isnull, md5"
          aria-label="Filter functions"
        />
        {shown !== null && <span className="fn-count">{shown} found</span>}
      </div>
      <div ref={ref} className="doc fn-doc" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
