'use strict'
var A = Object.defineProperty
var D = Object.getOwnPropertySymbols
var P = Object.prototype.hasOwnProperty,
  z = Object.prototype.propertyIsEnumerable
var E = (e, t, o) =>
    t in e
      ? A(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o })
      : (e[t] = o),
  O = (e, t) => {
    for (var o in t || (t = {})) P.call(t, o) && E(e, o, t[o])
    if (D) for (var o of D(t)) z.call(t, o) && E(e, o, t[o])
    return e
  }
/*!
 * vue3-sketch-ruler v1.2.7
 * 2022年1月Tue Jan 18 2022 21:35:21 GMT+0800 (中国标准时间)
 * 制作
 */ Object.defineProperty(exports, '__esModule', { value: !0 })
exports[Symbol.toStringTag] = 'Module'
var s = require('vue-demi'),
  n = require('vue')
const F = {
  scale: Number,
  thick: Number,
  palette: Object,
  index: Number,
  start: Number,
  vertical: Boolean,
  value: Number,
  isShowReferLine: Boolean
}
var S = (e, t) => {
  const o = e.__vccOpts || e
  for (const [u, c] of t) o[u] = c
  return o
}
const W = s.defineComponent({
    name: 'LineRuler',
    props: F,
    emits: ['onMouseDown', 'onRelease', 'onRemove'],
    setup(e, { emit: t }) {
      const o = s.ref(0),
        u = s.ref(!0)
      s.onMounted(() => {
        o.value = e.value
      })
      const c = l => {
          u.value = l >= 0
        },
        h = s.computed(() => {
          const l = (o.value - e.start) * e.scale
          c(l)
          const v = l + 'px'
          return e.vertical ? { top: v } : { left: v }
        }),
        a = s.computed(() => {
          var m
          const l = `1px solid ${
              (m = e.palette) == null ? void 0 : m.lineColor
            }`,
            v = e.vertical ? { borderTop: l } : { borderLeft: l },
            f = e.isShowReferLine
              ? e.vertical
                ? 'ns-resize'
                : 'ew-resize'
              : 'none'
          return O({ cursor: f }, v)
        }),
        d = s.computed(() =>
          e.vertical ? { left: e.thick + 'px' } : { top: e.thick + 'px' }
        )
      return {
        startValue: o,
        showLine: u,
        offset: h,
        borderCursor: a,
        actionStyle: d,
        handleDown: l => {
          const v = e.vertical ? l.clientY : l.clientX,
            f = o.value
          t('onMouseDown')
          const m = y => {
              const C = e.vertical ? y.clientY : y.clientX,
                k = Math.round(f + (C - v) / e.scale)
              o.value = k
            },
            p = () => {
              t('onRelease', o.value, e.index),
                document.removeEventListener('mousemove', m),
                document.removeEventListener('mouseup', p)
            }
          document.addEventListener('mousemove', m),
            document.addEventListener('mouseup', p)
        },
        handleRemove: () => {
          t('onRemove', e.index)
        }
      }
    }
  }),
  X = { class: 'value' }
