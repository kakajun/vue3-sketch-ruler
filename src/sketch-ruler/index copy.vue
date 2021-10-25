<template>
  <div
    ref="ruler"
    @scroll="setStart"
    @mousewheel="handleWheel"
    class="style-ruler"
  >
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
    <!-- <inner-box v-model="scale" class="inner-box">
      <slot></slot>
    </inner-box> -->
    <div
      ref="screensRef"
      class="screens"
      @click="$emit('ClickOutside2ClearAll', $event)"
    >
      <!-- <div class="canvas-content" :style="canvasStyle"> -->
      <!-- 放个默认插槽 -->
      <slot ref="canvas"></slot>
      <!-- </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import InnerBox from './inner-box.vue'
import RulerWrapper from './ruler-wrapper.vue'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { sketchRulerProps, SketchRulerProps } from '../index-types'
import { merge } from 'lodash-es'
export default defineComponent({
  name: 'SketchRule',
  components: {
    RulerWrapper,
    InnerBox
  },
  props: sketchRulerProps,
  emits: ['onCornerClick', 'handleLine', 'ClickOutside2ClearAll'],
  setup(props: SketchRulerProps, { emit }) {
    // 这里处理默认值,因为直接写在props的default里面时,可能某些属性用户未必会传,那么这里要做属性合并,防止属性丢失
    let scale = ref(1)
    const isImgOpen = ref(true) //眼镜打开
    const shadowCpu = computed(() => {
      return merge(
        {
          x: 0,
          y: 0,
          width: 200,
          height: 200
        },
        props.shadow || {}
      )
    })
    const paletteCpu = computed(() => {
      const finalObj = merge(
        {
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
        },
        props.palette || {}
      )
      // console.log(finalObj, '6666')
      return finalObj
    })
    const cornerActiveClass = computed(() => {
      return props.cornerActive ? ' active' : ''
    })
    const ruler = ref<HTMLElement | null>(null)
    let width = ref(0)
    let height = ref(0)
    onMounted(() => {
      if (ruler.value) {
        const refruler = ruler.value.getBoundingClientRect()
        // console.log(refruler, '666666')
        width.value = refruler.width - 21
        height.value = refruler.height - 21
      }
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
    /**
     * @desc    : 画布大小,一定要是computer里面,否则缩放页面会失效
     * @author  : mj
     * @date  : 2020/12/13
     * @update   by
     */
    const canvasStyle = computed(() => {
      const css = {
        left: '60px',
        top: '60px',
        paddingRight: '20px',
        paddingBottom: '30px',
        // zIndex: 10,
        transform: `scale(${scale})`
      }
      return css
    })
    let startX = ref(0)
    let startY = ref(0)
    // 图片点击事件
    const imgClick = () => {
      props.isShowReferLine = !props.isShowReferLine
    }
    const canvas = ref<HTMLElement | null>(null)
    const screensRef = ref<HTMLElement | null>(null)
    const setStart = () => {
      if (canvas.value && screensRef.value) {
        const canvasR = canvas.value.getBoundingClientRect()
        //↑ 异步加载组件使用
        const screensRect = screensRef.value.getBoundingClientRect()
        // 标尺开始的刻度
        const startx =
          (screensRect.left + props.thick - canvasR.left) / scale.value
        const starty =
          (screensRect.top + props.thick - canvasR.top) / scale.value
        startX.value = startx >> 0
        startY.value = starty >> 0
      }
    }

    // 控制缩放值
    const handleWheel = (e: WheelEvent) => {
      debugger
      console.log('44444444444')
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const nextScale = parseFloat(
          Math.max(0.2, scale.value - e.deltaY / 1000).toFixed(2)
        )
        if (nextScale > 1.5) scale.value = 1.5
        else if (nextScale < 0.5) scale.value = 0.5
        else scale.value = nextScale
      }
      setStart()
    }
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
      setStart,
      handleWheel,
      screensRef,
      canvas,
      startY,
      startX,
      imgClick,
      canvasStyle,
      isImgOpen,
      scale,
      width,
      height,
      ruler,
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

<style lang="scss" scoped>
.refer-line-img {
  position: absolute;
  left: 180;
  width: 20px;
  height: 20px;
}
.inner-box {
  z-index: 4;
}
.style-ruler,
.screens {
  position: absolute;
  z-index: 3; /* 需要比resizer高 */
  width: 100%; /* scrollbar width */
  height: 100%;
  overflow: hidden;
  font-size: 12px;
  pointer-events: none;
  justify-content: center;
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
