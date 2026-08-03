import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { content, type SectionId } from '../content'
import {
  BEAT_COUNT,
  firstBeatIndexForLabel,
  flightBeats,
  nearestBeatIndex,
  type NavSection,
} from './flight'
import { pointerStore } from './pointerStore'
import { scrollStore } from './scrollStore'
import { sectionCenter } from './sectionMotion'

type ScrollApi = {
  progress: number
  /** Index into flightBeats */
  sectionIndex: number
  section: SectionId
  scrollerRef: RefObject<HTMLDivElement | null>
  scrollToSection: (navIndex: number) => void
  scrollToLabel: (label: NavSection) => void
}

const ScrollContext = createContext<ScrollApi | null>(null)

/** Virtual scroll length — denser when many one-by-one item beats */
export const SCROLL_VH = Math.max(1200, BEAT_COUNT * 95)

/** Touch drags cover less distance than wheel scrolls, so boost their effect */
const TOUCH_SENSITIVITY = 2.4
function isScrollBlockedTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false
  return Boolean(target.closest('.modal-backdrop, .case-wide, input, textarea, select'))
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    let raf = 0
    let touching = false
    let lastTouchY = 0

    const maxScroll = () => el.scrollHeight - el.clientHeight

    const onWheel = (e: WheelEvent) => {
      if (isScrollBlockedTarget(e.target)) return
      e.preventDefault()
      const max = maxScroll()
      if (max <= 0) return
      // Normalize trackpad + mouse wheel into progress space
      scrollStore.nudgeTarget(e.deltaY / max)
    }

    const onTouchStart = (e: TouchEvent) => {
      if (isScrollBlockedTarget(e.target)) return
      touching = true
      lastTouchY = e.touches[0]?.clientY ?? 0
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!touching || isScrollBlockedTarget(e.target)) return
      const y = e.touches[0]?.clientY ?? lastTouchY
      const dy = lastTouchY - y
      lastTouchY = y
      const max = maxScroll()
      if (max <= 0) return
      e.preventDefault()
      scrollStore.nudgeTarget((dy / max) * TOUCH_SENSITIVITY)
    }

    const onTouchEnd = () => {
      touching = false
    }

    const onPointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      pointerStore.setTarget(nx, ny)
    }

    const onPointerLeave = () => {
      pointerStore.setTarget(0, 0)
    }

    const tick = () => {
      pointerStore.tick(0.075)
      const p = scrollStore.tick(0.09)
      const max = maxScroll()
      if (max > 0) {
        const top = p * max
        if (Math.abs(el.scrollTop - top) > 0.5) el.scrollTop = top
      }
      setProgress(p)
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  const sectionIndex = useMemo(() => nearestBeatIndex(progress), [progress])
  const section = flightBeats[sectionIndex]?.label ?? content.sections[0]

  const scrollToLabel = useCallback((label: NavSection) => {
    scrollStore.setTarget(sectionCenter(firstBeatIndexForLabel(label)))
  }, [])

  const scrollToSection = useCallback((navIndex: number) => {
    const label = content.sections[navIndex]
    if (label) scrollToLabel(label)
  }, [scrollToLabel])

  const value = useMemo(
    () => ({
      progress,
      sectionIndex,
      section,
      scrollerRef,
      scrollToSection,
      scrollToLabel,
    }),
    [progress, sectionIndex, section, scrollToSection, scrollToLabel],
  )

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
}

export function useScroll() {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error('useScroll must be used within ScrollProvider')
  return ctx
}
