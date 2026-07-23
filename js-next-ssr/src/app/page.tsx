export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      <h1>Hello from Next.js on Wasmer Edge!</h1>
      <p>
        This page is server-side rendered by the Next.js standalone server
        running on EdgeJS. Rendered at: {new Date().toISOString()}
      </p>
    </main>
  );
}
