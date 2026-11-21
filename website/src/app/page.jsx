import Link from 'next/link';
import { LEVELS, getTopics } from '../lib/contentLoader';
import { getProblemSets } from '../lib/problems';
import { ContinueCard, DoneMark } from '../components/Progress';

export default function Home() {
  const levels = LEVELS.map((l) => ({ ...l, topics: getTopics(l.slug) }));
  const total = levels.reduce((n, l) => n + l.topics.length, 0);
  const problemCount = getProblemSets().reduce((n, s) => n + s.questions.length, 0);
  const first = levels[0].topics[0];

  return (
    <div className="page">
      <section className="hero">
        <h1>Learn SQL, one topic at a time.</h1>
        <p>
          Hola amigos! I have personally curated this website for ya'll. I've tried to make it as easy as possible to
          learn SQL. You've got {total} topics from your first SELECT query to window functions and all the way to
          query plans. Every topic is a short explanation, examples you can run right on the page, and practice
          questions that check your answer. All queries run on the same small sample database, so you can try
          everything yourself and learn at your own pace while you keep practicing on industry-standard databases.
        </p>
        <div className="hero-actions">
          <Link href={`/${first.level}/${first.slug}`} className="btn primary">
            Never written SQL? Start here
          </Link>
          <Link href="/problems" className="btn">
            Try the {problemCount} problems?
          </Link>
        </div>
      </section>

      <ContinueCard total={total} />

      <section className="howto">
        <h2>How to use this?</h2>
        <ol>
          <li>
            Nothing to install. Every example has a <strong>run</strong> button, and it runs real postgres right in your
            browser on a small <Link href="/sample-data">sample database</Link>. You can't break anything, every run is
            undone.
          </li>
          <li>
            Go in order if you're new, starting with <Link href={`/${first.level}/${first.slug}`}>{first.title}</Link>. If
            you're prepping for interviews, jump straight to intermediate.
          </li>
          <li>
            Read a topic, run the examples, change them and see what happens. Then do the practice questions at the
            bottom, <strong>check my answer</strong> tells you if you got it.
          </li>
          <li>
            Then go practice on the <Link href="/problems">problems</Link>. Start with the warmup set. Every problem has
            hints if you're stuck, the expected output to compare against, and an explanation once you crack it.
          </li>
          <li>
            Errors are shown in plain english by default. Switch to <em>postgres</em> errors any time if you want the
            real message (that's what you'll see at work).
          </li>
          <li>
            Hit a word you don't know? The <Link href="/glossary">glossary</Link> explains them all in one line each.
            Forgot what a function is called in mysql or sql server? The{' '}
            <Link href="/sql-functions">functions cheat sheet</Link> has all of them side by side.
          </li>
          <li>
            Want to run things on your own computer too? Copy the <Link href="/sample-data">sample data</Link> into
            postgres, or paste it into{' '}
            <a href="https://www.db-fiddle.com" target="_blank" rel="noopener noreferrer">
              db-fiddle
            </a>{' '}
            (pick postgres). Why postgres? It's free, open source, and one of the most used databases in the world. MySQL
            and SQL Server are very similar, a few function names differ.
          </li>
        </ol>
      </section>

      {levels.map((level) => (
        <section key={level.slug} className="level-section">
          <div className="level-head">
            <h2>
              <Link href={`/${level.slug}`} className={`level-name ${level.slug}`}>
                {level.name}
              </Link>
            </h2>
            <p>{level.blurb}</p>
          </div>
          <ol className="topic-list">
            {level.topics.map((t) => (
              <li key={t.slug}>
                <Link href={`/${t.level}/${t.slug}`}>
                  <span className="topic-num">{String(t.number).padStart(2, '0')}</span>
                  <span className="topic-text">
                    <span className="topic-title">
                      {t.title} <DoneMark level={t.level} slug={t.slug} />
                    </span>
                    <span className="topic-intro">{t.intro}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
