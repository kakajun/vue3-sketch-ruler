'use strict'
/*!vue3-sketch-ruler v1.3.152024年2月Mon Feb 19 2024 15:43:31 GMT+0800 (中国标准时间)制作*/ Object.defineProperties(
  exports,
  { __esModule: { value: !0 }, [Symbol.toStringTag]: { value: 'Module' } }
)
const c = require('vue-demi'),
  n = require('vue'),
  z = c.defineComponent({
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
    setup(e, { emit: t }) {
      const l = c.ref(0),
        i = c.ref(!0)
      c.onMounted(() => {
        l.value = e.value
      })
      const u = (o) => {
          i.value = o >= 0
        },
        d = c.computed(() => {
          const o = (l.value - e.start) * e.scale
          u(o)
          const h = o + 'px'
          return e.vertical ? { top: h } : { left: h }
        }),
        r = c.computed(() => {
          var N
          const o = `1px solid ${(N = e.palette) == null ? void 0 : N.lineColor}`,
            h = e.vertical ? { borderTop: o } : { borderLeft: o }
          return {
            cursor: e.isShowReferLine ? (e.vertical ? 'ns-resize' : 'ew-resize') : 'none',
            ...h
          }
        }),
        m = c.computed(() => (e.vertical ? { left: e.thick + 'px' } : { top: e.thick + 'px' }))
      return {
        startValue: l,
        showLine: i,
        offset: d,
        borderCursor: r,
        actionStyle: m,
        handleDown: (o) => {
          const h = e.vertical ? o.clientY : o.clientX,
            f = l.value
          t('onMouseDown')
          const N = (C) => {
              const A = e.vertical ? C.clientY : C.clientX,
                R = Math.round(f + (A - h) / e.scale)
              l.value = R
            },
            g = () => {
              t('onRelease', l.value, e.index),
                document.removeEventListener('mousemove', N),
                document.removeEventListener('mouseup', g)
            }
          document.addEventListener('mousemove', N), document.addEventListener('mouseup', g)
        },
        handleRemove: () => {
          t('onRemove', e.index)
        }
      }
    }
  }),
  B = (e, t) => {
    const l = e.__vccOpts || e
    for (const [i, u] of t) l[i] = u
    return l
  },
  T = { class: 'value' }
