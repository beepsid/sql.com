import Link from 'next/link';
import { DoneMark } from './Progress';

export default function Sidebar({ levels, current }) {
  return (
    <nav className="sidebar" aria-label="Topics">
      {levels.map((level) => (
        <div key={level.slug} className="sidebar-group">
          <Link href={`/${level.slug}`} className={`sidebar-level ${level.slug}`}>
            {level.name}
          </Link>
          <ul>
            {level.topics.map((t) => {
              const isCurrent = current?.level === t.level && current?.slug === t.slug;
              return (
                <li key={t.slug}>
                  <Link
                    href={`/${t.level}/${t.slug}`}
                    className={isCurrent ? 'current' : ''}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {t.title}
                    <DoneMark level={t.level} slug={t.slug} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
