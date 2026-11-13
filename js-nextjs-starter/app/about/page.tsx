import Link from "next/link";

export const metadata = { title: "About · Next.js on Wasmer Edge" };

export default function About() {
  return (
    <>
      <span className="badge">Next.js</span>
      <h1>About this starter</h1>
      <p>
        Every folder in <code>app/</code> with a <code>page.tsx</code> becomes a route. This page lives at{" "}
        <code>app/about/page.tsx</code>.
      </p>
      <div className="actions">
        <Link className="button secondary" href="/">
          Back home
        </Link>
        <a className="button secondary" href="https://docs.wasmer.io/edge" target="_blank" rel="noreferrer">
          Wasmer Edge docs
        </a>
      </div>
    </>
  );
}
