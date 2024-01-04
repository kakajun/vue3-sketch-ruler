import { defineComponent as L, ref as S, onMounted as P, computed as N, reactive as q, watch as O } from "vue-demi";
import { withDirectives as I, openBlock as R, createElementBlock as X, normalizeStyle as B, createElementVNode as w, toDisplayString as G, vShow as U, resolveComponent as D, normalizeClass as Z, createVNode as V, Fragment as j, renderList as J, createBlock as _ } from "vue";
/*!vue3-sketch-ruler v1.3.112024年1月Thu Jan 04 2024 13:52:32 GMT+0800 (中国标准时间)制作*/
const Y = (e, t) => {
  const r = e.__vccOpts || e;
  for (const [s, i] of t)
    r[s] = i;
  return r;
}, x = L({
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
  setup(e, { emit: t }) {
    const r = S(0), s = S(!0);
    P(() => {
      r.value = e.value;
    });
    const i = (n) => {
      s.value = n >= 0;
    }, u = N(() => {
      const n = (r.value - e.start) * e.scale;
      i(n);
      const c = n + "px";
      return e.vertical ? { top: c } : { left: c };
    }), o = N(() => {
      var f;
      const n = `1px solid ${(f = e.palette) == null ? void 0 : f.lineColor}`, c = e.vertical ? { borderTop: n } : { borderLeft: n };
      return {
        cursor: e.isShowReferLine ? e.vertical ? "ns-resize" : "ew-resize" : "none",
        ...c
      };
    }), d = N(() => e.vertical ? { left: e.thick + "px" } : { top: e.thick + "px" });
    return {
      startValue: r,
      showLine: s,
      offset: u,
      borderCursor: o,
      actionStyle: d,
      handleDown: (n) => {
        const c = e.vertical ? n.clientY : n.clientX, h = r.value;
        t("onMouseDown");
        const f = (A) => {
          const b = e.vertical ? A.clientY : A.clientX, k = Math.round(h + (b - c) / e.scale);
          r.value = k;
        }, g = () => {
          t("onRelease", r.value, e.index), document.removeEventListener("mousemove", f), document.removeEventListener("mouseup", g);
        };
        document.addEventListener("mousemove", f), document.addEventListener("mouseup", g);
      },
      handleRemove: () => {
        t("onRemove", e.index);
      }
    };
  }
}), ee = { class: "value" };
function te(e, t, r, s, i, u) {
  return I((R(), X("div", {
    class: "line",
    style: B([e.offset, e.borderCursor]),
    onMousedown: t[1] || (t[1] = (...o) => e.handleDown && e.handleDown(...o))
  }, [
    w("div", {
      class: "action",
      style: B(e.actionStyle)
    }, [
      w("span", {
        class: "del",
        onClick: t[0] || (t[0] = (...o) => e.handleRemove && e.handleRemove(...o))
      }, "×"),
      w("span", ee, G(e.startValue), 1)
    ], 4)
  ], 36)), [
    [U, e.showLine]
  ]);
}
const ne = /* @__PURE__ */ Y(x, [["render", te], ["__scopeId", "data-v-f4f0a646"]]), ae = (e) => e <= 0.25 ? 40 : e <= 0.5 ? 20 : e <= 1 ? 10 : e <= 2 ? 5 : e <= 4 ? 2 : 1, M = 0.83, oe = (e, t, r, s, i, u) => {
  const { scale: o, width: d, height: l, ratio: a, palette: n } = i, { bgColor: c, fontColor: h, shadowColor: f, longfgColor: g, shortfgColor: A } = n;
  console.log(t, "startstart");
  const b = u ? i.startNumX : i.startNumY, k = u ? i.endNumX : i.endNumY;
  if (e.scale(a, a), e.clearRect(0, 0, d, l), e.fillStyle = c, e.fillRect(0, 0, d, l), s) {
    const v = (r - t) * o, p = s * o;
    e.fillStyle = f, u ? e.fillRect(v, 0, p, l * 3 / 8) : e.fillRect(0, v, d * 3 / 8, p);
  }
  const C = ae(o), $ = C * o, y = C * 10, Q = y * o, T = Math.floor(t / C) * C, F = Math.floor(t / y) * y, H = (T - t) / C * $, W = (F - t) / y * Q, K = t + Math.ceil((u ? d : l) / o);
  e.beginPath(), e.fillStyle = h, e.strokeStyle = g;
  for (let v = F, p = 0; v < K; v += y, p++) {
    if (v >= b && v <= k) {
      const m = W + p * Q + 0.5;
      u ? e.moveTo(m, 0) : e.moveTo(0, m), e.save(), u ? e.translate(m, l * 0.4) : e.translate(d * 0.4, m), u || e.rotate(-Math.PI / 2), e.scale(M / a, M / a), e.fillText(v.toString(), 4 * a, 7 * a), e.restore(), u ? e.lineTo(m, l * 9 / 16) : e.lineTo(d * 9 / 16, m);
    }
    e.stroke(), e.closePath(), e.beginPath(), e.strokeStyle = A;
    for (let m = T, z = 0; m < K; m += C, z++)
      if (m >= b && m <= k) {
        const E = H + z * $ + 0.5;
        u ? e.moveTo(E, 0) : e.moveTo(0, E), m % y !== 0 && (u ? e.lineTo(E, l * 1 / 4) : e.lineTo(d * 1 / 4, E));
      }
    e.stroke(), e.closePath(), e.setTransform(1, 0, 0, 1, 0, 0);
  }
}, re = L({
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
  setup(e, { emit: t }) {
    const r = q({
      canvasContext: null
    });
    let s = 1;
    const i = S(null);
    P(() => {
      s = e.ratio || window.devicePixelRatio || 1, u(), o(s), d(s);
    });
    const u = () => {
      r.canvasContext = i.value && i.value.getContext("2d");
    }, o = (a) => {
      if (i.value) {
        i.value.width = e.width * a, i.value.height = e.height * a;
        const n = r.canvasContext;
        n && (n.font = `${12 * a}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`, n.lineWidth = 1, n.textBaseline = "middle");
      }
    }, d = (a) => {
      const n = {
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
      r.canvasContext && oe(
        r.canvasContext,
        e.start,
        e.selectStart,
        e.selectLength,
        n,
        !e.vertical
      );
    };
    return O(
      () => e.start,
      () => d(s)
    ), O([() => e.width, () => e.height], () => {
      o(s), d(s);
    }), {
      handle: (a, n) => {
        const c = (g, A, b) => Math.round(A + g / b), h = e.vertical ? a.offsetY : a.offsetX, f = c(h, e.start, e.scale);
        switch (n) {
          case "click":
            t("onAddLine", f);
            break;
          case "enter":
            t("update:valueNum", f), t("update:showIndicator", !0);
            break;
          default:
            t("update:valueNum", f);
            break;
        }
      },
      canvas: i
    };
  }
});
function le(e, t, r, s, i, u) {
  return R(), X("canvas", {
    ref: "canvas",
    class: "ruler",
    onClick: t[0] || (t[0] = (o) => e.handle(o, "click")),
    onMouseenter: t[1] || (t[1] = (o) => e.handle(o, "enter")),
    onMousemove: t[2] || (t[2] = (o) => e.handle(o, "move")),
    onMouseleave: t[3] || (t[3] = (o) => e.$emit("update:showIndicator", !1))
  }, null, 544);
}
const se = /* @__PURE__ */ Y(re, [["render", le]]), ie = {
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
};
const ue = L({
  name: "RulerWrapper",
  components: {
    CanvasRuler: se,
    RulerLine: ne
  },
  props: ie,
  setup(e) {
    const t = S(!1), r = S(0), s = N(() => e.vertical ? "v-container" : "h-container"), i = N(() => {
      const a = {
        width: `calc(100% - ${e.thick}px)`,
        height: `${e.thick + 1}px`,
        left: `${e.thick}px`
      }, n = {
        width: `${e.thick && e.thick + 1}px`,
        height: `calc(100% - ${e.thick}px)`,
        top: `${e.thick}px`
      };
      return e.vertical ? n : a;
    }), u = N(() => {
      var h;
      const a = (r.value - e.start) * e.scale;
      let n = "top", c = "borderLeft";
      return n = e.vertical ? "top" : "left", c = e.vertical ? "borderBottom" : "borderLeft", {
        [n]: a + "px",
        [c]: `1px solid ${(h = e.palette) == null ? void 0 : h.lineColor}`
      };
    }), o = (a) => {
      e.lines.push(a);
    }, d = (a, n) => {
      const c = a - e.start, h = (e.vertical ? e.height : e.width) / e.scale;
      c < 0 || c > h ? l(n) : e.lines[n] = a;
    }, l = (a) => {
      e.lines.splice(a, 1);
    };
    return {
      showIndicator: t,
      valueNum: r,
      rwClassName: s,
      rwStyle: i,
      indicatorStyle: u,
      handleNewLine: o,
      handleLineRelease: d,
      handleLineRemove: l
    };
  }
}), de = { class: "lines" }, ce = { class: "value" };
function he(e, t, r, s, i, u) {
  const o = D("CanvasRuler"), d = D("RulerLine");
  return R(), X("div", {
    class: Z(e.rwClassName),
    style: B(e.rwStyle)
  }, [
    V(o, {
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
      palette: e.palette,
      valueNum: e.valueNum,
      "onUpdate:valueNum": t[0] || (t[0] = (l) => e.valueNum = l),
      showIndicator: e.showIndicator,
      "onUpdate:showIndicator": t[1] || (t[1] = (l) => e.showIndicator = l),
      onOnAddLine: e.handleNewLine
    }, null, 8, ["vertical", "scale", "width", "height", "start", "ratio", "startNumX", "endNumX", "startNumY", "endNumY", "select-start", "select-length", "palette", "valueNum", "showIndicator", "onOnAddLine"]),
    I(w("div", de, [
      (R(!0), X(j, null, J(e.lines, (l, a) => (R(), _(d, {
        key: l + a,
        index: a,
        value: l >> 0,
        scale: e.scale,
        start: e.start,
        thick: e.thick,
        palette: e.palette,
        vertical: e.vertical,
        "is-show-refer-line": e.isShowReferLine,
        onOnRemove: e.handleLineRemove,
        onOnRelease: e.handleLineRelease
      }, null, 8, ["index", "value", "scale", "start", "thick", "palette", "vertical", "is-show-refer-line", "onOnRemove", "onOnRelease"]))), 128))
    ], 512), [
      [U, e.isShowReferLine]
    ]),
    I(w("div", {
      class: "indicator",
      style: B(e.indicatorStyle)
    }, [
      w("div", ce, G(e.valueNum), 1)
    ], 4), [
      [U, e.showIndicator]
    ])
  ], 6);
}
const me = /* @__PURE__ */ Y(ue, [["render", he], ["__scopeId", "data-v-e34d9372"]]), fe = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAopJREFUOE/FlE9IVEEcx7+/N9ouds1Mu0QUSFZYdIgoUqQoKPBQHsKozpXE7jbTO/U8xLJvn6usBHWQ6hBFXupSkQeVbh0KJEPp0sH+eLGTsKs77xcj78m0ax0E8cHjzZv5zef3/c33xxA24KENYGJzoEEQbNNaN4Zh2OQ4znwYhr9c1/39vwrXVDo0NNS0tLR0GYB5D64BmAMwzMyvlFKz1es10Hw+f4mZ7wHYBeA9gNdENFepVOaEEM3M3OI4Thczn41gt6WUgQ3+C+r7/h0AWQD3mXnYqPA8L9nQ0HCemduIaFpKOWoAhUJhT6VSuQXgOjP3K6W8GLwKzeVyp4jonR0QBEErM48w8zFLyayUsjX+z+VyHhHdZebTSqkxM78CHRgYOKS1/ghgVErZY214RkQ7ADyRUj72ff8qgCtmXUrZGcf5vv8CwEUhxOF0Ov1pBRpla5dSdseBhUJhpznH6tIsZb1KqacW+BGArUaUXX63UuplHJTNZjuEEONSyhozfd/n6mQ1RkXZL2itz7mu+80EDA4ONi8vL/8AcM2UbikyR2BU9cSmmTU70YqKIAj2hWFo2uenlHK/BRg3Y2aeNO5GyU8S0ZbFxcUuz/NKEXAGQKPjOCcymcyX1dIi8DSAiWQyeaavr68cbSgCuBknYubnQoj+TCYzUywWE6VS6S2ADsdx2gxw1X3L7SNENMbMnwE8qK+vf5NKpRaMaeVyeW8ikfiaSqW+R7BuZr5BRMe11p2u607U9Gk8kc/ntzPzQwCmExYATDLzVBiGE0KIowAOADDf3QA+aK2VDaxRajto3K+rq+tl5nYAzQBamHmeiOYBTGmtR6ph/1Rqg9c73pz7dD1qN0TpHyNQRCUDJXrAAAAAAElFTkSuQmCC", ve = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAjtJREFUOE/NlD9oFEEUxn9v9ghC0hpRUogIAUmniGAT/5Q2FrETPSNRJILg7RwimI0ox85eQFCEBGIUO1PYpFM0jSConQoBEZGgGPsgl+w+2eM2bC57SopAFqYZ3v7m+977ZoQt+GQLmGxPaBiGgYiMWWvXBHZUGoZhH3BERPYC+4F+4Keq/urt7b1RLpf/ZEBVHa9Wq0HWyg3QKIoGVPU8cA7wgK/pUtXPQJ8xZk+pVBpuNBqXUoUiEvi+P56fzTpo6+SbwHNg1lo7WzTITGEKXFlZeeB53tVCpa3CK8AFa+1cBgvD8LKIXAQOJkkyICJDeYVBEJS6u7s/qeoLa+1o+l9TqXNuBLhmjDlbqVQ+5ICjInIfOBPH8W9jzGCR5YmJiRNxHM+papgqzqDvgSlr7VTernPuO3An3c9bBt74vv+yrdaKyLDv+/1Sq9UGPc97nY9EVuycU2AQOA7cAm4Dr4D5TvVxHB9rKo2iaEFVp621Ln96FEUngaOqGmSxabVqsh3a2h+x1h5qQjNrae/yE4+iaCwDJkky73neTuBZe129Xk+H+BS4l7ZqLVIZ2BhzuFKpvMsDVXXWGPMxFdAedOfcKeCRqj7MYrUhpz09PfXl5eXrectFWXXODQHpOq2qd/95o/JXr6ura3J1dXU6SZIfwKKIHAD2tVYMPBGRx77vN10UXtO85fTkmZmZHUtLSzUR2QXsBhaAL6r6DXhbrVYXi1yss59GqOgub/bN3Z7v6X/tb9Zmp/q/kN8s+lJb8oEAAAAASUVORK5CYII=", Ne = {
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
};
const we = L({
  name: "SketchRule",
  components: {
    RulerWrapper: me
  },
  props: Ne,
  emits: ["onCornerClick"],
  setup(e, { emit: t }) {
    let r = S(!0);
    r.value = e.isShowReferLine;
    const s = N(() => {
      function o(l, a) {
        return Object.keys(l).forEach((n) => {
          n && l.hasOwnProperty(n) && (typeof a.key == "object" ? l[n] = o(l[n], a[n]) : a.hasOwnProperty(n) && (l[n] = a[n]));
        }), l;
      }
      return o(
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
    }), i = N(() => ({
      backgroundImage: r.value ? `url(${e.eyeIcon || fe})` : `url(${e.closeEyeIcon || ve})`,
      width: e.thick + "px",
      height: e.thick + "px",
      borderRight: `1px solid ${s.value.borderColor}`,
      borderBottom: `1px solid ${s.value.borderColor}`
    })), u = (o) => {
      r.value = !r.value, t("onCornerClick", r.value);
    };
    return O([() => e.isShowReferLine], () => {
      r.value = e.isShowReferLine;
    }), {
      showReferLine: r,
      paletteCpu: s,
      cornerStyle: i,
      onCornerClick: u
    };
  }
}), ge = {
  id: "mb-ruler",
  class: "style-ruler mb-ruler"
};
function Ae(e, t, r, s, i, u) {
  const o = D("RulerWrapper");
  return R(), X("div", ge, [
    V(o, {
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
    }, null, 8, ["width", "height", "is-show-refer-line", "thick", "ratio", "start", "lines", "select-start", "select-length", "scale", "palette", "startNumX", "endNumX"]),
    V(o, {
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
    }, null, 8, ["width", "height", "is-show-refer-line", "thick", "ratio", "start", "lines", "select-start", "select-length", "scale", "palette", "startNumY", "endNumY"]),
    w("a", {
      class: "corner",
      style: B(e.cornerStyle),
      onClick: t[0] || (t[0] = (...d) => e.onCornerClick && e.onCornerClick(...d))
    }, null, 4)
  ]);
}
const ye = /* @__PURE__ */ Y(we, [["render", Ae]]);
export {
  ye as SketchRule,
  ye as default
};
