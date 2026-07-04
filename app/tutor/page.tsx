function StubPage({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-slate-600">{blurb}</p>
    </div>
  );
}

export default function TutorPage() {
  return (
    <StubPage
      title="Tutor"
      blurb="Grounded, cited Q&A over the corpus — PRD E6, Phase P2."
    />
  );
}
