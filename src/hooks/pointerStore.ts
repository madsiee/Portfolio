type Listener = () => void

/** Normalized pointer in [-1, 1], origin at screen center */
let x = 0
let y = 0
let tx = 0
let ty = 0
const listeners = new Set<Listener>()

export const pointerStore = {
  get: () => ({ x, y }),
  setTarget: (nx: number, ny: number) => {
    tx = Math.min(1, Math.max(-1, nx))
    ty = Math.min(1, Math.max(-1, ny))
  },
  tick: (ease = 0.07) => {
    x += (tx - x) * ease
    y += (ty - y) * ease
    listeners.forEach((l) => l())
    return { x, y }
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}
