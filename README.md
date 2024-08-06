# vue3-sketch-ruler

> In using vue3, the zoom operation used for page presentation

[![](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667) [![build status](https://github.com/kakajun/vue3-sketch-ruler/actions/workflows/gh-pages.yml/badge.svg?branch=master)](https://github.com/kakajun/vue3-sketch-ruler/actions/workflows/gh-pages.yml)

## 🚀 Features

- 💪 Vue 3 Composition API
- 🔥 Written in TypeScript
- 💡 以鼠标为中心缩放页面, 可以使用pazoom的特性
- 📦 减化配置
- 💎 提供还原, 放大, 缩小的功能
- 📦 平台与业务代码通过插槽的方式进行分离, 也就是你只需要专注你的业务代码, 其他交给平台

## 🌈 应用案例:

<!-- [avue大屏可视化工具](https://data.avuejs.com/build/1) ![image](https://github.com/kakajun/vue3-sketch-ruler/blob/1x/example/v2/assets/dp.png) -->

[GoView 高效拖拽式低代码数据可视化开发平台](https://vue.mtruning.club/#/project/items)

[GoView 2X 应用源码地址](https://gitee.com/majun2232/go-view)

## ✨ 升级特性(同1X比较)

1. 在原来1X版本中满足基本的缩放和标注辅助线的功能, 但是缩放时, 是固定以画面左上角位缩放点, 这样子在实际操作中会很不方便，所以这里对缩放功能进行了改进，以鼠标为中心缩放页面，这样在操作中会更方便。缩放采用改造过的pazoom插件,加了些方法使得更适配我的插件, 详情见[pazoom](https://github.com/kakajun/simple-panzoom.git)
2. 对辅助线做了调整, 减少了细刻度的绘制, 因为已经有刻度显示, 删除后画面更加简洁
3. 辅助线位置显示跟随鼠标移动
4. 删除辅助线是以拖拽线条到编辑框外即可
5. 新增还原, 放大, 缩小的API，自动居中对齐
6. 修改引用方式, 减少繁琐的配置
7. 对标墨刀, 修改新增和删除参考线
8. 初始化自动居中对齐
9. 新增辅助线对刻度有吸附效果

升级过程简单写了一篇掘金文章, 同行或感兴趣的可以留言交流

[掘金:1X 大屏页面缩放插件---升级改造](https://juejin.cn/post/7025195450080690212)

[掘金:2X `vue3-sketch-ruler`插件的蜕变与升级](https://juejin.cn/post/7390134326871228428)

## 🔑 说明

1. 插件应用范围: 适合作为低代码平台操作页面缩放工具,比如做图工具如, 大屏可视化, 做图工具图怪兽等,类似ps的缩放效果.
2. 由1X 版本升级2X可以参考[GoView 2X 应用源码地址](https://gitee.com/majun2232/go-view) 的提交修改记录进行
3. 此master最新2X版本只在vue3中使用, 如果需要学习vue-demi关于vue2/vue3通用组件的,或者希望用到原来风格的, 请切换到1x分支, 使用1X版本。
4. 注意2X版本作为加强版，重构了内核与1X版本使用方法有较大的变革，不兼容，请谨慎升级！继续使用1X版本的同学，请切换到1x分支阅读使用文档[1x](https://github.com/kakajun/vue3-sketch-ruler/tree/1x)

## 🦄 demo

案例浏览: [https://kakajun.github.io/vue3-sketch-ruler](https://kakajun.github.io/vue3-sketch-ruler) ![image](https://github.com/kakajun/vue3-sketch-ruler/blob/master/example/assets/1.png)

## 安装

> 支持全局导入和模块导入

```js
npm install --save vue3-sketch-ruler

yarn add vue3-sketch-ruler  -S
```

## 引入方式

将打包后的dist包拷贝，用import导入，支持下面两种引用方式

```
import SketchRule from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
```

## 支持的功能

- [x] 标尺渲染
- [x] 缩放内容，重绘标尺
- [x] 按Ctrl+鼠标滚轮缩放, 根据鼠标位置发生变化
- [x] 按空格拖动画布
- [x] 切换标尺状态，显示或隐藏
- [x] 参考线管理（增加删除）
- [x] 支持参考线任意地方拖拽
- [x] 左上角的眼睛，点击能控制红线显影
- [x] 初始化自动居中
- [x] 提供右下角按钮缩放,还原所需API
- [x] 刻度吸附效果
- [x] 选中阴影阴影响应

## 未来计划

- [] 加入单元测试功能

这是个开源业余做的功能，有兴趣加强该插件的小伙伴欢迎加入

## 使用

```
<SketchRule
  :thick="state.thick"
  v-model:scale="state.scale"
  :width="rectWidth"
  :height="rectHeight"
  :canvasWidth="canvasWidth"
  :canvasHeight="canvasHeight"
  ref="sketchrule"
  :isShowReferLine="state.isShowReferLine"
  @onCornerClick="handleCornerClick"
  :lines="state.lines"
>
  <template #default>
    <div data-type="page" :style="canvasStyle">
      <img class="img-style" :src="bgImg" alt="" />>
    </div>
  </template>
  <template #btn="{ resetMethod, zoomInMethod, zoomOutMethod }">
    <div class="btns">
      <button class="btn reset-btn" @click="resetMethod">还原</button>
      <button class="btn zoomin-btn" @click="zoomInMethod">放大</button>
      <button class="btn zoomout-btn" @click="zoomOutMethod">缩小</button>
    </div>
  </template>
</SketchRule>

import Vue from 'vue';
import {SketchRule} from "vue-sketch-ruler";
import 'vue3-sketch-ruler/lib/style.css'
const rectWidth = 1600
const rectHeight = 800
const canvasWidth = 1000
const canvasHeight = 500

```

参考一个完整的例子，[点击这里](https://github.com/kakajun/vue3-sketch-ruler/blob/master/example/components/user-rulerts.vue)

## api

### 属性

| 属性名称 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| scale | 初始化标尺的缩放及画布 | Number | 1 |
| rate | 初始化标尺的缩放 | Number | 1 |
| thick | 标尺的厚度 | Number | 16 |
| width | 放置标尺窗口的宽度 | Number | 1400 |
| height | 放置标尺窗口的高度 | Number | 900 |
| paddingRatio | 画布与外框间隔 | Number | 20% (基于外框宽高最小长度) |
| autoCenter | 自动居中对齐 | Boolean | true (设为false,那么需要在panzoomOption中传入startX,startY) |
| eyeIcon | 睁眼图标 | String | - |
| closeEyeIcon | 闭眼图标 | String | - |
| canvasWidth | 画布宽 | Number | 1000 |
| canvasHeight | 画布高 | Number | 700 |
| isShowReferLine | 是否显示标线 | Boolean | true |
| showRuler | 是否显示尺规 | Boolean | true |
| lines | 初始化水平标尺上的参考线 | object<Array> | {h:[],v:[]} |
| snapsObj | 吸附刻度集合 | object<Array> | {h:[],v:[]} |
| snapThreshold | 吸附距离 | Number | 5 |
| shadow | 阴影配置 | object<Number> | {x: 0,y: 0, width: 0, height: 0} |
| gridRatio | 刻度分散比例 | Number | 1 |
| selfHandle | 自己处理监听移动和缩放 | Boolean | false |
| panzoomOption | panzoom相关的扩展参数 | object | - |
| palette | 标尺的样式配置参数 | Object | 如下表 |

| 属性名称      | 描述           | 默认值                         |
| ------------- | -------------- | ------------------------------ |
| bgColor       | 画布背景       | #f6f7f9                        |
| longfgColor   | 刻度背景       | #BABBBC                        |
| fontColor     | 刻度字体颜色   | #7D8694                        |
| shadowColor   | 激活阴影背景   | #E8E8E8                        |
| lineColor     | 对准线颜色     | #51d6a9                        |
| lineType      | 对准线类型     | solid (solid \dashed \ dotted) |
| lockLineColor | 锁定对准线颜色 | #d4d7dc                        |
| hoverColor    | 标签颜色字体   | #fff                           |
| hoverBg       | 标签颜色背景   | #000                           |
| borderColor   | 尺子外边框颜色 | #eeeeef                        |

> 更多pazoom插件的配置的panzoomOption参数，可以参考[pazoom document](https://github.com/timmywil/panzoom)

### 更新说明

### Event

| 事件名称      | 描述              | 回调参数                                                    |
| ------------- | ----------------- | ----------------------------------------------------------- |
| onCornerClick | 左上角点击事件    |                                                             |
| zoomchange    | 画布移动,缩放事件 | {dimsOut:{elem: {}, parent: {}},originalEvent:{},scale,x,y} |

### 使用说明

1. 同时按Ctrl+鼠标滚轮缩放, 根据鼠标位置发生页面缩放
2. 同时按空格+鼠标左键, 拖动画布
3. 有些需要自己定义监听移动和缩放，不想按空格移动, 或者不想Ctrl+weel 移动, 那么可以设置selfHandle为true，然后通过ref获取到组件实例，然后通过实例调用组件的方法, 自定义监听按键
4. 具体操作参见我插件里面的监听移动和缩放方法

```js
const panzoomInstance = sketchruleRef.value.panzoomInstance

document.addEventListener('wheel', function (e) {
  if (e.ctrlKey || e.metaKey) {
    panzoomInstance.value?.zoomWithWheel(e)
  }
})

// 让按下空格键才能移动画布
document.addEventListener('keydown', function (e) {
  if (e.key === ' ') {
    panzoomInstance.value?.bind()
    e.preventDefault()
  }
})

document.addEventListener('keyup', function (e) {
  if (e.key === ' ') {
    panzoomInstance.value?.destroy()
  }
})
```

### 插槽提供方法

| 事件名称 | 描述         | 回调参数 |
| -------- | ------------ | -------- |
| reset    | 画布重置位置 |          |
| zoomIn   | 画布放大     |          |
| zoomIn   | 画布缩小     |          |

## 引用

vue标尺组件 [vue-sketch-ruler](https://github.com/chuxiaoguo/vue-sketch-ruler.git)
