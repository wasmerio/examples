// GENERATED from src/components/sections/AboutTeam.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import { cx } from '@/lib/cx';
import about from '@/content/pages/about.json';

export default function AboutTeam() {
  const { team } = about;

  return (
    <>
      <section className="about-team">
        <div className="about-team-title">
          <p className="t-eyebrow">{team.eyebrow}</p>
          <h2 className="t-h2 balance">{team.title}</h2>
        </div>
        <div className="team" data-fx="team-switch">
          <div className="names" role="group" aria-label={team.eyebrow}>
            {team.people.map((p, i) => (
              <button key={i} type="button" className={cx(['name-row', { 'is-active': i === 0 }])} data-index={i} aria-pressed={i === 0 ? 'true' : 'false'}>
                <span className="marker" aria-hidden="true"></span>
                <span className="t-label about-team-name">{p.name}</span>
              </button>
            ))}
          </div>
          <div className="about-team-viewport">
            <div className="cards" id="about-team-track">
              {team.people.map((p, i) => (
                <div key={i} className={cx(['about-team-card', { 'is-active': i === 0 }])} data-index={i}>
                  <div className="about-team-photo">
                    <img src={p.photo.src} alt={p.photo.alt} width="1056" height="1482" loading="lazy" />
                  </div>
                  <div className="veil" aria-hidden="true">
                    <span className="blur blur-1"></span>
                    <span className="blur blur-2"></span>
                    <span className="blur blur-3"></span>
                    <span className="tint"></span>
                  </div>
                  <div className="meta">
                    <p className="t-label">{p.name}</p>
                    <p className="t-eyebrow">{p.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
