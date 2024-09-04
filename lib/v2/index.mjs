import { defineComponent as X, ref as y, onMounted as T, computed as w, reactive as $, watch as E } from "vue-demi";
/*!
* vue2 v1.3.15
* 2024年9月Wed Sep 04 2024 11:21:46 GMT+0800 (中国标准时间)
* 制作
*/
const M = X({
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
    const t = y(0), o = y(!0);
    T(() => {
      t.value = e.value;
    });
    const s = (a) => {
      o.value = a >= 0;
    }, i = w(() => {
      const a = (t.value - e.start) * e.scale;
      s(a);
      const c = a + "px";
      return e.vertical ? { top: c } : { left: c };
    }), u = w(() => {
      var m;
      const a = `1px solid ${(m = e.palette) == null ? void 0 : m.lineColor}`, c = e.vertical ? { borderTop: a } : { borderLeft: a };
      return {
        cursor: e.isShowReferLine ? e.vertical ? "ns-resize" : "ew-resize" : "none",
        ...c
      };
    }), d = w(() => e.vertical ? { left: e.thick + "px" } : { top: e.thick + "px" });
    return {
      startValue: t,
      showLine: o,
      offset: i,
      borderCursor: u,
      actionStyle: d,
      handleDown: (a) => {
        const c = e.vertical ? a.clientY : a.clientX, h = t.value;
        n("onMouseDown");
        const m = (b) => {
          const C = e.vertical ? b.clientY : b.clientX, S = Math.round(h + (C - c) / e.scale);
          t.value = S;
        }, v = () => {
          n("onRelease", t.value, e.index), document.removeEventListener("mousemove", m), document.removeEventListener("mouseup", v);
        };
        document.addEventListener("mousemove", m), document.addEventListener("mouseup", v);
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
function B(e, n, t, o, s, i, u, d) {
  var l = typeof e == "function" ? e.options : e;
  n && (l.render = n, l.staticRenderFns = t, l._compiled = !0), i && (l._scopeId = "data-v-" + i);
  var r;
  if (s && (r = s), r)
    if (l.functional) {
      l._injectStyles = r;
      var a = l.render;
      l.render = function(m, v) {
        return r.call(v), a(m, v);
      };
    } else {
      var c = l.beforeCreate;
      l.beforeCreate = c ? [].concat(c, r) : [r];
    }
  return {
    exports: e,
    options: l
  };
}
const O = {};
var G = /* @__PURE__ */ B(
  M,
  z,
  P,
  !1,
  H,
  "37b219fd"
);
function H(e) {
  for (let n in O)
    this[n] = O[n];
}
const W = /* @__PURE__ */ function() {
  return G.exports;
}(), q = (e) => e <= 0.25 ? 40 : e <= 0.5 ? 20 : e <= 1 ? 10 : e <= 2 ? 5 : e <= 4 ? 2 : 1, x = 0.83, j = (e, n, t, o, s, i) => {
  const { scale: u, width: d, height: l, ratio: r, palette: a } = s, { bgColor: c, fontColor: h, shadowColor: m, longfgColor: v, shortfgColor: b } = a, C = i ? s.startNumX : s.startNumY, S = i ? s.endNumX : s.endNumY;
  if (e.scale(r, r), e.clearRect(0, 0, d, l), e.fillStyle = c, e.fillRect(0, 0, d, l), o) {
    const N = (t - n) * u, R = o * u;
    e.fillStyle = m, i ? e.fillRect(N, 0, R, l * 3 / 8) : e.fillRect(0, N, d * 3 / 8, R);
  }
  const A = q(u), L = A * u, g = A * 10, k = g * u, Y = Math.floor(n / A) * A, I = Math.floor(n / g) * g, Q = (Y - n) / A * L, K = (I - n) / g * k, U = n + Math.ceil((i ? d : l) / u);
  e.beginPath(), e.fillStyle = h, e.strokeStyle = v;
  for (let N = I, R = 0; N < U; N += g, R++) {
    if (N >= C && N <= S) {
      const f = K + R * k + 0.5;
      i ? e.moveTo(f, 0) : e.moveTo(0, f), e.save(), i ? e.translate(f, l * 0.4) : e.translate(d * 0.4, f), i || e.rotate(-Math.PI / 2), e.scale(x / r, x / r), e.fillText(N.toString(), 4 * r, 7 * r), e.restore(), i ? e.lineTo(f, l * 9 / 16) : e.lineTo(d * 9 / 16, f);
    }
    e.stroke(), e.closePath(), e.beginPath(), e.strokeStyle = b;
    for (let f = Y, p = 0; f < U; f += A, p++)
      if (f >= C && f <= S) {
        const _ = Q + p * L + 0.5;
        i ? e.moveTo(_, 0) : e.moveTo(0, _), f % g !== 0 && (i ? e.lineTo(_, l * 1 / 4) : e.lineTo(d * 1 / 4, _));
      }
    e.stroke(), e.closePath(), e.setTransform(1, 0, 0, 1, 0, 0);
  }
}, Z = X({
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
    const t = $({
      canvasContext: null
    });
    let o = 1;
    const s = y(null);
    T(() => {
      o = e.ratio || window.devicePixelRatio || 1, i(), u(o), d(o);
    });
    const i = () => {
      t.canvasContext = s.value && s.value.getContext("2d");
    }, u = (r) => {
      if (s.value) {
        s.value.width = e.width * r, s.value.height = e.height * r;
        const a = t.canvasContext;
        a && (a.font = `${12 * r}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`, a.lineWidth = 1, a.textBaseline = "middle");
      }
    }, d = (r) => {
      const a = {
        scale: e.scale,
        width: e.width,
        height: e.height,
        palette: e.palette,
        startNumX: e.startNumX,
        endNumX: e.endNumX,
        startNumY: e.startNumY,
        endNumY: e.endNumY,
        ratio: r
      };
      t.canvasContext && j(
        t.canvasContext,
        e.start,
        e.selectStart,
        e.selectLength,
        a,
        !e.vertical
      );
    };
    return E(
      () => e.start,
      () => d(o)
    ), E([() => e.width, () => e.height], () => {
      u(o), d(o);
    }), {
      handle: (r, a) => {
        const c = (v, b, C) => Math.round(b + v / C), h = e.vertical ? r.offsetY : r.offsetX, m = c(h, e.start, e.scale);
        switch (a) {
          case "click":
            n("onAddLine", m);
            break;
          case "enter":
            n("update:valueNum", m), n("update:showIndicator", !0);
            break;
          default:
            n("update:valueNum", m);
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
      click: function(o) {
        return e.handle(o, "click");
      },
      mouseenter: function(o) {
        return e.handle(o, "enter");
      },
      mousemove: function(o) {
        return e.handle(o, "move");
      },
      mouseleave: function(o) {
        return e.$emit("update:showIndicator", !1);
      }
    }
  });
}, ee = [];
const V = {};
var te = /* @__PURE__ */ B(
  Z,
  J,
  ee,
  !1,
  ne,
  null
);
function ne(e) {
  for (let n in V)
    this[n] = V[n];
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
}, oe = X({
  name: "RulerWrapper",
  components: {
    CanvasRuler: ae,
    RulerLine: W
  },
  props: re,
  setup(e) {
    const n = y(!1), t = y(0), o = w(() => e.vertical ? "v-container" : "h-container"), s = w(() => {
      const r = {
        width: `calc(100% - ${e.thick}px)`,
        height: `${e.thick + 1}px`,
        left: `${e.thick}px`
      }, a = {
        width: `${e.thick && e.thick + 1}px`,
        height: `calc(100% - ${e.thick}px)`,
        top: `${e.thick}px`
      };
      return e.vertical ? a : r;
    }), i = w(() => {
      var h;
      const r = (t.value - e.start) * e.scale;
      let a = "top", c = "borderLeft";
      return a = e.vertical ? "top" : "left", c = e.vertical ? "borderBottom" : "borderLeft", {
        [a]: r + "px",
        [c]: `1px solid ${(h = e.palette) == null ? void 0 : h.lineColor}`
      };
    }), u = (r) => {
      e.lines.push(r);
    }, d = (r, a) => {
      const c = r - e.start, h = (e.vertical ? e.height : e.width) / e.scale;
      c < 0 || c > h ? l(a) : e.lines[a] = r;
    }, l = (r) => {
      e.lines.splice(r, 1);
    };
    return {
      showIndicator: n,
      valueNum: t,
      rwClassName: o,
      rwStyle: s,
      indicatorStyle: i,
      handleNewLine: u,
      handleLineRelease: d,
      handleLineRemove: l
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
      callback: function(o) {
        e.showIndicator = o;
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
  }, e._l(e.lines, function(o, s) {
    return t("RulerLine", {
      key: o + s,
      attrs: {
        index: s,
        value: o >> 0,
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
const D = {};
var ie = /* @__PURE__ */ B(
  oe,
  le,
  se,
  !1,
  ce,
  "f5c855b2"
);
function ce(e) {
  for (let n in D)
    this[n] = D[n];
}
const ue = /* @__PURE__ */ function() {
  return ie.exports;
}(), de = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAopJREFUOE/FlE9IVEEcx7+/N9ouds1Mu0QUSFZYdIgoUqQoKPBQHsKozpXE7jbTO/U8xLJvn6usBHWQ6hBFXupSkQeVbh0KJEPp0sH+eLGTsKs77xcj78m0ax0E8cHjzZv5zef3/c33xxA24KENYGJzoEEQbNNaN4Zh2OQ4znwYhr9c1/39vwrXVDo0NNS0tLR0GYB5D64BmAMwzMyvlFKz1es10Hw+f4mZ7wHYBeA9gNdENFepVOaEEM3M3OI4Thczn41gt6WUgQ3+C+r7/h0AWQD3mXnYqPA8L9nQ0HCemduIaFpKOWoAhUJhT6VSuQXgOjP3K6W8GLwKzeVyp4jonR0QBEErM48w8zFLyayUsjX+z+VyHhHdZebTSqkxM78CHRgYOKS1/ghgVErZY214RkQ7ADyRUj72ff8qgCtmXUrZGcf5vv8CwEUhxOF0Ov1pBRpla5dSdseBhUJhpznH6tIsZb1KqacW+BGArUaUXX63UuplHJTNZjuEEONSyhozfd/n6mQ1RkXZL2itz7mu+80EDA4ONi8vL/8AcM2UbikyR2BU9cSmmTU70YqKIAj2hWFo2uenlHK/BRg3Y2aeNO5GyU8S0ZbFxcUuz/NKEXAGQKPjOCcymcyX1dIi8DSAiWQyeaavr68cbSgCuBknYubnQoj+TCYzUywWE6VS6S2ADsdx2gxw1X3L7SNENMbMnwE8qK+vf5NKpRaMaeVyeW8ikfiaSqW+R7BuZr5BRMe11p2u607U9Gk8kc/ntzPzQwCmExYATDLzVBiGE0KIowAOADDf3QA+aK2VDaxRajto3K+rq+tl5nYAzQBamHmeiOYBTGmtR6ph/1Rqg9c73pz7dD1qN0TpHyNQRCUDJXrAAAAAAElFTkSuQmCC", he = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAjtJREFUOE/NlD9oFEEUxn9v9ghC0hpRUogIAUmniGAT/5Q2FrETPSNRJILg7RwimI0ox85eQFCEBGIUO1PYpFM0jSConQoBEZGgGPsgl+w+2eM2bC57SopAFqYZ3v7m+977ZoQt+GQLmGxPaBiGgYiMWWvXBHZUGoZhH3BERPYC+4F+4Keq/urt7b1RLpf/ZEBVHa9Wq0HWyg3QKIoGVPU8cA7wgK/pUtXPQJ8xZk+pVBpuNBqXUoUiEvi+P56fzTpo6+SbwHNg1lo7WzTITGEKXFlZeeB53tVCpa3CK8AFa+1cBgvD8LKIXAQOJkkyICJDeYVBEJS6u7s/qeoLa+1o+l9TqXNuBLhmjDlbqVQ+5ICjInIfOBPH8W9jzGCR5YmJiRNxHM+papgqzqDvgSlr7VTernPuO3An3c9bBt74vv+yrdaKyLDv+/1Sq9UGPc97nY9EVuycU2AQOA7cAm4Dr4D5TvVxHB9rKo2iaEFVp621Ln96FEUngaOqGmSxabVqsh3a2h+x1h5qQjNrae/yE4+iaCwDJkky73neTuBZe129Xk+H+BS4l7ZqLVIZ2BhzuFKpvMsDVXXWGPMxFdAedOfcKeCRqj7MYrUhpz09PfXl5eXrectFWXXODQHpOq2qd/95o/JXr6ura3J1dXU6SZIfwKKIHAD2tVYMPBGRx77vN10UXtO85fTkmZmZHUtLSzUR2QXsBhaAL6r6DXhbrVYXi1yss59GqOgub/bN3Z7v6X/tb9Zmp/q/kN8s+lJb8oEAAAAASUVORK5CYII=", me = {
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
}, fe = X({
  name: "SketchRule",
  components: {
    RulerWrapper: ue
  },
  props: me,
  emits: ["onCornerClick"],
  setup(e, { emit: n }) {
    let t = y(!0);
    t.value = e.isShowReferLine;
    const o = w(() => {
      function u(l, r) {
        return Object.keys(l).forEach((a) => {
          a && l.hasOwnProperty(a) && (typeof r[a] == "object" ? l[a] = u(l[a], r[a]) : r.hasOwnProperty(a) && (l[a] = r[a]));
        }), l;
      }
      return u(
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
      borderRight: `1px solid ${o.value.borderColor}`,
      borderBottom: `1px solid ${o.value.borderColor}`
    })), i = (u) => {
      t.value = !t.value, n("onCornerClick", t.value);
    };
    return E([() => e.isShowReferLine], () => {
      t.value = e.isShowReferLine;
    }), {
      showReferLine: t,
      paletteCpu: o,
      cornerStyle: s,
      onCornerClick: i
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
const F = {};
var we = /* @__PURE__ */ B(
  fe,
  ve,
  Ne,
  !1,
  be,
  null
);
function be(e) {
  for (let n in F)
    this[n] = F[n];
}
const Ae = /* @__PURE__ */ function() {
  return we.exports;
}();
export {
  Ae as SketchRule,
  Ae as default
};
