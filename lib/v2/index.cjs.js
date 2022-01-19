'use strict'
var F = Object.defineProperty
var E = Object.getOwnPropertySymbols
var I = Object.prototype.hasOwnProperty,
  M = Object.prototype.propertyIsEnumerable
var L = (e, n, t) =>
    n in e
      ? F(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t })
      : (e[n] = t),
  k = (e, n) => {
    for (var t in n || (n = {})) I.call(n, t) && L(e, t, n[t])
    if (E) for (var t of E(n)) M.call(n, t) && L(e, t, n[t])
    return e
  }
/*!
 * vue2 v1.3.1-bata
 * 2022年1月Wed Jan 19 2022 21:09:58 GMT+0800 (中国标准时间)
 * 制作
 */ Object.defineProperty(exports, '__esModule', { value: !0 })
exports[Symbol.toStringTag] = 'Module'
var s = require('vue-demi')
const Q = {
  scale: Number,
  thick: Number,
  palette: Object,
  index: Number,
  start: Number,
  vertical: Boolean,
  value: Number,
  isShowReferLine: Boolean
}
var K = s.defineComponent({
    name: 'LineRuler',
    props: Q,
    emits: ['onMouseDown', 'onRelease', 'onRemove'],
    setup(e, { emit: n }) {
      const t = s.ref(0),
        r = s.ref(!0)
      s.onMounted(() => {
        t.value = e.value
      })
      const c = o => {
          r.value = o >= 0
        },
        h = s.computed(() => {
          const o = (t.value - e.start) * e.scale
          c(o)
          const i = o + 'px'
          return e.vertical ? { top: i } : { left: i }
        }),
        v = s.computed(() => {
          var f
          const o = `1px solid ${
              (f = e.palette) == null ? void 0 : f.lineColor
            }`,
            i = e.vertical ? { borderTop: o } : { borderLeft: o },
            u = e.isShowReferLine
              ? e.vertical
                ? 'ns-resize'
                : 'ew-resize'
              : 'none'
          return k({ cursor: u }, i)
        }),
        d = s.computed(() =>
          e.vertical ? { left: e.thick + 'px' } : { top: e.thick + 'px' }
        )
      return {
        startValue: t,
        showLine: r,
        offset: h,
        borderCursor: v,
        actionStyle: d,
        handleDown: o => {
          const i = e.vertical ? o.clientY : o.clientX,
            u = t.value
          n('onMouseDown')
          const f = g => {
              const _ = e.vertical ? g.clientY : g.clientX,
                R = Math.round(u + (_ - i) / e.scale)
              t.value = R
            },
            w = () => {
              n('onRelease', t.value, e.index),
                document.removeEventListener('mousemove', f),
                document.removeEventListener('mouseup', w)
            }
          document.addEventListener('mousemove', f),
            document.addEventListener('mouseup', w)
        },
        handleRemove: () => {
          n('onRemove', e.index)
        }
      }
    }
  }),
  P = function () {
    var e = this,
      n = e.$createElement,
      t = e._self._c || n
    return t(
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
        t('div', { staticClass: 'action', style: e.actionStyle }, [
          t('span', { staticClass: 'del', on: { click: e.handleRemove } }, [
            e._v('\xD7')
          ]),
          t('span', { staticClass: 'value' }, [e._v(e._s(e.startValue))])
        ])
      ]
    )
  },
  Y = []
