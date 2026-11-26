"use client"

// Silnik pochodzi z komponentu Morph Gallery w Library (21st.dev, kedhareswer).

import * as React from "react"
import { createDemandRenderLoop } from "@utils/demand-render-loop"

/**
 * Morph Gallery , a photo gallery whose slides dissolve into each other
 * through noise instead of cutting or cross-fading.
 *
 * The transition is one full-screen shader pass over two textures. An fbm
 * noise field gives every pixel a threshold, and the progress value sweeps
 * past those thresholds, so the outgoing frame tears away in drifting tatters
 * rather than fading uniformly. The threshold is biased by the luminance of
 * the *incoming* frame, which makes its bright areas burn through first , the
 * detail that stops it reading as a generic dissolve filter.
 *
 * Self-contained: raw WebGL, React is the only import. No gallery library, no
 * animation library, no CSS file. The canvas sizes itself from its own box.
 *
 * Textures need CORS. An image served without `Access-Control-Allow-Origin`
 * cannot be uploaded to WebGL at all, so the component detects that and falls
 * back to a plain DOM cross-fade , the gallery still works, it just stops
 * morphing. That is the difference between "no shader" and "black rectangle".
 */

export type MorphItem = {
  /** Full-size image. Must be served with CORS headers to be morphed. */
  src: string
  /** Thumbnail for the strip. Falls back to `src`, which is wasteful. */
  thumb?: string
  alt?: string
}

export type MorphGalleryProps = {
  items: MorphItem[]
  /** **Must be a definite length.** The canvas fills this box. */
  height?: string
  /** Milliseconds of dissolve. */
  duration?: number
  /** fbm frequency. Higher tears into finer shreds. */
  noiseScale?: number
  /** Width of the dissolve front, in threshold units. 0 is a hard edge. */
  edge?: number
  /** How far the frames slide against each other while dissolving. */
  drift?: number
  /** Wrap past the ends. */
  loop?: boolean
  /** Milliseconds between automatic advances. 0 (default) is off. */
  autoplay?: number
  arrows?: boolean
  thumbnails?: boolean
  /** Controlled index. Omit for uncontrolled. */
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  className?: string
  accessibilityLabel?: string
  previousLabel?: string
  nextLabel?: string
  showItemLabel?: (item: MorphItem, index: number) => string
}

// #region gallery
/** Wrap past the ends when looping, clamp at them when not. */
export const wrapIndex = (i: number, n: number, loop: boolean): number => {
  if (n <= 0) return 0
  return loop ? ((i % n) + n) % n : Math.min(Math.max(i, 0), n - 1)
}

/** Quintic in-out: the dissolve starts and ends still, and hurries the middle. */
export const easeInOutQuint = (t: number): number => {
  const x = Math.min(Math.max(t, 0), 1)
  return x < 0.5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2
}

/**
 * `object-fit: cover` expressed as a UV scale about the centre. Both factors
 * are <= 1: the sampled window shrinks, so the image crops rather than
 * stretching, whichever way the box is out of proportion.
 */
export const coverScale = (
  canvasAspect: number,
  imgAspect: number,
): [number, number] =>
  canvasAspect > imgAspect
    ? [1, imgAspect / canvasAspect]
    : [canvasAspect / imgAspect, 1]
// #endregion

const VERT = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;

uniform sampler2D u_from;
uniform sampler2D u_to;
uniform float u_progress;
uniform vec2 u_resolution;
uniform float u_fromAspect;
uniform float u_toAspect;
uniform float u_scale;
uniform float u_direction;
uniform float u_edge;
uniform float u_drift;

varying vec2 v_uv;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
   -0.577350269189626,
    0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0)
  );
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 v) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise(v);
    v *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// The drift below pushes UVs past the edge of the image, and CLAMP_TO_EDGE
// answers that by smearing the last row of pixels into long vertical streaks.
// Reflecting instead keeps real picture there. Done in the shader because
// MIRRORED_REPEAT is illegal on the non-power-of-two textures photos produce.
vec2 mirror(vec2 uv) {
  return 1.0 - abs(1.0 - mod(uv, 2.0));
}

