import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../utils/fx'

/* Premium 3D hero: a glossy heart with floating hearts and sparkles, drawn with three.js.
   three.js is loaded on demand (separate chunk) so the page stays fast, and the scene follows the
   mouse, the scroll position and the active colour theme. If WebGL is unavailable we show a CSS fallback. */

const cssColor = (name, fallback) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

function buildScene(THREE, RoomEnvironment, host) {
  const reduced = prefersReducedMotion()
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15
  renderer.domElement.className = 'hero-scene__canvas'
  host.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
  camera.position.set(0, 0, 10)

  // Image-based lighting gives the heart its glossy reflections without any image files.
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envTexture

  // Heart outline (a classic cubic-bezier heart), extruded with a rounded bevel.
  const shape = new THREE.Shape()
  shape.moveTo(5, 5)
  shape.bezierCurveTo(5, 5, 4, 0, 0, 0)
  shape.bezierCurveTo(-6, 0, -6, 7, -6, 7)
  shape.bezierCurveTo(-6, 11, -3, 15.4, 5, 19)
  shape.bezierCurveTo(12, 15.4, 16, 11, 16, 7)
  shape.bezierCurveTo(16, 7, 16, 0, 10, 0)
  shape.bezierCurveTo(7, 0, 5, 5, 5, 5)

  const bigGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 3.2, bevelEnabled: true, bevelThickness: 1.8, bevelSize: 1.7, bevelSegments: 12, curveSegments: 48,
  })
  bigGeo.center()
  bigGeo.scale(0.115, 0.115, 0.115)

  const smallGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 2, bevelEnabled: true, bevelThickness: 1.4, bevelSize: 1.3, bevelSegments: 5, curveSegments: 16,
  })
  smallGeo.center()
  smallGeo.scale(0.03, 0.03, 0.03)

  const heartMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(cssColor('--brand', '#c3174f')),
    metalness: 0.2, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.25,
  })
  const pivot = new THREE.Group() // animated
  const heart = new THREE.Mesh(bigGeo, heartMat)
  heart.rotation.z = Math.PI // the outline above is drawn point-up-side-down
  pivot.add(heart)
  scene.add(pivot)

  // Small hearts orbiting the big one (instanced: one draw call).
  const COUNT = 34
  const smallMat = new THREE.MeshPhysicalMaterial({ metalness: 0.15, roughness: 0.22, clearcoat: 0.8, envMapIntensity: 1.1 })
  const minis = new THREE.InstancedMesh(smallGeo, smallMat, COUNT)
  const seeds = Array.from({ length: COUNT }, () => ({
    radius: 1.7 + Math.random() * 0.95,
    angle: Math.random() * Math.PI * 2,
    speed: (0.08 + Math.random() * 0.18) * (Math.random() < 0.5 ? -1 : 1),
    height: (Math.random() - 0.5) * 3.4,
    bob: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 1.6,
    scale: 0.45 + Math.random() * 0.8,
  }))
  scene.add(minis)

  // Sparkles
  const sparkCanvas = document.createElement('canvas')
  sparkCanvas.width = 64
  sparkCanvas.height = 64
  const sctx = sparkCanvas.getContext('2d')
  const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.25, 'rgba(255,255,255,0.7)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  sctx.fillStyle = grad
  sctx.fillRect(0, 0, 64, 64)
  const sparkTexture = new THREE.CanvasTexture(sparkCanvas)
  const SPARKS = 140
  const sparkPos = new Float32Array(SPARKS * 3)
  for (let i = 0; i < SPARKS; i += 1) {
    sparkPos[i * 3] = (Math.random() - 0.5) * 8
    sparkPos[i * 3 + 1] = (Math.random() - 0.5) * 6
    sparkPos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1
  }
  const sparkGeo = new THREE.BufferGeometry()
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3))
  const sparkMat = new THREE.PointsMaterial({
    size: 0.16, map: sparkTexture, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending,
  })
  const sparks = new THREE.Points(sparkGeo, sparkMat)
  scene.add(sparks)

  // Lights
  const keyLight = new THREE.PointLight(0xffffff, 70, 40, 2)
  keyLight.position.set(4, 4, 7)
  const rimLight = new THREE.PointLight(0xffffff, 60, 40, 2)
  rimLight.position.set(-6, 2, -3)
  const fill = new THREE.HemisphereLight(0xffffff, 0x220011, 0.35)
  scene.add(keyLight, rimLight, fill)

  const palette = []
  const applyTheme = () => {
    const brand = new THREE.Color(cssColor('--brand', '#c3174f'))
    const accent = new THREE.Color(cssColor('--crimson', '#f3b6a4'))
    const second = new THREE.Color(cssColor('--lime', '#e7c778'))
    heartMat.color.copy(brand)
    keyLight.color.copy(accent)
    rimLight.color.copy(second)
    sparkMat.color.copy(accent)
    palette.length = 0
    palette.push(brand.clone().offsetHSL(0, 0, 0.08), accent, second, brand.clone().offsetHSL(0.02, 0, 0.18))
    for (let i = 0; i < COUNT; i += 1) minis.setColorAt(i, palette[i % palette.length])
    if (minis.instanceColor) minis.instanceColor.needsUpdate = true
  }
  applyTheme()
  const themeObserver = new MutationObserver(applyTheme)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  // Sizing
  const resize = () => {
    const w = Math.max(host.clientWidth, 1)
    const h = Math.max(host.clientHeight, 1)
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.position.z = camera.aspect < 0.85 ? 13.5 : 11
    camera.updateProjectionMatrix()
  }
  resize()
  const sizeObserver = new ResizeObserver(() => {
    resize()
    renderer.render(scene, camera)
  })
  sizeObserver.observe(host)

  // Interaction
  const target = { x: 0, y: 0 }
  const current = { x: 0, y: 0 }
  const onPointer = (e) => {
    const r = host.getBoundingClientRect()
    target.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2))
    target.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2))
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  let visible = true
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
  })
  io.observe(host)

  const dummy = new THREE.Object3D()
  const clock = new THREE.Clock()
  let frame = 0
  let disposed = false

  const draw = (t) => {
    current.x += (target.x - current.x) * 0.06
    current.y += (target.y - current.y) * 0.06
    const beat = 1 + 0.045 * Math.max(0, Math.sin(t * 2.6)) ** 6
    pivot.rotation.y = Math.sin(t * 0.5) * 0.45 + current.x * 0.7
    pivot.rotation.x = current.y * 0.4 + Math.sin(t * 0.7) * 0.06
    pivot.position.y = Math.sin(t * 0.9) * 0.14 - Math.min(window.scrollY, 700) * 0.0014
    pivot.scale.setScalar(beat)

    for (let i = 0; i < COUNT; i += 1) {
      const s = seeds[i]
      const a = s.angle + t * s.speed
      dummy.position.set(Math.cos(a) * s.radius, s.height + Math.sin(t * 0.8 + s.bob) * 0.25, Math.sin(a) * s.radius * 0.6 - 0.5)
      dummy.rotation.set(t * s.spin * 0.4, t * s.spin, Math.PI)
      dummy.scale.setScalar(s.scale)
      dummy.updateMatrix()
      minis.setMatrixAt(i, dummy.matrix)
    }
    minis.instanceMatrix.needsUpdate = true
    sparks.rotation.y = t * 0.02 + current.x * 0.1
    sparks.rotation.x = current.y * 0.06
    renderer.render(scene, camera)
  }

  const loop = () => {
    if (disposed) return
    frame = requestAnimationFrame(loop)
    if (!visible || document.hidden) return
    draw(clock.getElapsedTime())
  }

  if (reduced) draw(0.6)
  else loop()
  host.dataset.ready = 'true'

  return () => {
    disposed = true
    cancelAnimationFrame(frame)
    window.removeEventListener('pointermove', onPointer)
    themeObserver.disconnect()
    sizeObserver.disconnect()
    io.disconnect()
    bigGeo.dispose()
    smallGeo.dispose()
    sparkGeo.dispose()
    heartMat.dispose()
    smallMat.dispose()
    sparkMat.dispose()
    sparkTexture.dispose()
    envTexture.dispose()
    pmrem.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement)
    delete host.dataset.ready
  }
}

export default function HeroScene() {
  const host = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = host.current
    if (!el) return undefined
    if (!hasWebGL()) {
      setFailed(true)
      return undefined
    }
    let disposed = false
    let cleanup = () => {}
    ;(async () => {
      try {
        const [THREE, env] = await Promise.all([
          import('three'),
          import('three/examples/jsm/environments/RoomEnvironment.js'),
        ])
        if (disposed) return
        cleanup = buildScene(THREE, env.RoomEnvironment, el)
      } catch {
        if (!disposed) setFailed(true)
      }
    })()
    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  return (
    <div className="hero-scene" ref={host} aria-hidden="true">
      <div className="hero-scene__glow" />
      {failed && (
        <div className="hero-scene__fallback">
          <svg viewBox="0 0 64 64" role="img" aria-label="">
            <path d="M32 54S8 40 8 23a12 12 0 0 1 24-4 12 12 0 0 1 24 4c0 17-24 31-24 31z" />
          </svg>
        </div>
      )}
    </div>
  )
}
