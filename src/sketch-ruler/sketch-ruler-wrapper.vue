<template>
  <div class="rule-wrapper" ref="ruler">
    <div class="top">缩放比例:{{}}</div>
    <magnify class="magnify">
      <template v-slot:preview-slot> </template>
    </magnify>
  </div>
</template>
<script lang="ts">
import magnify from './Home.vue'
import {
  SketchRulerWrapperProps,
  sketchRulerWrapperProps
} from '../index-types'
import { computed, defineComponent, ref, onMounted, nextTick } from 'vue'

export default defineComponent({
  name: 'SketchRulerWrapper',
  components: { magnify },

  emits: ['handleLine', 'getscele', 'ClickOutside2ClearAll'],
  setup(props, { slots, attrs }) {
    return {}
  }
})
</script>
<style lang="scss">
.magnify {
  // right: 600px;
  position: absolute;
  bottom: 200px;
  height: 200px;
  width: 200px;
}
.rule-wrapper {
  width: 100%;
  height: 100%;
}
.screens {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.container {
  position: absolute;
  top: 20px;
  width: 100px;
  height: 100px;
  z-index: 22;
  // left: 220px;
  // right: 0;
  // margin: auto;
  background: #000;
  // transform-origin: 50% 0;
}
.dd {
  z-index: 22;
}
.canvas-wrapper {
  top: 100px;
  // background: #000;
  // left: 50%;
  position: absolute;
  // transform-origin: 50% 0;
}
</style>
