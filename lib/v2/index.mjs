import { defineComponent as E, ref as _, onMounted as F, computed as w, reactive as K, watch as B } from "vue-demi";
/*!
* vue2 v1.3.15
* 2024年2月Mon Feb 19 2024 15:43:36 GMT+0800 (中国标准时间)
* 制作
*/
const M = E({
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
  setup(e, { emit: n }) {
    const t = _(0), l = _(!0);
    F(() => {
      t.value = e.value;
    });
    const s = (r) => {
      l.value = r >= 0;
    }, u = w(() => {
      const r = (t.value - e.start) * e.scale;
      s(r);
      const d = r + "px";
      return e.vertical ? { top: d } : { left: d };
    }), c = w(() => {
      var f;
      const r = `1px solid ${(f = e.palette) == null ? void 0 : f.lineColor}`, d = e.vertical ? { borderTop: r } : { borderLeft: r };
      return {
        cursor: e.isShowReferLine ? e.vertical ? "ns-resize" : "ew-resize" : "none",
        ...d
      };
    }), h = w(() => e.vertical ? { left: e.thick + "px" } : { top: e.thick + "px" });
    return {
      startValue: t,
      showLine: l,
      offset: u,
      borderCursor: c,
      actionStyle: h,
      handleDown: (r) => {
        const d = e.vertical ? r.clientY : r.clientX, i = t.value;
        n("onMouseDown");
        const f = (C) => {
          const b = e.vertical ? C.clientY : C.clientX, y = Math.round(i + (b - d) / e.scale);
          t.value = y;
        }, v = () => {
          n("onRelease", t.value, e.index), document.removeEventListener("mousemove", f), document.removeEventListener("mouseup", v);
        };
        document.addEventListener("mousemove", f), document.addEventListener("mouseup", v);
      },
      handleRemove: () => {
        n("onRemove", e.index);
      }
    };
  }
});
var z = function() {
  var e = this, n = e.$createElement, t = e._self._c || n;
  return t("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: e.showLine,
      expression: "showLine"
    }],
    staticClass: "line",
    style: [e.offset, e.borderCursor],
    on: {
      mousedown: e.handleDown
    }
  }, [t("div", {
    staticClass: "action",
    style: e.actionStyle
  }, [t("span", {
    staticClass: "del",
    on: {
      click: e.handleRemove
    }
  }, [e._v("×")]), t("span", {
    staticClass: "value"
  }, [e._v(e._s(e.startValue))])])]);
}, P = [];
function X(e, n, t, l, s, u, c, h) {
  var o = typeof e == "function" ? e.options : e;
  n && (o.render = n, o.staticRenderFns = t, o._compiled = !0), l && (o.functional = !0), u && (o._scopeId = "data-v-" + u);
  var a;
  if (c ? (a = function(i) {
    i = i || // cached call
    this.$vnode && this.$vnode.ssrContext || // stateful
    this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext, !i && typeof __VUE_SSR_CONTEXT__ < "u" && (i = __VUE_SSR_CONTEXT__), s && s.call(this, i), i && i._registeredComponents && i._registeredComponents.add(c);
  }, o._ssrRegister = a) : s && (a = h ? function() {
    s.call(
      this,
      (o.functional ? this.parent : this).$root.$options.shadowRoot
    );
  } : s), a)
    if (o.functional) {
      o._injectStyles = a;
      var r = o.render;
      o.render = function(f, v) {
        return a.call(v), r(f, v);
      };
    } else {
      var d = o.beforeCreate;
      o.beforeCreate = d ? [].concat(d, a) : [a];
    }
  return {
    exports: e,
    options: o
  };
}
const O = {};
var G = /* @__PURE__ */ X(
  M,
  z,
  P,
  !1,
  H,
  "37b219fd",
  null,
  null
);
function H(e) {
  for (let n in O)
    this[n] = O[n];
}
const W = /* @__PURE__ */ function() {
  return G.exports;
}(), q = (e) => e <= 0.25 ? 40 : e <= 0.5 ? 20 : e <= 1 ? 10 : e <= 2 ? 5 : e <= 4 ? 2 : 1, V = 0.83, Z = (e, n, t, l, s, u) => {
  const { scale: c, width: h, height: o, ratio: a, palette: r } = s, { bgColor: d, fontColor: i, shadowColor: f, longfgColor: v, shortfgColor: C } = r, b = u ? s.startNumX : s.startNumY, y = u ? s.endNumX : s.endNumY;
  if (e.scale(a, a), e.clearRect(0, 0, h, o), e.fillStyle = d, e.fillRect(0, 0, h, o), l) {
    const N = (t - n) * c, R = l * c;
    e.fillStyle = f, u ? e.fillRect(N, 0, R, o * 3 / 8) : e.fillRect(0, N, h * 3 / 8, R);
  }
  const A = q(c), L = A * c, g = A * 10, k = g * c, Y = Math.floor(n / A) * A, p = Math.floor(n / g) * g, x = (Y - n) / A * L, Q = (p - n) / g * k, U = n + Math.ceil((u ? h : o) / c);
  e.beginPath(), e.fillStyle = i, e.strokeStyle = v;
  for (let N = p, R = 0; N < U; N += g, R++) {
    if (N >= b && N <= y) {
      const m = Q + R * k + 0.5;
      u ? e.moveTo(m, 0) : e.moveTo(0, m), e.save(), u ? e.translate(m, o * 0.4) : e.translate(h * 0.4, m), u || e.rotate(-Math.PI / 2), e.scale(V / a, V / a), e.fillText(N.toString(), 4 * a, 7 * a), e.restore(), u ? e.lineTo(m, o * 9 / 16) : e.lineTo(h * 9 / 16, m);
    }
    e.stroke(), e.closePath(), e.beginPath(), e.strokeStyle = C;
    for (let m = Y, I = 0; m < U; m += A, I++)
      if (m >= b && m <= y) {
        const S = x + I * L + 0.5;
        u ? e.moveTo(S, 0) : e.moveTo(0, S), m % g !== 0 && (u ? e.lineTo(S, o * 1 / 4) : e.lineTo(h * 1 / 4, S));
      }
    e.stroke(), e.closePath(), e.setTransform(1, 0, 0, 1, 0, 0);
  }
}, j = E({
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
    selectLength: Number,
    startNumX: Number,
    endNumX: Number,
    startNumY: Number,
    endNumY: Number
  },
  emits: ["onAddLine", "update:showIndicator", "update:valueNum"],
  setup(e, { emit: n }) {
    const t = K({
      canvasContext: null
    });
    let l = 1;
    const s = _(null);
    F(() => {
      l = e.ratio || window.devicePixelRatio || 1, u(), c(l), h(l);
    });
    const u = () => {
      t.canvasContext = s.value && s.value.getContext("2d");
    }, c = (a) => {
      if (s.value) {
        s.value.width = e.width * a, s.value.height = e.height * a;
        const r = t.canvasContext;
        r && (r.font = `${12 * a}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`, r.lineWidth = 1, r.textBaseline = "middle");
      }
    }, h = (a) => {
      const r = {
        scale: e.scale,
        width: e.width,
        height: e.height,
        palette: e.palette,
        startNumX: e.startNumX,
        endNumX: e.endNumX,
        startNumY: e.startNumY,
        endNumY: e.endNumY,
        ratio: a
      };
      t.canvasContext && Z(
        t.canvasContext,
        e.start,
        e.selectStart,
        e.selectLength,
        r,
        !e.vertical
      );
    };
    return B(
      () => e.start,
      () => h(l)
    ), B([() => e.width, () => e.height], () => {
      c(l), h(l);
    }), {
      handle: (a, r) => {
        const d = (v, C, b) => Math.round(C + v / b), i = e.vertical ? a.offsetY : a.offsetX, f = d(i, e.start, e.scale);
        switch (r) {
          case "click":
            n("onAddLine", f);
            break;
          case "enter":
            n("update:valueNum", f), n("update:showIndicator", !0);
            break;
          default:
            n("update:valueNum", f);
            break;
        }
      },
      canvas: s
    };
  }
});
var J = function() {
  var e = this, n = e.$createElement, t = e._self._c || n;
  return t("canvas", {
    ref: "canvas",
    staticClass: "ruler",
    on: {
      click: function(l) {
        return e.handle(l, "click");
      },
      mouseenter: function(l) {
        return e.handle(l, "enter");
      },
      mousemove: function(l) {
        return e.handle(l, "move");
      },
      mouseleave: function(l) {
        return e.$emit("update:showIndicator", !1);
      }
    }
  });
}, ee = [];
const D = {};
var te = /* @__PURE__ */ X(
  j,
  J,
  ee,
  !1,
  ne,
  null,
  null,
  null
);
function ne(e) {
  for (let n in D)
    this[n] = D[n];
}
const ae = /* @__PURE__ */ function() {
  return te.exports;
}(), re = {
  scale: Number,
  ratio: Number,
  thick: Number,
  startNumX: Number,
  endNumX: Number,
  startNumY: Number,
  endNumY: Number,
  palette: Object,
  vertical: {
    type: Boolean,
    default: !0
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
}, oe = E({
  name: "RulerWrapper",
  components: {
    CanvasRuler: ae,
    RulerLine: W
  },
  props: re,
  setup(e) {
    const n = _(!1), t = _(0), l = w(() => e.vertical ? "v-container" : "h-container"), s = w(() => {
      const a = {
        width: `calc(100% - ${e.thick}px)`,
        height: `${e.thick + 1}px`,
        left: `${e.thick}px`
      }, r = {
        width: `${e.thick && e.thick + 1}px`,
        height: `calc(100% - ${e.thick}px)`,
        top: `${e.thick}px`
      };
      return e.vertical ? r : a;
    }), u = w(() => {
      var i;
      const a = (t.value - e.start) * e.scale;
      let r = "top", d = "borderLeft";
      return r = e.vertical ? "top" : "left", d = e.vertical ? "borderBottom" : "borderLeft", {
        [r]: a + "px",
        [d]: `1px solid ${(i = e.palette) == null ? void 0 : i.lineColor}`
      };
    }), c = (a) => {
      e.lines.push(a);
    }, h = (a, r) => {
      const d = a - e.start, i = (e.vertical ? e.height : e.width) / e.scale;
      d < 0 || d > i ? o(r) : e.lines[r] = a;
    }, o = (a) => {
      e.lines.splice(a, 1);
    };
    return {
      showIndicator: n,
      valueNum: t,
      rwClassName: l,
      rwStyle: s,
      indicatorStyle: u,
      handleNewLine: c,
      handleLineRelease: h,
      handleLineRemove: o
    };
  }
});
var le = function() {
  var e = this, n = e.$createElement, t = e._self._c || n;
  return t("div", {
    class: e.rwClassName,
    style: e.rwStyle
  }, [t("CanvasRuler", {
    attrs: {
      vertical: e.vertical,
      scale: e.scale,
      width: e.width,
      height: e.height,
      start: e.start,
      ratio: e.ratio,
      startNumX: e.startNumX,
      endNumX: e.endNumX,
      startNumY: e.startNumY,
      endNumY: e.endNumY,
      "select-start": e.selectStart,
      "select-length": e.selectLength,
      palette: e.palette
    },
    on: {
      "on-addLine": e.handleNewLine
    },
    model: {
      value: e.showIndicator,
      callback: function(l) {
        e.showIndicator = l;
      },
      expression: "showIndicator"
    }
  }), t("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: e.isShowReferLine,
      expression: "isShowReferLine"
    }],
    staticClass: "lines"
  }, e._l(e.lines, function(l, s) {
    return t("RulerLine", {
      key: l + s,
      attrs: {
        index: s,
        value: l >> 0,
        scale: e.scale,
        start: e.start,
        thick: e.thick,
        palette: e.palette,
        vertical: e.vertical,
        "is-show-refer-line": e.isShowReferLine
      },
      on: {
        "on-remove": e.handleLineRemove,
        "on-release": e.handleLineRelease
      }
    });
  }), 1), t("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: e.showIndicator,
      expression: "showIndicator"
    }],
    staticClass: "indicator",
    style: e.indicatorStyle
  }, [t("div", {
    staticClass: "value"
  }, [e._v(e._s(e.valueNum))])])], 1);
}, se = [];
const $ = {};
var ie = /* @__PURE__ */ X(
  oe,
  le,
  se,
  !1,
  ue,
  "f5c855b2",
  null,
  null
);
function ue(e) {
  for (let n in $)
    this[n] = $[n];
}
const ce = /* @__PURE__ */ function() {
  return ie.exports;
}(), de = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAopJREFUOE/FlE9IVEEcx7+/N9ouds1Mu0QUSFZYdIgoUqQoKPBQHsKozpXE7jbTO/U8xLJvn6usBHWQ6hBFXupSkQeVbh0KJEPp0sH+eLGTsKs77xcj78m0ax0E8cHjzZv5zef3/c33xxA24KENYGJzoEEQbNNaN4Zh2OQ4znwYhr9c1/39vwrXVDo0NNS0tLR0GYB5D64BmAMwzMyvlFKz1es10Hw+f4mZ7wHYBeA9gNdENFepVOaEEM3M3OI4Thczn41gt6WUgQ3+C+r7/h0AWQD3mXnYqPA8L9nQ0HCemduIaFpKOWoAhUJhT6VSuQXgOjP3K6W8GLwKzeVyp4jonR0QBEErM48w8zFLyayUsjX+z+VyHhHdZebTSqkxM78CHRgYOKS1/ghgVErZY214RkQ7ADyRUj72ff8qgCtmXUrZGcf5vv8CwEUhxOF0Ov1pBRpla5dSdseBhUJhpznH6tIsZb1KqacW+BGArUaUXX63UuplHJTNZjuEEONSyhozfd/n6mQ1RkXZL2itz7mu+80EDA4ONi8vL/8AcM2UbikyR2BU9cSmmTU70YqKIAj2hWFo2uenlHK/BRg3Y2aeNO5GyU8S0ZbFxcUuz/NKEXAGQKPjOCcymcyX1dIi8DSAiWQyeaavr68cbSgCuBknYubnQoj+TCYzUywWE6VS6S2ADsdx2gxw1X3L7SNENMbMnwE8qK+vf5NKpRaMaeVyeW8ikfiaSqW+R7BuZr5BRMe11p2u607U9Gk8kc/ntzPzQwCmExYATDLzVBiGE0KIowAOADDf3QA+aK2VDaxRajto3K+rq+tl5nYAzQBamHmeiOYBTGmtR6ph/1Rqg9c73pz7dD1qN0TpHyNQRCUDJXrAAAAAAElFTkSuQmCC", he = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAjtJREFUOE/NlD9oFEEUxn9v9ghC0hpRUogIAUmniGAT/5Q2FrETPSNRJILg7RwimI0ox85eQFCEBGIUO1PYpFM0jSConQoBEZGgGPsgl+w+2eM2bC57SopAFqYZ3v7m+977ZoQt+GQLmGxPaBiGgYiMWWvXBHZUGoZhH3BERPYC+4F+4Keq/urt7b1RLpf/ZEBVHa9Wq0HWyg3QKIoGVPU8cA7wgK/pUtXPQJ8xZk+pVBpuNBqXUoUiEvi+P56fzTpo6+SbwHNg1lo7WzTITGEKXFlZeeB53tVCpa3CK8AFa+1cBgvD8LKIXAQOJkkyICJDeYVBEJS6u7s/qeoLa+1o+l9TqXNuBLhmjDlbqVQ+5ICjInIfOBPH8W9jzGCR5YmJiRNxHM+papgqzqDvgSlr7VTernPuO3An3c9bBt74vv+yrdaKyLDv+/1Sq9UGPc97nY9EVuycU2AQOA7cAm4Dr4D5TvVxHB9rKo2iaEFVp621Ln96FEUngaOqGmSxabVqsh3a2h+x1h5qQjNrae/yE4+iaCwDJkky73neTuBZe129Xk+H+BS4l7ZqLVIZ2BhzuFKpvMsDVXXWGPMxFdAedOfcKeCRqj7MYrUhpz09PfXl5eXrectFWXXODQHpOq2qd/95o/JXr6ura3J1dXU6SZIfwKKIHAD2tVYMPBGRx77vN10UXtO85fTkmZmZHUtLSzUR2QXsBhaAL6r6DXhbrVYXi1yss59GqOgub/bN3Z7v6X/tb9Zmp/q/kN8s+lJb8oEAAAAASUVORK5CYII=", fe = {
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
    // default: window.devicePixelRatio || 1
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
    default: () => ({
      x: 0,
      y: 0,
      width: 0,
      height: 0
    })
  },
  lines: {
    type: Object,
    default: () => ({
      h: [],
      v: []
    })
  },
  isShowReferLine: {
    type: Boolean,
    default: !0
  },
  startNumX: {
    type: Number,
    default: -1 / 0
  },
  endNumX: {
    type: Number,
    default: 1 / 0
  },
  startNumY: {
    type: Number,
    default: -1 / 0
  },
  endNumY: {
    type: Number,
    default: 1 / 0
  }
}, me = E({
  name: "SketchRule",
  components: {
    RulerWrapper: ce
  },
  props: fe,
  emits: ["onCornerClick"],
  setup(e, { emit: n }) {
    let t = _(!0);
    t.value = e.isShowReferLine;
    const l = w(() => {
      function c(o, a) {
        return Object.keys(o).forEach((r) => {
          r && o.hasOwnProperty(r) && (typeof a[r] == "object" ? o[r] = c(o[r], a[r]) : a.hasOwnProperty(r) && (o[r] = a[r]));
        }), o;
      }
      return c(
        {
          bgColor: "rgba(225,225,225, 0)",
          // ruler bg color
          longfgColor: "#BABBBC",
          // ruler longer mark color
          shortfgColor: "#C8CDD0",
          // ruler shorter mark color
          fontColor: "#7D8694",
          // ruler font color
          shadowColor: "#E8E8E8",
          // ruler shadow color
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
        e.palette || {}
      );
    }), s = w(() => ({
      backgroundImage: t.value ? `url(${e.eyeIcon || de})` : `url(${e.closeEyeIcon || he})`,
      width: e.thick + "px",
      height: e.thick + "px",
      borderRight: `1px solid ${l.value.borderColor}`,
      borderBottom: `1px solid ${l.value.borderColor}`
    })), u = (c) => {
      t.value = !t.value, n("onCornerClick", t.value);
    };
    return B([() => e.isShowReferLine], () => {
      t.value = e.isShowReferLine;
    }), {
      showReferLine: t,
      paletteCpu: l,
      cornerStyle: s,
      onCornerClick: u
    };
  }
});
var ve = function() {
  var e = this, n = e.$createElement, t = e._self._c || n;
  return t("div", {
    staticClass: "style-ruler mb-ruler",
    attrs: {
      id: "mb-ruler"
    }
  }, [t("RulerWrapper", {
    attrs: {
      vertical: !1,
      width: e.width,
      height: e.thick,
      "is-show-refer-line": e.showReferLine,
      thick: e.thick,
      ratio: e.ratio,
      start: e.startX,
      lines: e.lines.h,
      "select-start": e.shadow.x,
      "select-length": e.shadow.width,
      scale: e.scale,
      palette: e.paletteCpu,
      startNumX: e.startNumX,
      endNumX: e.endNumX
    }
  }), t("RulerWrapper", {
    attrs: {
      vertical: !0,
      width: e.thick,
      height: e.height,
      "is-show-refer-line": e.showReferLine,
      thick: e.thick,
      ratio: e.ratio,
      start: e.startY,
      lines: e.lines.v,
      "select-start": e.shadow.y,
      "select-length": e.shadow.height,
      scale: e.scale,
      palette: e.paletteCpu,
      startNumY: e.startNumY,
      endNumY: e.endNumY
    }
  }), t("a", {
    staticClass: "corner",
    style: e.cornerStyle,
    on: {
      click: e.onCornerClick
    }
  })], 1);
}, Ne = [];
const T = {};
var we = /* @__PURE__ */ X(
  me,
  ve,
  Ne,
  !1,
  Ce,
  null,
  null,
  null
);
function Ce(e) {
  for (let n in T)
    this[n] = T[n];
}
const Ae = /* @__PURE__ */ function() {
  return we.exports;
}();
export {
  Ae as SketchRule,
  Ae as default
};
