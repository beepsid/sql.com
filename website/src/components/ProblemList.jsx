'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

const LEVELS = ['all', 'easy', 'medium', 'hard'];

export default function ProblemList({ sets }) {
  const [level, setLevel] = useState('all');
  const [query, setQuery] = useState('');
  const [solved, setSolved] = useState({});

  useEffect(() => {
    const s = {};
    try {
      for (const set of sets)
        for (const q of set.questions)
          s[`${set.slug}/${q.slug}`] = localStorage.getItem(`sqlnotes:solved:${set.slug}/${q.slug}`) === 'true';
    } catch {}
    setSolved(s);
  }, [sets]);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return sets
      .map((set) => ({
        ...set,
        questions: set.questions.filter(
          (q) =>
            (level === 'all' || q.difficulty === level) &&
            (!text || `${q.title} ${q.tags.join(' ')} ${set.title}`.toLowerCase().includes(text))
        ),
      }))
      .filter((set) => set.questions.length > 0);
  }, [sets, level, query]);

  const total = sets.reduce((n, s) => n + s.questions.length, 0);
  const done = Object.values(solved).filter(Boolean).length;
  const count = (l) =>
    l === 'all' ? total : sets.reduce((n, s) => n + s.questions.filter((q) => q.difficulty === l).length, 0);
  const solvedIn = (l) =>
    sets.reduce(
      (n, s) => n + s.questions.filter((q) => q.difficulty === l && solved[`${s.slug}/${q.slug}`]).length,
      0
    );

  return (
    <>
      <div className="problem-filters">
        <div className="chips" role="group" aria-label="Difficulty">
          {LEVELS.map((l) => (
            <button key={l} className={`chip ${l} ${level === l ? 'on' : ''}`} onClick={() => setLevel(l)}>
              {l} <span className="chip-count">{count(l)}</span>
            </button>
          ))}
        </div>
        <input
          type="search"
          className="problem-search"
          placeholder="filter by name or topic"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Filter problems"
        />
        <span className="muted small solved-count">
          {done}/{total} solved
        </span>
      </div>

      <div className="progress" aria-label={`${done} of ${total} solved`}>
        {['easy', 'medium', 'hard'].map((l) => (
          <div key={l} className="progress-row">
            <span className={`diff ${l}`}>{l}</span>
            <div className="progress-bar">
              <div className={`progress-fill ${l}`} style={{ width: `${(100 * solvedIn(l)) / (count(l) || 1)}%` }} />
            </div>
            <span className="muted small">
              {solvedIn(l)}/{count(l)}
            </span>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <p className="muted">nothing matches that filter.</p>}

      {filtered.map((set) => (
        <section key={set.slug} id={set.slug} className="problem-set">
          <div className="problem-set-head">
            <h2>{set.title}</h2>
            {set.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
          <details className="set-rules">
            <summary className="muted small">about this dataset</summary>
            <div className="doc" dangerouslySetInnerHTML={{ __html: set.introHtml }} />
          </details>
          <ol className="problem-list">
            {set.questions.map((q) => (
              <li key={q.slug}>
                <Link href={`/problems/${set.slug}/${q.slug}`}>
                  <span className={`solved-mark ${solved[`${set.slug}/${q.slug}`] ? 'done' : ''}`}>
                    {solved[`${set.slug}/${q.slug}`] && <CheckCircle2 className="w-4 h-4" />}
                  </span>
                  <span className="problem-text">
                    <span className="problem-title">{q.title}</span>
                    {q.tags.length > 0 && <span className="problem-tags">{q.tags.join(' · ')}</span>}
                  </span>
                  <span className={`diff ${q.difficulty}`}>{q.difficulty}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </>
  );
}
