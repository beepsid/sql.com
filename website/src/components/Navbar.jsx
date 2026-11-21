'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import Search from './Search';

export default function Navbar({ topics }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="brand">
          sql<span>.</span>notes
        </Link>
        <nav className="nav-links">
          <Link href="/" className="nav-home">
            learn
          </Link>
          <Link href="/sql-functions">functions</Link>
          <Link href="/problems">problems</Link>
        </nav>

        <Search topics={topics} />

        <div className="navbar-actions">
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="icon-btn"
            aria-label="Toggle dark mode"
          >
            {mounted && resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
