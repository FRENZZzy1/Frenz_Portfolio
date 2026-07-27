import { useState } from "react";

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // noop
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 rounded-sm border border-line bg-surface px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-ink-muted transition-colors hover:text-teal"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function FormattedMessage({ content }) {
  const lines = content.split("\n");
  const elements = [];
  let i = 0;
  let key = 0;

  const parseInline = (text) => {
    const parts = [];
    let last = 0;
    const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
    let m;
    while ((m = regex.exec(text)) !== null) {
      if (m.index > last) parts.push(<span key={`t-${key++}`}>{text.slice(last, m.index)}</span>);

      const str = m[0];
      if (str.startsWith("`") && str.endsWith("`")) {
        parts.push(
          <code key={`c-${key++}`} className="rounded bg-surface px-1 py-0.5 font-mono text-[11px] text-teal">
            {str.slice(1, -1)}
          </code>
        );
      } else if (str.startsWith("**") && str.endsWith("**")) {
        parts.push(<strong key={`b-${key++}`} className="font-semibold text-ink">{str.slice(2, -2)}</strong>);
      } else if (str.startsWith("*") && str.endsWith("*")) {
        parts.push(<em key={`i-${key++}`} className="italic text-ink-muted">{str.slice(1, -1)}</em>);
      } else if (str.startsWith("[")) {
        const match = str.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
          parts.push(
            <a
              key={`a-${key++}`}
              href={match[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-teal/30 underline-offset-2 transition-colors hover:text-amber hover:decoration-amber/50"
            >
              {match[1]}
            </a>
          );
        }
      }
      last = regex.lastIndex;
    }
    if (last < text.length) parts.push(<span key={`e-${key++}`}>{text.slice(last)}</span>);
    return parts.length ? parts : text;
  };

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      i++;
      const code = [];
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={`pre-${key++}`} className="relative my-3">
          <CopyButton code={code.join("\n")} />
          <pre className="overflow-x-auto rounded-sm border border-line bg-surface-2 p-3 pt-9">
            <code className="font-mono text-xs leading-relaxed text-ink">{code.join("\n")}</code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      elements.push(<h3 key={`h3-${key++}`} className="mt-3 mb-1 font-display text-lg text-ink">{line.slice(4)}</h3>);
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(<h2 key={`h2-${key++}`} className="mt-3 mb-1 font-display text-xl text-ink">{line.slice(3)}</h2>);
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      elements.push(<h1 key={`h1-${key++}`} className="mt-3 mb-1 font-display text-2xl text-ink">{line.slice(2)}</h1>);
      i++;
      continue;
    }

    // Unordered list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${key++}`} className="my-3 list-inside list-disc space-y-1 pl-1 text-sm text-ink/90">
          {items.map((it, idx) => (
            <li key={idx} className="pl-0.5 marker:text-amber">{parseInline(it)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    elements.push(
      <p key={`p-${key++}`} className="mb-2.5 text-sm leading-relaxed text-ink/90">
        {parseInline(line)}
      </p>
    );
    i++;
  }

  return <div className="chat-markdown">{elements}</div>;
}