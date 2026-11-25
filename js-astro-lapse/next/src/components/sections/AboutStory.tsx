// GENERATED from src/components/sections/AboutStory.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import about from '@/content/pages/about.json';

export default function AboutStory() {
  const { story } = about;

  return (
    <>
      <section className="about-story">
        <div className="about-story-title">
          <p className="t-eyebrow">{story.eyebrow}</p>
          <h2 className="t-h2 balance">{story.title}</h2>
        </div>
        <div className="about-story-body t-body-m">
          {story.body.map((p, index) => <p key={index}>{p}</p>)}
        </div>
      </section>
    </>
  );
}
