function StubPage({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-slate-600">{blurb}</p>
    </div>
  );
}

export default function PracticePage() {
  return (
    <StubPage
      title="Practice"
      blurb="Guided SPIDER walkthroughs with checkpoint feedback — PRD E3, Phase P2."
    />
  );
}
