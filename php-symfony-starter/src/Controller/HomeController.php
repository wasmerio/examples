<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Routing\Attribute\Route;

final class HomeController
{
    #[Route('/', name: 'home')]
    public function index(): Response
    {
        $symfony = Kernel::VERSION;
        $php = PHP_VERSION;
        $css = file_get_contents(__DIR__.'/../../public/starter.css');

        return new Response(<<<HTML
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Symfony on Wasmer Edge</title>
                <style>{$css}</style>
              </head>
              <body>
                <main>
                  <span class="badge">Symfony</span>
                  <h1>Your Symfony app is live on Wasmer Edge</h1>
                  <p>This page comes from <code>src/Controller/HomeController.php</code>. Edit it and push to redeploy.</p>
                  <ul>
                    <li>Symfony {$symfony} on PHP {$php}</li>
                    <li>Attribute routing in <code>src/Controller/</code></li>
                    <li>A JSON endpoint at <a href="/api/hello"><code>/api/hello</code></a></li>
                  </ul>
                  <div class="actions">
                    <a class="button primary" href="/api/hello">Try the API</a>
                    <a class="button secondary" href="https://docs.wasmer.io/edge" target="_blank" rel="noreferrer">Wasmer Edge docs</a>
                  </div>
                  <footer>Symfony starter for Wasmer Edge</footer>
                </main>
              </body>
            </html>
            HTML);
    }

    #[Route('/api/hello', name: 'api_hello')]
    public function hello(): JsonResponse
    {
        return new JsonResponse([
            'message' => 'Hello from Symfony on Wasmer Edge',
            'symfony' => Kernel::VERSION,
            'php' => PHP_VERSION,
        ]);
    }
}
