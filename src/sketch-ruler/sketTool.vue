<template>
  <!-- 这是控制视图下方缩放的按钮组件 -->
  <div class="floatBottomDiv">
    <el-tooltip effect="dark" content="缩小画布" placement="top">
      <el-button
        class="btns"
        type="info"
        icon="el-icon-minus"
        size="mini"
        @click="BottomfloatDivBtns('minus')"
        circle
      ></el-button>
    </el-tooltip>

    <el-tooltip effect="dark" content="放大画布" placement="top">
      <el-button
        class="btns"
        type="info"
        icon="el-icon-plus"
        size="mini"
        @click="BottomfloatDivBtns('plus')"
        circle
      ></el-button>
    </el-tooltip>
    <el-select
      style="width: 100px; margin: 1px 5px 0 5px"
      :popper-append-to-body="false"
      v-model="bottomValue"
      size="mini"
    >
      <el-option
        v-for="item in scaleOptions"
        style="margin-top: -5px; margin-bottom: 8px"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-tooltip effect="dark" content="画布自适应宽度" placement="top">
      <el-button
        class="btns"
        type="info"
        icon="el-icon-sort"
        size="mini"
        @click="BottomfloatDivBtns('adapt')"
        style="transform: rotate(90deg)"
        circle
      ></el-button>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'sketTool',
  props: {
    scale: Number,
    config: Object,
    ruleWidth: {
      type: Number, //尺子宽度,跟视口有关
      require: true
    }
  },
  emits: ['getscale', 'setStart', 'getruleWidth'],
  data() {
    return {
      scaleOptions: [
        {
          value: 1.5,
          label: '150%'
        },
        {
          value: 1.25,
          label: '125%'
        },
        {
          value: 1,
          label: '100%'
        },
        {
          value: 0.75,
          label: '75%'
        },
        {
          value: 0.5,
          label: '50%'
        }
      ]
    }
  },
  computed: {
    // 中间的缩放值
    bottomValue: {
      get() {
        return parseInt(this.scale * 100) + '%'
      },
      set(val) {
        this.$emit('getscale', val)
        this.initRule() //一定要加!! 初始化尺子刻度
      }
    }
  },
  methods: {
    // 缩放后初始化标尺
    initRule() {
      this.$emit('setStart')
    },
    //底部浮动栏按钮操作
    BottomfloatDivBtns(p) {
      switch (p) {
        case 'minus':
          this.$emit('getscale', this.getScale(this.scale, 0))
          this.initRule() //一定要加!! 初始化尺子刻度
          break
        case 'plus':
          this.$emit('getscale', this.getScale(this.scale, 1))
          this.initRule() //一定要加!! 初始化尺子刻度
          break
        case 'adapt': //宽度自适应
          this.adaptWindow()
          break
        default:
          break
      }
    },
    /**
     * @desc    : 查找合适值赋值
     * @author  : mj
     * @date  : 2021/02/05
     * @return  {p}   1 是加  0是减
     * @update   by
     */
    getScale(val, p) {
      //上面代码有问题, 很容易变成NaN, 但是改不成功, 暂时自己写个
      if (p) {
        //plus
        if (val > 1.5) return val //如果自适应的结果本来就超过了150%,就保持原样
        return val + 0.25 > 1.5 ? 1.5 : val + 0.25
      } else {
        //minus
        if (val < 0.3) return val //如果自适应的结果本来就小于50%,就保持原样
        return val - 0.25 < 0.5 ? 0.5 : val - 0.25
      }
    },
    // 自适应窗口大小
    adaptWindow(goInitSize = true) {
      //   goInitSize = false//防止从那个事件过来后又死循环(虽然实测并没出现, 不过为了保险还是这样吧)
      this.$emit(
        'getruleWidth',
        window.innerWidth - (this.$parent.$parent.dash ? 2 * 180 : 180) - 300
      )
      const width = this.ruleWidth - 130
      //   console.log(this.ruleWidth, this, '1')
      this.$emit('getscale', width / this.config.width)
      if (goInitSize) this.initRule() //一定要加!! 初始化尺子刻度
      //   console.log('adaptWindow', width, this.config.width, width / this.config.width, 'width / this.config.width')
    }
  }
}
</script>
