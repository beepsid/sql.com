'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyButton({ text, className = '' }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`copy-btn ${className}`}
      aria-label={copied ? 'Copied' : 'Copy code'}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? 'copied' : 'copy'}</span>
    </button>
  );
}

export default function CodeBlock({ code, html, filename }) {
  return (
    <div className="code-block">
      <div className="code-block-bar">
        <span>{filename}</span>
        <CopyButton text={code} />
      </div>
      <pre>
        <code className="hljs language-sql" dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
