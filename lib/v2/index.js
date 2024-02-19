'use strict'
/*!
 * vue2 v1.3.15
 * 2024年2月Mon Feb 19 2024 15:43:36 GMT+0800 (中国标准时间)
 * 制作
 */ Object.defineProperties(exports, {
  __esModule: { value: !0 },
  [Symbol.toStringTag]: { value: 'Module' }
})
const i = require('vue-demi'),
  F = i.defineComponent({
    name: 'LineRuler',
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
    emits: ['onMouseDown', 'onRelease', 'onRemove'],
    setup(e, { emit: n }) {
      const t = i.ref(0),
        l = i.ref(!0)
      i.onMounted(() => {
        t.value = e.value
      })
      const s = (r) => {
          l.value = r >= 0
        },
        c = i.computed(() => {
          const r = (t.value - e.start) * e.scale
          s(r)
          const h = r + 'px'
          return e.vertical ? { top: h } : { left: h }
        }),
        d = i.computed(() => {
          var m
          const r = `1px solid ${(m = e.palette) == null ? void 0 : m.lineColor}`,
            h = e.vertical ? { borderTop: r } : { borderLeft: r }
          return {
            cursor: e.isShowReferLine ? (e.vertical ? 'ns-resize' : 'ew-resize') : 'none',
            ...h
          }
        }),
        f = i.computed(() => (e.vertical ? { left: e.thick + 'px' } : { top: e.thick + 'px' }))
      return {
        startValue: t,
        showLine: l,
        offset: c,
        borderCursor: d,
        actionStyle: f,
        handleDown: (r) => {
          const h = e.vertical ? r.clientY : r.clientX,
            u = t.value
          n('onMouseDown')
          const m = (C) => {
              const b = e.vertical ? C.clientY : C.clientX,
                R = Math.round(u + (b - h) / e.scale)
              t.value = R
            },
            N = () => {
              n('onRelease', t.value, e.index),
                document.removeEventListener('mousemove', m),
                document.removeEventListener('mouseup', N)
            }
          document.addEventListener('mousemove', m), document.addEventListener('mouseup', N)
        },
        handleRemove: () => {
          n('onRemove', e.index)
        }
      }
    }
  })
var x = function () {
    var e = this,
      n = e.$createElement,
      t = e._self._c || n
    return t(
      'div',
      {
        directives: [
          { name: 'show', rawName: 'v-show', value: e.showLine, expression: 'showLine' }
        ],
        staticClass: 'line',
        style: [e.offset, e.borderCursor],
        on: { mousedown: e.handleDown }
      },
      [
        t('div', { staticClass: 'action', style: e.actionStyle }, [
          t('span', { staticClass: 'del', on: { click: e.handleRemove } }, [e._v('×')]),
          t('span', { staticClass: 'value' }, [e._v(e._s(e.startValue))])
        ])
      ]
    )
  },
  M = []
