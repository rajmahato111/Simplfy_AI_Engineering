import { PageHero } from "@/components/page-hero";
import { TutorChatShell } from "@/components/tutor-chat-shell";

export default function TutorPage() {
  return (
    <>
      <PageHero
        eyebrow="Coach"
        title="AI tutor"
        description="Grounded, cited Q&A over the corpus — answers link to chapters, questions, and glossary entries."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <TutorChatShell />
      </div>
    </>
  );
}
