<template>
  <section class="vue-magnify" :style="previewStyle">
    <magnify-preview @click="handleClick">
      <slot></slot>
    </magnify-preview>
    <magnify-zoom :zoom-img="zoomImg">
      <slot></slot>
    </magnify-zoom>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  watch,
  provide,
  reactive,
  onMounted,
  computed
} from 'vue'
import MagnifyPreview from './magnify-preview.vue'
import MagnifyZoom from './magnify-zoom.vue'

export default defineComponent({
  name: 'sketch-ruler-wrapper',
  props: {
    /**
     * 展示时的图片
     */
    previewImg: {
      type: String,
      required: true
    },
    /**
     * 放大后的图片
     */
    zoomImg: {
      type: String,
      required: true
    },
    prevSize: {
      type: Object,
      default: () => ({
        width: 450,
        height: 450
      })
    },
    zoomSize: {
      type: Object,
      default: () => null
    },
    draggleRate: {
      type: Number,
      default: 0.3
    }
  },
  emits: ['on-preview-click'],
  components: {
    MagnifyPreview,
    MagnifyZoom
  },
  setup(props, { emit }) {
    /* 滑块窗口信息 */
    const prveiwInfo = reactive({
      followX: 0,
      followY: 0,
      followW: 0,
      followH: 0,
      followMaxX: 0,
      followMaxY: 0
    })
    const zoomImgSize = reactive({
      w: 0,
      h: 0
    })
    const setZoomImgInfo = (v: { h: number; w: number }) => {
      zoomImgSize.w = v.w
      zoomImgSize.h = v.h
    }
    /* 遮罩大小 */
    const followSize = computed(() => {
      return {
        /* 视口宽（小图的显示容器） = 大视口宽（大图的显示容器）/大展品宽（大图） * 小展品（小图） */
        // w: prevSize.w * (zoomSize.w / zoomImgSize.w),
        // h: prevSize.h * (zoomSize.h / zoomImgSize.h)
        w: 100,
        h: 100
      }
    })
    /* 整个框架的wrapper */
    const previewStyle = computed(() => {
      return {
        width: props.prevSize.w + 'px',
        height: props.prevSize.h + 'px'
      }
    })

    provide('magnify', {
      prveiwInfo,
      setZoomImgInfo,
      prevSize: props.prevSize,
      followSize,
      zoomSize: props.zoomSize,
      draggleRate: props.draggleRate
    })
    const handleClick = (event: MouseEvent) => {
      emit('on-preview-click', event)
    }
    return {
      handleClick,
      prveiwInfo,
      zoomImgSize,
      followSize,
      previewStyle
    }
  }
})
</script>

<style>
.vue-magnify {
  /* width: 100%; */
  cursor: move;
  position: relative;
}
</style>
