;(function (w, s) {
  typeof exports == 'object' && typeof module < 'u'
    ? s(exports, require('vue-demi'))
    : typeof define == 'function' && define.amd
      ? define(['exports', 'vue-demi'], s)
      : ((w = typeof globalThis < 'u' ? globalThis : w || self), s((w.SketchRuler = {}), w.vueDemi))
})(this, function (w, s) {
  'use strict'
  /*!
   * vue2 v1.3.15
   * 2024年9月Wed Sep 04 2024 11:21:46 GMT+0800 (中国标准时间)
   * 制作
   */ const F = s.defineComponent({
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
      const t = s.ref(0),
        o = s.ref(!0)
      s.onMounted(() => {
        t.value = e.value
      })
      const i = (a) => {
          o.value = a >= 0
        },
        c = s.computed(() => {
          const a = (t.value - e.start) * e.scale
          i(a)
          const u = a + 'px'
          return e.vertical ? { top: u } : { left: u }
        }),
        d = s.computed(() => {
          var m
          const a = `1px solid ${(m = e.palette) == null ? void 0 : m.lineColor}`,
            u = e.vertical ? { borderTop: a } : { borderLeft: a }
          return {
            cursor: e.isShowReferLine ? (e.vertical ? 'ns-resize' : 'ew-resize') : 'none',
            ...u
          }
        }),
        h = s.computed(() => (e.vertical ? { left: e.thick + 'px' } : { top: e.thick + 'px' }))
      return {
        startValue: t,
        showLine: o,
        offset: c,
        borderCursor: d,
        actionStyle: h,
        handleDown: (a) => {
          const u = e.vertical ? a.clientY : a.clientX,
            f = t.value
          n('onMouseDown')
          const m = (C) => {
              const A = e.vertical ? C.clientY : C.clientX,
                _ = Math.round(f + (A - u) / e.scale)
              t.value = _
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
  var M = function () {
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
    Q = []
  function S(e, n, t, o, i, c, d, h) {
    var l = typeof e == 'function' ? e.options : e
    n && ((l.render = n), (l.staticRenderFns = t), (l._compiled = !0)),
      c && (l._scopeId = 'data-v-' + c)
    var r
    if ((i && (r = i), r))
      if (l.functional) {
        l._injectStyles = r
        var a = l.render
        l.render = function (m, N) {
          return r.call(N), a(m, N)
        }
      } else {
        var u = l.beforeCreate
        l.beforeCreate = u ? [].concat(u, r) : [r]
      }
    return { exports: e, options: l }
  }
  const B = {}
  var K = S(F, M, Q, !1, $, '37b219fd')
  function $(e) {
    for (let n in B) this[n] = B[n]
  }
  const z = (function () {
      return K.exports
    })(),
    P = (e) => (e <= 0.25 ? 40 : e <= 0.5 ? 20 : e <= 1 ? 10 : e <= 2 ? 5 : e <= 4 ? 2 : 1),
    E = 0.83,
    j = (e, n, t, o, i, c) => {
      const { scale: d, width: h, height: l, ratio: r, palette: a } = i,
        { bgColor: u, fontColor: f, shadowColor: m, longfgColor: N, shortfgColor: C } = a,
        A = c ? i.startNumX : i.startNumY,
        _ = c ? i.endNumX : i.endNumY
      if ((e.scale(r, r), e.clearRect(0, 0, h, l), (e.fillStyle = u), e.fillRect(0, 0, h, l), o)) {
        const b = (t - n) * d,
          R = o * d
        ;(e.fillStyle = m), c ? e.fillRect(b, 0, R, (l * 3) / 8) : e.fillRect(0, b, (h * 3) / 8, R)
      }
      const g = P(d),
        I = g * d,
        y = g * 10,
        U = y * d,
        O = Math.floor(n / g) * g,
        x = Math.floor(n / y) * y,
        me = ((O - n) / g) * I,
        ve = ((x - n) / y) * U,
        V = n + Math.ceil((c ? h : l) / d)
      e.beginPath(), (e.fillStyle = f), (e.strokeStyle = N)
      for (let b = x, R = 0; b < V; b += y, R++) {
        if (b >= A && b <= _) {
          const v = ve + R * U + 0.5
          c ? e.moveTo(v, 0) : e.moveTo(0, v),
            e.save(),
            c ? e.translate(v, l * 0.4) : e.translate(h * 0.4, v),
            c || e.rotate(-Math.PI / 2),
            e.scale(E / r, E / r),
            e.fillText(b.toString(), 4 * r, 7 * r),
            e.restore(),
            c ? e.lineTo(v, (l * 9) / 16) : e.lineTo((h * 9) / 16, v)
        }
        e.stroke(), e.closePath(), e.beginPath(), (e.strokeStyle = C)
        for (let v = O, T = 0; v < V; v += g, T++)
          if (v >= A && v <= _) {
            const X = me + T * I + 0.5
            c ? e.moveTo(X, 0) : e.moveTo(0, X),
              v % y !== 0 && (c ? e.lineTo(X, (l * 1) / 4) : e.lineTo((h * 1) / 4, X))
          }
        e.stroke(), e.closePath(), e.setTransform(1, 0, 0, 1, 0, 0)
      }
    },
    q = s.defineComponent({
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
        const t = s.reactive({ canvasContext: null })
        let o = 1
        const i = s.ref(null)
        s.onMounted(() => {
          ;(o = e.ratio || window.devicePixelRatio || 1), c(), d(o), h(o)
        })
        const c = () => {
            t.canvasContext = i.value && i.value.getContext('2d')
          },
          d = (r) => {
            if (i.value) {
              ;(i.value.width = e.width * r), (i.value.height = e.height * r)
              const a = t.canvasContext
              a &&
                ((a.font = `${12 * r}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`),
                (a.lineWidth = 1),
                (a.textBaseline = 'middle'))
            }
          },
          h = (r) => {
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
            }
            t.canvasContext &&
              j(t.canvasContext, e.start, e.selectStart, e.selectLength, a, !e.vertical)
          }
        return (
          s.watch(
            () => e.start,
            () => h(o)
          ),
          s.watch([() => e.width, () => e.height], () => {
            d(o), h(o)
          }),
          {
            handle: (r, a) => {
              const u = (N, C, A) => Math.round(C + N / A),
                f = e.vertical ? r.offsetY : r.offsetX,
                m = u(f, e.start, e.scale)
              switch (a) {
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
            canvas: i
          }
        )
      }
    })
  var G = function () {
      var e = this,
        n = e.$createElement,
        t = e._self._c || n
      return t('canvas', {
        ref: 'canvas',
        staticClass: 'ruler',
        on: {
          click: function (o) {
            return e.handle(o, 'click')
          },
          mouseenter: function (o) {
            return e.handle(o, 'enter')
          },
          mousemove: function (o) {
            return e.handle(o, 'move')
          },
          mouseleave: function (o) {
            return e.$emit('update:showIndicator', !1)
          }
        }
      })
    },
    H = []
  const L = {}
  var W = S(q, G, H, !1, Z, null)
  function Z(e) {
    for (let n in L) this[n] = L[n]
  }
  const D = (function () {
      return W.exports
    })(),
    J = {
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
    ee = s.defineComponent({
      name: 'RulerWrapper',
      components: { CanvasRuler: D, RulerLine: z },
      props: J,
      setup(e) {
        const n = s.ref(!1),
          t = s.ref(0),
          o = s.computed(() => (e.vertical ? 'v-container' : 'h-container')),
          i = s.computed(() => {
            const r = {
                width: `calc(100% - ${e.thick}px)`,
                height: `${e.thick + 1}px`,
                left: `${e.thick}px`
              },
              a = {
                width: `${e.thick && e.thick + 1}px`,
                height: `calc(100% - ${e.thick}px)`,
                top: `${e.thick}px`
              }
            return e.vertical ? a : r
          }),
          c = s.computed(() => {
            var f
            const r = (t.value - e.start) * e.scale
            let a = 'top',
              u = 'borderLeft'
            return (
              (a = e.vertical ? 'top' : 'left'),
              (u = e.vertical ? 'borderBottom' : 'borderLeft'),
              { [a]: r + 'px', [u]: `1px solid ${(f = e.palette) == null ? void 0 : f.lineColor}` }
            )
          }),
          d = (r) => {
            e.lines.push(r)
          },
          h = (r, a) => {
            const u = r - e.start,
              f = (e.vertical ? e.height : e.width) / e.scale
            u < 0 || u > f ? l(a) : (e.lines[a] = r)
          },
          l = (r) => {
            e.lines.splice(r, 1)
          }
        return {
          showIndicator: n,
          valueNum: t,
          rwClassName: o,
          rwStyle: i,
          indicatorStyle: c,
          handleNewLine: d,
          handleLineRelease: h,
          handleLineRemove: l
        }
      }
    })
  var te = function () {
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
              callback: function (o) {
                e.showIndicator = o
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
            e._l(e.lines, function (o, i) {
              return t('RulerLine', {
                key: o + i,
                attrs: {
                  index: i,
                  value: o >> 0,
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
    ne = []
  const p = {}
  var ae = S(ee, te, ne, !1, re, 'f5c855b2')
  function re(e) {
    for (let n in p) this[n] = p[n]
  }
  const oe = (function () {
      return ae.exports
    })(),
    le =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAopJREFUOE/FlE9IVEEcx7+/N9ouds1Mu0QUSFZYdIgoUqQoKPBQHsKozpXE7jbTO/U8xLJvn6usBHWQ6hBFXupSkQeVbh0KJEPp0sH+eLGTsKs77xcj78m0ax0E8cHjzZv5zef3/c33xxA24KENYGJzoEEQbNNaN4Zh2OQ4znwYhr9c1/39vwrXVDo0NNS0tLR0GYB5D64BmAMwzMyvlFKz1es10Hw+f4mZ7wHYBeA9gNdENFepVOaEEM3M3OI4Thczn41gt6WUgQ3+C+r7/h0AWQD3mXnYqPA8L9nQ0HCemduIaFpKOWoAhUJhT6VSuQXgOjP3K6W8GLwKzeVyp4jonR0QBEErM48w8zFLyayUsjX+z+VyHhHdZebTSqkxM78CHRgYOKS1/ghgVErZY214RkQ7ADyRUj72ff8qgCtmXUrZGcf5vv8CwEUhxOF0Ov1pBRpla5dSdseBhUJhpznH6tIsZb1KqacW+BGArUaUXX63UuplHJTNZjuEEONSyhozfd/n6mQ1RkXZL2itz7mu+80EDA4ONi8vL/8AcM2UbikyR2BU9cSmmTU70YqKIAj2hWFo2uenlHK/BRg3Y2aeNO5GyU8S0ZbFxcUuz/NKEXAGQKPjOCcymcyX1dIi8DSAiWQyeaavr68cbSgCuBknYubnQoj+TCYzUywWE6VS6S2ADsdx2gxw1X3L7SNENMbMnwE8qK+vf5NKpRaMaeVyeW8ikfiaSqW+R7BuZr5BRMe11p2u607U9Gk8kc/ntzPzQwCmExYATDLzVBiGE0KIowAOADDf3QA+aK2VDaxRajto3K+rq+tl5nYAzQBamHmeiOYBTGmtR6ph/1Rqg9c73pz7dD1qN0TpHyNQRCUDJXrAAAAAAElFTkSuQmCC',
    se =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAjtJREFUOE/NlD9oFEEUxn9v9ghC0hpRUogIAUmniGAT/5Q2FrETPSNRJILg7RwimI0ox85eQFCEBGIUO1PYpFM0jSConQoBEZGgGPsgl+w+2eM2bC57SopAFqYZ3v7m+977ZoQt+GQLmGxPaBiGgYiMWWvXBHZUGoZhH3BERPYC+4F+4Keq/urt7b1RLpf/ZEBVHa9Wq0HWyg3QKIoGVPU8cA7wgK/pUtXPQJ8xZk+pVBpuNBqXUoUiEvi+P56fzTpo6+SbwHNg1lo7WzTITGEKXFlZeeB53tVCpa3CK8AFa+1cBgvD8LKIXAQOJkkyICJDeYVBEJS6u7s/qeoLa+1o+l9TqXNuBLhmjDlbqVQ+5ICjInIfOBPH8W9jzGCR5YmJiRNxHM+papgqzqDvgSlr7VTernPuO3An3c9bBt74vv+yrdaKyLDv+/1Sq9UGPc97nY9EVuycU2AQOA7cAm4Dr4D5TvVxHB9rKo2iaEFVp621Ln96FEUngaOqGmSxabVqsh3a2h+x1h5qQjNrae/yE4+iaCwDJkky73neTuBZe129Xk+H+BS4l7ZqLVIZ2BhzuFKpvMsDVXXWGPMxFdAedOfcKeCRqj7MYrUhpz09PfXl5eXrectFWXXODQHpOq2qd/95o/JXr6ura3J1dXU6SZIfwKKIHAD2tVYMPBGRx77vN10UXtO85fTkmZmZHUtLSzUR2QXsBhaAL6r6DXhbrVYXi1yss59GqOgub/bN3Z7v6X/tb9Zmp/q/kN8s+lJb8oEAAAAASUVORK5CYII=',
    ie = {
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
    ce = s.defineComponent({
      name: 'SketchRule',
      components: { RulerWrapper: oe },
      props: ie,
      emits: ['onCornerClick'],
      setup(e, { emit: n }) {
        let t = s.ref(!0)
        t.value = e.isShowReferLine
        const o = s.computed(() => {
            function d(l, r) {
              return (
                Object.keys(l).forEach((a) => {
                  a &&
                    l.hasOwnProperty(a) &&
                    (typeof r[a] == 'object'
                      ? (l[a] = d(l[a], r[a]))
                      : r.hasOwnProperty(a) && (l[a] = r[a]))
                }),
                l
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
          i = s.computed(() => ({
            backgroundImage: t.value ? `url(${e.eyeIcon || le})` : `url(${e.closeEyeIcon || se})`,
            width: e.thick + 'px',
            height: e.thick + 'px',
            borderRight: `1px solid ${o.value.borderColor}`,
            borderBottom: `1px solid ${o.value.borderColor}`
          })),
          c = (d) => {
            ;(t.value = !t.value), n('onCornerClick', t.value)
          }
        return (
          s.watch([() => e.isShowReferLine], () => {
            t.value = e.isShowReferLine
          }),
          { showReferLine: t, paletteCpu: o, cornerStyle: i, onCornerClick: c }
        )
      }
    })
  var ue = function () {
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
    de = []
  const k = {}
  var he = S(ce, ue, de, !1, fe, null)
  function fe(e) {
    for (let n in k) this[n] = k[n]
  }
  const Y = (function () {
    return he.exports
  })()
  ;(w.SketchRule = Y),
    (w.default = Y),
    Object.defineProperties(w, {
      __esModule: { value: !0 },
      [Symbol.toStringTag]: { value: 'Module' }
    })
})
