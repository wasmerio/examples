// GENERATED from src/components/sections/ComparePlans.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import { cx } from '@/lib/cx';
import page from '@/content/pages/pricing.json';
import Icon from '@/components/ui/Icon';

type Cell = string | boolean | { monthly: string; annual: string };

export default function ComparePlans() {
  const { compare } = page;

  return (
    <>
      <section className="compare" id="compare">
        <div className="compare-title">
          <p className="t-eyebrow">{compare.eyebrow}</p>
          <h2 className="t-h2 balance">{compare.title}</h2>
        </div>
        <div className="table" data-fx="plan-tabs" data-plan="starter">
          <div className="tabs-row below-desktop">
            <div className="tabs" role="group" aria-label={compare.tabsLabel}>
              {compare.columns.map((c, i) => (
                <button key={i} type="button" className="compare-tab" data-plan-tab={c.id} aria-pressed={i === 0 ? 'true' : 'false'}>
                  <span className="tab-pill" aria-hidden="true"></span>
                  <span className="compare-tab-label t-label">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="head-row desktop-only">
            <span className="head-backdrop" aria-hidden="true"></span>
            <p className="head-label t-eyebrow">{compare.headLabel}</p>
            {compare.columns.map((c, index) => <p key={index} className="head-col t-label">{c.label}</p>)}
          </div>
          {compare.groups.map((g, index) => (
            <div key={index} className="group">
              <div className="group-title"><p className="t-eyebrow">{g.title}</p></div>
              {g.rows.map((r, index) => (
                <div key={index} className="compare-row">
                  <p className="compare-label t-body-m">{r.label}</p>
                  {(r.cells as Cell[]).map((cell, i) => {
                    const col = compare.columns[i];
                    const cls = ['cell', `cell--${col.id}`];
                    if (cell === true) return (
                      <div key={i} className={cx([...cls, 'cell--tick'])}>
                        <span className="compare-tick"><Icon name="check" size={10} /></span>
                        <span className="sr-only">{col.label}: {compare.included}</span>
                      </div>
                    );
                    if (cell === false) return (
                      <p key={i} className={cx([...cls, 'cell--none', 't-body-s'])}><span aria-hidden="true">—</span><span className="sr-only">{col.label}: {compare.notIncluded}</span></p>
                    );
                    if (typeof cell === 'object') return (
                      <p key={i} className={cx([...cls, 't-body-s'])} data-price-monthly={cell.monthly} data-price-annual={cell.annual}>{cell.monthly}</p>
                    );
                    return <p key={i} className={cx([...cls, 't-body-s'])}>{cell}</p>;
                  })}
                </div>
              ))}
            </div>
          ))}
          <div className="footnote">
            <p className="t-body-s">{compare.footnote}</p>
          </div>
        </div>
      </section>
    </>
  );
}