function S(e, n, t, r, c, h, v, d) {
  var l = typeof e == 'function' ? e.options : e
  n && ((l.render = n), (l.staticRenderFns = t), (l._compiled = !0)),
    r && (l.functional = !0),
    h && (l._scopeId = 'data-v-' + h)
  var a
  if (
    (v
      ? ((a = function (u) {
          ;(u =
            u ||
            (this.$vnode && this.$vnode.ssrContext) ||
            (this.parent &&
              this.parent.$vnode &&
              this.parent.$vnode.ssrContext)),
            !u &&
              typeof __VUE_SSR_CONTEXT__ != 'undefined' &&
              (u = __VUE_SSR_CONTEXT__),
            c && c.call(this, u),
            u && u._registeredComponents && u._registeredComponents.add(v)
        }),
        (l._ssrRegister = a))
      : c &&
        (a = d
          ? function () {
              c.call(
                this,
                (l.functional ? this.parent : this).$root.$options.shadowRoot
              )
            }
          : c),
    a)
  )
    if (l.functional) {
      l._injectStyles = a
      var o = l.render
      l.render = function (f, w) {
        return a.call(w), o(f, w)
      }
    } else {
      var i = l.beforeCreate
      l.beforeCreate = i ? [].concat(i, a) : [a]
    }
  return { exports: e, options: l }
}
const U = {}
var z = S(K, P, Y, !1, W, '7d1eeed0', null, null)
function W(e) {
  for (let n in U) this[n] = U[n]
}
var q = (function () {
  return z.exports
})()
const G = e =>
    e <= 0.25 ? 40 : e <= 0.5 ? 20 : e <= 1 ? 10 : e <= 2 ? 5 : e <= 4 ? 2 : 1,
  O = 0.83,
  H = (e, n, t, r, c, h) => {
    const { scale: v, width: d, height: l, ratio: a, palette: o } = c,
      {
        bgColor: i,
        fontColor: u,
        shadowColor: f,
        longfgColor: w,
        shortfgColor: g
      } = o
    if (
      (e.scale(a, a),
      e.clearRect(0, 0, d, l),
      (e.fillStyle = i),
      e.fillRect(0, 0, d, l),
      r)
    ) {
      const C = (t - n) * v,
        A = r * v
      ;(e.fillStyle = f),
        h ? e.fillRect(C, 0, A, (l * 3) / 8) : e.fillRect(0, C, (d * 3) / 8, A)
    }
    const _ = G(v),
      R = _ * v,
      b = _ * 10,
      p = b * v,
      y = Math.floor(n / _) * _,
      N = Math.floor(n / b) * b,
      $ = ((y - n) / _) * R,
      x = ((N - n) / b) * p,
      B = n + Math.ceil((h ? d : l) / v)
    e.beginPath(), (e.fillStyle = u), (e.strokeStyle = w)
    for (let C = N, A = 0; C < B; C += b, A++) {
      const m = x + A * p + 0.5
      h ? e.moveTo(m, 0) : e.moveTo(0, m),
        e.save(),
        h ? e.translate(m, l * 0.4) : e.translate(d * 0.4, m),
        h || e.rotate(-Math.PI / 2),
        e.scale(O / a, O / a),
        e.fillText(C.toString(), 4 * a, 7 * a),
        e.restore(),
        h ? e.lineTo(m, (l * 9) / 16) : e.lineTo((d * 9) / 16, m)
    }
    e.stroke(), e.closePath(), e.beginPath(), (e.strokeStyle = g)
    for (let C = y, A = 0; C < B; C += _, A++) {
      const m = $ + A * R + 0.5
      h ? e.moveTo(m, 0) : e.moveTo(0, m),
        C % b != 0 && (h ? e.lineTo(m, (l * 1) / 4) : e.lineTo((d * 1) / 4, m))
    }
    e.stroke(), e.closePath(), e.setTransform(1, 0, 0, 1, 0, 0)
  }
var Z = s.defineComponent({
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
    setup(e, { emit: n }) {
      const t = s.reactive({ canvasContext: null })
      let r = 1
      const c = s.ref(null)
      s.onMounted(() => {
        ;(r = e.ratio || window.devicePixelRatio || 1), h(), v(r), d(r)
      })
      const h = () => {
          t.canvasContext = c.value && c.value.getContext('2d')
        },
        v = a => {
          if (c.value) {
            ;(c.value.width = e.width * a), (c.value.height = e.height * a)
            const o = t.canvasContext
            o &&
              ((o.font = `${12 * a}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`),
              (o.lineWidth = 1),
              (o.textBaseline = 'middle'))
          }
        },
        d = a => {
          const o = {
            scale: e.scale,
            width: e.width,
            height: e.height,
            palette: e.palette,
            ratio: a
          }
          t.canvasContext &&
            H(
              t.canvasContext,
              e.start,
              e.selectStart,
              e.selectLength,
              o,
              !e.vertical
            )
        }
      return (
        s.watch(
          () => e.start,
          () => d(r)
        ),
        s.watch([() => e.width, () => e.height], () => {
          v(r), d(r)
        }),
        {
          handle: (a, o) => {
            const i = (w, g, _) => Math.round(g + w / _),
              u = e.vertical ? a.offsetY : a.offsetX,
              f = i(u, e.start, e.scale)
            switch (o) {
              case 'click':
                n('onAddLine', f)
                break
              case 'enter':
                n('update:valueNum', f), n('update:showIndicator', !0)
                break
              default:
                n('update:valueNum', f)
                break
            }
          },
          canvas: c
        }
      )
    }
  }),
  j = function () {
    var e = this,
      n = e.$createElement,
      t = e._self._c || n
    return t('canvas', {
      ref: 'canvas',
      staticClass: 'ruler',
      on: {
        click: function (r) {
          return e.handle(r, 'click')
        },
        mouseenter: function (r) {
          return e.handle(r, 'enter')
        },
        mousemove: function (r) {
          return e.handle(r, 'move')
        },
        mouseleave: function (r) {
          return e.$emit('update:showIndicator', !1)
        }
      }
    })
  },
  J = []
