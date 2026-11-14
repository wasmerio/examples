import { useState } from "react";
import { Starter, Card, Title, Text, Badge, Stack, Action } from "./ui";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Starter><Card>
      <Stack slot="header"><Badge>Vite + React</Badge><Title>Your React app is live on Wasmer Edge</Title></Stack>
      <Text>
        This single-page app is built with Vite and served as static files from Wasmer Edge. Edit{" "}
        <code>src/App.tsx</code> and push to redeploy.
      </Text>
      <ul>
        <li>React 19 with TypeScript</li>
        <li>
          <code>npm run build</code> writes the site to <code>dist/</code>
        </li>
        <li>No server to run: Wasmer serves the built files</li>
      </ul>
      <Stack>
        <Action type="button" onClick={() => setCount((value) => value + 1)}>
          Clicked {count} {count === 1 ? "time" : "times"}
        </Action>
        <Action variant="outline" href="https://docs.wasmer.io/edge" target="_blank">
          Wasmer Edge docs
        </Action>
      </Stack>
      <Text slot="footer">Vite + React starter for Wasmer Edge</Text>
    </Card></Starter>
  );
}

export default App;
