import { content, type CaseStudy, type Talk } from '../content'

export type NavSection = (typeof content.sections)[number]

export type FlightBeat =
  | { id: string; label: NavSection; kind: 'intro' }
  | { id: string; label: NavSection; kind: 'pitch' }
  | { id: string; label: NavSection; kind: 'decade' }
  | { id: string; label: NavSection; kind: 'story' }
  | { id: string; label: NavSection; kind: 'numbers' }
  | { id: string; label: NavSection; kind: 'case'; case: CaseStudy; caseIndex: number; caseCount: number }
  | { id: string; label: NavSection; kind: 'talk'; talk: Talk; talkIndex: number; talkCount: number }
  | { id: string; label: NavSection; kind: 'manifesto' }
  | { id: string; label: NavSection; kind: 'contact' }

/** One scroll beat each — cases/talks fly in one-by-one, not side-by-side */
export const flightBeats: FlightBeat[] = [
  { id: 'intro', label: 'intro', kind: 'intro' },
  { id: 'pitch', label: 'About Me', kind: 'pitch' },
  { id: 'decade', label: 'Experience', kind: 'decade' },
  { id: 'story', label: 'More', kind: 'story' },
  { id: 'numbers', label: 'Achievements', kind: 'numbers' },
  ...content.cases.map((caseItem, caseIndex) => ({
    id: `case-${caseIndex}`,
    label: 'Projects' as const,
    kind: 'case' as const,
    case: caseItem,
    caseIndex,
    caseCount: content.cases.length,
  })),
  ...content.talks.map((talk, talkIndex) => ({
    id: `talk-${talkIndex}`,
    label: 'talks' as const,
    kind: 'talk' as const,
    talk,
    talkIndex,
    talkCount: content.talks.length,
  })),
  { id: 'manifesto', label: 'manifesto', kind: 'manifesto' },
  { id: 'contact', label: "Contact Me!", kind: 'contact' },
]

/** Item beats sit closer together along the flight path */
function beatWeight(beat: FlightBeat) {
  return beat.kind === 'case' || beat.kind === 'talk' ? 0.52 : 1.15
}

const weights = flightBeats.map(beatWeight)
const weightTotal = weights.reduce((sum, w) => sum + w, 0)

export const BEAT_COUNT = flightBeats.length

/** Peak progress position for each beat (0→1) */
export const beatCenters: number[] = (() => {
  const centers: number[] = []
  let acc = 0
  for (let i = 0; i < weights.length; i++) {
    centers.push((acc + weights[i] * 0.5) / weightTotal)
    acc += weights[i]
  }
  // Pull first beat toward the start so intro is readable immediately
  if (centers.length) centers[0] = Math.min(centers[0], 0.035)
  return centers
})()

/** Half-window in progress space — tighter for chained item beats */
export function beatHalfWindow(index: number) {
  const w = weights[index] / weightTotal
  const beat = flightBeats[index]
  const mul = beat.kind === 'case' || beat.kind === 'talk' ? 0.72 : 0.95
  return w * mul
}

export function nearestBeatIndex(progress: number) {
  let best = 0
  let bestScore = -Infinity
  for (let i = 0; i < beatCenters.length; i++) {
    const score = -Math.abs(progress - beatCenters[i])
    if (score > bestScore) {
      bestScore = score
      best = i
    }
  }
  return best
}

export function firstBeatIndexForLabel(label: NavSection) {
  return Math.max(
    0,
    flightBeats.findIndex((b) => b.label === label),
  )
}
