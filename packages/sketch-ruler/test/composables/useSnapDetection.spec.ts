import { describe, test, expect } from 'vitest'
import { ref } from 'vue'
import { useSnapDetection } from '../../src/composables/useSnapDetection'

describe('useSnapDetection', () => {
  // 吸附检测组合式函数测试
  test('returns null when no targets', () => {
    // 无目标时返回 null
    const { snap } = useSnapDetection({
      threshold: ref(10),
      scale: ref(1)
    })
    expect(snap(50, 'h')).toBeNull()
  })

  test('snaps to nearest tick target', () => {
    // 吸附到最近的刻度目标
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
    // 超出阈值时不吸附
    const { snap } = useSnapDetection({
      threshold: ref(5),
      scale: ref(1),
      tickTargets: ref([0, 100])
    })
    expect(snap(50, 'h')).toBeNull()
  })

  test('applies soft snap strength', () => {
    // 应用软吸附强度
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
    // 阈值随缩放级别变化
    const { snap } = useSnapDetection({
      threshold: ref(10),
      scale: ref(2),
      tickTargets: ref([100])
    })
    const result = snap(95, 'h')
    expect(result).not.toBeNull()
  })

  test('guide-line targets have higher priority', () => {
    // 参考线目标优先级更高
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
    // 缩放为零或负数时返回 null
    const { snap } = useSnapDetection({
      threshold: ref(10),
      scale: ref(0),
      tickTargets: ref([0, 50])
    })
    expect(snap(50, 'h')).toBeNull()
  })
})
