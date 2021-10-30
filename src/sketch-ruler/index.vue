<template>
  <div ref="ruler" class="style-ruler">
    <!-- 水平方向 -->
    <RulerWrapper
      class="ruler"
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
      class="ruler"
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
    <div
      ref="screensRef"
      class="screens"
      @mousewheel="handleWheel"
      @click="$emit('ClickOutside2ClearAll', $event)"
    >
      <div class="canvas-content" :style="canvasStyle">
        <!-- 放个默认插槽 -->
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import InnerBox from './inner-box.vue'
import RulerWrapper from './ruler-wrapper.vue'
import { computed, defineComponent, onMounted, ref, nextTick } from 'vue'
import { sketchRulerProps, SketchRulerProps } from '../index-types'
export default defineComponent({
  name: 'SketchRule',
  components: {
    RulerWrapper
    // InnerBox
  },
  props: sketchRulerProps,
  emits: ['onCornerClick', 'handleLine', 'ClickOutside2ClearAll'],
  setup(props: SketchRulerProps, { slots, emit }) {
    // 这里处理默认值,因为直接写在props的default里面时,可能某些属性用户未必会传,那么这里要做属性合并,防止属性丢失
    let scale = ref(1)
    const isImgOpen = ref(true) //眼镜打开
    const paletteCpu = computed(() => {
      function merge(obj: { [key: string]: any }, o: { [key: string]: any }) {
        Object.keys(obj).forEach(key => {
          if (key && obj.hasOwnProperty(key)) {
            if (typeof o['key'] === 'object') {
              obj[key] = merge(obj[key], o[key])
            } else if (o.hasOwnProperty(key)) {
              obj[key] = o[key]
            }
          }
        })
        return obj
      }
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
        width.value = refruler.width - 21
        height.value = refruler.height - 21
      }
      // 初始化尺子阴影和线条
      setStart()
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
        transform: `scale(${scale.value})`
      }
      return css
    })
    let startX = ref(0)
    let startY = ref(0)
    // 图片点击事件
    const imgClick = () => {
      props.isShowReferLine = !props.isShowReferLine
    }

    const screensRef = ref<HTMLElement | null>(null)
    const setStart = () => {
      nextTick(() => {
        if (screensRef.value && slots.default && slots.default()[0].el) {
          const canvas = slots.default()[0].el as HTMLElement // 获取slot的dom
          const canvasR = canvas.getBoundingClientRect() // 获取slot的宽高值
          const screensRect = screensRef.value.getBoundingClientRect()
          // 标尺开始的刻度
          const startx =
            (screensRect.left + props.thick - canvasR.left) / scale.value
          const starty =
            (screensRect.top + props.thick - canvasR.top) / scale.value
          startX.value = startx >> 0
          startY.value = starty >> 0
          console.log(startX.value, startY.value)
        }
      })
    }

    // 控制缩放值
    const handleWheel = (e: WheelEvent) => {
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
    /**
     * @description:左上角点击事件
     * @param {*}
     * @return {*}
     */
    const onCornerClick = (e: MouseEvent) => {
      emit('onCornerClick', e)
    }
    return {
      setStart,
      handleWheel,
      screensRef,
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
      cornerActiveClass,
      cornerStyle,
      onCornerClick
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
  // z-index: 4;
}
.ruler {
  position: absolute;
  // position: relative;
  z-index: 3; /* 需要比resizer高 */
}
.style-ruler {
  position: relative;
  width: 100%; /* scrollbar width */
  height: 100%;
  span {
    line-height: 1;
  }
}
.screens {
  width: 100%; /* scrollbar width */
  height: 100%;
  overflow: hidden;
  justify-content: center;
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
