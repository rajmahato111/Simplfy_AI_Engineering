function StubPage({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-slate-600">{blurb}</p>
    </div>
  );
}

export default function MockPage() {
  return (
    <StubPage
      title="Mock Interview"
      blurb="AI system-design mock with rubric scorecard — PRD E4, Phase P3."
    />
  );
}
