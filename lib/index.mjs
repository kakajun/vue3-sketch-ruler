import { defineComponent as ee, ref as R, computed as L, onMounted as ge, withDirectives as pe, openBlock as T, createElementBlock as K, normalizeStyle as Q, createElementVNode as D, toDisplayString as Xe, createCommentVNode as Me, vShow as he, reactive as xe, watch as me, normalizeClass as Le, createVNode as fe, Fragment as ze, renderList as Ie, createBlock as Pe, renderSlot as be, withModifiers as Ue } from "vue";
/*!vue3-sketch-ruler v2.0.12024年7月Tue Jul 09 2024 23:07:11 GMT+0800 (中国标准时间)制作*/
const $e = {
  key: 0,
  class: "value"
}, Ve = /* @__PURE__ */ ee({
  __name: "ruler-line",
  props: {
    scale: {},
    thick: {},
    palette: {},
    index: {},
    start: {},
    vertical: { type: Boolean },
    value: {},
    isShowReferLine: { type: Boolean }
  },
  emits: ["onMouseDown", "onRelease", "onRemove"],
  setup(e, { emit: n }) {
    const t = R(0), o = e, p = n, h = R(o.value), m = L(() => h.value >= o.start), g = L(() => {
      const b = (h.value - o.start) * o.scale;
      return o.vertical ? { top: `${b}px` } : { left: `${b}px` };
    }), u = L(() => {
      var X;
      const b = ((X = o.palette) == null ? void 0 : X.lineColor) ?? "black";
      return {
        cursor: o.isShowReferLine ? o.vertical ? "ns-resize" : "ew-resize" : "default",
        ...o.vertical ? { borderTop: `1px solid ${b}` } : { borderLeft: `1px solid ${b}` }
      };
    }), A = L(() => ({
      [o.vertical ? "left" : "top"]: `${t.value}px`
    }));
    ge(() => {
      h.value = o.value ?? 0;
    });
    function C(b) {
      const X = o.vertical ? b.clientY : b.clientX, z = h.value, k = (O) => {
        const U = ((o.vertical ? O.clientY : O.clientX) - X) / o.scale;
        h.value = Math.round(z + U), p("onMouseDown");
      };
      document.addEventListener("mousemove", k), document.addEventListener(
        "mouseup",
        () => {
          m.value || r(), document.removeEventListener("mousemove", k), p("onRelease", h.value, o.index);
        },
        { once: !0 }
      );
    }
    function r() {
      console.log("删除", o.index), p("onRemove", o.index);
    }
    const c = R(!1), v = (b) => {
      t.value = o.vertical ? b.offsetX : b.offsetY;
    }, E = L(() => `${o.vertical ? "Y" : "X"}：${h.value}`);
    return (b, X) => pe((T(), K("div", {
      class: "line",
      style: Q({ ...g.value, ...u.value }),
      onMouseenter: X[0] || (X[0] = (z) => c.value = !0),
      onMousemove: v,
      onMouseleave: X[1] || (X[1] = (z) => c.value = !1),
      onMousedown: C
    }, [
      D("div", {
        class: "action",
        style: Q(A.value)
      }, [
        c.value ? (T(), K("span", $e, Xe(E.value), 1)) : Me("", !0)
      ], 4)
    ], 36)), [
      [he, m.value]
    ]);
  }
}), Be = (e, n) => {
  const t = e.__vccOpts || e;
  for (const [o, p] of n)
    t[o] = p;
  return t;
}, Te = /* @__PURE__ */ Be(Ve, [["__scopeId", "data-v-aebb098c"]]), De = (e) => e <= 0.25 ? 40 : e <= 0.5 ? 20 : e <= 1 ? 10 : e <= 2 ? 5 : e <= 4 ? 2 : 1, Ne = 0.83, Fe = (e, n, t, o, p, h) => {
  const { scale: m, width: g, height: u, ratio: A, palette: C } = p, { bgColor: r, fontColor: c, shadowColor: v, longfgColor: E } = C, b = h ? p.startNumX : p.startNumY, X = h ? p.endNumX : p.endNumY;
  if (e.scale(A, A), e.clearRect(0, 0, g, u), e.fillStyle = r, e.fillRect(0, 0, g, u), o) {
    const l = (t - n) * m, S = o * m;
    e.fillStyle = v, h ? e.fillRect(l, 0, S, u * 3 / 8) : e.fillRect(0, l, g * 3 / 8, S);
  }
  const k = De(m) * 10, O = k * m, P = -n / k * O, U = n + Math.ceil((h ? g : u) / m);
  e.beginPath(), e.fillStyle = c, e.strokeStyle = E;
  for (let l = 0, S = 0; l < U; l += k, S++) {
    if (l >= b && l <= X) {
      debugger;
      const w = P + S * O;
      h ? e.moveTo(w, 0) : e.moveTo(0, w), e.save(), h ? e.translate(w, u * 0.4) : e.translate(g * 0.4, w), h || e.rotate(-Math.PI / 2), e.scale(Ne / A, Ne / A), e.fillText(l.toString(), 4 * A, 7 * A), e.restore(), h ? e.lineTo(w, u * 9 / 16) : e.lineTo(g * 9 / 16, w), console.log(w, "xBBBBBBBB");
    }
    e.stroke(), e.closePath(), e.setTransform(1, 0, 0, 1, 0, 0);
  }
}, Ke = /* @__PURE__ */ ee({
  __name: "index",
  props: {
    showIndicator: { type: Boolean },
    valueNum: {},
    scale: {},
    ratio: {},
    palette: {},
    vertical: {},
    start: {},
    width: {},
    height: {},
    selectStart: {},
    selectLength: {},
    startNumX: {},
    endNumX: {},
    startNumY: {},
    endNumY: {}
  },
  emits: ["onAddLine", "update:showIndicator", "update:valueNum"],
  setup(e, { emit: n }) {
    const t = e, o = n, p = xe({
      canvasContext: null
    });
    let h = 1;
    const m = R(null);
    ge(() => {
      h = t.ratio || window.devicePixelRatio || 1, g(), u(h);
    });
    const g = () => {
      p.canvasContext = m.value && m.value.getContext("2d");
    }, u = (r) => {
      if (m.value) {
        m.value.width = t.width * r, m.value.height = t.height * r;
        const c = p.canvasContext;
        c && (c.font = `${12 * r}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`, c.lineWidth = 1, c.textBaseline = "middle");
      }
    }, A = (r) => {
      console.log("drawRuler", t.scale);
      const c = {
        scale: t.scale,
        width: t.width,
        height: t.height,
        palette: t.palette,
        startNumX: t.startNumX,
        endNumX: t.endNumX,
        startNumY: t.startNumY,
        endNumY: t.endNumY,
        ratio: r
      };
      p.canvasContext && Fe(
        p.canvasContext,
        t.start,
        t.selectStart,
        t.selectLength,
        c,
        !t.vertical
      );
    };
    me(
      () => t.start,
      () => {
        console.log("start", t.start), A(h);
      }
    ), me([() => t.width, () => t.height], () => {
      u(h), A(h);
    });
    const C = (r, c) => {
      const v = (X, z, k) => Math.round(z + X / k), E = t.vertical ? r.offsetY : r.offsetX, b = v(E, t.start, t.scale);
      switch (c) {
        case "click":
          o("onAddLine", b);
          break;
        case "enter":
          o("update:valueNum", b), o("update:showIndicator", !0);
          break;
        default:
          o("update:valueNum", b);
          break;
      }
    };
    return (r, c) => (T(), K("canvas", {
      ref_key: "canvas",
      ref: m,
      class: "ruler",
      onClick: c[0] || (c[0] = (v) => C(v, "click")),
      onMouseenter: c[1] || (c[1] = (v) => C(v, "enter")),
      onMousemove: c[2] || (c[2] = (v) => C(v, "move")),
      onMouseleave: c[3] || (c[3] = (v) => r.$emit("update:showIndicator", !1))
    }, null, 544));
  }
}), Qe = {
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
}, Ge = { class: "lines" }, qe = { class: "value" }, We = /* @__PURE__ */ ee({
  __name: "ruler-wrapper",
  props: Qe,
  emits: ["update:lines", "on-remove-line"],
  setup(e, { emit: n }) {
    const t = e, o = R(!1), p = R(0), h = L(() => t.vertical ? "v-container" : "h-container"), m = L(() => {
      const r = {
        width: `calc(100% - ${t.thick}px)`,
        height: `${t.thick + 1}px`,
        left: `${t.thick}px`
      }, c = {
        width: `${t.thick && t.thick + 1}px`,
        height: `calc(100% - ${t.thick}px)`,
        top: `${t.thick}px`
      };
      return t.vertical ? c : r;
    }), g = L(() => {
      var b;
      const r = (p.value - t.start) * t.scale;
      let c = t.vertical ? "top" : "left", v = t.vertical ? "left" : "top", E = t.vertical ? "borderBottom" : "borderLeft";
      return {
        [c]: r + "px",
        [v]: t.thick + "px",
        [E]: `1px solid ${(b = t.palette) == null ? void 0 : b.lineColor}`
      };
    }), u = (r) => {
      t.lines.push(r);
    }, A = (r, c) => {
      const v = r - t.start, E = (t.vertical ? t.height : t.width) / t.scale;
      v < 0 || v > E ? C(c) : t.lines[c] = r;
    }, C = (r) => {
      t.lines.splice(r, 1);
    };
    return (r, c) => (T(), K("div", {
      class: Le(h.value),
      style: Q(m.value)
    }, [
      fe(Ke, {
        vertical: r.vertical,
        scale: r.scale,
        width: r.width,
        height: r.height,
        start: r.start,
        ratio: r.ratio,
        startNumX: r.startNumX,
        endNumX: r.endNumX,
        startNumY: r.startNumY,
        endNumY: r.endNumY,
        "select-start": r.selectStart,
        "select-length": r.selectLength,
        palette: r.palette,
        valueNum: p.value,
        "onUpdate:valueNum": c[0] || (c[0] = (v) => p.value = v),
        showIndicator: o.value,
        "onUpdate:showIndicator": c[1] || (c[1] = (v) => o.value = v),
        onOnAddLine: u
      }, null, 8, ["vertical", "scale", "width", "height", "start", "ratio", "startNumX", "endNumX", "startNumY", "endNumY", "select-start", "select-length", "palette", "valueNum", "showIndicator"]),
      pe(D("div", Ge, [
        (T(!0), K(ze, null, Ie(r.lines, (v, E) => (T(), Pe(Te, {
          key: v + E,
          index: E,
          value: v >> 0,
          scale: r.scale,
          start: r.start,
          thick: r.thick,
          palette: r.palette,
          vertical: r.vertical,
          "is-show-refer-line": r.isShowReferLine,
          onOnRemove: C,
          onOnRelease: A
        }, null, 8, ["index", "value", "scale", "start", "thick", "palette", "vertical", "is-show-refer-line"]))), 128))
      ], 512), [
        [he, r.isShowReferLine]
      ]),
      pe(D("div", {
        class: "indicator",
        style: Q(g.value)
      }, [
        D("div", qe, Xe(p.value), 1)
      ], 4), [
        [he, o.value]
      ])
    ], 6));
  }
}), Ae = /* @__PURE__ */ Be(We, [["__scopeId", "data-v-67235dc7"]]), Ze = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAopJREFUOE/FlE9IVEEcx7+/N9ouds1Mu0QUSFZYdIgoUqQoKPBQHsKozpXE7jbTO/U8xLJvn6usBHWQ6hBFXupSkQeVbh0KJEPp0sH+eLGTsKs77xcj78m0ax0E8cHjzZv5zef3/c33xxA24KENYGJzoEEQbNNaN4Zh2OQ4znwYhr9c1/39vwrXVDo0NNS0tLR0GYB5D64BmAMwzMyvlFKz1es10Hw+f4mZ7wHYBeA9gNdENFepVOaEEM3M3OI4Thczn41gt6WUgQ3+C+r7/h0AWQD3mXnYqPA8L9nQ0HCemduIaFpKOWoAhUJhT6VSuQXgOjP3K6W8GLwKzeVyp4jonR0QBEErM48w8zFLyayUsjX+z+VyHhHdZebTSqkxM78CHRgYOKS1/ghgVErZY214RkQ7ADyRUj72ff8qgCtmXUrZGcf5vv8CwEUhxOF0Ov1pBRpla5dSdseBhUJhpznH6tIsZb1KqacW+BGArUaUXX63UuplHJTNZjuEEONSyhozfd/n6mQ1RkXZL2itz7mu+80EDA4ONi8vL/8AcM2UbikyR2BU9cSmmTU70YqKIAj2hWFo2uenlHK/BRg3Y2aeNO5GyU8S0ZbFxcUuz/NKEXAGQKPjOCcymcyX1dIi8DSAiWQyeaavr68cbSgCuBknYubnQoj+TCYzUywWE6VS6S2ADsdx2gxw1X3L7SNENMbMnwE8qK+vf5NKpRaMaeVyeW8ikfiaSqW+R7BuZr5BRMe11p2u607U9Gk8kc/ntzPzQwCmExYATDLzVBiGE0KIowAOADDf3QA+aK2VDaxRajto3K+rq+tl5nYAzQBamHmeiOYBTGmtR6ph/1Rqg9c73pz7dD1qN0TpHyNQRCUDJXrAAAAAAElFTkSuQmCC", He = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAjtJREFUOE/NlD9oFEEUxn9v9ghC0hpRUogIAUmniGAT/5Q2FrETPSNRJILg7RwimI0ox85eQFCEBGIUO1PYpFM0jSConQoBEZGgGPsgl+w+2eM2bC57SopAFqYZ3v7m+977ZoQt+GQLmGxPaBiGgYiMWWvXBHZUGoZhH3BERPYC+4F+4Keq/urt7b1RLpf/ZEBVHa9Wq0HWyg3QKIoGVPU8cA7wgK/pUtXPQJ8xZk+pVBpuNBqXUoUiEvi+P56fzTpo6+SbwHNg1lo7WzTITGEKXFlZeeB53tVCpa3CK8AFa+1cBgvD8LKIXAQOJkkyICJDeYVBEJS6u7s/qeoLa+1o+l9TqXNuBLhmjDlbqVQ+5ICjInIfOBPH8W9jzGCR5YmJiRNxHM+papgqzqDvgSlr7VTernPuO3An3c9bBt74vv+yrdaKyLDv+/1Sq9UGPc97nY9EVuycU2AQOA7cAm4Dr4D5TvVxHB9rKo2iaEFVp621Ln96FEUngaOqGmSxabVqsh3a2h+x1h5qQjNrae/yE4+iaCwDJkky73neTuBZe129Xk+H+BS4l7ZqLVIZ2BhzuFKpvMsDVXXWGPMxFdAedOfcKeCRqj7MYrUhpz09PfXl5eXrectFWXXODQHpOq2qd/95o/JXr6ura3J1dXU6SZIfwKKIHAD2tVYMPBGRx77vN10UXtO85fTkmZmZHUtLSzUR2QXsBhaAL6r6DXhbrVYXi1yss59GqOgub/bN3Z7v6X/tb9Zmp/q/kN8s+lJb8oEAAAAASUVORK5CYII=", je = {
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
  },
  panzoomOption: Object
};
/*!simple-panzoom v1.0.12024年7月Sat Jul 06 2024 11:41:16 GMT+0800 (中国标准时间)制作*/
typeof window < "u" && (window.NodeList && !NodeList.prototype.forEach && (NodeList.prototype.forEach = Array.prototype.forEach), typeof window.CustomEvent != "function" && (window.CustomEvent = function(e, n) {
  n = n || { bubbles: !1, cancelable: !1, detail: null };
  var t = document.createEvent("CustomEvent");
  return t.initCustomEvent(e, n.bubbles, n.cancelable, n.detail), t;
}));
function Ye(e, n) {
  let t = e.length;
  for (; t--; ) if (e[t].pointerId === n.pointerId) return t;
  return -1;
}
function ve(e, n) {
  let t;
  if (n.touches) {
    t = 0;
    for (const o of n.touches) o.pointerId = t++, ve(e, o);
    return;
  }
  t = Ye(e, n), t > -1 && e.splice(t, 1), e.push(n);
}
function Je(e, n) {
  if (n.touches) {
    for (; e.length; ) e.pop();
    return;
  }
  const t = Ye(e, n);
  t > -1 && e.splice(t, 1);
}
function Se(e) {
  e = e.slice(0);
  let n = e.pop(), t;
  for (; t = e.pop(); )
    n = {
      clientX: (t.clientX - n.clientX) / 2 + n.clientX,
      clientY: (t.clientY - n.clientY) / 2 + n.clientY
    };
  return n;
}
function ce(e) {
  if (e.length < 2) return 0;
  const n = e[0], t = e[1];
  return Math.sqrt(
    Math.pow(Math.abs(t.clientX - n.clientX), 2) + Math.pow(Math.abs(t.clientY - n.clientY), 2)
  );
}
let W = {
  down: "mousedown",
  move: "mousemove",
  up: "mouseup mouseleave"
};
typeof window < "u" && (typeof window.PointerEvent == "function" ? W = {
  down: "pointerdown",
  move: "pointermove",
  up: "pointerup pointerleave pointercancel"
} : typeof window.TouchEvent == "function" && (W = {
  down: "touchstart",
  move: "touchmove",
  up: "touchend touchcancel"
}));
function ue(e, n, t, o) {
  W[e].split(" ").forEach((p) => {
    n.addEventListener(p, t, o);
  });
}
function de(e, n, t) {
  W[e].split(" ").forEach((o) => {
    n.removeEventListener(o, t);
  });
}
const _e = typeof document < "u" && !!document.documentMode;
let Ce;
function et() {
  return Ce || (Ce = document.createElement("div").style);
}
const Ee = ["webkit", "moz", "ms"], H = {};
function we(e) {
  if (H[e]) return H[e];
  const n = et();
  if (e in n) return H[e] = e;
  const t = e[0].toUpperCase() + e.slice(1);
  let o = Ee.length;
  for (; o--; ) {
    const p = `${Ee[o]}${t}`;
    if (p in n) return H[e] = p;
  }
}
function j(e, n) {
  return parseFloat(n[we(e)]) || 0;
}
function J(e, n, t = window.getComputedStyle(e)) {
  const o = n === "border" ? "Width" : "";
  return {
    left: j(`${n}Left${o}`, t),
    right: j(`${n}Right${o}`, t),
    top: j(`${n}Top${o}`, t),
    bottom: j(`${n}Bottom${o}`, t)
  };
}
function F(e, n, t) {
  e.style[we(n)] = t;
}
function tt(e, n) {
  const t = we("transform");
  F(e, "transition", `${t} ${n.duration}ms ${n.easing}`);
}
function nt(e, { x: n, y: t, scale: o, isSVG: p }, h) {
  if (F(e, "transform", `scale(${o}) translate(${n}px, ${t}px)`), p && _e) {
    const m = window.getComputedStyle(e).getPropertyValue("transform");
    e.setAttribute("transform", m);
  }
}
function _(e) {
  const n = e.parentNode, t = window.getComputedStyle(e), o = window.getComputedStyle(n), p = e.getBoundingClientRect(), h = n.getBoundingClientRect();
  return {
    elem: {
      style: t,
      width: p.width,
      height: p.height,
      top: p.top,
      bottom: p.bottom,
      left: p.left,
      right: p.right,
      margin: J(e, "margin", t),
      border: J(e, "border", t)
    },
    parent: {
      style: o,
      width: h.width,
      height: h.height,
      top: h.top,
      bottom: h.bottom,
      left: h.left,
      right: h.right,
      padding: J(n, "padding", o),
      border: J(n, "border", o)
    }
  };
}
function ot(e) {
  let n = e;
  for (; n && n.parentNode; ) {
    if (n.parentNode === document) return !0;
    n = n.parentNode instanceof ShadowRoot ? n.parentNode.host : n.parentNode;
  }
  return !1;
}
function at(e) {
  return (e.getAttribute("class") || "").trim();
}
function rt(e, n) {
  return e.nodeType === 1 && ` ${at(e)} `.indexOf(` ${n} `) > -1;
}
function it(e, n) {
  for (let t = e; t != null; t = t.parentNode)
    if (rt(t, n.excludeClass) || n.exclude.indexOf(t) > -1) return !0;
  return !1;
}
const lt = /^http:[\w\.\/]+svg$/;
function st(e) {
  return lt.test(e.namespaceURI) && e.nodeName.toLowerCase() !== "svg";
}
function ct(e) {
  const n = {};
  for (const t in e) e.hasOwnProperty(t) && (n[t] = e[t]);
  return n;
}
const Re = {
  animate: !1,
  canvas: !1,
  cursor: "move",
  disablePan: !1,
  disableZoom: !1,
  disableXAxis: !1,
  disableYAxis: !1,
  duration: 200,
  easing: "ease-in-out",
  exclude: [],
  excludeClass: "panzoom-exclude",
  handleStartEvent: (e) => {
    e.preventDefault(), e.stopPropagation();
  },
  maxScale: 4,
  minScale: 0.125,
  overflow: "hidden",
  panOnlyWhenZoomed: !1,
  pinchAndPan: !1,
  relative: !1,
  setTransform: nt,
  startX: 0,
  startY: 0,
  startScale: 1,
  step: 0.3,
  touchAction: "none"
};
function ke(e, n) {
  if (!e) throw new Error("Panzoom requires an element as an argument");
  if (e.nodeType !== 1) throw new Error("Panzoom requires an element with a nodeType of 1");
  if (!ot(e))
    throw new Error("Panzoom should be called on elements that have been attached to the DOM");
  n = {
    ...Re,
    ...n
  };
  const t = st(e), o = e.parentNode;
  o.style.overflow = n.overflow, o.style.userSelect = "none", o.style.touchAction = n.touchAction, (n.canvas ? o : e).style.cursor = n.cursor, e.style.userSelect = "none", e.style.touchAction = n.touchAction, F(e, "transformOrigin", typeof n.origin == "string" ? n.origin : t ? "0 0" : "50% 50%");
  function p() {
    o.style.overflow = "", o.style.userSelect = "", o.style.touchAction = "", o.style.cursor = "", e.style.cursor = "", e.style.userSelect = "", e.style.touchAction = "", F(e, "transformOrigin", "");
  }
  function h(a = {}) {
    for (const s in a) a.hasOwnProperty(s) && (n[s] = a[s]);
    (a.hasOwnProperty("cursor") || a.hasOwnProperty("canvas")) && (o.style.cursor = e.style.cursor = "", (n.canvas ? o : e).style.cursor = n.cursor), a.hasOwnProperty("overflow") && (o.style.overflow = a.overflow), a.hasOwnProperty("touchAction") && (o.style.touchAction = a.touchAction, e.style.touchAction = a.touchAction);
  }
  let m = 0, g = 0, u = 1, A = !1;
  b(n.startScale, { animate: !1, force: !0 }), setTimeout(() => {
    E(n.startX, n.startY, { animate: !1, force: !0 });
  });
  function C(a, s, f) {
    if (f.silent) return;
    const N = new CustomEvent(a, { detail: s });
    e.dispatchEvent(N);
  }
  function r(a, s, f) {
    const N = { x: m, y: g, scale: u, isSVG: t, originalEvent: f };
    typeof s.animate == "boolean" && (s.animate ? tt(e, s) : F(e, "transition", "none")), s.setTransform(e, N, s);
    function i() {
      const y = _(e);
      N.dimsOut = y, C(a, N, s), C("panzoomchange", N, s);
    }
    return s.animate ? setTimeout(() => {
      i();
    }, s.duration + 50) : requestAnimationFrame(() => {
      i();
    }), N;
  }
  function c(a, s, f, N) {
    const i = { ...n, ...N }, y = { x: m, y: g, opts: i };
    if (!i.force && (i.disablePan || i.panOnlyWhenZoomed && u === i.startScale)) return y;
    if (a = parseFloat(a), s = parseFloat(s), i.disableXAxis || (y.x = (i.relative ? m : 0) + a), i.disableYAxis || (y.y = (i.relative ? g : 0) + s), i.contain) {
      const d = _(e), x = d.elem.width / u, M = d.elem.height / u, G = x * f, q = M * f, $ = (G - x) / 2, V = (q - M) / 2;
      if (i.contain === "inside") {
        const re = (-d.elem.margin.left - d.parent.padding.left + $) / f, ie = (d.parent.width - G - d.parent.padding.left - d.elem.margin.left - d.parent.border.left - d.parent.border.right + $) / f;
        y.x = Math.max(Math.min(y.x, ie), re);
        const le = (-d.elem.margin.top - d.parent.padding.top + V) / f, se = (d.parent.height - q - d.parent.padding.top - d.elem.margin.top - d.parent.border.top - d.parent.border.bottom + V) / f;
        y.y = Math.max(Math.min(y.y, se), le);
      } else if (i.contain === "outside") {
        const re = (-(G - d.parent.width) - d.parent.padding.left - d.parent.border.left - d.parent.border.right + $) / f, ie = ($ - d.parent.padding.left) / f;
        y.x = Math.max(Math.min(y.x, ie), re);
        const le = (-(q - d.parent.height) - d.parent.padding.top - d.parent.border.top - d.parent.border.bottom + V) / f, se = (V - d.parent.padding.top) / f;
        y.y = Math.max(Math.min(y.y, se), le);
      }
    }
    return i.roundPixels && (y.x = Math.round(y.x), y.y = Math.round(y.y)), y;
  }
  function v(a, s) {
    const f = { ...n, ...s }, N = { scale: u, opts: f };
    if (!f.force && f.disableZoom) return N;
    let i = n.minScale, y = n.maxScale;
    if (f.contain) {
      const d = _(e), x = d.elem.width / u, M = d.elem.height / u;
      if (x > 1 && M > 1) {
        const G = d.parent.width - d.parent.border.left - d.parent.border.right, q = d.parent.height - d.parent.border.top - d.parent.border.bottom, $ = G / x, V = q / M;
        n.contain === "inside" ? y = Math.min(y, $, V) : n.contain === "outside" && (i = Math.max(i, $, V));
      }
    }
    return N.scale = Math.min(Math.max(a, i), y), N;
  }
  function E(a, s, f, N) {
    const i = c(a, s, u, f);
    return m !== i.x || g !== i.y ? (m = i.x, g = i.y, r("panzoompan", i.opts, N)) : { x: m, y: g, scale: u, isSVG: t, originalEvent: N };
  }
  function b(a, s, f) {
    const N = v(a, s), i = N.opts;
    if (!i.force && i.disableZoom) return;
    a = N.scale;
    let y = m, d = g;
    if (i.focal) {
      const M = i.focal;
      y = (M.x / a - M.x / u + m * a) / a, d = (M.y / a - M.y / u + g * a) / a;
    }
    const x = c(y, d, a, {
      relative: !1,
      force: !0
    });
    return m = x.x, g = x.y, u = a, r("panzoomzoom", i, f);
  }
  function X(a, s) {
    const f = { ...n, animate: !0, ...s };
    return b(u * Math.exp((a ? 1 : -1) * f.step), f);
  }
  function z(a) {
    return X(!0, a);
  }
  function k(a) {
    return X(!1, a);
  }
  function O(a, s, f, N) {
    const i = _(e), y = {
      width: i.parent.width - i.parent.padding.left - i.parent.padding.right - i.parent.border.left - i.parent.border.right,
      height: i.parent.height - i.parent.padding.top - i.parent.padding.bottom - i.parent.border.top - i.parent.border.bottom
    };
    let d = s.clientX - i.parent.left - i.parent.padding.left - i.parent.border.left - i.elem.margin.left, x = s.clientY - i.parent.top - i.parent.padding.top - i.parent.border.top - i.elem.margin.top;
    t || (d -= i.elem.width / u / 2, x -= i.elem.height / u / 2);
    const M = {
      x: d / y.width * (y.width * a),
      y: x / y.height * (y.height * a)
    };
    return b(a, { ...f, animate: !1, focal: M }, N);
  }
  function P(a, s) {
    a.preventDefault();
    const f = { ...n, ...s, animate: !1 }, N = (a.deltaY === 0 && a.deltaX ? a.deltaX : a.deltaY) < 0 ? 1 : -1, i = v(u * Math.exp(N * f.step / 3), f).scale;
    return O(i, a, f, a);
  }
  function U(a) {
    const s = { ...n, animate: !0, force: !0, ...a };
    u = v(s.startScale, s).scale;
    const f = c(s.startX, s.startY, u, s);
    return m = f.x, g = f.y, r("panzoomreset", s);
  }
  let l, S, w, Y, B, Z;
  const I = [];
  function te(a) {
    if (it(a.target, n)) return;
    ve(I, a), A = !0, n.handleStartEvent(a), l = m, S = g, C("panzoomstart", { x: m, y: g, scale: u, isSVG: t, originalEvent: a }, n);
    const s = Se(I);
    w = s.clientX, Y = s.clientY, B = u, Z = ce(I);
  }
  function ne(a) {
    if (!A || l === void 0 || S === void 0 || w === void 0 || Y === void 0) return;
    ve(I, a);
    const s = Se(I), f = I.length > 1;
    let N = u;
    if (f) {
      Z === 0 && (Z = ce(I));
      const i = ce(I) - Z;
      N = v(i * n.step / 80 + B).scale, O(N, s, { animate: !1 }, a);
    }
    (!f || n.pinchAndPan) && E(
      l + (s.clientX - w) / N,
      S + (s.clientY - Y) / N,
      {
        animate: !1
      },
      a
    );
  }
  function oe(a) {
    I.length === 1 && C("panzoomend", { x: m, y: g, scale: u, isSVG: t, originalEvent: a }, n), Je(I, a), A && (A = !1, l = S = w = Y = void 0);
  }
  let ae = !1;
  function ye() {
    ae || (ae = !0, ue("down", n.canvas ? o : e, te), ue("move", document, ne, { passive: !0 }), ue("up", document, oe, { passive: !0 }));
  }
  function Oe() {
    ae = !1, de("down", n.canvas ? o : e, te), de("move", document, ne), de("up", document, oe);
  }
  return n.noBind || ye(), {
    bind: ye,
    destroy: Oe,
    eventNames: W,
    getPan: () => ({ x: m, y: g }),
    getScale: () => u,
    getOptions: () => ct(n),
    handleDown: te,
    handleMove: ne,
    handleUp: oe,
    pan: E,
    reset: U,
    resetStyle: p,
    setOptions: h,
    setStyle: (a, s) => F(e, a, s),
    zoom: b,
    zoomIn: z,
    zoomOut: k,
    zoomToPoint: O,
    zoomWithWheel: P
  };
}
ke.defaultOptions = Re;
const ut = { class: "sketch-ruler" }, dt = { class: "canvasedit" }, ht = /* @__PURE__ */ ee({
  __name: "index",
  props: je,
  emits: ["onCornerClick", "update:scale"],
  setup(e, { expose: n, emit: t }) {
    const o = e, p = t, h = R(null), m = R(0), g = R(0), u = R(0), A = R(0), C = R(1), r = R(o.isShowReferLine), c = R(null), v = L(() => {
      function l(w, Y) {
        return Object.keys(w).forEach((B) => {
          B && w.hasOwnProperty(B) && (typeof Y[B] == "object" ? w[B] = l(w[B], Y[B]) : Y.hasOwnProperty(B) && (w[B] = Y[B]));
        }), w;
      }
      return l(
        {
          bgColor: "rgba(225,225,225, 0)",
          // ruler bg color
          longfgColor: "#BABBBC",
          // ruler longer mark color
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
        o.palette || {}
      );
    }), E = L(() => ({
      backgroundImage: r.value ? `url(${o.eyeIcon || Ze})` : `url(${o.closeEyeIcon || He})`,
      width: o.thick + "px",
      height: o.thick + "px",
      borderRight: `1px solid ${v.value.borderColor}`,
      borderBottom: `1px solid ${v.value.borderColor}`
    })), b = L(() => ({
      background: "#ff9",
      marginTop: o.thick + "px",
      marginLeft: o.thick + "px",
      width: o.width - o.thick + "px",
      height: o.height - o.thick + "px"
    }));
    ge(() => {
      X();
    });
    const X = () => {
      h.value = document.querySelector(".canvasedit"), z(), console.log(u.value, "zoomStartX.value"), console.log(A.value, "zoomStartY.value"), c.value = ke(h.value, {
        noBind: !0,
        startScale: o.scale,
        cursor: "default",
        startX: u.value,
        startY: A.value,
        smoothScroll: !0,
        ...o.panzoomOption
      }), h.value.addEventListener("panzoomchange", (l) => {
        const { scale: S, dimsOut: w } = l.detail;
        if (w) {
          console.log(l.detail, "event.detail"), p("update:scale", S), C.value = S;
          const Y = (w.parent.left - w.elem.left) / S, B = (w.parent.top - w.elem.top) / S;
          m.value = Y, console.log(m.value * S, "startX.value"), console.log(S, "scale"), g.value = B;
        }
      }), parent.addEventListener("wheel", function(l) {
        (l.ctrlKey || l.metaKey) && c.value.zoomWithWheel(l);
      }), parent.addEventListener("keydown", function(l) {
        l.key === " " && c.value.bind();
      }), parent.addEventListener("keyup", function(l) {
        l.key === " " && c.value.destroy();
      });
    }, z = () => {
      const S = document.querySelector(".canvasedit-parent").getBoundingClientRect(), w = h.value.children[0].getBoundingClientRect(), { width: Y, height: B } = S;
      Y > w.width ? (u.value = (Y - o.thick - w.width) / 2, B > w.height ? A.value = (B - o.thick - w.height) / 2 : A.value = 0) : (A.value = 0, u.value = 0);
    }, k = () => {
      c.value.reset();
    }, O = () => {
      c.value.zoomIn();
    }, P = () => {
      c.value.zoomOut();
    }, U = () => {
      r.value = !r.value, p("onCornerClick", r.value);
    };
    return me([() => o.isShowReferLine], () => {
      r.value = o.isShowReferLine;
    }), n({
      resetMethod: k,
      zoomInMethod: O,
      zoomOutMethod: P
    }), (l, S) => (T(), K("div", ut, [
      be(l.$slots, "btn", {
        resetMethod: k,
        zoomInMethod: O,
        zoomOutMethod: P
      }),
      D("div", {
        class: "canvasedit-parent",
        style: Q(b.value),
        onWheel: S[0] || (S[0] = Ue(() => {
        }, ["prevent"]))
      }, [
        D("div", dt, [
          be(l.$slots, "default")
        ])
      ], 36),
      fe(Ae, {
        vertical: !1,
        width: l.width,
        height: l.thick,
        "is-show-refer-line": r.value,
        thick: l.thick,
        ratio: l.ratio,
        start: m.value,
        lines: l.lines.h,
        "select-start": l.shadow.x,
        "select-length": l.shadow.width,
        scale: C.value,
        palette: v.value,
        startNumX: l.startNumX,
        endNumX: l.endNumX
      }, null, 8, ["width", "height", "is-show-refer-line", "thick", "ratio", "start", "lines", "select-start", "select-length", "scale", "palette", "startNumX", "endNumX"]),
      fe(Ae, {
        vertical: !0,
        width: l.thick,
        height: l.height,
        "is-show-refer-line": r.value,
        thick: l.thick,
        ratio: l.ratio,
        start: g.value,
        lines: l.lines.v,
        "select-start": l.shadow.y,
        "select-length": l.shadow.height,
        scale: C.value,
        palette: v.value,
        startNumY: l.startNumY,
        endNumY: l.endNumY
      }, null, 8, ["width", "height", "is-show-refer-line", "thick", "ratio", "start", "lines", "select-start", "select-length", "scale", "palette", "startNumY", "endNumY"]),
      D("a", {
        class: "corner",
        style: Q(E.value),
        onClick: U
      }, null, 4)
    ]));
  }
});
export {
  ht as SketchRule,
  ht as default
};
