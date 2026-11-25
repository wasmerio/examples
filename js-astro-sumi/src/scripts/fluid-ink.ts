/*
 * <fluid-ink> — an incompressible fluid solver used as decoration.
 *
 * Adapted from the theme's design mockup. The solver itself is unchanged in
 * spirit — splat, vorticity confinement, Jacobi pressure solve, advection —
 * but it has been taught to work on paper as well as on ink:
 *
 *   • Colours come from CSS custom properties instead of attributes, so the
 *     simulation follows the theme tokens and re-reads them when the visitor
 *     switches between light and dark.
 *   • On a light background the dye is *subtracted* from the page colour, which
 *     is how ink actually behaves on washi. On a dark one it is added, as
 *     before. Which of the two applies is decided by the luminance of the
 *     background, so a custom palette needs no extra configuration.
 *   • It refuses to start when the visitor prefers reduced motion or the
 *     browser has no WebGL2, leaving the static fallback underneath visible.
 */

const VERTEX = `attribute vec2 aPos;varying vec2 vUv;void main(){vUv=aPos*.5+.5;gl_Position=vec4(aPos,0.,1.);}`;

const FRAGMENT = {
  splat: `precision highp float;varying vec2 vUv;uniform sampler2D uTarget;uniform float uAspect,uRadius;uniform vec2 uPoint;uniform vec3 uColor;void main(){vec2 p=vUv-uPoint;p.x*=uAspect;float s=exp(-dot(p,p)/uRadius);gl_FragColor=vec4(texture2D(uTarget,vUv).xyz+s*uColor,1.);}`,
  advect: `precision highp float;varying vec2 vUv;uniform sampler2D uVel,uSrc;uniform vec2 uTexel;uniform float uDt,uDiss;void main(){vec2 c=vUv-uDt*texture2D(uVel,vUv).xy*uTexel;gl_FragColor=uDiss*texture2D(uSrc,c);}`,
  divergence: `precision highp float;varying vec2 vUv;uniform sampler2D uVel;uniform vec2 uTexel;void main(){float L=texture2D(uVel,vUv-vec2(uTexel.x,0.)).x;float R=texture2D(uVel,vUv+vec2(uTexel.x,0.)).x;float B=texture2D(uVel,vUv-vec2(0.,uTexel.y)).y;float T=texture2D(uVel,vUv+vec2(0.,uTexel.y)).y;gl_FragColor=vec4(.5*(R-L+T-B),0.,0.,1.);}`,
  curl: `precision highp float;varying vec2 vUv;uniform sampler2D uVel;uniform vec2 uTexel;void main(){float L=texture2D(uVel,vUv-vec2(uTexel.x,0.)).y;float R=texture2D(uVel,vUv+vec2(uTexel.x,0.)).y;float B=texture2D(uVel,vUv-vec2(0.,uTexel.y)).x;float T=texture2D(uVel,vUv+vec2(0.,uTexel.y)).x;gl_FragColor=vec4(.5*(R-L-T+B),0.,0.,1.);}`,
  vorticity: `precision highp float;varying vec2 vUv;uniform sampler2D uVel,uCurl;uniform vec2 uTexel;uniform float uDt,uEps;void main(){float L=texture2D(uCurl,vUv-vec2(uTexel.x,0.)).x;float R=texture2D(uCurl,vUv+vec2(uTexel.x,0.)).x;float B=texture2D(uCurl,vUv-vec2(0.,uTexel.y)).x;float T=texture2D(uCurl,vUv+vec2(0.,uTexel.y)).x;float C=texture2D(uCurl,vUv).x;vec2 f=vec2(abs(T)-abs(B),abs(L)-abs(R));f/=length(f)+1e-4;f*=uEps*C;vec2 v=texture2D(uVel,vUv).xy+f*uDt;gl_FragColor=vec4(v,0.,1.);}`,
  pressure: `precision highp float;varying vec2 vUv;uniform sampler2D uPre,uDiv;uniform vec2 uTexel;void main(){float L=texture2D(uPre,vUv-vec2(uTexel.x,0.)).x;float R=texture2D(uPre,vUv+vec2(uTexel.x,0.)).x;float B=texture2D(uPre,vUv-vec2(0.,uTexel.y)).x;float T=texture2D(uPre,vUv+vec2(0.,uTexel.y)).x;float d=texture2D(uDiv,vUv).x;gl_FragColor=vec4((L+R+B+T-d)*.25,0.,0.,1.);}`,
  gradient: `precision highp float;varying vec2 vUv;uniform sampler2D uPre,uVel;uniform vec2 uTexel;void main(){float L=texture2D(uPre,vUv-vec2(uTexel.x,0.)).x;float R=texture2D(uPre,vUv+vec2(uTexel.x,0.)).x;float B=texture2D(uPre,vUv-vec2(0.,uTexel.y)).x;float T=texture2D(uPre,vUv+vec2(0.,uTexel.y)).x;vec2 v=texture2D(uVel,vUv).xy-.5*vec2(R-L,T-B);gl_FragColor=vec4(v,0.,1.);}`,
  /* uBlend is +1 on a dark page and -1 on a light one. The dither hides 8-bit
     banding in the gradient; paper needs less of it than a black page, where
     the same amplitude reads as grain. */
  display: `precision highp float;varying vec2 vUv;uniform sampler2D uDye;uniform vec3 uBg;uniform float uBlend,uVignette,uDither;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}void main(){vec3 d=texture2D(uDye,vUv).rgb;vec2 q=vUv-.5;float vig=1.-uVignette*dot(q,q);vec3 c=uBg*vig+uBlend*d;c+=(h(vUv*vec2(1441.,911.))-.5)*uDither;gl_FragColor=vec4(clamp(c,0.,1.),1.);}`,
} as const;

