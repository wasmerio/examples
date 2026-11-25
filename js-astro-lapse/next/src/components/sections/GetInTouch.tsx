// GENERATED from src/components/sections/GetInTouch.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import contact from '@/content/pages/contact.json';
import ContactSubmit from '@/components/ui/ContactSubmit';

export default function GetInTouch() {
  const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT || undefined;
  const { form, email, phone, next } = contact;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <>
      <section className="get-in-touch">
        <form className="form" action={endpoint} method="post" data-fx="contact-form">
          {form.fields.map((f, index) => (
            <label key={index} className="field">
              <span className="t-eyebrow field-label">{f.label}</span>
              {f.type === 'textarea' ? (
                <textarea className="input textarea" name={f.name} placeholder={f.placeholder} required={f.required}></textarea>
              ) : (
                <input className="input" type={f.type} name={f.name} placeholder={f.placeholder} required={f.required} autoComplete={f.autocomplete} />
              )}
            </label>
          ))}

          <input className="trap" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <ContactSubmit labels={form.submit} />
          <p className="t-body-s">{form.note}</p>
        </form>
        <div className="aside">
          {[email, phone].map((c, index) => (
            <a key={index} className="touch-card contact-card" href={c.href}>
              <span className="t-eyebrow">{c.label}</span>
              <span className="t-label value">{c.value}</span>
            </a>
          ))}
          <div className="touch-card next">
            <h2 className="t-label value balance">{next.title}</h2>
            <ol className="touch-rows">
              {next.steps.map((s, i) => (
                <li key={i} className="step">
                  <span className="t-eyebrow touch-num">{pad(i + 1)}</span>
                  <span className="t-body-s step-copy">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
