/*!simple-panzoom v1.0.12024年6月Tue Jun 25 2024 20:53:27 GMT+0800 (中国标准时间)制作*/
typeof window < "u" && (window.NodeList && !NodeList.prototype.forEach && (NodeList.prototype.forEach = Array.prototype.forEach), typeof window.CustomEvent != "function" && (window.CustomEvent = function(e, r) {
  r = r || { bubbles: !1, cancelable: !1, detail: null };
  var c = document.createEvent("CustomEvent");
  return c.initCustomEvent(e, r.bubbles, r.cancelable, r.detail), c;
}));
function ct(t, e) {
  let r = t.length;
  for (; r--; )
    if (t[r].pointerId === e.pointerId)
      return r;
  return -1;
}
function tt(t, e) {
  let r;
  if (e.touches) {
    r = 0;
    for (const c of e.touches)
      c.pointerId = r++, tt(t, c);
    return;
  }
  r = ct(t, e), r > -1 && t.splice(r, 1), t.push(e);
}
function pt(t, e) {
  if (e.touches) {
    for (; t.length; )
      t.pop();
    return;
  }
  const r = ct(t, e);
  r > -1 && t.splice(r, 1);
}
function it(t) {
  t = t.slice(0);
  let e = t.pop(), r;
  for (; r = t.pop(); )
    e = {
      clientX: (r.clientX - e.clientX) / 2 + e.clientX,
      clientY: (r.clientY - e.clientY) / 2 + e.clientY
    };
  return e;
}
function _(t) {
  if (t.length < 2)
    return 0;
  const e = t[0], r = t[1];
  return Math.sqrt(
    Math.pow(Math.abs(r.clientX - e.clientX), 2) + Math.pow(Math.abs(r.clientY - e.clientY), 2)
  );
}
let M = {
  down: "mousedown",
  move: "mousemove",
  up: "mouseup mouseleave"
};
typeof window < "u" && (typeof window.PointerEvent == "function" ? M = {
  down: "pointerdown",
  move: "pointermove",
  up: "pointerup pointerleave pointercancel"
} : typeof window.TouchEvent == "function" && (M = {
  down: "touchstart",
  move: "touchmove",
  up: "touchend touchcancel"
}));
function J(t, e, r, c) {
  M[t].split(" ").forEach((h) => {
    e.addEventListener(
      h,
      r,
      c
    );
  });
}
function K(t, e, r) {
  M[t].split(" ").forEach((c) => {
    e.removeEventListener(c, r);
  });
}
const mt = typeof document < "u" && !!document.documentMode;
let Q;
function gt() {
  return Q || (Q = document.createElement("div").style);
}
const at = ["webkit", "moz", "ms"], T = {};
function et(t) {
  if (T[t])
    return T[t];
  const e = gt();
  if (t in e)
    return T[t] = t;
  const r = t[0].toUpperCase() + t.slice(1);
  let c = at.length;
  for (; c--; ) {
    const h = `${at[c]}${r}`;
    if (h in e)
      return T[t] = h;
  }
}
function W(t, e) {
  return parseFloat(e[et(t)]) || 0;
}
function I(t, e, r = window.getComputedStyle(t)) {
  const c = e === "border" ? "Width" : "";
  return {
    left: W(`${e}Left${c}`, r),
    right: W(`${e}Right${c}`, r),
    top: W(`${e}Top${c}`, r),
    bottom: W(`${e}Bottom${c}`, r)
  };
}
function x(t, e, r) {
  t.style[et(e)] = r;
}
function wt(t, e) {
  const r = et("transform");
  x(t, "transition", `${r} ${e.duration}ms ${e.easing}`);
}
function yt(t, { x: e, y: r, scale: c, isSVG: h }, y) {
  if (x(t, "transform", `scale(${c}) translate(${e}px, ${r}px)`), h && mt) {
    const f = window.getComputedStyle(t).getPropertyValue("transform");
    t.setAttribute("transform", f);
  }
}
function j(t) {
  const e = t.parentNode, r = window.getComputedStyle(t), c = window.getComputedStyle(e), h = t.getBoundingClientRect(), y = e.getBoundingClientRect();
  return {
    elem: {
      style: r,
      width: h.width,
      height: h.height,
      top: h.top,
      bottom: h.bottom,
      left: h.left,
      right: h.right,
      margin: I(t, "margin", r),
      border: I(t, "border", r)
    },
    parent: {
      style: c,
      width: y.width,
      height: y.height,
      top: y.top,
      bottom: y.bottom,
      left: y.left,
      right: y.right,
      padding: I(e, "padding", c),
      border: I(e, "border", c)
    }
  };
}
function vt(t) {
  let e = t;
  for (; e && e.parentNode; ) {
    if (e.parentNode === document) return !0;
    e = e.parentNode instanceof ShadowRoot ? e.parentNode.host : e.parentNode;
  }
  return !1;
}
function bt(t) {
  return (t.getAttribute("class") || "").trim();
}
function xt(t, e) {
  return t.nodeType === 1 && ` ${bt(t)} `.indexOf(` ${e} `) > -1;
}
function Et(t, e) {
  for (let r = t; r != null; r = r.parentNode)
    if (xt(r, e.excludeClass) || e.exclude.indexOf(r) > -1)
      return !0;
  return !1;
}
const Pt = /^http:[\w\.\/]+svg$/;
function Mt(t) {
  return Pt.test(t.namespaceURI) && t.nodeName.toLowerCase() !== "svg";
}
function At(t) {
  const e = {};
  for (const r in t)
    t.hasOwnProperty(r) && (e[r] = t[r]);
  return e;
}
const st = {
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
  handleStartEvent: (t) => {
    t.preventDefault(), t.stopPropagation();
  },
  maxScale: 4,
  minScale: 0.125,
  overflow: "hidden",
  panOnlyWhenZoomed: !1,
  pinchAndPan: !1,
  relative: !1,
  setTransform: yt,
  startX: 0,
  startY: 0,
  startScale: 1,
  step: 0.3,
  touchAction: "none"
};
function Ct(t, e) {
  if (!t)
    throw new Error("Panzoom requires an element as an argument");
  if (t.nodeType !== 1)
    throw new Error("Panzoom requires an element with a nodeType of 1");
  if (!vt(t))
    throw new Error(
      "Panzoom should be called on elements that have been attached to the DOM"
    );
  e = {
    ...st,
    ...e
  };
  const r = Mt(t), c = t.parentNode;
  c.style.overflow = e.overflow, c.style.userSelect = "none", c.style.touchAction = e.touchAction, (e.canvas ? c : t).style.cursor = e.cursor, t.style.userSelect = "none", t.style.touchAction = e.touchAction, x(
    t,
    "transformOrigin",
    typeof e.origin == "string" ? e.origin : r ? "0 0" : "50% 50%"
  );
  function h() {
    c.style.overflow = "", c.style.userSelect = "", c.style.touchAction = "", c.style.cursor = "", t.style.cursor = "", t.style.userSelect = "", t.style.touchAction = "", x(t, "transformOrigin", "");
  }
  function y(n = {}) {
    for (const i in n)
      n.hasOwnProperty(i) && (e[i] = n[i]);
    (n.hasOwnProperty("cursor") || n.hasOwnProperty("canvas")) && (c.style.cursor = t.style.cursor = "", (e.canvas ? c : t).style.cursor = e.cursor), n.hasOwnProperty("overflow") && (c.style.overflow = n.overflow), n.hasOwnProperty("touchAction") && (c.style.touchAction = n.touchAction, t.style.touchAction = n.touchAction);
  }
  let f = 0, p = 0, u = 1, A = !1;
  Y(e.startScale, { animate: !1, force: !0 }), setTimeout(() => {
    R(e.startX, e.startY, { animate: !1, force: !0 });
  });
  function C(n, i, s) {
    if (s.silent)
      return;
    const d = new CustomEvent(n, { detail: i });
    t.dispatchEvent(d);
  }
  function D(n, i, s) {
    const d = { x: f, y: p, scale: u, isSVG: r, originalEvent: s };
    return requestAnimationFrame(() => {
      typeof i.animate == "boolean" && (i.animate ? wt(t, i) : x(t, "transition", "none")), i.setTransform(t, d, i), C(n, d, i), C("panzoomchange", d, i);
    }), d;
  }
  function L(n, i, s, d) {
    const o = { ...e, ...d }, l = { x: f, y: p, opts: o };
    if (!o.force && (o.disablePan || o.panOnlyWhenZoomed && u === o.startScale))
      return l;
    if (n = parseFloat(n), i = parseFloat(i), o.disableXAxis || (l.x = (o.relative ? f : 0) + n), o.disableYAxis || (l.y = (o.relative ? p : 0) + i), o.contain) {
      const a = j(t), g = a.elem.width / u, m = a.elem.height / u, E = g * s, P = m * s, v = (E - g) / 2, b = (P - m) / 2;
      if (o.contain === "inside") {
        const F = (-a.elem.margin.left - a.parent.padding.left + v) / s, k = (a.parent.width - E - a.parent.padding.left - a.elem.margin.left - a.parent.border.left - a.parent.border.right + v) / s;
        l.x = Math.max(Math.min(l.x, k), F);
        const U = (-a.elem.margin.top - a.parent.padding.top + b) / s, G = (a.parent.height - P - a.parent.padding.top - a.elem.margin.top - a.parent.border.top - a.parent.border.bottom + b) / s;
        l.y = Math.max(Math.min(l.y, G), U);
      } else if (o.contain === "outside") {
        const F = (-(E - a.parent.width) - a.parent.padding.left - a.parent.border.left - a.parent.border.right + v) / s, k = (v - a.parent.padding.left) / s;
        l.x = Math.max(Math.min(l.x, k), F);
        const U = (-(P - a.parent.height) - a.parent.padding.top - a.parent.border.top - a.parent.border.bottom + b) / s, G = (b - a.parent.padding.top) / s;
        l.y = Math.max(Math.min(l.y, G), U);
      }
    }
    return o.roundPixels && (l.x = Math.round(l.x), l.y = Math.round(l.y)), l;
  }
  function X(n, i) {
    const s = { ...e, ...i }, d = { scale: u, opts: s };
    if (!s.force && s.disableZoom)
      return d;
    let o = e.minScale, l = e.maxScale;
    if (s.contain) {
      const a = j(t), g = a.elem.width / u, m = a.elem.height / u;
      if (g > 1 && m > 1) {
        const E = a.parent.width - a.parent.border.left - a.parent.border.right, P = a.parent.height - a.parent.border.top - a.parent.border.bottom, v = E / g, b = P / m;
        e.contain === "inside" ? l = Math.min(l, v, b) : e.contain === "outside" && (o = Math.max(o, v, b));
      }
    }
    return d.scale = Math.min(Math.max(n, o), l), d;
  }
  function R(n, i, s, d) {
    const o = L(n, i, u, s);
    return f !== o.x || p !== o.y ? (f = o.x, p = o.y, D("panzoompan", o.opts, d)) : { x: f, y: p, scale: u, isSVG: r, originalEvent: d };
  }
  function Y(n, i, s) {
    const d = X(n, i), o = d.opts;
    if (!o.force && o.disableZoom)
      return;
    n = d.scale;
    let l = f, a = p;
    if (o.focal) {
      const m = o.focal;
      l = (m.x / n - m.x / u + f * n) / n, a = (m.y / n - m.y / u + p * n) / n;
    }
    const g = L(l, a, n, {
      relative: !1,
      force: !0
    });
    return f = g.x, p = g.y, u = n, D("panzoomzoom", o, s);
  }
  function nt(n, i) {
    const s = { ...e, animate: !0, ...i };
    return Y(u * Math.exp((n ? 1 : -1) * s.step), s);
  }
  function lt(n) {
    return nt(!0, n);
  }
  function dt(n) {
    return nt(!1, n);
  }
  function H(n, i, s, d) {
    const o = j(t), l = {
      width: o.parent.width - o.parent.padding.left - o.parent.padding.right - o.parent.border.left - o.parent.border.right,
      height: o.parent.height - o.parent.padding.top - o.parent.padding.bottom - o.parent.border.top - o.parent.border.bottom
    };
    let a = i.clientX - o.parent.left - o.parent.padding.left - o.parent.border.left - o.elem.margin.left, g = i.clientY - o.parent.top - o.parent.padding.top - o.parent.border.top - o.elem.margin.top;
    r || (a -= o.elem.width / u / 2, g -= o.elem.height / u / 2);
    const m = {
      x: a / l.width * (l.width * n),
      y: g / l.height * (l.height * n)
    };
    return Y(
      n,
      { ...s, animate: !1, focal: m },
      d
    );
  }
  function ut(n, i) {
    n.preventDefault();
    const s = { ...e, ...i, animate: !1 }, o = (n.deltaY === 0 && n.deltaX ? n.deltaX : n.deltaY) < 0 ? 1 : -1, l = X(
      u * Math.exp(o * s.step / 3),
      s
    ).scale;
    return H(l, n, s, n);
  }
  function ft(n) {
    const i = { ...e, animate: !0, force: !0, ...n };
    u = X(i.startScale, i).scale;
    const s = L(i.startX, i.startY, u, i);
    return f = s.x, p = s.y, D("panzoomreset", i);
  }
  let z, S, O, $, rt, N;
  const w = [];
  function B(n) {
    if (Et(n.target, e))
      return;
    tt(w, n), A = !0, e.handleStartEvent(n), z = f, S = p, C(
      "panzoomstart",
      { x: f, y: p, scale: u, isSVG: r, originalEvent: n },
      e
    );
    const i = it(w);
    O = i.clientX, $ = i.clientY, rt = u, N = _(w);
  }
  function V(n) {
    if (!A || z === void 0 || S === void 0 || O === void 0 || $ === void 0)
      return;
    tt(w, n);
    const i = it(w), s = w.length > 1;
    let d = u;
    if (s) {
      N === 0 && (N = _(w));
      const o = _(w) - N;
      d = X(o * e.step / 80 + rt).scale, H(d, i, { animate: !1 }, n);
    }
    (!s || e.pinchAndPan) && R(
      z + (i.clientX - O) / d,
      S + (i.clientY - $) / d,
      {
        animate: !1
      },
      n
    );
  }
  function Z(n) {
    w.length === 1 && C(
      "panzoomend",
      { x: f, y: p, scale: u, isSVG: r, originalEvent: n },
      e
    ), pt(w, n), A && (A = !1, z = S = O = $ = void 0);
  }
  let q = !1;
  function ot() {
    q || (q = !0, J("down", e.canvas ? c : t, B), J("move", document, V, { passive: !0 }), J("up", document, Z, { passive: !0 }));
  }
  function ht() {
    q = !1, K("down", e.canvas ? c : t, B), K("move", document, V), K("up", document, Z);
  }
  return e.noBind || ot(), {
    bind: ot,
    destroy: ht,
    eventNames: M,
    getPan: () => ({ x: f, y: p }),
    getScale: () => u,
    getOptions: () => At(e),
    handleDown: B,
    handleMove: V,
    handleUp: Z,
    pan: R,
    reset: ft,
    resetStyle: h,
    setOptions: y,
    setStyle: (n, i) => x(t, n, i),
    zoom: Y,
    zoomIn: lt,
    zoomOut: dt,
    zoomToPoint: H,
    zoomWithWheel: ut
  };
}
Ct.defaultOptions = st;
export {
  Ct as default
};
