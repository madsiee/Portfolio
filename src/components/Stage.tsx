import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { content, type CaseStudy, type Talk } from '../content'
import { flightBeats, type FlightBeat } from '../hooks/flight'
import { pointerStore } from '../hooks/pointerStore'
import { scrollStore } from '../hooks/scrollStore'
import { applySectionMotion, sectionMotion } from '../hooks/sectionMotion'
import { useScroll } from '../hooks/useScroll'

function Portrait() {
  const [ok, setOk] = useState(true)
  if (!ok) {
    return (
      <div className="portrait-fallback">
        Drop your photo at
        <br />
        /public/portrait.jpg
      </div>
    )
  }
  return (
    <img
      src={content.intro.portrait}
      alt=""
      onError={() => setOk(false)}
    />
  )
}

function CaseModal({
  item,
  onClose,
}: {
  item: CaseStudy
  onClose: () => void
}) {
  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <article
        className="case-wide"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal
      >
        <button type="button" className="close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        {item.badge && <em className="badge">{item.badge}</em>}
        <h2>{item.title}</h2>
        <div className="meta">{item.meta}</div>
        <div className="case-body">
          <div className="case-main">
            {item.body.split('\n\n').map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            {item.process && (
              <div className="case-process">
                <h4>Process</h4>
                <div className="chips">
                  {item.process.map((step) => (
                    <i key={step}>{step}</i>
                  ))}
                </div>
              </div>
            )}
            {item.note && <p className="case-note">{item.note}</p>}
            {(item.links?.length || item.figma) && (
              <div className="case-links">
                {item.links?.map((l) => (
                  <a key={l.href} className="case-link" href={l.href} target="_blank" rel="noreferrer">
                    {l.label}
                  </a>
                ))}
                {item.figma && (
                  <a className="case-link" href={item.figma} target="_blank" rel="noreferrer">
                    explore the designs ↗
                  </a>
                )}
              </div>
            )}
          </div>
          <aside className="facts">
            {item.facts.map((f) => (
              <div key={f}>{f}</div>
            ))}
          </aside>
        </div>
        {item.metrics && (
          <div className="case-metrics">
            <h4>{item.metrics.title}</h4>
            <div className="items">
              {item.metrics.items.map((m) => (
                <div className="metric" key={m.label}>
                  <b>{m.value}</b>
                  <span>{m.label}</span>
                  {m.note && <em>{m.note}</em>}
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}

function FlyPanel({
  index,
  children,
}: {
  index: number
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0
    const tick = () => {
      applySectionMotion(el, sectionMotion(scrollStore.get(), index))
      raf = requestAnimationFrame(tick)
    }

    applySectionMotion(el, sectionMotion(scrollStore.get(), index))
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [index])

  return (
    <section ref={ref} className="panel">
      {children}
    </section>
  )
}

function Marquee() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0

    const tick = () => {
      const visual = scrollStore.get()
      const { x, y } = pointerStore.get()
      const fade = Math.max(0, 1 - visual * 9)
      el.style.opacity = String(0.18 * fade)
      el.style.transform = [
        `translate3d(${x * 30}px, ${visual * -40 + y * 18}px, 0)`,
        `rotateZ(${x * -1.5}deg)`,
        `scale(${1 + visual * 0.35})`,
      ].join(' ')
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const style = { opacity: 0.18 } satisfies CSSProperties

  return (
    <div className="marquee" ref={ref} style={style} aria-hidden>
      <span>
        {content.loaderWord} + {content.loaderWord} + {content.loaderWord} +{' '}
        {content.loaderWord}
      </span>
    </div>
  )
}

function CaseBeat({
  item,
  index,
  count,
  onOpen,
}: {
  item: CaseStudy
  index: number
  count: number
  onOpen: () => void
}) {
  return (
    <button type="button" className="fly-card case-card" onClick={onOpen}>
      <div className="fly-card-index">
        case {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
      </div>
      {item.badge && <em className="badge">{item.badge}</em>}
      <div className="meta">{item.meta}</div>
      <h3>{item.title}</h3>
      <p>{item.body}</p>
      <span className="fly-card-cta">open case ↗</span>
    </button>
  )
}

function TalkBeat({
  item,
  index,
  count,
}: {
  item: Talk
  index: number
  count: number
}) {
  const href = item.video
    ? `https://www.youtube.com/watch?v=${item.video}${item.start ? `&t=${item.start}` : ''}`
    : undefined
  const inner = (
    <>
      <div className="fly-card-index">
        talk {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
      </div>
      <div className="meta">{item.meta}</div>
      <h3>{item.title}</h3>
      <div className="tags">
        {item.tags.map((tag) => (
          <i key={tag}>{tag}</i>
        ))}
      </div>
    </>
  )

  if (href) {
    return (
      <a className="fly-card talk-card" href={href} target="_blank" rel="noreferrer">
        {inner}
      </a>
    )
  }

  return <div className="fly-card talk-card">{inner}</div>
}

function BeatContent({
  beat,
  onOpenCase,
}: {
  beat: FlightBeat
  onOpenCase: (item: CaseStudy) => void
}) {
  switch (beat.kind) {
    case 'intro':
      return (
        <div className="intro-grid">
          <div>
            <div className="intro-name">
              <div className="first">{content.intro.first}</div>
              <div className="last">{content.intro.last}</div>
              <div className="alias">{content.intro.alias}</div>
            </div>
            <ul className="roles">
              {content.intro.roles.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </div>
          <div className="portrait-frame">
            <Portrait />
          </div>
        </div>
      )
    case 'pitch':
      return (
        <div className="pitch-block">
          <div className="eyebrow">{content.pitch.title}</div>
          <p>{content.pitch.body}</p>
        </div>
      )
    case 'decade':
      return (
        <div className="decade-block">
          <h2>{content.decade.title}</h2>
          <div className="logo-wall">
            {content.decade.logos.map((logo) => (
              <div className="logo-chip" key={logo}>
                {logo}
              </div>
            ))}
          </div>
        </div>
      )
    case 'story':
      return (
        <div className="story-grid">
          <div className="story-roles">
            {content.story.roles.map((item) =>
              item.period ? (
                <div className="item" key={item.role + (item.period ?? '')}>
                  <span>{item.role}</span>
                  <span className="period">{item.period}</span>
                </div>
              ) : (
                <div className="item divider" key={item.role}>
                  {item.role}
                </div>
              ),
            )}
          </div>
          <div className="story-facts">
            {content.story.facts.map((f, i) => (
              <span key={`${f}-${i}`}>{f || '—'}</span>
            ))}
          </div>
        </div>
      )
    case 'numbers':
      return (
        <div className="numbers-block">
          <h2>{content.numbers.title}</h2>
          <div className="sub">{content.numbers.sub}</div>
          <div className="stats-grid">
            {content.numbers.stats.map((s) => (
              <div className="stat" key={s.label}>
                <b>
                  {s.prefix}
                  {s.n}
                  {s.suffix}
                </b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )
    case 'case':
      return (
        <CaseBeat
          item={beat.case}
          index={beat.caseIndex}
          count={beat.caseCount}
          onOpen={() => onOpenCase(beat.case)}
        />
      )
    case 'talk':
      return (
        <TalkBeat
          item={beat.talk}
          index={beat.talkIndex}
          count={beat.talkCount}
        />
      )
    case 'manifesto':
      return (
        <div className="manifesto-block">
          {content.manifesto.map((line) => (
            <p className="qa" key={line.slice(0, 32)}>
              {line}
            </p>
          ))}
        </div>
      )
    case 'contact':
      return (
        <div className="contact-block">
          <h2>{content.contact.title}</h2>
          <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
          <div className="note">{content.contact.note}</div>
        </div>
      )
  }
}

export function Stage() {
  const { sectionIndex } = useScroll()
  const [activeCase, setActiveCase] = useState<CaseStudy | null>(null)

  return (
    <>
      <div className="stage">
        {flightBeats.map((beat, index) => (
          <FlyPanel key={beat.id} index={index}>
            <BeatContent beat={beat} onOpenCase={setActiveCase} />
          </FlyPanel>
        ))}
      </div>

      {sectionIndex < 2 && <Marquee />}

      {activeCase && <CaseModal item={activeCase} onClose={() => setActiveCase(null)} />}
    </>
  )
}