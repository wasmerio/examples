/**
 * Physics-driven hanging badge: a card clipped to a cord that swings under gravity and can be
 * dragged. The rope-joint physics rig is adapted from React Bits' "Lanyard" example (MIT +
 * Commons Clause, https://reactbits.dev), reimplemented with our own card front texture.
 *
 * Keep this as a single component (don't split it up or duplicate the `useGLTF` call) — an
 * earlier split reintroduced a WebGL context crash. Two fixes guard against that crash:
 * 1. `colliders: false` on every RigidBody — without it, Rapier's auto-generated collider
 *    overlaps our manual BallCollider/CuboidCollider and destabilizes the physics solver.
 * 2. Don't lock rotation via `enabledRotations` — it fights the spherical joint's constraint
 *    solver and diverges (NaN/Infinity → GPU crash). Counter-rotate angular velocity instead
 *    (see the `setAngvel` call in `useFrame` below).
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'

import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { Environment, Lightformer, useGLTF, useTexture } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import type { RapierRigidBody, RigidBodyProps } from '@react-three/rapier'

import { useTheme } from '@/hooks/use-theme'
import { setIdCardHover } from '@/lib/id-card-cursor'
import { cn } from '@/lib/utils'

// @dimforge/rapier3d-compat's bundled WASM init calls its own wasm-bindgen loader with the
// decoded WASM bytes positionally instead of the newer `{ module_or_path }` object form, which
// the loader flags as deprecated — a bug baked into that dependency's own init(), which takes no
// arguments we could pass differently. Silencing just this one exact message (this file only
// ever runs client-side) avoids patching node_modules for something outside our call site.
if (typeof window !== 'undefined') {
  const originalWarn = console.warn

  const RAPIER_INIT_DEPRECATION_WARNING =
    'using deprecated parameters for the initialization function; pass a single object instead'

  console.warn = (...args: unknown[]) => {
    if (args[0] === RAPIER_INIT_DEPRECATION_WARNING) return
    originalWarn(...args)
  }
}

const CARD_MODEL_URL = '/models/lanyard/card.glb'

// Real cylindrical radius for the rope's TubeGeometry, not a flat "line width" — a genuine tube
// mesh catches light like a real cord, unlike a flat camera-facing ribbon.
const ROPE_RADIUS = 0.1

// Segment count for a smooth (non-faceted) rope cross-section.
const ROPE_RADIAL_SEGMENTS = 24

// Fraction of the rope's length (from the pin end) over which its radius tapers to a point,
// instead of the pin end being an abrupt flat cut. See buildTaperedTubeGeometry below.
const ROPE_TAPER_FRACTION = 0.06

// Card-local y offset of the useSphericalJoint anchor, where the rope ties to the card. Shared
// with the per-frame rope curve endpoint in useFrame so they can't drift out of sync.
const CARD_ROPE_ANCHOR_Y = 1.1

// Closes the visual gap from rope-joint slack (the physics endpoint settles slightly short of
// the anchor) by extending the rendered curve, without touching the physics rig itself.
const ROPE_TOP_EXTENSION = -0.5

// public/images/3d-card/pin.webp — a cutout of the actual pin hardware, rendered as a
// camera-facing plane instead of procedural geometry (see the `pinTexture` comment in `Band`).
const PIN_IMAGE_URL = '/images/3d-card/pin.webp'

// Source image is 1024×1536px with the opaque pin content padded unevenly inside it. Only the
// bottom padding fraction is needed, so PIN_PLANE_Y can auto-derive from PIN_PLANE_HEIGHT —
// resizing the pin only requires touching PIN_PLANE_HEIGHT.
const PIN_IMAGE_ASPECT = 1024 / 1536
const PIN_IMAGE_BOTTOM_PAD_FRACTION = (1536 - 1432) / 1536

// World y of the card's actual top edge (from card.glb's mesh bounds) — where the pin image's
// visible bottom (the hook tip) should land, regardless of pin size.
const CARD_TOP_EDGE_Y = 0.93

// Plane dimensions use the image's raw aspect ratio so the pin isn't stretched.
const PIN_PLANE_HEIGHT = 1.4
const PIN_PLANE_WIDTH = PIN_PLANE_HEIGHT * PIN_IMAGE_ASPECT

// Derives the center offset from the image's padding fractions so the visible content's bottom
// (the hook tip) lands exactly at CARD_TOP_EDGE_Y, whatever PIN_PLANE_HEIGHT is set to.
const PIN_PLANE_Y = CARD_TOP_EDGE_Y + PIN_PLANE_HEIGHT * -PIN_IMAGE_BOTTOM_PAD_FRACTION

// 0 centers it on the card, matching the rope/hardware's own x=0.
const PIN_PLANE_X = 0

// Pushed past ROPE_RADIUS (with margin) so the rope's near-camera bulge doesn't render in front
// of the pin.
const PIN_PLANE_Z = ROPE_RADIUS + 0.06

// A real gap in card.glb's mesh triangulation (see the `holePatchTexture` comment in `Band`),
// in the card mesh's own unscaled local coordinate frame.
const HOLE_PATCH_LOCAL_X = 0
const HOLE_PATCH_LOCAL_Y = 0.942
const HOLE_PATCH_LOCAL_SIZE = 0.055

// UV region of `cardMap` matching the hole's location, for sampling the patch that covers it.
const HOLE_PATCH_UV_OFFSET = [0.2308, 0.0443] as const
const HOLE_PATCH_UV_REPEAT = [0.0375, 0.0405] as const

// The badge mesh's front/back face UVs occupy the left/right halves of its baked texture atlas.
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 }
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.755 }

// Fraction of each face's height covered by the accent stripe across the top edge.
const ACCENT_STRIPE_HEIGHT_RATIO = 0.03

type CardGltf = {
  nodes: { card: THREE.Mesh }
  materials: { base: THREE.MeshStandardMaterial }
}

type LanyardRigidBody = RapierRigidBody & { lerped?: THREE.Vector3 }

const getLerped = (body: LanyardRigidBody) => {
  if (!body.lerped) {
    body.lerped = new THREE.Vector3().copy(body.translation())
  }

  return body.lerped
}

// THREE.TubeGeometry only takes a single constant radius, leaving an abrupt flat cut at each
// end. Same Frenet-frame sweep TubeGeometry uses internally, except the radius per ring can
// taper toward 0 — at t=0 every vertex collapses to a point, like ConeGeometry's apex.
const buildTaperedTubeGeometry = (
  curve: THREE.CatmullRomCurve3,
  tubularSegments: number,
  radius: number,
  radialSegments: number,
  taperFraction: number
) => {
  const frames = curve.computeFrenetFrames(tubularSegments, false)
  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  const vertex = new THREE.Vector3()
  const normal = new THREE.Vector3()

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments
    const point = curve.getPointAt(t)
    const N = frames.normals[i]
    const B = frames.binormals[i]

    // t=0 is the pin/card-side end (see curve.points[0] in useFrame), so the taper happens
    // there, not at the fixed top anchor.
    const ringRadius = t < taperFraction ? radius * (t / taperFraction) : radius

    for (let j = 0; j <= radialSegments; j++) {
      const angle = (j / radialSegments) * Math.PI * 2
      const sin = Math.sin(angle)
      const cos = -Math.cos(angle)

      normal.x = cos * N.x + sin * B.x
      normal.y = cos * N.y + sin * B.y
      normal.z = cos * N.z + sin * B.z
      normal.normalize()
      normals.push(normal.x, normal.y, normal.z)

      vertex.x = point.x + ringRadius * normal.x
      vertex.y = point.y + ringRadius * normal.y
      vertex.z = point.z + ringRadius * normal.z
      positions.push(vertex.x, vertex.y, vertex.z)

      uvs.push(t, j / radialSegments)
    }
  }

  for (let j = 1; j <= tubularSegments; j++) {
    for (let i = 1; i <= radialSegments; i++) {
      const a = (radialSegments + 1) * (j - 1) + (i - 1)
      const b = (radialSegments + 1) * j + (i - 1)
      const c = (radialSegments + 1) * j + i
      const d = (radialSegments + 1) * (j - 1) + i

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  const geometry = new THREE.BufferGeometry()

  geometry.setIndex(indices)
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))

  return geometry
}

type BandProps = {
  frontImage: string
  isMobile: boolean
}

const Band = ({ frontImage, isMobile }: BandProps) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const rope = useRef<THREE.Mesh>(null!)
  const fixed = useRef<RapierRigidBody>(null!)
  const j1 = useRef<LanyardRigidBody>(null!)
  const j2 = useRef<LanyardRigidBody>(null!)
  const j3 = useRef<RapierRigidBody>(null!)
  const card = useRef<RapierRigidBody>(null!)

  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const cardQuat = new THREE.Quaternion()

  const segmentProps: RigidBodyProps = {
    type: 'dynamic',
    canSleep: true,

    // Fix 1 — see the file-header comment.
    colliders: false,

    // Main "bounciness" knob: lower = longer/bouncier swing after drag-release. Safe to tune
    // freely — unlike colliders/enabledRotations, damping isn't one of the two fragile fixes.
    angularDamping: 1.5,
    linearDamping: 1.5
  }

  const { nodes, materials } = useGLTF(CARD_MODEL_URL) as unknown as CardGltf
  const frontTexture = useTexture(frontImage)

  // Rendered as a camera-facing textured plane rather than procedural geometry — the pin sits
  // nearly flush on the card's front face with the camera close to fixed/front-on, so a flat
  // plane reads the same as real geometry from this angle.
  const pinTexture = useTexture(PIN_IMAGE_URL)

  const cardMap = useMemo(() => {
    const baseMap = materials.base.map as THREE.Texture
    const baseImage = baseMap.image as HTMLImageElement
    const width = baseImage.width
    const height = baseImage.height

    const canvas = document.createElement('canvas')

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')

    if (!ctx) return baseMap

    ctx.drawImage(baseImage, 0, 0, width, height)

    const image = frontTexture.image as HTMLImageElement

    for (const uvRect of [FRONT_UV_RECT, BACK_UV_RECT]) {
      const rx = uvRect.x * width
      const ry = uvRect.y * height
      const rw = uvRect.w * width
      const rh = uvRect.h * height
      const scale = Math.max(rw / image.width, rh / image.height)
      const dw = image.width * scale
      const dh = image.height * scale
      const dx = rx + (rw - dw) / 2
      const dy = ry + (rh - dh) / 2

      ctx.save()
      ctx.beginPath()
      ctx.rect(rx, ry, rw, rh)
      ctx.clip()
      ctx.drawImage(image, dx, dy, dw, dh)

      // Accent stripe across the top edge, matching the site's --accent color.
      ctx.fillStyle = '#ff5c00'
      ctx.fillRect(rx, ry, rw, rh * ACCENT_STRIPE_HEIGHT_RATIO)
      ctx.restore()
    }

    const composite = new THREE.CanvasTexture(canvas)

    composite.colorSpace = THREE.SRGBColorSpace
    composite.flipY = baseMap.flipY
    composite.anisotropy = 16
    composite.needsUpdate = true

    return composite
  }, [frontTexture, materials.base.map])

  // card.glb's `card` mesh has a real gap in its triangulation at HOLE_PATCH_LOCAL_* (likely a
  // punched grommet hole baked into the source model). A flat plane can't reshape someone else's
  // mesh, so this patches it: a small plane, parented in the same transform group as the card
  // mesh, sampling the exact matching region of `cardMap` rather than a guessed solid color.
  const holePatchTexture = useMemo(() => {
    const texture = cardMap.clone()

    texture.offset.set(...HOLE_PATCH_UV_OFFSET)
    texture.repeat.set(...HOLE_PATCH_UV_REPEAT)
    texture.needsUpdate = true

    return texture
  }, [cardMap])

  const [curve] = useState(() => {
    const rope = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3()
    ])

    rope.curveType = 'chordal'

    return rope
  })

  const [dragged, drag] = useState<THREE.Vector3 | false>(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.85])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.85])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.85])
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, CARD_ROPE_ANCHOR_Y, 0]
  ])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }

    if (fixed.current) {
      ;[j1, j2].forEach(ref => {
        const lerped = getLerped(ref.current)
        const clampedDistance = Math.max(0.1, Math.min(1, lerped.distanceTo(ref.current.translation())))

        lerped.lerp(ref.current.translation(), delta * 50 * clampedDistance)
      })

      // Recomputes the sphere-joint anchor's true world position from the card's live rotation
      // each frame, so the rope stays glued to the pin at any orientation, not just at rest.
      const cardPos = card.current.translation()
      const cardRot = card.current.rotation()

      cardQuat.set(cardRot.x, cardRot.y, cardRot.z, cardRot.w)
      curve.points[0]
        .set(0, CARD_ROPE_ANCHOR_Y + ROPE_TOP_EXTENSION, 0)
        .applyQuaternion(cardQuat)
        .add(vec.set(cardPos.x, cardPos.y, cardPos.z))
      curve.points[1].copy(getLerped(j2.current))
      curve.points[2].copy(getLerped(j1.current))
      curve.points[3].copy(fixed.current.translation())

      // Tube geometry is built from a fixed curve sampling, so following the curve's per-frame
      // movement means rebuilding and swapping it in each frame, disposing the old one to avoid
      // leaking GPU buffers.
      const oldRopeGeometry = rope.current.geometry

      rope.current.geometry = buildTaperedTubeGeometry(
        curve,
        isMobile ? 16 : 32,
        ROPE_RADIUS,
        ROPE_RADIAL_SEGMENTS,
        ROPE_TAPER_FRACTION
      )
      oldRopeGeometry.dispose()

      // Fix 2 — see the file-header comment.
      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation() as unknown as THREE.Vector3)
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true)
    }
  })

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type='fixed' />
        <RigidBody position={[0.425, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.85, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.275, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.7, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[1.42, 2.0, 0.018]} />
          <group
            scale={4}
            position={[0, -3.16, -0.09]}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              ;(e.target as Element).releasePointerCapture(e.pointerId)
              drag(false)
              document.body.style.userSelect = ''
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              ;(e.target as Element).setPointerCapture(e.pointerId)
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current!.translation())))

              // Without this, dragging the card also triggers the browser's native
              // text-selection drag on whatever it passes over.
              document.body.style.userSelect = 'none'
            }}
            onPointerOver={() => setIdCardHover(true)}
            onPointerOut={() => setIdCardHover(false)}
          >
            {/* The oversized pointer-events-none canvas wrapper means native DOM hit-testing
            (which CustomCursor relies on) never reaches this mesh, so route hover state to
            CustomCursor via the shared setIdCardHover flag instead of a native cursor style. */}
            <mesh geometry={nodes.card.geometry}>
              <meshBasicMaterial map={cardMap} toneMapped={false} />
            </mesh>

            {/* Patch for the real gap in card.glb's mesh — see HOLE_PATCH_* / holePatchTexture
                above. Same transform group as the card mesh to stay aligned; z=0.006 sits just
                in front of the card's own local z to avoid z-fighting. */}
            <mesh position={[HOLE_PATCH_LOCAL_X, HOLE_PATCH_LOCAL_Y, 0.006]}>
              <planeGeometry args={[HOLE_PATCH_LOCAL_SIZE, HOLE_PATCH_LOCAL_SIZE]} />
              <meshBasicMaterial map={holePatchTexture} toneMapped={false} />
            </mesh>
          </group>

          {/* Pin hardware — a camera-facing textured plane (see PIN_IMAGE_URL/PIN_PLANE_* above
              for sizing/position). `alphaTest` discards near-transparent pixels outright to
              avoid alpha-sorting artifacts against the rope behind it. */}
          <mesh position={[PIN_PLANE_X, PIN_PLANE_Y, PIN_PLANE_Z]}>
            <planeGeometry args={[PIN_PLANE_WIDTH, PIN_PLANE_HEIGHT]} />
            <meshBasicMaterial map={pinTexture} transparent alphaTest={0.1} toneMapped={false} />
          </mesh>
        </RigidBody>
      </group>

      {/* No <tubeGeometry> declared as a JSX child — mixing that with the imperative per-frame
          `rope.current.geometry = ...` swap above made the rope render invisible, since R3F's
          own lifecycle management of a JSX-declared geometry fights the reassignment.
          frustumCulled is off since a swapped-in geometry's bounding sphere updates lazily. */}
      <mesh ref={rope} frustumCulled={false}>
        <meshStandardMaterial color={isDark ? '#d4d4d8' : '#262626'} roughness={0.55} metalness={0.15} />
      </mesh>
    </>
  )
}

