 [![](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)
](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)

English | [简体中文](https://github.com/majun2232/vue3sketchRuler/blob/master/README.zh-CN.md)

vue3-sketch-ruler
----------------

> Zoom operation for page presentation in vue3

introduce

--

Vue3 sketch ruler is a repackaging of the original Vue sketch ruler. Here, the eslint repair of vue3 and the code formatting of stylelint and pretty are carried out for the code. It supports the use of sketchruler in vue3 and rewrites it into the writing method of vue3 composition API. During the national day, this easy-to-use tool will be rewritten with typescript again to facilitate everyone's use

#Vue 3 + vite package sketchruler

Because the project was upgraded to vite, I found that the original plug-in Vue sketch ruler would report an error when used in vue3. Here, I repackaged a copy with vite. The packaged plug-in works the same as the original and supports the use in vue3

For more information, please refer to the source code at:[ https://github.com/chuxiaoguo/vue-sketch-ruler.git ]( https://github.com/chuxiaoguo/vue-sketch-ruler.git )

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
