<template>
  <div id="mb-ruler" class="style-ruler mb-ruler">
    <slot
      name="btn"
      :resetMethod="resetMethod"
      :zoomInMethod="zoomInMethod"
      :zoomOutMethod="zoomOutMethod"
    ></slot>
    <div class="canvasedit-parent" :style="canvasStyle" @wheel="handleWheel">
      <div class="canvasedit">
        <slot></slot>
      </div>
    </div>
    <!-- 水平方向 -->
    <RulerWrapper
      :vertical="false"
      :width="width"
      :height="thick"
      :is-show-refer-line="showReferLine"
      :thick="thick"
      :ratio="ratio"
      :start="startX"
      :lines="lines.h"
      :select-start="shadow.x"
      :select-length="shadow.width"
      :scale="ownScale"
      :palette="paletteCpu"
      :startNumX="startNumX"
      :endNumX="endNumX"
    />
    <!-- 竖直方向 -->
    <RulerWrapper
      :vertical="true"
      :width="thick"
      :height="height"
      :is-show-refer-line="showReferLine"
      :thick="thick"
      :ratio="ratio"
      :start="startY"
      :lines="lines.v"
      :select-start="shadow.y"
      :select-length="shadow.height"
      :scale="ownScale"
      :palette="paletteCpu"
      :startNumY="startNumY"
      :endNumY="endNumY"
    />
    <a class="corner" :style="cornerStyle" @click="onCornerClick"></a>
  </div>
</template>

<script setup lang="ts">
import RulerWrapper from './ruler-wrapper.vue'
import { eye64, closeEye64 } from './cornerImg64'
import { computed, ref, watch, onMounted, nextTick } from 'vue'
import { sketchRulerProps } from '../index-types'
import Panzoom from './panzoom'
const props = defineProps(sketchRulerProps)
const emit = defineEmits(['onCornerClick', 'update:scale'])
const startX = ref(0)
const startY = ref(0)
const ownScale = ref(1)
const showReferLine = ref(props.isShowReferLine)
const panzoomInstance = ref<Panzoom | null>(null)
// 这里处理默认值,因为直接写在props的default里面时,可能某些属性用户未必会传,那么这里要做属性合并,防止属性丢失
const paletteCpu = computed(() => {
  function merge(obj: { [key: string]: any }, o: { [key: string]: any }) {
    Object.keys(obj).forEach((key) => {
      if (key && obj.hasOwnProperty(key)) {
        if (typeof o[key] === 'object') {
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

const cornerStyle = computed(() => {
  return {
    backgroundImage: showReferLine.value
      ? `url(${props.eyeIcon || eye64})`
      : `url(${props.closeEyeIcon || closeEye64})`,
    width: props.thick + 'px',
    height: props.thick + 'px',
    borderRight: `1px solid ${paletteCpu.value.borderColor}`,
    borderBottom: `1px solid ${paletteCpu.value.borderColor}`
  }
})
const canvasStyle = computed(() => {
  return {
    background: '#ff9',
    marginTop: props.thick + 'px',
    marginLeft: props.thick + 'px',
    width: props.width - props.thick + 'px',
    height: props.height - props.thick + 'px'
    // padding: props.topPadding + 'px'
  }
})
onMounted(() => {
  initPanzoom()
})

const initPanzoom = () => {
  // document: https://github.com/timmywil/panzoom
  const elem = document.querySelector('.canvasedit')
  const parentEle = document.querySelector('.canvasedit-parent')
  if (elem && parentEle) {
    const parentRect = parentEle.getBoundingClientRect()
    panzoomInstance.value = Panzoom(elem, {
      noBind: true,
      startScale: props.scale,
      cursor: 'default',
      smoothScroll: true,
      ...props.panzoomOption
    })

    setTimeout(() => {
      // 处理尺规的初始位置
      const children = elem.children[0].getBoundingClientRect()
      console.log(children, 'ccccccccccc')
      console.log(parentRect, 'parentRect')
      // 算出居中时的位置,上下也居中
      const { width, height } = parentRect
      if (width > children.width) {
        startX.value = -(width - children.width) / 2
        if (height > children.height) {
          startY.value = -(height - children.height) / 2
        } else {
          // 子图太大, 那么00 开始
          startY.value = 0
        }
      } else {
        // 子图太大, 那么00 开始
        startX.value = 0
        startY.value = 0
      }
      panzoomInstance.value.pan(-startX.value, -startY.value)
    }, 0)
    elem.addEventListener('panzoomchange', (event) => {
      const { scale, dimsOut } = event.detail
      if (dimsOut) {
        console.log(event.detail, 'event.detail')
        emit('update:scale', scale)
        setTimeout(() => {
          ownScale.value = scale
        }, 0)
        const left = (dimsOut.parent.left - dimsOut.elem.left) / scale
        const top = (dimsOut.parent.top - dimsOut.elem.top) / scale
        startX.value = left
        startY.value = top
      }
    })
    // This demo binds to ctrlKey + wheel
    parent.addEventListener('wheel', function (e) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        panzoomInstance.value.zoomWithWheel(e)
      }
    })
    // 让按下空格键才能移动画布
    parent.addEventListener('keydown', function (e) {
      if (e.key === ' ') {
        panzoomInstance.value.bind()
      }
    })

    parent.addEventListener('keyup', function (e) {
      if (e.key === ' ') {
        panzoomInstance.value.destroy()
      }
    })
  }
}
const resetMethod = () => {
  panzoomInstance.value.reset()
}

const zoomInMethod = () => {
  panzoomInstance.value.zoomIn()
}

const zoomOutMethod = () => {
  panzoomInstance.value.zoomOut()
}
const handleWheel = (e: MouseEvent) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
  }
}
const onCornerClick = () => {
  showReferLine.value = !showReferLine.value
  emit('onCornerClick', showReferLine.value)
}
watch([() => props.isShowReferLine], () => {
  showReferLine.value = props.isShowReferLine
})

// 使用defineExpose来暴露方法
defineExpose({
  resetMethod,
  zoomInMethod,
  zoomOutMethod
})
</script>

<style lang="scss">
.style-ruler {
  position: relative;
  z-index: 3;
  /* 需要比resizer高 */
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 12px;
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
</style>
