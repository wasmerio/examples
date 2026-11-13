import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <span className="badge">Vite + React</span>
      <h1>Your React app is live on Wasmer Edge</h1>
      <p>
        This single-page app is built with Vite and served as static files from Wasmer Edge. Edit{" "}
        <code>src/App.tsx</code> and push to redeploy.
      </p>
      <ul>
        <li>React 19 with TypeScript</li>
        <li>
          <code>npm run build</code> writes the site to <code>dist/</code>
        </li>
        <li>No server to run: Wasmer serves the built files</li>
      </ul>
      <div className="actions">
        <button type="button" onClick={() => setCount((value) => value + 1)}>
          Clicked {count} {count === 1 ? "time" : "times"}
        </button>
        <a className="button secondary" href="https://docs.wasmer.io/edge" target="_blank" rel="noreferrer">
          Wasmer Edge docs
        </a>
      </div>
      <footer>Vite + React starter for Wasmer Edge</footer>
    </main>
  );
}

export default App;