type ProgramName = keyof typeof FRAGMENT;
type Rgb = [number, number, number];

interface Fbo {
  texture: WebGLTexture;
  framebuffer: WebGLFramebuffer;
  width: number;
  height: number;
  texel: [number, number];
  attach(unit: number): number;
}

interface DoubleFbo {
  readonly read: Fbo;
  readonly write: Fbo;
  swap(): void;
  texel: [number, number];
  width: number;
  height: number;
}

interface Program {
  handle: WebGLProgram;
  use(): void;
  uniform(name: string): WebGLUniformLocation | null;
}

interface Splat {
  x: number;
  y: number;
  dx: number;
  dy: number;
  amount: number;
}

/** Rec. 709 relative luminance, used only to pick a blend direction. */
function luminance([r, g, b]: Rgb): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function parseCssColor(value: string, fallback: Rgb): Rgb {
  const match = value.match(/-?[\d.]+(e-?\d+)?/g);
  if (!match || match.length < 3) return fallback;
  const [r, g, b] = match.slice(0, 3).map(Number);
  // getComputedStyle returns rgb() in 0–255 for every browser we target.
  return [r / 255, g / 255, b / 255];
}

const random = (min: number, max: number) => min + Math.random() * (max - min);

class FluidInk extends HTMLElement {
  private frameHandle = 0;
  private startHandle = 0;
  private idle = false;
  private observers: { disconnect(): void }[] = [];
  private cleanups: (() => void)[] = [];
  private booted = false;

  connectedCallback(): void {
    if (this.booted) return;
    this.booted = true;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    // Creating the context and compiling nine shader programs is a few hundred
    // milliseconds of main-thread work on a slow device. On the critical path
    // that dominates LCP, so wait for the page to settle first — the static
    // gradient underneath is already painted.
    // Safari only shipped requestIdleCallback recently; fall back to a timer.
    const idle: typeof window.requestIdleCallback | undefined =
      window.requestIdleCallback;

    if (idle) {
      this.idle = true;
      this.startHandle = idle(() => this.boot(), { timeout: 1500 });
    } else {
      this.startHandle = window.setTimeout(() => this.boot(), 250);
    }
  }

