'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
const MAX_PAGES = 6;
const MAX_MATCHES = 40;

// the full text index is a static file, only downloaded the first time someone uses search
let indexPromise = null;
function loadIndex() {
  if (!indexPromise) {
    indexPromise = fetch(`${BASE}/search-index.json`)
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => {
        indexPromise = null;
        return [];
      });
  }
  return indexPromise;
}

function terms(q) {
  return q.toLowerCase().split(/\s+/).filter(Boolean);
}

function countOf(hay, word) {
  let n = 0;
  for (let i = hay.indexOf(word); i !== -1; i = hay.indexOf(word, i + word.length)) n++;
  return n;
}

// ~140 characters around the first hit, cut on word boundaries
function snippet(text, words) {
  const lower = text.toLowerCase();
  let at = -1;
  for (const w of words) {
    const i = lower.indexOf(w);
    if (i !== -1 && (at === -1 || i < at)) at = i;
  }
  if (at === -1) return text.slice(0, 140);
  let start = Math.max(0, at - 50);
  let end = Math.min(text.length, at + 90);
  if (start > 0) start = text.indexOf(' ', start) + 1 || start;
  if (end < text.length) end = text.lastIndexOf(' ', end) > at ? text.lastIndexOf(' ', end) : end;
  return (start > 0 ? '… ' : '') + text.slice(start, end) + (end < text.length ? ' …' : '');
}

function Highlight({ text, words }) {
  if (!words.length) return text;
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
}

export default function Search({ topics }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [index, setIndex] = useState(null);
  const router = useRouter();
  const inputRef = useRef(null);
  const boxRef = useRef(null);
  const listRef = useRef(null);

  const words = useMemo(() => terms(query), [query]);

  // 1. topics whose title matches, title hits first, then intro hits
  const pages = useMemo(() => {
    if (!words.length) return [];
    const all = [...topics, { level: 'reference', title: 'SQL Functions Cheat Sheet', intro: 'functions cheatsheet', href: '/sql-functions/' }];
    return all
      .map((t) => {
        const title = t.title.toLowerCase();
        const rest = `${t.intro} ${t.level}`.toLowerCase();
        if (!words.every((w) => title.includes(w) || rest.includes(w))) return null;
        const inTitle = words.filter((w) => title.includes(w)).length;
        const wholeWord = words.filter((w) => new RegExp(`\\b${w.replace(/[^a-z0-9]/g, '')}\\b`).test(title)).length;
        return { ...t, score: inTitle * 10 + wholeWord * 5 };
      })
      .filter(Boolean)
      // same score: shorter title first, so "INNER JOIN" beats "Join Fan-Out (Why Your Totals Are Wrong)"
      .sort((a, b) => b.score - a.score || a.title.length - b.title.length)
      .slice(0, MAX_PAGES)
      .map((t) => ({ kind: 'page', key: t.href || `/${t.level}/${t.slug}/`, href: t.href || `/${t.level}/${t.slug}/`, title: t.title, level: t.level }));
  }, [words, topics]);

  // 2. every section inside every page that mentions it
  const matches = useMemo(() => {
    if (!words.length || !index) return [];
    const out = [];
    for (const page of index) {
      for (const [n, s] of page.s.entries()) {
        const head = s.h.toLowerCase();
        const body = s.x.toLowerCase();
        if (!words.every((w) => head.includes(w) || body.includes(w))) continue;
        const hits = words.reduce((sum, w) => sum + countOf(body, w), 0);
        const headHits = words.filter((w) => head.includes(w)).length;
        const titleHit = words.some((w) => page.t.toLowerCase().includes(w));
        out.push({
          kind: 'match',
          key: `${page.u}#${s.id}#${n}`,
          href: s.id ? `${page.u}#${s.id}` : page.u,
          title: page.t,
          level: page.l,
          heading: s.h,
          text: snippet(s.x, words),
          score: headHits * 20 + (titleHit ? 5 : 0) + Math.min(hits, 15),
        });
      }
    }
    return out.sort((a, b) => b.score - a.score).slice(0, MAX_MATCHES);
  }, [words, index]);

  const results = useMemo(() => [...pages, ...matches], [pages, matches]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    const onClick = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, []);

  useEffect(() => {
    listRef.current?.querySelector('button.active')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const warm = () => {
    setOpen(true);
    if (!index) loadIndex().then(setIndex);
  };

  const go = (r) => {
    router.push(r.href);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      go(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const item = (r, i) => (
    <li key={r.key}>
      <button
        type="button"
        className={i === active ? 'active' : ''}
        onMouseEnter={() => setActive(i)}
        onClick={() => go(r)}
      >
        {r.kind === 'page' ? (
          <span className="search-row">
            <span className="search-title">
              <Highlight text={r.title} words={words} />
            </span>
            <span className={`level-tag ${r.level}`}>{r.level}</span>
          </span>
        ) : (
          <span className="search-match">
            <span className="search-where">
              {r.title}
              {r.heading && <> › <Highlight text={r.heading} words={words} /></>}
            </span>
            <span className="search-snippet">
              <Highlight text={r.text} words={words} />
            </span>
          </span>
        )}
      </button>
    </li>
  );

  return (
    <div className="search" ref={boxRef}>
      <SearchIcon className="search-icon w-4 h-4" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        placeholder="search notes  ( / )"
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          warm();
        }}
        onFocus={warm}
        onKeyDown={onKeyDown}
        aria-label="Search notes"
      />
      {open && words.length > 0 && (
        <ul className="search-results" ref={listRef}>
          {pages.length > 0 && <li className="search-group">topics</li>}
          {pages.map((r, i) => item(r, i))}
          {matches.length > 0 && <li className="search-group">inside the notes</li>}
          {matches.map((r, i) => item(r, pages.length + i))}
          {!index && <li className="search-empty">searching inside the notes…</li>}
          {index && results.length === 0 && <li className="search-empty">nothing found for "{query}"</li>}
        </ul>
      )}
    </div>
  );
}
