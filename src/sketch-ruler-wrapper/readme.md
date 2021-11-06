## 设计思路
1. 小图右下角,整个视图在左侧排列
2. 左侧区域分为尺规区域,画布区域
3. 画布又分为画布和实体展示区域
4. 小图区域和整个画布成比例缩放,缩放比分为小图smallScale和previewScale
5. 初始化容器预览区域大小defaultZoomSize,
6. 初始化容器小图区域,传一个 大小defaultZoomSize
