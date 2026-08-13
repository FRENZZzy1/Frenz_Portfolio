import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  profile, about, skills, projects, experience, certificates, achievements, assistantConfig,
} from "../data";

// Builds a plain-text summary of everything in data.js so the model has
// context about you. This runs once per page load, not per message.
function buildContext() {
  const lines = [
    `Name: ${profile.name}`,
    `Role: ${profile.role}`,
    `Location: ${profile.location}`,
    `About: ${about}`,
    `Skills: ${skills.join(", ")}`,
    "",
    "Experience:",
    ...experience.map((job) => `- ${job.role} at ${job.org} (${job.period}): ${job.points.join(" ")}`),
    "",
    "Projects:",
    ...projects.map((p) => `- ${p.title} [${p.stack.join(", ")}]: ${p.blurb}`),
    "",
    "Certificates:",
    ...certificates.map((c) => `- ${c.title}, ${c.issuer} (${c.date})`),
    "",
    "Achievements:",
    ...achievements.map((a) => `- ${a.title} (${a.date}): ${a.description}`),
    "",
    `Contact: ${profile.email}, GitHub: ${profile.github}, LinkedIn: ${profile.linkedin}`,
  ];
  return lines.join("\n");
}

const SYSTEM_PROMPT = `You are the site assistant on ${profile.name}'s portfolio website.
Answer visitor questions about ${profile.name} using ONLY the information provided.
Be concise, accurate, and friendly.

Formatting Guidelines:
- Use markdown bolding for key titles, companies, or technologies.
- Use bullet points when listing skills, projects, or experience items.
- Avoid massive blocks of text.
- If asked something not covered here, state that you don't have that information and suggest contacting ${profile.name} directly at ${profile.email}.

---
${buildContext()}
---`;

async function askGemini(messages) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const model = import.meta.env.VITE_GEMINI_MODEL || "gemini-3.5-flash-lite";

  if (!apiKey) {
    throw new Error("missing_key");
  }

  // Gemini expects role "user" | "model" (not "assistant"), and each
  // message's text wrapped in a parts array.
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          thinkingConfig: { thinkingLevel: "low" },
        },
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`request_failed_${res.status}`);
  }

  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p) => p.text ?? "").join("");
  return text || "Sorry, I couldn't generate a response.";
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll on new messages or loading state
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  // Focus input field when chat panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  if (!assistantConfig.enabled) return null;

  async function sendMessage(text) {
    const content = text.trim();
    if (!content || loading) return;

    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const reply = await askGemini(nextMessages);
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      const message =
        err.message === "missing_key"
          ? "The assistant isn't configured yet — add VITE_GEMINI_API_KEY to your .env file."
          : "Something went wrong reaching the assistant. Try again in a moment.";
      setMessages([...nextMessages, { role: "assistant", content: message }]);
    } finally {
      setLoading(false);
    }
  }

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
     {/* Floating Toggle Button with Smooth Floating Animation */}
<div className="fixed bottom-6 right-6 z-40">
  <button
    onClick={() => setOpen(!open)}
    className={`flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber bg-surface text-amber shadow-xl transition-transform duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber ${
      !open ? "animate-float" : ""
    }`}
    aria-expanded={open}
    aria-label={open ? "Close chat assistant" : "Open chat assistant"}
  >
    {open ? (
      /* Close (X) Icon */
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ) : (
      /* Chat Bubble Icon */
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    )}
  </button>
</div>

      {/* Main Chat Drawer */}
      {open && (
        <div className="fixed bottom-24 right-6 z-40 flex h-[30rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col border border-line bg-surface shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div>
              <p className="font-mono text-xs text-amber">Happy to answer your questions!</p>
              <p className="mt-0.5 text-xs text-ink-muted">Ask about {profile.name}</p>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="font-mono text-[10px] text-ink-muted hover:text-amber transition-colors"
                title="Reset conversation"
              >
                [clear]
              </button>
            )}
          </div>

          {/* Message List */}
          <div ref={scrollRef} className="chat-scroll flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <>
                <p className="text-sm text-ink-muted">{assistantConfig.greeting}</p>
                <div className="flex flex-col gap-2 pt-1">
                  {assistantConfig.suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="w-fit rounded-sm border border-line px-3 py-1.5 text-left font-mono text-xs text-ink-muted hover:border-teal hover:text-teal transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[88%] rounded-sm px-3.5 py-2.5 text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-amber text-bg font-medium"
                    : "bg-surface-2 text-ink chat-markdown"
                }`}
              >
                {m.role === "user" ? (
                  m.content
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                      ul: ({ node, ...props }) => <ul className="mb-2 list-disc pl-4 space-y-1" {...props} />,
                      ol: ({ node, ...props }) => <ol className="mb-2 list-decimal pl-4 space-y-1" {...props} />,
                      li: ({ node, ...props }) => <li className="text-sm" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-semibold text-amber" {...props} />,
                      a: ({ node, ...props }) => (
                        <a
                          className="text-teal underline underline-offset-2 hover:opacity-80"
                          target="_blank"
                          rel="noreferrer"
                          {...props}
                        />
                      ),
                      code: ({ node, inline, ...props }) => (
                        <code
                          className="rounded bg-bg px-1 py-0.5 font-mono text-xs text-teal"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                )}
              </div>
            ))}

            {loading && (
              <div className="max-w-[85%] rounded-sm bg-surface-2 px-3.5 py-2.5 font-mono text-xs text-ink-muted flex items-center gap-1.5">
                <span className="inline-block animate-pulse">thinking...</span>
              </div>
            )}
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-2 border-t border-line p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-sm border border-line bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-amber"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-sm border border-amber bg-amber px-3 py-2 font-mono text-xs text-bg transition-opacity disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}