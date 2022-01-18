var oe = Object.defineProperty
var T = Object.getOwnPropertySymbols
var le = Object.prototype.hasOwnProperty,
  re = Object.prototype.propertyIsEnumerable
var M = (f, l, t) =>
    l in f
      ? oe(f, l, { enumerable: !0, configurable: !0, writable: !0, value: t })
      : (f[l] = t),
  I = (f, l) => {
    for (var t in l || (l = {})) le.call(l, t) && M(f, t, l[t])
    if (T) for (var t of T(l)) re.call(l, t) && M(f, t, l[t])
    return f
  }
/*!
 * vue3-sketch-ruler v1.2.7
 * 2022年1月Tue Jan 18 2022 21:35:21 GMT+0800 (中国标准时间)
 * 制作
 */ ;(function (f, l) {
  typeof exports == 'object' && typeof module != 'undefined'
    ? l(exports, require('vue-demi'), require('vue'))
    : typeof define == 'function' && define.amd
    ? define(['exports', 'vue-demi', 'vue'], l)
    : ((f = typeof globalThis != 'undefined' ? globalThis : f || self),
      l((f.SketchRuler = {}), f.vueDemi, f.vue))
})(this, function (f, l, t) {
  'use strict'
  const A = {
    scale: Number,
    thick: Number,
    palette: Object,
    index: Number,
    start: Number,
    vertical: Boolean,
    value: Number,
    isShowReferLine: Boolean
  }
  var ae = '',
    S = (e, n) => {
      const s = e.__vccOpts || e
      for (const [c, d] of n) s[c] = d
      return s
    }
  const P = l.defineComponent({
      name: 'LineRuler',
      props: A,
      emits: ['onMouseDown', 'onRelease', 'onRemove'],
      setup(e, { emit: n }) {
        const s = l.ref(0),
          c = l.ref(!0)
        l.onMounted(() => {
          s.value = e.value
        })
        const d = o => {
            c.value = o >= 0
          },
          h = l.computed(() => {
            const o = (s.value - e.start) * e.scale
            d(o)
            const m = o + 'px'
            return e.vertical ? { top: m } : { left: m }
          }),
          a = l.computed(() => {
            var w
            const o = `1px solid ${
                (w = e.palette) == null ? void 0 : w.lineColor
              }`,
              m = e.vertical ? { borderTop: o } : { borderLeft: o },
              v = e.isShowReferLine
                ? e.vertical
                  ? 'ns-resize'
                  : 'ew-resize'
                : 'none'
            return I({ cursor: v }, m)
          }),
          u = l.computed(() =>
            e.vertical ? { left: e.thick + 'px' } : { top: e.thick + 'px' }
          )
        return {
          startValue: s,
          showLine: c,
          offset: h,
          borderCursor: a,
          actionStyle: u,
          handleDown: o => {
            const m = e.vertical ? o.clientY : o.clientX,
              v = s.value
            n('onMouseDown')
            const w = k => {
                const g = e.vertical ? k.clientY : k.clientX,
                  R = Math.round(v + (g - m) / e.scale)
                s.value = R
              },
              y = () => {
                n('onRelease', s.value, e.index),
                  document.removeEventListener('mousemove', w),
                  document.removeEventListener('mouseup', y)
              }
            document.addEventListener('mousemove', w),
              document.addEventListener('mouseup', y)
          },
          handleRemove: () => {
            n('onRemove', e.index)
          }
        }
      }
    }),
    z = { class: 'value' }
  function F(e, n, s, c, d, h) {
    return t.withDirectives(
      (t.openBlock(),
      t.createElementBlock(
        'div',
        {
          class: 'line',
          style: t.normalizeStyle([e.offset, e.borderCursor]),
          onMousedown:
            n[1] || (n[1] = (...a) => e.handleDown && e.handleDown(...a))
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
                    (n[0] = (...a) => e.handleRemove && e.handleRemove(...a))
                },
                '\xD7'
              ),
              t.createElementVNode(
                'span',
                z,
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
  var W = S(P, [
    ['render', F],
    ['__scopeId', 'data-v-2d56dba5']
  ])
  const X = e =>
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
    L = 0.83,
    j = (e, n, s, c, d, h) => {
      const { scale: a, width: u, height: i, ratio: r, palette: o } = d,
        {
          bgColor: m,
          fontColor: v,
          shadowColor: w,
          longfgColor: y,
          shortfgColor: k
        } = o
      if (
        (e.scale(r, r),
        e.clearRect(0, 0, u, i),
        (e.fillStyle = m),
        e.fillRect(0, 0, u, i),
        c)
      ) {
        const p = (s - n) * a,
          b = c * a
        ;(e.fillStyle = w),
          h
            ? e.fillRect(p, 0, b, (i * 3) / 8)
            : e.fillRect(0, p, (u * 3) / 8, b)
      }
      const g = X(a),
        R = g * a,
        N = g * 10,
        B = N * a,
        E = Math.floor(n / g) * g,
        O = Math.floor(n / N) * N,
        te = ((E - n) / g) * R,
        ne = ((O - n) / N) * B,
        V = n + Math.ceil((h ? u : i) / a)
      e.beginPath(), (e.fillStyle = v), (e.strokeStyle = y)
      for (let p = O, b = 0; p < V; p += N, b++) {
        const C = ne + b * B + 0.5
        h ? e.moveTo(C, 0) : e.moveTo(0, C),
          e.save(),
          h ? e.translate(C, i * 0.4) : e.translate(u * 0.4, C),
          h || e.rotate(-Math.PI / 2),
          e.scale(L / r, L / r),
          e.fillText(p.toString(), 4 * r, 7 * r),
          e.restore(),
          h ? e.lineTo(C, (i * 9) / 16) : e.lineTo((u * 9) / 16, C)
      }
      e.stroke(), e.closePath(), e.beginPath(), (e.strokeStyle = k)
      for (let p = E, b = 0; p < V; p += g, b++) {
        const C = te + b * R + 0.5
        h ? e.moveTo(C, 0) : e.moveTo(0, C),
          p % N != 0 &&
            (h ? e.lineTo(C, (i * 1) / 4) : e.lineTo((u * 1) / 4, C))
      }
      e.stroke(), e.closePath(), e.setTransform(1, 0, 0, 1, 0, 0)
    },
    Y = l.defineComponent({
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
        const s = l.reactive({ canvasContext: null })
        let c = 1
        const d = l.ref(null)
        l.onMounted(() => {
          ;(c = e.ratio || window.devicePixelRatio || 1), h(), a(c), u(c)
        })
        const h = () => {
            s.canvasContext = d.value && d.value.getContext('2d')
          },
          a = r => {
            if (d.value) {
              ;(d.value.width = e.width * r), (d.value.height = e.height * r)
              const o = s.canvasContext
              o &&
                ((o.font = `${12 * r}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`),
                (o.lineWidth = 1),
                (o.textBaseline = 'middle'))
            }
          },
          u = r => {
            const o = {
              scale: e.scale,
              width: e.width,
              height: e.height,
              palette: e.palette,
              ratio: r
            }
            s.canvasContext &&
              j(
                s.canvasContext,
                e.start,
                e.selectStart,
                e.selectLength,
                o,
                !e.vertical
              )
          }
        return (
          l.watch(
            () => e.start,
            () => u(c)
          ),
          l.watch([() => e.width, () => e.height], () => {
            a(c), u(c)
          }),
          {
            handle: (r, o) => {
              const m = (y, k, g) => Math.round(k + y / g),
                v = e.vertical ? r.offsetY : r.offsetX,
                w = m(v, e.start, e.scale)
              switch (o) {
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
            canvas: d
          }
        )
      }
    })
  function H(e, n, s, c, d, h) {
    return (
      t.openBlock(),
      t.createElementBlock(
        'canvas',
        {
          ref: 'canvas',
          class: 'ruler',
          onClick: n[0] || (n[0] = a => e.handle(a, 'click')),
          onMouseenter: n[1] || (n[1] = a => e.handle(a, 'enter')),
          onMousemove: n[2] || (n[2] = a => e.handle(a, 'move')),
          onMouseleave:
            n[3] || (n[3] = a => e.$emit('update:showIndicator', !1))
        },
        null,
        544
      )
    )
  }
  var D = S(Y, [['render', H]])
  const U = {
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
  var se = ''
  const q = l.defineComponent({
      name: 'RulerWrapper',
      components: { CanvasRuler: D, RulerLine: W },
      props: U,
      setup(e) {
        const n = l.ref(!1),
          s = l.ref(0),
          c = l.computed(() => (e.vertical ? 'v-container' : 'h-container')),
          d = l.computed(() => {
            const r = {
                width: `calc(100% - ${e.thick}px)`,
                height: `${e.thick + 1}px`,
                left: `${e.thick}px`
              },
              o = {
                width: `${e.thick && e.thick + 1}px`,
                height: `calc(100% - ${e.thick}px)`,
                top: `${e.thick}px`
              }
            return e.vertical ? o : r
          }),
          h = l.computed(() => {
            var v
            const r = (s.value - e.start) * e.scale
            let o = 'top',
              m = 'borderLeft'
            return (
              (o = e.vertical ? 'top' : 'left'),
              (m = e.vertical ? 'borderBottom' : 'borderLeft'),
              {
                [o]: r + 'px',
                [m]: `1px solid ${
                  (v = e.palette) == null ? void 0 : v.lineColor
                }`
              }
            )
          }),
          a = r => {
            e.lines.push(r)
          },
          u = (r, o) => {
            const m = r - e.start,
              v = (e.vertical ? e.height : e.width) / e.scale
            m < 0 || m > v ? i(o) : (e.lines[o] = r)
          },
          i = r => {
            e.lines.splice(r, 1)
          }
        return {
          showIndicator: n,
          valueNum: s,
          rwClassName: c,
          rwStyle: d,
          indicatorStyle: h,
          handleNewLine: a,
          handleLineRelease: u,
          handleLineRemove: i
        }
      }
    }),
    G = { class: 'lines' },
    K = { class: 'value' }
  function Q(e, n, s, c, d, h) {
    const a = t.resolveComponent('CanvasRuler'),
      u = t.resolveComponent('RulerLine')
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
              'onUpdate:valueNum': n[0] || (n[0] = i => (e.valueNum = i)),
              showIndicator: e.showIndicator,
              'onUpdate:showIndicator':
                n[1] || (n[1] = i => (e.showIndicator = i)),
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
              G,
              [
                (t.openBlock(!0),
                t.createElementBlock(
                  t.Fragment,
                  null,
                  t.renderList(
                    e.lines,
                    (i, r) => (
                      t.openBlock(),
                      t.createBlock(
                        u,
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
            [[t.vShow, e.isShowReferLine]]
          ),
          t.withDirectives(
            t.createElementVNode(
              'div',
              { class: 'indicator', style: t.normalizeStyle(e.indicatorStyle) },
              [
                t.createElementVNode('div', K, t.toDisplayString(e.valueNum), 1)
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
  var Z = S(q, [
    ['render', Q],
    ['__scopeId', 'data-v-65a7f0f6']
  ])
  const J = {
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
  var ie = ''
  const _ = l.defineComponent({
      name: 'SketchRule',
      components: { RulerWrapper: Z },
      props: J,
      emits: ['onCornerClick', 'handleLine'],
      setup(e, { emit: n }) {
        const s = l.computed(() => {
            function a(i, r) {
              return (
                Object.keys(i).forEach(o => {
                  o &&
                    i.hasOwnProperty(o) &&
                    (typeof r.key == 'object'
                      ? (i[o] = a(i[o], r[o]))
                      : r.hasOwnProperty(o) && (i[o] = r[o]))
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
          c = l.computed(() => (e.cornerActive ? ' active' : '')),
          d = l.computed(() => ({
            backgroundColor: s.value.bgColor,
            width: e.thick + 'px',
            height: e.thick + 'px',
            borderRight: `1px solid ${s.value.borderColor}`,
            borderBottom: `1px solid ${s.value.borderColor}`
          }))
        return {
          paletteCpu: s,
          cornerActiveClass: c,
          cornerStyle: d,
          onCornerClick: a => {
            n('onCornerClick', a)
          }
        }
      }
    }),
    x = { id: 'mb-ruler', class: 'style-ruler mb-ruler' }
  function ee(e, n, s, c, d, h) {
    const a = t.resolveComponent('RulerWrapper')
    return (
      t.openBlock(),
      t.createElementBlock('div', x, [
        t.createVNode(
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
        t.createVNode(
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
        t.createElementVNode(
          'a',
          {
            class: t.normalizeClass(['corner', e.cornerActiveClass]),
            style: t.normalizeStyle(e.cornerStyle),
            onClick:
              n[0] ||
              (n[0] = (...u) => e.onCornerClick && e.onCornerClick(...u))
          },
          null,
          6
        )
      ])
    )
  }
  var $ = S(_, [['render', ee]])
  ;(f.SketchRule = $),
    (f.default = $),
    Object.defineProperty(f, '__esModule', { value: !0 }),
    (f[Symbol.toStringTag] = 'Module')
})