function S(e, n, t, l, s, c, d, f) {
  var o = typeof e == 'function' ? e.options : e
  n && ((o.render = n), (o.staticRenderFns = t), (o._compiled = !0)),
    l && (o.functional = !0),
    c && (o._scopeId = 'data-v-' + c)
  var a
  if (
    (d
      ? ((a = function (u) {
          ;(u =
            u ||
            (this.$vnode && this.$vnode.ssrContext) ||
            (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext)),
            !u && typeof __VUE_SSR_CONTEXT__ < 'u' && (u = __VUE_SSR_CONTEXT__),
            s && s.call(this, u),
            u && u._registeredComponents && u._registeredComponents.add(d)
        }),
        (o._ssrRegister = a))
      : s &&
        (a = f
          ? function () {
              s.call(this, (o.functional ? this.parent : this).$root.$options.shadowRoot)
            }
          : s),
    a)
  )
    if (o.functional) {
      o._injectStyles = a
      var r = o.render
      o.render = function (m, N) {
        return a.call(N), r(m, N)
      }
    } else {
      var h = o.beforeCreate
      o.beforeCreate = h ? [].concat(h, a) : [a]
    }
  return { exports: e, options: o }
}
const Y = {}
var Q = S(F, x, M, !1, K, '37b219fd', null, null)
function K(e) {
  for (let n in Y) this[n] = Y[n]
}
const z = (function () {
    return Q.exports
  })(),
  P = (e) => (e <= 0.25 ? 40 : e <= 0.5 ? 20 : e <= 1 ? 10 : e <= 2 ? 5 : e <= 4 ? 2 : 1),
  U = 0.83,
  q = (e, n, t, l, s, c) => {
    const { scale: d, width: f, height: o, ratio: a, palette: r } = s,
      { bgColor: h, fontColor: u, shadowColor: m, longfgColor: N, shortfgColor: C } = r,
      b = c ? s.startNumX : s.startNumY,
      R = c ? s.endNumX : s.endNumY
    if ((e.scale(a, a), e.clearRect(0, 0, f, o), (e.fillStyle = h), e.fillRect(0, 0, f, o), l)) {
      const w = (t - n) * d,
        _ = l * d
      ;(e.fillStyle = m), c ? e.fillRect(w, 0, _, (o * 3) / 8) : e.fillRect(0, w, (f * 3) / 8, _)
    }
    const A = P(d),
      E = A * d,
      g = A * 10,
      X = g * d,
      B = Math.floor(n / A) * A,
      p = Math.floor(n / g) * g,
      T = ((B - n) / A) * E,
      $ = ((p - n) / g) * X,
      L = n + Math.ceil((c ? f : o) / d)
    e.beginPath(), (e.fillStyle = u), (e.strokeStyle = N)
    for (let w = p, _ = 0; w < L; w += g, _++) {
      if (w >= b && w <= R) {
        const v = $ + _ * X + 0.5
        c ? e.moveTo(v, 0) : e.moveTo(0, v),
          e.save(),
          c ? e.translate(v, o * 0.4) : e.translate(f * 0.4, v),
          c || e.rotate(-Math.PI / 2),
          e.scale(U / a, U / a),
          e.fillText(w.toString(), 4 * a, 7 * a),
          e.restore(),
          c ? e.lineTo(v, (o * 9) / 16) : e.lineTo((f * 9) / 16, v)
      }
      e.stroke(), e.closePath(), e.beginPath(), (e.strokeStyle = C)
      for (let v = B, k = 0; v < L; v += A, k++)
        if (v >= b && v <= R) {
          const y = T + k * E + 0.5
          c ? e.moveTo(y, 0) : e.moveTo(0, y),
            v % g !== 0 && (c ? e.lineTo(y, (o * 1) / 4) : e.lineTo((f * 1) / 4, y))
        }
      e.stroke(), e.closePath(), e.setTransform(1, 0, 0, 1, 0, 0)
    }
  },
  G = i.defineComponent({
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
      selectLength: Number,
      startNumX: Number,
      endNumX: Number,
      startNumY: Number,
      endNumY: Number
    },
    emits: ['onAddLine', 'update:showIndicator', 'update:valueNum'],
    setup(e, { emit: n }) {
      const t = i.reactive({ canvasContext: null })
      let l = 1
      const s = i.ref(null)
      i.onMounted(() => {
        ;(l = e.ratio || window.devicePixelRatio || 1), c(), d(l), f(l)
      })
      const c = () => {
          t.canvasContext = s.value && s.value.getContext('2d')
        },
        d = (a) => {
          if (s.value) {
            ;(s.value.width = e.width * a), (s.value.height = e.height * a)
            const r = t.canvasContext
            r &&
              ((r.font = `${12 * a}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`),
              (r.lineWidth = 1),
              (r.textBaseline = 'middle'))
          }
        },
        f = (a) => {
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
          }
          t.canvasContext &&
            q(t.canvasContext, e.start, e.selectStart, e.selectLength, r, !e.vertical)
        }
      return (
        i.watch(
          () => e.start,
          () => f(l)
        ),
        i.watch([() => e.width, () => e.height], () => {
          d(l), f(l)
        }),
        {
          handle: (a, r) => {
            const h = (N, C, b) => Math.round(C + N / b),
              u = e.vertical ? a.offsetY : a.offsetX,
              m = h(u, e.start, e.scale)
            switch (r) {
              case 'click':
                n('onAddLine', m)
                break
              case 'enter':
                n('update:valueNum', m), n('update:showIndicator', !0)
                break
              default:
                n('update:valueNum', m)
                break
            }
          },
          canvas: s
        }
      )
    }
  })
