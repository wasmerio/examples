// GENERATED from src/components/sections/WhatChanges.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import { cx } from '@/lib/cx';
import { sx } from '@/lib/sx';
import { Fragment } from 'react';
import home from '@/content/pages/home.json';

export default function WhatChanges() {
  const { changes } = home;
  const [queue, handover, overnight, ninety] = changes.cards;

  return (
    <>
      <section className="changes" id="what-changes" data-fx="horizontal-track">
        <div className="changes-stage">
          <div className="title-row">
            <div className="changes-title">
              <p className="t-eyebrow">{changes.eyebrow}</p>
              <h2 className="t-h2 balance">{changes.title}</h2>
            </div>
          </div>
          <div className="changes-viewport">
            <div className="changes-track">
              {changes.cards.map((card, i) => (
                <article key={i} className="changes-card">
                  <h3 className="t-h4">{card.title}</h3>
                  <div className="scene">
                    <img className="scene-bg" src={card.image} alt={card.imageAlt} width="1000" height="681" loading="lazy" />
                    {i === 0 && (
                      <div className="changes-panel changes-panel--queue">
                        <div className="changes-head"><p className="mono-s grow">{queue.panel.label}</p><p className="mono-s">{queue.panel.status}</p></div>
                        <div className="count">
                          <p className="count-value">{queue.panel.count}</p>
                          <p className="count-compare">{queue.panel.compare}</p>
                        </div>
                        <div className="week" aria-hidden="true">
                          {queue.panel.bars.map((h, d) => <span key={d} className={cx(['day', { today: d === queue.panel.bars.length - 1 }])} style={sx(`height:${h}px`)} />)}
                        </div>
                      </div>
                    )}
                    {i === 1 && (
                      <div className="changes-panel changes-panel--handover">
                        <div className="changes-head"><p className="mono-s grow">{handover.panel.label}</p><p className="mono-s">{handover.panel.status}</p></div>
                        <div className="message">
                          <p className="changes-quote">{handover.panel.message}</p>
                          <div className="tags">{handover.panel.tags.map((t, index) => <span key={index} className="pill">{t}</span>)}</div>
                        </div>
                        <div className="route"><p className="mono-m grow">{handover.panel.route}</p><p className="mono-m white">{handover.panel.to}</p></div>
                      </div>
                    )}
                    {i === 2 && (
                      <div className="changes-panel changes-panel--overnight">
                        <div className="changes-head"><p className="mono-s grow">{overnight.panel.label}</p><p className="mono-s">{overnight.panel.status}</p></div>
                        <div className="ends"><p className="mono-m">{overnight.panel.start}</p><p className="mono-m">{overnight.panel.end}</p></div>
                        <div className="timeline" aria-hidden="true"><span className="base"></span><span className="elapsed"></span><span className="halo"></span><span className="sent"></span></div>
                        <div className="message message--tight">
                          <p className="changes-quote">{overnight.panel.message}</p>
                          <div className="source"><p className="mono-m grow">{overnight.panel.source}</p><p className="mono-m white">{overnight.panel.time}</p></div>
                        </div>
                      </div>
                    )}
                    {i === 3 && (
                      <div className="changes-panel changes-panel--ninety">
                        <div className="changes-head"><p className="mono-s grow">{ninety.panel.label}</p><p className="mono-s">{ninety.panel.status}</p></div>
                        <div className="faces">
                          {ninety.panel.avatars.map((src, a) => <img key={a} className="face" src={src} alt={`Support team member ${a + 1}`} width="32" height="32" loading="lazy" style={sx(`left:${a * 27}px`)} />)}
                        </div>
                        <div className="changes-rows">
                          {ninety.panel.rows.map((r, n) => (
                            <Fragment key={n}>
                              {n > 0 && <span className="changes-divider" />}
                              <div className="changes-row"><p className="row-label">{r.label}</p><p className="row-value">{r.value}</p></div>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="t-body-m changes-desc">{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
