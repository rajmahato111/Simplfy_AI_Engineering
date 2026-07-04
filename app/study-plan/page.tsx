import { PageHero } from "@/components/page-hero";
import { StudyPlanForm } from "@/components/study-plan-form";

const ROLES = ["ai-engineer", "senior-ai-engineer", "ml-engineer", "ai-pm"];

export default function StudyPlanPage() {
  return (
    <>
      <PageHero
        eyebrow="Coach"
        title="Study plan"
        description="A weekly reading and question schedule from available corpus — expands as content ships."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <StudyPlanForm roles={ROLES} />
      </div>
    </>
  );
}