const X = {}
var ee = S(Z, j, J, !1, te, null, null, null)
function te(e) {
  for (let n in X) this[n] = X[n]
}
var ne = (function () {
  return ee.exports
})()
const ae = {
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
var oe = s.defineComponent({
    name: 'RulerWrapper',
    components: { CanvasRuler: ne, RulerLine: q },
    props: ae,
    setup(e) {
      const n = s.ref(!1),
        t = s.ref(0),
        r = s.computed(() => (e.vertical ? 'v-container' : 'h-container')),
        c = s.computed(() => {
          const a = {
              width: `calc(100% - ${e.thick}px)`,
              height: `${e.thick + 1}px`,
              left: `${e.thick}px`
            },
            o = {
              width: `${e.thick && e.thick + 1}px`,
              height: `calc(100% - ${e.thick}px)`,
              top: `${e.thick}px`
            }
          return e.vertical ? o : a
        }),
        h = s.computed(() => {
          var u
          const a = (t.value - e.start) * e.scale
          let o = 'top',
            i = 'borderLeft'
          return (
            (o = e.vertical ? 'top' : 'left'),
            (i = e.vertical ? 'borderBottom' : 'borderLeft'),
            {
              [o]: a + 'px',
              [i]: `1px solid ${(u = e.palette) == null ? void 0 : u.lineColor}`
            }
          )
        }),
        v = a => {
          e.lines.push(a)
        },
        d = (a, o) => {
          const i = a - e.start,
            u = (e.vertical ? e.height : e.width) / e.scale
          i < 0 || i > u ? l(o) : (e.lines[o] = a)
        },
        l = a => {
          e.lines.splice(a, 1)
        }
      return {
        showIndicator: n,
        valueNum: t,
        rwClassName: r,
        rwStyle: c,
        indicatorStyle: h,
        handleNewLine: v,
        handleLineRelease: d,
        handleLineRemove: l
      }
    }
  }),
  re = function () {
    var e = this,
      n = e.$createElement,
      t = e._self._c || n
    return t(
      'div',
      { class: e.rwClassName, style: e.rwStyle },
      [
        t('CanvasRuler', {
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
            callback: function (r) {
              e.showIndicator = r
            },
            expression: 'showIndicator'
          }
        }),
        t(
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
          e._l(e.lines, function (r, c) {
            return t('RulerLine', {
              key: r + c,
              attrs: {
                index: c,
                value: r >> 0,
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
        t(
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
          [t('div', { staticClass: 'value' }, [e._v(e._s(e.valueNum))])]
        )
      ],
      1
    )
  },
  le = []
const V = {}
var ie = S(oe, re, le, !1, se, '271f0665', null, null)
function se(e) {
  for (let n in V) this[n] = V[n]
}
var ce = (function () {
  return ie.exports
})()
const ue =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAopJREFUOE/FlE9IVEEcx7+/N9ouds1Mu0QUSFZYdIgoUqQoKPBQHsKozpXE7jbTO/U8xLJvn6usBHWQ6hBFXupSkQeVbh0KJEPp0sH+eLGTsKs77xcj78m0ax0E8cHjzZv5zef3/c33xxA24KENYGJzoEEQbNNaN4Zh2OQ4znwYhr9c1/39vwrXVDo0NNS0tLR0GYB5D64BmAMwzMyvlFKz1es10Hw+f4mZ7wHYBeA9gNdENFepVOaEEM3M3OI4Thczn41gt6WUgQ3+C+r7/h0AWQD3mXnYqPA8L9nQ0HCemduIaFpKOWoAhUJhT6VSuQXgOjP3K6W8GLwKzeVyp4jonR0QBEErM48w8zFLyayUsjX+z+VyHhHdZebTSqkxM78CHRgYOKS1/ghgVErZY214RkQ7ADyRUj72ff8qgCtmXUrZGcf5vv8CwEUhxOF0Ov1pBRpla5dSdseBhUJhpznH6tIsZb1KqacW+BGArUaUXX63UuplHJTNZjuEEONSyhozfd/n6mQ1RkXZL2itz7mu+80EDA4ONi8vL/8AcM2UbikyR2BU9cSmmTU70YqKIAj2hWFo2uenlHK/BRg3Y2aeNO5GyU8S0ZbFxcUuz/NKEXAGQKPjOCcymcyX1dIi8DSAiWQyeaavr68cbSgCuBknYubnQoj+TCYzUywWE6VS6S2ADsdx2gxw1X3L7SNENMbMnwE8qK+vf5NKpRaMaeVyeW8ikfiaSqW+R7BuZr5BRMe11p2u607U9Gk8kc/ntzPzQwCmExYATDLzVBiGE0KIowAOADDf3QA+aK2VDaxRajto3K+rq+tl5nYAzQBamHmeiOYBTGmtR6ph/1Rqg9c73pz7dD1qN0TpHyNQRCUDJXrAAAAAAElFTkSuQmCC',
  de =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAjtJREFUOE/NlD9oFEEUxn9v9ghC0hpRUogIAUmniGAT/5Q2FrETPSNRJILg7RwimI0ox85eQFCEBGIUO1PYpFM0jSConQoBEZGgGPsgl+w+2eM2bC57SopAFqYZ3v7m+977ZoQt+GQLmGxPaBiGgYiMWWvXBHZUGoZhH3BERPYC+4F+4Keq/urt7b1RLpf/ZEBVHa9Wq0HWyg3QKIoGVPU8cA7wgK/pUtXPQJ8xZk+pVBpuNBqXUoUiEvi+P56fzTpo6+SbwHNg1lo7WzTITGEKXFlZeeB53tVCpa3CK8AFa+1cBgvD8LKIXAQOJkkyICJDeYVBEJS6u7s/qeoLa+1o+l9TqXNuBLhmjDlbqVQ+5ICjInIfOBPH8W9jzGCR5YmJiRNxHM+papgqzqDvgSlr7VTernPuO3An3c9bBt74vv+yrdaKyLDv+/1Sq9UGPc97nY9EVuycU2AQOA7cAm4Dr4D5TvVxHB9rKo2iaEFVp621Ln96FEUngaOqGmSxabVqsh3a2h+x1h5qQjNrae/yE4+iaCwDJkky73neTuBZe129Xk+H+BS4l7ZqLVIZ2BhzuFKpvMsDVXXWGPMxFdAedOfcKeCRqj7MYrUhpz09PfXl5eXrectFWXXODQHpOq2qd/95o/JXr6ura3J1dXU6SZIfwKKIHAD2tVYMPBGRx77vN10UXtO85fTkmZmZHUtLSzUR2QXsBhaAL6r6DXhbrVYXi1yss59GqOgub/bN3Z7v6X/tb9Zmp/q/kN8s+lJb8oEAAAAASUVORK5CYII=',
  he = {
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
var ve = s.defineComponent({
    name: 'SketchRule',
    components: { RulerWrapper: ce },
    props: he,
    emits: ['onCornerClick', 'handleLine'],
    setup(e, { emit: n }) {
      let t = s.ref(!0)
      t.value = e.isShowReferLine
      const r = s.computed(() => {
          function d(a, o) {
            return (
              Object.keys(a).forEach(i => {
                i &&
                  a.hasOwnProperty(i) &&
                  (typeof o.key == 'object'
                    ? (a[i] = d(a[i], o[i]))
                    : o.hasOwnProperty(i) && (a[i] = o[i]))
              }),
              a
            )
          }
          return d(
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
        c = s.computed(() => (e.cornerActive ? ' active' : '')),
        h = s.computed(() => ({
          backgroundImage: t.value ? `url(${ue})` : `url(${de})`,
          width: e.thick + 'px',
          height: e.thick + 'px',
          borderRight: `1px solid ${r.value.borderColor}`,
          borderBottom: `1px solid ${r.value.borderColor}`
        }))
      return {
        isShowReferLine: t,
        paletteCpu: r,
        cornerActiveClass: c,
        cornerStyle: h,
        onCornerClick: d => {
          ;(t.value = !t.value), n('onCornerClick', d)
        }
      }
    }
  }),
  fe = function () {
    var e = this,
      n = e.$createElement,
      t = e._self._c || n
    return t(
      'div',
      { staticClass: 'style-ruler mb-ruler', attrs: { id: 'mb-ruler' } },
      [
        t('RulerWrapper', {
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
        t('RulerWrapper', {
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
        t('a', {
          staticClass: 'corner',
          class: e.cornerActiveClass,
          style: e.cornerStyle,
          on: { click: e.onCornerClick }
        })
      ],
      1
    )
  },
  me = []
const D = {}
var _e = S(ve, fe, me, !1, Ce, null, null, null)
function Ce(e) {
  for (let n in D) this[n] = D[n]
}
var T = (function () {
  return _e.exports
})()
exports.SketchRule = T
exports.default = T
