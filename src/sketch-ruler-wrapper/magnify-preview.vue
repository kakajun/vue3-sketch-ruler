<template>
  <div
    class="editor-visual"
    id="screens"
    ref="screensRef"
    @wheel="handleWheel"
    @scroll="handleScroll"
  >
    <div ref="containerRef" class="editor-visual__wrap">
      <!-- 小图片 -->
      <div
        class="vue-magnify-preview"
        :style="wrapperStyle"
        ref="previewWarrperRef"
      >
        <slot />

        <!-- 遮罩 -->
        <span
          class="follow-unit"
          :style="followStyle"
          v-show="isInside"
          ref="followRef"
        >
          <i></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useHoverElement } from './hooks/useHoverElement'
import { useElementRect } from './hooks/useElementRect'
import { ref, computed, inject } from 'vue'
import { MagnifyProvide } from './index-types'
export default {
  props: ['previewImg'],
  components: {},
  setup() {
    const followRef = ref(null)
    /* 获取小图框子定位 */
    const previewWarrperRef = ref(null)
    const { offsetLeft, offsetTop, isInside, width, height, x, y } =
      useHoverElement(previewWarrperRef)
    const { prveiwInfo, followSize, prevSize, draggleRate } = inject(
      'magnify'
    ) as MagnifyProvide
    /* 设置遮罩样式 */
    const followStyle = computed(() => {
      const { width: fWidth, height: fHeight } = useElementRect(followRef)
      const maxLeft = width.value - fWidth.value
      const maxTop = height.value - fHeight.value
      let left = x.value - offsetLeft.value - fWidth.value / 2
      let top = y.value - offsetTop.value - fHeight.value / 2
      left = left > 0 ? Math.min(left, maxLeft) : 0
      top = top > 0 ? Math.min(top, maxTop) : 0
      prveiwInfo.followX = left
      prveiwInfo.followY = top
      prveiwInfo.followW = fWidth.value
      prveiwInfo.followH = fHeight.value
      prveiwInfo.followMaxX = maxLeft
      prveiwInfo.followMaxY = maxTop

      console.log(prveiwInfo, '3333')
      return {
        width: followSize.value.w + 'px',
        height: followSize.value.h + 'px',
        left: left + 'px',
        top: top + 'px'
      }
    })
    const wrapperStyle = computed(() => {
      return {
        width: draggleRate * prevSize.w + 'px',
        height: draggleRate * prevSize.h + 'px'
      }
    })

    const handleScroll = () => {
      // const screensRect = document
      //   .querySelector('#screens')
      //   .getBoundingClientRect()
      // const canvasRect = document
      //   .querySelector('#canvas')
      //   .getBoundingClientRect()
      // // 标尺开始的刻度
      // const startX =
      //   (screensRect.left + state.thick - canvasRect.left) / state.scale
      // console.log(startX, 'startX')
      // const startY =
      //   (screensRect.top + state.thick - canvasRect.top) / state.scale
      // state.startX = startX
      // state.startY = startY
    }
    // 控制缩放值
    const handleWheel = (e: {
      ctrlKey: any
      metaKey: any
      preventDefault: () => void
      deltaY: number
    }) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const nextScale = parseFloat(
          Math.max(0.2, state.scale - e.deltaY / 500).toFixed(2)
        )
        state.scale = nextScale
      }
      nextTick(() => {
        handleScroll()
      })
    }
    return {
      offsetLeft,
      offsetTop,
      x,
      y,
      isInside,
      followRef,
      followStyle,
      previewWarrperRef,
      wrapperStyle
    }
  }
}
</script>
<style>
.editor-visual {
  position: absolute;
  bottom: 52px;
  left: 0;
  overflow: hidden;
  width: 158px;
  height: 118px;
  padding: 12px;
  border-radius: 8px;
  z-index: 3;
  display: flex;
  background: #666666;
  justify-content: center;
  align-items: center;
  transform-origin: 50% 100%;
}
.editor-visual__wrap {
  position: relative;
}
.vue-magnify-preview {
  z-index: 3;
  right: 0;
  bottom: 0;
  overflow: hidden;
  position: absolute;
  border: 1px solid rgb(253, 6, 6);
  /* border: 1px solid grey; */
}
.vue-magnify-preview > img {
  width: 100%;
}
.vue-magnify-preview .follow-unit {
  position: absolute;
  /* 视口宽（小图的显示容器） = 大视口宽（大图的显示容器）/大展品宽（大图） * 小展品（小图） */
  /* width: 253.125px; */
  /* height: 253.125px; */
  left: 0;
  top: 0;
  user-select: none;
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAMAAABFaP0WAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAGUExURT1uzv///62t27cAAAACdFJOU/8A5bcwSgAAABBJREFUeNpiYGBkYGQECDAAAA0ABMZIs2EAAAAASUVORK5CYII=')
    repeat;
}
.vue-magnify-preview .follow-unit i {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 2px;
  background: red;
}
</style>
