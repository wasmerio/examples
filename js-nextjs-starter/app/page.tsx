import Link from "next/link";
import Counter from "./counter";

export default function Home() {
  return (
    <>
      <span className="badge">Next.js</span>
      <h1>Your Next.js app is live on Wasmer Edge</h1>
      <p>
        This App Router project is exported to static HTML at build time and served from Wasmer Edge. Edit{" "}
        <code>app/page.tsx</code> and push to redeploy.
      </p>
      <ul>
        <li>Next.js App Router with TypeScript</li>
        <li>
          <code>output: &quot;export&quot;</code> writes the site to <code>out/</code>
        </li>
        <li>Client components still work in the browser</li>
      </ul>
      <div className="actions">
        <Counter />
        <Link className="button secondary" href="/about/">
          About this starter
        </Link>
      </div>
    </>
  );
}
