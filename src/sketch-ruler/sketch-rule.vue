<template>
  <div class="sketch-rule" ref="wrapper">
    <!-- 这是缩放控件 -->
    <sket-tool
      @setStart="setStart"
      :ruleWidth="ruleWidth"
      :config="config"
      :scale="scale"
      @getruleWidth="getruleWidth"
      @getscale="getscale"
      ref="skettool"
    />
    <i
      :class="[
        isShowReferLine ? 'icon-zhengyan' : 'icon-biyan',
        'iconfont',
        'refer-line-img'
      ]"
      @click="imgClick"
    ></i>
    <SketchRule
      :thick="thick"
      v-model="scale"
      :key="ruleIndex"
      :width="width"
      :height="height"
      :startX="startX"
      :startY="startY"
      :isShowReferLine="isShowReferLine"
      :palette="palette"
      :shadow="shadow"
      :horLineArr="lines.h"
      :verLineArr="lines.v"
    />
    <!-- 这个 @scroll 一定不能删,否则会引起尺子的纵坐标不准的问题 -->
    <div
      ref="screensRef"
      class="screens"
      @scroll="setStart"
      @wheel="handleWheel"
      @click="$emit('ClickOutside2ClearAll', $event)"
    >
      <div class="canvas-content" ref="canvas" :style="canvasStyle">
        <!-- 放个默认插槽 -->
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { SketchRule } from './sketchRuler/index.es.js'
import './sketchRuler/style.css'
import SketTool from './sketTool.vue'
export default {
  name: 'AvueSketchRule',
  emits: ['update:scale', 'update:ruleWidth', 'ClickOutside2ClearAll'],
  data() {
    return {
      isShowReferLine: true, // 显示参考线
      ruleIndex: 0,
      startX: 0, //x轴标尺开始的坐标数值
      startY: 0,
      lines: {
        //初始化水平标尺上的参考线
        h: [],
        v: []
      },
      shadow: {
        x: 0,
        y: 0
      }, // 阴影大小
      //   contentLeft: '0px',  // 内容到左侧的距离，目的是适配不同尺寸的浏览器窗口
      animation: true, // 图形的动画效果,查看编辑时有,导图时关闭
      thick: 20, //标尺的厚度
      width: 0, // 标尺宽,后面会初始化
      height: 0, // 标尺高,后面会初始化
      isImgOpen: true //眼镜打开
    }
  },
  props: {
    palette: Object, // 尺规颜色
    scale: Number, //初始化标尺的缩放
    config: Object,
    ruleWidth: {
      type: Number, //尺子宽度,跟视口有关
      default: 1920 - 180 - 300,
      require: true
    }
  },
  components: { SketchRule, SketTool },
  computed: {
    /**
     * @desc    : 画布大小,一定要是computer里面,否则缩放页面会失效
     * @author  : mj
     * @date  : 2020/12/13
     * @update   by
     */
    canvasStyle() {
      const css = {
        left: '60px',
        top: '60px',
        paddingRight: '20px',
        paddingBottom: '30px',
        width: this.config.width + 'px', // 530为左边180+右边350
        height: this.config.height /*+ 100 */ + 'px', // 530为左边180+右边350
        transform: `scale(${this.scale})`
      }
      return css
    }
  },
  watch: {
    /* 调整宽高时，标尺要变化 */
    config: {
      handler() {
        // 画布阴影部分
        this.shadow = {
          x: 0,
          y: 0,
          width: this.config.width,
          height: this.config.height
        }
        this.ruleIndex++
      },
      deep: true
    }
    /*
      这是强行把尺子独立出去埋下的坑,build中本身有个scale,这下没有任何地方能控制他了,导致随便动一动,他就把scale=1传给尺子....
      avue用function中修改不合适,所以直接在这里操作.
      computed试了没反应.
      */
    // scale(v) {
    //   this.$parent.scale = v
    // }
  },
  methods: {
    getscale(val) {
      this.$emit('update:scale', val)
    },
    getruleWidth(val) {
      this.$emit('update:ruleWidth', val)
    },
    // 初始化标尺数值
    initSize(config = this.config) {
      /* 180+300 */
      this.$emit(
        'update:ruleWidth',
        window.innerWidth - (this.$parent.dash ? 2 * 180 : 180) - 300
      )
      const width = this.ruleWidth
      // console.log(width, 'width')
      const height = window.innerHeight - 45
      this.width = width - this.thick
      this.height = height - this.thick
      // 画布阴影部分
      this.shadow = { x: 0, y: 0, width: config.width, height: config.height }
      //   const canvasR = this.$refs.canvas.getBoundingClientRect();
      //   console.log(width, canvasR.width, config, this.config, this, 'sket-rule: initSize');
      this.ruleIndex++
      this.$nextTick(() => {
        if (this.$refs.skettool) {
          this.$refs.skettool.adaptWindow()
        }
      })
      //   this.$refs.skettool.adaptWindow(false)
    },
    // 图片点击事件
    imgClick() {
      this.isShowReferLine = !this.isShowReferLine
    },
    setStart() {
      //   console.log('setStart')
      this.$nextTick(() => {
        const canvasR = this.$refs.canvas.getBoundingClientRect()
        //↑ 异步加载组件使用
        const screensRect = this.$refs.screensRef.getBoundingClientRect()
        // 标尺开始的刻度
        const startX =
          (screensRect.left + this.thick - canvasR.left) / this.scale
        const startY = (screensRect.top + this.thick - canvasR.top) / this.scale
        this.startX = startX >> 0
        this.startY = startY >> 0
      })
    },
    // 控制缩放值
    handleWheel(e) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const nextScale = parseFloat(
          Math.max(0.2, this.scale - e.deltaY / 1000).toFixed(2)
        )
        if (nextScale > 1.5) this.$emit('update:scale', 1.5)
        else if (nextScale < 0.5) this.$emit('update:scale', 0.5)
        else this.$emit('update:scale', nextScale)
      }
      this.setStart()
    },
    setScrollBack() {
      this.$refs.screensRef.scrollTop = 0 //切换后保持滚动条在最顶部
    }
  }
}
</script>
<style lang="scss">
.sketch-rule {
  position: relative;
  width: 100%;
  background-color: inherit;

  &:hover {
    .floatBottomDiv {
      display: inline-flex;
    }
  }

  .refer-line-img {
    position: absolute;
    left: 180;
    width: 20px;
    height: 20px;
  }

  .screens {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    overflow: auto;
    justify-content: center;
  }

  .canvas-content {
    position: absolute;
    overflow: hidden;
    transform-origin: 0 0;
  }

  .floatBottomDiv {
    position: fixed;
    right: 388px; // 0px;
    bottom: 15px;
    //   top: 0px;
    left: 0;
    z-index: 3;
    display: none;
    width: 260px;
    height: 30px;
    padding: 6px 5px 6px 5px;
    margin: 0 0 0 auto; // 0 auto 0 auto;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    justify-content: center;

    .btns {
      margin: 0 5px 0 5px;
    }
  }
}
</style>