const StudioLighting = () => (
  <Environment blur={0.75}>
    <Lightformer
      intensity={2}
      color='white'
      position={[0, -1, 5]}
      rotation={[0, 0, Math.PI / 3]}
      scale={[100, 0.1, 1]}
    />
    <Lightformer
      intensity={3}
      color='white'
      position={[-1, -1, 1]}
      rotation={[0, 0, Math.PI / 3]}
      scale={[100, 0.1, 1]}
    />
    <Lightformer
      intensity={3}
      color='white'
      position={[1, 1, 1]}
      rotation={[0, 0, Math.PI / 3]}
      scale={[100, 0.1, 1]}
    />
    <Lightformer
      intensity={10}
      color='white'
      position={[-10, 0, 14]}
      rotation={[0, Math.PI / 2, Math.PI / 3]}
      scale={[100, 10, 1]}
    />
  </Environment>
)

// The rig (rope length, anchor height, card scale) was tuned to look right at this exact pixel
// height and camera depth — treat this pair as the reference "1:1 zoom" calibration point.
const REFERENCE_HEIGHT_PX = 520
const CAMERA_Z = 20
const CAMERA_FOV_DEG = 20
const WORLD_UNITS_PER_PX = (2 * CAMERA_Z * Math.tan((CAMERA_FOV_DEG / 2) * (Math.PI / 180))) ** -1