var H = function () {
    var e = this,
      n = e.$createElement,
      t = e._self._c || n
    return t('canvas', {
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
  W = []
const O = {}
var Z = S(G, H, W, !1, j, null, null, null)
function j(e) {
  for (let n in O) this[n] = O[n]
}
const J = (function () {
    return Z.exports
  })(),
  ee = {
    scale: Number,
    ratio: Number,
    thick: Number,
    startNumX: Number,
    endNumX: Number,
    startNumY: Number,
    endNumY: Number,
    palette: Object,
    vertical: { type: Boolean, default: !0 },
    width: { type: Number, default: 200 },
    height: { type: Number, default: 200 },
    start: { type: Number, default: 0 },
    lines: { type: Array, default: () => [] },
    selectStart: { type: Number },
    selectLength: { type: Number },
    isShowReferLine: { type: Boolean }
  },
  te = i.defineComponent({
    name: 'RulerWrapper',
    components: { CanvasRuler: J, RulerLine: z },
    props: ee,
    setup(e) {
      const n = i.ref(!1),
        t = i.ref(0),
        l = i.computed(() => (e.vertical ? 'v-container' : 'h-container')),
        s = i.computed(() => {
          const a = {
              width: `calc(100% - ${e.thick}px)`,
              height: `${e.thick + 1}px`,
              left: `${e.thick}px`
            },
            r = {
              width: `${e.thick && e.thick + 1}px`,
              height: `calc(100% - ${e.thick}px)`,
              top: `${e.thick}px`
            }
          return e.vertical ? r : a
        }),
        c = i.computed(() => {
          var u
          const a = (t.value - e.start) * e.scale
          let r = 'top',
            h = 'borderLeft'
          return (
            (r = e.vertical ? 'top' : 'left'),
            (h = e.vertical ? 'borderBottom' : 'borderLeft'),
            { [r]: a + 'px', [h]: `1px solid ${(u = e.palette) == null ? void 0 : u.lineColor}` }
          )
        }),
        d = (a) => {
          e.lines.push(a)
        },
        f = (a, r) => {
          const h = a - e.start,
            u = (e.vertical ? e.height : e.width) / e.scale
          h < 0 || h > u ? o(r) : (e.lines[r] = a)
        },
        o = (a) => {
          e.lines.splice(a, 1)
        }
      return {
        showIndicator: n,
        valueNum: t,
        rwClassName: l,
        rwStyle: s,
        indicatorStyle: c,
        handleNewLine: d,
        handleLineRelease: f,
        handleLineRemove: o
      }
    }
  })
var ne = function () {
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
            startNumX: e.startNumX,
            endNumX: e.endNumX,
            startNumY: e.startNumY,
            endNumY: e.endNumY,
            'select-start': e.selectStart,
            'select-length': e.selectLength,
            palette: e.palette
          },
          on: { 'on-addLine': e.handleNewLine },
          model: {
            value: e.showIndicator,
            callback: function (l) {
              e.showIndicator = l
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
          e._l(e.lines, function (l, s) {
            return t('RulerLine', {
              key: l + s,
              attrs: {
                index: s,
                value: l >> 0,
                scale: e.scale,
                start: e.start,
                thick: e.thick,
                palette: e.palette,
                vertical: e.vertical,
                'is-show-refer-line': e.isShowReferLine
              },
              on: { 'on-remove': e.handleLineRemove, 'on-release': e.handleLineRelease }
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
  ae = []
const I = {}
var re = S(te, ne, ae, !1, oe, 'f5c855b2', null, null)
function oe(e) {
  for (let n in I) this[n] = I[n]
}
const le = (function () {
    return re.exports
  })(),
  se =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAopJREFUOE/FlE9IVEEcx7+/N9ouds1Mu0QUSFZYdIgoUqQoKPBQHsKozpXE7jbTO/U8xLJvn6usBHWQ6hBFXupSkQeVbh0KJEPp0sH+eLGTsKs77xcj78m0ax0E8cHjzZv5zef3/c33xxA24KENYGJzoEEQbNNaN4Zh2OQ4znwYhr9c1/39vwrXVDo0NNS0tLR0GYB5D64BmAMwzMyvlFKz1es10Hw+f4mZ7wHYBeA9gNdENFepVOaEEM3M3OI4Thczn41gt6WUgQ3+C+r7/h0AWQD3mXnYqPA8L9nQ0HCemduIaFpKOWoAhUJhT6VSuQXgOjP3K6W8GLwKzeVyp4jonR0QBEErM48w8zFLyayUsjX+z+VyHhHdZebTSqkxM78CHRgYOKS1/ghgVErZY214RkQ7ADyRUj72ff8qgCtmXUrZGcf5vv8CwEUhxOF0Ov1pBRpla5dSdseBhUJhpznH6tIsZb1KqacW+BGArUaUXX63UuplHJTNZjuEEONSyhozfd/n6mQ1RkXZL2itz7mu+80EDA4ONi8vL/8AcM2UbikyR2BU9cSmmTU70YqKIAj2hWFo2uenlHK/BRg3Y2aeNO5GyU8S0ZbFxcUuz/NKEXAGQKPjOCcymcyX1dIi8DSAiWQyeaavr68cbSgCuBknYubnQoj+TCYzUywWE6VS6S2ADsdx2gxw1X3L7SNENMbMnwE8qK+vf5NKpRaMaeVyeW8ikfiaSqW+R7BuZr5BRMe11p2u607U9Gk8kc/ntzPzQwCmExYATDLzVBiGE0KIowAOADDf3QA+aK2VDaxRajto3K+rq+tl5nYAzQBamHmeiOYBTGmtR6ph/1Rqg9c73pz7dD1qN0TpHyNQRCUDJXrAAAAAAElFTkSuQmCC',
  ie =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAjtJREFUOE/NlD9oFEEUxn9v9ghC0hpRUogIAUmniGAT/5Q2FrETPSNRJILg7RwimI0ox85eQFCEBGIUO1PYpFM0jSConQoBEZGgGPsgl+w+2eM2bC57SopAFqYZ3v7m+977ZoQt+GQLmGxPaBiGgYiMWWvXBHZUGoZhH3BERPYC+4F+4Keq/urt7b1RLpf/ZEBVHa9Wq0HWyg3QKIoGVPU8cA7wgK/pUtXPQJ8xZk+pVBpuNBqXUoUiEvi+P56fzTpo6+SbwHNg1lo7WzTITGEKXFlZeeB53tVCpa3CK8AFa+1cBgvD8LKIXAQOJkkyICJDeYVBEJS6u7s/qeoLa+1o+l9TqXNuBLhmjDlbqVQ+5ICjInIfOBPH8W9jzGCR5YmJiRNxHM+papgqzqDvgSlr7VTernPuO3An3c9bBt74vv+yrdaKyLDv+/1Sq9UGPc97nY9EVuycU2AQOA7cAm4Dr4D5TvVxHB9rKo2iaEFVp621Ln96FEUngaOqGmSxabVqsh3a2h+x1h5qQjNrae/yE4+iaCwDJkky73neTuBZe129Xk+H+BS4l7ZqLVIZ2BhzuFKpvMsDVXXWGPMxFdAedOfcKeCRqj7MYrUhpz09PfXl5eXrectFWXXODQHpOq2qd/95o/JXr6ura3J1dXU6SZIfwKKIHAD2tVYMPBGRx77vN10UXtO85fTkmZmZHUtLSzUR2QXsBhaAL6r6DXhbrVYXi1yss59GqOgub/bN3Z7v6X/tb9Zmp/q/kN8s+lJb8oEAAAAASUVORK5CYII=',
  ue = {
    eyeIcon: { type: String },
    closeEyeIcon: { type: String },
    scale: { type: Number, default: 1 },
    ratio: { type: Number },
    thick: { type: Number, default: 16 },
    palette: Object,
    startX: { type: Number },
    startY: { type: Number, default: 0 },
    width: { type: Number, default: 200 },
    height: { type: Number, default: 200 },
    shadow: { type: Object, default: () => ({ x: 0, y: 0, width: 0, height: 0 }) },
    lines: { type: Object, default: () => ({ h: [], v: [] }) },
    isShowReferLine: { type: Boolean, default: !0 },
    startNumX: { type: Number, default: -1 / 0 },
    endNumX: { type: Number, default: 1 / 0 },
    startNumY: { type: Number, default: -1 / 0 },
    endNumY: { type: Number, default: 1 / 0 }
  },
  ce = i.defineComponent({
    name: 'SketchRule',
    components: { RulerWrapper: le },
    props: ue,
    emits: ['onCornerClick'],
    setup(e, { emit: n }) {
      let t = i.ref(!0)
      t.value = e.isShowReferLine
      const l = i.computed(() => {
          function d(o, a) {
            return (
              Object.keys(o).forEach((r) => {
                r &&
                  o.hasOwnProperty(r) &&
                  (typeof a[r] == 'object'
                    ? (o[r] = d(o[r], a[r]))
                    : a.hasOwnProperty(r) && (o[r] = a[r]))
              }),
              o
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
        s = i.computed(() => ({
          backgroundImage: t.value ? `url(${e.eyeIcon || se})` : `url(${e.closeEyeIcon || ie})`,
          width: e.thick + 'px',
          height: e.thick + 'px',
          borderRight: `1px solid ${l.value.borderColor}`,
          borderBottom: `1px solid ${l.value.borderColor}`
        })),
        c = (d) => {
          ;(t.value = !t.value), n('onCornerClick', t.value)
        }
      return (
        i.watch([() => e.isShowReferLine], () => {
          t.value = e.isShowReferLine
        }),
        { showReferLine: t, paletteCpu: l, cornerStyle: s, onCornerClick: c }
      )
    }
  })
var de = function () {
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
            'is-show-refer-line': e.showReferLine,
            thick: e.thick,
            ratio: e.ratio,
            start: e.startX,
            lines: e.lines.h,
            'select-start': e.shadow.x,
            'select-length': e.shadow.width,
            scale: e.scale,
            palette: e.paletteCpu,
            startNumX: e.startNumX,
            endNumX: e.endNumX
          }
        }),
        t('RulerWrapper', {
          attrs: {
            vertical: !0,
            width: e.thick,
            height: e.height,
            'is-show-refer-line': e.showReferLine,
            thick: e.thick,
            ratio: e.ratio,
            start: e.startY,
            lines: e.lines.v,
            'select-start': e.shadow.y,
            'select-length': e.shadow.height,
            scale: e.scale,
            palette: e.paletteCpu,
            startNumY: e.startNumY,
            endNumY: e.endNumY
          }
        }),
        t('a', { staticClass: 'corner', style: e.cornerStyle, on: { click: e.onCornerClick } })
      ],
      1
    )
  },
  he = []
const V = {}
var fe = S(ce, de, he, !1, me, null, null, null)
function me(e) {
  for (let n in V) this[n] = V[n]
}
const D = (function () {
  return fe.exports
})()
exports.SketchRule = D
exports.default = D
