import { defineComponent as ee, ref as k, computed as M, onMounted as ge, withDirectives as pe, openBlock as T, createElementBlock as K, normalizeStyle as Q, createElementVNode as D, toDisplayString as Be, createCommentVNode as xe, vShow as he, reactive as Le, onUnmounted as ze, watch as me, normalizeClass as Me, createVNode as fe, Fragment as Pe, renderList as Ue, createBlock as Ie, renderSlot as be, withModifiers as $e } from "vue";
/*!vue3-sketch-ruler v2.0.1-beta.02024年7月Wed Jul 10 2024 17:41:57 GMT+0800 (中国标准时间)制作*/
const Ve = {
  key: 0,
  class: "value"
}, Te = /* @__PURE__ */ ee({
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
  setup(e, { emit: t }) {
    const n = k(0), o = e, m = t, u = k(o.value), f = M(() => u.value >= o.start), g = M(() => {
      const w = (u.value - o.start) * o.scale;
      return o.vertical ? { top: `${w}px` } : { left: `${w}px` };
    }), d = M(() => {
      var R;
      const w = ((R = o.palette) == null ? void 0 : R.lineColor) ?? "black";
      return {
        cursor: o.isShowReferLine ? o.vertical ? "ns-resize" : "ew-resize" : "default",
        ...o.vertical ? { borderTop: `1px solid ${w}` } : { borderLeft: `1px solid ${w}` }
      };
    }), A = M(() => ({
      [o.vertical ? "left" : "top"]: `${n.value}px`
    }));
    ge(() => {
      u.value = o.value ?? 0;
    });
    function E(w) {
      const R = o.vertical ? w.clientY : w.clientX, x = u.value, P = (L) => {
        const O = ((o.vertical ? L.clientY : L.clientX) - R) / o.scale;
        u.value = Math.round(x + O), m("onMouseDown");
      };
      document.addEventListener("mousemove", P), document.addEventListener(
        "mouseup",
        () => {
          f.value || i(), document.removeEventListener("mousemove", P), m("onRelease", u.value, o.index);
        },
        { once: !0 }
      );
    }
    function i() {
      console.log("删除", o.index), m("onRemove", o.index);
    }
    const p = k(!1), c = (w) => {
      n.value = o.vertical ? w.offsetX : w.offsetY;
    }, N = M(() => `${o.vertical ? "Y" : "X"}：${u.value}`);
    return (w, R) => pe((T(), K("div", {
      class: "line",
      style: Q({ ...g.value, ...d.value }),
      onMouseenter: R[0] || (R[0] = (x) => p.value = !0),
      onMousemove: c,
      onMouseleave: R[1] || (R[1] = (x) => p.value = !1),
      onMousedown: E
    }, [
      D("div", {
        class: "action",
        style: Q(A.value)
      }, [
        p.value ? (T(), K("span", Ve, Be(N.value), 1)) : xe("", !0)
      ], 4)
    ], 36)), [
      [he, f.value]
    ]);
  }
}), Re = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, m] of t)
    n[o] = m;
  return n;
}, De = /* @__PURE__ */ Re(Te, [["__scopeId", "data-v-aebb098c"]]), Fe = (e) => e <= 0.25 ? 40 : e <= 0.5 ? 20 : e <= 1 ? 10 : e <= 2 ? 5 : e <= 4 ? 2 : 1, Ae = 0.83, Ke = (e, t, n, o, m, u) => {
  const { scale: f, width: g, height: d, ratio: A, palette: E } = m, { bgColor: i, fontColor: p, shadowColor: c, longfgColor: N } = E, w = u ? m.endNumX : m.endNumY;
  if (e.scale(A, A), e.clearRect(0, 0, g, d), e.fillStyle = i, e.fillRect(0, 0, g, d), o) {
    const O = (n - t) * f, s = o * f;
    e.fillStyle = c, u ? e.fillRect(O, 0, s, d * 3 / 8) : e.fillRect(0, O, g * 3 / 8, s);
  }
  const x = Fe(f) * 10, P = x * f, L = -t / x * P, I = t + Math.ceil((u ? g : d) / f);
  e.beginPath(), e.fillStyle = p, e.strokeStyle = N;
  for (let O = 0, s = 0; O < I; O += x, s++) {
    if (O <= w) {
      debugger;
      const S = L + s * P;
      u ? e.moveTo(S, 0) : e.moveTo(0, S), e.save(), u ? e.translate(S, d * 0.4) : e.translate(g * 0.4, S), u || e.rotate(-Math.PI / 2), e.scale(Ae / A, Ae / A), e.fillText(O.toString(), 4 * A, 7 * A), e.restore(), u ? e.lineTo(S, d * 9 / 16) : e.lineTo(g * 9 / 16, S), console.log(S, "xBBBBBBBB");
    }
    e.stroke(), e.closePath(), e.setTransform(1, 0, 0, 1, 0, 0);
  }
}, Qe = /* @__PURE__ */ ee({
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
    endNumX: {},
    endNumY: {}
  },
  emits: ["onAddLine", "update:showIndicator", "update:valueNum"],
  setup(e, { emit: t }) {
    const n = e, o = t, m = Le({
      canvasContext: null
    });
    let u = 1;
    const f = k(null);
    ge(() => {
      u = window.devicePixelRatio || 1, window.addEventListener("resize", g), d(), A(u);
    });
    const g = () => {
      u = window.devicePixelRatio || 1, A(u), E(u);
    }, d = () => {
      m.canvasContext = f.value && f.value.getContext("2d");
    };
    ze(() => {
      window.removeEventListener("resize", g);
    });
    const A = (p) => {
      if (f.value) {
        f.value.width = n.width * p, f.value.height = n.height * p;
        const c = m.canvasContext;
        c && (c.font = `${12 * p}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`, c.lineWidth = 1, c.textBaseline = "middle");
      }
    }, E = (p) => {
      console.log("drawRuler", n.scale);
      const c = {
        scale: n.scale,
        width: n.width,
        height: n.height,
        palette: n.palette,
        endNumX: n.endNumX,
        endNumY: n.endNumY,
        ratio: p
      };
      m.canvasContext && Ke(
        m.canvasContext,
        n.start,
        n.selectStart,
        n.selectLength,
        c,
        !n.vertical
      );
    };
    me(
      () => n.start,
      () => {
        console.log("start", n.start), E(u);
      }
    ), me([() => n.width, () => n.height], () => {
      A(u), E(u);
    });
    const i = (p, c) => {
      const N = n.vertical ? p.offsetY : p.offsetX, w = Math.round(n.start + N / n.scale);
      switch (c) {
        case "click":
          o("onAddLine", w);
          break;
        case "enter":
          o("update:valueNum", w), o("update:showIndicator", !0);
          break;
        default:
          o("update:valueNum", w);
          break;
      }
    };
    return (p, c) => (T(), K("canvas", {
      ref_key: "canvas",
      ref: f,
      class: "ruler",
      onClick: c[0] || (c[0] = (N) => i(N, "click")),
      onMouseenter: c[1] || (c[1] = (N) => i(N, "enter")),
      onMousemove: c[2] || (c[2] = (N) => i(N, "move")),
      onMouseleave: c[3] || (c[3] = (N) => p.$emit("update:showIndicator", !1))
    }, null, 544));
  }
}), Ge = {
  scale: Number,
  ratio: Number,
  thick: Number,
  endNumX: Number,
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
}, qe = { class: "lines" }, We = { class: "value" }, Ze = /* @__PURE__ */ ee({
  __name: "ruler-wrapper",
  props: Ge,
  emits: ["update:lines", "on-remove-line"],
  setup(e, { emit: t }) {
    const n = e, o = k(!1), m = k(0), u = M(() => n.vertical ? "v-container" : "h-container"), f = M(() => {
      const i = {
        width: `calc(100% - ${n.thick}px)`,
        height: `${n.thick + 1}px`,
        left: `${n.thick}px`
      }, p = {
        width: `${n.thick && n.thick + 1}px`,
        height: `calc(100% - ${n.thick}px)`,
        top: `${n.thick}px`
      };
      return n.vertical ? p : i;
    }), g = M(() => {
      var w;
      const i = (m.value - n.start) * n.scale;
      let p = n.vertical ? "top" : "left", c = n.vertical ? "left" : "top", N = n.vertical ? "borderBottom" : "borderLeft";
      return {
        [p]: i + "px",
        [c]: n.thick + "px",
        [N]: `1px solid ${(w = n.palette) == null ? void 0 : w.lineColor}`
      };
    }), d = (i) => {
      n.lines.push(i);
    }, A = (i, p) => {
      const c = i - n.start, N = (n.vertical ? n.height : n.width) / n.scale;
      c < 0 || c > N ? E(p) : n.lines[p] = i;
    }, E = (i) => {
      n.lines.splice(i, 1);
    };
    return (i, p) => (T(), K("div", {
      class: Me(u.value),
      style: Q(f.value)
    }, [
      fe(Qe, {
        vertical: i.vertical,
        scale: i.scale,
        width: i.width,
        height: i.height,
        start: i.start,
        ratio: i.ratio,
        endNumX: i.endNumX,
        startNumY: i.startNumY,
        endNumY: i.endNumY,
        "select-start": i.selectStart,
        "select-length": i.selectLength,
        palette: i.palette,
        valueNum: m.value,
        "onUpdate:valueNum": p[0] || (p[0] = (c) => m.value = c),
        showIndicator: o.value,
        "onUpdate:showIndicator": p[1] || (p[1] = (c) => o.value = c),
        onOnAddLine: d
      }, null, 8, ["vertical", "scale", "width", "height", "start", "ratio", "endNumX", "startNumY", "endNumY", "select-start", "select-length", "palette", "valueNum", "showIndicator"]),
      pe(D("div", qe, [
        (T(!0), K(Pe, null, Ue(i.lines, (c, N) => (T(), Ie(De, {
          key: c + N,
          index: N,
          value: c >> 0,
          scale: i.scale,
          start: i.start,
          thick: i.thick,
          palette: i.palette,
          vertical: i.vertical,
          "is-show-refer-line": i.isShowReferLine,
          onOnRemove: E,
          onOnRelease: A
        }, null, 8, ["index", "value", "scale", "start", "thick", "palette", "vertical", "is-show-refer-line"]))), 128))
      ], 512), [
        [he, i.isShowReferLine]
      ]),
      pe(D("div", {
        class: "indicator",
        style: Q(g.value)
      }, [
        D("div", We, Be(m.value), 1)
      ], 4), [
        [he, o.value]
      ])
    ], 6));
  }
}), Ne = /* @__PURE__ */ Re(Ze, [["__scopeId", "data-v-41d371f8"]]), He = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAopJREFUOE/FlE9IVEEcx7+/N9ouds1Mu0QUSFZYdIgoUqQoKPBQHsKozpXE7jbTO/U8xLJvn6usBHWQ6hBFXupSkQeVbh0KJEPp0sH+eLGTsKs77xcj78m0ax0E8cHjzZv5zef3/c33xxA24KENYGJzoEEQbNNaN4Zh2OQ4znwYhr9c1/39vwrXVDo0NNS0tLR0GYB5D64BmAMwzMyvlFKz1es10Hw+f4mZ7wHYBeA9gNdENFepVOaEEM3M3OI4Thczn41gt6WUgQ3+C+r7/h0AWQD3mXnYqPA8L9nQ0HCemduIaFpKOWoAhUJhT6VSuQXgOjP3K6W8GLwKzeVyp4jonR0QBEErM48w8zFLyayUsjX+z+VyHhHdZebTSqkxM78CHRgYOKS1/ghgVErZY214RkQ7ADyRUj72ff8qgCtmXUrZGcf5vv8CwEUhxOF0Ov1pBRpla5dSdseBhUJhpznH6tIsZb1KqacW+BGArUaUXX63UuplHJTNZjuEEONSyhozfd/n6mQ1RkXZL2itz7mu+80EDA4ONi8vL/8AcM2UbikyR2BU9cSmmTU70YqKIAj2hWFo2uenlHK/BRg3Y2aeNO5GyU8S0ZbFxcUuz/NKEXAGQKPjOCcymcyX1dIi8DSAiWQyeaavr68cbSgCuBknYubnQoj+TCYzUywWE6VS6S2ADsdx2gxw1X3L7SNENMbMnwE8qK+vf5NKpRaMaeVyeW8ikfiaSqW+R7BuZr5BRMe11p2u607U9Gk8kc/ntzPzQwCmExYATDLzVBiGE0KIowAOADDf3QA+aK2VDaxRajto3K+rq+tl5nYAzQBamHmeiOYBTGmtR6ph/1Rqg9c73pz7dD1qN0TpHyNQRCUDJXrAAAAAAElFTkSuQmCC", je = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAjtJREFUOE/NlD9oFEEUxn9v9ghC0hpRUogIAUmniGAT/5Q2FrETPSNRJILg7RwimI0ox85eQFCEBGIUO1PYpFM0jSConQoBEZGgGPsgl+w+2eM2bC57SopAFqYZ3v7m+977ZoQt+GQLmGxPaBiGgYiMWWvXBHZUGoZhH3BERPYC+4F+4Keq/urt7b1RLpf/ZEBVHa9Wq0HWyg3QKIoGVPU8cA7wgK/pUtXPQJ8xZk+pVBpuNBqXUoUiEvi+P56fzTpo6+SbwHNg1lo7WzTITGEKXFlZeeB53tVCpa3CK8AFa+1cBgvD8LKIXAQOJkkyICJDeYVBEJS6u7s/qeoLa+1o+l9TqXNuBLhmjDlbqVQ+5ICjInIfOBPH8W9jzGCR5YmJiRNxHM+papgqzqDvgSlr7VTernPuO3An3c9bBt74vv+yrdaKyLDv+/1Sq9UGPc97nY9EVuycU2AQOA7cAm4Dr4D5TvVxHB9rKo2iaEFVp621Ln96FEUngaOqGmSxabVqsh3a2h+x1h5qQjNrae/yE4+iaCwDJkky73neTuBZe129Xk+H+BS4l7ZqLVIZ2BhzuFKpvMsDVXXWGPMxFdAedOfcKeCRqj7MYrUhpz09PfXl5eXrectFWXXODQHpOq2qd/95o/JXr6ura3J1dXU6SZIfwKKIHAD2tVYMPBGRx77vN10UXtO85fTkmZmZHUtLSzUR2QXsBhaAL6r6DXhbrVYXi1yss59GqOgub/bN3Z7v6X/tb9Zmp/q/kN8s+lJb8oEAAAAASUVORK5CYII=", Je = {
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
  endNumX: {
    type: Number,
    default: 1 / 0
  },
  endNumY: {
    type: Number,
    default: 1 / 0
  },
  panzoomOption: Object
};
/*!simple-panzoom v1.0.12024年7月Fri Jul 05 2024 11:44:52 GMT+0800 (中国标准时间)制作*/
typeof window < "u" && (window.NodeList && !NodeList.prototype.forEach && (NodeList.prototype.forEach = Array.prototype.forEach), typeof window.CustomEvent != "function" && (window.CustomEvent = function(e, t) {
  t = t || { bubbles: !1, cancelable: !1, detail: null };
  var n = document.createEvent("CustomEvent");
  return n.initCustomEvent(e, t.bubbles, t.cancelable, t.detail), n;
}));
function Xe(e, t) {
  let n = e.length;
  for (; n--; )
    if (e[n].pointerId === t.pointerId)
      return n;
  return -1;
}
function ve(e, t) {
  let n;
  if (t.touches) {
    n = 0;
    for (const o of t.touches)
      o.pointerId = n++, ve(e, o);
    return;
  }
  n = Xe(e, t), n > -1 && e.splice(n, 1), e.push(t);
}
function _e(e, t) {
  if (t.touches) {
    for (; e.length; )
      e.pop();
    return;
  }
  const n = Xe(e, t);
  n > -1 && e.splice(n, 1);
}
function Se(e) {
  e = e.slice(0);
  let t = e.pop(), n;
  for (; n = e.pop(); )
    t = {
      clientX: (n.clientX - t.clientX) / 2 + t.clientX,
      clientY: (n.clientY - t.clientY) / 2 + t.clientY
    };
  return t;
}
function ce(e) {
  if (e.length < 2)
    return 0;
  const t = e[0], n = e[1];
  return Math.sqrt(
    Math.pow(Math.abs(n.clientX - t.clientX), 2) + Math.pow(Math.abs(n.clientY - t.clientY), 2)
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
function ue(e, t, n, o) {
  W[e].split(" ").forEach((m) => {
    t.addEventListener(
      m,
      n,
      o
    );
  });
}
function de(e, t, n) {
  W[e].split(" ").forEach((o) => {
    t.removeEventListener(o, n);
  });
}
const et = typeof document < "u" && !!document.documentMode;
let Ce;
function tt() {
  return Ce || (Ce = document.createElement("div").style);
}
const Ee = ["webkit", "moz", "ms"], H = {};
function we(e) {
  if (H[e])
    return H[e];
  const t = tt();
  if (e in t)
    return H[e] = e;
  const n = e[0].toUpperCase() + e.slice(1);
  let o = Ee.length;
  for (; o--; ) {
    const m = `${Ee[o]}${n}`;
    if (m in t)
      return H[e] = m;
  }
}
function j(e, t) {
  return parseFloat(t[we(e)]) || 0;
}
function J(e, t, n = window.getComputedStyle(e)) {
  const o = t === "border" ? "Width" : "";
  return {
    left: j(`${t}Left${o}`, n),
    right: j(`${t}Right${o}`, n),
    top: j(`${t}Top${o}`, n),
    bottom: j(`${t}Bottom${o}`, n)
  };
}
function F(e, t, n) {
  e.style[we(t)] = n;
}
function nt(e, t) {
  const n = we("transform");
  F(e, "transition", `${n} ${t.duration}ms ${t.easing}`);
}
function ot(e, { x: t, y: n, scale: o, isSVG: m }, u) {
  if (F(e, "transform", `scale(${o}) translate(${t}px, ${n}px)`), m && et) {
    const f = window.getComputedStyle(e).getPropertyValue("transform");
    e.setAttribute("transform", f);
  }
}
function _(e) {
  const t = e.parentNode, n = window.getComputedStyle(e), o = window.getComputedStyle(t), m = e.getBoundingClientRect(), u = t.getBoundingClientRect();
  return {
    elem: {
      style: n,
      width: m.width,
      height: m.height,
      top: m.top,
      bottom: m.bottom,
      left: m.left,
      right: m.right,
      margin: J(e, "margin", n),
      border: J(e, "border", n)
    },
    parent: {
      style: o,
      width: u.width,
      height: u.height,
      top: u.top,
      bottom: u.bottom,
      left: u.left,
      right: u.right,
      padding: J(t, "padding", o),
      border: J(t, "border", o)
    }
  };
}
function at(e) {
  let t = e;
  for (; t && t.parentNode; ) {
    if (t.parentNode === document) return !0;
    t = t.parentNode instanceof ShadowRoot ? t.parentNode.host : t.parentNode;
  }
  return !1;
}
function rt(e) {
  return (e.getAttribute("class") || "").trim();
}
function it(e, t) {
  return e.nodeType === 1 && ` ${rt(e)} `.indexOf(` ${t} `) > -1;
}
function lt(e, t) {
  for (let n = e; n != null; n = n.parentNode)
    if (it(n, t.excludeClass) || t.exclude.indexOf(n) > -1)
      return !0;
  return !1;
}
const st = /^http:[\w\.\/]+svg$/;
function ct(e) {
  return st.test(e.namespaceURI) && e.nodeName.toLowerCase() !== "svg";
}
function ut(e) {
  const t = {};
  for (const n in e)
    e.hasOwnProperty(n) && (t[n] = e[n]);
  return t;
}
const ke = {
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
  setTransform: ot,
  startX: 0,
  startY: 0,
  startScale: 1,
  step: 0.3,
  touchAction: "none"
};
function Oe(e, t) {
  if (!e)
    throw new Error("Panzoom requires an element as an argument");
  if (e.nodeType !== 1)
    throw new Error("Panzoom requires an element with a nodeType of 1");
  if (!at(e))
    throw new Error(
      "Panzoom should be called on elements that have been attached to the DOM"
    );
  t = {
    ...ke,
    ...t
  };
  const n = ct(e), o = e.parentNode;
  o.style.overflow = t.overflow, o.style.userSelect = "none", o.style.touchAction = t.touchAction, (t.canvas ? o : e).style.cursor = t.cursor, e.style.userSelect = "none", e.style.touchAction = t.touchAction, F(
    e,
    "transformOrigin",
    typeof t.origin == "string" ? t.origin : n ? "0 0" : "50% 50%"
  );
  function m() {
    o.style.overflow = "", o.style.userSelect = "", o.style.touchAction = "", o.style.cursor = "", e.style.cursor = "", e.style.userSelect = "", e.style.touchAction = "", F(e, "transformOrigin", "");
  }
  function u(a = {}) {
    for (const l in a)
      a.hasOwnProperty(l) && (t[l] = a[l]);
    (a.hasOwnProperty("cursor") || a.hasOwnProperty("canvas")) && (o.style.cursor = e.style.cursor = "", (t.canvas ? o : e).style.cursor = t.cursor), a.hasOwnProperty("overflow") && (o.style.overflow = a.overflow), a.hasOwnProperty("touchAction") && (o.style.touchAction = a.touchAction, e.style.touchAction = a.touchAction);
  }
  let f = 0, g = 0, d = 1, A = !1;
  w(t.startScale, { animate: !1, force: !0 }), setTimeout(() => {
    N(t.startX, t.startY, { animate: !1, force: !0 });
  });
  function E(a, l, v) {
    if (v.silent)
      return;
    const y = new CustomEvent(a, { detail: l });
    e.dispatchEvent(y);
  }
  function i(a, l, v) {
    const y = { x: f, y: g, scale: d, isSVG: n, originalEvent: v };
    return typeof l.animate == "boolean" && (l.animate ? nt(e, l) : F(e, "transition", "none")), l.setTransform(e, y, l), requestAnimationFrame(() => {
      const r = _(e);
      y.dimsOut = r, E(a, y, l), E("panzoomchange", y, l);
    }), y;
  }
  function p(a, l, v, y) {
    const r = { ...t, ...y }, b = { x: f, y: g, opts: r };
    if (!r.force && (r.disablePan || r.panOnlyWhenZoomed && d === r.startScale))
      return b;
    if (a = parseFloat(a), l = parseFloat(l), r.disableXAxis || (b.x = (r.relative ? f : 0) + a), r.disableYAxis || (b.y = (r.relative ? g : 0) + l), r.contain) {
      const h = _(e), z = h.elem.width / d, Y = h.elem.height / d, G = z * v, q = Y * v, $ = (G - z) / 2, V = (q - Y) / 2;
      if (r.contain === "inside") {
        const re = (-h.elem.margin.left - h.parent.padding.left + $) / v, ie = (h.parent.width - G - h.parent.padding.left - h.elem.margin.left - h.parent.border.left - h.parent.border.right + $) / v;
        b.x = Math.max(Math.min(b.x, ie), re);
        const le = (-h.elem.margin.top - h.parent.padding.top + V) / v, se = (h.parent.height - q - h.parent.padding.top - h.elem.margin.top - h.parent.border.top - h.parent.border.bottom + V) / v;
        b.y = Math.max(Math.min(b.y, se), le);
      } else if (r.contain === "outside") {
        const re = (-(G - h.parent.width) - h.parent.padding.left - h.parent.border.left - h.parent.border.right + $) / v, ie = ($ - h.parent.padding.left) / v;
        b.x = Math.max(Math.min(b.x, ie), re);
        const le = (-(q - h.parent.height) - h.parent.padding.top - h.parent.border.top - h.parent.border.bottom + V) / v, se = (V - h.parent.padding.top) / v;
        b.y = Math.max(Math.min(b.y, se), le);
      }
    }
    return r.roundPixels && (b.x = Math.round(b.x), b.y = Math.round(b.y)), b;
  }
  function c(a, l) {
    const v = { ...t, ...l }, y = { scale: d, opts: v };
    if (!v.force && v.disableZoom)
      return y;
    let r = t.minScale, b = t.maxScale;
    if (v.contain) {
      const h = _(e), z = h.elem.width / d, Y = h.elem.height / d;
      if (z > 1 && Y > 1) {
        const G = h.parent.width - h.parent.border.left - h.parent.border.right, q = h.parent.height - h.parent.border.top - h.parent.border.bottom, $ = G / z, V = q / Y;
        t.contain === "inside" ? b = Math.min(b, $, V) : t.contain === "outside" && (r = Math.max(r, $, V));
      }
    }
    return y.scale = Math.min(Math.max(a, r), b), y;
  }
  function N(a, l, v, y) {
    const r = p(a, l, d, v);
    return f !== r.x || g !== r.y ? (f = r.x, g = r.y, i("panzoompan", r.opts, y)) : { x: f, y: g, scale: d, isSVG: n, originalEvent: y };
  }
  function w(a, l, v) {
    const y = c(a, l), r = y.opts;
    if (!r.force && r.disableZoom)
      return;
    a = y.scale;
    let b = f, h = g;
    if (r.focal) {
      const Y = r.focal;
      b = (Y.x / a - Y.x / d + f * a) / a, h = (Y.y / a - Y.y / d + g * a) / a;
    }
    const z = p(b, h, a, {
      relative: !1,
      force: !0
    });
    return f = z.x, g = z.y, d = a, i("panzoomzoom", r, v);
  }
  function R(a, l) {
    const v = { ...t, animate: !0, ...l };
    return w(d * Math.exp((a ? 1 : -1) * v.step), v);
  }
  function x(a) {
    return R(!0, a);
  }
  function P(a) {
    return R(!1, a);
  }
  function L(a, l, v, y) {
    const r = _(e), b = {
      width: r.parent.width - r.parent.padding.left - r.parent.padding.right - r.parent.border.left - r.parent.border.right,
      height: r.parent.height - r.parent.padding.top - r.parent.padding.bottom - r.parent.border.top - r.parent.border.bottom
    };
    let h = l.clientX - r.parent.left - r.parent.padding.left - r.parent.border.left - r.elem.margin.left, z = l.clientY - r.parent.top - r.parent.padding.top - r.parent.border.top - r.elem.margin.top;
    n || (h -= r.elem.width / d / 2, z -= r.elem.height / d / 2);
    const Y = {
      x: h / b.width * (b.width * a),
      y: z / b.height * (b.height * a)
    };
    return w(
      a,
      { ...v, animate: !1, focal: Y },
      y
    );
  }
  function I(a, l) {
    a.preventDefault();
    const v = { ...t, ...l, animate: !1 }, y = (a.deltaY === 0 && a.deltaX ? a.deltaX : a.deltaY) < 0 ? 1 : -1, r = c(
      d * Math.exp(y * v.step / 3),
      v
    ).scale;
    return L(r, a, v, a);
  }
  function O(a) {
    const l = { ...t, animate: !0, force: !0, ...a };
    d = c(l.startScale, l).scale;
    const v = p(l.startX, l.startY, d, l);
    return f = v.x, g = v.y, i("panzoomreset", l);
  }
  let s, S, C, X, B, Z;
  const U = [];
  function te(a) {
    if (lt(a.target, t))
      return;
    ve(U, a), A = !0, t.handleStartEvent(a), s = f, S = g, E(
      "panzoomstart",
      { x: f, y: g, scale: d, isSVG: n, originalEvent: a },
      t
    );
    const l = Se(U);
    C = l.clientX, X = l.clientY, B = d, Z = ce(U);
  }
  function ne(a) {
    if (!A || s === void 0 || S === void 0 || C === void 0 || X === void 0)
      return;
    ve(U, a);
    const l = Se(U), v = U.length > 1;
    let y = d;
    if (v) {
      Z === 0 && (Z = ce(U));
      const r = ce(U) - Z;
      y = c(r * t.step / 80 + B).scale, L(y, l, { animate: !1 }, a);
    }
    (!v || t.pinchAndPan) && N(
      s + (l.clientX - C) / y,
      S + (l.clientY - X) / y,
      {
        animate: !1
      },
      a
    );
  }
  function oe(a) {
    U.length === 1 && E(
      "panzoomend",
      { x: f, y: g, scale: d, isSVG: n, originalEvent: a },
      t
    ), _e(U, a), A && (A = !1, s = S = C = X = void 0);
  }
  let ae = !1;
  function ye() {
    ae || (ae = !0, ue("down", t.canvas ? o : e, te), ue("move", document, ne, { passive: !0 }), ue("up", document, oe, { passive: !0 }));
  }
  function Ye() {
    ae = !1, de("down", t.canvas ? o : e, te), de("move", document, ne), de("up", document, oe);
  }
  return t.noBind || ye(), {
    bind: ye,
    destroy: Ye,
    eventNames: W,
    getPan: () => ({ x: f, y: g }),
    getScale: () => d,
    getOptions: () => ut(t),
    handleDown: te,
    handleMove: ne,
    handleUp: oe,
    pan: N,
    reset: O,
    resetStyle: m,
    setOptions: u,
    setStyle: (a, l) => F(e, a, l),
    zoom: w,
    zoomIn: x,
    zoomOut: P,
    zoomToPoint: L,
    zoomWithWheel: I
  };
}
Oe.defaultOptions = ke;
const dt = { class: "sketch-ruler" }, pt = { class: "canvasedit" }, mt = /* @__PURE__ */ ee({
  __name: "index",
  props: Je,
  emits: ["onCornerClick", "update:scale"],
  setup(e, { expose: t, emit: n }) {
    const o = e, m = n, u = k(null), f = k(0), g = k(0), d = k(0), A = k(0), E = k(1), i = k(o.isShowReferLine), p = k(null), c = M(() => {
      function s(C, X) {
        return Object.keys(C).forEach((B) => {
          B && C.hasOwnProperty(B) && (typeof X[B] == "object" ? C[B] = s(C[B], X[B]) : X.hasOwnProperty(B) && (C[B] = X[B]));
        }), C;
      }
      return s(
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
    }), N = M(() => ({
      backgroundImage: i.value ? `url(${o.eyeIcon || He})` : `url(${o.closeEyeIcon || je})`,
      width: o.thick + "px",
      height: o.thick + "px",
      borderRight: `1px solid ${c.value.borderColor}`,
      borderBottom: `1px solid ${c.value.borderColor}`
    })), w = M(() => ({
      background: "#ff9",
      marginTop: o.thick + "px",
      marginLeft: o.thick + "px",
      width: o.width - o.thick + "px",
      height: o.height - o.thick + "px"
    }));
    ge(() => {
      R();
    });
    const R = () => {
      u.value = document.querySelector(".canvasedit"), x(), console.log(d.value, "zoomStartX.value"), console.log(A.value, "zoomStartY.value"), p.value = Oe(u.value, {
        noBind: !0,
        startScale: o.scale,
        cursor: "default",
        startX: d.value,
        startY: A.value,
        smoothScroll: !0,
        ...o.panzoomOption
      }), u.value.addEventListener("panzoomchange", (s) => {
        const { scale: S, dimsOut: C } = s.detail;
        if (C) {
          console.log(s.detail, "event.detail"), m("update:scale", S), E.value = S;
          const X = (C.parent.left - C.elem.left) / S, B = (C.parent.top - C.elem.top) / S;
          f.value = X, console.log(f.value * S, "startX.value"), console.log(S, "scale"), g.value = B;
        }
      }), parent.addEventListener("wheel", function(s) {
        (s.ctrlKey || s.metaKey) && p.value.zoomWithWheel(s);
      }), parent.addEventListener("keydown", function(s) {
        s.key === " " && p.value.bind();
      }), parent.addEventListener("keyup", function(s) {
        s.key === " " && p.value.destroy();
      });
    }, x = () => {
      const S = document.querySelector(".canvasedit-parent").getBoundingClientRect(), C = u.value.children[0].getBoundingClientRect(), { width: X, height: B } = S;
      X > C.width ? (d.value = (X - o.thick - C.width) / 2, B > C.height ? A.value = (B - o.thick - C.height) / 2 : A.value = 0) : (A.value = 0, d.value = 0);
    }, P = () => {
      p.value.reset();
    }, L = () => {
      p.value.zoomIn();
    }, I = () => {
      p.value.zoomOut();
    }, O = () => {
      i.value = !i.value, m("onCornerClick", i.value);
    };
    return me([() => o.isShowReferLine], () => {
      i.value = o.isShowReferLine;
    }), t({
      panzoomInstance: p,
      reset: P,
      zoomIn: L,
      zoomOut: I
    }), (s, S) => (T(), K("div", dt, [
      be(s.$slots, "btn", {
        reset: P,
        zoomIn: L,
        zoomOut: I
      }),
      D("div", {
        class: "canvasedit-parent",
        style: Q(w.value),
        onWheel: S[0] || (S[0] = $e(() => {
        }, ["prevent"]))
      }, [
        D("div", pt, [
          be(s.$slots, "default")
        ])
      ], 36),
      fe(Ne, {
        vertical: !1,
        width: s.width,
        height: s.thick,
        "is-show-refer-line": i.value,
        thick: s.thick,
        ratio: s.ratio,
        start: f.value,
        lines: s.lines.h,
        "select-start": s.shadow.x,
        "select-length": s.shadow.width,
        scale: E.value,
        palette: c.value,
        endNumX: s.endNumX
      }, null, 8, ["width", "height", "is-show-refer-line", "thick", "ratio", "start", "lines", "select-start", "select-length", "scale", "palette", "endNumX"]),
      fe(Ne, {
        vertical: !0,
        width: s.thick,
        height: s.height,
        "is-show-refer-line": i.value,
        thick: s.thick,
        ratio: s.ratio,
        start: g.value,
        lines: s.lines.v,
        "select-start": s.shadow.y,
        "select-length": s.shadow.height,
        scale: E.value,
        palette: c.value,
        endNumY: s.endNumY
      }, null, 8, ["width", "height", "is-show-refer-line", "thick", "ratio", "start", "lines", "select-start", "select-length", "scale", "palette", "endNumY"]),
      D("a", {
        class: "corner",
        style: Q(N.value),
        onClick: O
      }, null, 4)
    ]));
  }
});
export {
  mt as SketchRule,
  mt as default
};
