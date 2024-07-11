import { defineComponent as ee, ref as O, computed as L, onMounted as ge, withDirectives as pe, openBlock as V, createElementBlock as Q, normalizeStyle as D, createElementVNode as F, toDisplayString as Be, createCommentVNode as Le, vShow as he, reactive as Me, onUnmounted as xe, watch as fe, normalizeClass as ze, createVNode as me, Fragment as Pe, renderList as Ie, createBlock as Ue, renderSlot as be, withModifiers as $e } from "vue";
/*!vue3-sketch-ruler v2.0.1-beta.22024年7月Thu Jul 11 2024 17:16:21 GMT+0800 (中国标准时间)制作*/
const Te = {
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
  setup(e, { emit: o }) {
    const t = O(0), n = e, p = o, s = O(n.value), h = L(() => s.value >= n.start), g = L(() => {
      const v = (s.value - n.start) * n.scale;
      return n.vertical ? { top: `${v}px` } : { left: `${v}px` };
    }), u = L(() => {
      var E;
      const v = ((E = n.palette) == null ? void 0 : E.lineColor) ?? "black";
      return {
        cursor: n.isShowReferLine ? n.vertical ? "ns-resize" : "ew-resize" : "default",
        ...n.vertical ? { borderTop: `1px solid ${v}` } : { borderLeft: `1px solid ${v}` }
      };
    }), S = L(() => ({
      backgroundColor: n.palette.hoverBg,
      // padding: '5px',
      color: n.palette.hoverColor,
      [n.vertical ? "top" : "left"]: "-8px",
      [n.vertical ? "left" : "top"]: `${t.value + 10}px`
    }));
    ge(() => {
      s.value = n.value ?? 0;
    });
    function B(v) {
      const E = n.vertical ? v.clientY : v.clientX, M = s.value, P = (x) => {
        const R = ((n.vertical ? x.clientY : x.clientX) - E) / n.scale;
        s.value = Math.round(M + R), p("onMouseDown");
      };
      document.addEventListener("mousemove", P), document.addEventListener(
        "mouseup",
        () => {
          h.value || l(), document.removeEventListener("mousemove", P), p("onRelease", s.value, n.index);
        },
        { once: !0 }
      );
    }
    function l() {
      console.log("删除", n.index), p("onRemove", n.index);
    }
    const w = O(!1), f = (v) => {
      t.value = n.vertical ? v.offsetX : v.offsetY;
    }, y = L(() => `${n.vertical ? "Y" : "X"}：${s.value}`);
    return (v, E) => pe((V(), Q("div", {
      class: "line",
      style: D({ ...g.value, ...u.value }),
      onMouseenter: E[0] || (E[0] = (M) => w.value = !0),
      onMousemove: f,
      onMouseleave: E[1] || (E[1] = (M) => w.value = !1),
      onMousedown: B
    }, [
      F("div", {
        class: "action",
        style: D(S.value)
      }, [
        w.value ? (V(), Q("span", Te, Be(y.value), 1)) : Le("", !0)
      ], 4)
    ], 36)), [
      [he, h.value]
    ]);
  }
}), Re = (e, o) => {
  const t = e.__vccOpts || e;
  for (const [n, p] of o)
    t[n] = p;
  return t;
}, Fe = /* @__PURE__ */ Re(Ve, [["__scopeId", "data-v-8b266f1d"]]), De = (e) => e <= 0.25 ? 40 : e <= 0.5 ? 20 : e <= 1 ? 10 : e <= 2 ? 5 : e <= 4 ? 2 : 1, Ae = 0.83, Ke = (e, o, t, n, p, s) => {
  const { scale: h, width: g, height: u, ratio: S, palette: B } = p, { bgColor: l, fontColor: w, shadowColor: f, longfgColor: y } = B, v = s ? p.endNumX : p.endNumY;
  if (e.scale(S, S), e.clearRect(0, 0, g, u), e.fillStyle = l, e.fillRect(0, 0, g, u), n) {
    const R = (t - o) * h, c = n * h;
    e.fillStyle = f, s ? e.fillRect(R, 0, c, u * 3 / 8) : e.fillRect(0, R, g * 3 / 8, c);
  }
  const M = De(h) * 10, P = M * h, x = -o / M * P, U = o + Math.ceil((s ? g : u) / h);
  e.beginPath(), e.fillStyle = w, e.strokeStyle = y;
  for (let R = 0, c = 0; R < U; R += M, c++) {
    if (R <= v) {
      const b = x + c * P;
      R == 0 || R == v ? s ? e.moveTo(b, 0) : e.moveTo(0, b) : s ? e.moveTo(b, 20) : e.moveTo(20, b), e.save(), R == 0 ? s ? e.translate(b - 15, u * 0.3) : e.translate(g * 0.3, b - 5) : R == v ? s ? e.translate(b + 5, u * 0.1) : e.translate(g * 0.1, b + 32) : s ? e.translate(b - 12, u * 0.05) : e.translate(g * 0.05, b + 12), s || e.rotate(-Math.PI / 2), e.scale(Ae / S, Ae / S), e.fillText(R.toString(), 4 * S, 7 * S), e.restore(), R == 0 || R == v ? s ? e.lineTo(b, u) : e.lineTo(g, b) : s ? e.lineTo(b, u * 10 / 16) : e.lineTo(g * 10 / 16, b), console.log(b, "xBBBBBBBB");
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
  setup(e, { emit: o }) {
    const t = e, n = o, p = Me({
      canvasContext: null
    });
    let s = 1;
    const h = O(null);
    ge(() => {
      s = window.devicePixelRatio || 1, window.addEventListener("resize", g), u(), B(s);
    });
    const g = () => {
      s = window.devicePixelRatio || 1, B(s), l(s);
    }, u = () => {
      p.canvasContext = h.value && h.value.getContext("2d");
    }, S = L(() => ({
      [t.vertical ? "borderRight" : "borderBottom"]: `1px solid ${t.palette.borderColor || "#eeeeef"} `
    }));
    xe(() => {
      window.removeEventListener("resize", g);
    });
    const B = (f) => {
      if (h.value) {
        h.value.width = t.width * f, h.value.height = t.height * f;
        const y = p.canvasContext;
        y && (y.font = `${12 * f}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`, y.lineWidth = 1, y.textBaseline = "middle");
      }
    }, l = (f) => {
      console.log("drawRuler", t.scale);
      const y = {
        scale: t.scale,
        width: t.width,
        height: t.height,
        palette: t.palette,
        endNumX: t.endNumX,
        endNumY: t.endNumY,
        ratio: f
      };
      p.canvasContext && Ke(
        p.canvasContext,
        t.start,
        t.selectStart,
        t.selectLength,
        y,
        !t.vertical
      );
    };
    fe(
      () => t.start,
      () => {
        console.log("start", t.start), l(s);
      }
    ), fe([() => t.width, () => t.height], () => {
      B(s), l(s);
    });
    const w = (f, y) => {
      const v = t.vertical ? f.offsetY : f.offsetX, E = Math.round(t.start + v / t.scale);
      switch (y) {
        case "click":
          n("onAddLine", E);
          break;
        case "enter":
          n("update:valueNum", E), n("update:showIndicator", !0);
          break;
        default:
          n("update:valueNum", E);
          break;
      }
    };
    return (f, y) => (V(), Q("canvas", {
      ref_key: "canvas",
      ref: h,
      class: "ruler",
      style: D(S.value),
      onClick: y[0] || (y[0] = (v) => w(v, "click")),
      onMouseenter: y[1] || (y[1] = (v) => w(v, "enter")),
      onMousemove: y[2] || (y[2] = (v) => w(v, "move")),
      onMouseleave: y[3] || (y[3] = (v) => f.$emit("update:showIndicator", !1))
    }, null, 36));
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
  setup(e, { emit: o }) {
    const t = e, n = O(!1), p = O(0), s = L(() => t.vertical ? "v-container" : "h-container"), h = L(() => {
      const l = {
        width: `calc(100% - ${t.thick}px)`,
        height: `${t.thick + 1}px`,
        left: `${t.thick}px`
      }, w = {
        width: `${t.thick && t.thick + 1}px`,
        height: `calc(100% - ${t.thick}px)`,
        top: `${t.thick}px`
      };
      return t.vertical ? w : l;
    }), g = L(() => {
      var v;
      const l = (p.value - t.start) * t.scale;
      let w = t.vertical ? "top" : "left", f = t.vertical ? "left" : "top", y = t.vertical ? "borderBottom" : "borderLeft";
      return {
        [w]: l + "px",
        [f]: t.thick + "px",
        [y]: `1px solid ${(v = t.palette) == null ? void 0 : v.lineColor}`
      };
    }), u = (l) => {
      t.lines.push(l);
    }, S = (l, w) => {
      const f = l - t.start, y = (t.vertical ? t.height : t.width) / t.scale;
      f < 0 || f > y ? B(w) : t.lines[w] = l;
    }, B = (l) => {
      t.lines.splice(l, 1);
    };
    return (l, w) => (V(), Q("div", {
      class: ze(s.value),
      style: D(h.value)
    }, [
      me(Qe, {
        vertical: l.vertical,
        scale: l.scale,
        width: l.width,
        height: l.height,
        start: l.start,
        ratio: l.ratio,
        endNumX: l.endNumX,
        startNumY: l.startNumY,
        endNumY: l.endNumY,
        "select-start": l.selectStart,
        "select-length": l.selectLength,
        palette: l.palette,
        valueNum: p.value,
        "onUpdate:valueNum": w[0] || (w[0] = (f) => p.value = f),
        showIndicator: n.value,
        "onUpdate:showIndicator": w[1] || (w[1] = (f) => n.value = f),
        onOnAddLine: u
      }, null, 8, ["vertical", "scale", "width", "height", "start", "ratio", "endNumX", "startNumY", "endNumY", "select-start", "select-length", "palette", "valueNum", "showIndicator"]),
      pe(F("div", qe, [
        (V(!0), Q(Pe, null, Ie(l.lines, (f, y) => (V(), Ue(Fe, {
          key: f + y,
          index: y,
          value: f >> 0,
          scale: l.scale,
          start: l.start,
          thick: l.thick,
          palette: l.palette,
          vertical: l.vertical,
          "is-show-refer-line": l.isShowReferLine,
          onOnRemove: B,
          onOnRelease: S
        }, null, 8, ["index", "value", "scale", "start", "thick", "palette", "vertical", "is-show-refer-line"]))), 128))
      ], 512), [
        [he, l.isShowReferLine]
      ]),
      pe(F("div", {
        class: "indicator",
        style: D(g.value)
      }, [
        F("div", We, Be(p.value), 1)
      ], 4), [
        [he, n.value]
      ])
    ], 6));
  }
}), Ne = /* @__PURE__ */ Re(Ze, [["__scopeId", "data-v-41d371f8"]]), je = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAopJREFUOE/FlE9IVEEcx7+/N9ouds1Mu0QUSFZYdIgoUqQoKPBQHsKozpXE7jbTO/U8xLJvn6usBHWQ6hBFXupSkQeVbh0KJEPp0sH+eLGTsKs77xcj78m0ax0E8cHjzZv5zef3/c33xxA24KENYGJzoEEQbNNaN4Zh2OQ4znwYhr9c1/39vwrXVDo0NNS0tLR0GYB5D64BmAMwzMyvlFKz1es10Hw+f4mZ7wHYBeA9gNdENFepVOaEEM3M3OI4Thczn41gt6WUgQ3+C+r7/h0AWQD3mXnYqPA8L9nQ0HCemduIaFpKOWoAhUJhT6VSuQXgOjP3K6W8GLwKzeVyp4jonR0QBEErM48w8zFLyayUsjX+z+VyHhHdZebTSqkxM78CHRgYOKS1/ghgVErZY214RkQ7ADyRUj72ff8qgCtmXUrZGcf5vv8CwEUhxOF0Ov1pBRpla5dSdseBhUJhpznH6tIsZb1KqacW+BGArUaUXX63UuplHJTNZjuEEONSyhozfd/n6mQ1RkXZL2itz7mu+80EDA4ONi8vL/8AcM2UbikyR2BU9cSmmTU70YqKIAj2hWFo2uenlHK/BRg3Y2aeNO5GyU8S0ZbFxcUuz/NKEXAGQKPjOCcymcyX1dIi8DSAiWQyeaavr68cbSgCuBknYubnQoj+TCYzUywWE6VS6S2ADsdx2gxw1X3L7SNENMbMnwE8qK+vf5NKpRaMaeVyeW8ikfiaSqW+R7BuZr5BRMe11p2u607U9Gk8kc/ntzPzQwCmExYATDLzVBiGE0KIowAOADDf3QA+aK2VDaxRajto3K+rq+tl5nYAzQBamHmeiOYBTGmtR6ph/1Rqg9c73pz7dD1qN0TpHyNQRCUDJXrAAAAAAElFTkSuQmCC", He = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAjtJREFUOE/NlD9oFEEUxn9v9ghC0hpRUogIAUmniGAT/5Q2FrETPSNRJILg7RwimI0ox85eQFCEBGIUO1PYpFM0jSConQoBEZGgGPsgl+w+2eM2bC57SopAFqYZ3v7m+977ZoQt+GQLmGxPaBiGgYiMWWvXBHZUGoZhH3BERPYC+4F+4Keq/urt7b1RLpf/ZEBVHa9Wq0HWyg3QKIoGVPU8cA7wgK/pUtXPQJ8xZk+pVBpuNBqXUoUiEvi+P56fzTpo6+SbwHNg1lo7WzTITGEKXFlZeeB53tVCpa3CK8AFa+1cBgvD8LKIXAQOJkkyICJDeYVBEJS6u7s/qeoLa+1o+l9TqXNuBLhmjDlbqVQ+5ICjInIfOBPH8W9jzGCR5YmJiRNxHM+papgqzqDvgSlr7VTernPuO3An3c9bBt74vv+yrdaKyLDv+/1Sq9UGPc97nY9EVuycU2AQOA7cAm4Dr4D5TvVxHB9rKo2iaEFVp621Ln96FEUngaOqGmSxabVqsh3a2h+x1h5qQjNrae/yE4+iaCwDJkky73neTuBZe129Xk+H+BS4l7ZqLVIZ2BhzuFKpvMsDVXXWGPMxFdAedOfcKeCRqj7MYrUhpz09PfXl5eXrectFWXXODQHpOq2qd/95o/JXr6ura3J1dXU6SZIfwKKIHAD2tVYMPBGRx77vN10UXtO85fTkmZmZHUtLSzUR2QXsBhaAL6r6DXhbrVYXi1yss59GqOgub/bN3Z7v6X/tb9Zmp/q/kN8s+lJb8oEAAAAASUVORK5CYII=", Je = {
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
/*!simple-panzoom v1.0.22024年7月Wed Jul 10 2024 21:12:39 GMT+0800 (中国标准时间)制作*/
typeof window < "u" && (window.NodeList && !NodeList.prototype.forEach && (NodeList.prototype.forEach = Array.prototype.forEach), typeof window.CustomEvent != "function" && (window.CustomEvent = function(e, o) {
  o = o || { bubbles: !1, cancelable: !1, detail: null };
  var t = document.createEvent("CustomEvent");
  return t.initCustomEvent(e, o.bubbles, o.cancelable, o.detail), t;
}));
function Xe(e, o) {
  let t = e.length;
  for (; t--; )
    if (e[t].pointerId === o.pointerId)
      return t;
  return -1;
}
function ve(e, o) {
  let t;
  if (o.touches) {
    t = 0;
    for (const n of o.touches)
      n.pointerId = t++, ve(e, n);
    return;
  }
  t = Xe(e, o), t > -1 && e.splice(t, 1), e.push(o);
}
function _e(e, o) {
  if (o.touches) {
    for (; e.length; )
      e.pop();
    return;
  }
  const t = Xe(e, o);
  t > -1 && e.splice(t, 1);
}
function Se(e) {
  e = e.slice(0);
  let o = e.pop(), t;
  for (; t = e.pop(); )
    o = {
      clientX: (t.clientX - o.clientX) / 2 + o.clientX,
      clientY: (t.clientY - o.clientY) / 2 + o.clientY
    };
  return o;
}
function ce(e) {
  if (e.length < 2)
    return 0;
  const o = e[0], t = e[1];
  return Math.sqrt(
    Math.pow(Math.abs(t.clientX - o.clientX), 2) + Math.pow(Math.abs(t.clientY - o.clientY), 2)
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
function ue(e, o, t, n) {
  W[e].split(" ").forEach((p) => {
    o.addEventListener(
      p,
      t,
      n
    );
  });
}
function de(e, o, t) {
  W[e].split(" ").forEach((n) => {
    o.removeEventListener(n, t);
  });
}
const et = typeof document < "u" && !!document.documentMode;
let Ce;
function tt() {
  return Ce || (Ce = document.createElement("div").style);
}
const Ee = ["webkit", "moz", "ms"], j = {};
function we(e) {
  if (j[e])
    return j[e];
  const o = tt();
  if (e in o)
    return j[e] = e;
  const t = e[0].toUpperCase() + e.slice(1);
  let n = Ee.length;
  for (; n--; ) {
    const p = `${Ee[n]}${t}`;
    if (p in o)
      return j[e] = p;
  }
}
function H(e, o) {
  return parseFloat(o[we(e)]) || 0;
}
function J(e, o, t = window.getComputedStyle(e)) {
  const n = o === "border" ? "Width" : "";
  return {
    left: H(`${o}Left${n}`, t),
    right: H(`${o}Right${n}`, t),
    top: H(`${o}Top${n}`, t),
    bottom: H(`${o}Bottom${n}`, t)
  };
}
function K(e, o, t) {
  e.style[we(o)] = t;
}
function ot(e, o) {
  const t = we("transform");
  K(e, "transition", `${t} ${o.duration}ms ${o.easing}`);
}
function nt(e, { x: o, y: t, scale: n, isSVG: p }, s) {
  if (K(e, "transform", `scale(${n}) translate(${o}px, ${t}px)`), p && et) {
    const h = window.getComputedStyle(e).getPropertyValue("transform");
    e.setAttribute("transform", h);
  }
}
function _(e) {
  const o = e.parentNode, t = window.getComputedStyle(e), n = window.getComputedStyle(o), p = e.getBoundingClientRect(), s = o.getBoundingClientRect();
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
      style: n,
      width: s.width,
      height: s.height,
      top: s.top,
      bottom: s.bottom,
      left: s.left,
      right: s.right,
      padding: J(o, "padding", n),
      border: J(o, "border", n)
    }
  };
}
function rt(e) {
  let o = e;
  for (; o && o.parentNode; ) {
    if (o.parentNode === document) return !0;
    o = o.parentNode instanceof ShadowRoot ? o.parentNode.host : o.parentNode;
  }
  return !1;
}
function at(e) {
  return (e.getAttribute("class") || "").trim();
}
function lt(e, o) {
  return e.nodeType === 1 && ` ${at(e)} `.indexOf(` ${o} `) > -1;
}
function it(e, o) {
  for (let t = e; t != null; t = t.parentNode)
    if (lt(t, o.excludeClass) || o.exclude.indexOf(t) > -1)
      return !0;
  return !1;
}
const st = /^http:[\w\.\/]+svg$/;
function ct(e) {
  return st.test(e.namespaceURI) && e.nodeName.toLowerCase() !== "svg";
}
function ut(e) {
  const o = {};
  for (const t in e)
    e.hasOwnProperty(t) && (o[t] = e[t]);
  return o;
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
  setTransform: nt,
  startX: 0,
  startY: 0,
  startScale: 1,
  step: 0.3,
  touchAction: "none"
};
function Oe(e, o) {
  if (!e)
    throw new Error("Panzoom requires an element as an argument");
  if (e.nodeType !== 1)
    throw new Error("Panzoom requires an element with a nodeType of 1");
  if (!rt(e))
    throw new Error(
      "Panzoom should be called on elements that have been attached to the DOM"
    );
  o = {
    ...ke,
    ...o
  };
  const t = ct(e), n = e.parentNode;
  n.style.overflow = o.overflow, n.style.userSelect = "none", n.style.touchAction = o.touchAction, (o.canvas ? n : e).style.cursor = o.cursor, e.style.userSelect = "none", e.style.touchAction = o.touchAction, K(
    e,
    "transformOrigin",
    typeof o.origin == "string" ? o.origin : t ? "0 0" : "50% 50%"
  );
  function p() {
    n.style.overflow = "", n.style.userSelect = "", n.style.touchAction = "", n.style.cursor = "", e.style.cursor = "", e.style.userSelect = "", e.style.touchAction = "", K(e, "transformOrigin", "");
  }
  function s(r = {}) {
    for (const i in r)
      r.hasOwnProperty(i) && (o[i] = r[i]);
    (r.hasOwnProperty("cursor") || r.hasOwnProperty("canvas")) && (n.style.cursor = e.style.cursor = "", (o.canvas ? n : e).style.cursor = o.cursor), r.hasOwnProperty("overflow") && (n.style.overflow = r.overflow), r.hasOwnProperty("touchAction") && (n.style.touchAction = r.touchAction, e.style.touchAction = r.touchAction);
  }
  let h = 0, g = 0, u = 1, S = !1;
  v(o.startScale, { animate: !1, force: !0 }), setTimeout(() => {
    y(o.startX, o.startY, { animate: !1, force: !0 });
  });
  function B(r, i, m) {
    if (m.silent)
      return;
    const N = new CustomEvent(r, { detail: i });
    e.dispatchEvent(N);
  }
  function l(r, i, m) {
    const N = { x: h, y: g, scale: u, isSVG: t, originalEvent: m };
    typeof i.animate == "boolean" && (i.animate ? ot(e, i) : K(e, "transition", "none")), i.setTransform(e, N, i);
    function a() {
      const A = _(e);
      N.dimsOut = A, B(r, N, i), B("panzoomchange", N, i);
    }
    return i.animate ? setTimeout(() => {
      a();
    }, i.duration + 50) : requestAnimationFrame(() => {
      a();
    }), N;
  }
  function w(r, i, m, N) {
    const a = { ...o, ...N }, A = { x: h, y: g, opts: a };
    if (!a.force && (a.disablePan || a.panOnlyWhenZoomed && u === a.startScale))
      return A;
    if (r = parseFloat(r), i = parseFloat(i), a.disableXAxis || (A.x = (a.relative ? h : 0) + r), a.disableYAxis || (A.y = (a.relative ? g : 0) + i), a.contain) {
      const d = _(e), z = d.elem.width / u, Y = d.elem.height / u, G = z * m, q = Y * m, $ = (G - z) / 2, T = (q - Y) / 2;
      if (a.contain === "inside") {
        const ae = (-d.elem.margin.left - d.parent.padding.left + $) / m, le = (d.parent.width - G - d.parent.padding.left - d.elem.margin.left - d.parent.border.left - d.parent.border.right + $) / m;
        A.x = Math.max(Math.min(A.x, le), ae);
        const ie = (-d.elem.margin.top - d.parent.padding.top + T) / m, se = (d.parent.height - q - d.parent.padding.top - d.elem.margin.top - d.parent.border.top - d.parent.border.bottom + T) / m;
        A.y = Math.max(Math.min(A.y, se), ie);
      } else if (a.contain === "outside") {
        const ae = (-(G - d.parent.width) - d.parent.padding.left - d.parent.border.left - d.parent.border.right + $) / m, le = ($ - d.parent.padding.left) / m;
        A.x = Math.max(Math.min(A.x, le), ae);
        const ie = (-(q - d.parent.height) - d.parent.padding.top - d.parent.border.top - d.parent.border.bottom + T) / m, se = (T - d.parent.padding.top) / m;
        A.y = Math.max(Math.min(A.y, se), ie);
      }
    }
    return a.roundPixels && (A.x = Math.round(A.x), A.y = Math.round(A.y)), A;
  }
  function f(r, i) {
    const m = { ...o, ...i }, N = { scale: u, opts: m };
    if (!m.force && m.disableZoom)
      return N;
    let a = o.minScale, A = o.maxScale;
    if (m.contain) {
      const d = _(e), z = d.elem.width / u, Y = d.elem.height / u;
      if (z > 1 && Y > 1) {
        const G = d.parent.width - d.parent.border.left - d.parent.border.right, q = d.parent.height - d.parent.border.top - d.parent.border.bottom, $ = G / z, T = q / Y;
        o.contain === "inside" ? A = Math.min(A, $, T) : o.contain === "outside" && (a = Math.max(a, $, T));
      }
    }
    return N.scale = Math.min(Math.max(r, a), A), N;
  }
  function y(r, i, m, N) {
    const a = w(r, i, u, m);
    return h !== a.x || g !== a.y ? (h = a.x, g = a.y, l("panzoompan", a.opts, N)) : { x: h, y: g, scale: u, isSVG: t, originalEvent: N };
  }
  function v(r, i, m) {
    const N = f(r, i), a = N.opts;
    if (!a.force && a.disableZoom)
      return;
    r = N.scale;
    let A = h, d = g;
    if (a.focal) {
      const Y = a.focal;
      A = (Y.x / r - Y.x / u + h * r) / r, d = (Y.y / r - Y.y / u + g * r) / r;
    }
    const z = w(A, d, r, {
      relative: !1,
      force: !0
    });
    return h = z.x, g = z.y, u = r, l("panzoomzoom", a, m);
  }
  function E(r, i) {
    const m = { ...o, animate: !0, ...i };
    return v(u * Math.exp((r ? 1 : -1) * m.step), m);
  }
  function M(r) {
    return E(!0, r);
  }
  function P(r) {
    return E(!1, r);
  }
  function x(r, i, m, N) {
    const a = _(e), A = {
      width: a.parent.width - a.parent.padding.left - a.parent.padding.right - a.parent.border.left - a.parent.border.right,
      height: a.parent.height - a.parent.padding.top - a.parent.padding.bottom - a.parent.border.top - a.parent.border.bottom
    };
    let d = i.clientX - a.parent.left - a.parent.padding.left - a.parent.border.left - a.elem.margin.left, z = i.clientY - a.parent.top - a.parent.padding.top - a.parent.border.top - a.elem.margin.top;
    t || (d -= a.elem.width / u / 2, z -= a.elem.height / u / 2);
    const Y = {
      x: d / A.width * (A.width * r),
      y: z / A.height * (A.height * r)
    };
    return v(
      r,
      { ...m, animate: !1, focal: Y },
      N
    );
  }
  function U(r, i) {
    r.preventDefault();
    const m = { ...o, ...i, animate: !1 }, N = (r.deltaY === 0 && r.deltaX ? r.deltaX : r.deltaY) < 0 ? 1 : -1, a = f(
      u * Math.exp(N * m.step / 3),
      m
    ).scale;
    return x(a, r, m, r);
  }
  function R(r) {
    const i = { ...o, animate: !0, force: !0, ...r };
    u = f(i.startScale, i).scale;
    const m = w(i.startX, i.startY, u, i);
    return h = m.x, g = m.y, l("panzoomreset", i);
  }
  let c, b, C, k, X, Z;
  const I = [];
  function te(r) {
    if (it(r.target, o))
      return;
    ve(I, r), S = !0, o.handleStartEvent(r), c = h, b = g, B(
      "panzoomstart",
      { x: h, y: g, scale: u, isSVG: t, originalEvent: r },
      o
    );
    const i = Se(I);
    C = i.clientX, k = i.clientY, X = u, Z = ce(I);
  }
  function oe(r) {
    if (!S || c === void 0 || b === void 0 || C === void 0 || k === void 0)
      return;
    ve(I, r);
    const i = Se(I), m = I.length > 1;
    let N = u;
    if (m) {
      Z === 0 && (Z = ce(I));
      const a = ce(I) - Z;
      N = f(a * o.step / 80 + X).scale, x(N, i, { animate: !1 }, r);
    }
    (!m || o.pinchAndPan) && y(
      c + (i.clientX - C) / N,
      b + (i.clientY - k) / N,
      {
        animate: !1
      },
      r
    );
  }
  function ne(r) {
    I.length === 1 && B(
      "panzoomend",
      { x: h, y: g, scale: u, isSVG: t, originalEvent: r },
      o
    ), _e(I, r), S && (S = !1, c = b = C = k = void 0);
  }
  let re = !1;
  function ye() {
    re || (re = !0, ue("down", o.canvas ? n : e, te), ue("move", document, oe, { passive: !0 }), ue("up", document, ne, { passive: !0 }));
  }
  function Ye() {
    re = !1, de("down", o.canvas ? n : e, te), de("move", document, oe), de("up", document, ne);
  }
  return o.noBind || ye(), {
    bind: ye,
    destroy: Ye,
    eventNames: W,
    getPan: () => ({ x: h, y: g }),
    getScale: () => u,
    getOptions: () => ut(o),
    handleDown: te,
    handleMove: oe,
    handleUp: ne,
    pan: y,
    reset: R,
    resetStyle: p,
    setOptions: s,
    setStyle: (r, i) => K(e, r, i),
    zoom: v,
    zoomIn: M,
    zoomOut: P,
    zoomToPoint: x,
    zoomWithWheel: U
  };
}
Oe.defaultOptions = ke;
const dt = { class: "sketch-ruler" }, pt = { class: "canvasedit" }, ft = /* @__PURE__ */ ee({
  __name: "index",
  props: Je,
  emits: ["onCornerClick", "update:scale"],
  setup(e, { expose: o, emit: t }) {
    const n = e, p = t, s = O(null), h = O(0), g = O(0), u = O(0), S = O(0), B = O(1), l = O(n.isShowReferLine), w = O(null), f = L(() => {
      function c(C, k) {
        return Object.keys(C).forEach((X) => {
          X && C.hasOwnProperty(X) && (typeof k[X] == "object" ? C[X] = c(C[X], k[X]) : k.hasOwnProperty(X) && (C[X] = k[X]));
        }), C;
      }
      return c(
        {
          bgColor: "#f6f7f9",
          // ruler bg color
          // bgColor: '#18181c',
          longfgColor: "#BABBBC",
          // ruler longer mark color
          fontColor: "#7D8694",
          // ruler font color
          shadowColor: "#E8E8E8",
          // ruler shadow color
          lineColor: "#EB5648",
          hoverBg: "#000",
          hoverColor: "#fff",
          borderColor: "#eeeeef",
          // backgroundImage:
          //   'linear-gradient(#18181c 14px, transparent 0), linear-gradient(90deg, transparent 14px, #86909c 0)',
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
        n.palette || {}
      );
    }), y = L(() => ({
      backgroundImage: l.value ? `url(${n.eyeIcon || je})` : `url(${n.closeEyeIcon || He})`,
      width: n.thick + "px",
      height: n.thick + "px",
      borderRight: `1px solid ${f.value.borderColor}`,
      borderBottom: `1px solid ${f.value.borderColor}`
    })), v = L(() => ({
      backgroundColor: f.value.bgColor,
      backgroundImage: f.value.backgroundImage,
      width: n.width + "px",
      height: n.height + "px"
    }));
    ge(() => {
      E();
    });
    const E = () => {
      s.value = document.querySelector(".canvasedit"), M(), w.value = Oe(s.value, {
        noBind: !0,
        startScale: n.scale,
        cursor: "default",
        startX: u.value,
        startY: S.value,
        // contain: 'inside',
        smoothScroll: !0,
        ...n.panzoomOption
      }), s.value.addEventListener("panzoomchange", (c) => {
        const { scale: b, dimsOut: C } = c.detail;
        if (C) {
          console.log(c.detail, "event.detail"), p("update:scale", b), B.value = b;
          const k = (C.parent.left - C.elem.left) / b, X = (C.parent.top - C.elem.top) / b;
          h.value = k, console.log(h.value * b, "startX.value"), console.log(b, "scale"), g.value = X;
        }
      }), parent.addEventListener("wheel", function(c) {
        (c.ctrlKey || c.metaKey) && w.value.zoomWithWheel(c);
      }), parent.addEventListener("keydown", function(c) {
        c.key === " " && w.value.bind();
      }), parent.addEventListener("keyup", function(c) {
        c.key === " " && w.value.destroy();
      });
    }, M = () => {
      const b = document.querySelector(".canvasedit-parent").getBoundingClientRect(), C = s.value.children[0].getBoundingClientRect(), { width: k, height: X } = b;
      k > C.width ? (u.value = (k - n.thick - C.width) / 2, X > C.height ? S.value = (X - n.thick - C.height) / 2 : S.value = 0) : (S.value = 0, u.value = 0);
    }, P = () => {
      w.value.reset();
    }, x = () => {
      w.value.zoomIn();
    }, U = () => {
      w.value.zoomOut();
    }, R = () => {
      l.value = !l.value, p("onCornerClick", l.value);
    };
    return fe([() => n.isShowReferLine], () => {
      l.value = n.isShowReferLine;
    }), o({
      initPanzoom: E,
      panzoomInstance: w,
      reset: P,
      zoomIn: x,
      zoomOut: U
    }), (c, b) => (V(), Q("div", dt, [
      be(c.$slots, "btn", {
        reset: P,
        zoomIn: x,
        zoomOut: U
      }),
      F("div", {
        class: "canvasedit-parent",
        style: D(v.value),
        onWheel: b[0] || (b[0] = $e(() => {
        }, ["prevent"]))
      }, [
        F("div", pt, [
          be(c.$slots, "default")
        ])
      ], 36),
      me(Ne, {
        vertical: !1,
        width: c.width,
        height: c.thick,
        "is-show-refer-line": l.value,
        thick: c.thick,
        ratio: c.ratio,
        start: h.value,
        lines: c.lines.h,
        "select-start": c.shadow.x,
        "select-length": c.shadow.width,
        scale: B.value,
        palette: f.value,
        endNumX: c.endNumX
      }, null, 8, ["width", "height", "is-show-refer-line", "thick", "ratio", "start", "lines", "select-start", "select-length", "scale", "palette", "endNumX"]),
      me(Ne, {
        vertical: !0,
        width: c.thick,
        height: c.height,
        "is-show-refer-line": l.value,
        thick: c.thick,
        ratio: c.ratio,
        start: g.value,
        lines: c.lines.v,
        "select-start": c.shadow.y,
        "select-length": c.shadow.height,
        scale: B.value,
        palette: f.value,
        endNumY: c.endNumY
      }, null, 8, ["width", "height", "is-show-refer-line", "thick", "ratio", "start", "lines", "select-start", "select-length", "scale", "palette", "endNumY"]),
      F("a", {
        class: "corner",
        style: D(y.value),
        onClick: R
      }, null, 4)
    ]));
  }
});
export {
  ft as SketchRule,
  ft as default
};
