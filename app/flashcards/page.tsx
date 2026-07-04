import { PageHero } from "@/components/page-hero";
import { FlashcardsDeck } from "@/components/flashcards-deck";
import { listGlossaryTerms } from "@/lib/glossary";

export default function FlashcardsPage() {
  const terms = listGlossaryTerms()
    .slice()
    .sort((a, b) => a.term.localeCompare(b.term))
    .slice(0, 20)
    .map((t) => ({ id: t.id, term: t.term, definition: t.definition }));

  return (
    <>
      <PageHero
        eyebrow="Review"
        title="Flashcards"
        description="Flip through glossary terms — spaced repetition scheduling ships next."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <FlashcardsDeck terms={terms} />
      </div>
    </>
  );
}