// Must be computed from REFERENCE_HEIGHT_PX, not the live canvas height — the camera dolly
// below keeps px-per-world-unit pinned to this reference value regardless of canvas size.
const PX_PER_WORLD_UNIT = REFERENCE_HEIGHT_PX * WORLD_UNITS_PER_PX

// Keeps the resting card anchored a fixed pixel distance from the canvas's right edge
// regardless of canvas width, by panning the camera to offset the canvas's own drifting center.
const TARGET_FROM_RIGHT_PX = 240

const CameraAlign = () => {
  useFrame(state => {
    state.camera.position.x = (TARGET_FROM_RIGHT_PX - state.size.width / 2) / PX_PER_WORLD_UNIT

    // Vertical FOV is fixed, so a taller canvas alone renders everything bigger (a zoom, not
    // more visible area). Pushing the camera back proportionally cancels that zoom, so the
    // card's apparent size stays constant while extra height reveals more world space.
    state.camera.position.z = CAMERA_Z * (state.size.height / REFERENCE_HEIGHT_PX)
  })

  return null
}

type IdCardProps = {
  frontImage: string
  className?: string
}

const IdCard = ({ frontImage, className }: IdCardProps) => {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)

  // A ref (not state) so the server/client difference (no `document` during SSR) never touches
  // the rendered output and can't cause a hydration mismatch.
  const eventSourceRef = useRef<HTMLElement | null>(typeof document !== 'undefined' ? document.body : null)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // pointer-events-none so this wrapper (sized to cover the drag range, not just the resting
  // card) never blocks clicks on page content it visually overlaps — drag/click on the card
  // itself still works because Canvas's `eventSource` listens on document.body instead.
  return (
    <div className={cn('pointer-events-none drop-shadow-xl', className)}>
      {/* Needed for smoothed edges on the rope's TubeGeometry facets (ROPE_RADIAL_SEGMENTS). */}
      <Canvas
        eventSource={eventSourceRef as RefObject<HTMLElement>}
        camera={{ position: [0, 0, 20], fov: 20 }}
        dpr={[1, isMobile ? 1.25 : 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'default' }}
        onCreated={state => {
          state.gl.setClearColor(new THREE.Color(0x000000), 0)

          // Without this, a lost WebGL context never recovers — the canvas stays blank forever
          // instead of the browser being allowed to restore it.
          state.gl.domElement.addEventListener('webglcontextlost', event => event.preventDefault())

          // eventSource routes events through document.body (so this oversized, mostly-empty
          // canvas doesn't block clicks on overlapped page content), so pointer NDC must be
          // computed from the canvas's own bounding rect rather than r3f's default clientX/Y.
          state.setEvents({
            compute: (event, s) => {
              const rect = s.gl.domElement.getBoundingClientRect()
              const x = event.clientX - rect.left
              const y = event.clientY - rect.top

              s.pointer.set((x / s.size.width) * 2 - 1, -(y / s.size.height) * 2 + 1)
              s.raycaster.setFromCamera(s.pointer, s.camera)
            }
          })
        }}
      >
        <CameraAlign />
        <ambientLight intensity={Math.PI} />
        <Physics gravity={[0, -40, 0]} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band frontImage={frontImage} isMobile={isMobile} />
        </Physics>
        <StudioLighting />
      </Canvas>
    </div>
  )
}

export default IdCard
