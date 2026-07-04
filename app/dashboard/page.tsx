function StubPage({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-slate-600">{blurb}</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <StubPage
      title="Dashboard"
      blurb="Progress, readiness, and study plan — PRD E8, Phase P1–P2."
    />
  );
}
