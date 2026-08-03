import { useEffect, useState } from 'react'
import { content } from '../content'

export function Loader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let value = 0
    const id = window.setInterval(() => {
      value = Math.min(100, value + Math.random() * 12 + 4)
      if (value >= 100) {
        window.clearInterval(id)
        setPct(100)
        setDone(true)
        window.setTimeout(onDone, 650)
      } else {
        setPct(Math.floor(value))
      }
    }, 60)

    return () => window.clearInterval(id)
  }, [onDone])

  return (
    <div className={`loader ${done ? 'done' : ''}`} aria-hidden={done}>
      <div className="word">{content.loaderWord}</div>
      <div className="pct">{pct}%</div>
    </div>
  )
}
