import { join } from 'node:path';

/** Small CDP driver using Bun's native WebSocket; no browser package is required. */
export async function openChromium(executable: string, profile: string) {
  const log = Bun.file(join(profile, 'chrome-stderr.log'));
  const process = Bun.spawn(
    [
      executable,
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--remote-debugging-port=0',
      `--user-data-dir=${profile}`,
      'about:blank',
    ],
    { stdout: 'ignore', stderr: log },
  );
  try {
    let endpoint: string | undefined;
    for (let attempt = 0; !endpoint; attempt++) {
      const stderr = await Bun.file(join(profile, 'chrome-stderr.log')).text();
      endpoint = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/)?.[1];
      if (attempt >= 100)
        throw new Error('Chromium did not open a debugging port: ' + stderr);
      if (!endpoint) await Bun.sleep(50);
    }
    const socket = new WebSocket(endpoint);
    await new Promise<void>((resolve, reject) => {
      socket.addEventListener('open', () => resolve(), { once: true });
      socket.addEventListener('error', reject, { once: true });
    });
    let sequence = 0;
    const pending = new Map<
      number,
      { resolve: (result: any) => void; reject: (error: Error) => void }
    >();
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      const request = pending.get(message.id);
      if (!request) return;
      pending.delete(message.id);
      if (message.error) request.reject(new Error(message.error.message));
      else request.resolve(message.result);
    });
    function send(
      method: string,
      params: object = {},
      sessionId?: string,
    ): Promise<any> {
      const id = ++sequence;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params, sessionId }));
      });
    }
    const { targetId } = await send('Target.createTarget', {
      url: 'about:blank',
    });
    const { sessionId } = await send('Target.attachToTarget', {
      targetId,
      flatten: true,
    });
    return {
      send: (method: string, params?: object) =>
        send(method, params, sessionId),
      async close() {
        socket.close();
        process.kill();
        await process.exited;
      },
    };
  } catch (error) {
    process.kill();
    throw error;
  }
}
