<template>
  <section class="vue-magnify" :style="previewStyle">
    <magnify-preview @click="handleClick">
      <slot></slot>
    </magnify-preview>
    <magnify-zoom :zoom-img="zoomImg">
      <!-- <slot></slot> -->
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
    defaultPrevSize: {
      type: Object,
      default: () => ({
        width: 450,
        height: 450
      })
    },
    defaultZoomSize: {
      type: Object,
      default: () => null
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

    const zoomSize = reactive({
      w: 10,
      h: 10
    })
    // 框架的wrapper
    const prevSize = reactive({
      w: 0,
      h: 0
    })

    const setZoomImgInfo = (v: { h: number; w: number }) => {
      zoomImgSize.w = v.w
      zoomImgSize.h = v.h
    }

    const followSize = computed(() => {
      return {
        w: prevSize.w * (zoomSize.w / zoomImgSize.w),
        h: prevSize.h * (zoomSize.h / zoomImgSize.h)
      }
    })
    /* 整个框架的wrapper */
    const previewStyle = computed(() => {
      return {
        width: prevSize.w + 'px',
        height: prevSize.h + 'px'
      }
    })

    /**
     * @description: 预览大小
     * @param {*}
     * @return {*}
     */
    function initZoomSize() {
      zoomSize.w = props.defaultZoomSize.width
      zoomSize.h = props.defaultZoomSize.height
    }

    /**
     * @description: 初始化外部传参过来wrapper
     * @param {*}
     * @return {*}
     */
    function initPrevSize() {
      prevSize.w = props.defaultPrevSize.width
      prevSize.h = props.defaultPrevSize.height
    }

    function init() {
      initPrevSize()
      initZoomSize()
    }

    onMounted(() => {
      init()
    })
    provide('magnify', {
      prveiwInfo,
      setZoomImgInfo,
      followSize,
      zoomSize
    })
    const handleClick = (event: MouseEvent) => {
      emit('on-preview-click', event)
    }
    return {
      handleClick,
      prveiwInfo,
      zoomImgSize,
      followSize,
      zoomSize,
      prevSize,
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
