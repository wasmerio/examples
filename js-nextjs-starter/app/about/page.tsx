import { Badge, Title, Text, Stack, Action } from "../ui";

export const metadata = { title: "About · Next.js on Wasmer Edge" };

export default function About() {
  return (
    <>
      <Stack slot="header"><Badge>Next.js</Badge><Title>About this starter</Title></Stack>
      <Text>
        Every folder in <code>app/</code> with a <code>page.tsx</code> becomes a route. This page lives at{" "}
        <code>app/about/page.tsx</code>.
      </Text>
      <Stack>
        <Action variant="outline" href="/">
          Back home
        </Action>
        <Action variant="outline" href="https://docs.wasmer.io/edge" target="_blank">
          Wasmer Edge docs
        </Action>
      </Stack>
    </>
  );
}
