<template>
  <div :class="rwClassName" :style="rwStyle">
    <CanvasRuler
      :vertical="vertical"
      :width="width"
      :height="height"
      :start="start"
      v-model:valueNum="valueNum"
      v-model:showIndicator="showIndicator"
      @onAddLine="handleNewLine"
    />
    <div v-show="injectObj.isShowReferLine" class="lines">
      <RulerLine
        v-for="(v, i) in lines"
        :key="v + i"
        :index="i"
        :value="v >> 0"
        :start="start"
        :vertical="vertical"
        @onRemove="handleLineRemove"
        @onRelease="handleLineRelease"
      />
    </div>
    <div v-show="showIndicator" class="indicator" :style="indicatorStyle">
      <div class="value">{{ valueNum }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import RulerLine from './ruler-line.vue'
import CanvasRuler from '../canvas-ruler/index.vue'
import { ref, computed, defineComponent, inject, PropType } from 'vue'
import { SketchRulerProps } from 'src/index-types'
export default defineComponent({
  name: 'RulerWrapper',
  components: {
    CanvasRuler,
    RulerLine
  },
  props: {
    vertical: Boolean,
    width: Number,
    height: {
      type: Number
    },
    start: {
      type: Number,
      default: 0
    },
    lines: {
      type: Array as PropType<Array<number>>,
      default: () => []
    }
  },
  setup(props) {
    const injectObj = inject('sketch') as SketchRulerProps
    const { palette, thick } = injectObj
    const showIndicator = ref(false)
    const valueNum = ref(0)
    const rwClassName = computed(() => {
      const className = props.vertical ? 'v-container' : 'h-container'
      return className
    })
    const rwStyle = computed(() => {
      const hContainer = {
        width: `calc(100% - ${thick}px)`,
        height: `${thick! + 1}px`,
        left: `${thick}` + 'px'
      }
      const vContainer = {
        width: `${thick && thick + 1}px`,
        height: `calc(100% - ${thick}px)`,
        top: `${thick}` + 'px'
      }
      return props.vertical ? vContainer : hContainer
    })

    const indicatorStyle = computed(() => {
      const indicatorOffset = (valueNum.value - props.start) * injectObj.scale
      let positionKey = 'top'
      let boderKey = 'borderLeft'
      positionKey = props.vertical ? 'top' : 'left'
      boderKey = props.vertical ? 'borderBottom' : 'borderLeft'
      return {
        [positionKey]: indicatorOffset + 'px',
        [boderKey]: `1px solid ${palette?.lineColor}`
      }
    })

    const handleNewLine = (value: number) => {
      props.lines.push(value)
    }
    const handleLineRelease = (value: number, index: number) => {
      // 左右或上下超出时, 删除该条对齐线
      const offset = value - props.start
      const maxOffset =
        (props.vertical ? props.height! : props.width!) / injectObj.scale
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
      injectObj,
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
