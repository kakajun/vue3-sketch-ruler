<template>
  <div id="mb-ruler" class="style-ruler mb-ruler">
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
      :scale="scale"
      :palette="paletteCpu"
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
      :scale="scale"
      :palette="paletteCpu"
    />
    <a class="corner" :style="cornerStyle" @click="onCornerClick"></a>
  </div>
</template>

<script lang="ts">
import RulerWrapper from './ruler-wrapper.vue'
import { eye64, closeEye64 } from './cornerImg64'
import { computed, defineComponent, ref, watch } from 'vue-demi'
import { sketchRulerProps } from '../index-types'
export default defineComponent({
  name: 'SketchRule',
  components: {
    RulerWrapper
  },
  props: sketchRulerProps,
  emits: ['onCornerClick', 'handleLine'],
  setup(props, { emit }) {
    let showReferLine = ref(true)
    showReferLine.value = props.isShowReferLine
    // 这里处理默认值,因为直接写在props的default里面时,可能某些属性用户未必会传,那么这里要做属性合并,防止属性丢失
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
    const onCornerClick = (e: MouseEvent) => {
      showReferLine.value = !showReferLine.value
      emit('handleCornerClick', showReferLine.value)
    }
    watch([() => props.isShowReferLine], () => {
      showReferLine.value = props.isShowReferLine
    })
    return {
      showReferLine,
      paletteCpu,
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
