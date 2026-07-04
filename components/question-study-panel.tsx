"use client";

import { useState } from "react";

type Props = {
  strongAnswerCovers: string[];
  sampleAnswerExcerpt?: string;
  sampleAnswerMd?: string;
};

export function QuestionStudyPanel({
  strongAnswerCovers,
  sampleAnswerExcerpt,
  sampleAnswerMd,
}: Props) {
  const [revealed, setRevealed] = useState(false);
  const sampleText = sampleAnswerMd ?? sampleAnswerExcerpt;

  return (
    <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-zinc-900">Study mode</h2>
      <p className="mt-2 text-sm text-zinc-600">
        Strong answers stay hidden until you reveal them — same as a real interview debrief.
      </p>
      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
        >
          Reveal strong answer
        </button>
      ) : (
        <div className="mt-4 space-y-4">
          {strongAnswerCovers.length > 0 ? (
            <>
              <h3 className="text-sm font-semibold text-zinc-900">Strong answer covers</h3>
              <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-700">
                {strongAnswerCovers.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-zinc-600">No bullet rubric for this question yet.</p>
          )}
          {sampleText && (
            <>
              <h3 className="text-sm font-semibold text-zinc-900">
                {sampleAnswerMd ? "Sample answer" : "Sample excerpt"}
              </h3>
              {sampleAnswerMd ? (
                <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-700">
                  {sampleAnswerMd}
                </pre>
              ) : (
                <p className="text-sm italic text-zinc-600">{sampleAnswerExcerpt}</p>
              )}
            </>
          )}
          <button
            type="button"
            onClick={() => setRevealed(false)}
            className="text-sm font-medium text-brand hover:underline"
          >
            Hide again
          </button>
        </div>
      )}
    </section>
  );
}
