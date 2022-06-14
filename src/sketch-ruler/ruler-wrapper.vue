<template>
  <div :class="rwClassName" :style="rwStyle">
    <CanvasRuler
      :vertical="vertical"
      :scale="scale"
      :width="width"
      :height="height"
      :start="start"
      :ratio="ratio"
      :select-start="selectStart"
      :select-length="selectLength"
      :palette="palette"
      v-model:valueNum="valueNum"
      v-model:showIndicator="showIndicator"
      @onAddLine="handleNewLine"
    >
    </CanvasRuler>
    <div v-show="isShowReferLine" class="lines">
      <RulerLine
        v-for="(v, i) in lines"
        :key="v + i"
        :index="i"
        :value="v >> 0"
        :scale="scale"
        :start="start"
        :thick="thick"
        :palette="palette"
        :vertical="vertical"
        :is-show-refer-line="isShowReferLine"
        @onRemove="handleLineRemove"
        @onRelease="handleLineRelease"
      >
      </RulerLine>
    </div>
    <div v-show="showIndicator" class="indicator" :style="indicatorStyle">
      <div class="value">{{ valueNum }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import RulerLine from './ruler-line.vue'
import CanvasRuler from '../canvas-ruler/index.vue'
import { ref, computed, defineComponent } from 'vue-demi'
import { wrapperProps } from './ruler-wrapper-types'
export default defineComponent({
  name: 'RulerWrapper',
  components: {
    CanvasRuler,
    RulerLine
  },
  props: wrapperProps,
  setup(props: WrapperProps) {
    const showIndicator = ref(false)
    const valueNum = ref(0)
    const rwClassName = computed(() => {
      const className = props.vertical ? 'v-container' : 'h-container'
      return className
    })
    const rwStyle = computed(() => {
      const hContainer = {
        width: `calc(100% - ${props.thick}px)`,
        height: `${props.thick! + 1}px`,
        left: `${props.thick}` + 'px'
      }
      const vContainer = {
        width: `${props.thick && props.thick + 1}px`,
        height: `calc(100% - ${props.thick}px)`,
        top: `${props.thick}` + 'px'
      }
      return props.vertical ? vContainer : hContainer
    })

    const indicatorStyle = computed(() => {
      const indicatorOffset = (valueNum.value - props.start) * props.scale!
      let positionKey = 'top'
      let boderKey = 'borderLeft'
      positionKey = props.vertical ? 'top' : 'left'
      boderKey = props.vertical ? 'borderBottom' : 'borderLeft'
      return {
        [positionKey]: indicatorOffset + 'px',
        [boderKey]: `1px solid ${props.palette?.lineColor}`
      }
    })

    const handleNewLine = (value: number) => {
      props.lines.push(value)
    }
    const handleLineRelease = (value: number, index: number) => {
      // 左右或上下超出时, 删除该条对齐线
      const offset = value - props.start
      const maxOffset =
        (props.vertical ? props.height : props.width) / props.scale!
      if (offset < 0 || offset > maxOffset) {
        handleLineRemove(index)
      } else {
        props.lines[index] = value
      }
    }
    const handleLineRemove = (index: any) => {
      props.lines.splice(index, 1)
    }
    return {
      showIndicator,
      valueNum,
      rwClassName,
      rwStyle,
      indicatorStyle,
      handleNewLine,
      handleLineRelease,
      handleLineRemove
    }
  }
})
</script>

<style lang="scss" scoped>
.line {
  position: absolute;
}
.h-container,
.v-container {
  position: absolute;
  .lines {
    pointer-events: none;
  }
  &:hover .lines {
    pointer-events: auto;
  }
}
.h-container {
  top: 0;
  .line {
    top: 0;
    height: 100vh;
    padding-left: 5px;
    .action {
      transform: translateX(-24px);
      .value {
        margin-left: 4px;
      }
    }
  }
  .indicator {
    top: 0;
    height: 100vw;
    .value {
      width: auto;
      padding: 0 2px;
      margin-top: 4px;
      margin-left: 4px;
    }
  }
}

.v-container {
  left: 0;
  .line {
    left: 0;
    width: 100vw;
    padding-top: 5px;
    .action {
      transform: translateY(-24px);
      flex-direction: column;
      .value {
        margin-top: 4px;
      }
    }
  }
  .indicator {
    width: 100vw;
    .value {
      left: 0;
      width: auto;
      padding: 0 2px;
      margin-top: -5px;
      margin-left: 2px;
      transform: rotate(-90deg);
      transform-origin: 0 0;
    }
  }
}
</style>
