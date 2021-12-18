# vue3-sketch-ruler

>In using vue3, the zoom operation used for page presentation

[![]( https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667 )]( https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667 ) [! [build status]( https://github.com/kakajun/vue3-sketch-ruler/actions/workflows/gh-pages.yml/badge.svg?branch=1x )]( https://github.com/kakajun/vue3-sketch-ruler/actions/workflows/gh-pages.yml )

Simplified Chinese | [English]（ https://github.com/kakajun/vue3-sketch-ruler/blob/1x/README.EN.md )

- 💪 Vue 3 Composition API

- 🔥 Written in TypeScript

# Vue 3 + vite + TS package sketchrule

Because the project was upgraded to vite, I found that the original plug-in Vue sketch ruler would report an error when used in vue3. Here, I repackaged a copy with vite. The packaged plug-in works the same as the original and supports the use in vue3 and vite

---

The original code has been improved and optimized here. The function is the same as that of vue3 sketch ruler before. There is no time for optimization. The main improvements are as follows

1. The eslint repair of vue3 and the code formatting of stylelint and pretty support the use of sketchrule in vue3, and rewrite it to the writing method of vue3 composition API

2. Refactoring with typescript to define types and facilitate subsequent expansion

3. Perform object consolidation calculation for shadow and palette parameters. Previously, palette parameters were either passed or not passed. After improvement, I can only pass the attributes that need to be modified, and those that have not been modified can not be passed

4. Package the type (I don't know the benefits of packaging this type yet)

## Note
 that the 1x version has the same function as Vue sketch ruler, and will not be maintained later. The new function will be added in 2x

## demo

Case browsing:[ https://kakajun.github.io/vue3-sketch-ruler/1x ]( https://kakajun.github.io/vue3-sketch-ruler/1x )

![image]( https://github.com/kakajun/vue3-sketch-ruler/blob/1x/example/assets/demo.png )

## Installation

>Supports global import and module import

```

npm install --save vue3-sketch-ruler

or

yarn add vue3-sketch-ruler

```

## Introduction mode

Copy the packaged dist package and import it with import. The following two reference methods are supported

```

import { SketchRule } from 'vue3-sketch-ruler'

import 'vue3-sketch-ruler/lib/style.css'

components: { SketchRule }

```

It can also be like this

```

import SketchRule from 'vue3-sketch-ruler'

import 'vue3-sketch-ruler/lib/style.css'

components: SketchRule

```

## Supported features

-[x] ruler rendering

-[x] zoom content, redraw ruler

-[x] scroll the contents and redraw the ruler

-[x] toggle ruler status, show or hide

-[x] reference line management (add delete)

-[x] toggles the reference line status, showing or hiding

## Future supported features

-[] add canvas mouse drag function

-[] corner support events

-[] there is a mouse in the lower right corner to enter the zoom function

-[] Click the eye in the upper left corner to control the red line development

-[] add unit test function

This is an open source amateur function. If you are interested in strengthening the plug-in, you are welcome to join. You are also welcome to mention PR or issue

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

Refer to a complete example, [click here]（ https://github.com/kakajun/vue3-sketch-ruler/blob/1x/example/components/UserRuler.vue )

Vue3 API example, [click here]（ https://github.com/kakajun/vue3-sketch-ruler/blob/1x/example/components/UserRulerts.vue )

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

|Shadow | shadow | 0|

|Lines | initialize the reference line | object < array > | {H: [], V: []} on the horizontal ruler|

|Palette | style configuration parameters of the ruler | palette | {bgcolor:'rgba (225225, 0) ', longfgcolor:' #babbbc ', shortfgcolor:' #c8cdd0 ', fontcolor:' #7d8694 ', shadowcolor:' #e8e8 ', linecolor:' #eb5648 ', bordercolor:' #dadc ', coreactivecolor:' RGB (235, 86, 72, 0.6),}|

### Update description

v1.1.11

1. Discard: horlinearr = "lines. H" and: verlinearr = "lines. V" are unified into lines objects. The callback handleline is also discarded. It's useless. If you don't want lines, just let lines = {}

2. Kill some useless styles (it's really useless, and the previous projects are useless. I just turn over and don't need to study the code carefully, so it won't affect the previously migrated projects)

### Event

|Event name | description | callback parameters|

| --- | --- | --- |

|Handlecornerclick | click event in the upper left corner ||

## Quote

Vue ruler assembly [Vue sketch ruler]（ https://github.com/chuxiaoguo/vue-sketch-ruler.git )

A react ruler component from the ink knife [MB sketch ruler]（ https://github.com/mockingbot/mb-sketch-ruler ) .
