// GENERATED from src/components/sections/Plans.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import { cx } from '@/lib/cx';
import { sx } from '@/lib/sx';
import plans from '@/content/plans.json';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

interface Props { className?: string; nameTag?: 'h2' | 'h3'; }

export default function Plans({ className: cls, nameTag = 'h2' }: Props) {
  const Name = nameTag;
  const { toggle } = plans;

  return (
    <>
      <div className={cx(['plans', cls])} data-fx="billing-toggle" data-billing-state="monthly">
        <div className="plans-toggle" role="group" aria-label={toggle.label}>
          <button type="button" className="plans-tab" data-billing="monthly" aria-pressed="true">
            <span className="tab-bg" aria-hidden="true"></span>
            <span className="plans-tab-label t-label">{toggle.monthly}</span>
          </button>
          <button type="button" className="plans-tab" data-billing="annual" aria-pressed="false">
            <span className="tab-bg" aria-hidden="true"></span>
            <span className="plans-tab-label t-label">{toggle.annual}</span>
            <span className="save"><span className="save-pill"><span className="pill-text">{toggle.save}</span></span></span>
          </button>
        </div>

        <div className="tiers">
          {plans.plans.map((plan, i) => (
            <article key={i}
              className={cx(['plans-card', `plans-card--${plan.id}`, { 'plans-card--featured': plan.featured }])}
              data-fx={plan.featured ? undefined : 'appear'}
              style={sx(plan.featured ? undefined : `--appear-delay: ${i === 0 ? 0 : 0.08}s`)}
            >
              {plan.featured && (
                <div className="glows" aria-hidden="true">
                  <span className="plans-glow plans-glow--right"></span>
                  <span className="plans-glow plans-glow--left"></span>
                  <span className="plans-glow plans-glow--centre"></span>
                </div>
              )}
              <div className="plans-head">
                <Name className={cx(['t-h4', { balance: nameTag === 'h2' }])}>{plan.name}</Name>
                {plan.badge && <p className="plans-badge"><span className="pill-text">{plan.badge}</span></p>}
              </div>
              <p className="plans-description t-body-m">{plan.description}</p>
              <div className="price">
                <p
                  className="amount t-num"
                  data-price-monthly={plan.price.monthly !== plan.price.annual ? plan.price.monthly : undefined}
                  data-price-annual={plan.price.monthly !== plan.price.annual ? plan.price.annual : undefined}
                >{plan.price.monthly}</p>
                <p className="unit t-eyebrow">{plan.unit}</p>
              </div>
              <div className="plans-divider" aria-hidden="true"></div>
              <ul className="features">
                {plan.features.map((f, index) => (
                  <li key={index} className="feature">
                    <span className="plans-tick" aria-hidden="true"><Icon name="check" size={10} /></span>
                    <span className="t-body-s">{f}</span>
                  </li>
                ))}
              </ul>
              <Button href={plan.button.href} variant={plan.button.variant as 'primary' | 'secondary'} className="card-btn">{plan.button.label}</Button>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
