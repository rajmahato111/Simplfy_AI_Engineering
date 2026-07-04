import { PageHero } from "@/components/page-hero";
import { WhiteboardShell } from "@/components/whiteboard-shell";

export default function WhiteboardPage() {
  return (
    <>
      <PageHero
        eyebrow="Practice"
        title="System design whiteboard"
        description="Sketch architectures in text — AI critique when Claude is configured."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <WhiteboardShell />
      </div>
    </>
  );
}
