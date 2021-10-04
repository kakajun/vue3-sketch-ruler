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
      :lines="horLineArr"
      :select-start="shadow.x"
      :select-length="shadow.width"
      :scale="scale"
      :palette="palette"
      @onLineChange="handleLineChange"
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
      :lines="verLineArr"
      :select-start="shadow.y"
      :select-length="shadow.height"
      :scale="scale"
      :palette="palette"
      @onLineChange="handleLineChange"
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
import RulerWrapper from './rulerWrapper.vue'
import { computed, defineComponent, PropType } from 'vue'
import type { PaletteType, ShadowType } from '../index'

const DEFAULTMENU = {
  bgColor: '#fff',
  dividerColor: '#DBDBDB',
  listItem: {
    textColor: '#415058',
    hoverTextColor: '#298DF8',
    disabledTextColor: 'rgba(65, 80, 88, 0.4)',
    bgColor: '#fff',
    hoverBgColor: '#F2F2F2'
  }
}

export default defineComponent({
  name: 'SketchRule',
  components: {
    RulerWrapper
  },

  props: {
    scale: {
      type: Number,
      default: 1
    },
    ratio: {
      type: Number,
      default: window.devicePixelRatio || 1
    },
    thick: {
      type: Number,
      default: 16
    },
    width: Number,
    height: Number,
    startX: {
      type: Number,
      default: 0
    },
    startY: {
      type: Number,
      default: 0
    },
    shadow: {
      type: Object as PropType<ShadowType>,
      default: () => {
        return {
          x: 200,
          y: 100,
          width: 200,
          height: 400
        }
      }
    },
    horLineArr: {
      type: Array as PropType<Array<() => [number, number]>>,
      default: () => {
        return [100, 200]
      }
    },
    verLineArr: {
      type: Array as PropType<Array<() => [number, number]>>,
      default: () => {
        return [100, 200]
      }
    },
    cornerActive: {
      type: Boolean,
      default: false
    },

    isShowReferLine: {
      type: Boolean,
      default: true
    },
    palette: {
      type: Object as PropType<PaletteType>,
      default: () => {
        return {
          bgColor: 'rgba(225,225,225, 0)', // ruler bg color
          longfgColor: '#BABBBC', // ruler longer mark color
          shortfgColor: '#C8CDD0', // ruler shorter mark color
          fontColor: '#7D8694', // ruler font color
          shadowColor: '#E8E8E8', // ruler shadow color
          lineColor: '#EB5648',
          borderColor: '#DADADC',
          cornerActiveColor: 'rgb(235, 86, 72, 0.6)',
          menu: DEFAULTMENU
        }
      }
    }
  },
  emits: ['onCornerClick', 'handleLine'],
  setup(props, { emit }) {
    const cornerActiveClass = computed(() => {
      return props.cornerActive ? ' active' : ''
    })
    const cornerStyle = computed(() => {
      return {
        backgroundColor: props.palette.bgColor,
        width: props.thick + 'px',
        height: props.thick + 'px',
        borderRight: `1px solid ${props.palette.borderColor}`,
        borderBottom: `1px solid ${props.palette.borderColor}`
      }
    })

    const onCornerClick = (e: MouseEvent) => {
      emit('onCornerClick', e)
    }
    const handleLineChange = (arr: Array<number>, vertical: string) => {
      const newLines = vertical
        ? { h: props.horLineArr, v: [...arr] }
        : { h: [...arr], v: props.verLineArr }
      emit('handleLine', newLines)
    }
    return {
      cornerActiveClass,
      cornerStyle,
      onCornerClick,
      handleLineChange
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
