'use strict'
var z = Object.defineProperty
var L = Object.getOwnPropertySymbols
var T = Object.prototype.hasOwnProperty,
  $ = Object.prototype.propertyIsEnumerable
var O = (e, t, o) =>
    t in e
      ? z(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o })
      : (e[t] = o),
  V = (e, t) => {
    for (var o in t || (t = {})) T.call(t, o) && O(e, o, t[o])
    if (L) for (var o of L(t)) $.call(t, o) && O(e, o, t[o])
    return e
  }
/*!
 * vue3-sketch-ruler v1.3.1-bata
 * 2022年1月Wed Jan 19 2022 21:09:50 GMT+0800 (中国标准时间)
 * 制作
 */ Object.defineProperty(exports, '__esModule', { value: !0 })
exports[Symbol.toStringTag] = 'Module'
var c = require('vue-demi'),
  n = require('vue')
const M = {
  scale: Number,
  thick: Number,
  palette: Object,
  index: Number,
  start: Number,
  vertical: Boolean,
  value: Number,
  isShowReferLine: Boolean
}
var y = (e, t) => {
  const o = e.__vccOpts || e
  for (const [s, d] of t) o[s] = d
  return o
}
const Q = c.defineComponent({
    name: 'LineRuler',
    props: M,
    emits: ['onMouseDown', 'onRelease', 'onRemove'],
    setup(e, { emit: t }) {
      const o = c.ref(0),
        s = c.ref(!0)
      c.onMounted(() => {
        o.value = e.value
      })
      const d = a => {
          s.value = a >= 0
        },
        h = c.computed(() => {
          const a = (o.value - e.start) * e.scale
          d(a)
          const i = a + 'px'
          return e.vertical ? { top: i } : { left: i }
        }),
        r = c.computed(() => {
          var f
          const a = `1px solid ${
              (f = e.palette) == null ? void 0 : f.lineColor
            }`,
            i = e.vertical ? { borderTop: a } : { borderLeft: a },
            m = e.isShowReferLine
              ? e.vertical
                ? 'ns-resize'
                : 'ew-resize'
              : 'none'
          return V({ cursor: m }, i)
        }),
        u = c.computed(() =>
          e.vertical ? { left: e.thick + 'px' } : { top: e.thick + 'px' }
        )
      return {
        startValue: o,
        showLine: s,
        offset: h,
        borderCursor: r,
        actionStyle: u,
        handleDown: a => {
          const i = e.vertical ? a.clientY : a.clientX,
            m = o.value
          t('onMouseDown')
          const f = N => {
              const g = e.vertical ? N.clientY : N.clientX,
                S = Math.round(m + (g - i) / e.scale)
              o.value = S
            },
            p = () => {
              t('onRelease', o.value, e.index),
                document.removeEventListener('mousemove', f),
                document.removeEventListener('mouseup', p)
            }
          document.addEventListener('mousemove', f),
            document.addEventListener('mouseup', p)
        },
        handleRemove: () => {
          t('onRemove', e.index)
        }
      }
    }
  }),
  F = { class: 'value' }
