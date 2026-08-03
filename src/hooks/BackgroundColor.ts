import * as THREE from 'three'
import { sectionColors } from './colors'
import { flightBeats, beatCenters } from './flight'

const beatColors = flightBeats.map((b) => new THREE.Color(sectionColors[b.label]))

const tmp = new THREE.Color()

export function colorAtProgress(progress: number): THREE.Color {
  let i = 0
  while (i < beatCenters.length - 1 && progress > beatCenters[i + 1]) i++

  const c0 = beatColors[i]
  if (i >= beatCenters.length - 1) return c0

  const t0 = beatCenters[i]
  const t1 = beatCenters[i + 1]
  const t = t1 > t0 ? THREE.MathUtils.clamp((progress - t0) / (t1 - t0), 0, 1) : 0

  return tmp.copy(c0).lerp(beatColors[i + 1], t)
}