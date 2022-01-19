var ae = Object.defineProperty
var U = Object.getOwnPropertySymbols
var re = Object.prototype.hasOwnProperty,
  se = Object.prototype.propertyIsEnumerable
var X = (m, o, t) =>
    o in m
      ? ae(m, o, { enumerable: !0, configurable: !0, writable: !0, value: t })
      : (m[o] = t),
  I = (m, o) => {
    for (var t in o || (o = {})) re.call(o, t) && X(m, t, o[t])
    if (U) for (var t of U(o)) se.call(o, t) && X(m, t, o[t])
    return m
  }
/*!
 * vue3-sketch-ruler v1.3.1-bata
 * 2022年1月Wed Jan 19 2022 21:09:50 GMT+0800 (中国标准时间)
 * 制作
 */ ;(function (m, o) {
  typeof exports == 'object' && typeof module != 'undefined'
    ? o(exports, require('vue-demi'), require('vue'))
    : typeof define == 'function' && define.amd
    ? define(['exports', 'vue-demi', 'vue'], o)
    : ((m = typeof globalThis != 'undefined' ? globalThis : m || self),
      o((m.SketchRuler = {}), m.vueDemi, m.vue))
})(this, function (m, o, t) {
  'use strict'
  const T = {
    scale: Number,
    thick: Number,
    palette: Object,
    index: Number,
    start: Number,
    vertical: Boolean,
    value: Number,
    isShowReferLine: Boolean
  }
  var ie = '',
    b = (e, n) => {
      const s = e.__vccOpts || e
      for (const [c, u] of n) s[c] = u
      return s
    }
  const z = o.defineComponent({
      name: 'LineRuler',
      props: T,
      emits: ['onMouseDown', 'onRelease', 'onRemove'],
      setup(e, { emit: n }) {
        const s = o.ref(0),
          c = o.ref(!0)
        o.onMounted(() => {
          s.value = e.value
        })
        const u = a => {
            c.value = a >= 0
          },
          h = o.computed(() => {
            const a = (s.value - e.start) * e.scale
            u(a)
            const i = a + 'px'
            return e.vertical ? { top: i } : { left: i }
          }),
          r = o.computed(() => {
            var w
            const a = `1px solid ${
                (w = e.palette) == null ? void 0 : w.lineColor
              }`,
              i = e.vertical ? { borderTop: a } : { borderLeft: a },
              v = e.isShowReferLine
                ? e.vertical
                  ? 'ns-resize'
                  : 'ew-resize'
                : 'none'
            return I({ cursor: v }, i)
          }),
          d = o.computed(() =>
            e.vertical ? { left: e.thick + 'px' } : { top: e.thick + 'px' }
          )
        return {
          startValue: s,
          showLine: c,
          offset: h,
          borderCursor: r,
          actionStyle: d,
          handleDown: a => {
            const i = e.vertical ? a.clientY : a.clientX,
              v = s.value
            n('onMouseDown')
            const w = y => {
                const g = e.vertical ? y.clientY : y.clientX,
                  R = Math.round(v + (g - i) / e.scale)
                s.value = R
              },
              N = () => {
                n('onRelease', s.value, e.index),
                  document.removeEventListener('mousemove', w),
                  document.removeEventListener('mouseup', N)
              }
            document.addEventListener('mousemove', w),
              document.addEventListener('mouseup', N)
          },
          handleRemove: () => {
            n('onRemove', e.index)
          }
        }
      }
    }),
    $ = { class: 'value' }
  function M(e, n, s, c, u, h) {
    return t.withDirectives(
      (t.openBlock(),
      t.createElementBlock(
        'div',
        {
          class: 'line',
          style: t.normalizeStyle([e.offset, e.borderCursor]),
          onMousedown:
            n[1] || (n[1] = (...r) => e.handleDown && e.handleDown(...r))
        },
        [
          t.createElementVNode(
            'div',
            { class: 'action', style: t.normalizeStyle(e.actionStyle) },
            [
              t.createElementVNode(
                'span',
                {
                  class: 'del',
                  onClick:
                    n[0] ||
                    (n[0] = (...r) => e.handleRemove && e.handleRemove(...r))
                },
                '\xD7'
              ),
              t.createElementVNode(
                'span',
                $,
                t.toDisplayString(e.startValue),
                1
              )
            ],
            4
          )
        ],
        36
      )),
      [[t.vShow, e.showLine]]
    )
  }
  var Q = b(z, [
    ['render', M],
    ['__scopeId', 'data-v-7cc5d020']
  ])
  const F = e =>
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
    k = 0.83,
    K = (e, n, s, c, u, h) => {
      const { scale: r, width: d, height: f, ratio: l, palette: a } = u,
        {
          bgColor: i,
          fontColor: v,
          shadowColor: w,
          longfgColor: N,
          shortfgColor: y
        } = a
      if (
        (e.scale(l, l),
        e.clearRect(0, 0, d, f),
        (e.fillStyle = i),
        e.fillRect(0, 0, d, f),
        c)
      ) {
        const A = (s - n) * r,
          p = c * r
        ;(e.fillStyle = w),
          h
            ? e.fillRect(A, 0, p, (f * 3) / 8)
            : e.fillRect(0, A, (d * 3) / 8, p)
      }
      const g = F(r),
        R = g * r,
        S = g * 10,
        E = S * r,
        L = Math.floor(n / g) * g,
        O = Math.floor(n / S) * S,
        oe = ((L - n) / g) * R,
        le = ((O - n) / S) * E,
        V = n + Math.ceil((h ? d : f) / r)
      e.beginPath(), (e.fillStyle = v), (e.strokeStyle = N)
      for (let A = O, p = 0; A < V; A += S, p++) {
        const C = le + p * E + 0.5
        h ? e.moveTo(C, 0) : e.moveTo(0, C),
          e.save(),
          h ? e.translate(C, f * 0.4) : e.translate(d * 0.4, C),
          h || e.rotate(-Math.PI / 2),
          e.scale(k / l, k / l),
          e.fillText(A.toString(), 4 * l, 7 * l),
          e.restore(),
          h ? e.lineTo(C, (f * 9) / 16) : e.lineTo((d * 9) / 16, C)
      }
      e.stroke(), e.closePath(), e.beginPath(), (e.strokeStyle = y)
      for (let A = L, p = 0; A < V; A += g, p++) {
        const C = oe + p * R + 0.5
        h ? e.moveTo(C, 0) : e.moveTo(0, C),
          A % S != 0 &&
            (h ? e.lineTo(C, (f * 1) / 4) : e.lineTo((d * 1) / 4, C))
      }
      e.stroke(), e.closePath(), e.setTransform(1, 0, 0, 1, 0, 0)
    },
    P = o.defineComponent({
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
        const s = o.reactive({ canvasContext: null })
        let c = 1
        const u = o.ref(null)
        o.onMounted(() => {
          ;(c = e.ratio || window.devicePixelRatio || 1), h(), r(c), d(c)
        })
        const h = () => {
            s.canvasContext = u.value && u.value.getContext('2d')
          },
          r = l => {
            if (u.value) {
              ;(u.value.width = e.width * l), (u.value.height = e.height * l)
              const a = s.canvasContext
              a &&
                ((a.font = `${12 * l}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`),
                (a.lineWidth = 1),
                (a.textBaseline = 'middle'))
            }
          },
          d = l => {
            const a = {
              scale: e.scale,
              width: e.width,
              height: e.height,
              palette: e.palette,
              ratio: l
            }
            s.canvasContext &&
              K(
                s.canvasContext,
                e.start,
                e.selectStart,
                e.selectLength,
                a,
                !e.vertical
              )
          }
        return (
          o.watch(
            () => e.start,
            () => d(c)
          ),
          o.watch([() => e.width, () => e.height], () => {
            r(c), d(c)
          }),
          {
            handle: (l, a) => {
              const i = (N, y, g) => Math.round(y + N / g),
                v = e.vertical ? l.offsetY : l.offsetX,
                w = i(v, e.start, e.scale)
              switch (a) {
                case 'click':
                  n('onAddLine', w)
                  break
                case 'enter':
                  n('update:valueNum', w), n('update:showIndicator', !0)
                  break
                default:
                  n('update:valueNum', w)
                  break
              }
            },
            canvas: u
          }
        )
      }
    })
  function Y(e, n, s, c, u, h) {
    return (
      t.openBlock(),
      t.createElementBlock(
        'canvas',
        {
          ref: 'canvas',
          class: 'ruler',
          onClick: n[0] || (n[0] = r => e.handle(r, 'click')),
          onMouseenter: n[1] || (n[1] = r => e.handle(r, 'enter')),
          onMousemove: n[2] || (n[2] = r => e.handle(r, 'move')),
          onMouseleave:
            n[3] || (n[3] = r => e.$emit('update:showIndicator', !1))
        },
        null,
        544
      )
    )
  }
  var q = b(P, [['render', Y]])
  const G = {
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
  var ce = ''
  const H = o.defineComponent({
      name: 'RulerWrapper',
      components: { CanvasRuler: q, RulerLine: Q },
      props: G,
      setup(e) {
        const n = o.ref(!1),
          s = o.ref(0),
          c = o.computed(() => (e.vertical ? 'v-container' : 'h-container')),
          u = o.computed(() => {
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
          h = o.computed(() => {
            var v
            const l = (s.value - e.start) * e.scale
            let a = 'top',
              i = 'borderLeft'
            return (
              (a = e.vertical ? 'top' : 'left'),
              (i = e.vertical ? 'borderBottom' : 'borderLeft'),
              {
                [a]: l + 'px',
                [i]: `1px solid ${
                  (v = e.palette) == null ? void 0 : v.lineColor
                }`
              }
            )
          }),
          r = l => {
            e.lines.push(l)
          },
          d = (l, a) => {
            const i = l - e.start,
              v = (e.vertical ? e.height : e.width) / e.scale
            i < 0 || i > v ? f(a) : (e.lines[a] = l)
          },
          f = l => {
            e.lines.splice(l, 1)
          }
        return {
          showIndicator: n,
          valueNum: s,
          rwClassName: c,
          rwStyle: u,
          indicatorStyle: h,
          handleNewLine: r,
          handleLineRelease: d,
          handleLineRemove: f
        }
      }
    }),
    W = { class: 'lines' },
    Z = { class: 'value' }
  function D(e, n, s, c, u, h) {
    const r = t.resolveComponent('CanvasRuler'),
      d = t.resolveComponent('RulerLine')
    return (
      t.openBlock(),
      t.createElementBlock(
        'div',
        {
          class: t.normalizeClass(e.rwClassName),
          style: t.normalizeStyle(e.rwStyle)
        },
        [
          t.createVNode(
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
              'onUpdate:valueNum': n[0] || (n[0] = f => (e.valueNum = f)),
              showIndicator: e.showIndicator,
              'onUpdate:showIndicator':
                n[1] || (n[1] = f => (e.showIndicator = f)),
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
          t.withDirectives(
            t.createElementVNode(
              'div',
              W,
              [
                (t.openBlock(!0),
                t.createElementBlock(
                  t.Fragment,
                  null,
                  t.renderList(
                    e.lines,
                    (f, l) => (
                      t.openBlock(),
                      t.createBlock(
                        d,
                        {
                          key: f + l,
                          index: l,
                          value: f >> 0,
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
            [[t.vShow, e.isShowReferLine]]
          ),
          t.withDirectives(
            t.createElementVNode(
              'div',
              { class: 'indicator', style: t.normalizeStyle(e.indicatorStyle) },
              [
                t.createElementVNode('div', Z, t.toDisplayString(e.valueNum), 1)
              ],
              4
            ),
            [[t.vShow, e.showIndicator]]
          )
        ],
        6
      )
    )
  }
  var j = b(H, [
    ['render', D],
    ['__scopeId', 'data-v-65a7f0f6']
  ])
  const J =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAopJREFUOE/FlE9IVEEcx7+/N9ouds1Mu0QUSFZYdIgoUqQoKPBQHsKozpXE7jbTO/U8xLJvn6usBHWQ6hBFXupSkQeVbh0KJEPp0sH+eLGTsKs77xcj78m0ax0E8cHjzZv5zef3/c33xxA24KENYGJzoEEQbNNaN4Zh2OQ4znwYhr9c1/39vwrXVDo0NNS0tLR0GYB5D64BmAMwzMyvlFKz1es10Hw+f4mZ7wHYBeA9gNdENFepVOaEEM3M3OI4Thczn41gt6WUgQ3+C+r7/h0AWQD3mXnYqPA8L9nQ0HCemduIaFpKOWoAhUJhT6VSuQXgOjP3K6W8GLwKzeVyp4jonR0QBEErM48w8zFLyayUsjX+z+VyHhHdZebTSqkxM78CHRgYOKS1/ghgVErZY214RkQ7ADyRUj72ff8qgCtmXUrZGcf5vv8CwEUhxOF0Ov1pBRpla5dSdseBhUJhpznH6tIsZb1KqacW+BGArUaUXX63UuplHJTNZjuEEONSyhozfd/n6mQ1RkXZL2itz7mu+80EDA4ONi8vL/8AcM2UbikyR2BU9cSmmTU70YqKIAj2hWFo2uenlHK/BRg3Y2aeNO5GyU8S0ZbFxcUuz/NKEXAGQKPjOCcymcyX1dIi8DSAiWQyeaavr68cbSgCuBknYubnQoj+TCYzUywWE6VS6S2ADsdx2gxw1X3L7SNENMbMnwE8qK+vf5NKpRaMaeVyeW8ikfiaSqW+R7BuZr5BRMe11p2u607U9Gk8kc/ntzPzQwCmExYATDLzVBiGE0KIowAOADDf3QA+aK2VDaxRajto3K+rq+tl5nYAzQBamHmeiOYBTGmtR6ph/1Rqg9c73pz7dD1qN0TpHyNQRCUDJXrAAAAAAElFTkSuQmCC',
    _ =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAjtJREFUOE/NlD9oFEEUxn9v9ghC0hpRUogIAUmniGAT/5Q2FrETPSNRJILg7RwimI0ox85eQFCEBGIUO1PYpFM0jSConQoBEZGgGPsgl+w+2eM2bC57SopAFqYZ3v7m+977ZoQt+GQLmGxPaBiGgYiMWWvXBHZUGoZhH3BERPYC+4F+4Keq/urt7b1RLpf/ZEBVHa9Wq0HWyg3QKIoGVPU8cA7wgK/pUtXPQJ8xZk+pVBpuNBqXUoUiEvi+P56fzTpo6+SbwHNg1lo7WzTITGEKXFlZeeB53tVCpa3CK8AFa+1cBgvD8LKIXAQOJkkyICJDeYVBEJS6u7s/qeoLa+1o+l9TqXNuBLhmjDlbqVQ+5ICjInIfOBPH8W9jzGCR5YmJiRNxHM+papgqzqDvgSlr7VTernPuO3An3c9bBt74vv+yrdaKyLDv+/1Sq9UGPc97nY9EVuycU2AQOA7cAm4Dr4D5TvVxHB9rKo2iaEFVp621Ln96FEUngaOqGmSxabVqsh3a2h+x1h5qQjNrae/yE4+iaCwDJkky73neTuBZe129Xk+H+BS4l7ZqLVIZ2BhzuFKpvMsDVXXWGPMxFdAedOfcKeCRqj7MYrUhpz09PfXl5eXrectFWXXODQHpOq2qd/95o/JXr6ura3J1dXU6SZIfwKKIHAD2tVYMPBGRx77vN10UXtO85fTkmZmZHUtLSzUR2QXsBhaAL6r6DXhbrVYXi1yss59GqOgub/bN3Z7v6X/tb9Zmp/q/kN8s+lJb8oEAAAAASUVORK5CYII=',
    x = {
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
  var de = ''
  const ee = o.defineComponent({
      name: 'SketchRule',
      components: { RulerWrapper: j },
      props: x,
      emits: ['onCornerClick', 'handleLine'],
      setup(e, { emit: n }) {
        let s = o.ref(!0)
        s.value = e.isShowReferLine
        const c = o.computed(() => {
            function d(l, a) {
              return (
                Object.keys(l).forEach(i => {
                  i &&
                    l.hasOwnProperty(i) &&
                    (typeof a.key == 'object'
                      ? (l[i] = d(l[i], a[i]))
                      : a.hasOwnProperty(i) && (l[i] = a[i]))
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
          u = o.computed(() => (e.cornerActive ? ' active' : '')),
          h = o.computed(() => ({
            backgroundImage: s.value ? `url(${J})` : `url(${_})`,
            width: e.thick + 'px',
            height: e.thick + 'px',
            borderRight: `1px solid ${c.value.borderColor}`,
            borderBottom: `1px solid ${c.value.borderColor}`
          }))
        return {
          isShowReferLine: s,
          paletteCpu: c,
          cornerActiveClass: u,
          cornerStyle: h,
          onCornerClick: d => {
            ;(s.value = !s.value), n('onCornerClick', d)
          }
        }
      }
    }),
    te = { id: 'mb-ruler', class: 'style-ruler mb-ruler' }
  function ne(e, n, s, c, u, h) {
    const r = t.resolveComponent('RulerWrapper')
    return (
      t.openBlock(),
      t.createElementBlock('div', te, [
        t.createVNode(
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
        t.createVNode(
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
        t.createElementVNode(
          'a',
          {
            class: t.normalizeClass(['corner', e.cornerActiveClass]),
            style: t.normalizeStyle(e.cornerStyle),
            onClick:
              n[0] ||
              (n[0] = (...d) => e.onCornerClick && e.onCornerClick(...d))
          },
          null,
          6
        )
      ])
    )
  }
  var B = b(ee, [['render', ne]])
  ;(m.SketchRule = B),
    (m.default = B),
    Object.defineProperty(m, '__esModule', { value: !0 }),
    (m[Symbol.toStringTag] = 'Module')
})
