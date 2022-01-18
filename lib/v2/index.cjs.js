'use strict'
var I = Object.defineProperty
var L = Object.getOwnPropertySymbols
var V = Object.prototype.hasOwnProperty,
  X = Object.prototype.propertyIsEnumerable
var B = (e, t, n) =>
    t in e
      ? I(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  T = (e, t) => {
    for (var n in t || (t = {})) V.call(t, n) && B(e, n, t[n])
    if (L) for (var n of L(t)) X.call(t, n) && B(e, n, t[n])
    return e
  }
/*!
 * vue2 v1.2.7
 * 2022年1月Tue Jan 18 2022 21:34:00 GMT+0800 (中国标准时间)
 * 制作
 */ Object.defineProperty(exports, '__esModule', { value: !0 })
exports[Symbol.toStringTag] = 'Module'
var c = require('vue-demi')
const W = {
  scale: Number,
  thick: Number,
  palette: Object,
  index: Number,
  start: Number,
  vertical: Boolean,
  value: Number,
  isShowReferLine: Boolean
}
var j = c.defineComponent({
    name: 'LineRuler',
    props: W,
    emits: ['onMouseDown', 'onRelease', 'onRemove'],
    setup(e, { emit: t }) {
      const n = c.ref(0),
        l = c.ref(!0)
      c.onMounted(() => {
        n.value = e.value
      })
      const i = o => {
          l.value = o >= 0
        },
        h = c.computed(() => {
          const o = (n.value - e.start) * e.scale
          i(o)
          const d = o + 'px'
          return e.vertical ? { top: d } : { left: d }
        }),
        u = c.computed(() => {
          var f
          const o = `1px solid ${
              (f = e.palette) == null ? void 0 : f.lineColor
            }`,
            d = e.vertical ? { borderTop: o } : { borderLeft: o },
            s = e.isShowReferLine
              ? e.vertical
                ? 'ns-resize'
                : 'ew-resize'
              : 'none'
          return T({ cursor: s }, d)
        }),
        v = c.computed(() =>
          e.vertical ? { left: e.thick + 'px' } : { top: e.thick + 'px' }
        )
      return {
        startValue: n,
        showLine: l,
        offset: h,
        borderCursor: u,
        actionStyle: v,
        handleDown: o => {
          const d = e.vertical ? o.clientY : o.clientX,
            s = n.value
          t('onMouseDown')
          const f = g => {
              const _ = e.vertical ? g.clientY : g.clientX,
                R = Math.round(s + (_ - d) / e.scale)
              n.value = R
            },
            C = () => {
              t('onRelease', n.value, e.index),
                document.removeEventListener('mousemove', f),
                document.removeEventListener('mouseup', C)
            }
          document.addEventListener('mousemove', f),
            document.addEventListener('mouseup', C)
        },
        handleRemove: () => {
          t('onRemove', e.index)
        }
      }
    }
  }),
  Y = function () {
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
  z = []
function p(e, t, n, l, i, h, u, v) {
  var a = typeof e == 'function' ? e.options : e
  t && ((a.render = t), (a.staticRenderFns = n), (a._compiled = !0)),
    l && (a.functional = !0),
    h && (a._scopeId = 'data-v-' + h)
  var r
  if (
    (u
      ? ((r = function (s) {
          ;(s =
            s ||
            (this.$vnode && this.$vnode.ssrContext) ||
            (this.parent &&
              this.parent.$vnode &&
              this.parent.$vnode.ssrContext)),
            !s &&
              typeof __VUE_SSR_CONTEXT__ != 'undefined' &&
              (s = __VUE_SSR_CONTEXT__),
            i && i.call(this, s),
            s && s._registeredComponents && s._registeredComponents.add(u)
        }),
        (a._ssrRegister = r))
      : i &&
        (r = v
          ? function () {
              i.call(
                this,
                (a.functional ? this.parent : this).$root.$options.shadowRoot
              )
            }
          : i),
    r)
  )
    if (a.functional) {
      a._injectStyles = r
      var o = a.render
      a.render = function (f, C) {
        return r.call(C), o(f, C)
      }
    } else {
      var d = a.beforeCreate
      a.beforeCreate = d ? [].concat(d, r) : [r]
    }
  return { exports: e, options: a }
}
const x = {}
var H = p(j, Y, z, !1, U, '0787ee76', null, null)
function U(e) {
  for (let t in x) this[t] = x[t]
}
var G = (function () {
  return H.exports
})()
const K = e =>
    e <= 0.25 ? 40 : e <= 0.5 ? 20 : e <= 1 ? 10 : e <= 2 ? 5 : e <= 4 ? 2 : 1,
  D = 0.83,
  q = (e, t, n, l, i, h) => {
    const { scale: u, width: v, height: a, ratio: r, palette: o } = i,
      {
        bgColor: d,
        fontColor: s,
        shadowColor: f,
        longfgColor: C,
        shortfgColor: g
      } = o
    if (
      (e.scale(r, r),
      e.clearRect(0, 0, v, a),
      (e.fillStyle = d),
      e.fillRect(0, 0, v, a),
      l)
    ) {
      const w = (n - t) * u,
        b = l * u
      ;(e.fillStyle = f),
        h ? e.fillRect(w, 0, b, (a * 3) / 8) : e.fillRect(0, w, (v * 3) / 8, b)
    }
    const _ = K(u),
      R = _ * u,
      y = _ * 10,
      S = y * u,
      N = Math.floor(t / _) * _,
      k = Math.floor(t / y) * y,
      A = ((N - t) / _) * R,
      F = ((k - t) / y) * S,
      $ = t + Math.ceil((h ? v : a) / u)
    e.beginPath(), (e.fillStyle = s), (e.strokeStyle = C)
    for (let w = k, b = 0; w < $; w += y, b++) {
      const m = F + b * S + 0.5
      h ? e.moveTo(m, 0) : e.moveTo(0, m),
        e.save(),
        h ? e.translate(m, a * 0.4) : e.translate(v * 0.4, m),
        h || e.rotate(-Math.PI / 2),
        e.scale(D / r, D / r),
        e.fillText(w.toString(), 4 * r, 7 * r),
        e.restore(),
        h ? e.lineTo(m, (a * 9) / 16) : e.lineTo((v * 9) / 16, m)
    }
    e.stroke(), e.closePath(), e.beginPath(), (e.strokeStyle = g)
    for (let w = N, b = 0; w < $; w += _, b++) {
      const m = A + b * R + 0.5
      h ? e.moveTo(m, 0) : e.moveTo(0, m),
        w % y != 0 && (h ? e.lineTo(m, (a * 1) / 4) : e.lineTo((v * 1) / 4, m))
    }
    e.stroke(), e.closePath(), e.setTransform(1, 0, 0, 1, 0, 0)
  }
var Q = c.defineComponent({
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
      const n = c.reactive({ canvasContext: null })
      let l = 1
      const i = c.ref(null)
      c.onMounted(() => {
        ;(l = e.ratio || window.devicePixelRatio || 1), h(), u(l), v(l)
      })
      const h = () => {
          n.canvasContext = i.value && i.value.getContext('2d')
        },
        u = r => {
          if (i.value) {
            ;(i.value.width = e.width * r), (i.value.height = e.height * r)
            const o = n.canvasContext
            o &&
              ((o.font = `${12 * r}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`),
              (o.lineWidth = 1),
              (o.textBaseline = 'middle'))
          }
        },
        v = r => {
          const o = {
            scale: e.scale,
            width: e.width,
            height: e.height,
            palette: e.palette,
            ratio: r
          }
          n.canvasContext &&
            q(
              n.canvasContext,
              e.start,
              e.selectStart,
              e.selectLength,
              o,
              !e.vertical
            )
        }
      return (
        c.watch(
          () => e.start,
          () => v(l)
        ),
        c.watch([() => e.width, () => e.height], () => {
          u(l), v(l)
        }),
        {
          handle: (r, o) => {
            const d = (C, g, _) => Math.round(g + C / _),
              s = e.vertical ? r.offsetY : r.offsetX,
              f = d(s, e.start, e.scale)
            switch (o) {
              case 'click':
                t('onAddLine', f)
                break
              case 'enter':
                t('update:valueNum', f), t('update:showIndicator', !0)
                break
              default:
                t('update:valueNum', f)
                break
            }
          },
          canvas: i
        }
      )
    }
  }),
  Z = function () {
    var e = this,
      t = e.$createElement,
      n = e._self._c || t
    return n('canvas', {
      ref: 'canvas',
      staticClass: 'ruler',
      on: {
        click: function (l) {
          return e.handle(l, 'click')
        },
        mouseenter: function (l) {
          return e.handle(l, 'enter')
        },
        mousemove: function (l) {
          return e.handle(l, 'move')
        },
        mouseleave: function (l) {
          return e.$emit('update:showIndicator', !1)
        }
      }
    })
  },
  J = []
const M = {}
var ee = p(Q, Z, J, !1, te, null, null, null)
function te(e) {
  for (let t in M) this[t] = M[t]
}
var ne = (function () {
  return ee.exports
})()
const re = {
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
var oe = c.defineComponent({
    name: 'RulerWrapper',
    components: { CanvasRuler: ne, RulerLine: G },
    props: re,
    setup(e) {
      const t = c.ref(!1),
        n = c.ref(0),
        l = c.computed(() => (e.vertical ? 'v-container' : 'h-container')),
        i = c.computed(() => {
          const r = {
              width: `calc(100% - ${e.thick}px)`,
              height: `${e.thick + 1}px`,
              left: `${e.thick}px`
            },
            o = {
              width: `${e.thick && e.thick + 1}px`,
              height: `calc(100% - ${e.thick}px)`,
              top: `${e.thick}px`
            }
          return e.vertical ? o : r
        }),
        h = c.computed(() => {
          var s
          const r = (n.value - e.start) * e.scale
          let o = 'top',
            d = 'borderLeft'
          return (
            (o = e.vertical ? 'top' : 'left'),
            (d = e.vertical ? 'borderBottom' : 'borderLeft'),
            {
              [o]: r + 'px',
              [d]: `1px solid ${(s = e.palette) == null ? void 0 : s.lineColor}`
            }
          )
        }),
        u = r => {
          e.lines.push(r)
        },
        v = (r, o) => {
          const d = r - e.start,
            s = (e.vertical ? e.height : e.width) / e.scale
          d < 0 || d > s ? a(o) : (e.lines[o] = r)
        },
        a = r => {
          e.lines.splice(r, 1)
        }
      return {
        showIndicator: t,
        valueNum: n,
        rwClassName: l,
        rwStyle: i,
        indicatorStyle: h,
        handleNewLine: u,
        handleLineRelease: v,
        handleLineRemove: a
      }
    }
  }),
  ae = function () {
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
            callback: function (l) {
              e.showIndicator = l
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
          e._l(e.lines, function (l, i) {
            return n('RulerLine', {
              key: l + i,
              attrs: {
                index: i,
                value: l >> 0,
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
  le = []
const O = {}
var ie = p(oe, ae, le, !1, se, '271f0665', null, null)
function se(e) {
  for (let t in O) this[t] = O[t]
}
var ce = (function () {
  return ie.exports
})()
const ue = {
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
var de = c.defineComponent({
    name: 'SketchRule',
    components: { RulerWrapper: ce },
    props: ue,
    emits: ['onCornerClick', 'handleLine'],
    setup(e, { emit: t }) {
      const n = c.computed(() => {
          function u(a, r) {
            return (
              Object.keys(a).forEach(o => {
                o &&
                  a.hasOwnProperty(o) &&
                  (typeof r.key == 'object'
                    ? (a[o] = u(a[o], r[o]))
                    : r.hasOwnProperty(o) && (a[o] = r[o]))
              }),
              a
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
        l = c.computed(() => (e.cornerActive ? ' active' : '')),
        i = c.computed(() => ({
          backgroundColor: n.value.bgColor,
          width: e.thick + 'px',
          height: e.thick + 'px',
          borderRight: `1px solid ${n.value.borderColor}`,
          borderBottom: `1px solid ${n.value.borderColor}`
        }))
      return {
        paletteCpu: n,
        cornerActiveClass: l,
        cornerStyle: i,
        onCornerClick: u => {
          t('onCornerClick', u)
        }
      }
    }
  }),
  he = function () {
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
  ve = []
const E = {}
var fe = p(de, he, ve, !1, me, null, null, null)
function me(e) {
  for (let t in E) this[t] = E[t]
}
var P = (function () {
  return fe.exports
})()
exports.SketchRule = P
exports.default = P
