<script lang="ts">
  let { workerUrl, recipientEmail = 'hello@example.com', senderEmail = 'noreply@example.com' } = $props();

  let name = $state('');
  let email = $state('');
  let message = $state('');
  let honeypot = $state('');
  let turnstileToken = $state('');
  let status = $state('idle'); // idle | loading | success | error
  let errorMsg = $state('');
  let retryAfter = $state(0);
  let turnstileContainer: HTMLDivElement;

  // Countdown timer
  $effect(() => {
    if (retryAfter <= 0) return;
    const id = setInterval(() => { retryAfter = Math.max(0, retryAfter - 1); }, 1000);
    return () => clearInterval(id);
  });

  // Load Turnstile
  $effect(() => {
    if (typeof window === 'undefined' || !turnstileContainer) return;
    let script: HTMLScriptElement | null = null;
    const sitekey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA';

    function init() {
      if (!window.turnstile || !turnstileContainer) return;
      window.turnstile.render(turnstileContainer, {
        sitekey,
        theme: 'dark',
        callback: (token: string) => { turnstileToken = token; },
        'error-callback': () => {
          turnstileToken = '';
          status = 'error';
          errorMsg = 'Anti-spam check failed. Please refresh.';
        },
        'timeout-callback': () => {
          turnstileToken = '';
          status = 'error';
          errorMsg = 'Anti-spam check timed out. Please refresh.';
        },
      });
    }

    if (document.getElementById('turnstile-script')) {
      init();
    } else {
      script = document.createElement('script');
      script.id = 'turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = init;
      document.head.appendChild(script);
    }
    return () => {
      if (script && script.parentNode) script.parentNode!.removeChild(script);
    };
  });

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      status = 'error';
      errorMsg = 'Please fill in all required fields.';
      return;
    }
    if (!turnstileToken) {
      status = 'error';
      errorMsg = 'Please complete the anti-spam check.';
      return;
    }
    status = 'loading';
    errorMsg = '';
    retryAfter = 0;
    try {
      const res = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipientEmail,
          from: senderEmail,
          subject: `New message from ${name}`,
          text: `From: ${name} <${email}>\n\n${message}`,
          replyTo: email,
          website: honeypot,
          turnstileToken,
        }),
      });
      const data = await res.json();
      if (res.status === 429) {
        const secs = data.retryAfterSeconds || 900;
        retryAfter = secs;
        const m = Math.floor(secs / 60);
        const s = (secs % 60).toString().padStart(2, '0');
        status = 'error';
        errorMsg = `Rate limit: max 2 messages per 15 minutes. Try again in ${m}m ${s}s.`;
        return;
      }
      if (!data.ok) {
        status = 'error';
        errorMsg = data.error || 'Something went wrong while sending.';
        return;
      }
      status = 'success';
      name = '';
      email = '';
      message = '';
      honeypot = '';
      turnstileToken = '';
      if (typeof window !== 'undefined' && window.turnstile && turnstileContainer) {
        window.turnstile.reset(turnstileContainer);
      }
    } catch (err) {
      status = 'error';
      errorMsg = err instanceof Error ? err.message : 'Unable to reach the server.';
    }
  }
</script>

<div class="mx-auto px-6 py-20 pb-32 max-w-2xl">
  <h1
    class="font-display font-light text-text-secondary tracking-tight"
    data-od-id="headline"
  >
    Contact
  </h1>
  <p
    class="mt-3 mb-10 max-w-[480px] font-sans text-text-primary text-base"
    data-od-id="subhead"
  >
    Have a project in mind or just want to say hello? Drop a note and we'll get back to you.
  </p>

  <div
    class="bg-gradient-to-b from-white/8 to-white/1 p-1 rounded-lg"
    data-od-id="form-card"
  >
    <div class="bg-surface-card shadow-surface p-8 md:p-10 rounded-md">
      {#if status === 'success'}
        <div class="text-center py-8">
          <p class="text-base font-light text-primary">Message sent. Thank you!</p>
          <a
            href="/"
            class="mt-6 inline-flex items-center gap-2 btn-fill-primary px-7 py-3.5 border border-white/15 rounded-sm font-medium text-text-secondary hover:text-background text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer btn btn-primary btn-fill"
          >
            Back to home
          </a>
        </div>
      {:else}
        <form onsubmit={handleSubmit} class="flex flex-col gap-6" novalidate>
          <input
            type="text"
            name="website"
            aria-hidden="true"
            tabindex="-1"
            autocomplete="off"
            class="absolute opacity-0 -left-[9999px]"
            bind:value={honeypot}
          />

          <div class="flex flex-col gap-2">
            <label
              for="name"
              class="font-medium text-text-primary text-xs uppercase tracking-widest"
            >Name</label>
            <input
              type="text"
              id="name"
              bind:value={name}
              placeholder="Your name"
              required
              disabled={status === 'loading'}
              class="bg-white/3 px-4 py-3.5 border border-white/8 focus:border-primary rounded-sm focus:outline-none w-full font-sans text-text-secondary placeholder:text-text-primary/25 text-base transition-colors duration-200"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label
              for="email"
              class="font-medium text-text-primary text-xs uppercase tracking-widest"
            >Email</label>
            <input
              type="email"
              id="email"
              bind:value={email}
              placeholder="you@example.com"
              required
              disabled={status === 'loading'}
              class="bg-white/3 px-4 py-3.5 border border-white/8 focus:border-primary rounded-sm focus:outline-none w-full font-sans text-text-secondary placeholder:text-text-primary/25 text-base transition-colors duration-200"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label
              for="message"
              class="font-medium text-text-primary text-xs uppercase tracking-widest"
            >Message</label>
            <textarea
              id="message"
              bind:value={message}
              placeholder="What's on your mind?"
              required
              rows="6"
              disabled={status === 'loading'}
              class="bg-white/3 px-4 py-3.5 border border-white/8 focus:border-primary rounded-sm focus:outline-none w-full min-h-[160px] font-sans text-text-secondary placeholder:text-text-primary/25 text-base leading-relaxed transition-colors duration-200 resize-y"
            ></textarea>
          </div>

          <!-- Cloudflare Turnstile -->
          <div bind:this={turnstileContainer}></div>

          {#if status === 'error' && errorMsg}
            <p class="text-sm font-light text-red-400">
              {#if retryAfter > 0}
                Rate limit: max 2 messages per 15 minutes. Try again in {Math.floor(retryAfter / 60)}m {(retryAfter % 60).toString().padStart(2, '0')}s.
              {:else}
                {errorMsg}
              {/if}
            </p>
          {/if}

          <button
            type="submit"
            disabled={status === 'loading'}
            class="inline-flex items-center gap-2 btn-fill-primary px-7 py-3.5 border border-white/15 rounded-sm font-medium text-text-secondary hover:text-background text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer btn btn-primary btn-fill"
          >
            {status === 'loading' ? 'Sending...' : 'Send message'}
          </button>
        </form>
      {/if}
    </div>
  </div>
</div>
