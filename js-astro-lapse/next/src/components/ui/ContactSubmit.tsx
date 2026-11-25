// GENERATED from src/components/ui/ContactSubmit.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.


interface Props {
  labels: { idle: string; sending: string; success: string; error: string };
}

export default function ContactSubmit({ labels }: Props) {
  return (
    <>
      <button
        type="submit"
        className="submit"
        data-state="idle"
        data-label-idle={labels.idle}
        data-label-sending={labels.sending}
        data-label-success={labels.success}
        data-label-error={labels.error}
      >
        <span className="submit-glow-wrap" aria-hidden="true"><span className="submit-glow"></span></span>
        <span className="submit-surface" aria-hidden="true"></span>
        <span className="submit-label t-body-m" aria-live="polite">{labels.idle}</span>
      </button>
    </>
  );
}
