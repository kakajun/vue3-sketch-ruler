;(function (g, s) {
  typeof exports == 'object' && typeof module < 'u'
    ? s(exports, require('vue-demi'), require('vue'))
    : typeof define == 'function' && define.amd
      ? define(['exports', 'vue-demi', 'vue'], s)
      : ((g = typeof globalThis < 'u' ? globalThis : g || self),
        s((g.SketchRuler = {}), g.vueDemi, g.vue))
})(this, function (g, s, n) {
  'use strict'
  /*!vue3-sketch-ruler v1.3.152024年2月Mon Feb 19 2024 15:43:31 GMT+0800 (中国标准时间)制作*/ const T =
      s.defineComponent({
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
          const l = s.ref(0),
            u = s.ref(!0)
          s.onMounted(() => {
            l.value = e.value
          })
          const d = (o) => {
              u.value = o >= 0
            },
            c = s.computed(() => {
              const o = (l.value - e.start) * e.scale
              d(o)
              const m = o + 'px'
              return e.vertical ? { top: m } : { left: m }
            }),
            r = s.computed(() => {
              var w
              const o = `1px solid ${(w = e.palette) == null ? void 0 : w.lineColor}`,
                m = e.vertical ? { borderTop: o } : { borderLeft: o }
              return {
                cursor: e.isShowReferLine ? (e.vertical ? 'ns-resize' : 'ew-resize') : 'none',
                ...m
              }
            }),
            h = s.computed(() => (e.vertical ? { left: e.thick + 'px' } : { top: e.thick + 'px' }))
          return {
            startValue: l,
            showLine: u,
            offset: c,
            borderCursor: r,
            actionStyle: h,
            handleDown: (o) => {
              const m = e.vertical ? o.clientY : o.clientX,
                f = l.value
              t('onMouseDown')
              const w = (A) => {
                  const b = e.vertical ? A.clientY : A.clientX,
                    B = Math.round(f + (b - m) / e.scale)
                  l.value = B
                },
                C = () => {
                  t('onRelease', l.value, e.index),
                    document.removeEventListener('mousemove', w),
                    document.removeEventListener('mouseup', C)
                }
              document.addEventListener('mousemove', w), document.addEventListener('mouseup', C)
            },
            handleRemove: () => {
              t('onRemove', e.index)
            }
          }
        }
      }),
    p = (e, t) => {
      const l = e.__vccOpts || e
      for (const [u, d] of t) l[u] = d
      return l
    },
    z = { class: 'value' }
  function $(e, t, l, u, d, c) {
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
              n.createElementVNode('span', z, n.toDisplayString(e.startValue), 1)
            ],
            4
          )
        ],
        36
      )),
      [[n.vShow, e.showLine]]
    )
  }
  const M = p(T, [
      ['render', $],
      ['__scopeId', 'data-v-053590ce']
    ]),
    Q = (e) => (e <= 0.25 ? 40 : e <= 0.5 ? 20 : e <= 1 ? 10 : e <= 2 ? 5 : e <= 4 ? 2 : 1),
    E = 0.83,
    F = (e, t, l, u, d, c) => {
      const { scale: r, width: h, height: i, ratio: a, palette: o } = d,
        { bgColor: m, fontColor: f, shadowColor: w, longfgColor: C, shortfgColor: A } = o,
        b = c ? d.startNumX : d.startNumY,
        B = c ? d.endNumX : d.endNumY
      if ((e.scale(a, a), e.clearRect(0, 0, h, i), (e.fillStyle = m), e.fillRect(0, 0, h, i), u)) {
        const v = (l - t) * r,
          R = u * r
        ;(e.fillStyle = w), c ? e.fillRect(v, 0, R, (i * 3) / 8) : e.fillRect(0, v, (h * 3) / 8, R)
      }
      const y = Q(r),
        L = y * r,
        S = y * 10,
        Y = S * r,
        O = Math.floor(t / y) * y,
        V = Math.floor(t / S) * S,
        oe = ((O - t) / y) * L,
        ae = ((V - t) / S) * Y,
        I = t + Math.ceil((c ? h : i) / r)
      e.beginPath(), (e.fillStyle = f), (e.strokeStyle = C)
      for (let v = V, R = 0; v < I; v += S, R++) {
        if (v >= b && v <= B) {
          const N = ae + R * Y + 0.5
          c ? e.moveTo(N, 0) : e.moveTo(0, N),
            e.save(),
            c ? e.translate(N, i * 0.4) : e.translate(h * 0.4, N),
            c || e.rotate(-Math.PI / 2),
            e.scale(E / a, E / a),
            e.fillText(v.toString(), 4 * a, 7 * a),
            e.restore(),
            c ? e.lineTo(N, (i * 9) / 16) : e.lineTo((h * 9) / 16, N)
        }
        e.stroke(), e.closePath(), e.beginPath(), (e.strokeStyle = A)
        for (let N = O, U = 0; N < I; N += y, U++)
          if (N >= b && N <= B) {
            const k = oe + U * L + 0.5
            c ? e.moveTo(k, 0) : e.moveTo(0, k),
              N % S !== 0 && (c ? e.lineTo(k, (i * 1) / 4) : e.lineTo((h * 1) / 4, k))
          }
        e.stroke(), e.closePath(), e.setTransform(1, 0, 0, 1, 0, 0)
      }
    },
    K = s.defineComponent({
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
        const l = s.reactive({ canvasContext: null })
        let u = 1
        const d = s.ref(null)
        s.onMounted(() => {
          ;(u = e.ratio || window.devicePixelRatio || 1), c(), r(u), h(u)
        })
        const c = () => {
            l.canvasContext = d.value && d.value.getContext('2d')
          },
          r = (a) => {
            if (d.value) {
              ;(d.value.width = e.width * a), (d.value.height = e.height * a)
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
          h = (a) => {
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
          s.watch(
            () => e.start,
            () => h(u)
          ),
          s.watch([() => e.width, () => e.height], () => {
            r(u), h(u)
          }),
          {
            handle: (a, o) => {
              const m = (C, A, b) => Math.round(A + C / b),
                f = e.vertical ? a.offsetY : a.offsetX,
                w = m(f, e.start, e.scale)
              switch (o) {
                case 'click':
                  t('onAddLine', w)
                  break
                case 'enter':
                  t('update:valueNum', w), t('update:showIndicator', !0)
                  break
                default:
                  t('update:valueNum', w)
                  break
              }
            },
            canvas: d
          }
        )
      }
    })
  function P(e, t, l, u, d, c) {
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
  const q = p(K, [['render', P]]),
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
    H = s.defineComponent({
      name: 'RulerWrapper',
      components: { CanvasRuler: q, RulerLine: M },
      props: G,
      setup(e) {
        const t = s.ref(!1),
          l = s.ref(0),
          u = s.computed(() => (e.vertical ? 'v-container' : 'h-container')),
          d = s.computed(() => {
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
          c = s.computed(() => {
            var f
            const a = (l.value - e.start) * e.scale
            let o = 'top',
              m = 'borderLeft'
            return (
              (o = e.vertical ? 'top' : 'left'),
              (m = e.vertical ? 'borderBottom' : 'borderLeft'),
              { [o]: a + 'px', [m]: `1px solid ${(f = e.palette) == null ? void 0 : f.lineColor}` }
            )
          }),
          r = (a) => {
            e.lines.push(a)
          },
          h = (a, o) => {
            const m = a - e.start,
              f = (e.vertical ? e.height : e.width) / e.scale
            m < 0 || m > f ? i(o) : (e.lines[o] = a)
          },
          i = (a) => {
            e.lines.splice(a, 1)
          }
        return {
          showIndicator: t,
          valueNum: l,
          rwClassName: u,
          rwStyle: d,
          indicatorStyle: c,
          handleNewLine: r,
          handleLineRelease: h,
          handleLineRemove: i
        }
      }
    }),
    W = { class: 'lines' },
    Z = { class: 'value' }
  function D(e, t, l, u, d, c) {
    const r = n.resolveComponent('CanvasRuler'),
      h = n.resolveComponent('RulerLine')
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
              'onUpdate:valueNum': t[0] || (t[0] = (i) => (e.valueNum = i)),
              showIndicator: e.showIndicator,
              'onUpdate:showIndicator': t[1] || (t[1] = (i) => (e.showIndicator = i)),
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
                    (i, a) => (
                      n.openBlock(),
                      n.createBlock(
                        h,
                        {
                          key: i + a,
                          index: a,
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
  const j = p(H, [
      ['render', D],
      ['__scopeId', 'data-v-9da5477e']
    ]),
    J =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAopJREFUOE/FlE9IVEEcx7+/N9ouds1Mu0QUSFZYdIgoUqQoKPBQHsKozpXE7jbTO/U8xLJvn6usBHWQ6hBFXupSkQeVbh0KJEPp0sH+eLGTsKs77xcj78m0ax0E8cHjzZv5zef3/c33xxA24KENYGJzoEEQbNNaN4Zh2OQ4znwYhr9c1/39vwrXVDo0NNS0tLR0GYB5D64BmAMwzMyvlFKz1es10Hw+f4mZ7wHYBeA9gNdENFepVOaEEM3M3OI4Thczn41gt6WUgQ3+C+r7/h0AWQD3mXnYqPA8L9nQ0HCemduIaFpKOWoAhUJhT6VSuQXgOjP3K6W8GLwKzeVyp4jonR0QBEErM48w8zFLyayUsjX+z+VyHhHdZebTSqkxM78CHRgYOKS1/ghgVErZY214RkQ7ADyRUj72ff8qgCtmXUrZGcf5vv8CwEUhxOF0Ov1pBRpla5dSdseBhUJhpznH6tIsZb1KqacW+BGArUaUXX63UuplHJTNZjuEEONSyhozfd/n6mQ1RkXZL2itz7mu+80EDA4ONi8vL/8AcM2UbikyR2BU9cSmmTU70YqKIAj2hWFo2uenlHK/BRg3Y2aeNO5GyU8S0ZbFxcUuz/NKEXAGQKPjOCcymcyX1dIi8DSAiWQyeaavr68cbSgCuBknYubnQoj+TCYzUywWE6VS6S2ADsdx2gxw1X3L7SNENMbMnwE8qK+vf5NKpRaMaeVyeW8ikfiaSqW+R7BuZr5BRMe11p2u607U9Gk8kc/ntzPzQwCmExYATDLzVBiGE0KIowAOADDf3QA+aK2VDaxRajto3K+rq+tl5nYAzQBamHmeiOYBTGmtR6ph/1Rqg9c73pz7dD1qN0TpHyNQRCUDJXrAAAAAAElFTkSuQmCC',
    x =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAjtJREFUOE/NlD9oFEEUxn9v9ghC0hpRUogIAUmniGAT/5Q2FrETPSNRJILg7RwimI0ox85eQFCEBGIUO1PYpFM0jSConQoBEZGgGPsgl+w+2eM2bC57SopAFqYZ3v7m+977ZoQt+GQLmGxPaBiGgYiMWWvXBHZUGoZhH3BERPYC+4F+4Keq/urt7b1RLpf/ZEBVHa9Wq0HWyg3QKIoGVPU8cA7wgK/pUtXPQJ8xZk+pVBpuNBqXUoUiEvi+P56fzTpo6+SbwHNg1lo7WzTITGEKXFlZeeB53tVCpa3CK8AFa+1cBgvD8LKIXAQOJkkyICJDeYVBEJS6u7s/qeoLa+1o+l9TqXNuBLhmjDlbqVQ+5ICjInIfOBPH8W9jzGCR5YmJiRNxHM+papgqzqDvgSlr7VTernPuO3An3c9bBt74vv+yrdaKyLDv+/1Sq9UGPc97nY9EVuycU2AQOA7cAm4Dr4D5TvVxHB9rKo2iaEFVp621Ln96FEUngaOqGmSxabVqsh3a2h+x1h5qQjNrae/yE4+iaCwDJkky73neTuBZe129Xk+H+BS4l7ZqLVIZ2BhzuFKpvMsDVXXWGPMxFdAedOfcKeCRqj7MYrUhpz09PfXl5eXrectFWXXODQHpOq2qd/95o/JXr6ura3J1dXU6SZIfwKKIHAD2tVYMPBGRx77vN10UXtO85fTkmZmZHUtLSzUR2QXsBhaAL6r6DXhbrVYXi1yss59GqOgub/bN3Z7v6X/tb9Zmp/q/kN8s+lJb8oEAAAAASUVORK5CYII=',
    _ = {
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
    ee = s.defineComponent({
      name: 'SketchRule',
      components: { RulerWrapper: j },
      props: _,
      emits: ['onCornerClick'],
      setup(e, { emit: t }) {
        let l = s.ref(!0)
        l.value = e.isShowReferLine
        const u = s.computed(() => {
            function r(i, a) {
              return (
                Object.keys(i).forEach((o) => {
                  o &&
                    i.hasOwnProperty(o) &&
                    (typeof a[o] == 'object'
                      ? (i[o] = r(i[o], a[o]))
                      : a.hasOwnProperty(o) && (i[o] = a[o]))
                }),
                i
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
          d = s.computed(() => ({
            backgroundImage: l.value ? `url(${e.eyeIcon || J})` : `url(${e.closeEyeIcon || x})`,
            width: e.thick + 'px',
            height: e.thick + 'px',
            borderRight: `1px solid ${u.value.borderColor}`,
            borderBottom: `1px solid ${u.value.borderColor}`
          })),
          c = (r) => {
            ;(l.value = !l.value), t('onCornerClick', l.value)
          }
        return (
          s.watch([() => e.isShowReferLine], () => {
            l.value = e.isShowReferLine
          }),
          { showReferLine: l, paletteCpu: u, cornerStyle: d, onCornerClick: c }
        )
      }
    }),
    te = { id: 'mb-ruler', class: 'style-ruler mb-ruler' }
  function ne(e, t, l, u, d, c) {
    const r = n.resolveComponent('RulerWrapper')
    return (
      n.openBlock(),
      n.createElementBlock('div', te, [
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
            onClick: t[0] || (t[0] = (...h) => e.onCornerClick && e.onCornerClick(...h))
          },
          null,
          4
        )
      ])
    )
  }
  const X = p(ee, [['render', ne]])
  ;(g.SketchRule = X),
    (g.default = X),
    Object.defineProperties(g, {
      __esModule: { value: !0 },
      [Symbol.toStringTag]: { value: 'Module' }
    })
})
