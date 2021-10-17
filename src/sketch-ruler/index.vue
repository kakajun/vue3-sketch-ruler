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
      :select-start="shadowCpu.x"
      :select-length="shadowCpu.width"
      :scale="scale"
      :palette="paletteCpu"
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
      :select-start="shadowCpu.y"
      :select-length="shadowCpu.height"
      :scale="scale"
      :palette="paletteCpu"
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
import RulerWrapper from './ruler-wrapper.vue'
import { computed, defineComponent } from 'vue'
import { sketchRulerProps, SketchRulerProps } from './sketch-ruler-types'

export default defineComponent({
  name: 'SketchRule',
  components: {
    RulerWrapper
  },
  props: sketchRulerProps,
  emits: ['onCornerClick', 'handleLine'],
  setup(props: SketchRulerProps, { emit }) {
    // 这里处理默认值,因为直接写在props的default里面时,可能某些属性用户未必会传,那么这里要做属性合并,防止属性丢失
    const shadowCpu = computed(() => {
      return Object.assign(props.shadow || {}, {
        x: 200,
        y: 100,
        width: 200,
        height: 200
      })
    })
    const paletteCpu = computed(() => {
      return Object.assign(props.palette || {}, {
        bgColor: 'rgba(225,225,225, 0)', // ruler bg color
        longfgColor: '#BABBBC', // ruler longer mark color
        shortfgColor: '#C8CDD0', // ruler shorter mark color
        fontColor: '#7D8694', // ruler font color
        shadowColor: '#E8E8E8', // ruler shadow color
        lineColor: '#EB5648',
        borderColor: '#DADADC',
        cornerActiveColor: 'rgb(235, 86, 72, 0.6)',
        menu: {
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
      })
    })
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
    const handleLineChange = (arr: Array<number>, vertical: string) => {
      const newLines = vertical
        ? { h: props.horLineArr, v: [...arr] }
        : { h: [...arr], v: props.verLineArr }
      emit('handleLine', newLines)
    }
    return {
      paletteCpu,
      shadowCpu,
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