  private boot(): void {
    if (!this.isConnected) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText = "width:100%;height:100%;display:block";

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });

    // No context: leave the element empty so the static fallback shows through.
    if (!gl) return;

    this.appendChild(canvas);
    this.setAttribute("data-ink-active", "");
    gl.getExtension("EXT_color_buffer_float");

    // ---- palette -------------------------------------------------------
    // A hidden probe lets the browser resolve light-dark() for us.
    const probe = document.createElement("span");
    probe.style.cssText =
      "position:absolute;width:0;height:0;visibility:hidden;pointer-events:none";
    this.appendChild(probe);

    const readColor = (property: string, fallback: Rgb): Rgb => {
      probe.style.color = "";
      probe.style.color = `var(${property})`;
      return parseCssColor(getComputedStyle(probe).color, fallback);
    };

    let background: Rgb = [0.04, 0.05, 0.06];
    let pigment: Rgb = [0.91, 0.9, 0.88];
    let accent: Rgb = [0.78, 0.24, 0.23];
    let blend = 1;

    const readPalette = () => {
      background = readColor("--ink-canvas-bg", background);
      pigment = readColor("--ink-pigment", pigment);
      accent = readColor("--ink-accent", accent);
      // Paper subtracts ink; a dark page adds a glow.
      blend = luminance(background) > 0.5 ? -1 : 1;
    };
    readPalette();

    const themeObserver = new MutationObserver(readPalette);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    this.observers.push(themeObserver);

    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", readPalette);
    this.cleanups.push(() => scheme.removeEventListener("change", readPalette));

    // ---- gl plumbing ---------------------------------------------------
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const compile = (source: string, type: number): WebGLShader => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const link = (fragment: string): Program => {
      const program = gl.createProgram()!;
      gl.attachShader(program, compile(VERTEX, gl.VERTEX_SHADER));
      gl.attachShader(program, compile(fragment, gl.FRAGMENT_SHADER));
      gl.linkProgram(program);

      const position = gl.getAttribLocation(program, "aPos");
      const cache = new Map<string, WebGLUniformLocation | null>();

      return {
        handle: program,
        use() {
          gl.useProgram(program);
          gl.bindBuffer(gl.ARRAY_BUFFER, quad);
          gl.enableVertexAttribArray(position);
          gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        },
        uniform(name) {
          if (!cache.has(name)) {
            cache.set(name, gl.getUniformLocation(program, name));
          }
          return cache.get(name) ?? null;
        },
      };
    };

    const programs = {} as Record<ProgramName, Program>;
    for (const name of Object.keys(FRAGMENT) as ProgramName[]) {
      programs[name] = link(FRAGMENT[name]);
    }

    // Where supported, the driver compiles in the background and we poll
    // instead of blocking the main thread on first use. Nine programs is
    // otherwise a few hundred milliseconds in one unbroken task.
    const parallel = gl.getExtension("KHR_parallel_shader_compile");
    const compiling = Object.values(programs);
    let compiled = !parallel;

    const programsReady = () =>
      compiling.every((program) =>
        gl.getProgramParameter(program.handle, parallel!.COMPLETION_STATUS_KHR),
      );

    const createFbo = (width: number, height: number): Fbo => {
      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      // Half float: a dye field does not need full precision, and this halves
      // the bandwidth.
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA16F,
        width,
        height,
        0,
        gl.RGBA,
        gl.HALF_FLOAT,
        null,
      );

      const framebuffer = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0,
      );
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return {
        texture,
        framebuffer,
        width,
        height,
        texel: [1 / width, 1 / height],
        attach(unit) {
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return unit;
        },
      };
    };

    const createDoubleFbo = (width: number, height: number): DoubleFbo => {
      let front = createFbo(width, height);
      let back = createFbo(width, height);
      return {
        get read() {
          return front;
        },
        get write() {
          return back;
        },
        swap() {
          [front, back] = [back, front];
        },
        texel: [1 / width, 1 / height],
        width,
        height,
      };
    };

    let velocity: DoubleFbo;
    let dye: DoubleFbo;
    let divergence: Fbo;
    let curl: Fbo;
    let pressure: DoubleFbo;
    let aspect = 1;

    // The solve runs at a fixed resolution regardless of canvas size — fluid is
    // low frequency, and nobody can see the grid.
    const initSimulation = (ratio: number) => {
      const velocityRows = 160;
      const dyeRows = 560;
      velocity = createDoubleFbo(Math.round(velocityRows * ratio), velocityRows);
      dye = createDoubleFbo(Math.round(dyeRows * ratio), dyeRows);
      divergence = createFbo(velocity.width, velocity.height);
      curl = createFbo(velocity.width, velocity.height);
      pressure = createDoubleFbo(velocity.width, velocity.height);
    };

    const blit = (target: Fbo | null) => {
      if (target) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
        gl.viewport(0, 0, target.width, target.height);
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    // ---- splats --------------------------------------------------------
    const strength = Number(this.dataset.strength ?? "1") || 1;
    const autoFlow = this.dataset.auto !== "0";
    const queue: Splat[] = [];

    const enqueue = (
      x: number,
      y: number,
      dx: number,
      dy: number,
      amount: number,
    ) => queue.push({ x, y, dx, dy, amount });

    const applySplat = (splat: Splat) => {
      const program = programs.splat;
      program.use();
      gl.uniform1f(program.uniform("uAspect"), aspect);
      gl.uniform2f(program.uniform("uPoint"), splat.x, splat.y);
      gl.uniform1i(program.uniform("uTarget"), velocity.read.attach(0));
      gl.uniform1f(program.uniform("uRadius"), 0.002);
      gl.uniform3f(program.uniform("uColor"), splat.dx, splat.dy, 0);
      blit(velocity.write);
      velocity.swap();

      const accentMix = 0.22;
      // Ink laid on paper needs more body than ink glowing on black to read as
      // the same density.
      const scale = splat.amount * strength * (blend < 0 ? 0.44 : 0.4);
      const target = pigment.map(
        (channel, i) => channel * (1 - accentMix) + accent[i] * accentMix,
      ) as Rgb;

      // On paper the dye records how much to take *away* from the page, so a
      // full-strength splat lands exactly on the target ink colour.
      const colour = (
        blend < 0
          ? target.map((channel, i) => (background[i] - channel) * scale)
          : target.map((channel) => channel * scale)
      ) as Rgb;

      gl.uniform1i(program.uniform("uTarget"), dye.read.attach(0));
      gl.uniform1f(program.uniform("uRadius"), 0.0014);
      gl.uniform3f(program.uniform("uColor"), colour[0], colour[1], colour[2]);
      blit(dye.write);
      dye.swap();
    };

    // ---- input ---------------------------------------------------------
    // Coarse pointers get the ambient drift only; there is no hover to track.
    if (window.matchMedia("(pointer: fine)").matches) {
      let last: { x: number; y: number } | null = null;

      const onPointerMove = (event: PointerEvent) => {
        const rect = this.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = 1 - (event.clientY - rect.top) / rect.height;
        if (last) {
          const dx = (x - last.x) * 900;
          const dy = (y - last.y) * 900;
          const speed = Math.min(1, Math.hypot(dx, dy) / 60);
          if (speed > 0.01) enqueue(x, y, dx, dy, speed);
        }
        last = { x, y };
      };
      const onPointerLeave = () => {
        last = null;
      };

      this.addEventListener("pointermove", onPointerMove);
      this.addEventListener("pointerleave", onPointerLeave);
      this.cleanups.push(() => {
        this.removeEventListener("pointermove", onPointerMove);
        this.removeEventListener("pointerleave", onPointerLeave);
      });
    }

    // ---- frame loop ----------------------------------------------------
    let visible = true;
    const visibility = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false;
    });
    visibility.observe(this);
    this.observers.push(visibility);

    const resize = (): boolean => {
      const rect = this.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;

      // Capping the pixel ratio is the single biggest win on phones.
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const width = Math.round(rect.width * dpr);
      const height = Math.round(rect.height * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      aspect = rect.width / rect.height;
      if (!velocity) initSimulation(Math.max(0.4, Math.min(3.2, aspect)));
      return true;
    };

    // Staggered so the hero has ink in it by the time the page settles.
    const openingSplats = [160, 340, 540, 760, 1000, 1280];
    let nextAmbient = 0;
    let lastFrame = performance.now();
    let started = lastFrame;

    const frame = (now: number) => {
      this.frameHandle = requestAnimationFrame(frame);

      if (!compiled) {
        if (!programsReady()) {
          lastFrame = now;
          return;
        }
        compiled = true;
        // Restart the clock so the opening splats still arrive spread out
        // rather than all at once the moment compilation finishes.
        started = now;
      }

      if (!resize() || !visible) {
        lastFrame = now;
        return;
      }

      const dt = Math.min(0.033, (now - lastFrame) / 1000);
      lastFrame = now;
      const elapsed = now - started;

      while (openingSplats.length && elapsed > openingSplats[0]) {
        openingSplats.shift();
        enqueue(
          random(0.3, 0.7),
          random(0.35, 0.65),
          random(-140, 140),
          random(-140, 140),
          random(0.7, 1),
        );
      }

      if (autoFlow && elapsed > nextAmbient) {
        nextAmbient = elapsed + random(2200, 4200);
        enqueue(
          random(0.1, 0.9),
          random(0.15, 0.85),
          random(-90, 90),
          random(-90, 90),
          random(0.3, 0.6),
        );
      }

      while (queue.length) applySplat(queue.shift()!);

      // Vorticity confinement — a coarse grid bleeds angular momentum, so put
      // some back.
      programs.curl.use();
      gl.uniform2f(
        programs.curl.uniform("uTexel"),
        velocity.texel[0],
        velocity.texel[1],
      );
      gl.uniform1i(programs.curl.uniform("uVel"), velocity.read.attach(0));
      blit(curl);

      programs.vorticity.use();
      gl.uniform2f(
        programs.vorticity.uniform("uTexel"),
        velocity.texel[0],
        velocity.texel[1],
      );
      gl.uniform1i(programs.vorticity.uniform("uVel"), velocity.read.attach(0));
      gl.uniform1i(programs.vorticity.uniform("uCurl"), curl.attach(1));
      gl.uniform1f(programs.vorticity.uniform("uDt"), dt);
      gl.uniform1f(programs.vorticity.uniform("uEps"), 22);
      blit(velocity.write);
      velocity.swap();

      programs.divergence.use();
      gl.uniform2f(
        programs.divergence.uniform("uTexel"),
        velocity.texel[0],
        velocity.texel[1],
      );
      gl.uniform1i(programs.divergence.uniform("uVel"), velocity.read.attach(0));
      blit(divergence);

      // Jacobi solve. 22 iterations is where ink stops looking like gas and
      // more stops being visible.
      programs.pressure.use();
      gl.uniform2f(
        programs.pressure.uniform("uTexel"),
        velocity.texel[0],
        velocity.texel[1],
      );
      gl.uniform1i(programs.pressure.uniform("uDiv"), divergence.attach(1));
      for (let i = 0; i < 22; i++) {
        gl.uniform1i(programs.pressure.uniform("uPre"), pressure.read.attach(0));
        blit(pressure.write);
        pressure.swap();
      }

      programs.gradient.use();
      gl.uniform2f(
        programs.gradient.uniform("uTexel"),
        velocity.texel[0],
        velocity.texel[1],
      );
      gl.uniform1i(programs.gradient.uniform("uPre"), pressure.read.attach(0));
      gl.uniform1i(programs.gradient.uniform("uVel"), velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      programs.advect.use();
      gl.uniform2f(
        programs.advect.uniform("uTexel"),
        velocity.texel[0],
        velocity.texel[1],
      );
      gl.uniform1f(programs.advect.uniform("uDt"), dt * 60);
      gl.uniform1f(programs.advect.uniform("uDiss"), 0.999);
      gl.uniform1i(programs.advect.uniform("uVel"), velocity.read.attach(0));
      gl.uniform1i(programs.advect.uniform("uSrc"), velocity.read.attach(0));
      blit(velocity.write);
      velocity.swap();

      gl.uniform1f(programs.advect.uniform("uDiss"), 0.988);
      gl.uniform1i(programs.advect.uniform("uVel"), velocity.read.attach(0));
      gl.uniform1i(programs.advect.uniform("uSrc"), dye.read.attach(1));
      blit(dye.write);
      dye.swap();

      programs.display.use();
      gl.uniform1i(programs.display.uniform("uDye"), dye.read.attach(0));
      gl.uniform3f(
        programs.display.uniform("uBg"),
        background[0],
        background[1],
        background[2],
      );
      gl.uniform1f(programs.display.uniform("uBlend"), blend);
      // Paper takes a much lighter vignette than a black page.
      gl.uniform1f(programs.display.uniform("uVignette"), blend < 0 ? 0.12 : 0.5);
      gl.uniform1f(
        programs.display.uniform("uDither"),
        blend < 0 ? 0.5 / 255 : 1 / 255,
      );
      blit(null);
    };

    this.frameHandle = requestAnimationFrame(frame);
  }

  disconnectedCallback(): void {
    cancelAnimationFrame(this.frameHandle);
    if (this.startHandle) {
      if (this.idle) cancelIdleCallback(this.startHandle);
      else clearTimeout(this.startHandle);
      this.startHandle = 0;
    }
    for (const observer of this.observers) observer.disconnect();
    for (const cleanup of this.cleanups) cleanup();
    this.observers = [];
    this.cleanups = [];
    this.booted = false;
  }
}

if (!customElements.get("fluid-ink")) {
  customElements.define("fluid-ink", FluidInk);
}
