<template>
  <div id="mb-ruler" class="style-ruler mb-ruler">
    <!-- 水平方向 -->
    <RulerWrapper
      :vertical="false"
      :width="width"
      :height="thick"
      :is-show-refer-line="isShowReferLine"
      :thick="thick"
      :ratio="ratio"
      :start="startX"
      :lines="lines.h"
      :select-start="shadow.x"
      :select-length="shadow.width"
      :scale="scale"
      :palette="paletteCpu"
    />
    <!-- 竖直方向 -->
    <RulerWrapper
      :vertical="true"
      :width="thick"
      :height="height"
      :is-show-refer-line="isShowReferLine"
      :thick="thick"
      :ratio="ratio"
      :start="startY"
      :lines="lines.v"
      :select-start="shadow.y"
      :select-length="shadow.height"
      :scale="scale"
      :palette="paletteCpu"
    />
    <a
      class="corner"
      :class="cornerActiveClass"
      :style="cornerStyle"
      @click="onCornerClick"
    ></a>
  </div>
</template>

<script lang="ts">
import RulerWrapper from './ruler-wrapper.vue'
import { computed, defineComponent } from 'vue'
import { sketchRulerProps, SketchRulerProps } from './index-types'
import getPalette from './mixin'
export default defineComponent({
  name: 'SketchRule',
  components: {
    RulerWrapper
  },
  props: sketchRulerProps,
  emits: ['onCornerClick', 'handleLine'],
  setup(props: SketchRulerProps, { emit }) {
    // 这里处理默认值,因为直接写在props的default里面时,可能某些属性用户未必会传,那么这里要做属性合并,防止属性丢失
    const paletteCpu = computed(() => getPalette(props.palette))
    const cornerActiveClass = computed(() => {
      return props.cornerActive ? ' active' : ''
    })
    const cornerStyle = computed(() => {
      return {
        backgroundColor: paletteCpu.value.bgColor,
        width: props.thick + 'px',
        height: props.thick + 'px',
        borderRight: `1px solid ${paletteCpu.value.borderColor}`,
        borderBottom: `1px solid ${paletteCpu.value.borderColor}`
      }
    })
    const onCornerClick = (e: MouseEvent) => {
      emit('onCornerClick', e)
    }
    return {
      paletteCpu,
      cornerActiveClass,
      cornerStyle,
      onCornerClick
    }
  }
})
</script>

<style lang="scss">
.style-ruler {
  position: absolute;
  z-index: 3; /* 需要比resizer高 */
  width: 100%; /* scrollbar width */
  height: 100%;
  overflow: hidden;
  font-size: 12px;
  pointer-events: none;
  span {
    line-height: 1;
  }
}
.corner {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: auto;
  cursor: pointer;
  box-sizing: content-box;
  transition: all 0.2s ease-in-out;
}

.indicator {
  position: absolute;
  pointer-events: none;
  .value {
    position: absolute;
    background: white;
  }
}

.ruler {
  width: 100%;
  height: 100%;
  pointer-events: auto;
}
</style>
