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

        return new Response(<<<HTML
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Symfony on Wasmer Edge</title>
                <style>body{margin:0}ul{margin:0;padding-left:24px}</style>
                <script type="module" src="/starter-ui.js"></script>
              </head>
              <body>
                <wasmer-starter><wasmer-card>
                  <wasmer-stack slot="header" vertical><wasmer-badge>Symfony</wasmer-badge><wasmer-title>Your Symfony app is live on Wasmer Edge</wasmer-title></wasmer-stack>
                  <wasmer-text>This page comes from <code>src/Controller/HomeController.php</code>. Edit it and push to redeploy.</wasmer-text>
                  <wasmer-text><ul>
                    <li>Symfony {$symfony} on PHP {$php}</li>
                    <li>Attribute routing in <code>src/Controller/</code></li>
                    <li>A JSON endpoint at <code>/api/hello</code></li>
                  </ul></wasmer-text>
                  <wasmer-stack><wasmer-action href="/api/hello">Try the API</wasmer-action><wasmer-action variant="outline" href="https://docs.wasmer.io/edge">Wasmer Edge docs</wasmer-action></wasmer-stack>
                  <wasmer-text slot="footer">Symfony starter for Wasmer Edge</wasmer-text>
                </wasmer-card></wasmer-starter>
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
