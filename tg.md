hello，大家好，我是卡卡军。之前和大家分享了[玩转vue-demi,打造vue2/3通用插件](https://juejin.cn/post/7055261325911719944)，文章是用插件`vue3-sketch-ruler`改造为题材的，经过两年多的时间，截止目前这款插件周下载率为400多次，这也是我做开源插件的 Motivation。但这款插件的缩放不是以鼠标为中心进行的， 这让我一直想找时间和契机去升级它，终于经过一个多月的闲暇时间的打磨，弄出了2X版本，并进行了发布。

## 🌟 简介

`vue3-sketch-ruler`是一款专为Vue 3设计的页面缩放操作插件，使用TypeScript编写，并且对服务器端渲染（SSR）友好。这个插件提供了一种以鼠标为中心的页面缩放方式，简化了配置，并通过插槽的方式分离平台与业务代码，让开发者可以专注于业务逻辑。

## 🔑 应用场景

适用于需要页面缩放功能的工具，如大屏可视化、图形设计软件等

## ✨ 升级亮点

- 改进了缩放功能，实现以鼠标为中心的页面缩放。
- 优化了辅助线显示，界面更简洁。
- 新增了还原、放大、缩小的API，提供更多控制选项。
- 简化了引用方式，减少配置的复杂性。

## 🎉 在线Demo

- 浏览案例：[vue3-sketch-ruler Demo](https://kakajun.github.io/vue3-sketch-ruler)
- ![Demo Screenshot](https://github.com/kakajun/vue3-sketch-ruler/blob/master/example/assets/newDemo.png)

## 📚 设计思路

1. **结构调整**： 上个版本transformOrigin: 0 0; 这么设计是为了能方便计算尺子的缩放位置, 但是之前的结构存在问题，尺子的摆放跟用户的div的摆放是平级, 所以尺规组件内部并不知道canvas目前的位置状态📚，现在更改为插槽的方式，尺规是父级，外部内容插槽传入尺规内部，然后通过`dom.getBoundingClientRect()`可以计算出目前画布位置。

2. **缩放中心**：鼠标位置作为缩放中心，实现以鼠标为中心的缩放。这个在自己写demo时参考过好几篇文章关于叙述transform matrix 的文章， 然后也尝试用js 实现，但是发现还是有bug，所以最后还是参考了网上的思路，用pazoom(css transform)实现。这个插件很小， 很适合作为工具插件， 减少配置， 减少开发成本。

3. **辅助线**：辅助线显示优化，界面更简洁。既然是大改，就不用考虑历史兼容问题，直接改了。小刻度去掉，参考稿定的设计，中间hover时让标签跟着鼠标走。


## 🚀 未来计划

1. 先稳定上面的版本，后续有时间想做个右下角导航的，因为是slot传组件进来的， 所以全局的导航组件，也可以接收到外面模板的信息， 再这个基础上可以轻而易举的让导航跟外部进行实时同步展现。
2. 让辅助线有磁吸的效果，辅助线跟整点刻度吸附，跟内部div块进行吸附， 这样子就方便开发