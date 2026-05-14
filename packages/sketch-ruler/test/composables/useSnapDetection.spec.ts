import { describe, test, expect } from 'vitest'
import { ref } from 'vue'
import { useSnapDetection } from '../../src/composables/useSnapDetection'

describe('useSnapDetection', () => {
  test('returns null when no targets', () => {
    const { snap } = useSnapDetection({
      threshold: ref(10),
      scale: ref(1)
    })
    expect(snap(50, 'h')).toBeNull()
  })

  test('snaps to nearest tick target', () => {
    const { snap } = useSnapDetection({
      threshold: ref(10),
      scale: ref(1),
      tickTargets: ref([0, 50, 100])
    })
    const result = snap(52, 'h')
    expect(result).not.toBeNull()
    // 默认 strength=0.5（软吸附）：52*0.5 + 50*0.5 = 51
    expect(result!.position).toBe(51)
    expect(result!.target.type).toBe('tick')
  })

  test('does not snap when beyond threshold', () => {
    const { snap } = useSnapDetection({
      threshold: ref(5),
      scale: ref(1),
      tickTargets: ref([0, 100])
    })
    expect(snap(50, 'h')).toBeNull()
  })

  test('applies soft snap strength', () => {
    const { snap } = useSnapDetection({
      threshold: ref(10),
      scale: ref(1),
      tickTargets: ref([100]),
      strength: ref(0.5)
    })
    const result = snap(90, 'h')
    expect(result).not.toBeNull()
    expect(result!.position).toBe(95)
    expect(result!.original).toBe(90)
  })

  test('scales threshold with zoom level', () => {
    const { snap } = useSnapDetection({
      threshold: ref(10),
      scale: ref(2),
      tickTargets: ref([100])
    })
    const result = snap(95, 'h')
    expect(result).not.toBeNull()
  })

  test('guide-line targets have higher priority', () => {
    const { snap } = useSnapDetection({
      threshold: ref(10),
      scale: ref(1),
      tickTargets: ref([50]),
      guideLineTargets: ref([52])
    })
    const result = snap(52, 'h')
    expect(result).not.toBeNull()
    expect(result!.position).toBe(52)
  })

  test('returns null for zero or negative scale', () => {
    const { snap } = useSnapDetection({
      threshold: ref(10),
      scale: ref(0),
      tickTargets: ref([0, 50])
    })
    expect(snap(50, 'h')).toBeNull()
  })
})