function Y(e, t, o, u, c, h) {
  return n.withDirectives(
    (n.openBlock(),
    n.createElementBlock(
      'div',
      {
        class: 'line',
        style: n.normalizeStyle([e.offset, e.borderCursor]),
        onMousedown:
          t[1] || (t[1] = (...a) => e.handleDown && e.handleDown(...a))
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
                  (t[0] = (...a) => e.handleRemove && e.handleRemove(...a))
              },
              '\xD7'
            ),
            n.createElementVNode('span', X, n.toDisplayString(e.startValue), 1)
          ],
          4
        )
      ],
      36
    )),
    [[n.vShow, e.showLine]]
  )
}
var j = S(W, [
  ['render', Y],
  ['__scopeId', 'data-v-2d56dba5']
])
const H = e =>
    e <= 0.25 ? 40 : e <= 0.5 ? 20 : e <= 1 ? 10 : e <= 2 ? 5 : e <= 4 ? 2 : 1,
  V = 0.83,
  U = (e, t, o, u, c, h) => {
    const { scale: a, width: d, height: i, ratio: r, palette: l } = c,
      {
        bgColor: v,
        fontColor: f,
        shadowColor: m,
        longfgColor: p,
        shortfgColor: y
      } = l
    if (
      (e.scale(r, r),
      e.clearRect(0, 0, d, i),
      (e.fillStyle = v),
      e.fillRect(0, 0, d, i),
      u)
    ) {
      const g = (o - t) * a,
        b = u * a
      ;(e.fillStyle = m),
        h ? e.fillRect(g, 0, b, (i * 3) / 8) : e.fillRect(0, g, (d * 3) / 8, b)
    }
    const C = H(a),
      k = C * a,
      N = C * 10,
      R = N * a,
      L = Math.floor(t / C) * C,
      $ = Math.floor(t / N) * N,
      T = ((L - t) / C) * k,
      I = (($ - t) / N) * R,
      B = t + Math.ceil((h ? d : i) / a)
    e.beginPath(), (e.fillStyle = f), (e.strokeStyle = p)
    for (let g = $, b = 0; g < B; g += N, b++) {
      const w = I + b * R + 0.5
      h ? e.moveTo(w, 0) : e.moveTo(0, w),
        e.save(),
        h ? e.translate(w, i * 0.4) : e.translate(d * 0.4, w),
        h || e.rotate(-Math.PI / 2),
        e.scale(V / r, V / r),
        e.fillText(g.toString(), 4 * r, 7 * r),
        e.restore(),
        h ? e.lineTo(w, (i * 9) / 16) : e.lineTo((d * 9) / 16, w)
    }
    e.stroke(), e.closePath(), e.beginPath(), (e.strokeStyle = y)
    for (let g = L, b = 0; g < B; g += C, b++) {
      const w = T + b * k + 0.5
      h ? e.moveTo(w, 0) : e.moveTo(0, w),
        g % N != 0 && (h ? e.lineTo(w, (i * 1) / 4) : e.lineTo((d * 1) / 4, w))
    }
    e.stroke(), e.closePath(), e.setTransform(1, 0, 0, 1, 0, 0)
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
      selectLength: Number
    },
    emits: ['onAddLine', 'update:showIndicator', 'update:valueNum'],
    setup(e, { emit: t }) {
      const o = s.reactive({ canvasContext: null })
      let u = 1
      const c = s.ref(null)
      s.onMounted(() => {
        ;(u = e.ratio || window.devicePixelRatio || 1), h(), a(u), d(u)
      })
      const h = () => {
          o.canvasContext = c.value && c.value.getContext('2d')
        },
        a = r => {
          if (c.value) {
            ;(c.value.width = e.width * r), (c.value.height = e.height * r)
            const l = o.canvasContext
            l &&
              ((l.font = `${12 * r}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`),
              (l.lineWidth = 1),
              (l.textBaseline = 'middle'))
          }
        },
        d = r => {
          const l = {
            scale: e.scale,
            width: e.width,
            height: e.height,
            palette: e.palette,
            ratio: r
          }
          o.canvasContext &&
            U(
              o.canvasContext,
              e.start,
              e.selectStart,
              e.selectLength,
              l,
              !e.vertical
            )
        }
      return (
        s.watch(
          () => e.start,
          () => d(u)
        ),
        s.watch([() => e.width, () => e.height], () => {
          a(u), d(u)
        }),
        {
          handle: (r, l) => {
            const v = (p, y, C) => Math.round(y + p / C),
              f = e.vertical ? r.offsetY : r.offsetX,
              m = v(f, e.start, e.scale)
            switch (l) {
              case 'click':
                t('onAddLine', m)
                break
              case 'enter':
                t('update:valueNum', m), t('update:showIndicator', !0)
                break
              default:
                t('update:valueNum', m)
                break
            }
          },
          canvas: c
        }
      )
    }
  })
