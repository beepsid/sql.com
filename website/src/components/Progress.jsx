'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

const doneKey = (level, slug) => `sqlnotes:topic:${level}/${slug}`;
const LAST = 'sqlnotes:lastTopic';
const EVENT = 'sqlnotes:progress';

function read(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function useDone(level, slug) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const sync = () => setDone(read(doneKey(level, slug)) === '1');
    sync();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, [level, slug]);
  return [done, (v) => write(doneKey(level, slug), v ? '1' : null)];
}

// the little tick next to a topic in lists
export function DoneMark({ level, slug }) {
  const [done] = useDone(level, slug);
  return done ? <CheckCircle2 className="done-mark w-4 h-4" aria-label="done" /> : null;
}

// bottom of a topic page. also remembers this as the last topic opened.
export function MarkDone({ level, slug, title }) {
  const [done, setDone] = useDone(level, slug);
  useEffect(() => {
    try {
      localStorage.setItem(LAST, JSON.stringify({ href: `/${level}/${slug}/`, title }));
    } catch {}
  }, [level, slug, title]);
  return (
    <button type="button" className={`btn mark-done ${done ? 'is-done' : ''}`} onClick={() => setDone(!done)}>
      {done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
      {done ? 'done! (click to undo)' : 'mark this topic as done'}
    </button>
  );
}

// home page: pick up where you left off
export function ContinueCard({ total }) {
  const [state, setState] = useState(null);
  useEffect(() => {
    try {
      const last = JSON.parse(localStorage.getItem(LAST) || 'null');
      const done = Object.keys(localStorage).filter((k) => k.startsWith('sqlnotes:topic:') && localStorage.getItem(k) === '1').length;
      if (last || done) setState({ last, done });
    } catch {}
  }, []);
  if (!state) return null;
  return (
    <div className="continue-card">
      <div>
        <strong>welcome back!</strong>{' '}
        <span className="muted">
          {state.done}/{total} topics done
        </span>
        <div className="progress-bar">
          <div className="progress-fill easy" style={{ width: `${(100 * state.done) / total}%` }} />
        </div>
      </div>
      {state.last && (
        <Link href={state.last.href} className="btn primary">
          continue: {state.last.title} <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