function $(e, t, l, i, u, d) {
  return n.withDirectives(
    (n.openBlock(),
    n.createElementBlock(
      'div',
      {
        class: 'line',
        style: n.normalizeStyle([e.offset, e.borderCursor]),
        onMousedown: t[1] || (t[1] = (...r) => e.handleDown && e.handleDown(...r))
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
                onClick: t[0] || (t[0] = (...r) => e.handleRemove && e.handleRemove(...r))
              },
              '×'
            ),
            n.createElementVNode('span', T, n.toDisplayString(e.startValue), 1)
          ],
          4
        )
      ],
      36
    )),
    [[n.vShow, e.showLine]]
  )
}
const M = B(z, [
    ['render', $],
    ['__scopeId', 'data-v-053590ce']
  ]),
  Q = (e) => (e <= 0.25 ? 40 : e <= 0.5 ? 20 : e <= 1 ? 10 : e <= 2 ? 5 : e <= 4 ? 2 : 1),
  V = 0.83,
  F = (e, t, l, i, u, d) => {
    const { scale: r, width: m, height: s, ratio: a, palette: o } = u,
      { bgColor: h, fontColor: f, shadowColor: N, longfgColor: g, shortfgColor: C } = o,
      A = d ? u.startNumX : u.startNumY,
      R = d ? u.endNumX : u.endNumY
    if ((e.scale(a, a), e.clearRect(0, 0, m, s), (e.fillStyle = h), e.fillRect(0, 0, m, s), i)) {
      const w = (l - t) * r,
        S = i * r
      ;(e.fillStyle = N), d ? e.fillRect(w, 0, S, (s * 3) / 8) : e.fillRect(0, w, (m * 3) / 8, S)
    }
    const b = Q(r),
      E = b * r,
      y = b * 10,
      k = y * r,
      X = Math.floor(t / b) * b,
      L = Math.floor(t / y) * y,
      I = ((X - t) / b) * E,
      U = ((L - t) / y) * k,
      Y = t + Math.ceil((d ? m : s) / r)
    e.beginPath(), (e.fillStyle = f), (e.strokeStyle = g)
    for (let w = L, S = 0; w < Y; w += y, S++) {
      if (w >= A && w <= R) {
        const v = U + S * k + 0.5
        d ? e.moveTo(v, 0) : e.moveTo(0, v),
          e.save(),
          d ? e.translate(v, s * 0.4) : e.translate(m * 0.4, v),
          d || e.rotate(-Math.PI / 2),
          e.scale(V / a, V / a),
          e.fillText(w.toString(), 4 * a, 7 * a),
          e.restore(),
          d ? e.lineTo(v, (s * 9) / 16) : e.lineTo((m * 9) / 16, v)
      }
      e.stroke(), e.closePath(), e.beginPath(), (e.strokeStyle = C)
      for (let v = X, O = 0; v < Y; v += b, O++)
        if (v >= A && v <= R) {
          const p = I + O * E + 0.5
          d ? e.moveTo(p, 0) : e.moveTo(0, p),
            v % y !== 0 && (d ? e.lineTo(p, (s * 1) / 4) : e.lineTo((m * 1) / 4, p))
        }
      e.stroke(), e.closePath(), e.setTransform(1, 0, 0, 1, 0, 0)
    }
  },
  K = c.defineComponent({
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
    setup(e, { emit: t }) {
      const l = c.reactive({ canvasContext: null })
      let i = 1
      const u = c.ref(null)
      c.onMounted(() => {
        ;(i = e.ratio || window.devicePixelRatio || 1), d(), r(i), m(i)
      })
      const d = () => {
          l.canvasContext = u.value && u.value.getContext('2d')
        },
        r = (a) => {
          if (u.value) {
            ;(u.value.width = e.width * a), (u.value.height = e.height * a)
            const o = l.canvasContext
            o &&
              ((o.font = `${12 * a}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`),
              (o.lineWidth = 1),
              (o.textBaseline = 'middle'))
          }
        },
        m = (a) => {
          const o = {
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
          l.canvasContext &&
            F(l.canvasContext, e.start, e.selectStart, e.selectLength, o, !e.vertical)
        }
      return (
        c.watch(
          () => e.start,
          () => m(i)
        ),
        c.watch([() => e.width, () => e.height], () => {
          r(i), m(i)
        }),
        {
          handle: (a, o) => {
            const h = (g, C, A) => Math.round(C + g / A),
              f = e.vertical ? a.offsetY : a.offsetX,
              N = h(f, e.start, e.scale)
            switch (o) {
              case 'click':
                t('onAddLine', N)
                break
              case 'enter':
                t('update:valueNum', N), t('update:showIndicator', !0)
                break
              default:
                t('update:valueNum', N)
                break
            }
          },
          canvas: u
        }
      )
    }
  })
function P(e, t, l, i, u, d) {
  return (
    n.openBlock(),
    n.createElementBlock(
      'canvas',
      {
        ref: 'canvas',
        class: 'ruler',
        onClick: t[0] || (t[0] = (r) => e.handle(r, 'click')),
        onMouseenter: t[1] || (t[1] = (r) => e.handle(r, 'enter')),
        onMousemove: t[2] || (t[2] = (r) => e.handle(r, 'move')),
        onMouseleave: t[3] || (t[3] = (r) => e.$emit('update:showIndicator', !1))
      },
      null,
      544
    )
  )
}
const q = B(K, [['render', P]]),
  G = {
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
  H = c.defineComponent({
    name: 'RulerWrapper',
    components: { CanvasRuler: q, RulerLine: M },
    props: G,
    setup(e) {
      const t = c.ref(!1),
        l = c.ref(0),
        i = c.computed(() => (e.vertical ? 'v-container' : 'h-container')),
        u = c.computed(() => {
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
        d = c.computed(() => {
          var f
          const a = (l.value - e.start) * e.scale
          let o = 'top',
            h = 'borderLeft'
          return (
            (o = e.vertical ? 'top' : 'left'),
            (h = e.vertical ? 'borderBottom' : 'borderLeft'),
            { [o]: a + 'px', [h]: `1px solid ${(f = e.palette) == null ? void 0 : f.lineColor}` }
          )
        }),
        r = (a) => {
          e.lines.push(a)
        },
        m = (a, o) => {
          const h = a - e.start,
            f = (e.vertical ? e.height : e.width) / e.scale
          h < 0 || h > f ? s(o) : (e.lines[o] = a)
        },
        s = (a) => {
          e.lines.splice(a, 1)
        }
      return {
        showIndicator: t,
        valueNum: l,
        rwClassName: i,
        rwStyle: u,
        indicatorStyle: d,
        handleNewLine: r,
        handleLineRelease: m,
        handleLineRemove: s
      }
    }
  }),
  W = { class: 'lines' },
  Z = { class: 'value' }
function j(e, t, l, i, u, d) {
  const r = n.resolveComponent('CanvasRuler'),
    m = n.resolveComponent('RulerLine')
  return (
    n.openBlock(),
    n.createElementBlock(
      'div',
      { class: n.normalizeClass(e.rwClassName), style: n.normalizeStyle(e.rwStyle) },
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
            startNumX: e.startNumX,
            endNumX: e.endNumX,
            startNumY: e.startNumY,
            endNumY: e.endNumY,
            'select-start': e.selectStart,
            'select-length': e.selectLength,
            palette: e.palette,
            valueNum: e.valueNum,
            'onUpdate:valueNum': t[0] || (t[0] = (s) => (e.valueNum = s)),
            showIndicator: e.showIndicator,
            'onUpdate:showIndicator': t[1] || (t[1] = (s) => (e.showIndicator = s)),
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
            'startNumX',
            'endNumX',
            'startNumY',
            'endNumY',
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
            W,
            [
              (n.openBlock(!0),
              n.createElementBlock(
                n.Fragment,
                null,
                n.renderList(
                  e.lines,
                  (s, a) => (
                    n.openBlock(),
                    n.createBlock(
                      m,
                      {
                        key: s + a,
                        index: a,
                        value: s >> 0,
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
            [n.createElementVNode('div', Z, n.toDisplayString(e.valueNum), 1)],
            4
          ),
          [[n.vShow, e.showIndicator]]
        )
      ],
      6
    )
  )
}
const J = B(H, [
    ['render', j],
    ['__scopeId', 'data-v-9da5477e']
  ]),
  x =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAopJREFUOE/FlE9IVEEcx7+/N9ouds1Mu0QUSFZYdIgoUqQoKPBQHsKozpXE7jbTO/U8xLJvn6usBHWQ6hBFXupSkQeVbh0KJEPp0sH+eLGTsKs77xcj78m0ax0E8cHjzZv5zef3/c33xxA24KENYGJzoEEQbNNaN4Zh2OQ4znwYhr9c1/39vwrXVDo0NNS0tLR0GYB5D64BmAMwzMyvlFKz1es10Hw+f4mZ7wHYBeA9gNdENFepVOaEEM3M3OI4Thczn41gt6WUgQ3+C+r7/h0AWQD3mXnYqPA8L9nQ0HCemduIaFpKOWoAhUJhT6VSuQXgOjP3K6W8GLwKzeVyp4jonR0QBEErM48w8zFLyayUsjX+z+VyHhHdZebTSqkxM78CHRgYOKS1/ghgVErZY214RkQ7ADyRUj72ff8qgCtmXUrZGcf5vv8CwEUhxOF0Ov1pBRpla5dSdseBhUJhpznH6tIsZb1KqacW+BGArUaUXX63UuplHJTNZjuEEONSyhozfd/n6mQ1RkXZL2itz7mu+80EDA4ONi8vL/8AcM2UbikyR2BU9cSmmTU70YqKIAj2hWFo2uenlHK/BRg3Y2aeNO5GyU8S0ZbFxcUuz/NKEXAGQKPjOCcymcyX1dIi8DSAiWQyeaavr68cbSgCuBknYubnQoj+TCYzUywWE6VS6S2ADsdx2gxw1X3L7SNENMbMnwE8qK+vf5NKpRaMaeVyeW8ikfiaSqW+R7BuZr5BRMe11p2u607U9Gk8kc/ntzPzQwCmExYATDLzVBiGE0KIowAOADDf3QA+aK2VDaxRajto3K+rq+tl5nYAzQBamHmeiOYBTGmtR6ph/1Rqg9c73pz7dD1qN0TpHyNQRCUDJXrAAAAAAElFTkSuQmCC',
  _ =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAjtJREFUOE/NlD9oFEEUxn9v9ghC0hpRUogIAUmniGAT/5Q2FrETPSNRJILg7RwimI0ox85eQFCEBGIUO1PYpFM0jSConQoBEZGgGPsgl+w+2eM2bC57SopAFqYZ3v7m+977ZoQt+GQLmGxPaBiGgYiMWWvXBHZUGoZhH3BERPYC+4F+4Keq/urt7b1RLpf/ZEBVHa9Wq0HWyg3QKIoGVPU8cA7wgK/pUtXPQJ8xZk+pVBpuNBqXUoUiEvi+P56fzTpo6+SbwHNg1lo7WzTITGEKXFlZeeB53tVCpa3CK8AFa+1cBgvD8LKIXAQOJkkyICJDeYVBEJS6u7s/qeoLa+1o+l9TqXNuBLhmjDlbqVQ+5ICjInIfOBPH8W9jzGCR5YmJiRNxHM+papgqzqDvgSlr7VTernPuO3An3c9bBt74vv+yrdaKyLDv+/1Sq9UGPc97nY9EVuycU2AQOA7cAm4Dr4D5TvVxHB9rKo2iaEFVp621Ln96FEUngaOqGmSxabVqsh3a2h+x1h5qQjNrae/yE4+iaCwDJkky73neTuBZe129Xk+H+BS4l7ZqLVIZ2BhzuFKpvMsDVXXWGPMxFdAedOfcKeCRqj7MYrUhpz09PfXl5eXrectFWXXODQHpOq2qd/95o/JXr6ura3J1dXU6SZIfwKKIHAD2tVYMPBGRx77vN10UXtO85fTkmZmZHUtLSzUR2QXsBhaAL6r6DXhbrVYXi1yss59GqOgub/bN3Z7v6X/tb9Zmp/q/kN8s+lJb8oEAAAAASUVORK5CYII=',
  ee = {
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
  te = c.defineComponent({
    name: 'SketchRule',
    components: { RulerWrapper: J },
    props: ee,
    emits: ['onCornerClick'],
    setup(e, { emit: t }) {
      let l = c.ref(!0)
      l.value = e.isShowReferLine
      const i = c.computed(() => {
          function r(s, a) {
            return (
              Object.keys(s).forEach((o) => {
                o &&
                  s.hasOwnProperty(o) &&
                  (typeof a[o] == 'object'
                    ? (s[o] = r(s[o], a[o]))
                    : a.hasOwnProperty(o) && (s[o] = a[o]))
              }),
              s
            )
          }
          return r(
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
        u = c.computed(() => ({
          backgroundImage: l.value ? `url(${e.eyeIcon || x})` : `url(${e.closeEyeIcon || _})`,
          width: e.thick + 'px',
          height: e.thick + 'px',
          borderRight: `1px solid ${i.value.borderColor}`,
          borderBottom: `1px solid ${i.value.borderColor}`
        })),
        d = (r) => {
          ;(l.value = !l.value), t('onCornerClick', l.value)
        }
      return (
        c.watch([() => e.isShowReferLine], () => {
          l.value = e.isShowReferLine
        }),
        { showReferLine: l, paletteCpu: i, cornerStyle: u, onCornerClick: d }
      )
    }
  }),
  ne = { id: 'mb-ruler', class: 'style-ruler mb-ruler' }
function oe(e, t, l, i, u, d) {
  const r = n.resolveComponent('RulerWrapper')
  return (
    n.openBlock(),
    n.createElementBlock('div', ne, [
      n.createVNode(
        r,
        {
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
          'palette',
          'startNumX',
          'endNumX'
        ]
      ),
      n.createVNode(
        r,
        {
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
          'palette',
          'startNumY',
          'endNumY'
        ]
      ),
      n.createElementVNode(
        'a',
        {
          class: 'corner',
          style: n.normalizeStyle(e.cornerStyle),
          onClick: t[0] || (t[0] = (...m) => e.onCornerClick && e.onCornerClick(...m))
        },
        null,
        4
      )
    ])
  )
}
const D = B(te, [['render', oe]])
exports.SketchRule = D
exports.default = D
