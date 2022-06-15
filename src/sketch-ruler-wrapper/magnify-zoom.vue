<template>
  <!-- 大图 -->
  <div
    class="vue-magnify-zoom"
    ref="zoomRef"
    :style="{
      width: zoomSize.w + 'px',
      height: zoomSize.h + 'px',
      right: -zoomSize.w - 3 + 'px'
    }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { inject, computed, reactive, ref, watch, onMounted, Ref } from 'vue'
import { MagnifyProvide } from './index-types'
import { useElementRect } from './hooks/useElementRect'
export default {
  props: ['zoomImg'],
  setup() {
    const { prveiwInfo, setZoomImgInfo, zoomSize } = inject(
      'magnify'
    ) as MagnifyProvide
    const zoomRef = ref(null) as Ref<HTMLImageElement | null>
    const imgRef = ref(null) as Ref<HTMLImageElement | null>
    const scaleInfo = computed(() => {
      const { width, height } = useElementRect(zoomRef)
      // 比例 = 移动距离 / 最大可移动距离
      const scaleX = prveiwInfo.followX / prveiwInfo.followMaxX
      const scaleY = prveiwInfo.followY / prveiwInfo.followMaxY
      return reactive({
        scaleX,
        scaleY,
        width,
        height
      })
    })
    onMounted(() => {
      if (imgRef.value) {
        /* 图形加载完之后设置框框大小 */
        imgRef.value.addEventListener('load', function () {
          setZoomImgInfo({ w: this.width, h: this.height })
        })
      }
    })

    watch(scaleInfo, val => {
      if (zoomRef.value && imgRef.value) {
        // 移动距离 = 比例 * 最大可移动距离
        zoomRef.value.scrollTo(
          val.scaleX * Math.abs(zoomSize.w - imgRef.value.width),
          val.scaleY * Math.abs(zoomSize.h - imgRef.value.height)
        )
      }
    })

    return {
      prveiwInfo,
      scaleInfo,
      zoomRef,
      imgRef,
      zoomSize
    }
  }
}
</script>
<style>
.vue-magnify-zoom {
  border: 1px solid #eee;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
