import Link from 'next/link';
import { getFunctionsPage } from '../../lib/contentLoader';
import FunctionsFilter from '../../components/FunctionsFilter';
import { clip } from '../../lib/site';

const fn = getFunctionsPage();

export const metadata = {
  title: 'SQL functions cheat sheet: PostgreSQL vs MySQL vs SQL Server',
  description: clip(
    `Every common SQL function in one table, with the PostgreSQL, MySQL and SQL Server name for each. String, numeric, date, aggregate, hashing, bitwise and system functions, ${fn.rows} in total.`
  ),
  alternates: { canonical: '/sql-functions/' },
  openGraph: { type: 'article', title: 'SQL functions cheat sheet', url: '/sql-functions/' },
};

export default function FunctionsPage() {
  return (
    <div className="page functions-page">
      <Link href="/" className="crumb">
        ← home
      </Link>
      <h1 className="topic-h1">{fn.title}</h1>
      <nav className="fn-toc" aria-label="Sections">
        {fn.sections.map((s) => (
          <a key={s.id} href={`#${s.id}`}>
            {s.title}
          </a>
        ))}
      </nav>
      <FunctionsFilter html={fn.html} />
    </div>
  );
}
