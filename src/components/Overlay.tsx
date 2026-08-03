import { useState } from 'react'
import { content } from '../content'
import { useScroll } from '../hooks/useScroll'

function StarMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <rect x="1" y="1" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M16 2v6M16 24v6M2 16h6M24 16h6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function Overlay() {
  const { progress, section, scrollToLabel } = useScroll()
  const [menuOpen, setMenuOpen] = useState(false)
  const hintOpacity = progress < 0.04 ? 1 : Math.max(0, 1 - (progress - 0.04) * 12)

  return (
    <div className="overlay">
      <header className="header">
        <div className="brand">
          <StarMark />
          <span>{content.brand}</span>
        </div>
        <div className="status">{content.status}</div>
      </header>

      <div className="progress-track" aria-hidden>
        <div className="progress-fill" style={{ height: `${progress * 100}%` }} />
      </div>

      <nav className="section-nav">
        {menuOpen && (
          <div className="section-menu">
            {content.sections.map((id) => (
              <button
                key={id}
                type="button"
                className={id === section ? 'active' : ''}
                onClick={() => {
                  scrollToLabel(id)
                  setMenuOpen(false)
                }}
              >
                {id}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          className="section-label"
          onClick={() => setMenuOpen((v) => !v)}
        >
          section <b>{section}</b>
          <i className={`chev ${menuOpen ? 'open' : ''}`} />
        </button>
      </nav>

      <div className="hint" style={{ opacity: hintOpacity }}>
        <span>{content.scrollHint}</span>
        <div className="line" />
      </div>
    </div>
  )
}
