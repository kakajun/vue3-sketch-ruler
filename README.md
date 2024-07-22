# vue3-sketch-ruler

> 此版本只在vue3中使用,用于页面展示的缩放操作, 最新版本为2X master 分支, 如果需要学习vue-demi关于vue2/vue3通用组件的, 请切换到1x分支

[![](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667) [![build status](https://github.com/kakajun/vue3-sketch-ruler/actions/workflows/gh-pages.yml/badge.svg?branch=master)](https://github.com/kakajun/vue3-sketch-ruler/actions/workflows/gh-pages.yml)

## 🚀 Features

- 💪 Vue 3 Composition API
- 🔥 Written in TypeScript
- 🔋 SSR Friendly
- 💡 以鼠标为中心缩放页面, 可以使用pazoom的特性
- 📦 减化配置
- 💎 提供还原, 放大, 缩小的功能
- 📦 平台与业务代码通过插槽的方式进行分离, 也就是你只需要专注你的业务代码, 其他交给平台

## 🔑 说明

---

插件应用范围: 适合作为低代码平台操作页面缩放工具,比如做图工具如, 大屏可视化, 做图工具图怪兽等,类似ps的缩放效果.

<!-- 应用案例: [avue大屏可视化工具](https://data.avuejs.com/build/1) ![image](https://github.com/kakajun/vue3-sketch-ruler/blob/1x/example/v2/assets/dp.png) -->

## ✨ 升级改造

1. 在原来1X版本中满足基本的缩放和标注辅助线的功能, 但是缩放时, 是固定以画面左上角位缩放点, 这样子在实际操作中会很不方便，所以这里对缩放功能进行了改进，以鼠标为中心缩放页面，这样在操作中会更方便。缩放采用改造过的pazoom插件,加了些方法使得更适配我的插件, 详情见[pazoom](https://github.com/kakajun/simple-panzoom.git)
2. 对辅助线做了调整, 减少了细刻度的绘制, 因为已经有刻度显示, 删除后画面更加简洁
3. 辅助线位置显示跟随鼠标移动
4. 删除辅助线是以拖拽线条到编辑框外即可
5. 新增还原, 放大, 缩小的API
6. 修改引用方式, 减少繁琐的配置
7. 对标墨刀, 修改新增和删除参考线

升级过程简单写了一篇掘金文章, 同行或感兴趣的可以留言交流

[掘金:1X 大屏页面缩放插件---升级改造](https://juejin.cn/post/7025195450080690212)

[掘金:2X `vue3-sketch-ruler`插件的蜕变与升级](https://juejin.cn/post/7390134326871228428)

## demo

案例浏览: [https://kakajun.github.io/vue3-sketch-ruler](https://kakajun.github.io/vue3-sketch-ruler) ![image](https://github.com/kakajun/vue3-sketch-ruler/blob/master/example/assets/newDemo.png)

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

 components: { SketchRule }
```

## 支持的功能

- [x] 标尺渲染
- [x] 缩放内容，重绘标尺
- [x] 缩放根据鼠标位置发生变化
- [x] 按空格拖动画布
- [x] 切换标尺状态，显示或隐藏
- [x] 参考线管理（增加删除）
- [x] 支持参考线任意地方拖拽
- [x] 左上角的眼睛，点击能控制红线显影
- [x] 提供右下角按钮缩放,还原所需API

## 未来支持功能

- [] 缩放导航功能
- [] 刻度吸附效果
- [] 加入单元测试功能

这是个开源业余做的功能，有兴趣加强该插件的小伙伴欢迎加入，也欢迎大家提pr或者issue

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

| 属性名称      | 描述                      | 类型          | 默认值      |
| ------------- | ------------------------- | ------------- | ----------- |
| scale         | 初始化标尺的缩放          | Number        | 2           |
| thick         | 标尺的厚度                | Number        | 16          |
| width         | 放置标尺窗口的宽度        | Number        | -           |
| height        | 放置标尺窗口的高度        | Number        | -           |
| eyeIcon       | 睁眼图标                  | String        | -           |
| closeEyeIcon  | 闭眼图标                  | String        | -           |
| canvasWidth   | x轴标尺刻度结束的坐标数值 | Number        | Infinity    |
| canvasHeight  | Y轴标尺刻度结束的坐标数值 | Number        | Infinity    |
| lines         | 初始化水平标尺上的参考线  | object<Array> | {h:[],v:[]} |
| panzoomOption | panzoom相关的扩展参数     | object        | -           |
| palette       | 标尺的样式配置参数        | Palette       | 如下        |

palette:{bgColor: 'rgba(225,225,225, 0)',longfgColor: '#BABBBC',fontColor: '#7D8694', shadowColor: '#E8E8E8',lineColor: '#EB5648', borderColor: '#DADADC',cornerActiveColor: 'rgb(235, 86, 72, 0.6)',}

> 更多pazoom插件的配置的panzoomOption参数，可以参考[pazoom document](https://github.com/timmywil/panzoom)

### 更新说明

### Event

| 事件名称      | 描述           | 回调参数 |
| ------------- | -------------- | -------- |
| onCornerClick | 左上角点击事件 |          |

### 插槽提供方法

| 事件名称 | 描述         | 回调参数 |
| -------- | ------------ | -------- |
| reset    | 画布重置位置 |          |
| zoomIn   | 画布放大     |          |
| zoomIn   | 画布缩小     |          |

## 引用

vue标尺组件 [vue-sketch-ruler](https://github.com/chuxiaoguo/vue-sketch-ruler.git)
