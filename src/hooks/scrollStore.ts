type Listener = () => void

let progress = 0
let target = 0
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach((l) => l())
}

export const scrollStore = {
  get: () => progress,
  getTarget: () => target,
  set: (value: number) => {
    progress = value
    target = value
    emit()
  },
  setTarget: (value: number) => {
    target = Math.min(1, Math.max(0, value))
  },
  nudgeTarget: (deltaProgress: number) => {
    target = Math.min(1, Math.max(0, target + deltaProgress))
  },
  /** Soft follow toward target — call once per frame */
  tick: (ease = 0.085) => {
    const next = progress + (target - progress) * ease
    if (Math.abs(next - progress) > 0.00001 || Math.abs(target - progress) > 0.00001) {
      progress = Math.abs(target - next) < 0.00008 ? target : next
      emit()
    }
    return progress
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}
