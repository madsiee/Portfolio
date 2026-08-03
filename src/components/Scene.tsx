import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { pointerStore } from '../hooks/pointerStore'
import { scrollStore } from '../hooks/scrollStore'
import { colorAtProgress } from '../hooks/BackgroundColor'

const starVertexShader = /* glsl */ `
  attribute float size;
  attribute float phase;
  attribute float speed;
  uniform float uTime;
  varying float vTwinkle;
  varying float vBright;

  void main() {
    vTwinkle = 0.5 + 0.5 * sin(uTime * speed + phase);
    vBright = size;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float dist = max(1.0, -mvPosition.z);
    gl_PointSize = min(size * (220.0 / dist), 9.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const starFragmentShader = /* glsl */ `
  varying float vTwinkle;
  varying float vBright;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);

    // Soft circular core — not a square
    float core = smoothstep(0.5, 0.0, d);
    float glow = smoothstep(0.5, 0.12, d) * 0.45;

    // Faint diffraction spikes
    float spikeX = (1.0 - smoothstep(0.0, 0.045, abs(uv.x))) * (1.0 - smoothstep(0.0, 0.48, abs(uv.y)));
    float spikeY = (1.0 - smoothstep(0.0, 0.045, abs(uv.y))) * (1.0 - smoothstep(0.0, 0.48, abs(uv.x)));
    float spikes = (spikeX + spikeY) * 0.55 * smoothstep(0.5, 0.08, d);

    float alpha = clamp(core * 0.95 + glow * 0.5 + spikes, 0.0, 1.0);
    alpha *= mix(0.45, 1.0, clamp(vBright / 3.5, 0.0, 1.0));
    alpha *= 0.52; // dim overall — new line
    if (alpha < 0.02) discard;

    vec3 color = vec3(0.96, 0.94, 0.9);
    gl_FragColor = vec4(color, alpha);
  }
`

function Starfield() {
  const points = useRef<THREE.Points>(null)
  const material = useRef<THREE.ShaderMaterial>(null)

  const { positions, sizes, phases, speeds } = useMemo(() => {
    const count = 4200
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 80
      positions[i3 + 1] = (Math.random() - 0.5) * 50
      positions[i3 + 2] = -Math.random() * 320
      // Mix of tiny distant pinpricks and a few larger sparkles
      sizes[i] = Math.random() < 0.08 ? Math.random() * 2.8 + 1.6 : Math.random() * 1.4 + 0.35
      phases[i] = Math.random() * Math.PI * 2
      speeds[i] = Math.random() * 1.2 + 0.4
    }
    return { positions, sizes, phases, speeds }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    [],
  )

  useFrame(({ camera }, delta) => {
    const progress = scrollStore.get()
    const { x: mx, y: my } = pointerStore.get()
    const targetZ = -progress * 260
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 4, delta)
    // Path drift + mouse look — floating cockpit feel
    const pathX = Math.sin(progress * Math.PI * 2) * 0.35
    const pathY = Math.cos(progress * Math.PI * 1.5) * 0.2
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pathX + mx * 1.1, 3.2, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pathY + my * 0.7, 3.2, delta)
    camera.lookAt(mx * 1.4, my * 1.0, camera.position.z - 12)

    if (points.current) {
      points.current.rotation.z += delta * 0.012
      points.current.rotation.x = THREE.MathUtils.damp(
        points.current.rotation.x,
        my * 0.04,
        2.5,
        delta,
      )
      points.current.rotation.y = THREE.MathUtils.damp(
        points.current.rotation.y,
        mx * 0.05,
        2.5,
        delta,
      )
    }

    if (material.current) {
      material.current.uniforms.uTime.value += delta
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-phase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-speed" args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function NebulaDust() {
  const mesh = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const count = 700
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40
      arr[i * 3 + 1] = (Math.random() - 0.5) * 24
      arr[i * 3 + 2] = -Math.random() * 300
    }
    return arr
  }, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: /* glsl */ `
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            float dist = max(1.0, -mvPosition.z);
            gl_PointSize = 48.0 / dist;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: /* glsl */ `
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            float alpha = smoothstep(0.5, 0.0, d) * 0.14;
            if (alpha < 0.01) discard;
            gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  useFrame((_, delta) => {
    if (!mesh.current) return
    const { x: mx, y: my } = pointerStore.get()
    mesh.current.rotation.y += delta * 0.02
    mesh.current.rotation.x = THREE.MathUtils.damp(mesh.current.rotation.x, my * 0.06, 2, delta)
    mesh.current.position.x = THREE.MathUtils.damp(mesh.current.position.x, mx * 1.5, 2, delta)
  })

  return (
    <points ref={mesh} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
    </points>
  )
}

function BackgroundColor() {
  useFrame(({ scene }, delta) => {
    if (!(scene.background instanceof THREE.Color)) return
    const target = colorAtProgress(scrollStore.get())
    scene.background.r = THREE.MathUtils.damp(scene.background.r, target.r, 3, delta)
    scene.background.g = THREE.MathUtils.damp(scene.background.g, target.g, 3, delta)
    scene.background.b = THREE.MathUtils.damp(scene.background.b, target.b, 3, delta)
  })
  return null
}

export function Scene() {
  return (
    <div className="canvas-wrap">
      <Canvas
        camera={{ position: [0, 0, 0], fov: 60, near: 0.1, far: 500 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#121010']} />
        <BackgroundColor />
        <Starfield />
        <NebulaDust />
      </Canvas>
    </div>
  )
}