import { pointerStore } from './pointerStore'
import { BEAT_COUNT, beatCenters, beatHalfWindow } from './flight'

export const SECTION_COUNT = BEAT_COUNT

export type SectionMotion = {
  opacity: number
  scale: number
  z: number
  blur: number
  interactive: boolean
  fromPeak: number
  proximity: number
}

const FAR: SectionMotion = {
  opacity: 0,
  scale: 0.18,
  z: -720,
  blur: 12,
  interactive: false,
  fromPeak: -1,
  proximity: 0,
}

const PAST: SectionMotion = {
  opacity: 0,
  scale: 1.75,
  z: 380,
  blur: 9,
  interactive: false,
  fromPeak: 1,
  proximity: 0,
}

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

export function sectionCenter(index: number) {
  return beatCenters[index] ?? 0
}

/**
 * Continuous fly-through for one beat.
 * Cases/talks are separate beats so they arrive one after another.
 */
export function sectionMotion(progress: number, index: number): SectionMotion {
  const mid = sectionCenter(index)
  const half = beatHalfWindow(index)
  const enter = mid - half
  const exit = mid + half

  if (progress <= enter) return FAR
  if (progress >= exit) return PAST

  const u = (progress - enter) / (exit - enter)
  const fromPeak = (u - 0.5) * 2
  const proximity = smoothstep(1 - Math.abs(fromPeak))
  const approaching = fromPeak < 0
  const leave = 1 - proximity

  const scale = approaching ? 0.16 + proximity * 0.84 : 1 + leave * 0.75
  const z = approaching ? -700 * leave : 360 * leave
  const opacity = Math.pow(proximity, 1.08)
  const blur = leave * 8

  return {
    opacity,
    scale,
    z,
    blur,
    interactive: proximity > 0.4,
    fromPeak,
    proximity,
  }
}

export function applySectionMotion(el: HTMLElement, motion: SectionMotion) {
  const { x: mx, y: my } = pointerStore.get()
  const visible = motion.opacity > 0.02
  const steer = 0.35 + motion.proximity * 0.65
  const approachBoost = motion.fromPeak < 0 ? 1.25 : 0.85
  const floatX = mx * 42 * steer
  const floatY = my * 28 * steer
  const rotY = mx * 11 * steer * approachBoost
  const rotX = -my * 7 * steer * approachBoost
  const rotZ = mx * my * -2.5 * steer

  el.style.opacity = String(motion.opacity)
  el.style.visibility = visible ? 'visible' : 'hidden'
  el.style.transform = [
    `translate3d(${floatX.toFixed(2)}px, ${floatY.toFixed(2)}px, ${motion.z.toFixed(1)}px)`,
    `rotateX(${rotX.toFixed(2)}deg)`,
    `rotateY(${rotY.toFixed(2)}deg)`,
    `rotateZ(${rotZ.toFixed(2)}deg)`,
    `scale(${motion.scale})`,
  ].join(' ')
  el.style.filter = motion.blur > 0.15 ? `blur(${motion.blur.toFixed(2)}px)` : 'none'
  el.style.pointerEvents = motion.interactive ? 'auto' : 'none'
}
