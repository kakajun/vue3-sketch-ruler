# vue3-sketch-ruler

> 在使用vue3/vue2中,用于页面展示的缩放操作


 [![](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)  [![build status](https://github.com/kakajun/vue3-sketch-ruler/actions/workflows/gh-pages.yml/badge.svg?branch=1x)](https://github.com/kakajun/vue3-sketch-ruler/actions/workflows/gh-pages.yml)

 简体中文 | [English](https://github.com/kakajun/vue3-sketch-ruler/blob/1x/README.md)

时隔半年,重启mater的新版开发, 大家有兴趣的可以加我微信: ka132300  拉入群, 大家一起讨论
效果图如下

![image](https://github.com/kakajun/vue3-sketch-ruler/blob/1x/newruler.png)
🚀 Features
--
- 💪 Vue 3 Composition API
- 🔥 Written in TypeScript
- 🔋 SSR Friendly
- 💡 works for both Vue.js 2/3.


# Vue 3 + Vite + ts 打包sketchRuler

## 说明
---
插件应用范围: 适合作为低代码平台操作页面缩放工具,比如做图工具如, 大屏可视化, 做图工具图怪兽等,类似ps的缩放效果.
使用vue-demi, 一套代码,打包两个环境的插件, 同时支持vue2和vue3中进行使用(在npm安装插件时,会自动判断载入对应vue版本的代码)

应用案例: [avue大屏可视化工具](https://data.avuejs.com/build/1)
![image](https://github.com/kakajun/vue3-sketch-ruler/blob/1x/example/v2/assets/dp.png)

由于项目升级成vite， 发现原来的插件vue-sketch-ruler，用到vue3中会报错， 这边我重新用vite打包了一份， 打包后的插件和原来功一样， 且支持在vue3和vite中使用

这边对原代码进行了改进优化，功能目前和之前vue3-sketch-ruler一样，还没时间优化，主要改进分为以下几点
1. vue3的eslint修复和styleLint和pretty的代码格式化，支持适应vue3中使用sketchRuler，同时改写为vue3 Composition API 的写法
2. 用typerscript进行重构，对类型进行定义，同时方便后续扩展
3. 对shadow和palette参数进行对象合并计算，在以前palette的参数要么都传，要么不传，我这里改进后可以只传需要修改的属性即可，没有修改的可以不传
4. 对类型进行打包设置（支持ts类型提示）
5. 支持Nuxt3插件引入(已经处理了window没有定义的报错)

升级过程简单写了一篇掘金文章, 同行或感兴趣的可以留言交流

[掘金:大屏页面缩放插件---升级改造](https://juejin.cn/post/7025195450080690212)

## 注意
1. 该插件如果在vue2/vue3中使用, 需要配套安装vue-demi插件, 本插件没有打包vue-demi, 另外vue-demi只有18.2 kB,非常小,仅做了vue版本切换作用,
这里1X版本和vue-sketch-ruler 一样功能, 后面没有什么bug的话,不再维护, 1x基本不动原有功能,需要下载源码的, 或者提pr的, 请下载1x分支, 新功能将会在未来2X中增加,老工程迁移过来的建议使用1x版本, 新项目建议使用2X,做到0配置(2x难产中, 写了好几个版本觉得不够满意, 不过这个一定会出来的, 雏形已经传到master分支)
## demo
案例浏览: [https://kakajun.github.io/vue3-sketch-ruler/1x](https://kakajun.github.io/vue3-sketch-ruler/1x)
![image](https://github.com/kakajun/vue3-sketch-ruler/blob/1x/example/assets/demo.png)

## 安装
> 支持全局导入和模块导入

vue3
```
npm install --save vue3-sketch-ruler vue-demi

or

yarn add vue3-sketch-ruler vue-demi -S
```

vue2
```
npm install --save vue3-sketch-ruler vue-demi @vue/composition-api

or

yarn add vue3-sketch-ruler vue-demi @vue/composition-api -S
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
- [x] 支持参考线任意地方拖拽
- [x] 左上角的眼睛，点击能控制红线显影
- [x] vue2/vue3 中通用本插件

## 未来支持的功能

- [] 加入画布鼠标拖动功能
- [] 右下角有个鼠标进入缩放小功能
- [] 加入单元测试功能

这是个开源业余做的功能，有兴趣加强该插件的小伙伴欢迎加入，也欢迎大家提pr或者issue
## 使用

```
<template>
    <SketchRule
        :thick="thick"
        :scale="scale"
        :width="582"
        :height="482"
        :startX="startX"
        :startY="startY"
        :shadow="shadow"
        :lines="lines"
    >
</template>
<script>
import Vue from 'vue';
import {SketchRule} from "vue-sketch-ruler";
import 'vue3-sketch-ruler/lib/style.css'
const rectWidth = 160;
const rectHeight = 200;
export default {
    data() {
        return {
            scale: 2, //658813476562495, //1,
            startX: 0,
            startY: 0,
            lines: {
                h: [100, 200],
                v: [100, 200]
            },
            thick: 20,
            isShowRuler: true,
            isShowReferLine: true
        }
    },
    components: {
        SketchRule
    }
});
</script>
```
参考一个完整的例子，[点击这里](https://github.com/kakajun/vue3-sketch-ruler/blob/1x/example/v3/components/user-ruler.vue)

vue3 api 的例子，[点击这里](https://github.com/kakajun/vue3-sketch-ruler/blob/1x/example/v3/components/user-rulerts.vue)

Nuxt3 中使用例子 [点击这里](https://github.com/kakajun/vue3-sketch-ruler/blob/1x/example/v3/components/Nuxt3.vue)
## api
### 属性

|  属性名称|  描述    | 类型 | 默认值 |
| --- | ---    | --- | --- |
| scale | 初始化标尺的缩放     | Number | 2 |
| thick | 标尺的厚度 | Number | 16 |
| width | 放置标尺窗口的宽度  | Number | - |
| height | 放置标尺窗口的高度  | Number | - |
| startX | x轴标尺开始的坐标数值 | Number | 0 |
| startY | y轴标尺开始的坐标数值 | Number | 0 |
| shadow |  阴影的参数  | Shadow | 0 |
| lines | 初始化水平标尺上的参考线 | object<Array> | {h:[],v:[]} |
| palette | 标尺的样式配置参数     | Palette | 如下|

palette:{bgColor: 'rgba(225,225,225, 0)',longfgColor: '#BABBBC',shortfgColor: '#C8CDD0',fontColor: '#7D8694', shadowColor: '#E8E8E8',lineColor: '#EB5648', borderColor: '#DADADC',cornerActiveColor: 'rgb(235, 86, 72, 0.6)',}
### 更新说明
v1.1.11
1. 废弃掉 :horLineArr="lines.h"  和 :verLineArr="lines.v"  统一整合为lines对象传入,回调handleLine也废弃掉, 没什么用,如果不想要lines,就直接让lines={}
2. 干掉一些没用的样式(是真没用,之前的工程也没用,我只是翻过来没用仔细研究代码,所以不会影响之前迁移的项目)

v1.2.3
1. 把方法进行合并,干掉一些不必要的事件,采用v-model传递参数,优化代码
2. 把lodash去掉,原打包体积由43k减少到19.6k, 稳定版,强烈推荐升级

v1.2.5
1. 处理window位置,防止Nuxt在服务端渲染时报错, 支持Nuxt3中正常使用

v1.3.1
1. 使用vue-demi 做到vue2/vue3中能同时使用

v1.3.4
全部更新vue的各种插件
感悟: 时隔这么久, 在更新版本时还是不那么顺利切换vue, 就是说vue2和vue3再互相切换中, 还是会有不知名的bug, 来验证我是否打包正确了, 或者切换版本正确了, 还有些小伙伴也和我有同样的困惑, 发邮件问我, 为此我另外又建了一个工程, vue2-sketch-ruler 可以在我工程里面找到, 这个里面的代码和这边是一样的, 版本插件也一样, 能够跑起来, 验证vue3代码打包成vue2能使用的插件, 如果大家还是有相同的困惑也像我这样子验证一下
当我确定能够行的通时, 那么只需要运行npm run build 那么两个版本的代码都打包好了

注意事项:
1. 由于vue2打包不支持script标签中直接写setup, 本来我都已经升级了setup方式能减少很多代码, 但打包v2报错, 无赖我又只能还原回去, 不知道后面 @vue/composition-api  会不会支持这种打包方式,目前我已经更新到了最新的1.6.2, 依然不支持,等后面再关注!
### Event

| 事件名称 | 描述 | 回调参数 |
| --- | --- | --- |
| handleCornerClick | 左上角点击事件 |   |

## 引用
vue标尺组件 [vue-sketch-ruler](https://github.com/chuxiaoguo/vue-sketch-ruler.git)

一个来自墨刀的react标尺组件 [mb-sketch-ruler](https://github.com/mockingbot/mb-sketch-ruler) .
