"use client";

import { useState } from "react";

type Message = { role: "user" | "assistant"; text: string };

const STUB_REPLY =
  "Grounded tutor responses ship in P2. For now, try Search or browse the free reader for cited answers.";

export function TutorChatShell() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Ask anything about AI engineering interviews. Full RAG-backed answers with chapter citations ship soon.",
    },
  ]);
  const [input, setInput] = useState("");

  function send() {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      { role: "assistant", text: STUB_REPLY },
    ]);
    setInput("");
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col rounded-xl border border-zinc-200 bg-white shadow-sm">
      <ul className="max-h-[420px] space-y-4 overflow-y-auto p-6" aria-live="polite">
        {messages.map((msg, i) => (
          <li
            key={i}
            className={msg.role === "user" ? "text-right" : "text-left"}
          >
            <span
              className={
                msg.role === "user"
                  ? "inline-block rounded-lg bg-brand px-4 py-2 text-sm text-white"
                  : "inline-block rounded-lg bg-zinc-100 px-4 py-2 text-sm text-zinc-800"
              }
            >
              {msg.text}
            </span>
          </li>
        ))}
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
        />
        <button
          type="submit"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
        >
          Send
        </button>
      </form>
    </div>
  );
}
