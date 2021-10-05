
[English](https://github.com/majun2232/vue3sketchRuler) | 简体中文
vue3-sketch-ruler
----------------

> 在使用vue3中,用于页面展示的缩放操作

 [![](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)
](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)

English | [简体中文](https://github.com/majun2232/vue3sketchRuler/blob/master/README.zh-CN.md)

- 💪 Vue 3 Composition API
- 🔥 Written in TypeScript
# 介绍
vue3-sketch-ruler是对原vue-sketch-ruler重新打包, 这边对代码进行了vue3的eslint修复和styleLint和pretty的代码格式化,支持适应vue3中使用sketchRuler,同时改写为vue3 Composition API 的写法用typerscript进行改写,以方便大家使用
# Vue 3 + Vite + ts 打包sketchRuler
由于项目升级成vite, 发现原来的插件vue-sketch-ruler,用到vue3中会报错, 这边我重新用vite打包了一份, 打包后的插件和原来功一样, 且支持在vue3和vite中使用

## demo
案例浏览: [https://majun2232.github.io/vue3sketchRuler/](https://majun2232.github.io/vue3sketchRuler)
![image](https://github.com/majun2232/vue3sketchRuler/blob/master/src/assets/demo.png)

## 安装
> 支持全局导入和模块导入
```
npm install --save vue-sketch-ruler
```

## 引入方式
将打包后的dist包拷贝,用import导入,支持下面两种引用方式
```
import { SketchRule } from '/dist/index.es.js?3242'
 components: { SketchRule }
```
也可以是这样子
```
import SketchRule  from '/dist/index.es.js?3242'
 components: SketchRule
```
同时不要忘了引入样式
```
import '/dist/style.css'
```
## 支持的功能
- [x] 标尺渲染
- [x] 缩放内容，重绘标尺
- [x] 滚动内容，重绘标尺
- [x] 切换标尺状态，显示或隐藏
- [x] 参考线管理（增加删除）
- [x] 切换参考线状态，显示或隐藏

## 未来支持的功能

- [] 支持标尺的右键菜单
- [] 标角支持事件
- [] 分离css样式，支持导入样式
- [] 国际化

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
        :horLineArr="lines.h"
        :verLineArr="lines.v"
        :cornerActive="true"
        @handleLine="handleLine"
        @onCornerClick="handleCornerClick"
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
参考一个完整的例子，[点击这里](https://github.com/majun2232/vue3sketchRuler/blob/master/src/components/UserRuler.vue)

## api
### 接口 <TypeScript>
```
interface Lines {
    h: number[],
    v:  Array<Number>,
}
interface Shadow {
    x: number,
    y: number,
    width: number,
    height: number
}
interface Palette {
    bgColor: string, // ruler bg color
    longfgColor: string, // ruler longer mark color
    shortfgColor: string, // ruler shorter mark color
    fontColor: string, // ruler font color
    shadowColor: string, // ruler shadow color
    lineColor: string,
    borderColor: string',
    cornerActiveColor: string,
}
```
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