function G(e, t, o, u, c, h) {
  return (
    n.openBlock(),
    n.createElementBlock(
      'canvas',
      {
        ref: 'canvas',
        class: 'ruler',
        onClick: t[0] || (t[0] = a => e.handle(a, 'click')),
        onMouseenter: t[1] || (t[1] = a => e.handle(a, 'enter')),
        onMousemove: t[2] || (t[2] = a => e.handle(a, 'move')),
        onMouseleave: t[3] || (t[3] = a => e.$emit('update:showIndicator', !1))
      },
      null,
      544
    )
  )
}
var K = S(q, [['render', G]])
const Q = {
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
const Z = s.defineComponent({
    name: 'RulerWrapper',
    components: { CanvasRuler: K, RulerLine: j },
    props: Q,
    setup(e) {
      const t = s.ref(!1),
        o = s.ref(0),
        u = s.computed(() => (e.vertical ? 'v-container' : 'h-container')),
        c = s.computed(() => {
          const r = {
              width: `calc(100% - ${e.thick}px)`,
              height: `${e.thick + 1}px`,
              left: `${e.thick}px`
            },
            l = {
              width: `${e.thick && e.thick + 1}px`,
              height: `calc(100% - ${e.thick}px)`,
              top: `${e.thick}px`
            }
          return e.vertical ? l : r
        }),
        h = s.computed(() => {
          var f
          const r = (o.value - e.start) * e.scale
          let l = 'top',
            v = 'borderLeft'
          return (
            (l = e.vertical ? 'top' : 'left'),
            (v = e.vertical ? 'borderBottom' : 'borderLeft'),
            {
              [l]: r + 'px',
              [v]: `1px solid ${(f = e.palette) == null ? void 0 : f.lineColor}`
            }
          )
        }),
        a = r => {
          e.lines.push(r)
        },
        d = (r, l) => {
          const v = r - e.start,
            f = (e.vertical ? e.height : e.width) / e.scale
          v < 0 || v > f ? i(l) : (e.lines[l] = r)
        },
        i = r => {
          e.lines.splice(r, 1)
        }
      return {
        showIndicator: t,
        valueNum: o,
        rwClassName: u,
        rwStyle: c,
        indicatorStyle: h,
        handleNewLine: a,
        handleLineRelease: d,
        handleLineRemove: i
      }
    }
  }),
  J = { class: 'lines' },
  _ = { class: 'value' }
function x(e, t, o, u, c, h) {
  const a = n.resolveComponent('CanvasRuler'),
    d = n.resolveComponent('RulerLine')
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
          a,
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
            'onUpdate:valueNum': t[0] || (t[0] = i => (e.valueNum = i)),
            showIndicator: e.showIndicator,
            'onUpdate:showIndicator':
              t[1] || (t[1] = i => (e.showIndicator = i)),
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
                  (i, r) => (
                    n.openBlock(),
                    n.createBlock(
                      d,
                      {
                        key: i + r,
                        index: r,
                        value: i >> 0,
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
var ee = S(Z, [
  ['render', x],
  ['__scopeId', 'data-v-65a7f0f6']
])
const te = {
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
const ne = s.defineComponent({
    name: 'SketchRule',
    components: { RulerWrapper: ee },
    props: te,
    emits: ['onCornerClick', 'handleLine'],
    setup(e, { emit: t }) {
      const o = s.computed(() => {
          function a(i, r) {
            return (
              Object.keys(i).forEach(l => {
                l &&
                  i.hasOwnProperty(l) &&
                  (typeof r.key == 'object'
                    ? (i[l] = a(i[l], r[l]))
                    : r.hasOwnProperty(l) && (i[l] = r[l]))
              }),
              i
            )
          }
          return a(
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
        u = s.computed(() => (e.cornerActive ? ' active' : '')),
        c = s.computed(() => ({
          backgroundColor: o.value.bgColor,
          width: e.thick + 'px',
          height: e.thick + 'px',
          borderRight: `1px solid ${o.value.borderColor}`,
          borderBottom: `1px solid ${o.value.borderColor}`
        }))
      return {
        paletteCpu: o,
        cornerActiveClass: u,
        cornerStyle: c,
        onCornerClick: a => {
          t('onCornerClick', a)
        }
      }
    }
  }),
  oe = { id: 'mb-ruler', class: 'style-ruler mb-ruler' }
function le(e, t, o, u, c, h) {
  const a = n.resolveComponent('RulerWrapper')
  return (
    n.openBlock(),
    n.createElementBlock('div', oe, [
      n.createVNode(
        a,
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
        a,
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
            t[0] || (t[0] = (...d) => e.onCornerClick && e.onCornerClick(...d))
        },
        null,
        6
      )
    ])
  )
}
var M = S(ne, [['render', le]])
exports.SketchRule = M
exports.default = M
