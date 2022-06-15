<template>
  <div class="main-container" :style="{ height: height }">
    <section class="editor-container">
      <!-- 中间图形大小previewStyle控制 -->
      <div class="editor-shell-wrap" :style="previewStyle">
        <!-- 下面真正宽度 -->
        <div class="editor-shell" :style="previewStyle">
          <magnify-zoom :zoom-img="zoomImg">
            <slot></slot>
          </magnify-zoom>
        </div>
      </div>
    </section>
    <!-- 下面工具 -->
    <editor-bottom></editor-bottom>

    <!-- <magnify-preview @click="handleClick">
        <slot></slot>
      </magnify-preview> -->
  </div>
</template>

<script lang="ts">
import editorBottom from './editor-bottom.vue'
import {
  defineComponent,
  watch,
  provide,
  reactive,
  onMounted,
  computed
} from 'vue'
// import MagnifyPreview from './magnify-preview.vue'
import MagnifyZoom from './magnify-zoom.vue'
export default defineComponent({
  name: 'sketch-ruler-wrapper',
  props: {
    height: String,
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
    // MagnifyPreview,
    MagnifyZoom,
    editorBottom
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
    const prevSize = reactive({
      w: 0,
      h: 0
    })
    /* 整个框架的wrapper */
    const previewStyle = computed(() => {
      return {
        width: 400 + 'px',
        height: 200 + 'px'
        // width: prevSize.w + 'px',
        // height: prevSize.h + 'px'
      }
    })

    provide('magnify', {
      prveiwInfo,
      setZoomImgInfo,
      prevSize,
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
.main-container {
  position: absolute;
  width: 100%;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: #f5f5f5;
  border: 1px solid #dadadc;
  overflow: hidden;
}
.editor-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  overflow: auto;
  font: 14px/1.5 Arial, PingFangSC-Regular, STHeitiSC-Light, Helvetica Neue;
  color: #333;
  background: none;
  outline: none;
}

.editor-bottom {
  display: flex;
  position: absolute;
  bottom: 26px;
  right: 24px;
  z-index: 2;
}
.editor-shell-wrap {
  position: relative;
  box-sizing: initial;
  margin: 0 auto;
  overflow: visible;
  padding: 30px;
}
.editor-shell {
  background: #000;
  width: 400px;
  height: 400px;
}
</style>
