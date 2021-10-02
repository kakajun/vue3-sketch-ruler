

vue3-sketch-ruler
----------------

> Zoom operation for page presentation in vue3

 [![](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)
](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)

English | [简体中文](https://github.com/majun2232/vue3sketchRuler/blob/master/README.zh-CN.md)

# introduce



Vue3 sketch ruler repackages the original vue3 sketch ruler. Here, the code is eslint repaired by vue3 and formatted by stylelint and pretty. It supports the use of sketchruler in vue3. At the same time, it is rewritten into the writing method of vue3 composition API and rewritten with typescript for your convenience

# Vue 3 + vite + TS package sketchrule

Because the project was upgraded to vite, I found that the original plug-in Vue sketch ruler would report an error when used in vue3. Here, I repackaged a copy with vite. The packaged plug-in works the same as the original and supports the use in vue3 and vite


## demo

Case browsing:[ https://majun2232.github.io/vue3sketchRuler/ ]( https://majun2232.github.io/vue3sketchRuler )

! [image]( https://github.com/majun2232/vue3sketchRuler/blob/master/src/assets/demo.png )

##Introduction mode

Copy the packaged dist package and import it with import. The following two reference methods are supported

```

import { SketchRule } from '/dist/index.es.js? 3242'

components: { SketchRule }

```

It can also be like this

```

import SketchRule from '/dist/index.es.js? 3242'

components: SketchRule

```

And don't forget to introduce styles

```

import '/dist/style.css'

```
Supported features
------------------

*   ruler render
*   ruler render when scale
*   ruler render when srolling
*   switch status of ruler(show or hide)
*   reference line management
*   switch status of reference line (show or hide)

Upcoming features
-----------------

*   \[\] contextmenu of ruler
*   \[\] add event on corner
*   \[\] separate css style
*   \[\] international

Usage
-----

```
<template>
    <SketchRule
        :lang="lang"
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
import SketchRule from "vue-sketch-ruler";
const rectWidth = 160;
const rectHeight = 200;
export default Vue.extend({
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
            lang: "zh-CN",
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
A complete example can be found [here](https://github.com/majun2232/vue3sketchRuler/blob/master/src/components/UserRuler.vue)


api
---

### Interface

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

### Attributes

| Attributes | Description | Type | Default |
| --- | --- | --- | --- |
| lang | init language lang | String | zh-CN |
| scale | ruler scale size | Number | 2 |
| thick | thick size | Number | 16 |
| width | the window width of the currently loaded ruler | Number | \- |
| height | the window height of the currently loaded ruler | Number | \- |
| startX | x at the beginning of the ruler | Number | 0 |
| startY | y at the beginning of the ruler | Number | 0 |
| shadow | size and the start coordinates on the ruler of the shadow | Shadow | 0 |
| startY | y at the beginning of the ruler | Number | {x: 200,y: 100,width: 200,height: 400} |
| horLineArr | Initial values for horizontal reference lines | Array | \[\] |
| verLineArr | Initial values for vertical reference lines | Array | \[\] |
| palette | the palette of sketch ruler | Palette | {bgColor: 'rgba(225,225,225, 0)',longfgColor: '#BABBBC',shortfgColor: '#C8CDD0',fontColor: '#7D8694', shadowColor: '#E8E8E8',lineColor: '#EB5648', borderColor: '#DADADC',cornerActiveColor: 'rgb(235, 86, 72, 0.6)',} |

### Event

| EventName | Description | CallbackParam |
| --- | --- | --- |
| handleLine | horizontal or vertical reference lines has changed (add or remove) | Lines |

License
-------

MIT

reference
---------

a vue component  [vue-sketch-ruler](https://github.com/chuxiaoguo/vue-sketch-ruler.git) from mockingbot.
a react component [mb-sketch-ruler](https://github.com/mockingbot/mb-sketch-ruler) from mockingbot.
