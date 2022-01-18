var ve = Object.defineProperty
var A = Object.getOwnPropertySymbols
var _e = Object.prototype.hasOwnProperty,
  me = Object.prototype.propertyIsEnumerable
var F = (v, a, m) =>
    a in v
      ? ve(v, a, { enumerable: !0, configurable: !0, writable: !0, value: m })
      : (v[a] = m),
  I = (v, a) => {
    for (var m in a || (a = {})) _e.call(a, m) && F(v, m, a[m])
    if (A) for (var m of A(a)) me.call(a, m) && F(v, m, a[m])
    return v
  }
/*!
 * vue2 v1.2.7
 * 2022年1月Tue Jan 18 2022 21:56:51 GMT+0800 (中国标准时间)
 * 制作
 */ ;(function (v, a) {
  typeof exports == 'object' && typeof module != 'undefined'
    ? a(exports, require('vue-demi'))
    : typeof define == 'function' && define.amd
    ? define(['exports', 'vue-demi'], a)
    : ((v = typeof globalThis != 'undefined' ? globalThis : v || self),
      a((v.SketchRuler = {}), v.vueDemi))
})(this, function (v, a) {
  'use strict'
  const m = {
    scale: Number,
    thick: Number,
    palette: Object,
    index: Number,
    start: Number,
    vertical: Boolean,
    value: Number,
    isShowReferLine: Boolean
  }
  var V = a.defineComponent({
      name: 'LineRuler',
      props: m,
      emits: ['onMouseDown', 'onRelease', 'onRemove'],
      setup(e, { emit: t }) {
        const n = a.ref(0),
          i = a.ref(!0)
        a.onMounted(() => {
          n.value = e.value
        })
        const s = r => {
            i.value = r >= 0
          },
          h = a.computed(() => {
            const r = (n.value - e.start) * e.scale
            s(r)
            const d = r + 'px'
            return e.vertical ? { top: d } : { left: d }
          }),
          u = a.computed(() => {
            var _
            const r = `1px solid ${
                (_ = e.palette) == null ? void 0 : _.lineColor
              }`,
              d = e.vertical ? { borderTop: r } : { borderLeft: r },
              c = e.isShowReferLine
                ? e.vertical
                  ? 'ns-resize'
                  : 'ew-resize'
                : 'none'
            return I({ cursor: c }, d)
          }),
          f = a.computed(() =>
            e.vertical ? { left: e.thick + 'px' } : { top: e.thick + 'px' }
          )
        return {
          startValue: n,
          showLine: i,
          offset: h,
          borderCursor: u,
          actionStyle: f,
          handleDown: r => {
            const d = e.vertical ? r.clientY : r.clientX,
              c = n.value
            t('onMouseDown')
            const _ = R => {
                const C = e.vertical ? R.clientY : R.clientX,
                  N = Math.round(c + (C - d) / e.scale)
                n.value = N
              },
              g = () => {
                t('onRelease', n.value, e.index),
                  document.removeEventListener('mousemove', _),
                  document.removeEventListener('mouseup', g)
              }
            document.addEventListener('mousemove', _),
              document.addEventListener('mouseup', g)
          },
          handleRemove: () => {
            t('onRemove', e.index)
          }
        }
      }
    }),
    X = function () {
      var e = this,
        t = e.$createElement,
        n = e._self._c || t
      return n(
        'div',
        {
          directives: [
            {
              name: 'show',
              rawName: 'v-show',
              value: e.showLine,
              expression: 'showLine'
            }
          ],
          staticClass: 'line',
          style: [e.offset, e.borderCursor],
          on: { mousedown: e.handleDown }
        },
        [
          n('div', { staticClass: 'action', style: e.actionStyle }, [
            n('span', { staticClass: 'del', on: { click: e.handleRemove } }, [
              e._v('\xD7')
            ]),
            n('span', { staticClass: 'value' }, [e._v(e._s(e.startValue))])
          ])
        ]
      )
    },
    j = [],
    we = ''
  function S(e, t, n, i, s, h, u, f) {
    var l = typeof e == 'function' ? e.options : e
    t && ((l.render = t), (l.staticRenderFns = n), (l._compiled = !0)),
      i && (l.functional = !0),
      h && (l._scopeId = 'data-v-' + h)
    var o
    if (
      (u
        ? ((o = function (c) {
            ;(c =
              c ||
              (this.$vnode && this.$vnode.ssrContext) ||
              (this.parent &&
                this.parent.$vnode &&
                this.parent.$vnode.ssrContext)),
              !c &&
                typeof __VUE_SSR_CONTEXT__ != 'undefined' &&
                (c = __VUE_SSR_CONTEXT__),
              s && s.call(this, c),
              c && c._registeredComponents && c._registeredComponents.add(u)
          }),
          (l._ssrRegister = o))
        : s &&
          (o = f
            ? function () {
                s.call(
                  this,
                  (l.functional ? this.parent : this).$root.$options.shadowRoot
                )
              }
            : s),
      o)
    )
      if (l.functional) {
        l._injectStyles = o
        var r = l.render
        l.render = function (_, g) {
          return o.call(g), r(_, g)
        }
      } else {
        var d = l.beforeCreate
        l.beforeCreate = d ? [].concat(d, o) : [o]
      }
    return { exports: e, options: l }
  }
  const k = {}
  var W = S(V, X, j, !1, Y, '0787ee76', null, null)
  function Y(e) {
    for (let t in k) this[t] = k[t]
  }
  var z = (function () {
    return W.exports
  })()
  const H = e =>
      e <= 0.25
        ? 40
        : e <= 0.5
        ? 20
        : e <= 1
        ? 10
        : e <= 2
        ? 5
        : e <= 4
        ? 2
        : 1,
    $ = 0.83,
    U = (e, t, n, i, s, h) => {
      const { scale: u, width: f, height: l, ratio: o, palette: r } = s,
        {
          bgColor: d,
          fontColor: c,
          shadowColor: _,
          longfgColor: g,
          shortfgColor: R
        } = r
      if (
        (e.scale(o, o),
        e.clearRect(0, 0, f, l),
        (e.fillStyle = d),
        e.fillRect(0, 0, f, l),
        i)
      ) {
        const b = (n - t) * u,
          y = i * u
        ;(e.fillStyle = _),
          h
            ? e.fillRect(b, 0, y, (l * 3) / 8)
            : e.fillRect(0, b, (f * 3) / 8, y)
      }
      const C = H(u),
        N = C * u,
        p = C * 10,
        M = p * u,
        O = Math.floor(t / C) * C,
        E = Math.floor(t / p) * p,
        he = ((O - t) / C) * N,
        fe = ((E - t) / p) * M,
        P = t + Math.ceil((h ? f : l) / u)
      e.beginPath(), (e.fillStyle = c), (e.strokeStyle = g)
      for (let b = E, y = 0; b < P; b += p, y++) {
        const w = fe + y * M + 0.5
        h ? e.moveTo(w, 0) : e.moveTo(0, w),
          e.save(),
          h ? e.translate(w, l * 0.4) : e.translate(f * 0.4, w),
          h || e.rotate(-Math.PI / 2),
          e.scale($ / o, $ / o),
          e.fillText(b.toString(), 4 * o, 7 * o),
          e.restore(),
          h ? e.lineTo(w, (l * 9) / 16) : e.lineTo((f * 9) / 16, w)
      }
      e.stroke(), e.closePath(), e.beginPath(), (e.strokeStyle = R)
      for (let b = O, y = 0; b < P; b += C, y++) {
        const w = he + y * N + 0.5
        h ? e.moveTo(w, 0) : e.moveTo(0, w),
          b % p != 0 &&
            (h ? e.lineTo(w, (l * 1) / 4) : e.lineTo((f * 1) / 4, w))
      }
      e.stroke(), e.closePath(), e.setTransform(1, 0, 0, 1, 0, 0)
    }
  var G = a.defineComponent({
      name: 'CanvasRuler',
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
      emits: ['onAddLine', 'update:showIndicator', 'update:valueNum'],
      setup(e, { emit: t }) {
        const n = a.reactive({ canvasContext: null })
        let i = 1
        const s = a.ref(null)
        a.onMounted(() => {
          ;(i = e.ratio || window.devicePixelRatio || 1), h(), u(i), f(i)
        })
        const h = () => {
            n.canvasContext = s.value && s.value.getContext('2d')
          },
          u = o => {
            if (s.value) {
              ;(s.value.width = e.width * o), (s.value.height = e.height * o)
              const r = n.canvasContext
              r &&
                ((r.font = `${12 * o}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`),
                (r.lineWidth = 1),
                (r.textBaseline = 'middle'))
            }
          },
          f = o => {
            const r = {
              scale: e.scale,
              width: e.width,
              height: e.height,
              palette: e.palette,
              ratio: o
            }
            n.canvasContext &&
              U(
                n.canvasContext,
                e.start,
                e.selectStart,
                e.selectLength,
                r,
                !e.vertical
              )
          }
        return (
          a.watch(
            () => e.start,
            () => f(i)
          ),
          a.watch([() => e.width, () => e.height], () => {
            u(i), f(i)
          }),
          {
            handle: (o, r) => {
              const d = (g, R, C) => Math.round(R + g / C),
                c = e.vertical ? o.offsetY : o.offsetX,
                _ = d(c, e.start, e.scale)
              switch (r) {
                case 'click':
                  t('onAddLine', _)
                  break
                case 'enter':
                  t('update:valueNum', _), t('update:showIndicator', !0)
                  break
                default:
                  t('update:valueNum', _)
                  break
              }
            },
            canvas: s
          }
        )
      }
    }),
    K = function () {
      var e = this,
        t = e.$createElement,
        n = e._self._c || t
      return n('canvas', {
        ref: 'canvas',
        staticClass: 'ruler',
        on: {
          click: function (i) {
            return e.handle(i, 'click')
          },
          mouseenter: function (i) {
            return e.handle(i, 'enter')
          },
          mousemove: function (i) {
            return e.handle(i, 'move')
          },
          mouseleave: function (i) {
            return e.$emit('update:showIndicator', !1)
          }
        }
      })
    },
    q = []
  const L = {}
  var Q = S(G, K, q, !1, Z, null, null, null)
  function Z(e) {
    for (let t in L) this[t] = L[t]
  }
  var J = (function () {
    return Q.exports
  })()
  const D = {
    scale: Number,
    ratio: Number,
    thick: Number,
    palette: Object,
    vertical: { type: Boolean, default: !0 },
    width: { type: Number, default: 200 },
    height: { type: Number, default: 200 },
    start: { type: Number, default: 0 },
    lines: { type: Array, default: () => [] },
    selectStart: { type: Number },
    selectLength: { type: Number },
    isShowReferLine: { type: Boolean }
  }
  var ee = a.defineComponent({
      name: 'RulerWrapper',
      components: { CanvasRuler: J, RulerLine: z },
      props: D,
      setup(e) {
        const t = a.ref(!1),
          n = a.ref(0),
          i = a.computed(() => (e.vertical ? 'v-container' : 'h-container')),
          s = a.computed(() => {
            const o = {
                width: `calc(100% - ${e.thick}px)`,
                height: `${e.thick + 1}px`,
                left: `${e.thick}px`
              },
              r = {
                width: `${e.thick && e.thick + 1}px`,
                height: `calc(100% - ${e.thick}px)`,
                top: `${e.thick}px`
              }
            return e.vertical ? r : o
          }),
          h = a.computed(() => {
            var c
            const o = (n.value - e.start) * e.scale
            let r = 'top',
              d = 'borderLeft'
            return (
              (r = e.vertical ? 'top' : 'left'),
              (d = e.vertical ? 'borderBottom' : 'borderLeft'),
              {
                [r]: o + 'px',
                [d]: `1px solid ${
                  (c = e.palette) == null ? void 0 : c.lineColor
                }`
              }
            )
          }),
          u = o => {
            e.lines.push(o)
          },
          f = (o, r) => {
            const d = o - e.start,
              c = (e.vertical ? e.height : e.width) / e.scale
            d < 0 || d > c ? l(r) : (e.lines[r] = o)
          },
          l = o => {
            e.lines.splice(o, 1)
          }
        return {
          showIndicator: t,
          valueNum: n,
          rwClassName: i,
          rwStyle: s,
          indicatorStyle: h,
          handleNewLine: u,
          handleLineRelease: f,
          handleLineRemove: l
        }
      }
    }),
    te = function () {
      var e = this,
        t = e.$createElement,
        n = e._self._c || t
      return n(
        'div',
        { class: e.rwClassName, style: e.rwStyle },
        [
          n('CanvasRuler', {
            attrs: {
              vertical: e.vertical,
              scale: e.scale,
              width: e.width,
              height: e.height,
              start: e.start,
              ratio: e.ratio,
              'select-start': e.selectStart,
              'select-length': e.selectLength,
              palette: e.palette
            },
            on: { onAddLine: e.handleNewLine },
            model: {
              value: e.showIndicator,
              callback: function (i) {
                e.showIndicator = i
              },
              expression: 'showIndicator'
            }
          }),
          n(
            'div',
            {
              directives: [
                {
                  name: 'show',
                  rawName: 'v-show',
                  value: e.isShowReferLine,
                  expression: 'isShowReferLine'
                }
              ],
              staticClass: 'lines'
            },
            e._l(e.lines, function (i, s) {
              return n('RulerLine', {
                key: i + s,
                attrs: {
                  index: s,
                  value: i >> 0,
                  scale: e.scale,
                  start: e.start,
                  thick: e.thick,
                  palette: e.palette,
                  vertical: e.vertical,
                  'is-show-refer-line': e.isShowReferLine
                },
                on: {
                  onRemove: e.handleLineRemove,
                  onRelease: e.handleLineRelease
                }
              })
            }),
            1
          ),
          n(
            'div',
            {
              directives: [
                {
                  name: 'show',
                  rawName: 'v-show',
                  value: e.showIndicator,
                  expression: 'showIndicator'
                }
              ],
              staticClass: 'indicator',
              style: e.indicatorStyle
            },
            [n('div', { staticClass: 'value' }, [e._v(e._s(e.valueNum))])]
          )
        ],
        1
      )
    },
    ne = [],
    Ce = ''
  const T = {}
  var oe = S(ee, te, ne, !1, re, '271f0665', null, null)
  function re(e) {
    for (let t in T) this[t] = T[t]
  }
  var ae = (function () {
    return oe.exports
  })()
  const le = {
    scale: { type: Number, default: 1 },
    ratio: { type: Number },
    thick: { type: Number, default: 16 },
    palette: Object,
    startX: { type: Number },
    startY: { type: Number, default: 0 },
    width: { type: Number, default: 200 },
    height: { type: Number, default: 200 },
    shadow: {
      type: Object,
      default: () => ({ x: 0, y: 0, width: 0, height: 0 })
    },
    lines: { type: Object, default: () => ({ h: [], v: [] }) },
    cornerActive: { type: Boolean, default: !1 },
    isShowReferLine: { type: Boolean, default: !0 }
  }
  var ie = a.defineComponent({
      name: 'SketchRule',
      components: { RulerWrapper: ae },
      props: le,
      emits: ['onCornerClick', 'handleLine'],
      setup(e, { emit: t }) {
        const n = a.computed(() => {
            function u(l, o) {
              return (
                Object.keys(l).forEach(r => {
                  r &&
                    l.hasOwnProperty(r) &&
                    (typeof o.key == 'object'
                      ? (l[r] = u(l[r], o[r]))
                      : o.hasOwnProperty(r) && (l[r] = o[r]))
                }),
                l
              )
            }
            return u(
              {
                bgColor: 'rgba(225,225,225, 0)',
                longfgColor: '#BABBBC',
                shortfgColor: '#C8CDD0',
                fontColor: '#7D8694',
                shadowColor: '#E8E8E8',
                lineColor: '#EB5648',
                borderColor: '#DADADC',
                cornerActiveColor: 'rgb(235, 86, 72, 0.6)',
                menu: {
                  bgColor: '#fff',
                  dividerColor: '#DBDBDB',
                  listItem: {
                    textColor: '#415058',
                    hoverTextColor: '#298DF8',
                    disabledTextColor: 'rgba(65, 80, 88, 0.4)',
                    bgColor: '#fff',
                    hoverBgColor: '#F2F2F2'
                  }
                }
              },
              e.palette || {}
            )
          }),
          i = a.computed(() => (e.cornerActive ? ' active' : '')),
          s = a.computed(() => ({
            backgroundColor: n.value.bgColor,
            width: e.thick + 'px',
            height: e.thick + 'px',
            borderRight: `1px solid ${n.value.borderColor}`,
            borderBottom: `1px solid ${n.value.borderColor}`
          }))
        return {
          paletteCpu: n,
          cornerActiveClass: i,
          cornerStyle: s,
          onCornerClick: u => {
            t('onCornerClick', u)
          }
        }
      }
    }),
    se = function () {
      var e = this,
        t = e.$createElement,
        n = e._self._c || t
      return n(
        'div',
        { staticClass: 'style-ruler mb-ruler', attrs: { id: 'mb-ruler' } },
        [
          n('RulerWrapper', {
            attrs: {
              vertical: !1,
              width: e.width,
              height: e.thick,
              'is-show-refer-line': e.isShowReferLine,
              thick: e.thick,
              ratio: e.ratio,
              start: e.startX,
              lines: e.lines.h,
              'select-start': e.shadow.x,
              'select-length': e.shadow.width,
              scale: e.scale,
              palette: e.paletteCpu
            }
          }),
          n('RulerWrapper', {
            attrs: {
              vertical: !0,
              width: e.thick,
              height: e.height,
              'is-show-refer-line': e.isShowReferLine,
              thick: e.thick,
              ratio: e.ratio,
              start: e.startY,
              lines: e.lines.v,
              'select-start': e.shadow.y,
              'select-length': e.shadow.height,
              scale: e.scale,
              palette: e.paletteCpu
            }
          }),
          n('a', {
            staticClass: 'corner',
            class: e.cornerActiveClass,
            style: e.cornerStyle,
            on: { click: e.onCornerClick }
          })
        ],
        1
      )
    },
    ce = [],
    be = ''
  const B = {}
  var ue = S(ie, se, ce, !1, de, null, null, null)
  function de(e) {
    for (let t in B) this[t] = B[t]
  }
  var x = (function () {
    return ue.exports
  })()
  ;(v.SketchRule = x),
    (v.default = x),
    Object.defineProperty(v, '__esModule', { value: !0 }),
    (v[Symbol.toStringTag] = 'Module')
})
