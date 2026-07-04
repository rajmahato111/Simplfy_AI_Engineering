function StubPage({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-slate-600">{blurb}</p>
    </div>
  );
}

export default function QuestionsPage() {
  return (
    <StubPage
      title="Questions"
      blurb="116-question bank with practice and study modes — PRD E2, Phase P1."
    />
  );
}
