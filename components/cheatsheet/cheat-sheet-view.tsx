import type { CheatSheet } from "@/lib/cheatsheet-schema";
import { MethodCard } from "@/components/cheatsheet/method-card";
import { CompareTable } from "@/components/cheatsheet/compare-table";
import { IconCallout } from "@/components/cheatsheet/icon-callout";
import { WorkedExample } from "@/components/cheatsheet/worked-example";
import { QuestionList } from "@/components/cheatsheet/question-list";
import { IconList } from "@/components/cheatsheet/icon-list";
import { ChecklistBox } from "@/components/cheatsheet/checklist-box";
import { TakeawayList } from "@/components/cheatsheet/takeaway-list";
import { DecisionTree } from "@/components/cheatsheet/decision-tree";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="mb-3 text-lg font-semibold text-zinc-900">{title}</h2>
      {children}
    </section>
  );
}

export function CheatSheetView({ data }: { data: CheatSheet }) {
  return (
    <div className="pb-12">
      {data.subtitle && <p className="mb-6 text-sm text-zinc-500">{data.subtitle}</p>}

      <Section title="At a glance">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.methodCards.map((card) => (
            <MethodCard key={card.id} card={card} />
          ))}
        </div>
      </Section>

      <Section title="Side-by-side comparison">
        <CompareTable table={data.compareTable} />
      </Section>

      <Section title="When to choose what">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.whenToChoose.map((item, i) => (
            <IconCallout key={i} {...item} />
          ))}
        </div>
      </Section>

      {data.workedExample && (
        <Section title="Worked example">
          <WorkedExample example={data.workedExample} />
        </Section>
      )}

      {data.coreIntuition && (
        <Section title="Core intuition">
          <IconCallout icon="lightbulb" heading={data.coreIntuition.heading} body={data.coreIntuition.body} color="amber" />
        </Section>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Section title="Common interview questions">
          <QuestionList items={data.interviewQuestions} />
        </Section>

        <Section title="Production considerations">
          <IconList items={data.productionConsiderations} />
        </Section>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Section title="How to evaluate">
          <ChecklistBox items={data.checklist} />
        </Section>

        <Section title="Key takeaways">
          <TakeawayList items={data.keyTakeaways} />
        </Section>
      </div>

      {data.decisionTree && (
        <Section title="Decision framework">
          <DecisionTree tree={data.decisionTree} />
        </Section>
      )}
    </div>
  );
}
