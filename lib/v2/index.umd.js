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
   * 2024年2月Mon Feb 19 2024 15:43:36 GMT+0800 (中国标准时间)
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
        l = s.ref(!0)
      s.onMounted(() => {
        t.value = e.value
      })
      const i = (r) => {
          l.value = r >= 0
        },
        u = s.computed(() => {
          const r = (t.value - e.start) * e.scale
          i(r)
          const h = r + 'px'
          return e.vertical ? { top: h } : { left: h }
        }),
        d = s.computed(() => {
          var m
          const r = `1px solid ${(m = e.palette) == null ? void 0 : m.lineColor}`,
            h = e.vertical ? { borderTop: r } : { borderLeft: r }
          return {
            cursor: e.isShowReferLine ? (e.vertical ? 'ns-resize' : 'ew-resize') : 'none',
            ...h
          }
        }),
        f = s.computed(() => (e.vertical ? { left: e.thick + 'px' } : { top: e.thick + 'px' }))
      return {
        startValue: t,
        showLine: l,
        offset: u,
        borderCursor: d,
        actionStyle: f,
        handleDown: (r) => {
          const h = e.vertical ? r.clientY : r.clientX,
            c = t.value
          n('onMouseDown')
          const m = (b) => {
              const A = e.vertical ? b.clientY : b.clientX,
                S = Math.round(c + (A - h) / e.scale)
              t.value = S
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
  function y(e, n, t, l, i, u, d, f) {
    var o = typeof e == 'function' ? e.options : e
    n && ((o.render = n), (o.staticRenderFns = t), (o._compiled = !0)),
      l && (o.functional = !0),
      u && (o._scopeId = 'data-v-' + u)
    var a
    if (
      (d
        ? ((a = function (c) {
            ;(c =
              c ||
              (this.$vnode && this.$vnode.ssrContext) ||
              (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext)),
              !c && typeof __VUE_SSR_CONTEXT__ < 'u' && (c = __VUE_SSR_CONTEXT__),
              i && i.call(this, c),
              c && c._registeredComponents && c._registeredComponents.add(d)
          }),
          (o._ssrRegister = a))
        : i &&
          (a = f
            ? function () {
                i.call(this, (o.functional ? this.parent : this).$root.$options.shadowRoot)
              }
            : i),
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
  const E = {}
  var Q = y(F, x, M, !1, K, '37b219fd', null, null)
  function K(e) {
    for (let n in E) this[n] = E[n]
  }
  const z = (function () {
      return Q.exports
    })(),
    P = (e) => (e <= 0.25 ? 40 : e <= 0.5 ? 20 : e <= 1 ? 10 : e <= 2 ? 5 : e <= 4 ? 2 : 1),
    X = 0.83,
    q = (e, n, t, l, i, u) => {
      const { scale: d, width: f, height: o, ratio: a, palette: r } = i,
        { bgColor: h, fontColor: c, shadowColor: m, longfgColor: N, shortfgColor: b } = r,
        A = u ? i.startNumX : i.startNumY,
        S = u ? i.endNumX : i.endNumY
      if ((e.scale(a, a), e.clearRect(0, 0, f, o), (e.fillStyle = h), e.fillRect(0, 0, f, o), l)) {
        const C = (t - n) * d,
          R = l * d
        ;(e.fillStyle = m), u ? e.fillRect(C, 0, R, (o * 3) / 8) : e.fillRect(0, C, (f * 3) / 8, R)
      }
      const g = P(d),
        U = g * d,
        _ = g * 10,
        O = _ * d,
        I = Math.floor(n / g) * g,
        V = Math.floor(n / _) * _,
        me = ((I - n) / g) * U,
        ve = ((V - n) / _) * O,
        T = n + Math.ceil((u ? f : o) / d)
      e.beginPath(), (e.fillStyle = c), (e.strokeStyle = N)
      for (let C = V, R = 0; C < T; C += _, R++) {
        if (C >= A && C <= S) {
          const v = ve + R * O + 0.5
          u ? e.moveTo(v, 0) : e.moveTo(0, v),
            e.save(),
            u ? e.translate(v, o * 0.4) : e.translate(f * 0.4, v),
            u || e.rotate(-Math.PI / 2),
            e.scale(X / a, X / a),
            e.fillText(C.toString(), 4 * a, 7 * a),
            e.restore(),
            u ? e.lineTo(v, (o * 9) / 16) : e.lineTo((f * 9) / 16, v)
        }
        e.stroke(), e.closePath(), e.beginPath(), (e.strokeStyle = b)
        for (let v = I, $ = 0; v < T; v += g, $++)
          if (v >= A && v <= S) {
            const p = me + $ * U + 0.5
            u ? e.moveTo(p, 0) : e.moveTo(0, p),
              v % _ !== 0 && (u ? e.lineTo(p, (o * 1) / 4) : e.lineTo((f * 1) / 4, p))
          }
        e.stroke(), e.closePath(), e.setTransform(1, 0, 0, 1, 0, 0)
      }
    },
    G = s.defineComponent({
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
        let l = 1
        const i = s.ref(null)
        s.onMounted(() => {
          ;(l = e.ratio || window.devicePixelRatio || 1), u(), d(l), f(l)
        })
        const u = () => {
            t.canvasContext = i.value && i.value.getContext('2d')
          },
          d = (a) => {
            if (i.value) {
              ;(i.value.width = e.width * a), (i.value.height = e.height * a)
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
          s.watch(
            () => e.start,
            () => f(l)
          ),
          s.watch([() => e.width, () => e.height], () => {
            d(l), f(l)
          }),
          {
            handle: (a, r) => {
              const h = (N, b, A) => Math.round(b + N / A),
                c = e.vertical ? a.offsetY : a.offsetX,
                m = h(c, e.start, e.scale)
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
            canvas: i
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
  const B = {}
  var Z = y(G, H, W, !1, j, null, null, null)
  function j(e) {
    for (let n in B) this[n] = B[n]
  }
  const D = (function () {
      return Z.exports
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
          l = s.computed(() => (e.vertical ? 'v-container' : 'h-container')),
          i = s.computed(() => {
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
          u = s.computed(() => {
            var c
            const a = (t.value - e.start) * e.scale
            let r = 'top',
              h = 'borderLeft'
            return (
              (r = e.vertical ? 'top' : 'left'),
              (h = e.vertical ? 'borderBottom' : 'borderLeft'),
              { [r]: a + 'px', [h]: `1px solid ${(c = e.palette) == null ? void 0 : c.lineColor}` }
            )
          }),
          d = (a) => {
            e.lines.push(a)
          },
          f = (a, r) => {
            const h = a - e.start,
              c = (e.vertical ? e.height : e.width) / e.scale
            h < 0 || h > c ? o(r) : (e.lines[r] = a)
          },
          o = (a) => {
            e.lines.splice(a, 1)
          }
        return {
          showIndicator: n,
          valueNum: t,
          rwClassName: l,
          rwStyle: i,
          indicatorStyle: u,
          handleNewLine: d,
          handleLineRelease: f,
          handleLineRemove: o
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
            e._l(e.lines, function (l, i) {
              return t('RulerLine', {
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
  const L = {}
  var ae = y(ee, te, ne, !1, re, 'f5c855b2', null, null)
  function re(e) {
    for (let n in L) this[n] = L[n]
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
        const l = s.computed(() => {
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
          i = s.computed(() => ({
            backgroundImage: t.value ? `url(${e.eyeIcon || le})` : `url(${e.closeEyeIcon || se})`,
            width: e.thick + 'px',
            height: e.thick + 'px',
            borderRight: `1px solid ${l.value.borderColor}`,
            borderBottom: `1px solid ${l.value.borderColor}`
          })),
          u = (d) => {
            ;(t.value = !t.value), n('onCornerClick', t.value)
          }
        return (
          s.watch([() => e.isShowReferLine], () => {
            t.value = e.isShowReferLine
          }),
          { showReferLine: t, paletteCpu: l, cornerStyle: i, onCornerClick: u }
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
  var he = y(ce, ue, de, !1, fe, null, null, null)
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
