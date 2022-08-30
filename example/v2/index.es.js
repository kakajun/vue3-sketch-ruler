/*!
* vue2 v1.3.5
* 2022年8月Tue Aug 30 2022 23:26:43 GMT+0800 (中国标准时间)
* 制作
*/
import { defineComponent, ref, onMounted, computed, reactive, watch } from "vue-demi";
var __vue2_script$3 = defineComponent({
  name: "LineRuler",
  props: {
    scale: Number,
    thick: Number,
    palette: Object,
    index: Number,
    start: Number,
    vertical: Boolean,
    value: Number,
    isShowReferLine: Boolean
  },
  emits: ["onMouseDown", "onRelease", "onRemove"],
  setup(props, { emit }) {
    const startValue = ref(0);
    const showLine = ref(true);
    onMounted(() => {
      startValue.value = props.value;
    });
    const setShowLine = (offset2) => {
      showLine.value = offset2 >= 0;
    };
    const offset = computed(() => {
      const offset2 = (startValue.value - props.start) * props.scale;
      setShowLine(offset2);
      const positionValue = offset2 + "px";
      const position = props.vertical ? { top: positionValue } : { left: positionValue };
      return position;
    });
    const borderCursor = computed(() => {
      var _a;
      const borderValue = `1px solid ${(_a = props.palette) == null ? void 0 : _a.lineColor}`;
      const border = props.vertical ? { borderTop: borderValue } : { borderLeft: borderValue };
      const cursorValue = props.isShowReferLine ? props.vertical ? "ns-resize" : "ew-resize" : "none";
      return {
        cursor: cursorValue,
        ...border
      };
    });
    const actionStyle = computed(() => {
      const actionStyle2 = props.vertical ? { left: props.thick + "px" } : { top: props.thick + "px" };
      return actionStyle2;
    });
    const handleDown = (e) => {
      const startD = props.vertical ? e.clientY : e.clientX;
      const initValue = startValue.value;
      emit("onMouseDown");
      const onMove = (e2) => {
        const currentD = props.vertical ? e2.clientY : e2.clientX;
        const newValue = Math.round(
          initValue + (currentD - startD) / props.scale
        );
        startValue.value = newValue;
      };
      const onEnd = () => {
        emit("onRelease", startValue.value, props.index);
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onEnd);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onEnd);
    };
    const handleRemove = () => {
      emit("onRemove", props.index);
    };
    return {
      startValue,
      showLine,
      offset,
      borderCursor,
      actionStyle,
      handleDown,
      handleRemove
    };
  }
});
var render$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.showLine,
      expression: "showLine"
    }],
    staticClass: "line",
    style: [_vm.offset, _vm.borderCursor],
    on: {
      "mousedown": _vm.handleDown
    }
  }, [_c("div", {
    staticClass: "action",
    style: _vm.actionStyle
  }, [_c("span", {
    staticClass: "del",
    on: {
      "click": _vm.handleRemove
    }
  }, [_vm._v("\xD7")]), _c("span", {
    staticClass: "value"
  }, [_vm._v(_vm._s(_vm.startValue))])])]);
};
var staticRenderFns$3 = [];
var rulerLine_vue_vue_type_style_index_0_scoped_true_lang = "";
function normalizeComponent(scriptExports, render2, staticRenderFns2, functionalTemplate, injectStyles, scopeId, moduleIdentifier, shadowMode) {
  var options = typeof scriptExports === "function" ? scriptExports.options : scriptExports;
  if (render2) {
    options.render = render2;
    options.staticRenderFns = staticRenderFns2;
    options._compiled = true;
  }
  if (functionalTemplate) {
    options.functional = true;
  }
  if (scopeId) {
    options._scopeId = "data-v-" + scopeId;
  }
  var hook;
  if (moduleIdentifier) {
    hook = function(context) {
      context = context || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext;
      if (!context && typeof __VUE_SSR_CONTEXT__ !== "undefined") {
        context = __VUE_SSR_CONTEXT__;
      }
      if (injectStyles) {
        injectStyles.call(this, context);
      }
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    };
    options._ssrRegister = hook;
  } else if (injectStyles) {
    hook = shadowMode ? function() {
      injectStyles.call(
        this,
        (options.functional ? this.parent : this).$root.$options.shadowRoot
      );
    } : injectStyles;
  }
  if (hook) {
    if (options.functional) {
      options._injectStyles = hook;
      var originalRender = options.render;
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }
  return {
    exports: scriptExports,
    options
  };
}
const __cssModules$3 = {};
var __component__$3 = /* @__PURE__ */ normalizeComponent(
  __vue2_script$3,
  render$3,
  staticRenderFns$3,
  false,
  __vue2_injectStyles$3,
  "493b3718",
  null,
  null
);
function __vue2_injectStyles$3(context) {
  for (let o in __cssModules$3) {
    this[o] = __cssModules$3[o];
  }
}
var RulerLine = /* @__PURE__ */ function() {
  return __component__$3.exports;
}();
const getGridSize = (scale) => {
  if (scale <= 0.25)
    return 40;
  if (scale <= 0.5)
    return 20;
  if (scale <= 1)
    return 10;
  if (scale <= 2)
    return 5;
  if (scale <= 4)
    return 2;
  return 1;
};
const FONT_SCALE = 0.83;
const drawCavaseRuler = (ctx, start, selectStart, selectLength, options, h) => {
  const { scale, width, height, ratio, palette } = options;
  const { bgColor, fontColor, shadowColor, longfgColor, shortfgColor } = palette;
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  if (selectLength) {
    const shadowX = (selectStart - start) * scale;
    const shadowWidth = selectLength * scale;
    ctx.fillStyle = shadowColor;
    h ? ctx.fillRect(shadowX, 0, shadowWidth, height * 3 / 8) : ctx.fillRect(0, shadowX, width * 3 / 8, shadowWidth);
  }
  const gridSize = getGridSize(scale);
  const gridPixel = gridSize * scale;
  const gridSize10 = gridSize * 10;
  const gridPixel10 = gridSize10 * scale;
  const startValue = Math.floor(start / gridSize) * gridSize;
  const startValue10 = Math.floor(start / gridSize10) * gridSize10;
  const offsetX = (startValue - start) / gridSize * gridPixel;
  const offsetX10 = (startValue10 - start) / gridSize10 * gridPixel10;
  const endValue = start + Math.ceil((h ? width : height) / scale);
  ctx.beginPath();
  ctx.fillStyle = fontColor;
  ctx.strokeStyle = longfgColor;
  for (let value = startValue10, count = 0; value < endValue; value += gridSize10, count++) {
    const x = offsetX10 + count * gridPixel10 + 0.5;
    h ? ctx.moveTo(x, 0) : ctx.moveTo(0, x);
    ctx.save();
    h ? ctx.translate(x, height * 0.4) : ctx.translate(width * 0.4, x);
    if (!h) {
      ctx.rotate(-Math.PI / 2);
    }
    ctx.scale(FONT_SCALE / ratio, FONT_SCALE / ratio);
    ctx.fillText(value.toString(), 4 * ratio, 7 * ratio);
    ctx.restore();
    h ? ctx.lineTo(x, height * 9 / 16) : ctx.lineTo(width * 9 / 16, x);
  }
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.strokeStyle = shortfgColor;
  for (let value = startValue, count = 0; value < endValue; value += gridSize, count++) {
    const x = offsetX + count * gridPixel + 0.5;
    h ? ctx.moveTo(x, 0) : ctx.moveTo(0, x);
    if (value % gridSize10 !== 0) {
      h ? ctx.lineTo(x, height * 1 / 4) : ctx.lineTo(width * 1 / 4, x);
    }
  }
  ctx.stroke();
  ctx.closePath();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
};
var __vue2_script$2 = defineComponent({
  name: "CanvasRuler",
  props: {
    showIndicator: Boolean,
    valueNum: Number,
    scale: Number,
    ratio: Number,
    palette: Object,
    vertical: Boolean,
    start: Number,
    width: Number,
    height: Number,
    selectStart: Number,
    selectLength: Number
  },
  emits: ["onAddLine", "update:showIndicator", "update:valueNum"],
  setup(props, { emit }) {
    const state = reactive({
      canvasContext: null
    });
    let ratio = 1;
    const canvas = ref(null);
    onMounted(() => {
      ratio = props.ratio || window.devicePixelRatio || 1;
      initCanvasRef();
      updateCanvasContext(ratio);
      drawRuler(ratio);
    });
    const initCanvasRef = () => {
      state.canvasContext = canvas.value && canvas.value.getContext("2d");
    };
    const updateCanvasContext = (ratio2) => {
      if (canvas.value) {
        canvas.value.width = props.width * ratio2;
        canvas.value.height = props.height * ratio2;
        const ctx = state.canvasContext;
        if (ctx) {
          ctx.font = `${12 * ratio2}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`;
          ctx.lineWidth = 1;
          ctx.textBaseline = "middle";
        }
      }
    };
    const drawRuler = (ratio2) => {
      const options = {
        scale: props.scale,
        width: props.width,
        height: props.height,
        palette: props.palette,
        ratio: ratio2
      };
      if (state.canvasContext) {
        drawCavaseRuler(
          state.canvasContext,
          props.start,
          props.selectStart,
          props.selectLength,
          options,
          !props.vertical
        );
      }
    };
    watch(
      () => props.start,
      () => drawRuler(ratio)
    );
    watch([() => props.width, () => props.height], () => {
      updateCanvasContext(ratio);
      drawRuler(ratio);
    });
    const handle = (e, key) => {
      const getValueByOffset = (offset2, start, scale) => Math.round(start + offset2 / scale);
      const offset = props.vertical ? e.offsetY : e.offsetX;
      const value = getValueByOffset(offset, props.start, props.scale);
      switch (key) {
        case "click":
          emit("onAddLine", value);
          break;
        case "enter":
          emit("update:valueNum", value);
          emit("update:showIndicator", true);
          break;
        default:
          emit("update:valueNum", value);
          break;
      }
    };
    return {
      handle,
      canvas
    };
  }
});
var render$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("canvas", {
    ref: "canvas",
    staticClass: "ruler",
    on: {
      "click": function($event) {
        return _vm.handle($event, "click");
      },
      "mouseenter": function($event) {
        return _vm.handle($event, "enter");
      },
      "mousemove": function($event) {
        return _vm.handle($event, "move");
      },
      "mouseleave": function($event) {
        return _vm.$emit("update:showIndicator", false);
      }
    }
  });
};
var staticRenderFns$2 = [];
const __cssModules$2 = {};
var __component__$2 = /* @__PURE__ */ normalizeComponent(
  __vue2_script$2,
  render$2,
  staticRenderFns$2,
  false,
  __vue2_injectStyles$2,
  null,
  null,
  null
);
function __vue2_injectStyles$2(context) {
  for (let o in __cssModules$2) {
    this[o] = __cssModules$2[o];
  }
}
var CanvasRuler = /* @__PURE__ */ function() {
  return __component__$2.exports;
}();
const wrapperProps = {
  scale: Number,
  ratio: Number,
  thick: Number,
  palette: Object,
  vertical: {
    type: Boolean,
    default: true
  },
  width: {
    type: Number,
    default: 200
  },
  height: {
    type: Number,
    default: 200
  },
  start: {
    type: Number,
    default: 0
  },
  lines: {
    type: Array,
    default: () => []
  },
  selectStart: {
    type: Number
  },
  selectLength: {
    type: Number
  },
  isShowReferLine: {
    type: Boolean
  }
};
var __vue2_script$1 = defineComponent({
  name: "RulerWrapper",
  components: {
    CanvasRuler,
    RulerLine
  },
  props: wrapperProps,
  setup(props) {
    const showIndicator = ref(false);
    const valueNum = ref(0);
    const rwClassName = computed(() => {
      const className = props.vertical ? "v-container" : "h-container";
      return className;
    });
    const rwStyle = computed(() => {
      const hContainer = {
        width: `calc(100% - ${props.thick}px)`,
        height: `${props.thick + 1}px`,
        left: `${props.thick}px`
      };
      const vContainer = {
        width: `${props.thick && props.thick + 1}px`,
        height: `calc(100% - ${props.thick}px)`,
        top: `${props.thick}px`
      };
      return props.vertical ? vContainer : hContainer;
    });
    const indicatorStyle = computed(() => {
      var _a;
      const indicatorOffset = (valueNum.value - props.start) * props.scale;
      let positionKey = "top";
      let boderKey = "borderLeft";
      positionKey = props.vertical ? "top" : "left";
      boderKey = props.vertical ? "borderBottom" : "borderLeft";
      return {
        [positionKey]: indicatorOffset + "px",
        [boderKey]: `1px solid ${(_a = props.palette) == null ? void 0 : _a.lineColor}`
      };
    });
    const handleNewLine = (value) => {
      props.lines.push(value);
    };
    const handleLineRelease = (value, index) => {
      const offset = value - props.start;
      const maxOffset = (props.vertical ? props.height : props.width) / props.scale;
      if (offset < 0 || offset > maxOffset) {
        handleLineRemove(index);
      } else {
        props.lines[index] = value;
      }
    };
    const handleLineRemove = (index) => {
      props.lines.splice(index, 1);
    };
    return {
      showIndicator,
      valueNum,
      rwClassName,
      rwStyle,
      indicatorStyle,
      handleNewLine,
      handleLineRelease,
      handleLineRemove
    };
  }
});
var render$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    class: _vm.rwClassName,
    style: _vm.rwStyle
  }, [_c("CanvasRuler", {
    attrs: {
      "vertical": _vm.vertical,
      "scale": _vm.scale,
      "width": _vm.width,
      "height": _vm.height,
      "start": _vm.start,
      "ratio": _vm.ratio,
      "select-start": _vm.selectStart,
      "select-length": _vm.selectLength,
      "palette": _vm.palette
    },
    on: {
      "onAddLine": _vm.handleNewLine
    },
    model: {
      value: _vm.showIndicator,
      callback: function($$v) {
        _vm.showIndicator = $$v;
      },
      expression: "showIndicator"
    }
  }), _c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.isShowReferLine,
      expression: "isShowReferLine"
    }],
    staticClass: "lines"
  }, _vm._l(_vm.lines, function(v, i) {
    return _c("RulerLine", {
      key: v + i,
      attrs: {
        "index": i,
        "value": v >> 0,
        "scale": _vm.scale,
        "start": _vm.start,
        "thick": _vm.thick,
        "palette": _vm.palette,
        "vertical": _vm.vertical,
        "is-show-refer-line": _vm.isShowReferLine
      },
      on: {
        "onRemove": _vm.handleLineRemove,
        "onRelease": _vm.handleLineRelease
      }
    });
  }), 1), _c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.showIndicator,
      expression: "showIndicator"
    }],
    staticClass: "indicator",
    style: _vm.indicatorStyle
  }, [_c("div", {
    staticClass: "value"
  }, [_vm._v(_vm._s(_vm.valueNum))])])], 1);
};
var staticRenderFns$1 = [];
var rulerWrapper_vue_vue_type_style_index_0_scoped_true_lang = "";
const __cssModules$1 = {};
var __component__$1 = /* @__PURE__ */ normalizeComponent(
  __vue2_script$1,
  render$1,
  staticRenderFns$1,
  false,
  __vue2_injectStyles$1,
  "3718ebb4",
  null,
  null
);
function __vue2_injectStyles$1(context) {
  for (let o in __cssModules$1) {
    this[o] = __cssModules$1[o];
  }
}
var RulerWrapper = /* @__PURE__ */ function() {
  return __component__$1.exports;
}();
const eye64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAopJREFUOE/FlE9IVEEcx7+/N9ouds1Mu0QUSFZYdIgoUqQoKPBQHsKozpXE7jbTO/U8xLJvn6usBHWQ6hBFXupSkQeVbh0KJEPp0sH+eLGTsKs77xcj78m0ax0E8cHjzZv5zef3/c33xxA24KENYGJzoEEQbNNaN4Zh2OQ4znwYhr9c1/39vwrXVDo0NNS0tLR0GYB5D64BmAMwzMyvlFKz1es10Hw+f4mZ7wHYBeA9gNdENFepVOaEEM3M3OI4Thczn41gt6WUgQ3+C+r7/h0AWQD3mXnYqPA8L9nQ0HCemduIaFpKOWoAhUJhT6VSuQXgOjP3K6W8GLwKzeVyp4jonR0QBEErM48w8zFLyayUsjX+z+VyHhHdZebTSqkxM78CHRgYOKS1/ghgVErZY214RkQ7ADyRUj72ff8qgCtmXUrZGcf5vv8CwEUhxOF0Ov1pBRpla5dSdseBhUJhpznH6tIsZb1KqacW+BGArUaUXX63UuplHJTNZjuEEONSyhozfd/n6mQ1RkXZL2itz7mu+80EDA4ONi8vL/8AcM2UbikyR2BU9cSmmTU70YqKIAj2hWFo2uenlHK/BRg3Y2aeNO5GyU8S0ZbFxcUuz/NKEXAGQKPjOCcymcyX1dIi8DSAiWQyeaavr68cbSgCuBknYubnQoj+TCYzUywWE6VS6S2ADsdx2gxw1X3L7SNENMbMnwE8qK+vf5NKpRaMaeVyeW8ikfiaSqW+R7BuZr5BRMe11p2u607U9Gk8kc/ntzPzQwCmExYATDLzVBiGE0KIowAOADDf3QA+aK2VDaxRajto3K+rq+tl5nYAzQBamHmeiOYBTGmtR6ph/1Rqg9c73pz7dD1qN0TpHyNQRCUDJXrAAAAAAElFTkSuQmCC`;
const closeEye64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAjtJREFUOE/NlD9oFEEUxn9v9ghC0hpRUogIAUmniGAT/5Q2FrETPSNRJILg7RwimI0ox85eQFCEBGIUO1PYpFM0jSConQoBEZGgGPsgl+w+2eM2bC57SopAFqYZ3v7m+977ZoQt+GQLmGxPaBiGgYiMWWvXBHZUGoZhH3BERPYC+4F+4Keq/urt7b1RLpf/ZEBVHa9Wq0HWyg3QKIoGVPU8cA7wgK/pUtXPQJ8xZk+pVBpuNBqXUoUiEvi+P56fzTpo6+SbwHNg1lo7WzTITGEKXFlZeeB53tVCpa3CK8AFa+1cBgvD8LKIXAQOJkkyICJDeYVBEJS6u7s/qeoLa+1o+l9TqXNuBLhmjDlbqVQ+5ICjInIfOBPH8W9jzGCR5YmJiRNxHM+papgqzqDvgSlr7VTernPuO3An3c9bBt74vv+yrdaKyLDv+/1Sq9UGPc97nY9EVuycU2AQOA7cAm4Dr4D5TvVxHB9rKo2iaEFVp621Ln96FEUngaOqGmSxabVqsh3a2h+x1h5qQjNrae/yE4+iaCwDJkky73neTuBZe129Xk+H+BS4l7ZqLVIZ2BhzuFKpvMsDVXXWGPMxFdAedOfcKeCRqj7MYrUhpz09PfXl5eXrectFWXXODQHpOq2qd/95o/JXr6ura3J1dXU6SZIfwKKIHAD2tVYMPBGRx77vN10UXtO85fTkmZmZHUtLSzUR2QXsBhaAL6r6DXhbrVYXi1yss59GqOgub/bN3Z7v6X/tb9Zmp/q/kN8s+lJb8oEAAAAASUVORK5CYII=`;
const sketchRulerProps = {
  eyeIcon: {
    type: String
  },
  closeEyeIcon: {
    type: String
  },
  scale: {
    type: Number,
    default: 1
  },
  ratio: {
    type: Number
  },
  thick: {
    type: Number,
    default: 16
  },
  palette: Object,
  startX: {
    type: Number
  },
  startY: {
    type: Number,
    default: 0
  },
  width: {
    type: Number,
    default: 200
  },
  height: {
    type: Number,
    default: 200
  },
  shadow: {
    type: Object,
    default: () => {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    }
  },
  lines: {
    type: Object,
    default: () => {
      return {
        h: [],
        v: []
      };
    }
  },
  isShowReferLine: {
    type: Boolean,
    default: true
  }
};
var __vue2_script = defineComponent({
  name: "SketchRule",
  components: {
    RulerWrapper
  },
  props: sketchRulerProps,
  emits: ["onCornerClick", "handleLine"],
  setup(props, { emit }) {
    let showReferLine = ref(true);
    showReferLine.value = props.isShowReferLine;
    const paletteCpu = computed(() => {
      function merge(obj, o) {
        Object.keys(obj).forEach((key) => {
          if (key && obj.hasOwnProperty(key)) {
            if (typeof o["key"] === "object") {
              obj[key] = merge(obj[key], o[key]);
            } else if (o.hasOwnProperty(key)) {
              obj[key] = o[key];
            }
          }
        });
        return obj;
      }
      const finalObj = merge(
        {
          bgColor: "rgba(225,225,225, 0)",
          longfgColor: "#BABBBC",
          shortfgColor: "#C8CDD0",
          fontColor: "#7D8694",
          shadowColor: "#E8E8E8",
          lineColor: "#EB5648",
          borderColor: "#DADADC",
          cornerActiveColor: "rgb(235, 86, 72, 0.6)",
          menu: {
            bgColor: "#fff",
            dividerColor: "#DBDBDB",
            listItem: {
              textColor: "#415058",
              hoverTextColor: "#298DF8",
              disabledTextColor: "rgba(65, 80, 88, 0.4)",
              bgColor: "#fff",
              hoverBgColor: "#F2F2F2"
            }
          }
        },
        props.palette || {}
      );
      return finalObj;
    });
    const cornerStyle = computed(() => {
      return {
        backgroundImage: showReferLine.value ? `url(${props.eyeIcon || eye64})` : `url(${props.closeEyeIcon || closeEye64})`,
        width: props.thick + "px",
        height: props.thick + "px",
        borderRight: `1px solid ${paletteCpu.value.borderColor}`,
        borderBottom: `1px solid ${paletteCpu.value.borderColor}`
      };
    });
    const onCornerClick = (e) => {
      showReferLine.value = !showReferLine.value;
      emit("handleCornerClick", showReferLine.value);
    };
    watch([() => props.isShowReferLine], () => {
      showReferLine.value = props.isShowReferLine;
    });
    return {
      showReferLine,
      paletteCpu,
      cornerStyle,
      onCornerClick
    };
  }
});
var render = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    staticClass: "style-ruler mb-ruler",
    attrs: {
      "id": "mb-ruler"
    }
  }, [_c("RulerWrapper", {
    attrs: {
      "vertical": false,
      "width": _vm.width,
      "height": _vm.thick,
      "is-show-refer-line": _vm.showReferLine,
      "thick": _vm.thick,
      "ratio": _vm.ratio,
      "start": _vm.startX,
      "lines": _vm.lines.h,
      "select-start": _vm.shadow.x,
      "select-length": _vm.shadow.width,
      "scale": _vm.scale,
      "palette": _vm.paletteCpu
    }
  }), _c("RulerWrapper", {
    attrs: {
      "vertical": true,
      "width": _vm.thick,
      "height": _vm.height,
      "is-show-refer-line": _vm.showReferLine,
      "thick": _vm.thick,
      "ratio": _vm.ratio,
      "start": _vm.startY,
      "lines": _vm.lines.v,
      "select-start": _vm.shadow.y,
      "select-length": _vm.shadow.height,
      "scale": _vm.scale,
      "palette": _vm.paletteCpu
    }
  }), _c("a", {
    staticClass: "corner",
    style: _vm.cornerStyle,
    on: {
      "click": _vm.onCornerClick
    }
  })], 1);
};
var staticRenderFns = [];
var index_vue_vue_type_style_index_0_lang = "";
const __cssModules = {};
var __component__ = /* @__PURE__ */ normalizeComponent(
  __vue2_script,
  render,
  staticRenderFns,
  false,
  __vue2_injectStyles,
  null,
  null,
  null
);
function __vue2_injectStyles(context) {
  for (let o in __cssModules) {
    this[o] = __cssModules[o];
  }
}
var SketchRule = /* @__PURE__ */ function() {
  return __component__.exports;
}();
export { SketchRule, SketchRule as default };
