import Link from 'next/link';
import { getSampleData } from '../../lib/contentLoader';
import CodeBlock from '../../components/CodeBlock';

export const metadata = {
  title: 'Sample database for the SQL notes',
  description: 'The small PostgreSQL sample database used by every sql.notes topic: customers, products, orders, employees and more. Copy it and run the examples yourself.',
  alternates: { canonical: '/sample-data/' },
};

export default function SampleDataPage() {
  const { sql, html } = getSampleData();

  return (
    <div className="page">
      <Link href="/" className="crumb">
        ← home
      </Link>
      <h1 className="topic-h1">Sample data</h1>
      <div className="doc">
        <p>
          Every topic uses these tables. On this site you don't need to do anything with this file, every example
          and practice question already runs on it right in your browser. It's here so you can see exactly what's in
          the tables, or run it in your own postgres (or paste it into{' '}
          <a href="https://www.db-fiddle.com" target="_blank" rel="noopener noreferrer">
            db-fiddle
          </a>
          , pick postgres) if you want to practice outside the site.
        </p>
        <p>What's in it:</p>
        <ul>
          <li>
            <code>customers</code>, 8 people, a few with missing phone or city on purpose
          </li>
          <li>
            <code>products</code>, 8 products across 3 categories
          </li>
          <li>
            <code>orders</code> and <code>order_items</code>, 10 orders, some with more than one item
          </li>
          <li>
            <code>employees</code>, a small org chart with managers
          </li>
          <li>
            <code>discounts</code>, date ranges for non-equi joins
          </li>
          <li>
            <code>addresses</code>, some customers have several (useful for fan-out)
          </li>
          <li>
            <code>events</code>, json payloads
          </li>
        </ul>
      </div>
      <CodeBlock code={sql} html={html} filename="sample-data.sql" />
    </div>
  );
}
