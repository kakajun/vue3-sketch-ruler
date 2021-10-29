# vue3-sketch-ruler

> 在使用vue3中,用于页面展示的缩放操作


 [![](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)  [![build status](https://github.com/majun2232/vue3sketchRuler/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/majun2232/vue3sketchRuler/actions/workflows/node.js.yml)

 简体中文 | [English](https://github.com/majun2232/vue3sketchRuler/blob/1x/README.EN.md)

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
这里1X版本和vue-sketch-ruler 一样功能, 后面也不再维护, 新功能将会在2X中增加
## demo
案例浏览: [https://majun2232.github.io/vue3sketchRuler/1x](https://majun2232.github.io/vue3sketchRuler/1x)
![image](https://github.com/majun2232/vue3sketchRuler/blob/1x/example/assets/demo.png)

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
        :cornerActive="true"
    >
</template>
<script>
import Vue from 'vue';
import {SketchRule} from "vue-sketch-ruler";
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
参考一个完整的例子，[点击这里](https://github.com/majun2232/vue3sketchRuler/blob/1x/example/components/UserRuler.vue)
vue3 api 的例子，[点击这里](https://github.com/majun2232/vue3sketchRuler/blob/1x/example/components/UserRulerts.vue)

## api
### 属性

|  属性名称|  描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| scale | 初始化标尺的缩放 | Number | 2 |
| thick | 标尺的厚度 | Number | 16 |
| width | 放置标尺窗口的宽度  | Number | - |
| height | 放置标尺窗口的高度  | Number | - |
| startX | x轴标尺开始的坐标数值 | Number | 0 |
| startY | y轴标尺开始的坐标数值 | Number | 0 |
| shadow |  阴影的参数  | Shadow | 0 |
| lines | 初始化水平标尺上的参考线 | object<Array> | {h:[],v:[]} |
| palette | 标尺的样式配置参数 | Palette | {bgColor: 'rgba(225,225,225, 0)',longfgColor: '#BABBBC',shortfgColor: '#C8CDD0',fontColor: '#7D8694', shadowColor: '#E8E8E8',lineColor: '#EB5648', borderColor: '#DADADC',cornerActiveColor: 'rgb(235, 86, 72, 0.6)',} |

### 更新说明
v1.1.11
1. 废弃掉 :horLineArr="lines.h"  和 :verLineArr="lines.v"  统一整合为lines对象传入,回调handleLine也废弃掉, 没什么用,如果不想要lines,就直接让lines={}
2. 干掉一些没用的样式(是真没用,之前的工程也没用,我只是翻过来没用仔细研究代码,所以不会影响之前迁移的项目)

v1.1.12
1. 把方法进行合并
2. 把lodash去掉,原打包体积由43k减少到19.6k
### Event

| 事件名称 | 描述 | 回调参数 |
| --- | --- | --- |
| handleCornerClick | 左上角点击事件 |   |

## 引用
vue标尺组件 [vue-sketch-ruler](https://github.com/chuxiaoguo/vue-sketch-ruler.git)

一个来自墨刀的react标尺组件 [mb-sketch-ruler](https://github.com/mockingbot/mb-sketch-ruler) .
