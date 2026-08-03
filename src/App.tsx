import { useCallback, useState } from 'react'
import { Loader } from './components/Loader'
import { Overlay } from './components/Overlay'
import { Scene } from './components/Scene'
import { Stage } from './components/Stage'
import { SCROLL_VH, ScrollProvider, useScroll } from './hooks/useScroll'

function Scroller() {
  const { scrollerRef } = useScroll()
  return (
    <div className="scroller" ref={scrollerRef}>
      <div style={{ height: `${SCROLL_VH}vh` }} />
    </div>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [showLoader, setShowLoader] = useState(true)
  const onDone = useCallback(() => {
    setReady(true)
    window.setTimeout(() => setShowLoader(false), 900)
  }, [])

  return (
    <ScrollProvider>
      <Scene />
      <div className="vignette" />
      <div className="grain" />
      <Scroller />
      {ready && (
        <>
          <Stage />
          <Overlay />
        </>
      )}
      {showLoader && <Loader onDone={onDone} />}
    </ScrollProvider>
  )
}