vec2 coverUV(vec2 uv, float imgAspect) {
  float canvasAspect = u_resolution.x / u_resolution.y;
  vec2 scale = (canvasAspect > imgAspect)
    ? vec2(1.0, imgAspect / canvasAspect)
    : vec2(canvasAspect / imgAspect, 1.0);
  return mirror((uv - 0.5) * scale + 0.5);
}

void main() {
  // Widen the sweep by one edge at each end, so progress 0 and 1 are fully
  // one image or the other rather than already half-dissolved.
  float adjusted = u_progress * (1.0 + 2.0 * u_edge) - u_edge;

  float noise = fbm(v_uv * u_scale + vec2(0.0, u_progress * u_direction)) * 0.5 + 0.5;
  // Bias the threshold by how bright the incoming frame is here: its lit areas
  // cross the front first, so the new image appears to burn through the old.
  noise = smoothstep(
    0.0,
    2.0,
    length(texture2D(u_to, coverUV(v_uv, u_toAspect)).rgb) + noise
  );

  float mixFactor = 1.0 - smoothstep(adjusted - u_edge, adjusted + u_edge, noise);

  // Both frames slide, by different amounts and in opposite directions, so the
  // tatters have parallax against each other instead of sitting in one plane.
  vec2 fromUV = coverUV(
    v_uv + vec2(0.0, noise * u_progress * u_drift * u_direction),
    u_fromAspect
  );
  vec2 toUV = coverUV(
    v_uv + vec2(0.0, noise * (1.0 - u_progress) * -0.5 * u_drift * u_direction),
    u_toAspect
  );

  gl_FragColor = mix(texture2D(u_from, fromUV), texture2D(u_to, toUV), mixFactor);
}
`

const compile = (gl: WebGLRenderingContext, type: number, src: string) => {
  const shader = gl.createShader(type)
  if (!shader) throw new Error("could not create shader")
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error("shader compile failed: " + log)
  }
  return shader
}

const link = (gl: WebGLRenderingContext, vertSrc: string, fragSrc: string) => {
  const vert = compile(gl, gl.VERTEX_SHADER, vertSrc)
  const frag = compile(gl, gl.FRAGMENT_SHADER, fragSrc)
  const program = gl.createProgram()
  if (!program) throw new Error("could not create program")
  gl.attachShader(program, vert)
  gl.attachShader(program, frag)
  gl.linkProgram(program)
  // The shaders are owned by the program once attached; drop our references
  // now so they are freed with it rather than leaking per mount.
  gl.deleteShader(vert)
  gl.deleteShader(frag)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error("program link failed: " + log)
  }
  return program
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    // Without this the texture upload throws and the whole gallery goes black.
    // With it, a host that sends no CORS header fails here instead , which we
    // can see, and fall back from.
    img.crossOrigin = "anonymous"
    img.decoding = "async"
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("could not load " + src))
    img.src = src
  })

export default function MorphGallery({
  items,
  height = "100svh",
  duration = 1500,
  noiseScale = 3.5,
  edge = 0.15,
  drift = 0.5,
  loop = true,
  autoplay = 0,
  arrows = true,
  thumbnails = true,
  index,
  defaultIndex = 0,
  onIndexChange,
  className = "",
  accessibilityLabel = "Galeria realizacji",
  previousLabel = "Poprzednie zdjęcie",
  nextLabel = "Następne zdjęcie",
  showItemLabel = (item, index) => item.alt ? "Pokaż " + item.alt : "Pokaż zdjęcie " + (index + 1),
}: MorphGalleryProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const renderLoopRef = React.useRef<ReturnType<typeof createDemandRenderLoop> | null>(null)
  const [uncontrolled, setUncontrolled] = React.useState(() =>
    wrapIndex(defaultIndex, items.length, loop),
  )
  const active = index === undefined ? uncontrolled : wrapIndex(index, items.length, loop)

  const [failed, setFailed] = React.useState(false)
  const [ready, setReady] = React.useState(false)
  const [generation, setGeneration] = React.useState(0)
  const [reduced, setReduced] = React.useState(false)
  const [paused, setPaused] = React.useState(false)
  // Autoplay nie powinien przerzucać slajdów, gdy galeria jest poza ekranem.
  const sectionRef = React.useRef<HTMLElement | null>(null)
  const [inView, setInView] = React.useState(true)

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  const go = React.useCallback(
    (next: number) => {
      const wrapped = wrapIndex(next, items.length, loop)
      if (index === undefined) setUncontrolled(wrapped)
      onIndexChange?.(wrapped)
    },
    [index, items.length, loop, onIndexChange],
  )

  // The render loop reads live values through refs, so retuning the dissolve
  // never tears down the GL context.
  const tuning = React.useRef({ duration, noiseScale, edge, drift, reduced })
  tuning.current = { duration, noiseScale, edge, drift, reduced }

  // A transition is requested by index changes and consumed by the loop.
  const request = React.useRef<{ from: number; to: number } | null>(null)
  const previous = React.useRef(active)
  React.useEffect(() => {
    if (previous.current === active) return
    request.current = { from: previous.current, to: active }
    previous.current = active
    renderLoopRef.current?.request()
  }, [active])

  // Rebuilding on the source list is the point: new images, new textures.
  const sources = items.map((i) => i.src).join("\n")

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || items.length === 0) return

    const gl =
      canvas.getContext("webgl", { alpha: false, antialias: false }) ??
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null)
    if (!gl) {
      setFailed(true)
      return
    }

    let program: WebGLProgram | null = null
    let buffer: WebGLBuffer | null = null
    // Indexed by item, with holes: an image that has not arrived yet , or
    // never will , leaves a null behind rather than shifting its neighbours.
    const textures: (WebGLTexture | null)[] = items.map(() => null)
    const aspects: number[] = items.map(() => 1)
    let disposed = false
    let hasTexture = false
    let contextLost = false

    // Dissolve state, in the loop rather than in React: it changes every frame.
    let from = active
    let to = active
    let progress = 1
    let startedAt = 0
    let direction = 1

    const onLost = (e: Event) => {
      e.preventDefault()
      contextLost = true
      renderLoop.pause()
    }
    // A restored context has nothing in it , every object above is gone, so
    // the only honest response is to build the whole thing again.
    const onRestored = () => setGeneration((g) => g + 1)
    canvas.addEventListener("webglcontextlost", onLost)
    canvas.addEventListener("webglcontextrestored", onRestored)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(canvas.clientWidth * dpr)
      const h = Math.round(canvas.clientHeight * dpr)
      if (w === 0 || h === 0 || (canvas.width === w && canvas.height === h)) return
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
      renderLoop.request()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    let uniforms: Record<string, WebGLUniformLocation | null> = {}

    // Until every image is in, `from` or `to` can point at a hole. Showing the
    // nearest texture that does exist beats binding null, which draws black.
    const pick = (i: number) => textures[i] ?? textures.find((t) => t) ?? null

    const draw = () => {
      if (disposed) return false
      const t = tuning.current

      const pending = request.current
      if (pending) {
        request.current = null
        if (pending.from !== pending.to) {
          from = pending.from
          to = pending.to
          progress = 0
          startedAt = performance.now()
          // Direction follows the shortest way round, so a wrap from the last
          // slide to the first drifts forward like every other step.
          const n = items.length
          const forward = loop
            ? ((pending.to - pending.from + n) % n) * 2 <= n
            : pending.to > pending.from
          direction = forward ? 1 : -1
        }
      }

      if (progress < 1) {
        // Reduced motion keeps the gallery but drops the animation: the slide
        // is simply there on the next frame.
        const span = t.reduced ? 0 : Math.max(t.duration, 1)
        const elapsed = performance.now() - startedAt
        progress = span === 0 ? 1 : easeInOutQuint(Math.min(elapsed / span, 1))
      }

      const fromTex = pick(from)
      const toTex = pick(to)
      if (!fromTex || !toTex) return false

      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, fromTex)
      gl.uniform1i(uniforms.from, 0)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, toTex)
      gl.uniform1i(uniforms.to, 1)

      gl.uniform1f(uniforms.progress, progress)
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height)
      gl.uniform1f(uniforms.fromAspect, aspects[from] ?? 1)
      gl.uniform1f(uniforms.toAspect, aspects[to] ?? 1)
      gl.uniform1f(uniforms.scale, t.noiseScale)
      gl.uniform1f(uniforms.direction, direction)
      gl.uniform1f(uniforms.edge, Math.max(t.edge, 0.001))
      gl.uniform1f(uniforms.drift, t.drift)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      // Shader nie zmienia nieruchomej klatki, więc po morfowaniu kończymy pętlę.
      return progress < 1
    }

    const renderLoop = createDemandRenderLoop(() => {
      // Zachowujemy oczekującą zmianę slajdu do chwili załadowania pierwszej tekstury.
      if (disposed || contextLost || !hasTexture || document.hidden || canvas.clientWidth <= 0 || canvas.clientHeight <= 0) return false
      return draw()
    })
    renderLoopRef.current = renderLoop

    const syncVisibility = () => {
      if (document.hidden || contextLost) renderLoop.pause()
      else renderLoop.resume()
    }
    document.addEventListener("visibilitychange", syncVisibility)
    if (document.hidden) renderLoop.pause()

    const start = async () => {
      try {
        program = link(gl, VERT, FRAG)
        gl.useProgram(program)

        buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
          gl.STATIC_DRAW,
        )
        const loc = gl.getAttribLocation(program, "a_position")
        gl.enableVertexAttribArray(loc)
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

        for (const name of [
          "from", "to", "progress", "resolution",
          "fromAspect", "toAspect", "scale", "direction", "edge", "drift",
        ]) {
          uniforms[name] = gl.getUniformLocation(program, "u_" + name)
        }

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

        // Each image is uploaded the moment it arrives and the loop starts on
        // the first one. Waiting for all of them means a black rectangle for
        // as long as the slowest image takes, which on a real connection is
        // the whole first impression.
        let running = false
        let refused = 0
        await Promise.all(
          items.map((item, i) =>
            loadImage(item.src).then(
              (img) => {
                if (disposed) return
                const tex = gl.createTexture()
                gl.bindTexture(gl.TEXTURE_2D, tex)
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
                // Photos are not powers of two, so mipmaps and repeat are both
                // off the table in WebGL1 , clamp and linear are the only
                // legal pair, and the wrong one renders black with no error.
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                textures[i] = tex
                aspects[i] = img.naturalWidth / Math.max(img.naturalHeight, 1)
                hasTexture = true
                if (!running) {
                  running = true
                  resize()
                  setReady(true)
                }
                renderLoop.request()
              },
              () => {
                // One broken URL should cost one slide, not the effect. Only
                // when nothing at all loads is there no gallery to shade.
                refused += 1
                if (refused === items.length && !disposed) setFailed(true)
              },
            ),
          ),
        )
      } catch {
        // No WebGL, or a driver that refused the program. Either way: show the
        // pictures without the morph rather than showing nothing.
        if (!disposed) setFailed(true)
      }
    }
    void start()

    return () => {
      disposed = true
      renderLoop.dispose()
      if (renderLoopRef.current === renderLoop) renderLoopRef.current = null
      observer.disconnect()
      document.removeEventListener("visibilitychange", syncVisibility)
      canvas.removeEventListener("webglcontextlost", onLost)
      canvas.removeEventListener("webglcontextrestored", onRestored)
      for (const tex of textures) if (tex) gl.deleteTexture(tex)
      if (buffer) gl.deleteBuffer(buffer)
      if (program) gl.deleteProgram(program)
      textures.fill(null)
    }
    // `active` is read once to seed the first frame; changes arrive through
    // `request` instead, which is why it is deliberately not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sources, generation, items.length, loop])

  // ---- autoplay ------------------------------------------------------------
  React.useEffect(() => {
    if (!autoplay || reduced || paused || !inView || items.length < 2) return
    const id = window.setInterval(() => go(active + 1), Math.max(autoplay, 600))
    return () => window.clearInterval(id)
  }, [autoplay, reduced, paused, inView, active, go, items.length])

  React.useEffect(() => {
    const element = sectionRef.current
    if (!element || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    // A tab in the background should not silently burn through the gallery.
    const sync = () => setPaused(document.hidden)
    document.addEventListener("visibilitychange", sync)
    return () => document.removeEventListener("visibilitychange", sync)
  }, [])

  // ---- pointer and keyboard ------------------------------------------------
  const swipe = React.useRef<number | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    swipe.current = e.clientX
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const startX = swipe.current
    swipe.current = null
    if (startX === null) return
    const dx = e.clientX - startX
    if (Math.abs(dx) > 48) go(active + (dx < 0 ? 1 : -1))
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      go(active - 1)
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      go(active + 1)
    }
  }

  const atStart = !loop && active === 0
  const atEnd = !loop && active === items.length - 1
  const current = items[active]

  const arrowClass =
    "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center " +
    "rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md " +
    "transition-colors hover:bg-white/25 focus-visible:outline focus-visible:outline-2 " +
    "focus-visible:outline-offset-2 focus-visible:outline-white " +
    "disabled:pointer-events-none disabled:opacity-25"

  return (
    <section
      ref={sectionRef}
      className={"relative w-full overflow-hidden bg-[var(--color-brand-dark)] " + className}
      style={{ height }}
      role="region"
      aria-roledescription="carousel"
      aria-label={accessibilityLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {failed ? (
        // The same gallery without the shader: stacked images, opacity only.
        items.map((item, i) => (
          <img
            key={item.src}
            src={item.src}
            alt={item.alt ?? ""}
            className="absolute inset-0 block h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none"
            style={{ maxWidth: "none", opacity: i === active ? 1 : 0 }}
            aria-hidden={i !== active}
          />
        ))
      ) : (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full"
          style={{
            // Nothing is on the canvas until the textures land; fading it in
            // avoids a black flash on a slow connection.
            opacity: ready ? 1 : 0,
            transition: reduced ? "none" : "opacity 400ms ease",
          }}
          aria-hidden="true"
        />
      )}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-56 bg-gradient-to-b from-transparent to-black/65"
        aria-hidden="true"
      />

      {arrows && items.length > 1 && (
        <>
          <button
            type="button"
            className={arrowClass + " left-4 sm:left-8"}
            onClick={() => go(active - 1)}
            disabled={atStart}
            aria-label={previousLabel}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className={arrowClass + " right-4 sm:right-8"}
            onClick={() => go(active + 1)}
            disabled={atEnd}
            aria-label={nextLabel}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {thumbnails && items.length > 1 && (
        <ul
          className={
            "absolute inset-x-0 bottom-8 z-10 mx-auto flex w-max max-w-[calc(100%-2rem)] gap-2 " +
            "list-none overflow-x-auto scroll-smooth p-0 pb-2.5 " +
            "[&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-track]:bg-white/10 " +
            "[&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-white/30 " +
            "max-sm:hidden"
          }
        >
          {items.map((item, i) => (
            <li key={item.src} className="shrink-0 list-none">
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={i === active}
                aria-label={showItemLabel(item, i)}
                className={
                  "block cursor-pointer overflow-hidden rounded border-2 bg-transparent p-0 transition " +
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white " +
                  (i === active
                    ? "border-white opacity-100"
                    : "border-transparent opacity-55 hover:opacity-85")
                }
              >
                <img
                  src={item.thumb ?? item.src}
                  alt=""
                  width={80}
                  height={50}
                  loading="lazy"
                  decoding="async"
                  className="block object-cover"
                  // Preflight's img { max-width: 100% } would otherwise shrink
                  // these inside the scroller and break the strip's rhythm.
                  style={{ maxWidth: "none", width: 80, height: 50 }}
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <span className="sr-only" aria-live="polite">
        {current ? current.alt ?? "Zdjęcie " + (active + 1) : ""}
        {" , "}
        {active + 1} z {items.length}
      </span>
    </section>
  )
}
