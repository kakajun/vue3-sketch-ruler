var _e = Object.defineProperty
var $ = Object.getOwnPropertySymbols
var Ce = Object.prototype.hasOwnProperty,
  we = Object.prototype.propertyIsEnumerable
var x = (f, a, _) =>
    a in f
      ? _e(f, a, { enumerable: !0, configurable: !0, writable: !0, value: _ })
      : (f[a] = _),
  F = (f, a) => {
    for (var _ in a || (a = {})) Ce.call(a, _) && x(f, _, a[_])
    if ($) for (var _ of $(a)) we.call(a, _) && x(f, _, a[_])
    return f
  }
/*!
 * vue2 v1.3.1-bata
 * 2022年1月Wed Jan 19 2022 21:09:58 GMT+0800 (中国标准时间)
 * 制作
 */ ;(function (f, a) {
  typeof exports == 'object' && typeof module != 'undefined'
    ? a(exports, require('vue-demi'))
    : typeof define == 'function' && define.amd
    ? define(['exports', 'vue-demi'], a)
    : ((f = typeof globalThis != 'undefined' ? globalThis : f || self),
      a((f.SketchRuler = {}), f.vueDemi))
})(this, function (f, a) {
  'use strict'
  const _ = {
    scale: Number,
    thick: Number,
    palette: Object,
    index: Number,
    start: Number,
    vertical: Boolean,
    value: Number,
    isShowReferLine: Boolean
  }
  var I = a.defineComponent({
      name: 'LineRuler',
      props: _,
      emits: ['onMouseDown', 'onRelease', 'onRemove'],
      setup(e, { emit: o }) {
        const n = a.ref(0),
          l = a.ref(!0)
        a.onMounted(() => {
          n.value = e.value
        })
        const c = r => {
            l.value = r >= 0
          },
          h = a.computed(() => {
            const r = (n.value - e.start) * e.scale
            c(r)
            const i = r + 'px'
            return e.vertical ? { top: i } : { left: i }
          }),
          v = a.computed(() => {
            var m
            const r = `1px solid ${
                (m = e.palette) == null ? void 0 : m.lineColor
              }`,
              i = e.vertical ? { borderTop: r } : { borderLeft: r },
              u = e.isShowReferLine
                ? e.vertical
                  ? 'ns-resize'
                  : 'ew-resize'
                : 'none'
            return F({ cursor: u }, i)
          }),
          d = a.computed(() =>
            e.vertical ? { left: e.thick + 'px' } : { top: e.thick + 'px' }
          )
        return {
          startValue: n,
          showLine: l,
          offset: h,
          borderCursor: v,
          actionStyle: d,
          handleDown: r => {
            const i = e.vertical ? r.clientY : r.clientX,
              u = n.value
            o('onMouseDown')
            const m = R => {
                const w = e.vertical ? R.clientY : R.clientX,
                  y = Math.round(u + (w - i) / e.scale)
                n.value = y
              },
              g = () => {
                o('onRelease', n.value, e.index),
                  document.removeEventListener('mousemove', m),
                  document.removeEventListener('mouseup', g)
              }
            document.addEventListener('mousemove', m),
              document.addEventListener('mouseup', g)
          },
          handleRemove: () => {
            o('onRemove', e.index)
          }
        }
      }
    }),
    M = function () {
      var e = this,
        o = e.$createElement,
        n = e._self._c || o
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
    Q = [],
    Ae = ''
  function S(e, o, n, l, c, h, v, d) {
    var s = typeof e == 'function' ? e.options : e
    o && ((s.render = o), (s.staticRenderFns = n), (s._compiled = !0)),
      l && (s.functional = !0),
      h && (s._scopeId = 'data-v-' + h)
    var t
    if (
      (v
        ? ((t = function (u) {
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
          (s._ssrRegister = t))
        : c &&
          (t = d
            ? function () {
                c.call(
                  this,
                  (s.functional ? this.parent : this).$root.$options.shadowRoot
                )
              }
            : c),
      t)
    )
      if (s.functional) {
        s._injectStyles = t
        var r = s.render
        s.render = function (m, g) {
          return t.call(g), r(m, g)
        }
      } else {
        var i = s.beforeCreate
        s.beforeCreate = i ? [].concat(i, t) : [t]
      }
    return { exports: e, options: s }
  }
  const N = {}
  var K = S(I, M, Q, !1, P, '7d1eeed0', null, null)
  function P(e) {
    for (let o in N) this[o] = N[o]
  }
  var Y = (function () {
    return K.exports
  })()
  const z = e =>
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
    B = 0.83,
    W = (e, o, n, l, c, h) => {
      const { scale: v, width: d, height: s, ratio: t, palette: r } = c,
        {
          bgColor: i,
          fontColor: u,
          shadowColor: m,
          longfgColor: g,
          shortfgColor: R
        } = r
      if (
        (e.scale(t, t),
        e.clearRect(0, 0, d, s),
        (e.fillStyle = i),
        e.fillRect(0, 0, d, s),
        l)
      ) {
        const A = (n - o) * v,
          b = l * v
        ;(e.fillStyle = m),
          h
            ? e.fillRect(A, 0, b, (s * 3) / 8)
            : e.fillRect(0, A, (d * 3) / 8, b)
      }
      const w = z(v),
        y = w * v,
        p = w * 10,
        O = p * v,
        X = Math.floor(o / w) * w,
        T = Math.floor(o / p) * p,
        ve = ((X - o) / w) * y,
        me = ((T - o) / p) * O,
        V = o + Math.ceil((h ? d : s) / v)
      e.beginPath(), (e.fillStyle = u), (e.strokeStyle = g)
      for (let A = T, b = 0; A < V; A += p, b++) {
        const C = me + b * O + 0.5
        h ? e.moveTo(C, 0) : e.moveTo(0, C),
          e.save(),
          h ? e.translate(C, s * 0.4) : e.translate(d * 0.4, C),
          h || e.rotate(-Math.PI / 2),
          e.scale(B / t, B / t),
          e.fillText(A.toString(), 4 * t, 7 * t),
          e.restore(),
          h ? e.lineTo(C, (s * 9) / 16) : e.lineTo((d * 9) / 16, C)
      }
      e.stroke(), e.closePath(), e.beginPath(), (e.strokeStyle = R)
      for (let A = X, b = 0; A < V; A += w, b++) {
        const C = ve + b * y + 0.5
        h ? e.moveTo(C, 0) : e.moveTo(0, C),
          A % p != 0 &&
            (h ? e.lineTo(C, (s * 1) / 4) : e.lineTo((d * 1) / 4, C))
      }
      e.stroke(), e.closePath(), e.setTransform(1, 0, 0, 1, 0, 0)
    }
  var q = a.defineComponent({
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
      setup(e, { emit: o }) {
        const n = a.reactive({ canvasContext: null })
        let l = 1
        const c = a.ref(null)
        a.onMounted(() => {
          ;(l = e.ratio || window.devicePixelRatio || 1), h(), v(l), d(l)
        })
        const h = () => {
            n.canvasContext = c.value && c.value.getContext('2d')
          },
          v = t => {
            if (c.value) {
              ;(c.value.width = e.width * t), (c.value.height = e.height * t)
              const r = n.canvasContext
              r &&
                ((r.font = `${12 * t}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`),
                (r.lineWidth = 1),
                (r.textBaseline = 'middle'))
            }
          },
          d = t => {
            const r = {
              scale: e.scale,
              width: e.width,
              height: e.height,
              palette: e.palette,
              ratio: t
            }
            n.canvasContext &&
              W(
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
            () => d(l)
          ),
          a.watch([() => e.width, () => e.height], () => {
            v(l), d(l)
          }),
          {
            handle: (t, r) => {
              const i = (g, R, w) => Math.round(R + g / w),
                u = e.vertical ? t.offsetY : t.offsetX,
                m = i(u, e.start, e.scale)
              switch (r) {
                case 'click':
                  o('onAddLine', m)
                  break
                case 'enter':
                  o('update:valueNum', m), o('update:showIndicator', !0)
                  break
                default:
                  o('update:valueNum', m)
                  break
              }
            },
            canvas: c
          }
        )
      }
    }),
    G = function () {
      var e = this,
        o = e.$createElement,
        n = e._self._c || o
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
    H = []
  const E = {}
  var Z = S(q, G, H, !1, j, null, null, null)
  function j(e) {
    for (let o in E) this[o] = E[o]
  }
  var D = (function () {
    return Z.exports
  })()
  const J = {
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
      components: { CanvasRuler: D, RulerLine: Y },
      props: J,
      setup(e) {
        const o = a.ref(!1),
          n = a.ref(0),
          l = a.computed(() => (e.vertical ? 'v-container' : 'h-container')),
          c = a.computed(() => {
            const t = {
                width: `calc(100% - ${e.thick}px)`,
                height: `${e.thick + 1}px`,
                left: `${e.thick}px`
              },
              r = {
                width: `${e.thick && e.thick + 1}px`,
                height: `calc(100% - ${e.thick}px)`,
                top: `${e.thick}px`
              }
            return e.vertical ? r : t
          }),
          h = a.computed(() => {
            var u
            const t = (n.value - e.start) * e.scale
            let r = 'top',
              i = 'borderLeft'
            return (
              (r = e.vertical ? 'top' : 'left'),
              (i = e.vertical ? 'borderBottom' : 'borderLeft'),
              {
                [r]: t + 'px',
                [i]: `1px solid ${
                  (u = e.palette) == null ? void 0 : u.lineColor
                }`
              }
            )
          }),
          v = t => {
            e.lines.push(t)
          },
          d = (t, r) => {
            const i = t - e.start,
              u = (e.vertical ? e.height : e.width) / e.scale
            i < 0 || i > u ? s(r) : (e.lines[r] = t)
          },
          s = t => {
            e.lines.splice(t, 1)
          }
        return {
          showIndicator: o,
          valueNum: n,
          rwClassName: l,
          rwStyle: c,
          indicatorStyle: h,
          handleNewLine: v,
          handleLineRelease: d,
          handleLineRemove: s
        }
      }
    }),
    te = function () {
      var e = this,
        o = e.$createElement,
        n = e._self._c || o
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
            e._l(e.lines, function (l, c) {
              return n('RulerLine', {
                key: l + c,
                attrs: {
                  index: c,
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
    ne = [],
    ge = ''
  const k = {}
  var oe = S(ee, te, ne, !1, ae, '271f0665', null, null)
  function ae(e) {
    for (let o in k) this[o] = k[o]
  }
  var re = (function () {
    return oe.exports
  })()
  const le =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAopJREFUOE/FlE9IVEEcx7+/N9ouds1Mu0QUSFZYdIgoUqQoKPBQHsKozpXE7jbTO/U8xLJvn6usBHWQ6hBFXupSkQeVbh0KJEPp0sH+eLGTsKs77xcj78m0ax0E8cHjzZv5zef3/c33xxA24KENYGJzoEEQbNNaN4Zh2OQ4znwYhr9c1/39vwrXVDo0NNS0tLR0GYB5D64BmAMwzMyvlFKz1es10Hw+f4mZ7wHYBeA9gNdENFepVOaEEM3M3OI4Thczn41gt6WUgQ3+C+r7/h0AWQD3mXnYqPA8L9nQ0HCemduIaFpKOWoAhUJhT6VSuQXgOjP3K6W8GLwKzeVyp4jonR0QBEErM48w8zFLyayUsjX+z+VyHhHdZebTSqkxM78CHRgYOKS1/ghgVErZY214RkQ7ADyRUj72ff8qgCtmXUrZGcf5vv8CwEUhxOF0Ov1pBRpla5dSdseBhUJhpznH6tIsZb1KqacW+BGArUaUXX63UuplHJTNZjuEEONSyhozfd/n6mQ1RkXZL2itz7mu+80EDA4ONi8vL/8AcM2UbikyR2BU9cSmmTU70YqKIAj2hWFo2uenlHK/BRg3Y2aeNO5GyU8S0ZbFxcUuz/NKEXAGQKPjOCcymcyX1dIi8DSAiWQyeaavr68cbSgCuBknYubnQoj+TCYzUywWE6VS6S2ADsdx2gxw1X3L7SNENMbMnwE8qK+vf5NKpRaMaeVyeW8ikfiaSqW+R7BuZr5BRMe11p2u607U9Gk8kc/ntzPzQwCmExYATDLzVBiGE0KIowAOADDf3QA+aK2VDaxRajto3K+rq+tl5nYAzQBamHmeiOYBTGmtR6ph/1Rqg9c73pz7dD1qN0TpHyNQRCUDJXrAAAAAAElFTkSuQmCC',
    se =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAjtJREFUOE/NlD9oFEEUxn9v9ghC0hpRUogIAUmniGAT/5Q2FrETPSNRJILg7RwimI0ox85eQFCEBGIUO1PYpFM0jSConQoBEZGgGPsgl+w+2eM2bC57SopAFqYZ3v7m+977ZoQt+GQLmGxPaBiGgYiMWWvXBHZUGoZhH3BERPYC+4F+4Keq/urt7b1RLpf/ZEBVHa9Wq0HWyg3QKIoGVPU8cA7wgK/pUtXPQJ8xZk+pVBpuNBqXUoUiEvi+P56fzTpo6+SbwHNg1lo7WzTITGEKXFlZeeB53tVCpa3CK8AFa+1cBgvD8LKIXAQOJkkyICJDeYVBEJS6u7s/qeoLa+1o+l9TqXNuBLhmjDlbqVQ+5ICjInIfOBPH8W9jzGCR5YmJiRNxHM+papgqzqDvgSlr7VTernPuO3An3c9bBt74vv+yrdaKyLDv+/1Sq9UGPc97nY9EVuycU2AQOA7cAm4Dr4D5TvVxHB9rKo2iaEFVp621Ln96FEUngaOqGmSxabVqsh3a2h+x1h5qQjNrae/yE4+iaCwDJkky73neTuBZe129Xk+H+BS4l7ZqLVIZ2BhzuFKpvMsDVXXWGPMxFdAedOfcKeCRqj7MYrUhpz09PfXl5eXrectFWXXODQHpOq2qd/95o/JXr6ura3J1dXU6SZIfwKKIHAD2tVYMPBGRx77vN10UXtO85fTkmZmZHUtLSzUR2QXsBhaAL6r6DXhbrVYXi1yss59GqOgub/bN3Z7v6X/tb9Zmp/q/kN8s+lJb8oEAAAAASUVORK5CYII=',
    ie = {
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
  var ce = a.defineComponent({
      name: 'SketchRule',
      components: { RulerWrapper: re },
      props: ie,
      emits: ['onCornerClick', 'handleLine'],
      setup(e, { emit: o }) {
        let n = a.ref(!0)
        n.value = e.isShowReferLine
        const l = a.computed(() => {
            function d(t, r) {
              return (
                Object.keys(t).forEach(i => {
                  i &&
                    t.hasOwnProperty(i) &&
                    (typeof r.key == 'object'
                      ? (t[i] = d(t[i], r[i]))
                      : r.hasOwnProperty(i) && (t[i] = r[i]))
                }),
                t
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
          c = a.computed(() => (e.cornerActive ? ' active' : '')),
          h = a.computed(() => ({
            backgroundImage: n.value ? `url(${le})` : `url(${se})`,
            width: e.thick + 'px',
            height: e.thick + 'px',
            borderRight: `1px solid ${l.value.borderColor}`,
            borderBottom: `1px solid ${l.value.borderColor}`
          }))
        return {
          isShowReferLine: n,
          paletteCpu: l,
          cornerActiveClass: c,
          cornerStyle: h,
          onCornerClick: d => {
            ;(n.value = !n.value), o('onCornerClick', d)
          }
        }
      }
    }),
    ue = function () {
      var e = this,
        o = e.$createElement,
        n = e._self._c || o
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
    de = [],
    be = ''
  const L = {}
  var he = S(ce, ue, de, !1, fe, null, null, null)
  function fe(e) {
    for (let o in L) this[o] = L[o]
  }
  var U = (function () {
    return he.exports
  })()
  ;(f.SketchRule = U),
    (f.default = U),
    Object.defineProperty(f, '__esModule', { value: !0 }),
    (f[Symbol.toStringTag] = 'Module')
})
