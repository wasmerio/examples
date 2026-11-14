import Counter from "./counter";
import { Badge, Title, Text, Stack, Action } from "./ui";

export default function Home() {
  return (
    <>
      <Stack slot="header"><Badge>Next.js</Badge><Title>Your Next.js app is live on Wasmer Edge</Title></Stack>
      <Text>
        This App Router project is exported to static HTML at build time and served from Wasmer Edge. Edit{" "}
        <code>app/page.tsx</code> and push to redeploy.
      </Text>
      <ul>
        <li>Next.js App Router with TypeScript</li>
        <li>
          <code>output: &quot;export&quot;</code> writes the site to <code>out/</code>
        </li>
        <li>Client components still work in the browser</li>
      </ul>
      <Stack>
        <Counter />
        <Action variant="outline" href="/about/">
          About this starter
        </Action>
      </Stack>
    </>
  );
}