function K(e, t, o, s, d, h) {
  return n.withDirectives(
    (n.openBlock(),
    n.createElementBlock(
      'div',
      {
        class: 'line',
        style: n.normalizeStyle([e.offset, e.borderCursor]),
        onMousedown:
          t[1] || (t[1] = (...r) => e.handleDown && e.handleDown(...r))
      },
      [
        n.createElementVNode(
          'div',
          { class: 'action', style: n.normalizeStyle(e.actionStyle) },
          [
            n.createElementVNode(
              'span',
              {
                class: 'del',
                onClick:
                  t[0] ||
                  (t[0] = (...r) => e.handleRemove && e.handleRemove(...r))
              },
              '\xD7'
            ),
            n.createElementVNode('span', F, n.toDisplayString(e.startValue), 1)
          ],
          4
        )
      ],
      36
    )),
    [[n.vShow, e.showLine]]
  )
}
var P = y(Q, [
  ['render', K],
  ['__scopeId', 'data-v-7cc5d020']
])
const Y = e =>
    e <= 0.25 ? 40 : e <= 0.5 ? 20 : e <= 1 ? 10 : e <= 2 ? 5 : e <= 4 ? 2 : 1,
  D = 0.83,
  q = (e, t, o, s, d, h) => {
    const { scale: r, width: u, height: v, ratio: l, palette: a } = d,
      {
        bgColor: i,
        fontColor: m,
        shadowColor: f,
        longfgColor: p,
        shortfgColor: N
      } = a
    if (
      (e.scale(l, l),
      e.clearRect(0, 0, u, v),
      (e.fillStyle = i),
      e.fillRect(0, 0, u, v),
      s)
    ) {
      const C = (o - t) * r,
        A = s * r
      ;(e.fillStyle = f),
        h ? e.fillRect(C, 0, A, (v * 3) / 8) : e.fillRect(0, C, (u * 3) / 8, A)
    }
    const g = Y(r),
      S = g * r,
      b = g * 10,
      R = b * r,
      B = Math.floor(t / g) * g,
      k = Math.floor(t / b) * b,
      X = ((B - t) / g) * S,
      I = ((k - t) / b) * R,
      E = t + Math.ceil((h ? u : v) / r)
    e.beginPath(), (e.fillStyle = m), (e.strokeStyle = p)
    for (let C = k, A = 0; C < E; C += b, A++) {
      const w = I + A * R + 0.5
      h ? e.moveTo(w, 0) : e.moveTo(0, w),
        e.save(),
        h ? e.translate(w, v * 0.4) : e.translate(u * 0.4, w),
        h || e.rotate(-Math.PI / 2),
        e.scale(D / l, D / l),
        e.fillText(C.toString(), 4 * l, 7 * l),
        e.restore(),
        h ? e.lineTo(w, (v * 9) / 16) : e.lineTo((u * 9) / 16, w)
    }
    e.stroke(), e.closePath(), e.beginPath(), (e.strokeStyle = N)
    for (let C = B, A = 0; C < E; C += g, A++) {
      const w = X + A * S + 0.5
      h ? e.moveTo(w, 0) : e.moveTo(0, w),
        C % b != 0 && (h ? e.lineTo(w, (v * 1) / 4) : e.lineTo((u * 1) / 4, w))
    }
    e.stroke(), e.closePath(), e.setTransform(1, 0, 0, 1, 0, 0)
  },
  G = c.defineComponent({
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
      const o = c.reactive({ canvasContext: null })
      let s = 1
      const d = c.ref(null)
      c.onMounted(() => {
        ;(s = e.ratio || window.devicePixelRatio || 1), h(), r(s), u(s)
      })
      const h = () => {
          o.canvasContext = d.value && d.value.getContext('2d')
        },
        r = l => {
          if (d.value) {
            ;(d.value.width = e.width * l), (d.value.height = e.height * l)
            const a = o.canvasContext
            a &&
              ((a.font = `${12 * l}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`),
              (a.lineWidth = 1),
              (a.textBaseline = 'middle'))
          }
        },
        u = l => {
          const a = {
            scale: e.scale,
            width: e.width,
            height: e.height,
            palette: e.palette,
            ratio: l
          }
          o.canvasContext &&
            q(
              o.canvasContext,
              e.start,
              e.selectStart,
              e.selectLength,
              a,
              !e.vertical
            )
        }
      return (
        c.watch(
          () => e.start,
          () => u(s)
        ),
        c.watch([() => e.width, () => e.height], () => {
          r(s), u(s)
        }),
        {
          handle: (l, a) => {
            const i = (p, N, g) => Math.round(N + p / g),
              m = e.vertical ? l.offsetY : l.offsetX,
              f = i(m, e.start, e.scale)
            switch (a) {
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
          canvas: d
        }
      )
    }
  })
function H(e, t, o, s, d, h) {
  return (
    n.openBlock(),
    n.createElementBlock(
      'canvas',
      {
        ref: 'canvas',
        class: 'ruler',
        onClick: t[0] || (t[0] = r => e.handle(r, 'click')),
        onMouseenter: t[1] || (t[1] = r => e.handle(r, 'enter')),
        onMousemove: t[2] || (t[2] = r => e.handle(r, 'move')),
        onMouseleave: t[3] || (t[3] = r => e.$emit('update:showIndicator', !1))
      },
      null,
      544
    )
  )
}
var W = y(G, [['render', H]])
const Z = {
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
const j = c.defineComponent({
    name: 'RulerWrapper',
    components: { CanvasRuler: W, RulerLine: P },
    props: Z,
    setup(e) {
      const t = c.ref(!1),
        o = c.ref(0),
        s = c.computed(() => (e.vertical ? 'v-container' : 'h-container')),
        d = c.computed(() => {
          const l = {
              width: `calc(100% - ${e.thick}px)`,
              height: `${e.thick + 1}px`,
              left: `${e.thick}px`
            },
            a = {
              width: `${e.thick && e.thick + 1}px`,
              height: `calc(100% - ${e.thick}px)`,
              top: `${e.thick}px`
            }
          return e.vertical ? a : l
        }),
        h = c.computed(() => {
          var m
          const l = (o.value - e.start) * e.scale
          let a = 'top',
            i = 'borderLeft'
          return (
            (a = e.vertical ? 'top' : 'left'),
            (i = e.vertical ? 'borderBottom' : 'borderLeft'),
            {
              [a]: l + 'px',
              [i]: `1px solid ${(m = e.palette) == null ? void 0 : m.lineColor}`
            }
          )
        }),
        r = l => {
          e.lines.push(l)
        },
        u = (l, a) => {
          const i = l - e.start,
            m = (e.vertical ? e.height : e.width) / e.scale
          i < 0 || i > m ? v(a) : (e.lines[a] = l)
        },
        v = l => {
          e.lines.splice(l, 1)
        }
      return {
        showIndicator: t,
        valueNum: o,
        rwClassName: s,
        rwStyle: d,
        indicatorStyle: h,
        handleNewLine: r,
        handleLineRelease: u,
        handleLineRemove: v
      }
    }
  }),
  J = { class: 'lines' },
  _ = { class: 'value' }
function x(e, t, o, s, d, h) {
  const r = n.resolveComponent('CanvasRuler'),
    u = n.resolveComponent('RulerLine')
  return (
    n.openBlock(),
    n.createElementBlock(
      'div',
      {
        class: n.normalizeClass(e.rwClassName),
        style: n.normalizeStyle(e.rwStyle)
      },
      [
        n.createVNode(
          r,
          {
            vertical: e.vertical,
            scale: e.scale,
            width: e.width,
            height: e.height,
            start: e.start,
            ratio: e.ratio,
            'select-start': e.selectStart,
            'select-length': e.selectLength,
            palette: e.palette,
            valueNum: e.valueNum,
            'onUpdate:valueNum': t[0] || (t[0] = v => (e.valueNum = v)),
            showIndicator: e.showIndicator,
            'onUpdate:showIndicator':
              t[1] || (t[1] = v => (e.showIndicator = v)),
            onOnAddLine: e.handleNewLine
          },
          null,
          8,
          [
            'vertical',
            'scale',
            'width',
            'height',
            'start',
            'ratio',
            'select-start',
            'select-length',
            'palette',
            'valueNum',
            'showIndicator',
            'onOnAddLine'
          ]
        ),
        n.withDirectives(
          n.createElementVNode(
            'div',
            J,
            [
              (n.openBlock(!0),
              n.createElementBlock(
                n.Fragment,
                null,
                n.renderList(
                  e.lines,
                  (v, l) => (
                    n.openBlock(),
                    n.createBlock(
                      u,
                      {
                        key: v + l,
                        index: l,
                        value: v >> 0,
                        scale: e.scale,
                        start: e.start,
                        thick: e.thick,
                        palette: e.palette,
                        vertical: e.vertical,
                        'is-show-refer-line': e.isShowReferLine,
                        onOnRemove: e.handleLineRemove,
                        onOnRelease: e.handleLineRelease
                      },
                      null,
                      8,
                      [
                        'index',
                        'value',
                        'scale',
                        'start',
                        'thick',
                        'palette',
                        'vertical',
                        'is-show-refer-line',
                        'onOnRemove',
                        'onOnRelease'
                      ]
                    )
                  )
                ),
                128
              ))
            ],
            512
          ),
          [[n.vShow, e.isShowReferLine]]
        ),
        n.withDirectives(
          n.createElementVNode(
            'div',
            { class: 'indicator', style: n.normalizeStyle(e.indicatorStyle) },
            [n.createElementVNode('div', _, n.toDisplayString(e.valueNum), 1)],
            4
          ),
          [[n.vShow, e.showIndicator]]
        )
      ],
      6
    )
  )
}
var ee = y(j, [
  ['render', x],
  ['__scopeId', 'data-v-65a7f0f6']
])
const te =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAopJREFUOE/FlE9IVEEcx7+/N9ouds1Mu0QUSFZYdIgoUqQoKPBQHsKozpXE7jbTO/U8xLJvn6usBHWQ6hBFXupSkQeVbh0KJEPp0sH+eLGTsKs77xcj78m0ax0E8cHjzZv5zef3/c33xxA24KENYGJzoEEQbNNaN4Zh2OQ4znwYhr9c1/39vwrXVDo0NNS0tLR0GYB5D64BmAMwzMyvlFKz1es10Hw+f4mZ7wHYBeA9gNdENFepVOaEEM3M3OI4Thczn41gt6WUgQ3+C+r7/h0AWQD3mXnYqPA8L9nQ0HCemduIaFpKOWoAhUJhT6VSuQXgOjP3K6W8GLwKzeVyp4jonR0QBEErM48w8zFLyayUsjX+z+VyHhHdZebTSqkxM78CHRgYOKS1/ghgVErZY214RkQ7ADyRUj72ff8qgCtmXUrZGcf5vv8CwEUhxOF0Ov1pBRpla5dSdseBhUJhpznH6tIsZb1KqacW+BGArUaUXX63UuplHJTNZjuEEONSyhozfd/n6mQ1RkXZL2itz7mu+80EDA4ONi8vL/8AcM2UbikyR2BU9cSmmTU70YqKIAj2hWFo2uenlHK/BRg3Y2aeNO5GyU8S0ZbFxcUuz/NKEXAGQKPjOCcymcyX1dIi8DSAiWQyeaavr68cbSgCuBknYubnQoj+TCYzUywWE6VS6S2ADsdx2gxw1X3L7SNENMbMnwE8qK+vf5NKpRaMaeVyeW8ikfiaSqW+R7BuZr5BRMe11p2u607U9Gk8kc/ntzPzQwCmExYATDLzVBiGE0KIowAOADDf3QA+aK2VDaxRajto3K+rq+tl5nYAzQBamHmeiOYBTGmtR6ph/1Rqg9c73pz7dD1qN0TpHyNQRCUDJXrAAAAAAElFTkSuQmCC',
  ne =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAjtJREFUOE/NlD9oFEEUxn9v9ghC0hpRUogIAUmniGAT/5Q2FrETPSNRJILg7RwimI0ox85eQFCEBGIUO1PYpFM0jSConQoBEZGgGPsgl+w+2eM2bC57SopAFqYZ3v7m+977ZoQt+GQLmGxPaBiGgYiMWWvXBHZUGoZhH3BERPYC+4F+4Keq/urt7b1RLpf/ZEBVHa9Wq0HWyg3QKIoGVPU8cA7wgK/pUtXPQJ8xZk+pVBpuNBqXUoUiEvi+P56fzTpo6+SbwHNg1lo7WzTITGEKXFlZeeB53tVCpa3CK8AFa+1cBgvD8LKIXAQOJkkyICJDeYVBEJS6u7s/qeoLa+1o+l9TqXNuBLhmjDlbqVQ+5ICjInIfOBPH8W9jzGCR5YmJiRNxHM+papgqzqDvgSlr7VTernPuO3An3c9bBt74vv+yrdaKyLDv+/1Sq9UGPc97nY9EVuycU2AQOA7cAm4Dr4D5TvVxHB9rKo2iaEFVp621Ln96FEUngaOqGmSxabVqsh3a2h+x1h5qQjNrae/yE4+iaCwDJkky73neTuBZe129Xk+H+BS4l7ZqLVIZ2BhzuFKpvMsDVXXWGPMxFdAedOfcKeCRqj7MYrUhpz09PfXl5eXrectFWXXODQHpOq2qd/95o/JXr6ura3J1dXU6SZIfwKKIHAD2tVYMPBGRx77vN10UXtO85fTkmZmZHUtLSzUR2QXsBhaAL6r6DXhbrVYXi1yss59GqOgub/bN3Z7v6X/tb9Zmp/q/kN8s+lJb8oEAAAAASUVORK5CYII=',
  oe = {
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
const le = c.defineComponent({
    name: 'SketchRule',
    components: { RulerWrapper: ee },
    props: oe,
    emits: ['onCornerClick', 'handleLine'],
    setup(e, { emit: t }) {
      let o = c.ref(!0)
      o.value = e.isShowReferLine
      const s = c.computed(() => {
          function u(l, a) {
            return (
              Object.keys(l).forEach(i => {
                i &&
                  l.hasOwnProperty(i) &&
                  (typeof a.key == 'object'
                    ? (l[i] = u(l[i], a[i]))
                    : a.hasOwnProperty(i) && (l[i] = a[i]))
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
        d = c.computed(() => (e.cornerActive ? ' active' : '')),
        h = c.computed(() => ({
          backgroundImage: o.value ? `url(${te})` : `url(${ne})`,
          width: e.thick + 'px',
          height: e.thick + 'px',
          borderRight: `1px solid ${s.value.borderColor}`,
          borderBottom: `1px solid ${s.value.borderColor}`
        }))
      return {
        isShowReferLine: o,
        paletteCpu: s,
        cornerActiveClass: d,
        cornerStyle: h,
        onCornerClick: u => {
          ;(o.value = !o.value), t('onCornerClick', u)
        }
      }
    }
  }),
  ae = { id: 'mb-ruler', class: 'style-ruler mb-ruler' }
function re(e, t, o, s, d, h) {
  const r = n.resolveComponent('RulerWrapper')
  return (
    n.openBlock(),
    n.createElementBlock('div', ae, [
      n.createVNode(
        r,
        {
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
        },
        null,
        8,
        [
          'width',
          'height',
          'is-show-refer-line',
          'thick',
          'ratio',
          'start',
          'lines',
          'select-start',
          'select-length',
          'scale',
          'palette'
        ]
      ),
      n.createVNode(
        r,
        {
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
        },
        null,
        8,
        [
          'width',
          'height',
          'is-show-refer-line',
          'thick',
          'ratio',
          'start',
          'lines',
          'select-start',
          'select-length',
          'scale',
          'palette'
        ]
      ),
      n.createElementVNode(
        'a',
        {
          class: n.normalizeClass(['corner', e.cornerActiveClass]),
          style: n.normalizeStyle(e.cornerStyle),
          onClick:
            t[0] || (t[0] = (...u) => e.onCornerClick && e.onCornerClick(...u))
        },
        null,
        6
      )
    ])
  )
}
var U = y(le, [['render', re]])
exports.SketchRule = U
exports.default = U
