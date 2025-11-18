type PointerEventName = 'pointerdown' | 'pointermove' | 'pointerup' | 'pointerleave' | 'pointercancel'

const events = {
  down: 'pointerdown',
  move: 'pointermove',
  up: 'pointerup pointerleave pointercancel'
}

export function onPointer(
  event: 'down' | 'move' | 'up',
  elem: HTMLElement | Document,
  handler: (event: PointerEvent) => void,
  eventOpts?: boolean | AddEventListenerOptions
) {
  events[event].split(' ').forEach((name) => {
    ;(elem as HTMLElement).addEventListener<PointerEventName>(name as PointerEventName, handler, eventOpts)
  })
}

export function destroyPointer(
  event: 'down' | 'move' | 'up',
  elem: HTMLElement | Document,
  handler: (event: PointerEvent) => void
) {
  events[event].split(' ').forEach((name) => {
    ;(elem as HTMLElement).removeEventListener<PointerEventName>(name as PointerEventName, handler)
  })
}