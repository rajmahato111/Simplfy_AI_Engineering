import { PageHero } from "@/components/page-hero";
import { TutorChatShell } from "@/components/tutor-chat-shell";
import { isLlmConfigured } from "@/lib/llm";

export default function TutorPage() {
  const llm = isLlmConfigured();
  return (
    <>
      <PageHero
        eyebrow="Coach"
        title="AI tutor"
        description={
          llm
            ? "Grounded Q&A with corpus citations — Claude answers when ANTHROPIC_API_KEY is set."
            : "Grounded, cited Q&A over the corpus — answers link to chapters, questions, and glossary entries."
        }
      />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {llm && (
          <p className="mb-4 text-center text-xs font-medium text-brand">AI-powered · corpus-grounded</p>
        )}
        <TutorChatShell />
      </div>
    </>
  );
}
