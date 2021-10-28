<template>
  <!-- 这是缩放控件 -->
  <!-- <sket-tool
    @setStart="setStart"
    :ruleWidth="ruleWidth"
    :config="config"
    :scale="scale"
    @getruleWidth="getruleWidth"
    @getscale="getscale"
    ref="skettool"
  /> -->
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
</template>

<script>
// import SketTool from './sket-tool.vue'
export default {
  name: 'index',
  emits: ['update:scale', 'update:ruleWidth', 'ClickOutside2ClearAll'],
  data() {
    return {
      isShowReferLine: true, // 显示参考线
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
    scale: Number, //初始化标尺的缩放
    config: Object
  },
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
  // components: {SketTool },
  methods: {
    getscale(val) {
      this.$emit('update:scale', val)
    },
    getruleWidth(val) {
      // this.$emit('update:ruleWidth', val)
    },
    // 初始化标尺数值
    // initSize(config = this.config) {
    //   /* 180+300 */
    //   // this.$emit(
    //   //   'update:ruleWidth',
    //   //   window.innerWidth - (this.$parent.dash ? 2 * 180 : 180) - 300
    //   // )
    //   const width = this.ruleWidth
    //   // console.log(width, 'width')
    //   const height = window.innerHeight - 45
    //   this.width = width - this.thick
    //   this.height = height - this.thick
    //   // 画布阴影部分
    //   this.shadow = { x: 0, y: 0, width: config.width, height: config.height }
    //   this.$nextTick(() => {
    //     if (this.$refs.skettool) {
    //       this.$refs.skettool.adaptWindow()
    //     }
    //   })
    // },
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
<style lang="scss" scoped>
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
</style>
