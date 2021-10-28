# vue3-sketch-ruler

> 在使用vue3中,用于页面展示的缩放操作

 [![](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)  [![build status](https://github.com/majun2232/vue3sketchRuler/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/majun2232/vue3sketchRuler/actions/workflows/node.js.yml)

 简体中文 | [English](https://github.com/majun2232/vue3sketchRuler/blob/master/README.EN.md)

- 💪 Vue 3 Composition API
- 🔥 Written in TypeScript


# Vue 3 + Vite + ts 打包sketchRuler
由于项目升级成vite， 发现原来的插件vue-sketch-ruler，用到vue3中会报错， 这边我重新用vite打包了一份， 打包后的插件和原来功一样， 且支持在vue3和vite中使用
---
这边对原代码进行了改进优化，功能目前和之前vue3-sketch-ruler一样，还没时间优化，主要改进分为以下几点
1. vue3的eslint修复和styleLint和pretty的代码格式化，支持适应vue3中使用sketchRuler，同时改写为vue3 Composition API 的写法
2. 用typerscript进行重构，对类型进行定义，同时方便后续扩展
3. 对shadow和palette参数进行对象合并计算，在以前palette的参数要么都传，要么不传，我这里改进后可以只传需要修改的属性即可，没有修改的可以不传
4. 对类型进行打包设置（目前还不知道这个类型打包有多大的好处）

## 注意
如果迁移过来的工程,使用和vue-sketch-ruler一样功能的,请使用1X版本,2X版本是经过改造后的,功能和1X一样,但配置简化了,新工程建议使用2X版本构建
## demo
案例浏览: [https://majun2232.github.io/vue3sketchRuler/](https://majun2232.github.io/vue3sketchRuler)
![image](https://github.com/majun2232/vue3sketchRuler/blob/master/example/assets/demo.png)

## 安装
> 支持全局导入和模块导入
```
npm install --save vue3-sketch-ruler

or

yarn add vue3-sketch-ruler
```

## 引入方式
将打包后的dist包拷贝，用import导入，支持下面两种引用方式
```
import { SketchRule } from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'

 components: { SketchRule }
```
也可以是这样子
```
import SketchRule from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'

 components: SketchRule
```

## 支持的功能
- [x] 标尺渲染
- [x] 缩放内容，重绘标尺
- [x] 滚动内容，重绘标尺
- [x] 切换标尺状态，显示或隐藏
- [x] 参考线管理（增加删除）
- [x] 切换参考线状态，显示或隐藏

## 未来支持的功能

- [] 加入画布鼠标拖动功能
- [] 标角支持事件
- [] 右下角有个鼠标进入缩放小功能
- [] 左上角的眼睛，点击能控制红线显影
- [] 加入单元测试功能

这是个开源业余做的功能，有兴趣加强该插件的小伙伴欢迎加入，也欢迎大家提pr或者issue，，或者邮箱给我留言，253495832@qq.com
## 使用
```
<template>
  <div class="wrapper">
    <SketchRule
      :thick="state.thick"
      :scale="state.scale"
      :start-x="state.startX"
      :start-y="state.startY"
      :shadow="shadow"
      :hor-line-arr="state.lines.h"
      :ver-line-arr="state.lines.v"
      :corner-active="true"
      @handleLine="handleLine"
    >
    </SketchRule>
    <div
      id="screens"
      ref="screensRef"
      @wheel="handleWheel"
      @scroll="handleScroll"
    >
      <div ref="containerRef" class="screen-container">
        <div id="canvas" :style="canvasStyle" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { SketchRule } from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
import {
  computed,
  defineComponent,
  ref,
  reactive,
  onMounted,
  nextTick
} from 'vue'
// import { SketchRule } from '../../src/index' // 这里可以换成打包后的
const rectWidth = 200
const rectHeight = 200
export default defineComponent({
  components: { SketchRule },
  data() {
    return {
      height: '500px',
      font: {
        size: '2em'
      }
    }
  },
  setup() {
    const screensRef = ref(null)
    const containerRef = ref(null)
    const state = reactive({
      scale: 1,
      startX: 0,
      wrapperwith: 1200,  // 定义外面容器大小
      wrapperheight: 500,
      width: 1200,
      startY: 0,
      lines: {
        h: [0, 200],
        v: [0, 200]
      },
      thick: 20,
      isShowRuler: true, // 显示标尺
      isShowReferLine: true // 显示参考线
    })

    const wrapperwithpx = computed(() => state.wrapperwith + 22 + 'px')
    const wrapperheightpx = computed(() => state.wrapperheight + 22 + 'px')
    const shadow = computed(() => {
      return {
        x: 0,
        y: 0,
        width: rectWidth,
        height: rectHeight
      }
    })
    const canvasStyle = computed(() => {
      return {
        width: rectWidth,
        height: rectHeight,
        transform: `scale(${state.scale})`
      }
    })
    onMounted(() => {
      // 这里监听窗口变化, 可要可不要
      // window.addEventListener('resize', () => {
      //   state.wrapperwith = window.innerWidth - 400
      //   state.wrapperheight = window.innerHeight - 400
      // })
      // 滚动居中
      screensRef.value.scrollLeft =
        containerRef.value.getBoundingClientRect().width / 2 - 300
    })

    const handleLine = (lines: { h: number[]; v: number[] }) => {
      state.lines = lines
    }

    const handleScroll = () => {
      const screensRect = document
        .querySelector('#screens')
        .getBoundingClientRect()
      const canvasRect = document
        .querySelector('#canvas')
        .getBoundingClientRect()

      // 标尺开始的刻度
      const startX =
        (screensRect.left + state.thick - canvasRect.left) / state.scale
      const startY =
        (screensRect.top + state.thick - canvasRect.top) / state.scale

      state.startX = startX
      state.startY = startY
    }
    // 控制缩放值
    const handleWheel = (e: {
      ctrlKey: any
      metaKey: any
      preventDefault: () => void
      deltaY: number
    }) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const nextScale = parseFloat(
          Math.max(0.2, state.scale - e.deltaY / 500).toFixed(2)
        )
        state.scale = nextScale
      }
      nextTick(() => {
        handleScroll()
      })
    }

    return {
      wrapperwithpx,
      wrapperheightpx,
      screensRef,
      containerRef,
      state,
      shadow,
      canvasStyle,
      handleWheel,
      handleScroll,
      handleLine
    }
  }
})
</script>
<style lang="scss" scoped>
body {
  padding: 0;
  margin: 0;
  overflow: hidden;
  font-family: sans-serif;
}

body * {
  box-sizing: border-box;
  user-select: none;
}

.wrapper {
  position: absolute;
  top: 100px;
  left: 100px;
  // vue3 新写法,可以共享js中的变量,必须要写
  width: v-bind(wrapperwithpx);
  height: v-bind(wrapperheightpx);
  background-color: #f5f5f5;
  border: 1px solid #dadadc;
}

#screens {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.screen-container {
  position: absolute;
  width: 5000px;
  height: 3000px;
}

.scale-value {
  position: absolute;
  bottom: 100%;
  left: 100px;
}

.button {
  position: absolute;
  bottom: 100%;
  left: 100px;
}

#canvas {
  position: absolute;
  top: 80px;
  left: 50%;
  width: 200px;
  height: 200px;
  background: lightblue;
  transform-origin: 50% 0;
}
</style>

```
### 如果是需要查看普通方式写法[点击这里](https://github.com/majun2232/vue3sketchRuler/blob/master/example/components/user-ruler.vue)



### 属性

|  属性名称|  描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| scale | 初始化标尺的缩放 | Number | 2 |
| thick | 标尺的厚度 | Number | 16 |
| startX | x轴标尺开始的坐标数值 | Number | 0 |
| startY | y轴标尺开始的坐标数值 | Number | 0 |
| shadow |  阴影的参数  | Shadow | 0 |
| horLineArr | 初始化水平标尺上的参考线 | Array<number> | [] |
| verLineArr | 初始化垂直标尺上的参考线  | Array<number> | [] |
| palette | 标尺的样式配置参数 | Palette | {bgColor: 'rgba(225,225,225, 0)',longfgColor: '#BABBBC',shortfgColor: '#C8CDD0',fontColor: '#7D8694', shadowColor: '#E8E8E8',lineColor: '#EB5648', borderColor: '#DADADC',cornerActiveColor: 'rgb(235, 86, 72, 0.6)',} |


### Event

| 事件名称 | 描述 | 回调参数 |
| --- | --- | --- |
| handleLine | 在横纵标尺上操作参考线（新增或移除） | Lines  |

## 引用
vue标尺组件 [vue-sketch-ruler](https://github.com/chuxiaoguo/vue-sketch-ruler.git)

一个来自墨刀的react标尺组件 [mb-sketch-ruler](https://github.com/mockingbot/mb-sketch-ruler) .
