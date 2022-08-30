# vue3-sketch-ruler

>In using vue3/vue2, zoom operation for page display

[![]( https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)]( https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667) [![build status]( https://github.com/kakajun/vue3-sketch-ruler/actions/workflows/gh-pages.yml/badge.svg?branch=1x)]( https://github.com/kakajun/vue3-sketch-ruler/actions/workflows/gh-pages.yml)



English  | [中文](https://github.com/kakajun/vue3-sketch-ruler/blob/1x/README.CH.md)

时隔半年,重启mater的新版开发, 大家有兴趣的可以加我微信: ka132300  拉入群, 大家一起讨论
效果图如下

![image](https://github.com/kakajun/vue3-sketch-ruler/blob/1x/newruler.png)

🚀 Features

--

- 💪 Vue 3 Composition API

- 🔥 Written in TypeScript

- 🔋 SSR Friendly

- 💡 works for both Vue. js 2/3.


# Vue 3 + vite + TS package sketchrule

## Explain

---

Application scope of plug-in: it is suitable for operating page scaling tools on low code platforms, such as drawing tools, large screen visualization, drawing tools, drawing monsters, etc., with scaling effects similar to PS

Use Vue Demi, a set of code, package plug-ins in two environments, and support the use in vue2 and vue3 at the same time (when NPM installs plug-ins, it will automatically judge to load the code of the corresponding Vue version)



Application case: [Avenue large screen visualization tool](https://data.avuejs.com/build/1)

![image](https://github.com/kakajun/vue3-sketch-ruler/blob/1x/example/v2/assets/dp.png)



As the project was upgraded to vite, I found that the original plug-in Vue sketch ruler would report an error when used in vue3. Here, I repackaged a copy with vite. The packaged plug-in works the same as the original and supports the use in vue3 and vite



The original code has been improved and optimized here. The function is the same as that of vue3 sketch ruler before. There is no time for optimization. The main improvements are as follows

1. The eslint repair of vue3 and the code formatting of stylelint and pretty support the use of sketchrule in vue3 and rewrite it to the writing method of vue3 composition API

2. Refactoring with typescript to define types and facilitate subsequent expansion

3. Perform object consolidation calculation for shadow and palette parameters. In the past, palette parameters were either passed or not passed. After improvement, I can only pass the attributes that need to be modified, and those that have not been modified can not be passed

4. Package and set the type (support TS type prompt)

5. Support the introduction of nuxt3 plug-in (the error messages not defined in window have been handled)



The upgrade process is simple. I wrote a Nuggets article. Peers or interested parties can leave messages for communication



[Nuggets: large screen page zoom plug-in - upgrade](https://juejin.cn/post/7025195450080690212)



## Attention

1. If the plug-in is used in vue2 / vue3, it needs to be installed with Vue Demi plug-in. This plug-in does not pack Vue Demi. In addition, Vue Demi is only 18.2 KB, which is very small, and only plays the role of Vue version switching,

The 1x version here has the same function as Vue sketch ruler. If there are no bugs behind it, it will not be maintained. 1x basically does not change the original functions. If you need to download the source code or provide PR, please download the 1x branch. The new functions will be added in the next 2x. It is recommended to use the 1x version for the migration of old projects, and 2x for new projects, Achieve 0 configuration (I'm not satisfied with writing several versions during 2x dystocia, but this one will come out. The prototype has been transferred to the master branch)

## demo

Case browsing:[ https://kakajun.github.io/vue3-sketch-ruler/1x ]( https://kakajun.github.io/vue3-sketch-ruler/1x)

![image]( https://github.com/kakajun/vue3-sketch-ruler/blob/1x/example/assets/demo.png)

## Installation

>Supports global import and module import

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

## Introduction mode

Copy the packaged dist package and import it with import. The following two reference methods are supported

```

import { SketchRule } from 'vue3-sketch-ruler'

import 'vue3-sketch-ruler/lib/style. css'

components: { SketchRule }

```

It can also be like this

```

import SketchRule from 'vue3-sketch-ruler'

import 'vue3-sketch-ruler/lib/style. css'

components: SketchRule

```
## Supported functions

-[x] ruler rendering

-[x] zoom content, redraw ruler

-[x] scroll content, redraw ruler

-[x] toggles the ruler state to show or hide

-[x] reference line management (add delete)

-[x] supports dragging anywhere on the reference line

-[x] the eye in the upper left corner, click to control the red line development

-[x] General plug-in in vue2 / vue3

## Future supported functions

-[] add canvas mouse drag function

-[] there is a mouse in the lower right corner to enter the zoom function

-[] add unit test function

This is an open source amateur function. If you are interested in strengthening the plug-in, you are welcome to join, and you are also welcome to mention PR or issue

## Use

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

Refer to a complete example, [click here](https://github.com/kakajun/vue3-sketch-ruler/blob/1x/example/v3/components/user-ruler.vue)



Vue3 API example, [click here](https://github.com/kakajun/vue3-sketch-ruler/blob/1x/example/v3/components/user-rulerts.vue)



Examples used in nuxt3 [click here](https://github.com/kakajun/vue3-sketch-ruler/blob/1x/example/v3/components/Nuxt3.vue)

## api

### Attributes



|Attribute name | description | type | default value|

| --- | --- | --- | --- |

|Scale | initialize the scale of the scale | number | 2|

|Thickness | number | 16|

|Width | the width of the window where the ruler is placed | number | -|

|Height | height of the ruler window | number | -|

|Startx | coordinate value | number | 0 at the beginning of x-axis ruler|

|Starty | coordinate value | number | 0 at the beginning of y-axis ruler|

|Shadow | parameter of shadow | shadow | 0|

|Lines | initialize the reference line | object < array > | {H: [], V: []} on the horizontal ruler|

|Palette | the style configuration parameters | palette | of the ruler are as follows:|



palette:{bgColor: 'rgba(225,225,225, 0)',longfgColor: '#BABBBC',shortfgColor: '#C8CDD0',fontColor: '#7D8694', shadowColor: '#E8E8E8',lineColor: '#EB5648', borderColor: '#DADADC',cornerActiveColor: 'rgb(235, 86, 72, 0.6)',}

### Update description

v1.1.11

1. Discard: horlinearr = "lines. H" and: verlinearr = "lines. V" are unified and integrated into the lines object. The callback handleline is also discarded. It's useless. If you don't want lines, just let lines = {}

2. Kill some useless styles (it's really useless, and the previous projects are useless. I just turn over and don't need to study the code carefully, so it won't affect the previously migrated projects)

v1.2.3
1. Merge the methods, eliminate some unnecessary events, use V-model to pass parameters and optimize the code

2. Remove lodash and reduce the original packaging volume from 43K to 19.6k. It is a stable version. It is highly recommended to upgrade

v1.2.5
1. Handle the window position to prevent errors in the rendering of nuxt on the server, and support the normal use of nuxt3

v1.3.1

1. Use Vue Demi so that vue2 / vue3 can be used at the same time

### Event

|Event name | description | callback parameters|

| --- | --- | --- |

|Handlecornerclick | click event in the upper left corner|

## Quote

Vue ruler assembly [Vue sketch ruler](https://github.com/chuxiaoguo/vue-sketch-ruler.git)



A react ruler component from the ink knife [MB sketch ruler](https://github.com/mockingbot/mb-sketch-ruler) .
