function findEventIndex(pointers: PointerEvent[], event: PointerEvent) {
  let i = pointers.length
  while (i--) {
    if (pointers[i].pointerId === event.pointerId) return i
  }
  return -1
}

export function addPointer(pointers: PointerEvent[], event: PointerEvent) {
  const i = findEventIndex(pointers, event)
  if (i > -1) pointers.splice(i, 1)
  pointers.push(event)
}

export function removePointer(pointers: PointerEvent[], event: PointerEvent) {
  const i = findEventIndex(pointers, event)
  if (i > -1) pointers.splice(i, 1)
}

export function getMiddle(pointers: PointerEvent[]) {
  const p = pointers.slice(0)
  let e1: Pick<PointerEvent, 'clientX' | 'clientY'> = p.pop() as any
  let e2: PointerEvent
  while ((e2 = p.pop() as any)) {
    e1 = {
      clientX: (e2.clientX - e1.clientX) / 2 + e1.clientX,
      clientY: (e2.clientY - e1.clientY) / 2 + e1.clientY
    }
  }
  return e1
}