<template>
  <div class="sketch-ruler">
    <slot name="btn" :reset="reset" :zoomIn="zoomIn" :zoomOut="zoomOut"></slot>
    <div class="canvasedit-parent" :style="canvasStyle" @wheel.prevent="">
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
      :start="startX"
      :startOther="startY"
      :lines="lines"
      :select-start="shadow.x"
      :select-length="shadow.width"
      :scale="ownScale"
      :parentRect="parentRect"
      :palette="paletteCpu"
      :endNumX="endNumX"
    />
    <!-- 竖直方向 -->
    <RulerWrapper
      :vertical="true"
      :width="thick"
      :height="height"
      :is-show-refer-line="showReferLine"
      :thick="thick"
      :start="startY"
      :startOther="startX"
      :lines="lines"
      :select-start="shadow.y"
      :select-length="shadow.height"
      :scale="ownScale"
      :parentRect="parentRect"
      :palette="paletteCpu"
      :endNumY="endNumY"
    />
    <a class="corner" :style="cornerStyle" @click="onCornerClick"></a>
  </div>
</template>

<script setup lang="ts">
import RulerWrapper from './ruler-wrapper.vue'
import { eye64, closeEye64 } from './cornerImg64'
import { computed, ref, watch, onMounted } from 'vue'
import { sketchRulerProps } from '../index-types'
import Panzoom from 'simple-panzoom'
const props = defineProps(sketchRulerProps)
const emit = defineEmits(['onCornerClick', 'update:scale'])
const parentRect = ref(null)
const elem = ref(null)
const startX = ref(0)
const startY = ref(0)
const zoomStartX = ref(0)
const zoomStartY = ref(0)
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
      bgColor: '#f6f7f9', // ruler bg color
      longfgColor: '#BABBBC', // ruler longer mark color
      fontColor: '#7D8694', // ruler font color
      shadowColor: '#E8E8E8', // ruler shadow color
      lineColor: '#EB5648',
      hoverBg: '#000',
      hoverColor: '#fff',
      borderColor: '#eeeeef',
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
    background: paletteCpu.value.bgColor,
    backgroundSize: paletteCpu.value.backgroundSize,
    width: props.width + 'px',
    height: props.height + 'px'
  }
})
onMounted(() => {
  initPanzoom()
})

const initPanzoom = () => {
  // document: https://github.com/timmywil/panzoom
  elem.value = document.querySelector('.canvasedit')
  initStart()
  panzoomInstance.value = Panzoom(elem.value, {
    noBind: true,
    startScale: props.scale,
    cursor: 'default',
    startX: zoomStartX.value,
    startY: zoomStartY.value,
    // contain: 'inside',
    smoothScroll: true,
    ...props.panzoomOption
  })

  elem.value.addEventListener('panzoomchange', (event) => {
    const { scale, dimsOut } = event.detail
    if (dimsOut) {
      emit('update:scale', scale)
      ownScale.value = scale
      const left = (dimsOut.parent.left - dimsOut.elem.left + props.thick) / scale
      const top = (dimsOut.parent.top - dimsOut.elem.top + props.thick) / scale
      startX.value = left
      console.log(startX.value * scale, 'startX.value')
      console.log(scale, 'scale')
      startY.value = top
    }
  })
  parent.addEventListener('wheel', function (e) {
    if (e.ctrlKey || e.metaKey) {
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

/**
 * @desc: 处理初始化画布居中位置
 */
const initStart = () => {
  const parentEle = document.querySelector('.canvasedit-parent')
  parentRect.value = parentEle.getBoundingClientRect()
  const children = elem.value.children[0].getBoundingClientRect()
  const { width, height } = parentRect.value
  if (width > children.width) {
    zoomStartX.value = (width - children.width) / 2
    if (height > children.height) {
      zoomStartY.value = (height - children.height) / 2
    } else {
      zoomStartY.value = 0
    }
  } else {
    zoomStartY.value = 0
    zoomStartX.value = 0
  }
}
const reset = () => {
  panzoomInstance.value.reset()
}

const zoomIn = () => {
  panzoomInstance.value.zoomIn()
}

const zoomOut = () => {
  panzoomInstance.value.zoomOut()
}

const onCornerClick = () => {
  showReferLine.value = !showReferLine.value
  emit('onCornerClick', showReferLine.value)
}
watch([() => props.isShowReferLine], () => {
  showReferLine.value = props.isShowReferLine
})

defineExpose({
  initPanzoom,
  panzoomInstance,
  reset,
  zoomIn,
  zoomOut
})
</script>

<style lang="scss">
.sketch-ruler {
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
  .corner {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: auto;
    cursor: pointer;
    box-sizing: content-box;
    transition: all 0.2s ease-in-out;
  }
}
</style>
