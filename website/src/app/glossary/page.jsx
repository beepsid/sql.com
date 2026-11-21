import Link from 'next/link';
import { getGlossaryPage } from '../../lib/contentLoader';
import Doc from '../../components/Doc';
import { clip } from '../../lib/site';

const g = getGlossaryPage();

export const metadata = {
  title: 'SQL glossary: every SQL term explained in plain english',
  description: clip(g.intro),
  alternates: { canonical: '/glossary/' },
};

export default function GlossaryPage() {
  return (
    <div className="page glossary-page">
      <Link href="/" className="crumb">
        ← home
      </Link>
      <h1 className="topic-h1">{g.title}</h1>
      <Doc html={g.html} />
    </div>
  );
}
