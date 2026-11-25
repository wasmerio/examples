// GENERATED from src/components/sections/LegalPage.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.


interface Props {
  content: {
    eyebrow: string;
    title: string;
    updated: string;
    intro: string;
    sections: { title: string; body: string }[];
  };
}

export default function LegalPage({ content }: Props) {
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <>
      <section className="legal-top">
        <div className="legal-title">
          <p className="t-eyebrow">{content.eyebrow}</p>
          <h1 className="t-h1 balance">{content.title}</h1>
        </div>
        <p className="t-body-s updated">{content.updated}</p>
      </section>
      <section className="legal-body">
        <div className="column">
          <p className="t-body-m">{content.intro}</p>
          {content.sections.map((s, i) => (
            <div key={i} className="block">
              <h2 className="t-h4 balance">{pad(i + 1)} — {s.title}</h2>
              <p className="t-body-m">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
