"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { askTutor } from "@/app/actions/tutor";
import type { TutorCitation } from "@/lib/grounded-tutor";

type Message = {
  role: "user" | "assistant";
  text: string;
  citations?: TutorCitation[];
};

export function TutorChatShell() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Ask anything about AI engineering interviews. Answers cite chapters, questions, and glossary entries from the corpus.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, startTransition] = useTransition();

  function send() {
    const text = input.trim();
    if (!text || pending) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);

    startTransition(async () => {
      const result = await askTutor(text);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: result.answer, citations: result.citations },
      ]);
    });
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col rounded-xl border border-zinc-200 bg-white shadow-sm">
      <ul className="max-h-[420px] space-y-4 overflow-y-auto p-6" aria-live="polite">
        {messages.map((msg, i) => (
          <li key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
            <span
              className={
                msg.role === "user"
                  ? "inline-block rounded-lg bg-brand px-4 py-2 text-sm text-white"
                  : "inline-block max-w-[95%] rounded-lg bg-zinc-100 px-4 py-2 text-left text-sm text-zinc-800"
              }
            >
              <span className="whitespace-pre-wrap">{msg.text}</span>
              {msg.citations && msg.citations.length > 0 && (
                <ul className="mt-3 space-y-1 border-t border-zinc-200 pt-2 text-left">
                  {msg.citations.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} className="text-brand hover:underline">
                        {c.title}
                      </Link>
                      <span className="ml-1 text-xs text-zinc-500">({c.type})</span>
                    </li>
                  ))}
                </ul>
              )}
            </span>
          </li>
        ))}
        {pending && (
          <li className="text-left text-sm text-zinc-500" aria-busy="true">
            Searching the corpus…
          </li>
        )}
      </ul>
      <form
        className="flex gap-2 border-t border-zinc-200 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about RAG, agents, evals…"
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          aria-label="Message"
          disabled={pending}
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </div>
  );
}
