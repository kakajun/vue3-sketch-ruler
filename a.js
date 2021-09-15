var __defProp = Object.defineProperty,
  __defProps = Object.defineProperties,
  __getOwnPropDescs = Object.getOwnPropertyDescriptors,
  __getOwnPropSymbols = Object.getOwnPropertySymbols,
  __hasOwnProp = Object.prototype.hasOwnProperty,
  __propIsEnum = Object.prototype.propertyIsEnumerable,
  __defNormalProp = (e, t, n) =>
    t in e
      ? __defProp(e, t, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: n
        })
      : (e[t] = n),
  __spreadValues = (e, t) => {
    for (var n in t || (t = {}))
      __hasOwnProp.call(t, n) && __defNormalProp(e, n, t[n])
    if (__getOwnPropSymbols)
      for (var n of __getOwnPropSymbols(t))
        __propIsEnum.call(t, n) && __defNormalProp(e, n, t[n])
    return e
  },
  __spreadProps = (e, t) => __defProps(e, __getOwnPropDescs(t)),
  __publicField = (e, t, n) => (
    __defNormalProp(e, 'symbol' != typeof t ? t + '' : t, n), n
  )
/*!
 * @nutui/nutui v3.1.5 Fri Sep 10 2021 15:31:31 GMT+0800 (中国标准时间)
 * (c) 2021 @jdf2e.
 * Released under the MIT License.
 */
!(function (e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? t(exports, require('vue'), require('vue-router'))
    : 'function' == typeof define && define.amd
    ? define(['exports', 'vue', 'vue-router'], t)
    : t(
        ((e = 'undefined' != typeof globalThis ? globalThis : e || self).nutui =
          {}),
        e.Vue,
        e.vueRouter
      )
})(this, function (e, t, n) {
  'use strict'
  function o(e) {
    const n = 'nut-' + e
    return {
      componentName: n,
      create: function (o) {
        return (
          (o.baseName = e),
          (o.name = n),
          (o.install = e => {
            e.component(o.name, o)
          }),
          t.defineComponent(o)
        )
      },
      createDemo: function (n) {
        return (n.baseName = e), (n.name = 'demo-' + e), t.defineComponent(n)
      }
    }
  }
  const { componentName: l, create: a } = o('avatar')
  var i = a({
    props: {
      size: { type: String, default: 'normal' },
      shape: { type: String, default: 'round' },
      bgColor: { type: String, default: '#eee' },
      icon: { type: String, default: '' }
    },
    emits: ['active-avatar'],
    setup(e, { emit: n, slots: o }) {
      const { size: a, shape: i, bgColor: r, icon: s } = t.toRefs(e),
        c = ['large', 'normal', 'small']
      return {
        classes: t.computed(() => ({
          [l]: !0,
          ['avatar-' + a.value]: !0,
          ['avatar-' + i.value]: !0
        })),
        styles: t.computed(() => ({
          width: c.indexOf(a.value) > -1 ? '' : `${a.value}px`,
          height: c.indexOf(a.value) > -1 ? '' : `${a.value}px`,
          backgroundColor: `${r.value}`
        })),
        iconStyles: t.computed(() => (s.value ? s.value : '')),
        isShowText: t.computed(() => o.default),
        activeAvatar: e => {
          n('active-avatar', e)
        }
      }
    }
  })
  const r = { key: 0, class: 'text' }
  i.render = function (e, n, o, l, a, i) {
    const s = t.resolveComponent('nut-icon')
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        {
          style: t.normalizeStyle(e.styles),
          class: t.normalizeClass(e.classes),
          onClick: n[0] || (n[0] = t => e.activeAvatar(e.e))
        },
        [
          t.createVNode(s, { class: 'icon', name: e.iconStyles }, null, 8, [
            'name'
          ]),
          e.isShowText
            ? (t.openBlock(),
              t.createElementBlock('view', r, [
                t.renderSlot(e.$slots, 'default')
              ]))
            : t.createCommentVNode('', !0)
        ],
        6
      )
    )
  }
  const s = e => (isNaN(Number(e)) ? String(e) : `${e}px`),
    { componentName: c, create: u } = o('icon')
  var d = u({
    props: {
      name: { type: String, default: '' },
      size: { type: [String, Number], default: '' },
      classPrefix: { type: String, default: 'nut-icon' },
      fontClassName: { type: String, default: 'nutui-iconfont' },
      color: { type: String, default: '' },
      tag: { type: String, default: 'i' }
    },
    emits: ['click'],
    setup(e, { emit: n, slots: o }) {
      const l = e => {
        n('click', e)
      }
      return () => {
        var n
        const a = !!e.name && -1 !== e.name.indexOf('/')
        return t.h(
          a ? 'img' : e.tag,
          {
            class: a
              ? `${c}__img`
              : `${e.fontClassName} ${c} ${e.classPrefix}-${e.name}`,
            style: {
              color: e.color,
              fontSize: s(e.size),
              width: s(e.size),
              height: s(e.size)
            },
            onClick: l,
            src: a ? e.name : ''
          },
          null == (n = o.default) ? void 0 : n.call(o)
        )
      }
    }
  })
  const { componentName: p, create: m } = o('button')
  var h = m({
    components: { [d.name]: d },
    props: {
      color: String,
      shape: { type: String, default: 'round' },
      plain: { type: Boolean, default: !1 },
      loading: { type: Boolean, default: !1 },
      disabled: { type: Boolean, default: !1 },
      type: { type: String, default: 'default' },
      size: { type: String, default: 'normal' },
      block: { type: Boolean, default: !1 },
      icon: { type: String, default: '' }
    },
    emits: ['click'],
    setup(e, { emit: n, slots: o }) {
      const {
        type: l,
        size: a,
        shape: i,
        disabled: r,
        loading: s,
        color: c,
        plain: u,
        block: d
      } = t.toRefs(e)
      return {
        handleClick: e => {
          s.value || r.value || n('click', e)
        },
        classes: t.computed(() => {
          const e = p
          return {
            [e]: !0,
            [`${e}--${l.value}`]: l.value,
            [`${e}--${a.value}`]: a.value,
            [`${e}--${i.value}`]: i.value,
            [`${e}--plain`]: u.value,
            [`${e}--block`]: d.value,
            [`${e}--disabled`]: r.value,
            [`${e}--loading`]: s.value
          }
        }),
        getStyle: t.computed(() => {
          var e
          const t = {}
          return (
            (null == c ? void 0 : c.value) &&
              (u.value
                ? ((t.color = c.value),
                  (t.background = '#fff'),
                  (null == (e = c.value) ? void 0 : e.includes('gradient')) ||
                    (t.borderColor = c.value))
                : ((t.color = '#fff'), (t.background = c.value))),
            t
          )
        })
      }
    }
  })
  const g = { class: 'nut-button__warp' }
  h.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-icon')
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        {
          class: t.normalizeClass(e.classes),
          style: t.normalizeStyle(e.getStyle),
          onClick:
            n[0] || (n[0] = (...t) => e.handleClick && e.handleClick(...t))
        },
        [
          t.createElementVNode('view', g, [
            e.loading
              ? (t.openBlock(),
                t.createBlock(r, { key: 0, class: 'nut-icon-loading' }))
              : t.createCommentVNode('', !0),
            e.icon && !e.loading
              ? (t.openBlock(),
                t.createBlock(
                  r,
                  { key: 1, class: t.normalizeClass(e.icon), name: e.icon },
                  null,
                  8,
                  ['class', 'name']
                ))
              : t.createCommentVNode('', !0),
            e.$slots.default
              ? (t.openBlock(),
                t.createElementBlock(
                  'view',
                  {
                    key: 2,
                    class: t.normalizeClass({ text: e.icon || e.loading })
                  },
                  [t.renderSlot(e.$slots, 'default')],
                  2
                ))
              : t.createCommentVNode('', !0)
          ])
        ],
        6
      )
    )
  }
  const { componentName: y, create: f } = o('cell')
  var v = f({
    props: {
      title: { type: String, default: '' },
      subTitle: { type: String, default: '' },
      desc: { type: String, default: '' },
      descTextAlign: { type: String, default: 'right' },
      isLink: { type: Boolean, default: !1 },
      to: { type: String, default: '' },
      replace: { type: Boolean, default: !1 },
      roundRadius: { type: [String, Number], default: '' },
      url: { type: String, default: '' },
      icon: { type: String, default: '' }
    },
    emits: ['click'],
    setup(e, { emit: o }) {
      const l = t.computed(() => ({
          [y]: !0,
          [`${y}--clickable`]: e.isLink || e.to
        })),
        a = n.useRouter()
      return {
        handleClick: t => {
          o('click', t),
            e.to && a
              ? a[e.replace ? 'replace' : 'push'](e.to)
              : e.url &&
                (e.replace ? location.replace(e.url) : (location.href = e.url))
        },
        classes: l,
        baseStyle: t.computed(() => ({ borderRadius: s(e.roundRadius) }))
      }
    }
  })
  const k = { class: 'title' },
    b = { class: 'nut-cell__title-desc' }
  v.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-icon')
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        {
          class: t.normalizeClass(e.classes),
          style: t.normalizeStyle(e.baseStyle),
          onClick:
            n[0] || (n[0] = (...t) => e.handleClick && e.handleClick(...t))
        },
        [
          t.renderSlot(e.$slots, 'default', {}, () => [
            e.title || e.subTitle || e.icon
              ? (t.openBlock(),
                t.createElementBlock(
                  'view',
                  {
                    key: 0,
                    class: t.normalizeClass([
                      'nut-cell__title',
                      { icon: e.icon || e.$slots.icon }
                    ])
                  },
                  [
                    e.$slots.icon
                      ? t.renderSlot(e.$slots, 'icon', { key: 0 })
                      : e.icon
                      ? (t.openBlock(),
                        t.createBlock(
                          r,
                          { key: 1, class: 'icon', name: e.icon },
                          null,
                          8,
                          ['name']
                        ))
                      : t.createCommentVNode('', !0),
                    e.subTitle
                      ? (t.openBlock(),
                        t.createElementBlock(
                          t.Fragment,
                          { key: 2 },
                          [
                            t.createElementVNode(
                              'view',
                              k,
                              t.toDisplayString(e.title),
                              1
                            ),
                            t.createElementVNode(
                              'view',
                              b,
                              t.toDisplayString(e.subTitle),
                              1
                            )
                          ],
                          64
                        ))
                      : (t.openBlock(),
                        t.createElementBlock(
                          t.Fragment,
                          { key: 3 },
                          [t.createTextVNode(t.toDisplayString(e.title), 1)],
                          64
                        ))
                  ],
                  2
                ))
              : t.createCommentVNode('', !0),
            e.desc
              ? (t.openBlock(),
                t.createElementBlock(
                  'view',
                  {
                    key: 1,
                    class: 'nut-cell__value',
                    style: t.normalizeStyle({ 'text-align': e.descTextAlign })
                  },
                  t.toDisplayString(e.desc),
                  5
                ))
              : t.createCommentVNode('', !0),
            e.$slots.link
              ? t.renderSlot(e.$slots, 'link', { key: 2 })
              : e.isLink || e.to
              ? (t.openBlock(),
                t.createBlock(r, {
                  key: 3,
                  class: 'nut-cell__link',
                  name: 'right'
                }))
              : t.createCommentVNode('', !0)
          ])
        ],
        6
      )
    )
  }
  const { componentName: w, create: S } = o('cell-group')
  var x = S({
    props: { title: { type: String, default: '' } },
    setup: () => ({ classes: t.computed(() => ({ [w]: !0 })) })
  })
  const C = { key: 0, class: 'nut-cell-group__title' },
    B = { class: 'nut-cell-group__warp' }
  x.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        { class: t.normalizeClass(e.classes) },
        [
          e.title
            ? (t.openBlock(),
              t.createElementBlock('view', C, t.toDisplayString(e.title), 1))
            : t.createCommentVNode('', !0),
          t.createElementVNode('view', B, [t.renderSlot(e.$slots, 'default')])
        ],
        2
      )
    )
  }
  const { componentName: N, create: E } = o('price')
  var _ = E({
    props: {
      price: { type: [Number, String], default: 0 },
      needSymbol: { type: Boolean, default: !0 },
      symbol: { type: String, default: '&yen;' },
      decimalDigits: { type: Number, default: 2 },
      thousands: { type: Boolean, default: !1 }
    },
    setup(e) {
      const n = t.computed(() => ({ [N]: !0 })),
        o = t.computed(() => (e.needSymbol ? e.symbol : '')),
        l = e => String(e).indexOf('.') > 0
      return {
        classes: n,
        showSymbol: o,
        checkPoint: l,
        formatThousands: t => (
          0 == Number(t) && (t = 0),
          (t = l(t)
            ? 'string' ==
              typeof (t = Number(t).toFixed(e.decimalDigits)).split('.')
              ? t.split('.')
              : t.split('.')[0]
            : t.toString()),
          e.thousands
            ? (t || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
            : t
        ),
        formatDecimal: t => {
          0 == Number(t) && (t = 0),
            (t = l(t)
              ? 'string' ==
                typeof (t = Number(t).toFixed(e.decimalDigits)).split('.')
                ? 0
                : t.split('.')[1]
              : t.toString())
          const n = Number('0.' + t).toFixed(e.decimalDigits)
          return String(n).substring(2, n.length)
        }
      }
    }
  })
  const z = ['innerHTML'],
    T = { class: 'nut-price--big' },
    V = t.createElementVNode('view', { class: 'nut-price--point' }, '.', -1),
    D = { class: 'nut-price--small' }
  _.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        { class: t.normalizeClass(e.classes) },
        [
          e.needSymbol
            ? (t.openBlock(),
              t.createElementBlock(
                'view',
                { key: 0, class: 'nut-price--symbol', innerHTML: e.showSymbol },
                null,
                8,
                z
              ))
            : t.createCommentVNode('', !0),
          t.createElementVNode(
            'view',
            T,
            t.toDisplayString(e.formatThousands(e.price)),
            1
          ),
          V,
          t.createElementVNode(
            'view',
            D,
            t.toDisplayString(e.formatDecimal(e.price)),
            1
          )
        ],
        2
      )
    )
  }
  const { componentName: I, create: M } = o('overlay'),
    L = {
      visible: { type: Boolean, default: !1 },
      zIndex: { type: [Number, String], default: 2e3 },
      duration: { type: [Number, String], default: 0.3 },
      overlayClass: { type: String, default: '' },
      lockScroll: { type: Boolean, default: !0 },
      overlayStyle: { type: Object },
      closeOnClickOverlay: { type: Boolean, default: !0 }
    }
  var P = M({
    props: L,
    emits: ['click', 'update:visible'],
    setup: (e, { emit: n }) => ({
      classes: t.computed(() => ({ [I]: !0, [e.overlayClass]: !0 })),
      style: t.computed(() =>
        __spreadValues(
          { animationDuration: `${e.duration}s`, zIndex: e.zIndex },
          e.overlayStyle
        )
      ),
      touchmove: t => {
        e.lockScroll && t.preventDefault()
      },
      onClick: t => {
        n('click', t), e.closeOnClickOverlay && n('update:visible', !1)
      }
    })
  })
  P.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createBlock(
        t.Transition,
        { name: 'overlay-fade' },
        {
          default: t.withCtx(() => [
            t.withDirectives(
              t.createElementVNode(
                'view',
                {
                  class: t.normalizeClass(e.classes),
                  onTouchmove:
                    n[0] ||
                    (n[0] = t.withModifiers(
                      (...t) => e.touchmove && e.touchmove(...t),
                      ['stop']
                    )),
                  onClick:
                    n[1] || (n[1] = (...t) => e.onClick && e.onClick(...t)),
                  style: t.normalizeStyle(e.style)
                },
                [t.renderSlot(e.$slots, 'default')],
                38
              ),
              [[t.vShow, e.visible]]
            )
          ]),
          _: 3
        }
      )
    )
  }
  const { create: j } = o('layout')
  var $ = j({})
  const { componentName: A, create: F } = o('col')
  var O = F({
    props: {
      span: { type: [String, Number], default: '24' },
      offset: { type: [String, Number], default: '0' }
    },
    setup(e) {
      const n = A,
        o = t.inject('gutter')
      return {
        classes: t.computed(() => ({
          [n]: !0,
          [n + '-gutter']: o,
          ['nut-col-' + e.span]: !0,
          ['nut-col-offset-' + e.offset]: !0
        })),
        style: t.computed(() => ({
          paddingLeft: o / 2 + 'px',
          paddingRight: o / 2 + 'px'
        }))
      }
    }
  })
  O.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        {
          class: t.normalizeClass(e.classes),
          style: t.normalizeStyle(e.style)
        },
        [t.renderSlot(e.$slots, 'default')],
        6
      )
    )
  }
  const { componentName: q, create: R } = o('row')
  var H = R({
    props: {
      type: { type: String, default: '' },
      gutter: { type: [String, Number], default: '' },
      justify: { type: String, default: 'start' },
      align: { type: String, default: 'flex-start' },
      wrap: { type: String, default: 'nowrap' }
    },
    setup(e) {
      const n = q
      t.provide('gutter', e.gutter)
      const o = (e, t) => (e ? (t ? `nut-row-${e}-${t}` : '') : `nut-row-${t}`)
      return {
        getClasses: () =>
          `\n              ${o('', e.type)}\n              ${o(
            'justify',
            e.justify
          )}\n              ${o('align', e.align)}\n              ${o(
            'flex',
            e.wrap
          )}\n              ${n}\n              `
      }
    }
  })
  H.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        { class: t.normalizeClass(e.getClasses()) },
        [t.renderSlot(e.$slots, 'default')],
        2
      )
    )
  }
  function Y() {
    const e = t.ref(0),
      n = t.ref(0),
      o = t.ref(0),
      l = t.ref(0),
      a = t.ref(0),
      i = t.ref(0),
      r = t.ref(''),
      s = () => {
        ;(o.value = 0),
          (l.value = 0),
          (a.value = 0),
          (i.value = 0),
          (r.value = '')
      }
    return {
      move: t => {
        const s = t.touches[0]
        var c, u
        ;(o.value = s.clientX - e.value),
          (l.value = s.clientY - n.value),
          (a.value = Math.abs(o.value)),
          (i.value = Math.abs(l.value)),
          r.value ||
            (r.value =
              ((c = a.value),
              (u = i.value),
              c > u && c > 10
                ? 'horizontal'
                : u > c && u > 10
                ? 'vertical'
                : ''))
      },
      start: t => {
        s(), (e.value = t.touches[0].clientX), (n.value = t.touches[0].clientY)
      },
      reset: s,
      startX: e,
      startY: n,
      deltaX: o,
      deltaY: l,
      offsetX: a,
      offsetY: i,
      direction: r,
      isVertical: () => 'vertical' === r.value,
      isHorizontal: () => 'horizontal' === r.value
    }
  }
  const { componentName: W, create: X } = o('swipe')
  var U = X({
    props: {
      name: { type: String, default: '' },
      disabled: { type: Boolean, default: !1 }
    },
    emits: ['open', 'close'],
    setup(e, { emit: n }) {
      const o = t.computed(() => ({ [W]: !0 })),
        l = e => {
          var t
          return (null == (t = e.value) ? void 0 : t.clientWidth) || 0
        },
        a = t.ref(),
        i = t.computed(() => l(a)),
        r = t.ref(),
        s = t.computed(() => l(r))
      let c = !1,
        u = '',
        d = ''
      const p = t.reactive({ offset: 0, moving: !1 }),
        m = (t = '') => {
          ;(c = !0),
            t && (p.offset = 'left' === t ? -s.value : i.value),
            n('open', { name: e.name, position: u || t })
        },
        h = () => {
          ;(p.offset = 0), (c = !1), n('close', { name: e.name, position: u })
        },
        g = t.computed(() => ({
          transform: `translate3d(${p.offset}px, 0, 0)`
        })),
        y = Y()
      return __spreadProps(
        __spreadValues(
          { classes: o, touchStyle: g },
          {
            onTouchStart(t) {
              e.disabled || y.start(t)
            },
            onTouchMove(t) {
              e.disabled ||
                (0 == y.isVertical() &&
                  ((p.moving = !0),
                  y.move(t),
                  (e => {
                    u = e > 0 ? 'right' : 'left'
                    let t = e
                    switch (u) {
                      case 'left':
                        t =
                          (c && d === u) || Math.abs(e) > s.value ? -s.value : e
                        break
                      case 'right':
                        t =
                          (c && d === u) || Math.abs(e) > i.value ? i.value : e
                    }
                    p.offset = t
                  })(y.deltaX.value),
                  t.preventDefault()))
            },
            onTouchEnd() {
              if (p.moving)
                switch (((p.moving = !1), (d = u), u)) {
                  case 'left':
                    Math.abs(p.offset) <= s.value / 2
                      ? h()
                      : ((p.offset = -s.value), m())
                    break
                  case 'right':
                    Math.abs(p.offset) <= i.value / 2
                      ? h()
                      : ((p.offset = i.value), m())
                }
            }
          }
        ),
        { leftRef: a, rightRef: r, open: m, close: h }
      )
    }
  })
  const K = { class: 'nut-swipe__left', ref: 'leftRef' },
    G = { class: 'nut-swipe__content' },
    J = { class: 'nut-swipe__right', ref: 'rightRef' }
  U.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        {
          class: t.normalizeClass(e.classes),
          style: t.normalizeStyle(e.touchStyle),
          onTouchstart:
            n[0] || (n[0] = (...t) => e.onTouchStart && e.onTouchStart(...t)),
          onTouchmove:
            n[1] || (n[1] = (...t) => e.onTouchMove && e.onTouchMove(...t)),
          onTouchend:
            n[2] || (n[2] = (...t) => e.onTouchEnd && e.onTouchEnd(...t)),
          onTouchcancel:
            n[3] || (n[3] = (...t) => e.onTouchEnd && e.onTouchEnd(...t))
        },
        [
          t.createElementVNode(
            'view',
            K,
            [t.renderSlot(e.$slots, 'left')],
            512
          ),
          t.createElementVNode('view', G, [t.renderSlot(e.$slots, 'default')]),
          t.createElementVNode(
            'view',
            J,
            [t.renderSlot(e.$slots, 'right')],
            512
          )
        ],
        38
      )
    )
  }
  let Q = 0
  const Z = 'nut-overflow-hidden',
    { componentName: ee, create: te } = o('popup')
  let ne = 2e3
  const oe = __spreadProps(__spreadValues({}, L), {
    position: { type: String, default: 'center' },
    transition: String,
    style: { type: Object },
    popClass: { type: String, default: '' },
    closeable: { type: Boolean, default: !1 },
    closeIconPosition: { type: String, default: 'top-right' },
    closeIcon: { type: String, default: 'close' },
    destroyOnClose: { type: Boolean, default: !0 },
    teleport: { type: [String, Element], default: 'body' },
    overlay: { type: Boolean, default: !0 },
    round: { type: Boolean, default: !1 }
  })
  var le = te({
    components: { [P.name]: P, [d.name]: d },
    props: __spreadValues({}, oe),
    emits: [
      'click',
      'click-close-icon',
      'open',
      'close',
      'opend',
      'closed',
      'update:visible',
      'click-overlay'
    ],
    setup(e, { emit: n }) {
      const o = t.reactive({
          zIndex: e.zIndex ? e.zIndex : ne,
          showSlot: !0,
          transitionName: `popup-fade-${e.position}`,
          overLayCount: 1,
          keepAlive: !1
        }),
        [l, a] =
          ((i = () => e.lockScroll),
          [
            () => {
              i() && (!Q && document.body.classList.add(Z), Q++)
            },
            () => {
              i() && Q && (Q--, !Q && document.body.classList.remove(Z))
            }
          ])
      var i
      const r = t.computed(() => ({
          [ee]: !0,
          round: e.round,
          [`popup-${e.position}`]: !0,
          [e.popClass]: !0
        })),
        s = t.computed(() =>
          __spreadValues(
            {
              zIndex: o.zIndex,
              animationDuration: e.duration ? `${e.duration}s` : 'initial'
            },
            e.style
          )
        ),
        c = () => {
          e.visible ||
            (void 0 !== e.zIndex && (ne = Number(e.zIndex)),
            n('update:visible', !0),
            l(),
            (o.zIndex = ++ne)),
            e.destroyOnClose && (o.showSlot = !0),
            n('open')
        },
        u = () => {
          e.visible &&
            (a(),
            n('update:visible', !1),
            e.destroyOnClose &&
              setTimeout(() => {
                ;(o.showSlot = !1), n('close')
              }, 1e3 * +e.duration))
        }
      return (
        t.onMounted(() => {
          e.transition
            ? (o.transitionName = e.transition)
            : (o.transitionName = `popup-slide-${e.position}`),
            e.visible && c()
        }),
        t.onBeforeUnmount(() => {
          e.visible && u()
        }),
        t.onBeforeMount(() => {
          e.visible && a()
        }),
        t.onActivated(() => {
          o.keepAlive && (n('update:visible', !0), (o.keepAlive = !1))
        }),
        t.onDeactivated(() => {
          e.visible && (u(), (o.keepAlive = !0))
        }),
        t.watch(
          () => e.visible,
          e => {
            e ? c() : u()
          }
        ),
        t.watch(
          () => e.position,
          e => {
            o.transitionName =
              'center' === e ? 'popup-fade' : `popup-slide-${e}`
          }
        ),
        __spreadProps(__spreadValues({}, t.toRefs(o)), {
          popStyle: s,
          classes: r,
          onClick: e => {
            n('click', e)
          },
          onClickCloseIcon: e => {
            n('click-close-icon', e), u()
          },
          onClickOverlay: t => {
            e.closeOnClickOverlay && (n('click-overlay', t), u())
          },
          onOpened: e => {
            n('opend', e)
          },
          onClosed: e => {
            n('closed', e)
          }
        })
      )
    }
  })
  le.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-overlay'),
      s = t.resolveComponent('nut-icon')
    return (
      t.openBlock(),
      t.createBlock(
        t.Teleport,
        { to: e.teleport },
        [
          e.overlay
            ? (t.openBlock(),
              t.createBlock(
                r,
                {
                  key: 0,
                  visible: e.visible,
                  'close-on-click-overlay': e.closeOnClickOverlay,
                  class: t.normalizeClass(e.overlayClass),
                  style: t.normalizeStyle(e.overlayStyle),
                  'z-index': e.zIndex,
                  'lock-scroll': e.lockScroll,
                  duration: e.duration,
                  onClick: e.onClickOverlay
                },
                null,
                8,
                [
                  'visible',
                  'close-on-click-overlay',
                  'class',
                  'style',
                  'z-index',
                  'lock-scroll',
                  'duration',
                  'onClick'
                ]
              ))
            : t.createCommentVNode('', !0),
          t.createVNode(
            t.Transition,
            {
              name: e.transitionName,
              onAfterEnter: e.onOpened,
              onAfterLeave: e.onClosed
            },
            {
              default: t.withCtx(() => [
                t.withDirectives(
                  t.createElementVNode(
                    'view',
                    {
                      class: t.normalizeClass(e.classes),
                      style: t.normalizeStyle(e.popStyle),
                      onClick:
                        n[1] || (n[1] = (...t) => e.onClick && e.onClick(...t))
                    },
                    [
                      e.showSlot
                        ? t.renderSlot(e.$slots, 'default', { key: 0 })
                        : t.createCommentVNode('', !0),
                      e.closeable
                        ? (t.openBlock(),
                          t.createElementBlock(
                            'view',
                            {
                              key: 1,
                              onClick:
                                n[0] ||
                                (n[0] = (...t) =>
                                  e.onClickCloseIcon &&
                                  e.onClickCloseIcon(...t)),
                              class: t.normalizeClass([
                                'nutui-popup__close-icon',
                                'nutui-popup__close-icon--' +
                                  e.closeIconPosition
                              ])
                            },
                            [
                              t.createVNode(
                                s,
                                { name: e.closeIcon, size: '12px' },
                                null,
                                8,
                                ['name']
                              )
                            ],
                            2
                          ))
                        : t.createCommentVNode('', !0)
                    ],
                    6
                  ),
                  [[t.vShow, e.visible]]
                )
              ]),
              _: 3
            },
            8,
            ['name', 'onAfterEnter', 'onAfterLeave']
          )
        ],
        8,
        ['to']
      )
    )
  }
  const { componentName: ae, create: ie } = o('actionsheet'),
    re = ie({
      props: __spreadProps(__spreadValues({}, oe), {
        cancelTxt: { type: String, default: '' },
        optionTag: { type: String, default: 'name' },
        optionSubTag: { type: String, default: 'subname' },
        chooseTagValue: { type: String, default: '' },
        title: { type: String, default: '' },
        color: { type: String, default: '#ee0a24' },
        description: { type: String, default: '' },
        menuItems: { type: Array, default: () => [] }
      }),
      emits: ['cancel', 'choose', 'update:visible'],
      setup: (e, { emit: n }) => ({
        isHighlight: t =>
          e.chooseTagValue && e.chooseTagValue === t[e.optionTag]
            ? e.color
            : '#1a1a1a',
        cancelActionSheet: () => {
          n('cancel'), n('update:visible', !1)
        },
        chooseItem: (e, t) => {
          e.disable || (n('choose', e, t), n('update:visible', !1))
        },
        close: () => {
          n('close'), n('update:visible', !1)
        },
        classes: t.computed(() => ({ [ae]: !0 }))
      })
    }),
    se = { class: 'nut-actionsheet-panel' },
    ce = { key: 0, class: 'nut-actionsheet-title' },
    ue = { key: 1, class: 'nut-actionsheet-item desc' },
    de = { key: 2, class: 'nut-actionsheet-menu' },
    pe = ['onClick'],
    me = { class: 'subdesc' }
  re.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-popup')
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        { class: t.normalizeClass(e.classes) },
        [
          t.createVNode(
            r,
            {
              'pop-class': 'popclass',
              visible: e.visible,
              position: 'bottom',
              round: '',
              onClickOverlay: e.close
            },
            {
              default: t.withCtx(() => [
                t.createElementVNode('view', se, [
                  e.title
                    ? (t.openBlock(),
                      t.createElementBlock(
                        'view',
                        ce,
                        t.toDisplayString(e.title),
                        1
                      ))
                    : t.createCommentVNode('', !0),
                  e.description
                    ? (t.openBlock(),
                      t.createElementBlock(
                        'view',
                        ue,
                        t.toDisplayString(e.description),
                        1
                      ))
                    : t.createCommentVNode('', !0),
                  e.menuItems.length
                    ? (t.openBlock(),
                      t.createElementBlock('view', de, [
                        (t.openBlock(!0),
                        t.createElementBlock(
                          t.Fragment,
                          null,
                          t.renderList(
                            e.menuItems,
                            (n, o) => (
                              t.openBlock(),
                              t.createElementBlock(
                                'view',
                                {
                                  class: t.normalizeClass([
                                    'nut-actionsheet-item',
                                    {
                                      'nut-actionsheet-item-disabled': n.disable
                                    }
                                  ]),
                                  style: t.normalizeStyle({
                                    color: e.isHighlight(n)
                                  }),
                                  key: o,
                                  onClick: t => e.chooseItem(n, o)
                                },
                                [
                                  t.createTextVNode(
                                    t.toDisplayString(n[e.optionTag]),
                                    1
                                  ),
                                  t.createElementVNode(
                                    'view',
                                    me,
                                    t.toDisplayString(n[e.optionSubTag]),
                                    1
                                  )
                                ],
                                14,
                                pe
                              )
                            )
                          ),
                          128
                        ))
                      ]))
                    : t.createCommentVNode('', !0),
                  e.cancelTxt
                    ? (t.openBlock(),
                      t.createElementBlock(
                        'view',
                        {
                          key: 3,
                          class: 'nut-actionsheet-cancel',
                          onClick:
                            n[0] ||
                            (n[0] = (...t) =>
                              e.cancelActionSheet && e.cancelActionSheet(...t))
                        },
                        t.toDisplayString(e.cancelTxt),
                        1
                      ))
                    : t.createCommentVNode('', !0)
                ])
              ]),
              _: 1
            },
            8,
            ['visible', 'onClickOverlay']
          )
        ],
        2
      )
    )
  }
  const { componentName: he, create: ge } = o('backtop')
  var ye = ge({
    props: {
      bottom: { type: Number, default: 20 },
      right: { type: Number, default: 10 },
      elId: { type: String, default: '' },
      distance: { type: Number, default: 200 },
      zIndex: { type: Number, default: 10 },
      isAnimation: { type: Boolean, default: !0 },
      duration: { type: Number, default: 1e3 }
    },
    emits: ['click'],
    setup(e, { emit: n }) {
      const o = t.reactive({
          backTop: !1,
          scrollTop: 0,
          scrollEl: window,
          startTime: 0,
          keepAlive: !1
        }),
        l = t.computed(() => ({ [he]: !0, show: o.backTop })),
        a = t.computed(() => ({
          right: `${e.right}px`,
          bottom: `${e.bottom}px`,
          zIndex: e.zIndex
        }))
      function i() {
        o.scrollEl instanceof Window
          ? (o.scrollTop = o.scrollEl.pageYOffset)
          : (o.scrollTop = o.scrollEl.scrollTop),
          (o.backTop = o.scrollTop >= e.distance)
      }
      function r(e = 0) {
        o.scrollEl instanceof Window
          ? window.scrollTo(0, e)
          : (o.scrollEl.scrollTop = e)
      }
      function s() {
        o.scrollEl.removeEventListener('scroll', i, !1),
          o.scrollEl.removeEventListener('resize', i, !1)
      }
      function c() {
        return (
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          function (e) {
            window.setTimeout(e, 1e3 / 60)
          }
        )
      }
      function u() {
        e.elId &&
          document.getElementById(e.elId) &&
          (o.scrollEl = document.getElementById(e.elId)),
          o.scrollEl.addEventListener('scroll', i, !1),
          o.scrollEl.addEventListener('resize', i, !1),
          (window.cancelAnimationFrame = window.webkitCancelAnimationFrame)
      }
      return (
        t.onMounted(() => {
          u()
        }),
        t.onUnmounted(() => {
          s()
        }),
        t.onActivated(() => {
          o.keepAlive && ((o.keepAlive = !1), u())
        }),
        t.onDeactivated(() => {
          ;(o.keepAlive = !0), s()
        }),
        {
          state: o,
          classes: l,
          style: a,
          click: function (t) {
            ;(o.startTime = +new Date()),
              e.isAnimation && e.duration > 0
                ? (function () {
                    let t = c()(function n() {
                      var l =
                          e.duration -
                          Math.max(0, o.startTime - +new Date() + e.duration),
                        a = (l * -o.scrollTop) / e.duration + o.scrollTop
                      r(a),
                        (t = c()(n)),
                        (l != e.duration && 0 != a) ||
                          window.cancelAnimationFrame(t)
                    })
                  })()
                : r(),
              n('click', t)
          }
        }
      )
    }
  })
  ye.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-icon')
    return (
      t.openBlock(),
      t.createElementBlock(
        'div',
        {
          class: t.normalizeClass(e.classes),
          style: t.normalizeStyle(e.style),
          onClick:
            n[0] ||
            (n[0] = t.withModifiers(
              (...t) => e.click && e.click(...t),
              ['stop']
            ))
        },
        [
          t.renderSlot(e.$slots, 'default', {}, () => [
            t.createVNode(r, {
              size: '19px',
              class: 'nut-backtop-main',
              name: 'top'
            })
          ])
        ],
        6
      )
    )
  }
  const { create: fe } = o('collapse')
  var ve = fe({
    props: {
      active: { type: [String, Number, Array] },
      accordion: { type: Boolean },
      titleIcon: { type: String, default: '' },
      titleIconSize: { type: String, default: '16px' },
      titleIconColor: { type: String, default: '' },
      titleIconPosition: { type: String, default: 'left' },
      icon: { type: String, default: '' },
      iconSize: { type: String, default: '16px' },
      iconColor: { type: String, default: '' },
      rotate: { type: [String, Number], default: 180 }
    },
    emits: ['update:active', 'change'],
    setup(e, { emit: n }) {
      const o = e => {
        n('update:active', e), n('change', e)
      }
      t.provide('collapseParent', {
        children: [],
        props: e,
        changeValAry: t => {
          const n =
            e.active instanceof Object ? Object.values(e.active) : e.active
          let l = -1
          n.forEach((e, n) => {
            String(e) == String(t) && (l = n)
          }),
            l > -1 ? n.splice(l, 1) : n.push(t),
            o(n)
        },
        changeVal: o,
        isExpanded: t => {
          const { accordion: n, active: o } = e
          if (n) return ('number' == typeof o || 'string' == typeof o) && o == t
        }
      })
    }
  })
  ve.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock('view', null, [t.renderSlot(e.$slots, 'default')])
    )
  }
  const { create: ke, componentName: be } = o('collapse-item')
  var we = ke({
    props: {
      title: { type: String, default: '' },
      subTitle: { type: String, default: '' },
      disabled: { type: Boolean, default: !1 },
      name: { type: [Number, String], default: -1, required: !0 },
      collapseRef: { type: Object }
    },
    setup(e) {
      const n = t.inject('collapseParent'),
        o = t.reactive(n),
        l = t.computed(() => ({ [be]: !0, [`${be}-icon`]: o.props.icon }))
      var a
      ;(a = t.getCurrentInstance()).proxy && o.children.push(a.proxy)
      const i = t.reactive({
          icon: o.props.icon,
          iconSize: o.props.iconSize,
          iconColor: o.props.iconColor,
          openExpanded: !1,
          iconStyle: {
            transform: 'rotate(0deg)',
            marginTop: o.props.iconHeght
              ? '-' + o.props.iconHeght / 2 + 'px'
              : '-10px'
          }
        }),
        r = t.reactive({
          titleIcon: o.props.titleIcon,
          titleIconSize: o.props.titleIconSize,
          titleIconColor: o.props.titleIconColor,
          titleIconPosition: o.props.titleIconPosition
        }),
        s = t.ref(null),
        c = t.ref(null),
        u = () => {
          const e = s.value,
            t = c.value
          if (!e || !t) return
          const n = t.offsetHeight
          if (n) {
            const t = `${n}px`
            ;(e.style.willChange = 'height'),
              (e.style.height = i.openExpanded ? t : 0),
              o.props.icon && !i.openExpanded
                ? (i.iconStyle.transform = 'rotate(0deg)')
                : (i.iconStyle.transform = 'rotate(' + o.props.rotate + 'deg)')
          }
          i.openExpanded ||
            (document.getElementsByClassName(
              'collapse-wrapper'
            )[0].style.willChange = 'auto')
        },
        d = () => {
          ;(i.openExpanded = !i.openExpanded), u()
        },
        p = () => {
          d(),
            o.props.icon &&
              (i.iconStyle.transform = 'rotate(' + o.props.rotate + 'deg)')
        },
        m = t.computed(() => e.name),
        h = t.computed(() => (o ? o.isExpanded(e.name) : null))
      return (
        t.watch(h, (e, t) => {
          e && (i.openExpanded = !0)
        }),
        t.onMounted(() => {
          const { name: t } = e,
            n = o && o.props.active
          if ('number' == typeof n || 'string' == typeof n) t == n && p()
          else if (Object.values(n) instanceof Array) {
            Object.values(n).filter(e => e == t).length > 0 && p()
          }
        }),
        __spreadProps(
          __spreadValues(
            __spreadValues(
              __spreadValues({ classes: l }, t.toRefs(i)),
              t.toRefs(o.props)
            ),
            t.toRefs(r)
          ),
          {
            wrapperRef: s,
            contentRef: c,
            open: d,
            toggleOpen: () => {
              o.props.accordion
                ? (o.children.forEach((e, t) => {
                    m.value == e.name
                      ? e.changeOpen(!e.openExpanded)
                      : (e.changeOpen(!1), e.animation())
                  }),
                  t.nextTick(() => {
                    o.changeVal(m.value), u()
                  }))
                : (o.changeValAry(e.name), d())
            },
            changeOpen: e => {
              i.openExpanded = e
            },
            animation: u
          }
        )
      )
    }
  })
  const Se = { class: 'collapse-title' },
    xe = { class: 'collapse-title-value' },
    Ce = ['innerHTML'],
    Be = { key: 0, class: 'subTitle' },
    Ne = ['innerHTML'],
    Ee = { class: 'collapse-wrapper', ref: 'wrapperRef' },
    _e = { class: 'collapse-content', ref: 'contentRef' }
  we.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-icon')
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        { class: t.normalizeClass(e.classes) },
        [
          t.createElementVNode(
            'view',
            {
              class: t.normalizeClass([
                'collapse-item',
                { 'item-expanded': e.openExpanded },
                { 'nut-collapse-item-disabled': e.disabled }
              ]),
              onClick:
                n[0] || (n[0] = (...t) => e.toggleOpen && e.toggleOpen(...t))
            },
            [
              t.createElementVNode('view', Se, [
                t.createElementVNode('view', null, [
                  t.createElementVNode('view', xe, [
                    e.titleIcon
                      ? (t.openBlock(),
                        t.createBlock(
                          r,
                          {
                            key: 0,
                            name: e.titleIcon,
                            size: e.titleIconSize,
                            color: e.titleIconColor,
                            class: t.normalizeClass([
                              'left' == e.titleIconPosition
                                ? 'titleIconLeft'
                                : 'titleIconRight'
                            ])
                          },
                          null,
                          8,
                          ['name', 'size', 'color', 'class']
                        ))
                      : t.createCommentVNode('', !0),
                    e.$slots.mTitle
                      ? t.renderSlot(e.$slots, 'mTitle', { key: 1 })
                      : (t.openBlock(),
                        t.createElementBlock(
                          'view',
                          { key: 2, innerHTML: e.title },
                          null,
                          8,
                          Ce
                        ))
                  ])
                ])
              ]),
              e.$slots.sTitle
                ? (t.openBlock(),
                  t.createElementBlock('view', Be, [
                    t.renderSlot(e.$slots, 'sTitle')
                  ]))
                : (t.openBlock(),
                  t.createElementBlock(
                    'view',
                    { key: 1, innerHTML: e.subTitle, class: 'subTitle' },
                    null,
                    8,
                    Ne
                  )),
              e.icon
                ? (t.openBlock(),
                  t.createBlock(
                    r,
                    {
                      key: 2,
                      name: e.icon,
                      size: e.iconSize,
                      color: e.iconColor,
                      class: t.normalizeClass([
                        'collapse-icon',
                        { 'col-expanded': e.openExpanded },
                        { 'collapse-icon-disabled': e.disabled }
                      ]),
                      style: t.normalizeStyle(e.iconStyle)
                    },
                    null,
                    8,
                    ['name', 'size', 'color', 'class', 'style']
                  ))
                : t.createCommentVNode('', !0)
            ],
            2
          ),
          t.createElementVNode(
            'view',
            Ee,
            [
              t.createElementVNode(
                'view',
                _e,
                [t.renderSlot(e.$slots, 'default')],
                512
              )
            ],
            512
          )
        ],
        2
      )
    )
  }
  const ze = window
  var Te =
    void 0 !== ze
      ? ze.requestAnimationFrame ||
        ze.webkitRequestAnimationFrame ||
        function (e) {
          ze.setTimeout(e, 1e3 / 60)
        }
      : function (e) {
          setTimeout(e, 1e3 / 60)
        }
  const { componentName: Ve, create: De } = o('drag')
  var Ie = De({
    props: {
      attract: { type: Boolean, default: !1 },
      direction: { type: String, default: 'all' },
      boundary: {
        type: Object,
        default: () => ({ top: 0, left: 0, right: 0, bottom: 0 })
      }
    },
    setup(e, { emit: n }) {
      const o = t.ref(),
        l = t.reactive({
          keepAlive: !1,
          elWidth: 0,
          elHeight: 0,
          screenWidth: 0,
          screenHeight: 0,
          startTop: 0,
          startLeft: 0,
          nx: 0,
          ny: 0,
          xPum: 0,
          yPum: 0,
          position: { x: 0, y: 0 },
          boundary: { top: 0, left: 0, right: 0, bottom: 0 }
        }),
        a = t.computed(() => ({ [Ve]: !0 }))
      function i(e) {
        l.boundary.left
          ? +e.style.left.split('px')[0] > l.boundary.left
            ? ((e.style.left = +e.style.left.split('px')[0] - 10 + 'px'),
              Te(() => {
                i(e)
              }))
            : (e.style.left = `${l.boundary.left}px`)
          : +e.style.left.split('px')[0] > 10
          ? ((e.style.left = +e.style.left.split('px')[0] - 10 + 'px'),
            Te(() => {
              i(e)
            }))
          : (e.style.left = '0px')
      }
      function r(e, t) {
        t - parseInt(e.style.left.split('px')[0]) > 10
          ? ((e.style.left = parseInt(e.style.left.split('px')[0]) + 10 + 'px'),
            Te(() => {
              r(e, t)
            }))
          : (e.style.left = t + 'px')
      }
      function s(t) {
        t.preventDefault()
        const n = t.currentTarget
        if (1 === t.targetTouches.length) {
          const o = t.targetTouches[0]
          ;(l.nx = o.clientX - l.position.x),
            (l.ny = o.clientY - l.position.y),
            (l.xPum = l.startLeft + l.nx),
            (l.yPum = l.startTop + l.ny)
          const a = l.screenWidth - l.elWidth - l.boundary.right
          Math.abs(l.xPum) > a
            ? (l.xPum = a)
            : l.xPum <= l.boundary.left && (l.xPum = l.boundary.left),
            l.yPum < l.boundary.top
              ? (l.yPum = l.boundary.top)
              : l.yPum > l.screenHeight - l.elHeight - l.boundary.bottom &&
                (l.yPum = l.screenHeight - l.elHeight - l.boundary.bottom),
            'y' != e.direction && (n.style.left = l.xPum + 'px'),
            'x' != e.direction && (n.style.top = l.yPum + 'px')
        }
      }
      function c(t) {
        const n = t.currentTarget
        let o = t.changedTouches[0].clientX
        const a = l.screenWidth - l.elWidth - l.boundary.right
        ;(o =
          o > a
            ? a
            : o < l.boundary.left || o < l.screenWidth / 2
            ? l.boundary.left
            : a),
          'y' != e.direction &&
            e.attract &&
            (o < l.screenWidth / 2
              ? Te(() => {
                  i(n)
                })
              : Te(() => {
                  r(n, a)
                })),
          'x' !== e.direction && (n.style.top = l.yPum + 'px')
      }
      function u(e) {
        const t = e.currentTarget,
          n = e.touches[0]
        ;(l.startTop = t.offsetTop),
          (l.startLeft = t.offsetLeft),
          (l.position.x = n.clientX),
          (l.position.y = n.clientY)
      }
      return (
        t.onMounted(() => {
          !(function () {
            const e = document.documentElement
            ;(l.elWidth = o.value.offsetWidth),
              (l.elHeight = o.value.offsetHeight),
              (l.screenWidth = e.clientWidth),
              (l.screenHeight = e.clientHeight)
          })(),
            (l.boundary = e.boundary)
        }),
        t.onActivated(() => {
          l.keepAlive && (l.keepAlive = !1)
        }),
        t.onDeactivated(() => {
          ;(l.keepAlive = !0),
            o.removeEventListener('touchstart', u),
            o.removeEventListener('touchmove', s),
            o.removeEventListener('touchend', c)
        }),
        { classes: a, myDrag: o, touchStart: u, touchMove: s, touchEnd: c }
      )
    }
  })
  Ie.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        {
          class: t.normalizeClass(e.classes),
          ref: 'myDrag',
          onTouchstart: n[0] || (n[0] = t => e.touchStart(t)),
          onTouchmove: n[1] || (n[1] = t => e.touchMove(t)),
          onTouchend: n[2] || (n[2] = t => e.touchEnd(t))
        },
        [t.renderSlot(e.$slots, 'default')],
        34
      )
    )
  }
  const { componentName: Me, create: Le } = o('dialog')
  var Pe = Le({
    inheritAttrs: !1,
    components: { [le.name]: le, [h.name]: h },
    props: __spreadProps(__spreadValues({}, oe), {
      closeOnClickOverlay: { type: Boolean, default: !1 },
      title: { type: String, default: '' },
      content: { type: String, default: '' },
      noFooter: { type: Boolean, default: !1 },
      noOkBtn: { type: Boolean, default: !1 },
      noCancelBtn: { type: Boolean, default: !1 },
      cancelText: { type: String, default: '取消' },
      okText: { type: String, default: '确定' },
      okBtnDisabled: { type: Boolean, default: !1 },
      cancelAutoClose: { type: Boolean, default: !0 },
      textAlign: { type: String, default: 'center' },
      onOk: { type: Function, default: null },
      onCancel: { type: Function, default: null },
      onClose: { type: Function, default: null },
      onClosed: { type: Function, default: null },
      closeOnPopstate: { type: Boolean, default: !1 }
    }),
    emits: [
      'update',
      'update:visible',
      'ok',
      'cancel',
      'open',
      'opened',
      'close',
      'closed'
    ],
    setup(e, { emit: n }) {
      const o = t.ref(e.visible)
      t.onMounted(() => {
        e.closeOnPopstate &&
          window.addEventListener('popstate', function () {
            a()
          })
      }),
        t.watch(
          () => e.visible,
          e => {
            o.value = e
          }
        )
      const l = t.computed(() => ({ [Me]: !0 })),
        a = () => {
          var e
          n('update', (e = !1)), n('update:visible', e), n('closed')
        }
      return {
        closed: a,
        classes: l,
        onCancel: () => {
          n('cancel'), e.cancelAutoClose && a()
        },
        onOk: () => {
          a(), n('ok')
        },
        showPopup: o
      }
    }
  })
  const je = { key: 0, class: 'nut-dialog__header' },
    $e = ['innerHTML'],
    Ae = { key: 1, class: 'nut-dialog__footer' }
  Pe.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-button'),
      s = t.resolveComponent('nut-popup')
    return (
      t.openBlock(),
      t.createBlock(
        s,
        {
          teleport: e.teleport,
          visible: e.showPopup,
          'onUpdate:visible': n[0] || (n[0] = t => (e.showPopup = t)),
          'close-on-click-overlay': e.closeOnClickOverlay,
          'lock-scroll': e.lockScroll,
          round: '',
          onClickOverlay: e.closed,
          onClickCloseIcon: e.closed
        },
        {
          default: t.withCtx(() => [
            t.createElementVNode(
              'view',
              { class: t.normalizeClass(e.classes) },
              [
                e.title
                  ? (t.openBlock(),
                    t.createElementBlock('view', je, [
                      e.$slots.header
                        ? t.renderSlot(e.$slots, 'header', { key: 0 })
                        : (t.openBlock(),
                          t.createElementBlock(
                            t.Fragment,
                            { key: 1 },
                            [t.createTextVNode(t.toDisplayString(e.title), 1)],
                            64
                          ))
                    ]))
                  : t.createCommentVNode('', !0),
                t.createElementVNode(
                  'view',
                  {
                    class: 'nut-dialog__content',
                    style: t.normalizeStyle({ textAlign: e.textAlign })
                  },
                  [
                    e.$slots.default
                      ? t.renderSlot(e.$slots, 'default', { key: 0 })
                      : (t.openBlock(),
                        t.createElementBlock(
                          'view',
                          { key: 1, innerHTML: e.content },
                          null,
                          8,
                          $e
                        ))
                  ],
                  4
                ),
                e.noFooter
                  ? t.createCommentVNode('', !0)
                  : (t.openBlock(),
                    t.createElementBlock('view', Ae, [
                      e.$slots.footer
                        ? t.renderSlot(e.$slots, 'footer', { key: 0 })
                        : (t.openBlock(),
                          t.createElementBlock(
                            t.Fragment,
                            { key: 1 },
                            [
                              e.noCancelBtn
                                ? t.createCommentVNode('', !0)
                                : (t.openBlock(),
                                  t.createBlock(
                                    r,
                                    {
                                      key: 0,
                                      size: 'small',
                                      plain: '',
                                      type: 'primary',
                                      class: 'nut-dialog__footer-cancel',
                                      onClick: e.onCancel
                                    },
                                    {
                                      default: t.withCtx(() => [
                                        t.createTextVNode(
                                          t.toDisplayString(e.cancelText),
                                          1
                                        )
                                      ]),
                                      _: 1
                                    },
                                    8,
                                    ['onClick']
                                  )),
                              e.noOkBtn
                                ? t.createCommentVNode('', !0)
                                : (t.openBlock(),
                                  t.createBlock(
                                    r,
                                    {
                                      key: 1,
                                      size: 'small',
                                      type: 'primary',
                                      class: t.normalizeClass([
                                        'nut-dialog__footer-ok',
                                        { disabled: e.okBtnDisabled }
                                      ]),
                                      disabled: e.okBtnDisabled,
                                      onClick: e.onOk
                                    },
                                    {
                                      default: t.withCtx(() => [
                                        t.createTextVNode(
                                          t.toDisplayString(e.okText),
                                          1
                                        )
                                      ]),
                                      _: 1
                                    },
                                    8,
                                    ['class', 'disabled', 'onClick']
                                  ))
                            ],
                            64
                          ))
                    ]))
              ],
              2
            )
          ]),
          _: 3
        },
        8,
        [
          'teleport',
          'visible',
          'close-on-click-overlay',
          'lock-scroll',
          'onClickOverlay',
          'onClickCloseIcon'
        ]
      )
    )
  }
  class Fe {
    constructor() {
      __publicField(this, 'title', ''),
        __publicField(this, 'content', ''),
        __publicField(this, 'cancelText', '取消'),
        __publicField(this, 'okText', '确定'),
        __publicField(this, 'textAlign', 'center'),
        __publicField(this, 'teleport', 'body'),
        __publicField(this, 'onUpdate', e => {}),
        __publicField(this, 'onOk', () => {}),
        __publicField(this, 'onCancel', () => {}),
        __publicField(this, 'onClose', () => {}),
        __publicField(this, 'onClosed', () => {}),
        __publicField(this, 'visible', !0),
        __publicField(this, 'noFooter', !1),
        __publicField(this, 'noOkBtn', !1),
        __publicField(this, 'noCancelBtn', !1),
        __publicField(this, 'okBtnDisabled', !1),
        __publicField(this, 'closeOnPopstate', !1),
        __publicField(this, 'lockScroll', !1)
    }
  }
  class Oe {
    constructor(e) {
      __publicField(this, 'options', new Fe()),
        __publicField(this, 'close', () => {}),
        __publicField(this, 'setDefaultOptions', e => {}),
        __publicField(this, 'resetDefaultOptions', () => {})
      let n = Object.assign(this.options, e),
        o = document.body,
        l = n.teleport
      'body' != l &&
        (o = 'string' == typeof l ? document.querySelector(l) : n.teleport)
      const a = document.createElement('view')
      a.id = 'dialog-' + new Date().getTime()
      const i = {
          setup: () => (
            (n.onUpdate = e => {
              0 == e && o.removeChild(a)
            }),
            (n.teleport = `#${a.id}`),
            () => t.h(Pe, n)
          )
        },
        r = t.createVNode(i)
      o.appendChild(a), t.render(r, a)
    }
  }
  const qe = function (e) {
    return new Oe(e)
  }
  qe.install = e => {
    e.use(Pe), (e.config.globalProperties.$dialog = qe)
  }
  const { componentName: Re, create: He } = o('infiniteloading')
  var Ye = He({
    props: {
      hasMore: { type: Boolean, default: !0 },
      threshold: { type: Number, default: 200 },
      pullIcon: {
        type: String,
        default:
          'https://img10.360buyimg.com/imagetools/jfs/t1/169863/6/4565/6306/60125948E7e92774e/40b3a0cf42852bcb.png'
      },
      pullTxt: { type: String, default: '松开刷新' },
      loadIcon: {
        type: String,
        default:
          'https://img10.360buyimg.com/imagetools/jfs/t1/169863/6/4565/6306/60125948E7e92774e/40b3a0cf42852bcb.png'
      },
      loadTxt: { type: String, default: '加载中···' },
      loadMoreTxt: { type: String, default: '哎呀，这里是底部了啦' },
      useWindow: { type: Boolean, default: !0 },
      containerId: { type: String, default: '' },
      useCapture: { type: Boolean, default: !1 },
      isOpenRefresh: { type: Boolean, default: !1 }
    },
    emits: ['scroll-change', 'load-more', 'refresh'],
    setup(e, { emit: n, slots: o }) {
      const l = t.reactive({
          scrollEl: window,
          scroller: null,
          refreshTop: null,
          beforeScrollTop: 0,
          isTouching: !1,
          isInfiniting: !1,
          refreshMaxH: 0,
          y: 0,
          x: 0,
          distance: 0
        }),
        a = t.computed(() => ({ [Re]: !0 })),
        i = t.computed(() => ({
          height: l.distance < 0 ? '0px' : `${l.distance}px`,
          transition: l.isTouching
            ? 'height 0s cubic-bezier(0.25,0.1,0.25,1)'
            : 'height 0.2s cubic-bezier(0.25,0.1,0.25,1)'
        })),
        r = e => (e ? e.offsetTop + r(e.offsetParent) : 0),
        s = () => {
          let t = 0,
            o = 0,
            a = 'down'
          const i =
            void 0 !== window.pageYOffset
              ? window.pageYOffset
              : (
                  document.documentElement ||
                  document.body.parentNode ||
                  document.body
                ).scrollTop
          if (e.useWindow)
            l.scroller &&
              (t =
                r(l.scroller) +
                l.scroller.offsetHeight -
                i -
                window.innerHeight),
              (o = i)
          else {
            const {
              scrollHeight: e,
              clientHeight: n,
              scrollTop: a
            } = l.scrollEl
            ;(t = e - n - a), (o = a)
          }
          return (
            (a = l.beforeScrollTop > o ? 'up' : 'down'),
            (l.beforeScrollTop = o),
            n('scroll-change', o),
            t <= e.threshold && 'down' == a
          )
        },
        c = () => {
          l.isInfiniting = !1
        },
        u = () => {
          ;(
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function (e) {
              window.setTimeout(e, 1e3 / 60)
            }
          )(() => {
            if (!s() || !e.hasMore || l.isInfiniting) return !1
            ;(l.isInfiniting = !0), n('load-more', c)
          })
        },
        d = () => {
          l.scrollEl.addEventListener('scroll', u, e.useCapture)
        },
        p = () => {
          ;(l.distance = 0), (l.isTouching = !1)
        }
      t.onMounted(() => {
        const t =
          ((n = l.scroller),
          e.containerId
            ? document.querySelector(`#${e.containerId}`)
            : n && n.parentNode)
        var n
        ;(l.scrollEl = e.useWindow ? window : t), d()
      }),
        t.onUnmounted(() => {
          l.scrollEl.removeEventListener('scroll', u, e.useCapture)
        })
      const m = t.ref(!1)
      return (
        t.onActivated(() => {
          m.value && ((m.value = !1), d())
        }),
        t.onDeactivated(() => {
          ;(m.value = !0),
            l.scrollEl.removeEventListener('scroll', u, e.useCapture)
        }),
        __spreadProps(__spreadValues({ classes: a }, t.toRefs(l)), {
          touchStart: t => {
            if (0 == l.beforeScrollTop && !l.isTouching && e.isOpenRefresh) {
              ;(l.y = t.touches[0].pageY), (l.isTouching = !0)
              const e = l.refreshTop.firstElementChild.offsetHeight
              l.refreshMaxH = Math.floor(1 * e + 10)
            }
          },
          touchMove: e => {
            ;(l.distance = e.touches[0].pageY - l.y),
              l.distance > 0 && l.isTouching
                ? (e.preventDefault(),
                  l.distance >= l.refreshMaxH && (l.distance = l.refreshMaxH))
                : ((l.distance = 0), (l.isTouching = !1))
          },
          touchEnd: () => {
            l.distance < l.refreshMaxH ? (l.distance = 0) : n('refresh', p)
          },
          getStyle: i
        })
      )
    }
  })
  const We = { class: 'top-box' },
    Xe = { class: 'top-text' },
    Ue = { class: 'nut-infinite-container' },
    Ke = { class: 'nut-infinite-bottom' },
    Ge = { key: 0, class: 'bottom-box' },
    Je = { class: 'bottom-text' },
    Qe = { key: 1, class: 'tips' }
  Ye.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-icon')
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        {
          class: t.normalizeClass(e.classes),
          ref: 'scroller',
          onTouchstart:
            n[0] || (n[0] = (...t) => e.touchStart && e.touchStart(...t)),
          onTouchmove:
            n[1] || (n[1] = (...t) => e.touchMove && e.touchMove(...t)),
          onTouchend: n[2] || (n[2] = (...t) => e.touchEnd && e.touchEnd(...t))
        },
        [
          t.createElementVNode(
            'view',
            {
              class: 'nut-infinite-top',
              ref: 'refreshTop',
              style: t.normalizeStyle(e.getStyle)
            },
            [
              t.createElementVNode('view', We, [
                t.createVNode(
                  r,
                  { class: 'top-img', name: e.pullIcon },
                  null,
                  8,
                  ['name']
                ),
                t.createElementVNode(
                  'view',
                  Xe,
                  t.toDisplayString(e.pullTxt),
                  1
                )
              ])
            ],
            4
          ),
          t.createElementVNode('view', Ue, [t.renderSlot(e.$slots, 'default')]),
          t.createElementVNode('view', Ke, [
            e.isInfiniting
              ? (t.openBlock(),
                t.createElementBlock('view', Ge, [
                  t.createVNode(
                    r,
                    { class: 'bottom-img', name: e.loadIcon },
                    null,
                    8,
                    ['name']
                  ),
                  t.createElementVNode(
                    'view',
                    Je,
                    t.toDisplayString(e.loadTxt),
                    1
                  )
                ]))
              : e.hasMore
              ? t.createCommentVNode('', !0)
              : (t.openBlock(),
                t.createElementBlock(
                  'view',
                  Qe,
                  t.toDisplayString(e.loadMoreTxt),
                  1
                ))
          ])
        ],
        34
      )
    )
  }
  const { componentName: Ze, create: et } = o('notify')
  var tt = et({
    components: { [le.name]: le },
    props: {
      id: String,
      color: { type: String, default: '' },
      msg: { type: String, default: '' },
      duration: { type: Number, default: 3e3 },
      className: { type: String, default: '' },
      background: { type: String, default: '' },
      type: { type: String, default: 'danger' },
      showPopup: { type: Boolean, default: !1 },
      onClose: Function,
      onClick: Function,
      unmount: Function
    },
    setup(e, { slots: n }) {
      let o = null
      const l = t.reactive({ mounted: !1 })
      t.onMounted(() => {
        l.mounted = !0
      })
      const a = () => {
          o && (clearTimeout(o), (o = null))
        },
        i = () => {
          l.mounted = !1
        },
        r = () => {
          a(),
            e.duration &&
              (o = setTimeout(() => {
                i()
              }, e.duration))
        }
      e.duration && r(),
        t.watch(
          () => e.duration,
          e => {
            e && r()
          }
        )
      return {
        state: l,
        hide: i,
        onAfterLeave: () => {
          a(), e.unmount && e.unmount(e.id), e.onClose && e.onClose()
        },
        clickCover: () => {
          e.onClick && e.onClick()
        }
      }
    }
  })
  tt.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createBlock(
        t.Transition,
        { name: 'toast-fade', onAfterLeave: e.onAfterLeave },
        {
          default: t.withCtx(() => [
            t.withDirectives(
              t.createElementVNode(
                'view',
                {
                  class: t.normalizeClass([
                    'popup-top',
                    'nut-notify',
                    `nut-notify--${e.type}`,
                    { className: e.className }
                  ]),
                  style: t.normalizeStyle({
                    color: e.color,
                    background: e.background
                  }),
                  onClick:
                    n[0] ||
                    (n[0] = (...t) => e.clickCover && e.clickCover(...t))
                },
                [
                  e.$slots.default
                    ? t.renderSlot(e.$slots, 'default', { key: 0 })
                    : (t.openBlock(),
                      t.createElementBlock(
                        t.Fragment,
                        { key: 1 },
                        [t.createTextVNode(t.toDisplayString(e.msg), 1)],
                        64
                      ))
                ],
                6
              ),
              [[t.vShow, e.state.mounted]]
            )
          ]),
          _: 3
        },
        8,
        ['onAfterLeave']
      )
    )
  }
  const nt = {
    type: 'base',
    showPopup: !1,
    msg: '',
    color: void 0,
    background: void 0,
    duration: 3e3,
    className: '',
    onClosed: null,
    onClick: null,
    onOpened: null,
    textTimer: null,
    unmount: null
  }
  let ot = [],
    lt = []
  const at = e => {
      if (e) {
        const t = document.getElementById(e)
        ;(lt = lt.filter(t => t.id !== e)),
          (ot = ot.filter(t => t !== e)),
          t && document.body.removeChild(t)
      } else
        ot.forEach(e => {
          const t = document.getElementById(e)
          t && document.body.removeChild(t)
        }),
          (lt = []),
          (ot = [])
    },
    it = e => {
      let n
      if (((e.unmount = at), e.id)) {
        if (((n = e.id), ot.find(t => t === e.id)))
          return (e => {
            const n = document.getElementById(e.id)
            if (n) {
              const o = lt.find(t => t.id === e.id)
              e = __spreadValues(
                o
                  ? __spreadValues(__spreadValues({}, nt), o)
                  : __spreadValues({}, nt),
                e
              )
              const l = t.createVNode(tt, e)
              return t.render(l, n), l.component.ctx
            }
          })(e)
      } else n = new Date().getTime() + ''
      ;((e = __spreadValues(__spreadValues({}, nt), e)).id = n),
        ot.push(e.id),
        lt.push(e)
      const o = document.createElement('view')
      o.id = e.id
      const l = t.createVNode(tt, e)
      return (
        t.render(l, o),
        document.body.appendChild(o),
        setTimeout(() => {
          l.showPopup = !0
        }, 0),
        l.component.ctx
      )
    },
    rt = e => {
      e || console.warn('[NutUI Notify]: msg不能为空')
    },
    st = {
      text: (e, t = {}) => (
        rt(e), it(__spreadProps(__spreadValues({}, t), { msg: e }))
      ),
      primary: (e, t = {}) => (
        rt(e),
        it(__spreadProps(__spreadValues({}, t), { msg: e, type: 'primary' }))
      ),
      success: (e, t = {}) => (
        rt(e),
        it(__spreadProps(__spreadValues({}, t), { msg: e, type: 'success' }))
      ),
      danger: (e, t = {}) => (
        rt(e),
        it(__spreadProps(__spreadValues({}, t), { msg: e, type: 'danger' }))
      ),
      warn: (e, t = {}) => (
        rt(e),
        it(__spreadProps(__spreadValues({}, t), { msg: e, type: 'warning' }))
      ),
      hide() {
        at()
      },
      install(e) {
        e.config.globalProperties.$notify = st
      }
    }
  const ct = e => {
      const n = t.unref(e)
      if (n === window) {
        const e = n.innerWidth,
          t = n.innerHeight
        return { top: 0, left: 0, right: e, bottom: t, width: e, height: t }
      }
      return n && n.getBoundingClientRect
        ? n.getBoundingClientRect()
        : { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }
    },
    { componentName: ut, create: dt } = o('range')
  var pt = dt({
    props: {
      range: { type: Boolean, default: !1 },
      disabled: Boolean,
      activeColor: String,
      inactiveColor: String,
      buttonColor: String,
      hiddenRange: { type: Boolean, default: !1 },
      hiddenTag: { type: Boolean, default: !1 },
      min: { type: [Number, String], default: 0 },
      max: { type: [Number, String], default: 100 },
      step: { type: [Number, String], default: 1 },
      modelValue: { type: [Number, Array], default: 0 }
    },
    emits: ['change', 'drag-end', 'drag-start', 'update:modelValue'],
    setup(e, { emit: n, slots: o }) {
      const l = t.ref(0)
      let a, i
      const r = t.ref(),
        s = t.ref(),
        c = Y(),
        u = t.computed(() => Number(e.max) - Number(e.min)),
        d = t.computed(() => {
          const t = ut
          return {
            [t]: !0,
            [`${t}-disabled`]: e.disabled,
            [`${t}-show-number`]: !e.hiddenRange
          }
        }),
        p = t.computed(() => ({ background: e.inactiveColor })),
        m = t.computed(() => ({ borderColor: e.buttonColor })),
        h = t => !!e.range && Array.isArray(t),
        g = () => {
          const { modelValue: t, min: n } = e
          return h(t)
            ? (100 * (t[1] - t[0])) / u.value + '%'
            : (100 * (t - Number(n))) / u.value + '%'
        },
        y = () => {
          const { modelValue: t, min: n } = e
          return h(t) ? (100 * (t[0] - Number(n))) / u.value + '%' : '0%'
        },
        f = t.computed(() => ({
          width: g(),
          left: y(),
          background: e.activeColor,
          transition: s.value ? 'none' : void 0
        })),
        v = t => {
          const { min: n, max: o, step: l } = e
          return (t = Math.max(+n, Math.min(t, +o))), Math.round(t / +l) * +l
        },
        k = (e, t) => JSON.stringify(e) === JSON.stringify(t),
        b = (t, o) => {
          ;(t = h(t)
            ? (e => (e[0] > e[1] ? e.slice(0).reverse() : e))(t).map(v)
            : v(t)),
            k(t, e.modelValue) || n('update:modelValue', t),
            o && !k(t, a) && n('change', t)
        }
      return __spreadProps(
        __spreadValues(
          {
            root: r,
            classes: d,
            wrapperStyle: p,
            buttonStyle: m,
            onClick: t => {
              if (e.disabled) return
              const { min: n, modelValue: o } = e,
                l = ct(r),
                a = t.clientX - l.left,
                i = l.width,
                s = Number(n) + (a / i) * u.value
              if (h(o)) {
                const [e, t] = o
                b(s <= (e + t) / 2 ? [s, t] : [e, s], !0)
              } else b(s, !0)
            },
            onTouchStart: t => {
              e.disabled ||
                (c.start(t),
                (i = e.modelValue),
                (a = h(i) ? i.map(v) : v(i)),
                (s.value = 'start'))
            },
            onTouchMove: t => {
              if (e.disabled) return
              'start' === s.value && n('drag-start'),
                c.move(t),
                (s.value = 'draging')
              const o = ct(r),
                d = (c.deltaX.value / o.width) * u.value
              h(a) ? (i[l.value] = a[l.value] + d) : (i = a + d), b(i)
            },
            onTouchEnd: () => {
              e.disabled ||
                ('draging' === s.value && (b(i, !0), n('drag-end')),
                (s.value = ''))
            }
          },
          t.toRefs(e)
        ),
        {
          barStyle: f,
          curValue: t =>
            'number' == typeof t ? e.modelValue[t] : e.modelValue,
          buttonIndex: l
        }
      )
    }
  })
  const mt = { class: 'nut-range-container' },
    ht = { key: 0, class: 'min' },
    gt = [
      'tabindex',
      'aria-valuemin',
      'aria-valuenow',
      'aria-valuemax',
      'onTouchstart'
    ],
    yt = { key: 0, class: 'number' },
    ft = ['tabindex', 'aria-valuemin', 'aria-valuenow', 'aria-valuemax'],
    vt = { key: 0, class: 'number' },
    kt = { key: 1, class: 'max' }
  pt.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock('view', mt, [
        e.hiddenRange
          ? t.createCommentVNode('', !0)
          : (t.openBlock(),
            t.createElementBlock('view', ht, t.toDisplayString(+e.min), 1)),
        t.createElementVNode(
          'view',
          {
            ref: 'root',
            style: t.normalizeStyle(e.wrapperStyle),
            class: t.normalizeClass(e.classes),
            onClick:
              n[9] ||
              (n[9] = t.withModifiers(
                (...t) => e.onClick && e.onClick(...t),
                ['stop']
              ))
          },
          [
            t.createElementVNode(
              'view',
              { class: 'nut-range-bar', style: t.normalizeStyle(e.barStyle) },
              [
                e.range
                  ? (t.openBlock(),
                    t.createElementBlock(
                      t.Fragment,
                      { key: 0 },
                      t.renderList([0, 1], o =>
                        t.createElementVNode(
                          'view',
                          {
                            key: o,
                            role: 'slider',
                            class: t.normalizeClass({
                              'nut-range-button-wrapper-left': 0 == o,
                              'nut-range-button-wrapper-right': 1 == o
                            }),
                            tabindex: e.disabled ? -1 : 0,
                            'aria-valuemin': +e.min,
                            'aria-valuenow': e.curValue(o),
                            'aria-valuemax': +e.max,
                            'aria-orientation': 'horizontal',
                            onTouchstart: t.withModifiers(
                              t => {
                                'number' == typeof o && (e.buttonIndex = o),
                                  e.onTouchStart(t)
                              },
                              ['stop', 'prevent']
                            ),
                            onTouchmove:
                              n[0] ||
                              (n[0] = t.withModifiers(
                                (...t) => e.onTouchMove && e.onTouchMove(...t),
                                ['stop', 'prevent']
                              )),
                            onTouchend:
                              n[1] ||
                              (n[1] = t.withModifiers(
                                (...t) => e.onTouchEnd && e.onTouchEnd(...t),
                                ['stop', 'prevent']
                              )),
                            onTouchcancel:
                              n[2] ||
                              (n[2] = t.withModifiers(
                                (...t) => e.onTouchEnd && e.onTouchEnd(...t),
                                ['stop', 'prevent']
                              )),
                            onClick: n[3] || (n[3] = e => e.stopPropagation())
                          },
                          [
                            e.$slots.button
                              ? t.renderSlot(e.$slots, 'button', { key: 0 })
                              : (t.openBlock(),
                                t.createElementBlock(
                                  'view',
                                  {
                                    key: 1,
                                    class: 'nut-range-button',
                                    style: t.normalizeStyle(e.buttonStyle)
                                  },
                                  [
                                    e.hiddenTag
                                      ? t.createCommentVNode('', !0)
                                      : (t.openBlock(),
                                        t.createElementBlock(
                                          'view',
                                          yt,
                                          t.toDisplayString(e.curValue(o)),
                                          1
                                        ))
                                  ],
                                  4
                                ))
                          ],
                          42,
                          gt
                        )
                      ),
                      64
                    ))
                  : (t.openBlock(),
                    t.createElementBlock(
                      'view',
                      {
                        key: 1,
                        role: 'slider',
                        class: 'nut-range-button-wrapper',
                        tabindex: e.disabled ? -1 : 0,
                        'aria-valuemin': +e.min,
                        'aria-valuenow': e.curValue(),
                        'aria-valuemax': +e.max,
                        'aria-orientation': 'horizontal',
                        onTouchstart:
                          n[4] ||
                          (n[4] = t.withModifiers(
                            t => {
                              e.onTouchStart(t)
                            },
                            ['stop', 'prevent']
                          )),
                        onTouchmove:
                          n[5] ||
                          (n[5] = t.withModifiers(
                            (...t) => e.onTouchMove && e.onTouchMove(...t),
                            ['stop', 'prevent']
                          )),
                        onTouchend:
                          n[6] ||
                          (n[6] = t.withModifiers(
                            (...t) => e.onTouchEnd && e.onTouchEnd(...t),
                            ['stop', 'prevent']
                          )),
                        onTouchcancel:
                          n[7] ||
                          (n[7] = t.withModifiers(
                            (...t) => e.onTouchEnd && e.onTouchEnd(...t),
                            ['stop', 'prevent']
                          )),
                        onClick: n[8] || (n[8] = e => e.stopPropagation())
                      },
                      [
                        e.$slots.button
                          ? t.renderSlot(e.$slots, 'button', { key: 0 })
                          : (t.openBlock(),
                            t.createElementBlock(
                              'view',
                              {
                                key: 1,
                                class: 'nut-range-button',
                                style: t.normalizeStyle(e.buttonStyle)
                              },
                              [
                                e.hiddenTag
                                  ? t.createCommentVNode('', !0)
                                  : (t.openBlock(),
                                    t.createElementBlock(
                                      'view',
                                      vt,
                                      t.toDisplayString(e.curValue(e.index)),
                                      1
                                    ))
                              ],
                              4
                            ))
                      ],
                      40,
                      ft
                    ))
              ],
              4
            )
          ],
          6
        ),
        e.hiddenRange
          ? t.createCommentVNode('', !0)
          : (t.openBlock(),
            t.createElementBlock('view', kt, t.toDisplayString(+e.max), 1))
      ])
    )
  }
  const bt = (e, t, n) => {
    if (1 === n) var o = 0
    else if (2 === n) var l
    return function () {
      let a = this,
        i = arguments
      if (1 === n) {
        let n = Date.now()
        n - o > t && (e.apply(a, i), (o = n))
      } else
        2 === n &&
          (l ||
            (l = setTimeout(() => {
              ;(l = null), e.apply(a, i)
            }, t)))
    }
  }
  const { create: wt } = o('video')
  var St = wt({
    props: {
      source: { type: Object, default: {} },
      options: {
        type: Object,
        default: {
          autoplay: !1,
          volume: 0.5,
          poster: '',
          loop: !1,
          controls: !0,
          muted: !1,
          disabled: !1,
          playsinline: !1,
          touchPlay: !1,
          preload: ''
        },
        required: !0
      },
      model: { type: String, default: '' }
    },
    components: {},
    emits: ['click', 'play', 'pause', 'playend'],
    setup(e, { emit: n }) {
      const o = t.reactive({
          videoElm: null,
          initial: !0,
          showToolbox: !1,
          player: { $player: null, pos: null },
          progressBar: { progressElm: null, pos: null },
          videoSet: {
            loaded: 0,
            displayTime: '00:00',
            totalTime: '00:00',
            progress: { width: 0, current: 0 }
          },
          state: {
            controlShow: !0,
            vol: 0.5,
            currentTime: 0,
            fullScreen: !1,
            playing: !1,
            isLoading: !1,
            isEnd: !1,
            isError: !1,
            isMuted: !1
          },
          showTouchMask: !1
        }),
        l = t.ref(),
        a = t.computed(() => e.options.disabled)
      t.watch(e.source, e => {
        e.src &&
          t.nextTick(() => {
            o.videoElm.load()
          })
      }),
        t.watch(
          e.options,
          e => {
            o.state.isMuted = !!e.muted && e.muted
          },
          { immediate: !0 }
        )
      const i = () => {
          ;(o.videoElm = l.value),
            e.options.autoplay && o.videoElm.play(),
            e.options.touchPlay && (o.showTouchMask = !0),
            e.options.playsinline &&
              (o.videoElm.setAttribute('playsinline', e.options.playsinline),
              o.videoElm.setAttribute(
                'webkit-playsinline',
                e.options.playsinline
              ),
              o.videoElm.setAttribute('x5-video-player-type', 'h5-page'),
              o.videoElm.setAttribute('x5-video-player-fullscreen', !1)),
            m(),
            o.showToolbox
              ? r()
              : (o.videoElm.addEventListener('play', () => {
                  ;(o.state.playing = !0), n('play', o.videoElm)
                }),
                o.videoElm.addEventListener('pause', () => {
                  ;(o.state.playing = !1), n('pause', o.videoElm)
                }),
                o.videoElm.addEventListener('ended', d),
                o.videoElm.addEventListener('timeupdate', bt(u, 100, 1)))
        },
        r = () => {
          const e = l.value,
            t = l.value.getElementsByClassName('progress')[0]
          ;(o.player.$player = e),
            (o.progressBar.progressElm = t),
            (o.progressBar.pos = t.getBoundingClientRect()),
            (o.videoSet.progress.width = Math.round(
              t.getBoundingClientRect().width
            ))
        },
        s = e => {
          var t = Math.floor(e / 3600)
          t < 10 && (t = '0' + t)
          var n = Math.floor((e % 3600) / 60)
          n < 10 && (n = '0' + n)
          var o = Math.round((e % 3600) % 60)
          o < 10 && (o = '0' + o)
          return 0 != t ? t + ':' + n + ':' + o : n + ':' + o
        },
        c = () => {
          o.videoSet.loaded &&
            (o.videoSet.loaded =
              (o.videoElm.buffered.end(0) / o.videoElm.duration) * 100)
        },
        u = () => {
          const e = o.videoElm.currentTime / o.videoElm.duration
          ;(o.videoSet.progress.current = Math.round(
            o.videoSet.progress.width * e
          )),
            (o.videoSet.totalTime = s(o.videoElm.duration)),
            (o.videoSet.displayTime = s(o.videoElm.currentTime))
        },
        d = () => {
          ;(o.state.playing = !1),
            (o.state.isEnd = !0),
            (o.videoSet.displayTime = '00:00'),
            (o.videoSet.progress.current = 0),
            (o.videoElm.currentTime = 0),
            n('playend', o.videoElm)
        },
        p = () => {
          o.state.isError = !0
        },
        m = () => {
          o.state.vol = e.options.volume
        },
        h = (e, t) => {
          o.videoElm.currentTime = Math.floor(e * t)
        }
      return (
        t.onMounted(() => {
          i()
        }),
        __spreadProps(
          __spreadValues(__spreadValues({ root: l }, t.toRefs(e)), t.toRefs(o)),
          {
            handleError: p,
            isDisabled: a,
            play: () => {
              if (e.options.autoplay && e.options.disabled)
                return (o.state.playing = !0), !1
              if (((o.state.playing = !o.state.playing), o.videoElm))
                if (o.state.playing)
                  try {
                    o.videoElm.play(),
                      o.videoElm.addEventListener('progress', () => {
                        c()
                      }),
                      o.videoElm.addEventListener('timeupdate', bt(u, 100, 1)),
                      o.videoElm.addEventListener('ended', d),
                      n('play', o.videoElm)
                  } catch (t) {
                    p()
                  }
                else o.videoElm.pause(), n('pause', o.videoElm)
            },
            handleMuted: () => {
              ;(o.state.isMuted = !o.state.isMuted),
                (o.videoElm.muted = o.state.isMuted)
            },
            touchSlidSrart: () => {},
            touchSlidMove: e => {
              let t = e.targetTouches[0].pageX - o.progressBar.pos.left
              t <= 0 && (t = 0),
                t >= o.videoSet.progress.width &&
                  (t = o.videoSet.progress.width),
                (o.videoSet.progress.current = t)
              let n = o.videoSet.progress.current / o.videoSet.progress.width
              o.videoElm.duration && h(n, o.videoElm.duration)
            },
            touchSlidEnd: e => {
              let t = e.changedTouches[0].pageX - o.progressBar.pos.left
              o.videoSet.progress.current = t
              let n = t / o.videoSet.progress.width
              o.videoElm.duration && h(n, o.videoElm.duration)
            },
            retry: () => {
              ;(o.state.isError = !1), i()
            },
            fullScreen: () => {
              o.state.fullScreen
                ? ((o.state.fullScreen = !1), document.webkitCancelFullScreen())
                : ((o.state.fullScreen = !0),
                  o.videoElm.webkitRequestFullScreen())
            }
          }
        )
      )
    }
  })
  const xt = { class: 'nut-video', ref: 'videocon' },
    Ct = ['muted', 'autoplay', 'loop', 'poster', 'controls', 'preload'],
    Bt = ['src', 'type'],
    Nt = { class: 'current-time' },
    Et = { class: 'progress-container' },
    _t = { class: 'progress', ref: 'progressBar' },
    zt = [t.createElementVNode('div', { class: 'move-handle' }, null, -1)],
    Tt = { class: 'played', ref: 'playedBar' },
    Vt = { class: 'duration-time' },
    Dt = { class: 'nut-video-error' },
    It = t.createElementVNode('p', { class: 'lose' }, '视频加载失败', -1)
  St.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock(
        'div',
        xt,
        [
          t.createElementVNode(
            'video',
            {
              ref: 'root',
              class: 'nut-video-player',
              muted: e.options.muted,
              autoplay: e.options.autoplay,
              loop: e.options.loop,
              poster: e.options.poster,
              controls: e.options.controls,
              preload: e.options.preload,
              onError:
                n[0] || (n[0] = (...t) => e.handleError && e.handleError(...t))
            },
            [
              t.createElementVNode(
                'source',
                { src: e.source.src, type: e.source.type },
                null,
                8,
                Bt
              )
            ],
            40,
            Ct
          ),
          e.showToolbox && !e.isDisabled
            ? (t.openBlock(),
              t.createElementBlock(
                'div',
                {
                  key: 0,
                  class: 'playing-mask',
                  ref: 'touchMask',
                  onClick: n[1] || (n[1] = (...t) => e.play && e.play(...t))
                },
                null,
                512
              ))
            : t.createCommentVNode('', !0),
          e.showToolbox && !e.isDisabled
            ? t.withDirectives(
                (t.openBlock(),
                t.createElementBlock(
                  'div',
                  {
                    key: 1,
                    class: 'nut-video-play-btn',
                    ref: 'palyBtn',
                    onClick: n[2] || (n[2] = (...t) => e.play && e.play(...t))
                  },
                  null,
                  512
                )),
                [[t.vShow, !e.state.playing]]
              )
            : t.createCommentVNode('', !0),
          t.withDirectives(
            t.createElementVNode(
              'div',
              {
                class: t.normalizeClass([
                  'nut-video-controller',
                  {
                    'show-control': !e.state.playing,
                    'hide-control': e.state.playing
                  }
                ])
              },
              [
                t.createElementVNode('div', {
                  class: 'control-play-btn',
                  onClick: n[3] || (n[3] = (...t) => e.play && e.play(...t))
                }),
                t.createElementVNode(
                  'div',
                  Nt,
                  t.toDisplayString(e.videoSet.displayTime),
                  1
                ),
                t.createElementVNode('div', Et, [
                  t.createElementVNode(
                    'div',
                    _t,
                    [
                      t.createElementVNode(
                        'div',
                        {
                          class: 'buffered',
                          style: t.normalizeStyle({
                            width: `${e.videoSet.loaded}%`
                          })
                        },
                        null,
                        4
                      ),
                      t.createElementVNode(
                        'div',
                        {
                          class: 'video-ball',
                          style: t.normalizeStyle({
                            transform: `translate3d(${e.videoSet.progress.current}px, -50%, 0)`
                          }),
                          onTouchmove:
                            n[4] ||
                            (n[4] = t.withModifiers(
                              t => e.touchSlidMove(t),
                              ['stop', 'prevent']
                            )),
                          onTouchstart:
                            n[5] ||
                            (n[5] = t.withModifiers(
                              t => e.touchSlidSrart(t),
                              ['stop']
                            )),
                          onTouchend:
                            n[6] ||
                            (n[6] = t.withModifiers(
                              t => e.touchSlidEnd(t),
                              ['stop']
                            ))
                        },
                        zt,
                        36
                      ),
                      t.createElementVNode('div', Tt, null, 512)
                    ],
                    512
                  )
                ]),
                t.createElementVNode(
                  'div',
                  Vt,
                  t.toDisplayString(e.videoSet.totalTime),
                  1
                ),
                t.createElementVNode(
                  'div',
                  {
                    class: t.normalizeClass([
                      'volume',
                      { muted: e.state.isMuted }
                    ]),
                    onClick:
                      n[7] ||
                      (n[7] = (...t) => e.handleMuted && e.handleMuted(...t))
                  },
                  null,
                  2
                ),
                t.createElementVNode('div', {
                  class: 'fullscreen-icon',
                  onClick:
                    n[8] ||
                    (n[8] = (...t) => e.fullScreen && e.fullScreen(...t))
                })
              ],
              2
            ),
            [[t.vShow, e.showToolbox && !e.isDisabled]]
          ),
          t.withDirectives(
            t.createElementVNode(
              'div',
              Dt,
              [
                It,
                t.createElementVNode(
                  'p',
                  {
                    class: 'retry',
                    onClick: n[9] || (n[9] = (...t) => e.retry && e.retry(...t))
                  },
                  '点击重试'
                )
              ],
              512
            ),
            [[t.vShow, e.state.isError]]
          )
        ],
        512
      )
    )
  }
  const { create: Mt, componentName: Lt } = o('steps')
  var Pt = Mt({
    props: {
      direction: { type: String, default: 'horizontal' },
      current: { type: [String, Number], default: '0' },
      progressDot: { type: Boolean, default: !1 }
    },
    setup(e, { emit: n, slots: o }) {
      const l = t.reactive({ children: [] }),
        a = t.computed(() => {
          const t = Lt
          return {
            [t]: !0,
            [`${t}-${e.direction}`]: !0,
            [`${t}-dot`]: !!e.progressDot
          }
        })
      return (
        t.provide('parent', {
          relation: e => {
            e && l.children.push(e)
          },
          state: l,
          props: e
        }),
        () => {
          var e
          return t.h(
            'view',
            { class: a.value },
            null == (e = o.default) ? void 0 : e.call(o)
          )
        }
      )
    }
  })
  const { create: jt, componentName: $t } = o('step')
  var At = jt({
    props: {
      title: { type: String, default: '' },
      content: { type: String, default: '' },
      icon: { type: String, default: null },
      size: { type: [String, Number], default: '12px' }
    },
    setup(e, { emit: n, slots: o }) {
      const { proxy: l } = t.getCurrentInstance(),
        a = t.inject('parent')
      a.relation(l)
      const i = t.reactive({ dot: a.props.progressDot }),
        r = t.computed(() => a.state.children.indexOf(l) + 1),
        s = t.computed(() =>
          (() => {
            const e = r.value
            return e < +a.props.current
              ? 'finish'
              : e === +a.props.current
              ? 'process'
              : 'wait'
          })()
        ),
        c = t.computed(() => ({ [$t]: !0, [`${$t}-${s.value}`]: !0 }))
      return __spreadProps(__spreadValues({}, t.toRefs(i)), {
        index: r,
        classes: c
      })
    }
  })
  const Ft = { class: 'nut-step-head' },
    Ot = t.createElementVNode('view', { class: 'nut-step-line' }, null, -1),
    qt = { key: 2, class: 'nut-step-inner' },
    Rt = { class: 'nut-step-main' },
    Ht = { class: 'nut-step-title' },
    Yt = ['innerHTML']
  At.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-icon')
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        { class: t.normalizeClass(e.classes) },
        [
          t.createElementVNode('view', Ft, [
            Ot,
            t.createElementVNode(
              'view',
              {
                class: t.normalizeClass([
                  'nut-step-icon',
                  [e.dot ? '' : e.icon ? 'is-icon' : 'is-text']
                ])
              },
              [
                e.icon
                  ? (t.openBlock(),
                    t.createBlock(
                      r,
                      {
                        key: 0,
                        class: 'nut-step-icon-inner',
                        name: e.icon,
                        size: e.size
                      },
                      null,
                      8,
                      ['name', 'size']
                    ))
                  : e.dot
                  ? (t.openBlock(),
                    t.createElementBlock(t.Fragment, { key: 1 }, [], 64))
                  : (t.openBlock(),
                    t.createElementBlock(
                      'view',
                      qt,
                      t.toDisplayString(e.index),
                      1
                    ))
              ],
              2
            )
          ]),
          t.createElementVNode('view', Rt, [
            t.createElementVNode('view', Ht, t.toDisplayString(e.title), 1),
            e.content
              ? (t.openBlock(),
                t.createElementBlock(
                  'view',
                  { key: 0, class: 'nut-step-content', innerHTML: e.content },
                  null,
                  8,
                  Yt
                ))
              : t.createCommentVNode('', !0)
          ])
        ],
        2
      )
    )
  }
  function Wt(e) {
    const n = t.getCurrentInstance()
    n && Object.assign(n.proxy, e)
  }
  const { create: Xt, componentName: Ut } = o('swiper')
  var Kt = Xt({
    props: {
      width: { type: [Number, String], default: window.innerWidth },
      height: { type: [Number, String], default: 0 },
      direction: { type: [String], default: 'horizontal' },
      paginationVisible: { type: Boolean, default: !1 },
      paginationColor: { type: String, default: '#fff' },
      loop: { type: Boolean, default: !0 },
      duration: { type: [Number, String], default: 500 },
      autoPlay: { type: [Number, String], default: 0 },
      initPage: { type: [Number, String], default: 0 },
      touchable: { type: Boolean, default: !0 },
      isPreventDefault: { type: Boolean, default: !0 },
      isStopPropagation: { type: Boolean, default: !0 }
    },
    emits: ['change'],
    setup(e, { emit: n, slots: o }) {
      const l = t.ref(),
        a = t.reactive({
          active: 0,
          num: 0,
          rect: null,
          width: 0,
          height: 0,
          moving: !1,
          offset: 0,
          touchTime: 0,
          autoplayTimer: 0,
          children: [],
          style: {}
        }),
        i = (function () {
          const e = t.reactive({
              startX: 0,
              startY: 0,
              deltaX: 0,
              deltaY: 0,
              offsetX: 0,
              offsetY: 0,
              direction: ''
            }),
            n = () => {
              ;(e.startX = 0),
                (e.startY = 0),
                (e.deltaX = 0),
                (e.deltaY = 0),
                (e.offsetX = 0),
                (e.offsetY = 0),
                (e.direction = '')
            }
          return {
            state: e,
            start: t => {
              n(),
                (e.startX = t.touches[0].clientX),
                (e.startY = t.touches[0].clientY)
            },
            reset: n,
            move: t => {
              var n, o
              ;(e.deltaX = t.touches[0].clientX - e.startX),
                (e.deltaY = t.touches[0].clientY - e.startY),
                (e.offsetX = Math.abs(e.deltaX)),
                (e.offsetY = Math.abs(e.deltaY)),
                e.direction ||
                  (e.direction =
                    (n = e.offsetX) > (o = e.offsetY) && n > 5
                      ? 'horizontal'
                      : o > n && o > 5
                      ? 'vertical'
                      : '')
            }
          }
        })(),
        r = t.computed(() => ({ [Ut]: !0 })),
        s = t.computed(() => 'vertical' === e.direction),
        c = t.computed(() => (s.value ? i.state.deltaY : i.state.deltaX)),
        u = t.computed(() => i.state.direction === e.direction),
        d = t.computed(() => a.children.length),
        p = t.computed(() => a[s.value ? 'height' : 'width']),
        m = t.computed(() => d.value * p.value),
        h = t.computed(() => {
          if (a.rect) {
            return (s.value ? a.rect.height : a.rect.width) - p.value * d.value
          }
          return 0
        }),
        g = t.computed(() => (a.active + d.value) % d.value),
        y = () => {
          a.style = {
            transitionDuration: `${a.moving ? 0 : e.duration}ms`,
            transform: `translate${s.value ? 'Y' : 'X'}(${a.offset}px)`,
            [s.value ? 'height' : 'width']: p.value * d.value + 'px',
            [s.value ? 'width' : 'height']: `${s.value ? a.width : a.height}px`
          }
        },
        f = (e, t, n) => Math.min(Math.max(e, t), n),
        v = e => {
          window.requestAnimationFrame.call(window, e)
        },
        k = (t, n = 0) => {
          let o = t * p.value
          e.loop || (o = Math.min(o, -h.value))
          let l = n - o
          return e.loop || (l = f(l, h.value, 0)), l
        },
        b = ({ pace: t = 0, offset: o = 0, isEmit: l = !1 }) => {
          if (d.value <= 1) return
          const { active: i } = a,
            r = (t => {
              const { active: n } = a
              return t
                ? e.loop
                  ? f(n + t, -1, d.value)
                  : f(n + t, 0, d.value - 1)
                : n
            })(t),
            s = k(r, o)
          if (e.loop) {
            if (a.children[0] && s !== h.value) {
              const e = s < h.value
              a.children[0].setOffset(e ? m.value : 0)
            }
            if (a.children[d.value - 1] && 0 !== s) {
              const e = s > 0
              a.children[d.value - 1].setOffset(e ? -m.value : 0)
            }
          }
          ;(a.active = r),
            (a.offset = s),
            l && i !== a.active && n('change', g.value),
            y()
        },
        w = () => {
          ;(a.moving = !0),
            a.active <= -1 && b({ pace: d.value }),
            a.active >= d.value && b({ pace: -d.value })
        },
        S = () => {
          clearTimeout(a.autoplayTimer)
        },
        x = () => {
          w(),
            i.reset(),
            v(() => {
              v(() => {
                ;(a.moving = !1), b({ pace: 1, isEmit: !0 })
              })
            })
        },
        C = () => {
          e.autoPlay <= 0 ||
            d.value <= 1 ||
            (S(),
            (a.autoplayTimer = setTimeout(() => {
              x(), C()
            }, Number(e.autoPlay))))
        },
        B = (t = +e.initPage) => {
          S(),
            (a.rect = l.value.getBoundingClientRect()),
            (t = Math.min(d.value - 1, t)),
            (a.width = e.width ? +e.width : a.rect.width),
            (a.height = e.height ? +e.height : a.rect.height),
            (a.active = t),
            (a.offset = k(a.active)),
            (a.moving = !0),
            y(),
            C()
        }
      return (
        t.provide('parent', {
          props: e,
          size: p,
          relation: e => {
            e.proxy && a.children.push(e.proxy)
          }
        }),
        Wt({
          prev: () => {
            w(),
              i.reset(),
              v(() => {
                v(() => {
                  ;(a.moving = !1), b({ pace: -1, isEmit: !0 })
                })
              })
          },
          next: x,
          to: t => {
            w(),
              i.reset(),
              v(() => {
                v(() => {
                  let n
                  ;(a.moving = !1),
                    (n =
                      e.loop && d.value === t
                        ? 0 === a.active
                          ? 0
                          : t
                        : t % d.value),
                    b({ pace: n - a.active, isEmit: !0 })
                })
              })
          }
        }),
        t.onMounted(() => {
          t.nextTick(() => {
            B()
          })
        }),
        t.onActivated(() => {
          t.nextTick(() => {
            B()
          })
        }),
        t.onDeactivated(() => {
          S()
        }),
        t.onBeforeUnmount(() => {
          S()
        }),
        t.watch(
          () => e.initPage,
          e => {
            t.nextTick(() => {
              B(Number(e))
            })
          }
        ),
        t.watch(
          () => a.children.length,
          () => {
            t.nextTick(() => {
              B(a.active)
            })
          }
        ),
        t.watch(
          () => e.autoPlay,
          e => {
            e > 0 ? C() : S()
          }
        ),
        {
          state: a,
          classes: r,
          container: l,
          componentName: Ut,
          isVertical: s,
          slots: o,
          activePagination: g,
          onTouchStart: t => {
            e.isPreventDefault && t.preventDefault(),
              e.isStopPropagation && t.stopPropagation(),
              e.touchable && (i.start(t), (a.touchTime = Date.now()), S(), w())
          },
          onTouchMove: t => {
            e.touchable &&
              a.moving &&
              (i.move(t), u.value && b({ offset: c.value }))
          },
          onTouchEnd: t => {
            if (!e.touchable || !a.moving) return
            const n = c.value / (Date.now() - a.touchTime)
            if (
              (Math.abs(n) > 0.3 ||
                Math.abs(c.value) > +(p.value / 2).toFixed(2)) &&
              u.value
            ) {
              let t = 0
              const n = s.value ? i.state.offsetY : i.state.offsetX
              ;(t = e.loop
                ? n > 0
                  ? c.value > 0
                    ? -1
                    : 1
                  : 0
                : -Math[c.value > 0 ? 'ceil' : 'floor'](c.value / p.value)),
                b({ pace: t, isEmit: !0 })
            } else c.value && b({ pace: 0 })
            ;(a.moving = !1), y(), C()
          }
        }
      )
    }
  })
  ;(Kt.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        {
          ref: 'container',
          class: t.normalizeClass(e.classes),
          onTouchstart:
            n[0] || (n[0] = (...t) => e.onTouchStart && e.onTouchStart(...t)),
          onTouchmove:
            n[1] || (n[1] = (...t) => e.onTouchMove && e.onTouchMove(...t)),
          onTouchend:
            n[2] || (n[2] = (...t) => e.onTouchEnd && e.onTouchEnd(...t)),
          onTouchcancel:
            n[3] || (n[3] = (...t) => e.onTouchEnd && e.onTouchEnd(...t))
        },
        [
          t.createElementVNode(
            'view',
            {
              class: t.normalizeClass({
                [`${e.componentName}-inner`]: !0,
                [`${e.componentName}-vertical`]: e.isVertical
              }),
              style: t.normalizeStyle(e.state.style)
            },
            [t.renderSlot(e.$slots, 'default', {}, void 0, !0)],
            6
          ),
          t.renderSlot(e.$slots, 'page', {}, void 0, !0),
          e.paginationVisible && !e.slots.page
            ? (t.openBlock(),
              t.createElementBlock(
                'view',
                {
                  key: 0,
                  class: t.normalizeClass({
                    [`${e.componentName}-pagination`]: !0,
                    [`${e.componentName}-pagination-vertical`]: e.isVertical
                  })
                },
                [
                  (t.openBlock(!0),
                  t.createElementBlock(
                    t.Fragment,
                    null,
                    t.renderList(
                      e.state.children.length,
                      (n, o) => (
                        t.openBlock(),
                        t.createElementBlock(
                          'i',
                          {
                            style: t.normalizeStyle({
                              backgroundColor:
                                e.activePagination === o
                                  ? e.paginationColor
                                  : '#ddd'
                            }),
                            key: o
                          },
                          null,
                          4
                        )
                      )
                    ),
                    128
                  ))
                ],
                2
              ))
            : t.createCommentVNode('', !0)
        ],
        34
      )
    )
  }),
    (Kt.__scopeId = 'data-v-5fbed60b')
  const { create: Gt, componentName: Jt } = o('swiper-item')
  var Qt = Gt({
    props: {},
    setup(e, { slots: n }) {
      const o = t.inject('parent')
      o.relation(t.getCurrentInstance())
      const l = t.reactive({ offset: 0 }),
        a = t.computed(() => ({ [Jt]: !0 })),
        i = t.computed(() => {
          const e = {},
            t = null == o ? void 0 : o.props.direction
          return (
            (null == o ? void 0 : o.size.value) &&
              (e['horizontal' === t ? 'width' : 'height'] = `${
                null == o ? void 0 : o.size.value
              }px`),
            l.offset &&
              (e.transform = `translate${'horizontal' === t ? 'X' : 'Y'}(${
                l.offset
              }px)`),
            e
          )
        })
      return (
        (function (e) {
          const n = t.getCurrentInstance()
          n && Object.assign(n.proxy, e)
        })({
          setOffset: e => {
            l.offset = e
          }
        }),
        { style: i, classes: a }
      )
    }
  })
  ;(Qt.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        {
          class: t.normalizeClass(e.classes),
          style: t.normalizeStyle(e.style)
        },
        [t.renderSlot(e.$slots, 'default', {}, void 0, !0)],
        6
      )
    )
  }),
    (Qt.__scopeId = 'data-v-030cd9cc')
  const { componentName: Zt, create: en } = o('switch')
  var tn = en({
    props: {
      modelValue: { type: Boolean, default: !1 },
      disable: { type: Boolean, default: !1 },
      activeColor: { type: String, default: '' },
      inactiveColor: { type: String, default: '' },
      activeText: { type: String, default: '' },
      inactiveText: { type: String, default: '' }
    },
    emits: ['change', 'update:modelValue'],
    setup: (e, { emit: n }) => ({
      classes: t.computed(() => {
        const t = Zt
        return {
          [t]: !0,
          [e.modelValue ? 'switch-open' : 'switch-close']: !0,
          [`${t}-disable`]: e.disable,
          [`${t}-base`]: !0
        }
      }),
      style: t.computed(() => ({
        backgroundColor: e.modelValue ? e.activeColor : e.inactiveColor
      })),
      onClick: t => {
        e.disable ||
          (n('update:modelValue', !e.modelValue), n('change', !e.modelValue, t))
      }
    })
  })
  const nn = { class: 'switch-button' },
    on = { class: 'close-line' }
  tn.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        {
          class: t.normalizeClass(e.classes),
          onClick: n[0] || (n[0] = (...t) => e.onClick && e.onClick(...t)),
          style: t.normalizeStyle(e.style)
        },
        [
          t.createElementVNode('view', nn, [
            t.withDirectives(t.createElementVNode('view', on, null, 512), [
              [t.vShow, !e.modelValue]
            ]),
            e.activeText
              ? (t.openBlock(),
                t.createElementBlock(
                  t.Fragment,
                  { key: 0 },
                  [
                    t.withDirectives(
                      t.createElementVNode(
                        'view',
                        { class: 'nut-switch-label open' },
                        t.toDisplayString(e.activeText),
                        513
                      ),
                      [[t.vShow, e.modelValue]]
                    ),
                    t.withDirectives(
                      t.createElementVNode(
                        'view',
                        { class: 'nut-switch-label close' },
                        t.toDisplayString(e.inactiveText),
                        513
                      ),
                      [[t.vShow, !e.modelValue]]
                    )
                  ],
                  64
                ))
              : t.createCommentVNode('', !0)
          ])
        ],
        6
      )
    )
  }
  const { create: ln } = o('toast'),
    an = ln({
      components: { [d.name]: d },
      props: {
        id: String,
        msg: String,
        duration: { type: Number, default: 2e3 },
        center: { type: Boolean, default: !0 },
        type: String,
        customClass: String,
        bottom: { type: Number, default: 30 },
        size: { type: [String, Number], default: 'base' },
        icon: String,
        textAlignCenter: { type: Boolean, default: !0 },
        loadingRotate: { type: Boolean, default: !0 },
        bgColor: { type: String, default: 'rgba(0, 0, 0, .8)' },
        onClose: Function,
        unmount: Function,
        cover: { type: Boolean, default: !1 },
        coverColor: { type: String, default: 'rgba(0, 0, 0, 0)' },
        closeOnClickOverlay: { type: Boolean, default: !1 }
      },
      setup(e) {
        let n
        const o = t.reactive({ mounted: !1 })
        t.onMounted(() => {
          o.mounted = !0
        })
        const l = () => {
            n && (clearTimeout(n), (n = null))
          },
          a = () => {
            o.mounted = !1
          },
          i = () => {
            l(),
              e.duration &&
                (n = setTimeout(() => {
                  a()
                }, e.duration))
          }
        e.duration && i(),
          t.watch(
            () => e.duration,
            e => {
              e && i()
            }
          )
        const r = t.computed(() => 'text' !== e.type || !!e.icon),
          s = t.computed(() => [
            'nut-toast',
            { 'nut-toast-center': e.center },
            { 'nut-toast-has-icon': r.value },
            { 'nut-toast-cover': e.cover },
            { 'nut-toast-loading': 'loading' === e.type },
            e.customClass,
            'nut-toast-' + e.size
          ])
        return {
          state: o,
          hide: a,
          clickCover: () => {
            e.closeOnClickOverlay && a()
          },
          hasIcon: r,
          toastBodyClass: s,
          onAfterLeave: () => {
            l(), e.unmount(e.id), e.onClose && e.onClose()
          }
        }
      }
    }),
    rn = { key: 0, class: 'nut-toast-icon-wrapper' },
    sn = ['innerHTML']
  an.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-icon')
    return (
      t.openBlock(),
      t.createBlock(
        t.Transition,
        { name: 'toast-fade', onAfterLeave: e.onAfterLeave },
        {
          default: t.withCtx(() => [
            t.withDirectives(
              t.createElementVNode(
                'view',
                {
                  class: t.normalizeClass(e.toastBodyClass),
                  style: t.normalizeStyle({
                    bottom: e.center ? 'auto' : e.bottom + 'px',
                    'background-color': e.coverColor
                  }),
                  onClick:
                    n[0] ||
                    (n[0] = (...t) => e.clickCover && e.clickCover(...t))
                },
                [
                  t.createElementVNode(
                    'view',
                    {
                      class: 'nut-toast-inner',
                      style: t.normalizeStyle({
                        'text-align': e.textAlignCenter ? 'center' : 'left',
                        'background-color': e.bgColor
                      })
                    },
                    [
                      e.hasIcon
                        ? (t.openBlock(),
                          t.createElementBlock('view', rn, [
                            t.createVNode(
                              r,
                              { size: '20', color: '#ffffff', name: e.icon },
                              null,
                              8,
                              ['name']
                            )
                          ]))
                        : t.createCommentVNode('', !0),
                      t.createElementVNode(
                        'view',
                        { class: 'nut-toast-text', innerHTML: e.msg },
                        null,
                        8,
                        sn
                      )
                    ],
                    4
                  )
                ],
                6
              ),
              [[t.vShow, e.state.mounted]]
            )
          ]),
          _: 1
        },
        8,
        ['onAfterLeave']
      )
    )
  }
  const cn = {
    msg: '',
    id: '',
    duration: 2e3,
    center: !0,
    type: 'text',
    customClass: '',
    bottom: 30,
    size: 'base',
    icon: null,
    textAlignCenter: !0,
    loadingRotate: !0,
    bgColor: 'rgba(0, 0, 0, .8)',
    onClose: null,
    unmount: null,
    cover: !1,
    coverColor: 'rgba(0, 0, 0, 0)',
    closeOnClickOverlay: !1
  }
  let un = [],
    dn = []
  const pn = e => {
      if (e) {
        const t = document.getElementById(e)
        ;(dn = dn.filter(t => t.id !== e)),
          (un = un.filter(t => t !== e)),
          t && document.body.removeChild(t)
      } else
        un.forEach(e => {
          const t = document.getElementById(e)
          t && document.body.removeChild(t)
        }),
          (dn = []),
          (un = [])
    },
    mn = e => {
      let n
      if (((e.unmount = pn), e.id)) {
        if (((n = e.id), un.find(t => t === e.id)))
          return (e => {
            const n = document.getElementById(e.id)
            if (n) {
              const o = dn.find(t => t.id === e.id)
              e = __spreadValues(
                o
                  ? __spreadValues(__spreadValues({}, cn), o)
                  : __spreadValues({}, cn),
                e
              )
              const l = t.createVNode(an, e)
              return t.render(l, n), l.component.ctx
            }
          })(e)
      } else n = new Date().getTime() + ''
      ;((e = __spreadValues(__spreadValues({}, cn), e)).id = n),
        un.push(e.id),
        dn.push(e)
      const o = document.createElement('div')
      o.id = e.id
      const l = t.createVNode(an, e)
      return t.render(l, o), document.body.appendChild(o), l.component.ctx
    },
    hn = e => {
      e || console.warn('[NutUI Toast]: msg不能为空')
    },
    gn = {
      text: (e, t = {}) => (
        hn(e),
        mn(__spreadProps(__spreadValues({}, t), { type: 'text', msg: e }))
      ),
      success: (e, t = {}) => (
        hn(e),
        mn(
          __spreadProps(__spreadValues({ icon: 'success' }, t), {
            msg: e,
            type: 'success'
          })
        )
      ),
      fail: (e, t = {}) => (
        hn(e),
        mn(
          __spreadProps(__spreadValues({ icon: 'failure' }, t), {
            msg: e,
            type: 'fail'
          })
        )
      ),
      warn: (e, t = {}) => (
        hn(e),
        mn(
          __spreadProps(__spreadValues({ icon: 'tips' }, t), {
            msg: e,
            type: 'warn'
          })
        )
      ),
      loading: (e, t = {}) =>
        mn(
          __spreadProps(__spreadValues({ icon: 'loading' }, t), {
            msg: e,
            type: 'loading'
          })
        ),
      hide() {
        pn()
      },
      install(e) {
        e.use(an), (e.config.globalProperties.$toast = gn)
      }
    },
    { create: yn } = o('progress')
  var fn = yn({
    props: {
      percentage: { type: [Number, String], default: 0, required: !0 },
      size: { type: String, default: 'base' },
      status: { type: String, default: '' },
      strokeWidth: { type: [Number, String], default: '' },
      textInside: { type: Boolean, default: !1 },
      showText: { type: Boolean, default: !0 },
      strokeColor: { type: String, default: '' },
      textColor: { tyep: String, default: '' },
      iconName: { type: String, default: 'checked' },
      iconColor: { type: String, default: '#439422' }
    },
    setup(e, { emit: n }) {
      const o = t.ref(e.strokeWidth + 'px'),
        l = t.ref(),
        a = t.ref(),
        i = t.computed(() => ({
          width: e.percentage + '%',
          background: e.strokeColor || ''
        })),
        r = t.computed(() => ({ color: e.textColor || '' }))
      return (
        t.watch(
          () => e.percentage,
          e => {
            console.log('progressOuter.value.offsetWidth', l.value.offsetWidth),
              console.log('values', e),
              (a.value = l.value.offsetWidth * Number(e) * 0.01 - 5 + 'px')
          }
        ),
        t.onMounted(() => {
          a.value = l.value.offsetWidth * Number(e.percentage) * 0.01 - 5 + 'px'
        }),
        { height: o, bgStyle: i, textStyle: r, progressOuter: l, left: a }
      )
    }
  })
  const vn = { class: 'nut-progress' }
  fn.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-icon')
    return (
      t.openBlock(),
      t.createElementBlock('div', vn, [
        t.createElementVNode(
          'div',
          {
            class: t.normalizeClass([
              'nut-progress-outer',
              [
                e.showText && !e.textInside ? 'nut-progress-outer-part' : '',
                e.size ? 'nut-progress-' + e.size : ''
              ]
            ]),
            ref: 'progressOuter',
            style: t.normalizeStyle({ height: e.height })
          },
          [
            t.createElementVNode(
              'div',
              {
                class: t.normalizeClass([
                  'nut-progress-inner',
                  'active' == e.status ? 'nut-active' : ''
                ]),
                style: t.normalizeStyle(e.bgStyle)
              },
              [
                e.showText && e.textInside
                  ? (t.openBlock(),
                    t.createElementBlock(
                      'div',
                      {
                        key: 0,
                        class: 'nut-progress-text nut-progress-insidetext',
                        style: t.normalizeStyle({
                          lineHeight: e.height,
                          left: e.left
                        })
                      },
                      [
                        t.createElementVNode(
                          'span',
                          { style: t.normalizeStyle(e.textStyle) },
                          t.toDisplayString(e.percentage) + '%',
                          5
                        )
                      ],
                      4
                    ))
                  : t.createCommentVNode('', !0)
              ],
              6
            )
          ],
          6
        ),
        e.showText && !e.textInside
          ? (t.openBlock(),
            t.createElementBlock(
              'div',
              {
                key: 0,
                class: 'nut-progress-text',
                style: t.normalizeStyle({ lineHeight: e.height })
              },
              [
                'active' == e.status || '' == e.status
                  ? (t.openBlock(),
                    t.createElementBlock(
                      'span',
                      { key: 0, style: t.normalizeStyle(e.textStyle) },
                      t.toDisplayString(e.percentage) + '%',
                      5
                    ))
                  : 'icon' == e.status
                  ? (t.openBlock(),
                    t.createBlock(
                      r,
                      {
                        key: 1,
                        size: '16px',
                        name: e.iconName,
                        color: e.iconColor
                      },
                      null,
                      8,
                      ['name', 'color']
                    ))
                  : t.createCommentVNode('', !0)
              ],
              4
            ))
          : t.createCommentVNode('', !0)
      ])
    )
  }
  const { componentName: kn, create: bn } = o('circleprogress')
  var wn = bn({
    props: {
      progress: { type: [Number, String], required: !0 },
      strokeInnerWidth: { type: [Number, String], default: 10 },
      isAuto: { tyep: Boolean, default: !1 },
      progressOption: { type: Object, default: () => {} }
    },
    setup(e, { emit: n }) {
      const o = t.computed(() => ({ [kn]: !0 })),
        l = t.computed(() => {
          let t = {
            radius: 50,
            strokeOutWidth: 10,
            backColor: '#d9d9d9',
            progressColor: 'red',
            cy: 1,
            cx: 1,
            size: 1,
            startPosition: ''
          }
          return (
            Object.assign(t, e.progressOption),
            (t.cy = t.cx = t.radius + t.strokeOutWidth),
            (t.size = 2 * (t.radius + t.strokeOutWidth)),
            (t.startPosition = 'rotate(-90,' + t.cx + ',' + t.cy + ')'),
            t
          )
        }),
        a = t.computed(() => {
          let t = Math.floor(2 * Math.PI * l.value.radius)
          return `${(e.progress / 100) * t},${t}`
        })
      return { classes: o, option: l, arcLength: a }
    }
  })
  const Sn = ['height', 'width'],
    xn = ['r', 'cx', 'cy', 'stroke', 'stroke-width'],
    Cn = [
      'r',
      'cx',
      'cy',
      'stroke',
      'stroke-dasharray',
      'stroke-width',
      'transform'
    ],
    Bn = { class: 'nut-circleprogress-content' }
  wn.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock(
        'div',
        {
          class: t.normalizeClass(e.classes),
          style: t.normalizeStyle({
            height: e.option.size + 'px',
            width: e.option.size + 'px'
          })
        },
        [
          (t.openBlock(),
          t.createElementBlock(
            'svg',
            {
              height: e.option.size,
              width: e.option.size,
              'x-mlns': 'http://www.w3.org/200/svg'
            },
            [
              t.createElementVNode(
                'circle',
                {
                  r: e.option.radius,
                  cx: e.option.cx,
                  cy: e.option.cy,
                  stroke: e.option.backColor,
                  'stroke-width': e.option.strokeOutWidth,
                  fill: 'none'
                },
                null,
                8,
                xn
              ),
              t.createElementVNode(
                'circle',
                {
                  r: e.option.radius,
                  cx: e.option.cx,
                  cy: e.option.cy,
                  stroke: e.option.progressColor,
                  'stroke-dasharray': e.arcLength,
                  'stroke-width': e.strokeInnerWidth,
                  fill: 'none',
                  transform: e.option.startPosition,
                  'stroke-linecap': 'round',
                  style: {
                    transition:
                      'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease 0s'
                  }
                },
                null,
                8,
                Cn
              )
            ],
            8,
            Sn
          )),
          t.createElementVNode('div', Bn, [
            e.isAuto
              ? t.renderSlot(e.$slots, 'default', { key: 1 })
              : t.renderSlot(e.$slots, 'default', { key: 0 }, () => [
                  t.createTextVNode(t.toDisplayString(e.progress) + '%', 1)
                ])
          ])
        ],
        6
      )
    )
  }
  const { componentName: Nn, create: En } = o('noticebar')
  var _n = En({
    props: {
      direction: { type: String, default: 'across' },
      list: { type: Array, default: () => [] },
      standTime: { type: Number, default: 1e3 },
      complexAm: { type: Boolean, default: !1 },
      height: { type: Number, default: 40 },
      text: { type: String, default: '' },
      closeMode: { type: Boolean, default: !1 },
      wrapable: { type: Boolean, default: !1 },
      leftIcon: { type: String, default: '' },
      color: { type: String, default: '' },
      background: { type: String, default: '' },
      delay: { type: [String, Number], default: 1 },
      scrollable: { type: Boolean, default: !0 },
      speed: { type: Number, default: 50 }
    },
    components: {
      ScrollItem: function (e) {
        return (e.item.props.style = e.style), t.h(e.item)
      }
    },
    emits: ['click', 'close'],
    setup(e, { emit: n, slots: o }) {
      console.log('componentName', Nn)
      const l = t.ref(null),
        a = t.ref(null),
        i = t.reactive({
          wrapWidth: 0,
          firstRound: !0,
          duration: 0,
          offsetWidth: 0,
          showNoticeBar: !0,
          animationClass: '',
          animate: !1,
          scrollList: [],
          distance: 0,
          timer: null,
          keepAlive: !1
        }),
        r = t.computed(() => ({ [Nn]: !0 })),
        s = t.computed(() => 'close' != e.leftIcon),
        c = t.computed(() => {
          let t = {}
          return (
            e.color && (t.color = e.color),
            e.background && (t.background = e.background),
            'vertical' == e.direction && (t.height = `${e.height}px`),
            t
          )
        }),
        u = t.computed(() => ({
          paddingLeft: i.firstRound ? 0 : i.wrapWidth + 'px',
          animationDelay: (i.firstRound ? e.delay : 0) + 's',
          animationDuration: i.duration + 's'
        })),
        d = t.computed(() => {
          let t = ''
          return e.leftIcon && (t = e.leftIcon), t
        }),
        p = t.computed(() => {
          let t = {}
          return (
            e.complexAm
              ? (t = { transform: `translateY(${i.distance}px)` })
              : i.animate &&
                (t = {
                  transition: `all ${~~(e.height / e.speed / 4)}s`,
                  'margin-top': `-${e.height}px`
                }),
            t
          )
        })
      t.watch(
        () => e.text,
        e => {
          m(e)
        }
      ),
        t.watch(
          () => e.list,
          e => {
            i.scrollList = [].concat(e)
          }
        )
      const m = t => {
          0 != i.showNoticeBar &&
            setTimeout(() => {
              if (!l.value || !a.value) return
              const t = l.value.getBoundingClientRect().width,
                n = a.value.getBoundingClientRect().width
              e.scrollable && n > t
                ? ((i.wrapWidth = t),
                  (i.offsetWidth = n),
                  (i.duration = n / e.speed),
                  (i.animationClass = 'play'))
                : (i.animationClass = '')
            })
        },
        h = () => {
          ;(i.animate = !0),
            setTimeout(() => {
              i.scrollList.push(i.scrollList[0]),
                i.scrollList.shift(),
                (i.animate = !1)
            }, 1e3 * ~~(e.height / e.speed / 4))
        },
        g = (t, n) => {
          setTimeout(() => {
            ;(i.distance -= e.height / 100),
              n &&
                (i.scrollList.push(i.scrollList[0]),
                i.scrollList.shift(),
                (i.distance = 0))
          }, t * e.speed)
        }
      return (
        t.onMounted(() => {
          console.log(e.direction),
            'vertical' == e.direction
              ? (o.default
                  ? (i.scrollList = [].concat(o.default()[0].children))
                  : (i.scrollList = [].concat(e.list)),
                console.log(i.scrollList),
                setTimeout(() => {
                  e.complexAm
                    ? (i.timer = setInterval(() => {
                        for (let e = 0; e < 100; e++) g(e, !(e < 99))
                      }, e.standTime + 100 * e.speed))
                    : (h(),
                      (i.timer = setInterval(
                        h,
                        1e3 * ~~(e.height / e.speed / 4) + e.standTime
                      )))
                }, e.standTime))
              : m(e.text)
        }),
        t.onActivated(() => {
          i.keepAlive && (i.keepAlive = !1)
        }),
        t.onDeactivated(() => {
          ;(i.keepAlive = !0), clearInterval(i.timer)
        }),
        t.onUnmounted(() => {
          clearInterval(i.timer)
        }),
        __spreadProps(
          __spreadValues(__spreadValues({}, t.toRefs(e)), t.toRefs(i)),
          {
            classes: r,
            iconShow: s,
            barStyle: c,
            contentStyle: u,
            iconBg: d,
            horseLampStyle: p,
            wrap: l,
            content: a,
            handleClick: e => {
              n('click', e)
            },
            onClickIcon: t => {
              ;(i.showNoticeBar = !e.closeMode), n('close', t)
            },
            onAnimationEnd: () => {
              ;(i.firstRound = !1),
                setTimeout(() => {
                  ;(i.duration = (i.offsetWidth + i.wrapWidth) / e.speed),
                    (i.animationClass = 'play-infinite')
                }, 0)
            },
            go: e => {
              n('click', e)
            },
            handleClickIcon: () => {
              n('close', i.scrollList[0])
            },
            slots: o
          }
        )
      )
    }
  })
  const zn = { ref: 'wrap', class: 'wrap' },
    Tn = ['onClick']
  _n.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-icon'),
      s = t.resolveComponent('ScrollItem')
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        { class: t.normalizeClass(e.classes) },
        [
          'across' == e.direction
            ? t.withDirectives(
                (t.openBlock(),
                t.createElementBlock(
                  'view',
                  {
                    key: 0,
                    class: t.normalizeClass([
                      'nut-noticebar-page',
                      {
                        withicon: e.closeMode,
                        close: e.closeMode,
                        wrapable: e.wrapable
                      }
                    ]),
                    style: t.normalizeStyle(e.barStyle),
                    onClick:
                      n[3] ||
                      (n[3] = (...t) => e.handleClick && e.handleClick(...t))
                  },
                  [
                    e.iconShow
                      ? (t.openBlock(),
                        t.createElementBlock(
                          'view',
                          {
                            key: 0,
                            class: 'left-icon',
                            style: t.normalizeStyle({
                              'background-image': `url(${e.iconBg})`
                            })
                          },
                          [
                            e.iconBg
                              ? t.createCommentVNode('', !0)
                              : (t.openBlock(),
                                t.createBlock(
                                  r,
                                  {
                                    key: 0,
                                    name: 'notice',
                                    size: '16',
                                    color: e.color
                                  },
                                  null,
                                  8,
                                  ['color']
                                ))
                          ],
                          4
                        ))
                      : t.createCommentVNode('', !0),
                    t.createElementVNode(
                      'view',
                      zn,
                      [
                        t.createElementVNode(
                          'view',
                          {
                            ref: 'content',
                            class: t.normalizeClass([
                              'content',
                              [
                                e.animationClass,
                                { 'nut-ellipsis': !e.scrollable && !e.wrapable }
                              ]
                            ]),
                            style: t.normalizeStyle(e.contentStyle),
                            onAnimationend:
                              n[0] ||
                              (n[0] = (...t) =>
                                e.onAnimationEnd && e.onAnimationEnd(...t)),
                            onWebkitAnimationEnd:
                              n[1] ||
                              (n[1] = (...t) =>
                                e.onAnimationEnd && e.onAnimationEnd(...t))
                          },
                          [
                            t.renderSlot(e.$slots, 'default', {}, () => [
                              t.createTextVNode(
                                '1' + t.toDisplayString(e.text),
                                1
                              )
                            ])
                          ],
                          38
                        )
                      ],
                      512
                    ),
                    e.closeMode
                      ? (t.openBlock(),
                        t.createElementBlock(
                          'view',
                          {
                            key: 1,
                            class: 'right-icon',
                            onClick:
                              n[2] ||
                              (n[2] = t.withModifiers(
                                (...t) => e.onClickIcon && e.onClickIcon(...t),
                                ['stop']
                              ))
                          },
                          [
                            t.createVNode(
                              r,
                              { name: 'close', color: e.color },
                              null,
                              8,
                              ['color']
                            )
                          ]
                        ))
                      : t.createCommentVNode('', !0)
                  ],
                  6
                )),
                [[t.vShow, e.showNoticeBar]]
              )
            : t.createCommentVNode('', !0),
          e.scrollList.length > 0 && 'vertical' == e.direction
            ? (t.openBlock(),
              t.createElementBlock(
                'view',
                {
                  key: 1,
                  class: 'nut-noticebar-vertical',
                  style: t.normalizeStyle(e.barStyle)
                },
                [
                  e.slots.default
                    ? (t.openBlock(),
                      t.createElementBlock(
                        'view',
                        {
                          key: 0,
                          class: 'horseLamp_list',
                          style: t.normalizeStyle(e.horseLampStyle)
                        },
                        [
                          (t.openBlock(!0),
                          t.createElementBlock(
                            t.Fragment,
                            null,
                            t.renderList(
                              e.scrollList,
                              (n, o) => (
                                t.openBlock(),
                                t.createBlock(
                                  s,
                                  {
                                    key: o,
                                    style: t.normalizeStyle({
                                      height: e.height + 'px',
                                      'line-height': e.height + 'px'
                                    }),
                                    item: n
                                  },
                                  null,
                                  8,
                                  ['style', 'item']
                                )
                              )
                            ),
                            128
                          ))
                        ],
                        4
                      ))
                    : (t.openBlock(),
                      t.createElementBlock(
                        'ul',
                        {
                          key: 1,
                          class: 'horseLamp_list',
                          style: t.normalizeStyle(e.horseLampStyle)
                        },
                        [
                          (t.openBlock(!0),
                          t.createElementBlock(
                            t.Fragment,
                            null,
                            t.renderList(
                              e.scrollList,
                              (n, o) => (
                                t.openBlock(),
                                t.createElementBlock(
                                  'li',
                                  {
                                    class: 'horseLamp_list_item',
                                    key: o,
                                    style: t.normalizeStyle({
                                      height: e.height
                                    }),
                                    onClick: t => e.go(n)
                                  },
                                  t.toDisplayString(n),
                                  13,
                                  Tn
                                )
                              )
                            ),
                            128
                          ))
                        ],
                        4
                      )),
                  t.createElementVNode(
                    'view',
                    {
                      class: 'go',
                      onClick:
                        n[4] ||
                        (n[4] = t => !e.slots.rightIcon && e.handleClickIcon())
                    },
                    [
                      e.slots.rightIcon
                        ? t.renderSlot(e.$slots, 'rightIcon', { key: 0 })
                        : e.closeMode
                        ? (t.openBlock(),
                          t.createBlock(
                            r,
                            {
                              key: 1,
                              type: 'cross',
                              color: e.color,
                              size: '11px'
                            },
                            null,
                            8,
                            ['color']
                          ))
                        : t.createCommentVNode('', !0)
                    ]
                  )
                ],
                4
              ))
            : t.createCommentVNode('', !0)
        ],
        2
      )
    )
  }
  const { componentName: Vn, create: Dn } = o('navbar')
  var In = Dn({
    props: {
      leftShow: { type: Boolean, default: !0 },
      title: { type: String, default: '' },
      titIcon: { type: String, default: '' },
      tabs: { type: Array, defaul: () => [] },
      icon: { type: String, default: '' },
      desc: { type: String, default: '' },
      defaultIndex: { type: Number, default: 0 }
    },
    emits: [
      'click',
      'on-click-back',
      'on-click-title',
      'on-click-right',
      'on-click-desc',
      'on-click-icon',
      'on-click-more',
      'on-click-clear',
      'on-click-send',
      'on-click-slot',
      'on-click-slot-send',
      'switch-tab'
    ],
    setup(e, { emit: n }) {
      const o = t.ref(e.defaultIndex)
      return {
        classes: t.computed(() => ({ [Vn]: !0 })),
        handleLeft: function () {
          n('on-click-back')
        },
        handleCenter: function () {
          n('on-click-title')
        },
        handleCenterIcon: function () {
          n('on-click-icon')
        },
        handleClear: function () {
          n('on-click-clear')
        },
        handleSend: function () {
          n('on-click-send')
        },
        handleSlot: function () {
          n('on-click-slot')
        },
        handleSends: function () {
          n('on-click-slot-send')
        },
        switchTitle: function (e, t) {
          ;(o.value = e), console.log(e), n('switch-tab', o.value, t)
        },
        activeIndex: o
      }
    }
  })
  const Mn = { class: 'nut-navbar__left' },
    Ln = { class: 'tab-title' },
    Pn = ['onClick']
  In.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-icon')
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        { class: t.normalizeClass(e.classes) },
        [
          t.createElementVNode('view', Mn, [
            e.leftShow
              ? (t.openBlock(),
                t.createBlock(
                  r,
                  {
                    key: 0,
                    color: '#979797',
                    name: 'left',
                    onClick: e.handleLeft
                  },
                  null,
                  8,
                  ['onClick']
                ))
              : t.createCommentVNode('', !0)
          ]),
          e.title || e.titIcon || e.tabs
            ? (t.openBlock(),
              t.createElementBlock(
                'view',
                {
                  key: 0,
                  class: t.normalizeClass([
                    'nut-navbar__title',
                    { icon: e.icon }
                  ])
                },
                [
                  e.title
                    ? (t.openBlock(),
                      t.createElementBlock(
                        'view',
                        {
                          key: 0,
                          onClick:
                            n[0] ||
                            (n[0] = (...t) =>
                              e.handleCenter && e.handleCenter(...t))
                        },
                        t.toDisplayString(e.title),
                        1
                      ))
                    : t.createCommentVNode('', !0),
                  e.titIcon
                    ? (t.openBlock(),
                      t.createBlock(
                        r,
                        {
                          key: 1,
                          class: 'icon',
                          name: e.titIcon,
                          onClick: e.handleCenterIcon
                        },
                        null,
                        8,
                        ['name', 'onClick']
                      ))
                    : t.createCommentVNode('', !0),
                  t.createElementVNode('view', Ln, [
                    (t.openBlock(!0),
                    t.createElementBlock(
                      t.Fragment,
                      null,
                      t.renderList(
                        e.tabs,
                        (n, o) => (
                          t.openBlock(),
                          t.createElementBlock(
                            'view',
                            {
                              class: t.normalizeClass([
                                'tab-title-box',
                                {
                                  'nut-tab-active':
                                    e.activeIndex == n.id || e.activeIndex == o
                                }
                              ]),
                              onClick: t => e.switchTitle(n.id, n.name),
                              key: n.id
                            },
                            t.toDisplayString(n.name),
                            11,
                            Pn
                          )
                        )
                      ),
                      128
                    ))
                  ])
                ],
                2
              ))
            : t.createCommentVNode('', !0),
          e.desc || e.icon
            ? (t.openBlock(),
              t.createElementBlock(
                'view',
                {
                  key: 1,
                  class: t.normalizeClass([
                    'nut-navbar__right',
                    { icon: e.icon }
                  ])
                },
                [
                  e.desc
                    ? (t.openBlock(),
                      t.createElementBlock(
                        'view',
                        {
                          key: 0,
                          style: t.normalizeStyle({
                            'text-align': e.descTextAlign
                          }),
                          onClick:
                            n[1] ||
                            (n[1] = (...t) =>
                              e.handleClear && e.handleClear(...t))
                        },
                        t.toDisplayString(e.desc),
                        5
                      ))
                    : t.createCommentVNode('', !0),
                  e.icon
                    ? (t.openBlock(),
                      t.createElementBlock(
                        'view',
                        {
                          key: 1,
                          onClick:
                            n[2] ||
                            (n[2] = (...t) =>
                              e.handleSends && e.handleSends(...t))
                        },
                        [t.renderSlot(e.$slots, 'icons')]
                      ))
                    : t.createCommentVNode('', !0),
                  t.createElementVNode('view', null, [
                    e.icon
                      ? (t.openBlock(),
                        t.createBlock(
                          r,
                          {
                            key: 0,
                            class: 'rightIcon',
                            name: e.icon,
                            onClick: e.handleSend
                          },
                          null,
                          8,
                          ['name', 'onClick']
                        ))
                      : t.createCommentVNode('', !0)
                  ])
                ],
                2
              ))
            : t.createCommentVNode('', !0)
        ],
        2
      )
    )
  }
  const { componentName: jn, create: $n } = o('fixednav')
  var An = $n({
    components: { [P.name]: P },
    props: {
      visible: { type: Boolean, default: !1 },
      overlay: { type: Boolean, default: !0 },
      navList: { default: () => [], type: Array },
      activeText: { default: '收起导航', type: String },
      unActiveText: { default: '快速导航', type: String },
      position: {
        default: () => ({ top: 'auto', bottom: 'auto' }),
        type: Object
      },
      type: { default: 'right', type: String }
    },
    components: {},
    emits: ['update:visible', 'selected'],
    setup: (e, { emit: n }) => ({
      classes: t.computed(() => ({
        [jn]: !0,
        active: e.visible,
        [e.type]: !0
      })),
      updateValue: (t = !e.visible) => {
        n('update:visible', t)
      },
      selected: (e, t) => {
        n('selected', { item: e, event: t })
      }
    })
  })
  const Fn = { class: 'nut-fixednav__list' },
    On = ['onClick'],
    qn = ['src'],
    Rn = { class: 'span' },
    Hn = { key: 0, class: 'b' },
    Yn = { class: 'text' }
  An.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-overlay'),
      s = t.resolveComponent('nut-icon')
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        {
          class: t.normalizeClass(e.classes),
          style: t.normalizeStyle(e.position)
        },
        [
          e.overlay
            ? (t.openBlock(),
              t.createBlock(
                r,
                {
                  key: 0,
                  visible: e.visible,
                  'z-index': 200,
                  onClick: n[0] || (n[0] = t => e.updateValue(!1))
                },
                null,
                8,
                ['visible']
              ))
            : t.createCommentVNode('', !0),
          t.renderSlot(e.$slots, 'list', {}, () => [
            t.createElementVNode('view', Fn, [
              (t.openBlock(!0),
              t.createElementBlock(
                t.Fragment,
                null,
                t.renderList(
                  e.navList,
                  (n, o) => (
                    t.openBlock(),
                    t.createElementBlock(
                      'view',
                      {
                        class: 'nut-fixednav__list-item',
                        onClick: t => e.selected(n, t),
                        key: n.id || o
                      },
                      [
                        t.createElementVNode(
                          'img',
                          { src: n.icon },
                          null,
                          8,
                          qn
                        ),
                        t.createElementVNode(
                          'view',
                          Rn,
                          t.toDisplayString(n.text),
                          1
                        ),
                        n.num
                          ? (t.openBlock(),
                            t.createElementBlock(
                              'view',
                              Hn,
                              t.toDisplayString(n.num),
                              1
                            ))
                          : t.createCommentVNode('', !0)
                      ],
                      8,
                      On
                    )
                  )
                ),
                128
              ))
            ])
          ]),
          t.createElementVNode(
            'div',
            {
              class: 'nut-fixednav__btn',
              onClick: n[1] || (n[1] = t => e.updateValue())
            },
            [
              t.renderSlot(e.$slots, 'btn', {}, () => [
                t.createVNode(s, { name: 'left', color: '#fff' }),
                t.createElementVNode(
                  'view',
                  Yn,
                  t.toDisplayString(e.visible ? e.activeText : e.unActiveText),
                  1
                )
              ])
            ]
          )
        ],
        6
      )
    )
  }
  var Wn = {
    setup: e => () => t.h('view', {}, e.slots),
    props: { slots: Object }
  }
  const { create: Xn } = o('tab')
  var Un = Xn({
    props: {
      defaultIndex: { type: Number, default: 0 },
      animatedTime: { type: Number, default: 0 },
      direction: { type: String, default: 'horizontal' },
      noSwiping: { type: Boolean, default: !1 },
      scrollType: { type: String, default: 'flex' },
      iconType: { type: String, default: 'all' }
    },
    components: { TabTitle: Wn },
    emits: ['switch-tab'],
    setup(e, n) {
      const o = t.reactive([])
      t.ref(!1)
      const l = t.ref(e.defaultIndex),
        a = t.ref(null),
        i = t.ref(null)
      const r = t.ref(
        'swiper-' +
          Array.from(Array(10), () =>
            Math.floor(36 * Math.random()).toString(36)
          ).join('')
      )
      function s(t) {
        if (a.value) {
          const n = a.value.querySelectorAll('.tab-title-box')[t]
          if ('vertical' === e.direction) {
            const e = a.value.offsetTop,
              t = n.offsetTop,
              o = n.offsetHeight,
              l = a.value.offsetHeight
            a.value.scroll(0, t - e - l / 2 + o / 2)
          } else {
            const e = n.offsetLeft,
              t = n.offsetWidth,
              o = a.value.offsetWidth
            a.value.scroll(e - o / 2 + t / 2, 0)
          }
        }
      }
      function c() {
        if ((console.log(11), (o.length = 0), n.slots.default)) {
          const e =
            1 === n.slots.default().length
              ? n.slots.default()[0].children
              : n.slots.default()
          e &&
            e.map((e, t) => {
              'string' != typeof e.children &&
                o.push({
                  title:
                    e.props && e.props['tab-title'] ? e.props['tab-title'] : '',
                  content:
                    e.children && e.children.header ? e.children.header() : null
                })
            })
        }
      }
      return (
        t.onMounted(() => {
          c()
        }),
        t.watchEffect(
          () => (n.slots.default ? n.slots.default() : ''),
          () => {
            c()
          }
        ),
        t.watchEffect(() => {
          l.value = e.defaultIndex
        }),
        t.watch(
          () => l.value,
          (e, t) => {
            ictx.emit('switch-tab', l.value)
          }
        ),
        {
          swiperClassName: r,
          titles: o,
          navlist: a,
          activeIndex: l,
          switchTitle: function (e) {
            ;(l.value = e), s(e), i.value.to(e)
          },
          changeTab: e => {
            ;(l.value = e), s(e)
          },
          nutuiSwiper: i
        }
      )
    }
  })
  const Kn = { class: 'nutui-tab' },
    Gn = ['onClick'],
    Jn = { class: 'world' },
    Qn = t.createElementVNode('view', { class: 'underline' }, null, -1)
  Un.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('TabTitle'),
      s = t.resolveComponent('nut-swiper')
    return (
      t.openBlock(),
      t.createElementBlock('view', Kn, [
        t.createElementVNode(
          'view',
          {
            class: t.normalizeClass([
              'vertical' === e.direction ? 'vertical-tab' : 'horizontal-tab'
            ])
          },
          [
            t.createElementVNode(
              'view',
              {
                class: t.normalizeClass([
                  'tab-title',
                  e.iconType,
                  'tab-title-scroll'
                ]),
                ref: 'navlist'
              },
              [
                (t.openBlock(!0),
                t.createElementBlock(
                  t.Fragment,
                  null,
                  t.renderList(
                    e.titles,
                    (n, o) => (
                      t.openBlock(),
                      t.createElementBlock(
                        'view',
                        {
                          class: t.normalizeClass([
                            'tab-title-box',
                            { 'nut-tab-active': e.activeIndex == o },
                            { 'tab-title-box-scroll': 'scroll' == e.scrollType }
                          ]),
                          key: o,
                          onClick: t => e.switchTitle(o, t)
                        },
                        [
                          t.createElementVNode(
                            'span',
                            Jn,
                            t.toDisplayString(n.title),
                            1
                          ),
                          n.content
                            ? (t.openBlock(),
                              t.createBlock(
                                r,
                                { key: 0, slots: n.content },
                                null,
                                8,
                                ['slots']
                              ))
                            : t.createCommentVNode('', !0)
                        ],
                        10,
                        Gn
                      )
                    )
                  ),
                  128
                )),
                Qn
              ],
              2
            ),
            t.createVNode(
              s,
              {
                'init-page': e.defaultIndex,
                'pagination-visible': !1,
                duration: e.animatedTime,
                'pagination-color': '#426543',
                onChange: e.changeTab,
                ref: 'nutuiSwiper',
                touchable: !e.noSwiping,
                direction: e.direction,
                class: 'tab-swiper'
              },
              {
                default: t.withCtx(() => [t.renderSlot(e.$slots, 'default')]),
                _: 3
              },
              8,
              ['init-page', 'duration', 'onChange', 'touchable', 'direction']
            )
          ],
          2
        )
      ])
    )
  }
  const { create: Zn } = o('tab-panel')
  var eo = Zn({
    props: { tabTitle: { type: String, default: '' } },
    setup(e, t) {}
  })
  eo.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-swiper-item')
    return (
      t.openBlock(),
      t.createBlock(r, null, {
        default: t.withCtx(() => [t.renderSlot(e.$slots, 'default')]),
        _: 3
      })
    )
  }
  const { create: to, componentName: no } = o('menu-item')
  var oo = to({
    props: {
      title: { type: String, default: '' },
      disabled: { type: Boolean, default: !1 },
      menuList: { type: Array, default: () => [] },
      autoClose: { type: Boolean, default: !0 },
      multiStyle: { type: [String, Number], default: 1 },
      maxHeight: { type: [String, Number], default: '' }
    },
    emits: ['change', 'menu-click'],
    setup(e, { emit: n }) {
      const o = t.ref(e.title),
        l = t.inject('menuRelation'),
        a = t.reactive(l),
        i = t.reactive({ showPanel: !1, currMenu: 0, showMask: !1 }),
        r = t.computed(() => {
          const t = no
          return { [t]: !0, disabled: e.disabled, [`${t}-active`]: i.showPanel }
        }),
        s = e => {
          const t = document.querySelectorAll('.nut-menu-active')[0]
          t &&
            i.showPanel &&
            (t.contains(e.target) ||
              ((i.showPanel = !1), (i.showMask = !1), a.handleMaskShow(!1)))
        }
      return (
        t.onMounted(() => {
          document.addEventListener(
            'mouseup',
            e => {
              s(e)
            },
            !1
          )
        }),
        t.onUnmounted(() => {
          document.removeEventListener('mouseup', e => {
            s(e)
          })
        }),
        __spreadProps(__spreadValues({ classes: r }, t.toRefs(i)), {
          handleMenuPanel: () => {
            n('menu-click', o.value),
              e.disabled ||
                ((i.showPanel = !i.showPanel),
                a.hasMask &&
                  ((i.showMask = !i.showMask), a.handleMaskShow(i.showPanel)))
          },
          checkMenus: (t, l) => {
            ;(o.value = t.value),
              (i.currMenu = l),
              e.autoClose &&
                ((i.showPanel = !1), (i.showMask = !1), a.handleMaskShow(!1)),
              n('change', t, o.value)
          },
          menuTitle: o
        })
      )
    }
  })
  t.pushScopeId('data-v-a76379ba')
  const lo = ['innerHTML'],
    ao = ['onClick']
  t.popScopeId(),
    (oo.render = function (e, n, o, l, a, i) {
      const r = t.resolveComponent('nut-popup'),
        s = t.resolveComponent('nut-icon')
      return (
        t.openBlock(),
        t.createElementBlock(
          'view',
          { class: t.normalizeClass(e.classes) },
          [
            t.createVNode(
              r,
              {
                visible: e.showMask,
                'onUpdate:visible': n[0] || (n[0] = t => (e.showMask = t))
              },
              null,
              8,
              ['visible']
            ),
            t.createElementVNode(
              'view',
              {
                class: 'nut-menu-title',
                onClick:
                  n[1] ||
                  (n[1] = (...t) =>
                    e.handleMenuPanel && e.handleMenuPanel(...t))
              },
              [
                t.createElementVNode(
                  'view',
                  { class: 'title-name', innerHTML: e.menuTitle },
                  null,
                  8,
                  lo
                ),
                t.createVNode(s, { 'class-prefix': 'icon' })
              ]
            ),
            t.createElementVNode(
              'view',
              {
                class: 'nut-menu-panel',
                style: t.normalizeStyle(`max-height:${e.maxHeight}px`)
              },
              [
                e.menuList && e.menuList.length
                  ? (t.openBlock(),
                    t.createElementBlock(
                      'view',
                      {
                        key: 0,
                        class: t.normalizeClass([
                          'menu-list',
                          [
                            { 'bubble-line': 2 == e.multiStyle },
                            { 'three-line': 3 == e.multiStyle }
                          ]
                        ])
                      },
                      [
                        (t.openBlock(!0),
                        t.createElementBlock(
                          t.Fragment,
                          null,
                          t.renderList(
                            e.menuList,
                            (n, o) => (
                              t.openBlock(),
                              t.createElementBlock(
                                'view',
                                {
                                  class: t.normalizeClass([
                                    'menu-option',
                                    { checked: e.currMenu === o }
                                  ]),
                                  key: o,
                                  onClick: t => e.checkMenus(n, o)
                                },
                                [
                                  e.currMenu === o
                                    ? (t.openBlock(),
                                      t.createBlock(s, {
                                        key: 0,
                                        class: 'check-icon',
                                        name: 'Check',
                                        size: '14px'
                                      }))
                                    : t.createCommentVNode('', !0),
                                  t.createTextVNode(
                                    t.toDisplayString(n.value),
                                    1
                                  )
                                ],
                                10,
                                ao
                              )
                            )
                          ),
                          128
                        ))
                      ],
                      2
                    ))
                  : t.createCommentVNode('', !0),
                t.renderSlot(e.$slots, 'default', {}, void 0, !0)
              ],
              4
            )
          ],
          2
        )
      )
    }),
    (oo.__scopeId = 'data-v-a76379ba')
  const { create: io } = o('tabbar')
  var ro = io({
    props: {
      visible: { type: [Number, String], default: 0 },
      bottom: { type: Boolean, default: !1 },
      type: { type: String, default: 'base' },
      size: { type: String, default: '20px' },
      unactiveColor: { type: String, default: '#000000' },
      activeColor: { type: String, default: '' }
    },
    emits: ['tab-switch', 'update:visible'],
    setup(e, { emit: n, slots: o }) {
      const l = t.reactive({ val: e.visible, children: [] })
      function a(e) {
        n('update:visible', e),
          (i.modelValue = e),
          n('tab-switch', i.children[e], e)
      }
      let i = t.reactive({
        children: l.children,
        size: e.size,
        modelValue: l.val,
        unactiveColor: e.unactiveColor,
        activeColor: e.activeColor,
        changeIndex: a
      })
      return (
        t.provide('parent', i),
        t.watch(
          () => e.visible,
          e => {
            i.modelValue = e
          }
        ),
        { changeIndex: a }
      )
    }
  })
  ro.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        {
          class: t.normalizeClass([
            'nut-tabbar',
            { 'nut-tabbar-bottom': e.bottom }
          ])
        },
        [t.renderSlot(e.$slots, 'default')],
        2
      )
    )
  }
  const { create: so } = o('tabbar-item')
  var co = so({
    props: {
      tabTitle: { type: String, default: '' },
      icon: { type: String, default: '' },
      href: { type: String, default: '' },
      num: { type: String, default: '' },
      activeImg: { type: String, default: '' },
      img: { type: String, default: '' },
      classPrefix: { type: String, default: 'nut-icon' },
      fontClassName: { type: String, default: 'nutui-iconfont' }
    },
    setup(e, n) {
      const o = t.inject('parent'),
        l = t.reactive({
          size: o.size,
          unactiveColor: o.unactiveColor,
          activeColor: o.activeColor,
          active: o.modelValue,
          index: 0
        })
      ;(e => {
        if (e.proxy) {
          let t = o.children.length
          l.index = t
          let n = Object.assign({}, e.proxy, { index: t })
          o.children.push(n)
        }
      })(t.getCurrentInstance())
      const a = t.computed(() => (o ? o.modelValue : null))
      return (
        t.watch(a, (e, t) => {
          ;(l.active = e),
            setTimeout(() => {
              o.children[e].href && (window.location.href = o.children[e].href)
            })
        }),
        {
          state: l,
          change: function (e) {
            o.changeIndex(e)
          }
        }
      )
    }
  })
  const uo = { class: 'nut-tabbar-item_icon-box' },
    po = {
      key: 0,
      class: 'nut-tabbar-item_icon-box_tips nut-tabbar-item_icon-box_num'
    },
    mo = {
      key: 1,
      class: 'nut-tabbar-item_icon-box_tips nut-tabbar-item_icon-box_nums'
    },
    ho = { key: 2 }
  co.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-icon')
    return (
      t.openBlock(),
      t.createElementBlock(
        'div',
        {
          class: t.normalizeClass([
            'nut-tabbar-item',
            {
              'nut-tabbar-item__icon--unactive': e.state.active != e.state.index
            }
          ]),
          style: t.normalizeStyle({
            color:
              e.state.active == e.state.index
                ? e.state.activeColor
                : e.state.unactiveColor
          }),
          onClick: n[0] || (n[0] = t => e.change(e.state.index))
        },
        [
          t.createElementVNode('view', uo, [
            e.num && e.num <= 99
              ? (t.openBlock(),
                t.createElementBlock('view', po, t.toDisplayString(e.num), 1))
              : e.num && e.num > 100
              ? (t.openBlock(),
                t.createElementBlock('view', mo, t.toDisplayString('99+')))
              : t.createCommentVNode('', !0),
            e.icon
              ? (t.openBlock(),
                t.createElementBlock('view', ho, [
                  t.createVNode(
                    r,
                    {
                      class: 'nut-tabbar-item_icon-box_icon',
                      size: e.state.size,
                      name: e.icon,
                      'font-class-name': e.fontClassName,
                      'class-prefix': e.classPrefix
                    },
                    null,
                    8,
                    ['size', 'name', 'font-class-name', 'class-prefix']
                  )
                ]))
              : t.createCommentVNode('', !0),
            !e.icon && e.activeImg
              ? (t.openBlock(),
                t.createElementBlock(
                  'div',
                  {
                    key: 3,
                    class: 'nut-tabbar-item_icon-box_icon',
                    style: t.normalizeStyle({
                      backgroundImage: `url(${
                        e.state.active == e.state.index ? e.activeImg : e.img
                      })`,
                      width: e.state.size,
                      height: e.state.size
                    })
                  },
                  null,
                  4
                ))
              : t.createCommentVNode('', !0),
            t.createElementVNode(
              'view',
              {
                class: t.normalizeClass([
                  'nut-tabbar-item_icon-box_nav-word',
                  {
                    'nut-tabbar-item_icon-box_big-word': !e.icon && !e.activeImg
                  }
                ])
              },
              t.toDisplayString(e.tabTitle),
              3
            )
          ])
        ],
        6
      )
    )
  }
  const { componentName: go, create: yo } = o('elevator')
  var fo = yo({
    props: {
      height: { type: [Number, String], default: '200px' },
      acceptKey: { type: [String], default: 'title' },
      indexList: { type: Array, default: () => [] }
    },
    emits: ['click-item', 'click-index'],
    setup(e, n) {
      const o = t.ref(null),
        l = t.reactive({
          anchorIndex: 0,
          listHeight: [],
          listGroup: [],
          touchState: { y1: 0, y2: 0 },
          scrollStart: !1,
          currentIndex: 0
        }),
        a = t.computed(() => ({ [go]: !0 })),
        i = e => {
          ;(e || 0 === e) &&
            (l.listHeight.length ||
              (() => {
                let e = 0
                l.listHeight.push(e)
                for (let t = 0; t < l.listGroup.length; t++)
                  (e += l.listGroup[t].clientHeight), l.listHeight.push(e)
              })(),
            e < 0 && (e = 0),
            e > l.listHeight.length - 2 && (e = l.listHeight.length - 2),
            (l.currentIndex = e),
            o.value.scrollTo(0, l.listHeight[e]))
        }
      return __spreadProps(__spreadValues({ classes: a }, t.toRefs(l)), {
        setListGroup: e => {
          t.nextTick(() => {
            l.listGroup.includes(e) || null == e || l.listGroup.push(e)
          })
        },
        listview: o,
        touchStart: e => {
          l.scrollStart = !0
          let t = ((n = e.target), (o = 'index'), n.getAttribute('data-' + o))
          var n, o
          let a = e.touches[0]
          ;(l.touchState.y1 = a.pageY),
            (l.anchorIndex = +t),
            (l.currentIndex = +t),
            console.log(l.currentIndex),
            i(+t)
        },
        touchMove: e => {
          let t = e.touches[0]
          l.touchState.y2 = t.pageY
          let n = ((l.touchState.y2 - l.touchState.y1) / 23) | 0
          ;(l.currentIndex = l.anchorIndex + n), i(l.currentIndex)
        },
        touchEnd: () => {
          ;(l.anchorIndex = 0),
            (l.listHeight = []),
            (l.listGroup = []),
            (l.currentIndex = 0),
            (l.scrollStart = !1),
            (l.touchState = { y1: 0, y2: 0 })
        },
        handleClickItem: (e, t) => {
          n.emit('click-item', e, t)
        },
        handleClickIndex: e => {
          n.emit('click-index', e)
        }
      })
    }
  })
  t.pushScopeId('data-v-0d62daa4')
  const vo = { class: 'nut-elevator__list__item__code' },
    ko = ['onClick'],
    bo = { class: 'nut-elevator__bars__inner' },
    wo = ['data-index', 'onClick']
  t.popScopeId(),
    (fo.render = function (e, n, o, l, a, i) {
      return (
        t.openBlock(),
        t.createElementBlock(
          'view',
          { class: t.normalizeClass(e.classes) },
          [
            t.createElementVNode(
              'view',
              {
                class: 'nut-elevator__list',
                ref: 'listview',
                style: t.normalizeStyle({
                  height: isNaN(+e.height) ? e.height : `${e.height}px`
                })
              },
              [
                (t.openBlock(!0),
                t.createElementBlock(
                  t.Fragment,
                  null,
                  t.renderList(
                    e.indexList,
                    n => (
                      t.openBlock(),
                      t.createElementBlock(
                        'view',
                        {
                          class: 'nut-elevator__list__item',
                          key: n[e.acceptKey],
                          ref: e.setListGroup
                        },
                        [
                          t.createElementVNode(
                            'view',
                            vo,
                            t.toDisplayString(n[e.acceptKey]),
                            1
                          ),
                          (t.openBlock(!0),
                          t.createElementBlock(
                            t.Fragment,
                            null,
                            t.renderList(
                              n.list,
                              o => (
                                t.openBlock(),
                                t.createElementBlock(
                                  'view',
                                  {
                                    class: 'nut-elevator__list__item__name',
                                    key: o.id,
                                    onClick: t =>
                                      e.handleClickItem(n[e.acceptKey], o)
                                  },
                                  t.toDisplayString(o.name),
                                  9,
                                  ko
                                )
                              )
                            ),
                            128
                          ))
                        ],
                        512
                      )
                    )
                  ),
                  128
                ))
              ],
              4
            ),
            e.indexList.length
              ? t.withDirectives(
                  (t.openBlock(),
                  t.createElementBlock(
                    'view',
                    { key: 0, class: 'nut-elevator__code--current' },
                    t.toDisplayString(e.indexList[e.currentIndex][e.acceptKey]),
                    513
                  )),
                  [[t.vShow, e.scrollStart]]
                )
              : t.createCommentVNode('', !0),
            t.createElementVNode(
              'view',
              {
                class: 'nut-elevator__bars',
                onTouchstart:
                  n[0] || (n[0] = (...t) => e.touchStart && e.touchStart(...t)),
                onTouchmove:
                  n[1] ||
                  (n[1] = t.withModifiers(
                    (...t) => e.touchMove && e.touchMove(...t),
                    ['stop', 'prevent']
                  )),
                onTouchend:
                  n[2] || (n[2] = (...t) => e.touchEnd && e.touchEnd(...t))
              },
              [
                t.createElementVNode('view', bo, [
                  (t.openBlock(!0),
                  t.createElementBlock(
                    t.Fragment,
                    null,
                    t.renderList(
                      e.indexList,
                      (n, o) => (
                        t.openBlock(),
                        t.createElementBlock(
                          'view',
                          {
                            class: 'nut-elevator__bars__inner__item',
                            'data-index': o,
                            key: n[e.acceptKey],
                            onClick: t => e.handleClickIndex(n[e.acceptKey])
                          },
                          t.toDisplayString(n[e.acceptKey]),
                          9,
                          wo
                        )
                      )
                    ),
                    128
                  ))
                ])
              ],
              32
            )
          ],
          2
        )
      )
    }),
    (fo.__scopeId = 'data-v-0d62daa4')
  const So = {
      isLeapYear: function (e) {
        return (e % 4 == 0 && e % 100 != 0) || e % 400 == 0
      },
      getWhatDay: function (e, t, n) {
        return [
          '星期日',
          '星期一',
          '星期二',
          '星期三',
          '星期四',
          '星期五',
          '星期六'
        ][new Date(e + '/' + t + '/' + n).getDay()]
      },
      getMonthPreDay: function (e, t) {
        let n = new Date(e + '/' + t + '/01').getDay()
        return 0 == n && (n = 7), n
      },
      getMonthDays: function (e, t) {
        return (
          /^0/.test(t) && (t = t.split('')[1]),
          [
            0,
            31,
            this.isLeapYear(Number(e)) ? 29 : 28,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31
          ][t]
        )
      },
      getNumTwoBit: function (e) {
        return ((e = Number(e)) > 9 ? '' : '0') + e
      },
      date2Str: function (e, t) {
        t = t || '-'
        return [
          e.getFullYear(),
          this.getNumTwoBit(e.getMonth() + 1),
          this.getNumTwoBit(e.getDate())
        ].join(t)
      },
      getDay: function (e) {
        e = e || 0
        let t = new Date()
        const n = 864e5 * e
        return (t = new Date(t.getTime() + n)), this.date2Str(t)
      },
      compareDate: function (e, t) {
        return !(
          new Date(e.replace('-', '/').replace('-', '/')) >=
          new Date(t.replace('-', '/').replace('-', '/'))
        )
      },
      isEqual: function (e, t) {
        return new Date(e).getTime() == new Date(t).getTime()
      }
    },
    { create: xo } = o('calendar-item')
  var Co = xo({
    props: {
      type: { type: String, default: 'one' },
      isAutoBackFill: { type: Boolean, default: !1 },
      poppable: { type: Boolean, default: !0 },
      title: { type: String, default: '日历选择' },
      defaultValue: { type: String, default: null },
      startDate: { type: String, default: So.getDay(0) },
      endDate: { type: String, default: So.getDay(365) }
    },
    emits: ['choose', 'update', 'close'],
    setup(e, { emit: n }) {
      const o = t.ref(['日', '一', '二', '三', '四', '五', '六']),
        l = t.ref(null),
        a = t.ref(null),
        i = t.ref(null),
        r = t.reactive({
          yearMonthTitle: '',
          currDate: '',
          unLoadPrev: !1,
          touchParams: {
            startY: 0,
            endY: 0,
            startTime: 0,
            endTime: 0,
            lastY: 0,
            lastTime: 0
          },
          transformY: 0,
          translateY: 0,
          scrollDistance: 0,
          defaultData: [],
          chooseData: [],
          monthsData: [],
          dayPrefix: 'calendar-month-day',
          startData: '',
          endData: '',
          isRange: 'range' === e.type,
          timer: 0
        }),
        s = e => e.split('-'),
        c = e => So.isEqual(r.currDate[0], e),
        u = (e, t, n) =>
          n
            ? t.curData[3] + '-' + t.curData[4] + '-' + So.getNumTwoBit(+e.day)
            : t.curData[0] + '-' + t.curData[1] + '-' + So.getNumTwoBit(+e.day),
        d = (t, n, o) => {
          const l = u(t, n, o)
          return 'curr' == t.type
            ? (!r.isRange && So.isEqual(r.currDate, l)) ||
              (r.isRange && (c(l) || (e => So.isEqual(r.currDate[1], e))(l)))
              ? `${r.dayPrefix}-active`
              : (e.startDate && So.compareDate(l, e.startDate)) ||
                (e.endDate && So.compareDate(e.endDate, l))
              ? `${r.dayPrefix}-disabled`
              : r.isRange &&
                Array.isArray(r.currDate) &&
                2 == Object.values(r.currDate).length &&
                So.compareDate(r.currDate[0], l) &&
                So.compareDate(l, r.currDate[1])
              ? `${r.dayPrefix}-choose`
              : null
            : `${r.dayPrefix}-disabled`
        },
        p = () => {
          ;((r.isRange && 2 == r.chooseData.length) || !r.isRange) &&
            (n('choose', r.chooseData), e.poppable && n('update'))
        },
        m = (t, n, o, l) => {
          if (d(t, n, l) != `${r.dayPrefix}-disabled`) {
            let a = [...n.curData]
            ;(a = l ? a.splice(3) : a.splice(0, 3)),
              (a[2] =
                'number' == typeof t.day ? So.getNumTwoBit(t.day) : t.day),
              (a[3] = `${a[0]}-${a[1]}-${a[2]}`),
              (a[4] = So.getWhatDay(+a[0], +a[1], +a[2])),
              r.isRange
                ? (2 == Object.values(r.currDate).length
                    ? (r.currDate = [a[3]])
                    : So.compareDate(r.currDate[0], a[3])
                    ? Array.isArray(r.currDate) && r.currDate.push(a[3])
                    : Array.isArray(r.currDate) && r.currDate.unshift(a[3]),
                  2 != r.chooseData.length && r.chooseData.length
                    ? So.compareDate(r.chooseData[3], a[3])
                      ? (r.chooseData = [[...r.chooseData], [...a]])
                      : (r.chooseData = [[...a], [...r.chooseData]])
                    : (r.chooseData = [...a]))
                : ((r.currDate = a[3]), (r.chooseData = [...a])),
              e.isAutoBackFill && !o && p()
          }
        },
        h = e => {
          const t =
            'prev' == e
              ? r.monthsData[0]
              : r.monthsData[r.monthsData.length - 1]
          let n = parseInt(t.curData[0]),
            o = parseInt(t.curData[1].toString().replace(/^0/, ''))
          switch (e) {
            case 'prev':
              1 == o && (n -= 1), (o = 1 == o ? 12 : --o)
              break
            case 'next':
              12 == o && (n += 1), (o = 12 == o ? 1 : ++o)
          }
          return [n, So.getNumTwoBit(o), So.getMonthDays(String(n), String(o))]
        },
        g = (e, t) => (
          'prev' == t && e >= 7 && (e -= 7),
          Array.from(Array(e), (e, n) => ({ day: n + 1, type: t }))
        ),
        y = (e, t) => {
          const n = So.getMonthPreDay(+e[0], +e[1]),
            o = So.getMonthDays(e[0], e[1]),
            l = {
              curData: e,
              title: `${e[0]}年${e[1]}月`,
              monthData: [...g(n, 'prev'), ...g(o, 'curr')]
            }
          'next' == t
            ? (r.endData &&
                So.compareDate(
                  `${r.endData[0]}-${r.endData[1]}-${So.getMonthDays(
                    r.endData[0],
                    r.endData[1]
                  )}`,
                  `${e[0]}-${e[1]}-${e[2]}`
                )) ||
              r.monthsData.push(l)
            : r.startData &&
              So.compareDate(
                `${e[0]}-${e[1]}-${e[2]}`,
                `${r.startData[0]}-${r.startData[1]}-01`
              )
            ? (r.unLoadPrev = !0)
            : r.monthsData.unshift(l)
        },
        f = () => {
          ;(r.startData = e.startDate ? s(e.startDate) : ''),
            (r.endData = e.endDate ? s(e.endDate) : ''),
            e.defaultValue
              ? (r.currDate = r.isRange ? [...e.defaultValue] : e.defaultValue)
              : (r.currDate = r.isRange
                  ? [So.date2Str(new Date()), So.getDay(1)]
                  : So.date2Str(new Date())),
            r.isRange && Array.isArray(r.currDate)
              ? (e.startDate &&
                  So.compareDate(r.currDate[0], e.startDate) &&
                  r.currDate.splice(0, 1, e.startDate),
                e.endDate &&
                  So.compareDate(e.endDate, r.currDate[1]) &&
                  r.currDate.splice(1, 1, e.endDate),
                (r.defaultData = [...s(r.currDate[0]), ...s(r.currDate[1])]))
              : (e.startDate && So.compareDate(r.currDate, e.startDate)
                  ? (r.currDate = e.startDate)
                  : e.endDate &&
                    !So.compareDate(r.currDate, e.endDate) &&
                    (r.currDate = e.endDate),
                (r.defaultData = [...s(r.currDate)])),
            y(r.defaultData, 'next'),
            (r.yearMonthTitle = r.monthsData[0].title)
          let t = 1
          do {
            y(h('next'), 'next')
          } while (t++ < 4)
          r.isRange
            ? (m({ day: r.defaultData[2], type: 'curr' }, r.monthsData[0], !0),
              m(
                { day: r.defaultData[5], type: 'curr' },
                r.monthsData[0],
                !0,
                !0
              ))
            : m({ day: r.defaultData[2], type: 'curr' }, r.monthsData[0], !0)
        },
        v = (e, t) =>
          r.isRange &&
          'curr' == e.type &&
          'calendar-month-day-active' == d(e, t),
        k = () => {
          if (!e.poppable) return !1
          Te(() => {
            if (
              (null == i ? void 0 : i.value) &&
              (null == a ? void 0 : a.value)
            ) {
              const e =
                  null == i ? void 0 : i.value.getBoundingClientRect().bottom,
                t = a.value.getElementsByClassName('calendar-month')
              for (let n = 0; n < t.length; n++)
                t[n].getBoundingClientRect().top <= e &&
                t[n].getBoundingClientRect().bottom >= e
                  ? (r.yearMonthTitle = r.monthsData[n].title)
                  : 0 === r.scrollDistance &&
                    (r.yearMonthTitle = r.monthsData[0].title)
            }
          })
        },
        b = (e = 0, t, n = 1e3) => {
          ;(null == a ? void 0 : a.value) &&
            ('end' === t
              ? ((a.value.style.webkitTransition = `transform ${n}ms cubic-bezier(0.19, 1, 0.22, 1)`),
                clearTimeout(r.timer),
                (r.timer = setTimeout(() => {
                  k()
                }, n)))
              : ((a.value.style.webkitTransition = ''), k()),
            (a.value.style.webkitTransform = `translateY(${e}px)`),
            (r.scrollDistance = e))
        },
        w = (e, t, n) => {
          var o, i
          let s = e + r.transformY
          const c = (null == (o = l.value) ? void 0 : o.offsetHeight) || 0,
            u = (null == (i = a.value) ? void 0 : i.offsetHeight) || 0
          'end' === t
            ? (s > 0 && (s = 0),
              s < 0 && s < -u + c && (s = -u + c),
              u <= c && 1 == r.monthsData.length && (s = 0),
              b(s, t, n))
            : (s > 0 && s > 100 && (s = 100),
              s < -u + c - 100 && r.monthsData.length > 1 && (s = -u + c - 100),
              s < 0 && s < -100 && 1 == r.monthsData.length && (s = -100),
              b(s))
        }
      return (
        f(),
        t.watch(
          () => e.defaultValue,
          e => {
            e &&
              (r.chooseData.splice(0),
              r.monthsData.splice(0),
              (r.scrollDistance = 0),
              (r.translateY = 0),
              b(r.scrollDistance),
              f())
          }
        ),
        __spreadValues(
          __spreadValues(
            {
              weeks: o,
              touchStart: e => {
                const t = e.changedTouches[0]
                ;(r.touchParams.startY = t.pageY),
                  (r.touchParams.startTime = e.timeStamp || Date.now()),
                  (r.transformY = r.scrollDistance)
              },
              touchMove: e => {
                const t = e.changedTouches[0]
                ;(r.touchParams.lastY = t.pageY),
                  (r.touchParams.lastTime = e.timeStamp || Date.now())
                const n = r.touchParams.lastY - r.touchParams.startY
                if (Math.abs(n) < 5) return !1
                w(n)
              },
              touchEnd: e => {
                var t, n
                const o = e.changedTouches[0]
                ;(r.touchParams.lastY = o.pageY),
                  (r.touchParams.lastTime = e.timeStamp || Date.now())
                let i = r.touchParams.lastY - r.touchParams.startY
                if (Math.abs(i) < 5) return !1
                const s = i + r.transformY,
                  c = (null == (t = l.value) ? void 0 : t.offsetHeight) || 0,
                  u = (null == (n = a.value) ? void 0 : n.offsetHeight) || 0
                s > 0
                  ? y(h('prev'), 'prev')
                  : s < 0 &&
                    s < -u + 5 * (Math.abs(i) > c ? Math.abs(i) : c) &&
                    (y(h('next'), 'next'),
                    Math.abs(i) >= 300 && y(h('next'), 'next'))
                let d = r.touchParams.lastTime - r.touchParams.startTime
                d <= 300 ? ((i *= 2), (d += 1e3), w(i, 'end', d)) : w(i, 'end')
              },
              getClass: d,
              isStartTip: (e, t) => !!v(e, t) && c(u(e, t)),
              isEndTip: (e, t) => v(e, t),
              chooseDay: m,
              isCurrDay: (e, t) => {
                const n = `${e.curData[0]}-${e.curData[1]}-${t}`
                return So.isEqual(n, So.date2Str(new Date()))
              },
              confirm: p,
              monthsPanel: a,
              months: l,
              weeksPanel: i
            },
            t.toRefs(r)
          ),
          t.toRefs(e)
        )
      )
    }
  })
  const Bo = { class: 'calendar-title' },
    No = { class: 'calendar-curr-month' },
    Eo = { class: 'calendar-weeks', ref: 'weeksPanel' },
    _o = { class: 'calendar-months-panel', ref: 'monthsPanel' },
    zo = { class: 'calendar-loading-tip' },
    To = { class: 'calendar-month-title' },
    Vo = { class: 'calendar-month-con' },
    Do = ['onClick'],
    Io = { class: 'calendar-day' },
    Mo = { key: 0, class: 'calendar-curr-tips' },
    Lo = { key: 1, class: 'calendar-day-tip' },
    Po = { key: 2, class: 'calendar-day-tip' },
    jo = { key: 0, class: 'nut-calendar-footer' }
  Co.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        {
          class: t.normalizeClass([
            'nut-calendar nut-calendar-taro',
            {
              'nut-calendar-tile': !e.poppable,
              'nut-calendar-nofooter': e.isAutoBackFill
            }
          ])
        },
        [
          t.createElementVNode(
            'view',
            {
              class: t.normalizeClass([
                'nut-calendar-header',
                { 'nut-calendar-header-tile': !e.poppable }
              ])
            },
            [
              e.poppable
                ? (t.openBlock(),
                  t.createElementBlock(
                    t.Fragment,
                    { key: 0 },
                    [
                      t.createElementVNode(
                        'view',
                        Bo,
                        t.toDisplayString(e.title),
                        1
                      ),
                      t.createElementVNode(
                        'view',
                        No,
                        t.toDisplayString(e.yearMonthTitle),
                        1
                      )
                    ],
                    64
                  ))
                : t.createCommentVNode('', !0),
              t.createElementVNode(
                'view',
                Eo,
                [
                  (t.openBlock(!0),
                  t.createElementBlock(
                    t.Fragment,
                    null,
                    t.renderList(
                      e.weeks,
                      (e, n) => (
                        t.openBlock(),
                        t.createElementBlock(
                          'view',
                          { class: 'calendar-week-item', key: n },
                          t.toDisplayString(e),
                          1
                        )
                      )
                    ),
                    128
                  ))
                ],
                512
              )
            ],
            2
          ),
          t.createElementVNode(
            'view',
            {
              class: 'nut-calendar-content',
              ref: 'months',
              onTouchstart:
                n[0] ||
                (n[0] = t.withModifiers(
                  (...t) => e.touchStart && e.touchStart(...t),
                  ['stop']
                )),
              onTouchmove:
                n[1] ||
                (n[1] = t.withModifiers(
                  (...t) => e.touchMove && e.touchMove(...t),
                  ['stop', 'prevent']
                )),
              onTouchend:
                n[2] ||
                (n[2] = t.withModifiers(
                  (...t) => e.touchEnd && e.touchEnd(...t),
                  ['stop']
                ))
            },
            [
              t.createElementVNode(
                'view',
                _o,
                [
                  t.createElementVNode(
                    'view',
                    zo,
                    t.toDisplayString(
                      e.unLoadPrev ? '没有更早月份' : '加载上一个月'
                    ),
                    1
                  ),
                  (t.openBlock(!0),
                  t.createElementBlock(
                    t.Fragment,
                    null,
                    t.renderList(
                      e.monthsData,
                      (n, o) => (
                        t.openBlock(),
                        t.createElementBlock(
                          'view',
                          { class: 'calendar-month', key: o },
                          [
                            t.createElementVNode(
                              'view',
                              To,
                              t.toDisplayString(n.title),
                              1
                            ),
                            t.createElementVNode('view', Vo, [
                              t.createElementVNode(
                                'view',
                                {
                                  class: t.normalizeClass([
                                    'calendar-month-item',
                                    'range' === e.type ? 'month-item-range' : ''
                                  ])
                                },
                                [
                                  (t.openBlock(!0),
                                  t.createElementBlock(
                                    t.Fragment,
                                    null,
                                    t.renderList(
                                      n.monthData,
                                      (o, l) => (
                                        t.openBlock(),
                                        t.createElementBlock(
                                          'view',
                                          {
                                            key: l,
                                            class: t.normalizeClass([
                                              'calendar-month-day',
                                              e.getClass(o, n)
                                            ]),
                                            onClick: t => e.chooseDay(o, n)
                                          },
                                          [
                                            t.createElementVNode(
                                              'view',
                                              Io,
                                              t.toDisplayString(
                                                'curr' == o.type ? o.day : ''
                                              ),
                                              1
                                            ),
                                            e.isCurrDay(n, o.day)
                                              ? (t.openBlock(),
                                                t.createElementBlock(
                                                  'view',
                                                  Mo,
                                                  '今天'
                                                ))
                                              : t.createCommentVNode('', !0),
                                            e.isStartTip(o, n)
                                              ? (t.openBlock(),
                                                t.createElementBlock(
                                                  'view',
                                                  Lo,
                                                  t.toDisplayString('开始')
                                                ))
                                              : e.isEndTip(o, n)
                                              ? (t.openBlock(),
                                                t.createElementBlock(
                                                  'view',
                                                  Po,
                                                  t.toDisplayString('结束')
                                                ))
                                              : t.createCommentVNode('', !0)
                                          ],
                                          10,
                                          Do
                                        )
                                      )
                                    ),
                                    128
                                  ))
                                ],
                                2
                              )
                            ])
                          ]
                        )
                      )
                    ),
                    128
                  ))
                ],
                512
              )
            ],
            544
          ),
          e.poppable && !e.isAutoBackFill
            ? (t.openBlock(),
              t.createElementBlock('view', jo, [
                t.createElementVNode(
                  'view',
                  {
                    class: 'calendar-confirm-btn',
                    onClick:
                      n[3] || (n[3] = (...t) => e.confirm && e.confirm(...t))
                  },
                  '确定'
                )
              ]))
            : t.createCommentVNode('', !0)
        ],
        2
      )
    )
  }
  const { create: $o } = o('calendar')
  var Ao = $o({
    components: { [Co.name]: Co },
    props: {
      type: { type: String, default: 'one' },
      isAutoBackFill: { type: Boolean, default: !1 },
      poppable: { type: Boolean, default: !0 },
      visible: { type: Boolean, default: !1 },
      title: { type: String, default: '日历选择' },
      defaultValue: { type: String },
      startDate: { type: String, default: So.getDay(0) },
      endDate: { type: String, default: So.getDay(365) }
    },
    emits: ['choose', 'close', 'update:visible'],
    setup(e, { emit: n }) {
      const o = t.ref(null),
        l = () => {
          n('close'), n('update:visible', !1)
        }
      return {
        closePopup: () => {
          l()
        },
        update: () => {
          n('update:visible', !1)
        },
        close: l,
        choose: e => {
          l(), n('choose', e)
        },
        calendarRef: o
      }
    }
  })
  Ao.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-calendar-item'),
      s = t.resolveComponent('nut-popup')
    return e.poppable
      ? (t.openBlock(),
        t.createBlock(
          s,
          {
            key: 0,
            visible: e.visible,
            position: 'bottom',
            round: '',
            closeable: !0,
            onClickOverlay: e.closePopup,
            onClickCloseIcon: e.closePopup
          },
          {
            default: t.withCtx(() => [
              t.createVNode(
                r,
                {
                  props: '',
                  ref: 'calendarRef',
                  type: e.type,
                  'is-auto-back-fill': e.isAutoBackFill,
                  poppable: e.poppable,
                  title: e.title,
                  'default-value': e.defaultValue,
                  'start-date': e.startDate,
                  'end-date': e.endDate,
                  onUpdate: e.update,
                  onClose: e.close,
                  onChoose: e.choose
                },
                null,
                8,
                [
                  'type',
                  'is-auto-back-fill',
                  'poppable',
                  'title',
                  'default-value',
                  'start-date',
                  'end-date',
                  'onUpdate',
                  'onClose',
                  'onChoose'
                ]
              )
            ]),
            _: 1
          },
          8,
          ['visible', 'onClickOverlay', 'onClickCloseIcon']
        ))
      : (t.openBlock(),
        t.createBlock(
          r,
          {
            key: 1,
            type: e.type,
            'is-auto-back-fill': e.isAutoBackFill,
            poppable: e.poppable,
            title: e.title,
            'default-value': e.defaultValue,
            'start-date': e.startDate,
            'end-date': e.endDate,
            onClose: e.close,
            onChoose: e.choose
          },
          null,
          8,
          [
            'type',
            'is-auto-back-fill',
            'poppable',
            'title',
            'default-value',
            'start-date',
            'end-date',
            'onClose',
            'onChoose'
          ]
        ))
  }
  const { create: Fo, componentName: Oo } = o('checkbox')
  var qo = Fo({
    components: { nutIcon: d },
    props: {
      modelValue: { type: Boolean, default: !1 },
      disabled: { type: Boolean, default: !1 },
      textPosition: { type: String, default: 'right' },
      iconSize: { type: [String, Number], default: '18' },
      iconName: { type: String, default: 'check-normal' },
      iconActiveName: { type: String, default: 'checked' },
      label: { type: String, default: '' }
    },
    emits: ['change', 'update:modelValue'],
    setup(e, { emit: n, slots: o }) {
      const l = t.inject('parent'),
        a = t.computed(() => !!l),
        i = t.computed(() =>
          a.value ? l.value.value.includes(e.label) : e.modelValue
        ),
        r = t.computed(() => (a.value ? l.disabled : e.disabled)),
        s = t.computed(() => !!e.modelValue),
        c = t.computed(() =>
          r.value
            ? 'nut-checkbox__icon--disable'
            : i.value
            ? 'nut-checkbox__icon'
            : 'nut-checkbox__icon--unchecked'
        ),
        u = () => {
          const { iconName: n, iconSize: o, iconActiveName: l } = e
          return t.h(d, { name: i.value ? l : n, size: o, class: c.value })
        },
        p = t => {
          var i, c, u
          if (
            !r.value &&
            ((c = !s.value),
            (u = null == (i = o.default) ? void 0 : i.call(o)[0].children),
            n('update:modelValue', c),
            n('change', c, u),
            a.value)
          ) {
            let t = l.value.value,
              { label: n } = e
            const o = t.indexOf(n)
            o > -1 ? t.splice(o, 1) : t.push(n), l.updateValue(t)
          }
        }
      return (
        t.onMounted(() => {
          a.value && l.relation(t.getCurrentInstance())
        }),
        () => {
          return t.h(
            'view',
            {
              class: `${Oo} ${
                'left' === e.textPosition ? `${Oo}--reverse` : ''
              }`,
              onClick: p
            },
            [
              u(),
              t.h(
                'view',
                {
                  class: `${Oo}__label ${
                    r.value ? `${Oo}__label--disabled` : ''
                  }`
                },
                null == (n = o.default) ? void 0 : n.call(o)
              )
            ]
          )
          var n
        }
      )
    }
  })
  qo.__scopeId = 'data-v-f8e0ec3c'
  const { create: Ro, componentName: Ho } = o('checkboxgroup')
  var Yo = Ro({
    props: {
      modelValue: { type: Array, default: () => [] },
      disabled: { type: Boolean, default: !1 }
    },
    emits: ['change', 'update:modelValue'],
    setup(e, { slots: n, emit: o }) {
      const l = t.reactive({ children: [] })
      return (
        t.provide('parent', {
          value: t.computed(() => e.modelValue),
          disabled: e.disabled,
          updateValue: e => {
            o('update:modelValue', e), o('change', e)
          },
          relation: e => {
            e.proxy && l.children.push(e.proxy)
          }
        }),
        t.watch(
          () => e.modelValue,
          e => {
            o('change', e)
          }
        ),
        Wt({
          toggleAll: e => {
            let t = []
            e &&
              l.children.forEach(e => {
                t.push(null == e ? void 0 : e.label)
              }),
              o('update:modelValue', t)
          }
        }),
        () => {
          var e
          return t.h(
            'view',
            { class: `${Ho}` },
            null == (e = n.default) ? void 0 : e.call(n)
          )
        }
      )
    }
  })
  const Wo = {
      listData: { type: Array, default: () => [] },
      readonly: { type: Boolean, default: !1 },
      visibleItemCount: { type: [Number, String], default: 7 },
      defaultIndex: { type: [Number, String], default: 0 },
      itemHeight: { type: [Number, String], default: 35 }
    },
    { create: Xo } = o('picker-column')
  function Uo(e, t, n) {
    return Math.min(Math.max(e, t), n)
  }
  function Ko(e) {
    return null !== (t = e) && 'object' == typeof t && e.disabled
    var t
  }
  var Go = Xo({
    props: __spreadValues({ dataType: String }, Wo),
    emits: ['click', 'change'],
    setup(e, { emit: n }) {
      const o = t.ref(),
        l = t.reactive({
          index: e.defaultIndex,
          offset: 0,
          duration: 0,
          options: e.listData,
          moving: !1,
          startOffset: 0,
          touchStartTime: 0,
          momentumOffset: 0,
          transitionEndTrigger: null
        }),
        a = Y(),
        i = t.computed(() => ({
          transform: `translate3d(0, ${l.offset + s()}px, 0)`,
          transitionDuration: `${l.duration}ms`,
          transitionProperty: l.duration ? 'all' : 'none'
        })),
        r = t => Uo(Math.round(-t / +e.itemHeight), 0, l.options.length - 1),
        s = () => (+e.itemHeight * (+e.visibleItemCount - 1)) / 2,
        c = (t, o = !1) => {
          const a =
              -(t =
                (e => {
                  for (
                    let t = (e = Uo(e, 0, l.options.length));
                    t < l.options.length;
                    t++
                  )
                    if (!Ko(l.options[t])) return t
                  for (let t = e - 1; t >= 0; t--)
                    if (!Ko(l.options[t])) return t
                })(t) || 0) * +e.itemHeight,
            i = () => {
              t !== l.index && ((l.index = t), o && n('change', t))
            }
          l.moving && a !== l.offset ? (l.transitionEndTrigger = i) : i(),
            (l.offset = a)
        }
      return (
        t.onMounted(() => {
          c(+e.defaultIndex)
        }),
        t.watch(
          () => e.listData,
          e => {
            e && (l.options = e)
          }
        ),
        t.watch(
          () => e.defaultIndex,
          e => {
            c(+e)
          }
        ),
        __spreadProps(__spreadValues({}, t.toRefs(l)), {
          wrapper: o,
          onTouchStart: t => {
            if (!e.readonly) {
              if ((a.start(t), l.moving)) {
                const e = (function (e) {
                  const t = window.getComputedStyle(e),
                    n = t.transform || t.webkitTransform,
                    o = n.slice(7, n.length - 1).split(', ')[5]
                  return Number(o)
                })(o.value)
                ;(l.offset = Math.min(0, e - s())), (l.startOffset = l.offset)
              } else l.startOffset = l.offset
              ;(l.duration = 0),
                (l.touchStartTime = Date.now()),
                (l.momentumOffset = l.startOffset),
                (l.transitionEndTrigger = null)
            }
          },
          onTouchMove: t => {
            if (e.readonly) return
            ;(l.moving = !0),
              a.move(t),
              a.isVertical() &&
                ((l.moving = !0),
                (function (e, t) {
                  ;('boolean' != typeof e.cancelable || e.cancelable) &&
                    e.preventDefault(),
                    t &&
                      (function (e) {
                        e.stopPropagation()
                      })(e)
                })(t, !0))
            l.startOffset + a.deltaY.value > e.itemHeight
              ? (l.offset = e.itemHeight)
              : (l.offset = l.startOffset + a.deltaY.value)
            const n = Date.now()
            n - l.touchStartTime > 300 &&
              ((l.touchStartTime = n), (l.momentumOffset = l.offset))
          },
          onTouchEnd: () => {
            const e = r(l.offset)
            ;(l.duration = 200), c(e, !0)
            const t = l.offset - l.momentumOffset,
              n = Date.now() - l.touchStartTime
            n < 300 &&
              Math.abs(t) > 15 &&
              ((e, t) => {
                const n = Math.abs(e / t)
                e = l.offset + (n / 0.03) * (e < 0 ? -1 : 1)
                const o = r(e)
                c(o, !0)
              })(t, n)
          },
          wrapperStyle: i,
          stopMomentum: () => {
            ;(l.moving = !1),
              (l.duration = 0),
              l.transitionEndTrigger &&
                (l.transitionEndTrigger(), (l.transitionEndTrigger = null))
          },
          columns: l.options,
          height: Number(e.visibleItemCount) * +e.itemHeight
        })
      )
    }
  })
  Go.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        {
          class: 'nut-picker__content',
          style: t.normalizeStyle({ height: e.height + 'px' }),
          onTouchstart:
            n[0] || (n[0] = (...t) => e.onTouchStart && e.onTouchStart(...t)),
          onTouchmove:
            n[1] || (n[1] = (...t) => e.onTouchMove && e.onTouchMove(...t)),
          onTouchend:
            n[2] || (n[2] = (...t) => e.onTouchEnd && e.onTouchEnd(...t)),
          onTouchcancel:
            n[3] || (n[3] = (...t) => e.onTouchEnd && e.onTouchEnd(...t)),
          onTransitionend:
            n[4] || (n[4] = (...t) => e.stopMomentum && e.stopMomentum(...t))
        },
        [
          t.createElementVNode(
            'view',
            {
              class: 'nut-picker__wrapper',
              ref: 'wrapper',
              style: t.normalizeStyle(e.wrapperStyle)
            },
            [
              (t.openBlock(!0),
              t.createElementBlock(
                t.Fragment,
                null,
                t.renderList(
                  e.options,
                  (n, o) => (
                    t.openBlock(),
                    t.createElementBlock(
                      'view',
                      { class: 'nut-picker__item', key: o },
                      t.toDisplayString('cascade' === e.dataType ? n.text : n),
                      1
                    )
                  )
                ),
                128
              ))
            ],
            4
          )
        ],
        36
      )
    )
  }
  const { create: Jo, componentName: Qo } = o('picker')
  var Zo = Jo({
    components: { [Go.name]: Go, [le.name]: le },
    props: __spreadValues(
      __spreadProps(__spreadValues({}, oe), {
        title: { type: String, default: '' },
        cancelText: { type: String, default: '取消' },
        okText: { type: String, default: '确定' }
      }),
      Wo
    ),
    emits: ['close', 'change', 'confirm', 'update:visible'],
    setup(e, { emit: n }) {
      const o = t.reactive({
        show: !1,
        formattedColumns: e.listData,
        defaultIndex: e.defaultIndex
      })
      let l = e.defaultIndex,
        a = []
      const i = t.computed(() => ({ [Qo]: !0 })),
        r = t.computed(
          () => (Number(+e.visibleItemCount - 1) / 2) * +e.itemHeight
        ),
        s = t.computed(() => Number(e.visibleItemCount) * +e.itemHeight),
        c = t.computed(() => {
          const t = o.formattedColumns[0]
          if ('object' == typeof t) {
            if (t.children) return 'cascade'
            if (null == t ? void 0 : t.values)
              return d(e.listData), 'multipleColumns'
          }
          return 'text'
        }),
        u = t.computed(() =>
          'text' === c.value
            ? [{ values: o.formattedColumns, defaultIndex: o.defaultIndex }]
            : 'multipleColumns' === c.value
            ? o.formattedColumns
            : 'cascade' === c.value
            ? p(o.formattedColumns, o.defaultIndex)
            : o.formattedColumns
        ),
        d = e => {
          ;(a = []),
            e.forEach(e => {
              a.push(e.defaultIndex || 0)
            })
        },
        p = (e, t) => {
          const n = []
          let o = e
          for (o.defaultIndex = t; o; )
            n.push({ values: o, defaultIndex: o.defaultIndex || 0 }),
              (o = null == o ? void 0 : o[o.defaultIndex || 0].children)
          return d(n), n
        }
      return (
        t.watch(
          () => e.visible,
          e => {
            o.show = e
          }
        ),
        t.watch(
          () => e.listData,
          e => {
            o.formattedColumns = e
          }
        ),
        __spreadProps(__spreadValues({ classes: i }, t.toRefs(o)), {
          column: Go,
          dataType: c,
          columnList: u,
          top: r,
          height: s,
          close: () => {
            n('close'), n('update:visible', !1)
          },
          changeHandler: (e, i) => {
            if ('cascade' === c.value) {
              let t = o.formattedColumns
              0 === e && (o.defaultIndex = i)
              let n = 0
              for (; t; )
                n === e ? (t.defaultIndex = i) : n > e && (t.defaultIndex = 0),
                  (t = t[t.defaultIndex || 0].children),
                  n++
            } else if ('text' === c.value) l = i
            else if ('multipleColumns' === c.value) {
              a[e] = i
              const l = a.map(
                (e, n) => t.toRaw(o.formattedColumns)[n].values[e]
              )
              n('change', l)
            }
          },
          confirm: () => {
            if ('text' === c.value)
              (o.defaultIndex = l), n('confirm', o.formattedColumns[l])
            else if ('multipleColumns' === c.value) {
              for (let t = 0; t < a.length; t++)
                o.formattedColumns[t].defaultIndex = a[t]
              const e = t
                .toRaw(o.formattedColumns)
                .map(e => e.values && e.values[e.defaultIndex])
              n('confirm', e)
            } else
              'cascade' === c.value &&
                n(
                  'confirm',
                  ((e, t) => {
                    var n
                    let o = e
                    o.defaultIndex = t
                    const l = []
                    for (; o; ) {
                      const e = o[null != (n = o.defaultIndex) ? n : 0]
                      l.push(e.text), (o = e.children)
                    }
                    return l
                  })(t.toRaw(o.formattedColumns), o.defaultIndex)
                )
            n('update:visible', !1)
          }
        })
      )
    }
  })
  const el = { class: 'nut-picker__bar' },
    tl = { class: 'nut-picker__column' }
  Zo.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-picker-column'),
      s = t.resolveComponent('nut-popup')
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        { class: t.normalizeClass(e.classes) },
        [
          t.createVNode(
            s,
            {
              position: 'bottom',
              style: t.normalizeStyle({ height: e.height + 56 + 'px' }),
              visible: e.show,
              'onUpdate:visible': n[2] || (n[2] = t => (e.show = t)),
              teleport: e.teleport,
              'lock-scroll': e.lockScroll,
              'close-on-click-overlay': e.closeOnClickOverlay,
              onClose: e.close
            },
            {
              default: t.withCtx(() => [
                t.createElementVNode('view', el, [
                  t.createElementVNode(
                    'view',
                    {
                      class: 'nut-picker__left nut-picker__button',
                      onClick:
                        n[0] || (n[0] = (...t) => e.close && e.close(...t))
                    },
                    t.toDisplayString(e.cancelText),
                    1
                  ),
                  t.createElementVNode(
                    'view',
                    null,
                    t.toDisplayString(e.title),
                    1
                  ),
                  t.createElementVNode(
                    'view',
                    {
                      class: 'nut-picker__button',
                      onClick: n[1] || (n[1] = t => e.confirm())
                    },
                    t.toDisplayString(e.okText),
                    1
                  )
                ]),
                t.createElementVNode('view', tl, [
                  t.createElementVNode(
                    'view',
                    {
                      class: 'nut-picker__mask',
                      style: t.normalizeStyle({
                        backgroundSize: `100% ${e.top}px`
                      })
                    },
                    null,
                    4
                  ),
                  t.createElementVNode(
                    'view',
                    {
                      class: 'nut-picker__hairline',
                      style: t.normalizeStyle({ top: ` ${e.top}px` })
                    },
                    null,
                    4
                  ),
                  (t.openBlock(!0),
                  t.createElementBlock(
                    t.Fragment,
                    null,
                    t.renderList(
                      e.columnList,
                      (n, o) => (
                        t.openBlock(),
                        t.createElementBlock(
                          'view',
                          { class: 'nut-picker__columnitem', key: o },
                          [
                            t.createVNode(
                              r,
                              {
                                'list-data': n.values,
                                readonly: e.readonly,
                                'default-index': n.defaultIndex,
                                'visible-item-count': e.visibleItemCount,
                                'item-height': e.itemHeight,
                                'data-type': e.dataType,
                                onChange: t => {
                                  e.changeHandler(o, t)
                                }
                              },
                              null,
                              8,
                              [
                                'list-data',
                                'readonly',
                                'default-index',
                                'visible-item-count',
                                'item-height',
                                'data-type',
                                'onChange'
                              ]
                            )
                          ]
                        )
                      )
                    ),
                    128
                  ))
                ])
              ]),
              _: 1
            },
            8,
            [
              'style',
              'visible',
              'teleport',
              'lock-scroll',
              'close-on-click-overlay',
              'onClose'
            ]
          )
        ],
        2
      )
    )
  }
  const { componentName: nl, create: ol } = o('datepicker'),
    ll = new Date().getFullYear()
  function al(e) {
    return (
      '[object Date]' === Object.prototype.toString.call(e) &&
      !isNaN(e.getTime())
    )
  }
  const il = {
    day: '日',
    year: '年',
    month: '月',
    hour: '时',
    minute: '分',
    seconds: '秒'
  }
  var rl = ol({
    components: { [Zo.name]: Zo },
    props: {
      modelValue: null,
      visible: { type: Boolean, default: !1 },
      title: { type: String, default: '' },
      type: { type: String, default: 'date' },
      isShowChinese: { type: Boolean, default: !0 },
      minuteStep: { type: Number, default: 1 },
      minDate: {
        type: Date,
        default: () => new Date(ll - 10, 0, 1),
        validator: al
      },
      maxDate: {
        type: Date,
        default: () => new Date(ll + 10, 11, 31),
        validator: al
      }
    },
    emits: ['click', 'update:visible', 'confirm'],
    setup(e, { emit: n }) {
      const o = t.reactive({
          show: !1,
          currentDate: new Date(),
          title: e.title
        }),
        l = t => {
          al(t) || (t = e.minDate)
          let n = Math.max(t.getTime(), e.minDate.getTime())
          return (n = Math.min(n, e.maxDate.getTime())), new Date(n)
        }
      function a(e, t) {
        return 32 - new Date(e, t - 1, 32).getDate()
      }
      const i = (t, n) => {
          const o = e[`${t}Date`],
            l = o.getFullYear()
          let i = 1,
            r = 1,
            s = 0,
            c = 0
          'max' === t &&
            ((i = 12),
            (r = a(n.getFullYear(), n.getMonth() + 1)),
            (s = 23),
            (c = 59))
          const u = c
          return (
            n.getFullYear() === l &&
              ((i = o.getMonth() + 1),
              n.getMonth() + 1 === i &&
                ((r = o.getDate()),
                n.getDate() === r &&
                  ((s = o.getHours()),
                  n.getHours() === s && (c = o.getMinutes())))),
            {
              [`${t}Year`]: l,
              [`${t}Month`]: i,
              [`${t}Date`]: r,
              [`${t}Hour`]: s,
              [`${t}Minute`]: c,
              [`${t}Seconds`]: u
            }
          )
        },
        r = t.computed(() => {
          const {
              maxYear: t,
              maxDate: n,
              maxMonth: l,
              maxHour: a,
              maxMinute: r,
              maxSeconds: s
            } = i('max', o.currentDate),
            {
              minYear: c,
              minDate: u,
              minMonth: d,
              minHour: p,
              minMinute: m,
              minSeconds: h
            } = i('min', o.currentDate)
          let g = [
            { type: 'year', range: [c, t] },
            { type: 'month', range: [d, l] },
            { type: 'day', range: [u, n] },
            { type: 'hour', range: [p, a] },
            { type: 'minute', range: [m, r] },
            { type: 'seconds', range: [h, s] }
          ]
          switch (e.type) {
            case 'date':
              g = g.slice(0, 3)
              break
            case 'datetime':
              g = g.slice(0, 5)
              break
            case 'time':
              g = g.slice(3, 6)
              break
            case 'month-day':
              g = g.slice(1, 3)
              break
            case 'datehour':
              g = g.slice(0, 4)
          }
          return g
        }),
        s = t.computed(() =>
          r.value.map(t => {
            return ((t, n, o, l) => {
              if (!(n > t)) return
              const a = []
              let i = 0
              for (; t <= n; )
                e.isShowChinese ? a.push(t + il[l]) : a.push(t),
                  'minute' === l ? (t += e.minuteStep) : t++,
                  t <= o && i++
              return { values: a, defaultIndex: i }
            })(
              t.range[0],
              t.range[1],
              'year' === (n = t.type)
                ? o.currentDate.getFullYear()
                : 'month' === n
                ? o.currentDate.getMonth() + 1
                : 'day' === n
                ? o.currentDate.getDate()
                : 'hour' === n
                ? o.currentDate.getHours()
                : 'minute' === n
                ? o.currentDate.getMinutes()
                : 'seconds' === n
                ? o.currentDate.getSeconds()
                : 0,
              t.type
            )
            var n
          })
        )
      return (
        t.onMounted(() => {
          o.currentDate = l(e.modelValue)
        }),
        t.watch(
          () => e.title,
          e => {
            o.title = e
          }
        ),
        t.watch(
          () => e.visible,
          e => {
            o.show = e
          }
        ),
        __spreadProps(__spreadValues({}, t.toRefs(o)), {
          changeHandler: t => {
            if (['date', 'datetime'].includes(e.type)) {
              let n = []
              ;(n = e.isShowChinese
                ? t.map(e => Number(e.slice(0, e.length - 1)))
                : t),
                'date' === e.type
                  ? (o.currentDate = l(
                      new Date(n[0], n[1] - 1, Math.min(n[2], a(n[0], n[1])))
                    ))
                  : 'datetime' === e.type &&
                    (o.currentDate = l(
                      new Date(
                        n[0],
                        n[1] - 1,
                        Math.min(n[2], a(n[0], n[1])),
                        n[3],
                        n[4]
                      )
                    ))
            }
          },
          closeHandler: () => {
            n('update:visible', !1)
          },
          confirm: e => {
            n('update:visible', !1), n('confirm', e)
          },
          columns: s
        })
      )
    }
  })
  rl.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-picker')
    return (
      t.openBlock(),
      t.createBlock(
        r,
        {
          visible: e.show,
          onClose: e.closeHandler,
          'list-data': e.columns,
          onChange: e.changeHandler,
          title: e.title,
          onConfirm: e.confirm
        },
        null,
        8,
        ['visible', 'onClose', 'list-data', 'onChange', 'title', 'onConfirm']
      )
    )
  }
  const { componentName: sl, create: cl } = o('inputnumber')
  var ul = cl({
    props: {
      modelValue: { type: [Number, String], default: 0 },
      inputWidth: { type: [Number, String], default: '' },
      buttonSize: { type: [Number, String], default: '' },
      min: { type: [Number, String], default: 1 },
      max: { type: [Number, String], default: 9999 },
      step: { type: [Number, String], default: 1 },
      decimalPlaces: { type: [Number, String], default: 0 },
      disabled: { type: Boolean, default: !1 },
      readonly: { type: Boolean, default: !1 }
    },
    emits: [
      'update:modelValue',
      'change',
      'blur',
      'focus',
      'reduce',
      'add',
      'overlimit'
    ],
    setup(e, { emit: n }) {
      const o = t.computed(() => ({
          [sl]: !0,
          [`${sl}--disabled`]: e.disabled
        })),
        l = (t, o) => {
          let l = Number(t).toFixed(Number(e.decimalPlaces))
          n('change', l, o), n('update:modelValue', l, o)
        },
        a = (t = Number(e.modelValue)) => t < Number(e.max) && !e.disabled,
        i = (t = Number(e.modelValue)) => t > Number(e.min) && !e.disabled
      return {
        classes: o,
        change: e => {
          const t = e.target
          n('update:modelValue', t.valueAsNumber, e)
        },
        blur: t => {
          if (e.disabled) return
          if (e.readonly) return
          let o = t.target.valueAsNumber
          o < Number(e.min)
            ? (o = Number(e.min))
            : o > Number(e.max) && (o = Number(e.max)),
            l(o, t),
            n('blur', t)
        },
        focus: t => {
          e.disabled || e.readonly || n('focus', t)
        },
        add: t => {
          if ((n('add', t), a())) {
            let n = Number(e.modelValue) + Number(e.step)
            l(n, t)
          } else n('overlimit', t)
        },
        addAllow: a,
        reduce: t => {
          if ((n('reduce', t), i())) {
            let n = Number(e.modelValue) - Number(e.step)
            l(n, t)
          } else n('overlimit', t)
        },
        reduceAllow: i,
        pxCheck: s
      }
    }
  })
  const dl = ['min', 'max', 'disabled', 'readonly', 'value']
  function pl(e, t, n) {
    const o = e.indexOf(t)
    return -1 === o
      ? e
      : '-' === t && 0 !== o
      ? e.slice(0, o)
      : e.slice(0, o + 1) + e.slice(o).replace(n, '')
  }
  function ml(e, t = !0, n = !0) {
    e = t ? pl(e, '.', /\./g) : e.replace(/\./g, '')
    const o = t ? /[^-0-9.]/g : /[^-0-9]/g
    return (e = n ? pl(e, '-', /-/g) : e.replace(/-/, '')).replace(o, '')
  }
  ul.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-icon')
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        {
          class: t.normalizeClass(e.classes),
          style: t.normalizeStyle({ height: e.pxCheck(e.buttonSize) })
        },
        [
          t.createVNode(
            r,
            {
              name: 'minus',
              class: t.normalizeClass([
                'nut-inputnumber__icon',
                { 'nut-inputnumber__icon--disabled': !e.reduceAllow() }
              ]),
              size: e.buttonSize,
              onClick: e.reduce
            },
            null,
            8,
            ['class', 'size', 'onClick']
          ),
          t.createElementVNode(
            'input',
            {
              type: 'number',
              min: e.min,
              max: e.max,
              style: t.normalizeStyle({ width: e.pxCheck(e.inputWidth) }),
              disabled: e.disabled,
              readonly: e.readonly,
              value: e.modelValue,
              onInput: n[0] || (n[0] = (...t) => e.change && e.change(...t)),
              onBlur: n[1] || (n[1] = (...t) => e.blur && e.blur(...t)),
              onFocus: n[2] || (n[2] = (...t) => e.focus && e.focus(...t))
            },
            null,
            44,
            dl
          ),
          t.createVNode(
            r,
            {
              name: 'plus',
              class: t.normalizeClass([
                'nut-inputnumber__icon',
                { 'nut-inputnumber__icon--disabled': !e.addAllow() }
              ]),
              size: e.buttonSize,
              onClick: e.add
            },
            null,
            8,
            ['class', 'size', 'onClick']
          )
        ],
        6
      )
    )
  }
  const { componentName: hl, create: gl } = o('input')
  var yl = gl({
    props: {
      type: { type: String, default: 'text' },
      modelValue: { type: [String, Number], default: '' },
      placeholder: { type: String, default: '请输入信息' },
      label: { type: String, default: '' },
      requireShow: { type: Boolean, default: !1 },
      disabled: { type: Boolean, default: !1 },
      readonly: { type: Boolean, default: !1 },
      textAlign: { type: String, default: 'left' },
      maxLength: { type: [String, Number], default: '' },
      clearable: { type: Boolean, default: !0 }
    },
    emits: ['change', 'update:modelValue', 'blur', 'focus', 'clear'],
    setup(e, { emit: n }) {
      const o = t.ref(!1),
        l = t.computed(() => ({ [hl]: !0, [`${hl}-disabled`]: e.disabled })),
        a = t.computed(() => ({ textAlign: e.textAlign }))
      return {
        active: o,
        classes: l,
        styles: a,
        valueChange: t => {
          let o = t.target.value
          'digit' === e.type && (o = ml(o, !0)),
            'number' === e.type && (o = ml(o, !1)),
            e.maxLength &&
              o.length > Number(e.maxLength) &&
              (o = o.slice(0, Number(e.maxLength))),
            n('update:modelValue', o, t),
            n('change', o, t)
        },
        valueFocus: e => {
          let t = e.target.value
          ;(o.value = !0), n('focus', t, e)
        },
        valueBlur: t => {
          setTimeout(() => {
            o.value = !1
          }, 0)
          let l = t.target.value
          e.maxLength &&
            l.length > Number(e.maxLength) &&
            (l = l.slice(0, Number(e.maxLength))),
            n('blur', l, t)
        },
        handleClear: e => {
          n('change', '', e), n('update:modelValue', '', e)
        }
      }
    }
  })
  const fl = { class: 'nut-input-label' },
    vl = { key: 0, class: 'nut-input-require' },
    kl = { key: 1, class: 'label-string' },
    bl = ['type', 'maxlength', 'placeholder', 'disabled', 'readonly', 'value']
  yl.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-icon')
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        { class: t.normalizeClass(e.classes) },
        [
          t.createElementVNode('view', fl, [
            e.requireShow
              ? (t.openBlock(), t.createElementBlock('view', vl, '*'))
              : t.createCommentVNode('', !0),
            e.label
              ? (t.openBlock(),
                t.createElementBlock('view', kl, t.toDisplayString(e.label), 1))
              : t.createCommentVNode('', !0)
          ]),
          t.createElementVNode(
            'input',
            {
              class: 'input-text',
              style: t.normalizeStyle(e.styles),
              type: e.type,
              maxlength: e.maxLength,
              placeholder: e.placeholder,
              disabled: e.disabled,
              readonly: e.readonly,
              value: e.modelValue,
              onInput:
                n[0] || (n[0] = (...t) => e.valueChange && e.valueChange(...t)),
              onFocus:
                n[1] || (n[1] = (...t) => e.valueFocus && e.valueFocus(...t)),
              onBlur:
                n[2] || (n[2] = (...t) => e.valueBlur && e.valueBlur(...t))
            },
            null,
            44,
            bl
          ),
          e.clearable && !e.readonly
            ? t.withDirectives(
                (t.openBlock(),
                t.createElementBlock(
                  'view',
                  {
                    key: 0,
                    onClick:
                      n[3] ||
                      (n[3] = (...t) => e.handleClear && e.handleClear(...t)),
                    class: 'nut-textinput-clear'
                  },
                  [t.createVNode(r, { name: 'close-little', size: '12px' })],
                  512
                )),
                [[t.vShow, e.active && e.modelValue.length > 0]]
              )
            : t.createCommentVNode('', !0)
        ],
        2
      )
    )
  }
  const { componentName: wl, create: Sl } = o('radio')
  var xl = Sl({
    props: {
      disabled: { type: Boolean, default: !1 },
      label: { type: String, default: '' },
      iconName: { type: String, default: 'check-normal' },
      iconActiveName: { type: String, default: 'check-checked' },
      iconSize: { type: [String, Number], default: 18 }
    },
    setup(e, { emit: n, slots: o }) {
      let l = t.inject('parent')
      const a = t.computed(() => l.label.value === e.label),
        i = t.computed(() =>
          e.disabled
            ? 'nut-radio__icon--disable'
            : a.value
            ? 'nut-radio__icon'
            : 'nut-radio__icon--unchecked'
        ),
        r = t.computed(() => l.position),
        s = () => {
          const { iconName: n, iconSize: o, iconActiveName: l } = e
          return t.h(d, { name: a.value ? l : n, size: o, class: i.value })
        },
        c = () => {
          a.value || e.disabled || l.updateValue(e.label)
        }
      return () => {
        return t.h(
          'view',
          {
            class: `${wl} ${'left' === r.value ? `${wl}--reverse` : ''}`,
            onClick: c
          },
          [
            s(),
            t.h(
              'view',
              {
                class: `${wl}__label ${
                  e.disabled ? `${wl}__label--disabled` : ''
                }`
              },
              null == (n = o.default) ? void 0 : n.call(o)
            )
          ]
        )
        var n
      }
    }
  })
  const { componentName: Cl, create: Bl } = o('radiogroup')
  var Nl = Bl({
    props: {
      modelValue: { type: [Number, String, Boolean], default: '' },
      textPosition: { type: String, default: 'right' }
    },
    emits: ['change', 'update:modelValue'],
    setup: (e, { emit: n, slots: o }) => (
      t.provide('parent', {
        label: t.readonly(t.computed(() => e.modelValue)),
        position: e.textPosition,
        updateValue: e => n('update:modelValue', e)
      }),
      t.watch(
        () => e.modelValue,
        e => n('change', e)
      ),
      () => {
        var e
        return t.h(
          'view',
          { class: `${Cl}` },
          null == (e = o.default) ? void 0 : e.call(o)
        )
      }
    )
  })
  const { componentName: El, create: _l } = o('rate')
  var zl = _l({
    props: {
      count: { type: [String, Number], default: 5 },
      modelValue: { type: [String, Number], default: 0 },
      iconSize: { type: [String, Number], default: 18 },
      activeColor: { type: String, default: '' },
      voidColor: { type: String, default: '' },
      uncheckedIcon: { type: String, default: 'star-n' },
      checkedIcon: { type: String, default: 'star-fill-n' },
      readonly: { type: Boolean, default: !1 },
      disabled: { type: Boolean, default: !1 },
      allowHalf: { type: Boolean, default: !1 },
      spacing: { type: [String, Number], default: 14 }
    },
    emits: ['update:modelValue', 'change'],
    setup: (e, { emit: n }) => ({
      classes: t.computed(() => ({ [El]: !0 })),
      onClick: (t, o) => {
        if ((t.preventDefault(), t.stopPropagation(), e.disabled || e.readonly))
          return
        let l = 0
        ;(1 === o && e.modelValue === o) ||
          ((l = o),
          e.allowHalf &&
            (null == t ? void 0 : t.target).className.includes(
              '__icon--half'
            ) &&
            (l -= 0.5)),
          n('update:modelValue', l),
          n('change', l)
      },
      pxCheck: s
    })
  })
  const Tl = ['onClick']
  zl.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-icon')
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        { class: t.normalizeClass(e.classes) },
        [
          (t.openBlock(!0),
          t.createElementBlock(
            t.Fragment,
            null,
            t.renderList(
              e.count,
              n => (
                t.openBlock(),
                t.createElementBlock(
                  'view',
                  {
                    class: 'nut-rate-item',
                    key: n,
                    onClick: t => e.onClick(t, n),
                    style: t.normalizeStyle({
                      marginRight: e.pxCheck(e.spacing)
                    })
                  },
                  [
                    t.createVNode(
                      r,
                      {
                        size: e.iconSize,
                        class: t.normalizeClass([
                          'nut-rate-item__icon',
                          {
                            'nut-rate-item__icon--disabled':
                              e.disabled || n > e.modelValue
                          }
                        ]),
                        color: n <= e.modelValue ? e.activeColor : e.voidColor,
                        name:
                          n <= e.modelValue ? e.checkedIcon : e.uncheckedIcon
                      },
                      null,
                      8,
                      ['size', 'class', 'color', 'name']
                    ),
                    e.allowHalf && e.modelValue + 1 > n
                      ? (t.openBlock(),
                        t.createBlock(
                          r,
                          {
                            key: 0,
                            class:
                              'nut-rate-item__icon nut-rate-item__icon--half',
                            color:
                              n <= e.modelValue ? e.activeColor : e.voidColor,
                            size: e.iconSize,
                            name: e.checkedIcon
                          },
                          null,
                          8,
                          ['color', 'size', 'name']
                        ))
                      : e.allowHalf && e.modelValue + 1 < n
                      ? (t.openBlock(),
                        t.createBlock(
                          r,
                          {
                            key: 1,
                            class:
                              '\n          nut-rate-item__icon\n          nut-rate-item__icon--disabled\n          nut-rate-item__icon--half\n        ',
                            color: e.voidColor,
                            size: e.iconSize,
                            name: e.uncheckedIcon
                          },
                          null,
                          8,
                          ['color', 'size', 'name']
                        ))
                      : t.createCommentVNode('', !0)
                  ],
                  12,
                  Tl
                )
              )
            ),
            128
          ))
        ],
        2
      )
    )
  }
  const { create: Vl } = o('shortpassword')
  var Dl = Vl({
    props: {
      title: { type: String, default: '请输入密码' },
      desc: { type: String, default: '您使用了虚拟资产，请进行验证' },
      tips: { type: String, default: '忘记密码' },
      visible: { type: Boolean, default: !1 },
      modelValue: { type: String, default: '' },
      errorMsg: { type: String, default: '' },
      noButton: { type: Boolean, default: !0 },
      closeOnClickOverlay: { type: Boolean, default: !0 },
      length: { type: [String, Number], default: 6 }
    },
    emits: [
      'update:modelValue',
      'update:visible',
      'complete',
      'change',
      'ok',
      'tips',
      'close',
      'cancel'
    ],
    setup(e, { emit: n }) {
      const o = t.ref(e.modelValue),
        l = t.ref(),
        a = t.computed(() => r(Number(e.length))),
        i = t.ref(e.visible)
      function r(e) {
        return Math.min(Math.max(4, e), 6)
      }
      return (
        t.watch(
          () => e.visible,
          e => {
            i.value = e
          }
        ),
        {
          comLen: a,
          sureClick: function () {
            n('ok', o.value)
          },
          realInput: o,
          realpwd: l,
          focus: function () {
            l.value.focus()
          },
          range: r,
          changeValue: function (e) {
            let t = e.target.value
            t.length > a.value && ((t = t.slice(0, a.value)), (o.value = t)),
              String(o.value).length === a.value && n('complete', t),
              n('change', t),
              n('update:modelValue', t)
          },
          close: function () {
            n('update:visible', !1), n('cancel')
          },
          onTips: function () {
            n('tips')
          },
          show: i,
          closeIcon: function () {
            n('update:visible', !1), n('close')
          }
        }
      )
    }
  })
  t.pushScopeId('data-v-42651443')
  const Il = { class: 'nut-shortpsd-title' },
    Ml = { class: 'nut-shortpsd-subtitle' },
    Ll = { class: 'nut-input-normalw' },
    Pl = t.createElementVNode('div', { class: 'nut-input-site' }, null, -1),
    jl = { key: 0, class: 'nut-shortpsd-icon' },
    $l = { class: 'nut-shortpsd-message' },
    Al = { class: 'nut-shortpsd-error' },
    Fl = { key: 0, class: 'nut-shortpsd-forget' },
    Ol = { key: 0, class: 'nut-shortpsd-footer' }
  t.popScopeId(),
    (Dl.render = function (e, n, o, l, a, i) {
      const r = t.resolveComponent('nut-icon'),
        s = t.resolveComponent('nut-popup')
      return (
        t.openBlock(),
        t.createElementBlock('view', null, [
          t.createVNode(
            s,
            {
              style: {
                padding: '32px 24px 28px 24px',
                borderRadius: '12px',
                textAlign: 'center'
              },
              visible: e.show,
              'onUpdate:visible': n[6] || (n[6] = t => (e.show = t)),
              closeable: !0,
              onClickCloseIcon: e.closeIcon,
              'close-on-click-overlay': e.closeOnClickOverlay,
              onClickOverlay: e.close
            },
            {
              default: t.withCtx(() => [
                t.createElementVNode('view', Il, t.toDisplayString(e.title), 1),
                t.createElementVNode('view', Ml, t.toDisplayString(e.desc), 1),
                t.createElementVNode('div', Ll, [
                  t.withDirectives(
                    t.createElementVNode(
                      'input',
                      {
                        ref: 'realpwd',
                        class: 'nut-input-real',
                        type: 'number',
                        maxlength: '6',
                        'onUpdate:modelValue':
                          n[0] || (n[0] = t => (e.realInput = t)),
                        onInput:
                          n[1] ||
                          (n[1] = (...t) =>
                            e.changeValue && e.changeValue(...t))
                      },
                      null,
                      544
                    ),
                    [[t.vModelText, e.realInput]]
                  ),
                  Pl,
                  t.createElementVNode(
                    'view',
                    {
                      class: 'nut-shortpsd-fake',
                      onClick:
                        n[2] || (n[2] = (...t) => e.focus && e.focus(...t))
                    },
                    [
                      (t.openBlock(!0),
                      t.createElementBlock(
                        t.Fragment,
                        null,
                        t.renderList(
                          new Array(e.comLen),
                          (n, o) => (
                            t.openBlock(),
                            t.createElementBlock(
                              'view',
                              { class: 'nut-shortpsd-li', key: o },
                              [
                                String(e.realInput).length > o
                                  ? (t.openBlock(),
                                    t.createElementBlock('view', jl))
                                  : t.createCommentVNode('', !0)
                              ]
                            )
                          )
                        ),
                        128
                      ))
                    ]
                  )
                ]),
                t.createElementVNode('view', $l, [
                  t.createElementVNode(
                    'view',
                    Al,
                    t.toDisplayString(e.errorMsg),
                    1
                  ),
                  e.tips
                    ? (t.openBlock(),
                      t.createElementBlock('view', Fl, [
                        t.createVNode(r, {
                          class: 'icon',
                          size: '11px',
                          name: 'tips'
                        }),
                        t.createElementVNode(
                          'view',
                          {
                            onClick:
                              n[3] ||
                              (n[3] = (...t) => e.onTips && e.onTips(...t))
                          },
                          t.toDisplayString(e.tips),
                          1
                        )
                      ]))
                    : t.createCommentVNode('', !0)
                ]),
                e.noButton
                  ? t.createCommentVNode('', !0)
                  : (t.openBlock(),
                    t.createElementBlock('view', Ol, [
                      t.createElementVNode(
                        'view',
                        {
                          class: 'nut-shortpsd-cancle',
                          onClick:
                            n[4] || (n[4] = (...t) => e.close && e.close(...t))
                        },
                        '取消'
                      ),
                      t.createElementVNode(
                        'view',
                        {
                          class: 'nut-shortpsd-sure',
                          onClick:
                            n[5] ||
                            (n[5] = (...t) => e.sureClick && e.sureClick(...t))
                        },
                        '确认'
                      )
                    ]))
              ]),
              _: 1
            },
            8,
            [
              'visible',
              'onClickCloseIcon',
              'close-on-click-overlay',
              'onClickOverlay'
            ]
          )
        ])
      )
    }),
    (Dl.__scopeId = 'data-v-42651443')
  const { componentName: ql, create: Rl } = o('textarea')
  var Hl = Rl({
    props: {
      modelValue: { type: [String, Number], default: '' },
      textAlign: { type: String, default: 'left' },
      limitShow: { type: Boolean, default: !1 },
      maxLength: { type: [String, Number], default: '' },
      rows: { type: [String, Number], default: '' },
      placeholder: { type: String, default: '请输入内容' },
      readonly: { type: Boolean, default: !1 },
      disabled: { type: Boolean, default: !1 },
      autosize: { type: Boolean, default: !1 }
    },
    emits: ['update:modelValue', 'change', 'blur', 'focus'],
    setup(e, { emit: n }) {
      const o = t.computed(() => ({
          [ql]: !0,
          [`${ql}--disabled`]: e.disabled
        })),
        l = t.computed(() => ({
          textAlign: e.textAlign,
          resize: e.autosize ? 'vertical' : 'none'
        })),
        a = (t, o) => {
          e.maxLength &&
            t.length > Number(e.maxLength) &&
            (t = t.substring(0, Number(e.maxLength))),
            n('change', t, o),
            n('update:modelValue', t, o)
        }
      return {
        classes: o,
        styles: l,
        change: e => {
          const t = e.target
          a(t.value, e)
        },
        focus: t => {
          e.disabled || e.readonly || n('focus', t)
        },
        blur: t => {
          if (e.disabled) return
          if (e.readonly) return
          let o = t.target.value
          a(o, t), n('blur', { value: o, event: t })
        }
      }
    }
  })
  const Yl = [
      'rows',
      'disabled',
      'readonly',
      'value',
      'maxlength',
      'placeholder'
    ],
    Wl = { key: 0, class: 'nut-textarea__limit' }
  Hl.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        { class: t.normalizeClass(e.classes) },
        [
          t.createElementVNode(
            'textarea',
            {
              class: 'nut-textarea__textarea',
              style: t.normalizeStyle(e.styles),
              rows: e.rows,
              disabled: e.disabled,
              readonly: e.readonly,
              value: e.modelValue,
              onInput: n[0] || (n[0] = (...t) => e.change && e.change(...t)),
              onBlur: n[1] || (n[1] = (...t) => e.blur && e.blur(...t)),
              onFocus: n[2] || (n[2] = (...t) => e.focus && e.focus(...t)),
              maxlength: e.maxLength,
              placeholder: e.placeholder
            },
            null,
            44,
            Yl
          ),
          e.limitShow
            ? (t.openBlock(),
              t.createElementBlock(
                'view',
                Wl,
                t.toDisplayString(e.modelValue.length) +
                  '/' +
                  t.toDisplayString(e.maxLength),
                1
              ))
            : t.createCommentVNode('', !0)
        ],
        2
      )
    )
  }
  class Xl {
    constructor() {
      __publicField(this, 'url', ''),
        __publicField(this, 'formData'),
        __publicField(this, 'method', 'post'),
        __publicField(this, 'xhrState', 200),
        __publicField(this, 'timeout', 3e4),
        __publicField(this, 'headers', {}),
        __publicField(this, 'withCredentials', !1),
        __publicField(this, 'onStart'),
        __publicField(this, 'onProgress'),
        __publicField(this, 'onSuccess'),
        __publicField(this, 'onFailure')
    }
  }
  class Ul {
    constructor(e) {
      __publicField(this, 'options'), (this.options = e)
    }
    upload() {
      var e
      const t = this.options,
        n = new XMLHttpRequest()
      if (((n.timeout = t.timeout), n.upload)) {
        n.upload.addEventListener(
          'progress',
          e => {
            var n
            null == (n = t.onProgress) || n.call(t, e, t)
          },
          !1
        ),
          (n.onreadystatechange = () => {
            var e, o
            4 === n.readyState &&
              (n.status === t.xhrState
                ? null == (e = t.onSuccess) || e.call(t, n.responseText, t)
                : null == (o = t.onFailure) || o.call(t, n.responseText, t))
          }),
          (n.withCredentials = t.withCredentials),
          n.open(t.method, t.url, !0)
        for (const [e, o] of Object.entries(t.headers)) n.setRequestHeader(e, o)
        null == (e = t.onStart) || e.call(t, t), n.send(t.formData)
      } else console.warn('浏览器不支持 XMLHttpRequest')
    }
    uploadTaro(e, t) {
      var n
      const o = this.options,
        l = t.uploadFile({
          url: o.url,
          filePath: e,
          header: __spreadValues(
            { 'Content-Type': 'multipart/form-data' },
            o.headers
          ),
          formData: o.formData,
          name: 'files',
          success(e) {
            var t, n
            e.errMsg
              ? null == (t = o.onFailure) || t.call(o, e, o)
              : o.xhrState === e.statusCode &&
                (null == (n = o.onSuccess) || n.call(o, e, o))
          },
          fail(e) {
            var t
            null == (t = o.onFailure) || t.call(o, e, o)
          }
        })
      null == (n = o.onStart) || n.call(o, o),
        l.progress(e => {
          var t
          null == (t = o.onProgress) || t.call(o, e, o)
        })
    }
  }
  const { componentName: Kl, create: Gl } = o('uploader')
  class Jl {
    constructor() {
      __publicField(this, 'status', 'ready'),
        __publicField(this, 'uid', new Date().getTime().toString()),
        __publicField(this, 'name'),
        __publicField(this, 'url'),
        __publicField(this, 'type'),
        __publicField(this, 'formData', new FormData())
    }
  }
  var Ql = Gl({
    props: {
      name: { type: String, default: 'file' },
      url: { type: String, default: '' },
      timeout: { type: [Number, String], default: 3e4 },
      fileList: { type: Array, default: () => [] },
      isPreview: { type: Boolean, default: !0 },
      isDeletable: { type: Boolean, default: !0 },
      method: { type: String, default: 'post' },
      capture: { type: Boolean, default: !1 },
      maximize: { type: [Number, String], default: Number.MAX_VALUE },
      maximum: { type: [Number, String], default: 1 },
      clearInput: { type: Boolean, default: !1 },
      accept: { type: String, default: '*' },
      headers: { type: Object, default: {} },
      data: { type: Object, default: {} },
      uploadIcon: { type: String, default: 'photograph' },
      xhrState: { type: [Number, String], default: 200 },
      withCredentials: { type: Boolean, default: !1 },
      multiple: { type: Boolean, default: !1 },
      disabled: { type: Boolean, default: !1 },
      beforeUpload: { type: Function, default: null },
      beforeDelete: { type: Function, default: (e, t) => !0 },
      onChange: { type: Function }
    },
    emits: [
      'start',
      'progress',
      'oversize',
      'success',
      'failure',
      'change',
      'delete',
      'update:fileList'
    ],
    setup(e, { emit: n }) {
      const o = t.reactive(e.fileList),
        l = t.computed(() => ({ [Kl]: !0 })),
        a = l => {
          l.forEach(l => {
            const a = new FormData()
            a.append(e.name, l)
            const i = t.reactive(new Jl())
            if (
              ((i.name = l.name),
              (i.status = 'uploading'),
              (i.type = l.type),
              (i.formData = a),
              (t => {
                const l = new Xl()
                l.url = e.url
                for (const [n, o] of Object.entries(e.data))
                  t.formData.append(n, o)
                ;(l.formData = t.formData),
                  (l.timeout = 1 * e.timeout),
                  (l.method = e.method),
                  (l.xhrState = e.xhrState),
                  (l.headers = e.headers),
                  (l.withCredentials = e.withCredentials),
                  (l.onStart = e => {
                    ;(t.status = 'ready'), n('start', e)
                  }),
                  (l.onProgress = (e, o) => {
                    ;(t.status = 'uploading'),
                      n('progress', { e: e, option: o })
                  }),
                  (l.onSuccess = (e, l) => {
                    ;(t.status = 'success'),
                      n('success', { responseText: e, option: l }),
                      n('update:fileList', o)
                  }),
                  (l.onFailure = (e, o) => {
                    ;(t.status = 'error'),
                      n('failure', { responseText: e, option: o })
                  }),
                  new Ul(l).upload()
              })(i),
              e.isPreview && l.type.includes('image'))
            ) {
              const e = new FileReader()
              ;(e.onload = e => {
                ;(i.url = e.target.result), o.push(i)
              }),
                e.readAsDataURL(l)
            } else o.push(i)
          })
        },
        i = t => {
          const o = 1 * e.maximum,
            l = 1 * e.maximize,
            a = new Array()
          return (
            (t = t.filter(e => !(e.size > l) || (a.push(e), !1))),
            a.length && n('oversize', a),
            t.length > o && t.splice(o - 1, t.length - o),
            t
          )
        }
      return {
        onChange: t => {
          if (e.disabled) return
          const l = t.target
          let { files: r } = l
          if (e.beforeUpload)
            e.beforeUpload(r).then(e => {
              const t = i(new Array().slice.call(e))
              a(t)
            })
          else {
            const e = i(new Array().slice.call(r))
            a(e)
          }
          n('change', { fileList: o, event: t }), e.clearInput && (l.value = '')
        },
        onDelete: (t, l) => {
          e.beforeDelete(t, o)
            ? (o.splice(l, 1), n('delete', { file: t, fileList: o }))
            : console.log('用户阻止了删除！')
        },
        fileList: o,
        classes: l
      }
    }
  })
  const Zl = { key: 0, class: 'nut-uploader__slot' },
    ea = ['accept', 'multiple', 'name', 'disabled'],
    ta = ['accept', 'multiple', 'name', 'disabled'],
    na = { class: 'nut-uploader__preview-img' },
    oa = ['src'],
    la = { key: 2, class: 'tips' },
    aa = { key: 0, class: 'nut-uploader__upload' },
    ia = ['accept', 'multiple', 'name', 'disabled'],
    ra = ['accept', 'multiple', 'name', 'disabled']
  Ql.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-icon')
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        { class: t.normalizeClass(e.classes) },
        [
          e.$slots.default
            ? (t.openBlock(),
              t.createElementBlock('view', Zl, [
                t.renderSlot(e.$slots, 'default'),
                e.maximum - e.fileList.length
                  ? (t.openBlock(),
                    t.createElementBlock(
                      t.Fragment,
                      { key: 0 },
                      [
                        e.capture
                          ? (t.openBlock(),
                            t.createElementBlock(
                              'input',
                              {
                                key: 0,
                                class: 'nut-uploader__input',
                                type: 'file',
                                capture: 'camera',
                                accept: e.accept,
                                multiple: e.multiple,
                                name: e.name,
                                disabled: e.disabled,
                                onChange:
                                  n[0] ||
                                  (n[0] = (...t) =>
                                    e.onChange && e.onChange(...t))
                              },
                              null,
                              40,
                              ea
                            ))
                          : (t.openBlock(),
                            t.createElementBlock(
                              'input',
                              {
                                key: 1,
                                class: 'nut-uploader__input',
                                type: 'file',
                                accept: e.accept,
                                multiple: e.multiple,
                                name: e.name,
                                disabled: e.disabled,
                                onChange:
                                  n[1] ||
                                  (n[1] = (...t) =>
                                    e.onChange && e.onChange(...t))
                              },
                              null,
                              40,
                              ta
                            ))
                      ],
                      64
                    ))
                  : t.createCommentVNode('', !0)
              ]))
            : (t.openBlock(),
              t.createElementBlock(
                t.Fragment,
                { key: 1 },
                [
                  (t.openBlock(!0),
                  t.createElementBlock(
                    t.Fragment,
                    null,
                    t.renderList(
                      e.fileList,
                      (n, o) => (
                        t.openBlock(),
                        t.createElementBlock(
                          'view',
                          { class: 'nut-uploader__preview', key: n.uid },
                          [
                            t.createElementVNode('view', na, [
                              e.isDeletable
                                ? (t.openBlock(),
                                  t.createBlock(
                                    r,
                                    {
                                      key: 0,
                                      color: 'rgba(0,0,0,0.6)',
                                      onClick: t => e.onDelete(n, o),
                                      class: 'close',
                                      name: 'circle-close'
                                    },
                                    null,
                                    8,
                                    ['onClick']
                                  ))
                                : t.createCommentVNode('', !0),
                              n.type.includes('image') && n.url
                                ? (t.openBlock(),
                                  t.createElementBlock(
                                    'img',
                                    {
                                      key: 1,
                                      class: 'nut-uploader__preview-img__c',
                                      src: n.url
                                    },
                                    null,
                                    8,
                                    oa
                                  ))
                                : t.createCommentVNode('', !0),
                              'success' != n.status
                                ? (t.openBlock(),
                                  t.createElementBlock(
                                    'view',
                                    la,
                                    t.toDisplayString(n.status),
                                    1
                                  ))
                                : t.createCommentVNode('', !0)
                            ])
                          ]
                        )
                      )
                    ),
                    128
                  )),
                  e.maximum - e.fileList.length
                    ? (t.openBlock(),
                      t.createElementBlock('view', aa, [
                        t.createVNode(
                          r,
                          { color: '#808080', name: e.uploadIcon },
                          null,
                          8,
                          ['name']
                        ),
                        e.capture
                          ? (t.openBlock(),
                            t.createElementBlock(
                              'input',
                              {
                                key: 0,
                                class: 'nut-uploader__input',
                                type: 'file',
                                capture: 'camera',
                                accept: e.accept,
                                multiple: e.multiple,
                                name: e.name,
                                disabled: e.disabled,
                                onChange:
                                  n[2] ||
                                  (n[2] = (...t) =>
                                    e.onChange && e.onChange(...t))
                              },
                              null,
                              40,
                              ia
                            ))
                          : (t.openBlock(),
                            t.createElementBlock(
                              'input',
                              {
                                key: 1,
                                class: 'nut-uploader__input',
                                type: 'file',
                                accept: e.accept,
                                multiple: e.multiple,
                                name: e.name,
                                disabled: e.disabled,
                                onChange:
                                  n[3] ||
                                  (n[3] = (...t) =>
                                    e.onChange && e.onChange(...t))
                              },
                              null,
                              40,
                              ra
                            ))
                      ]))
                    : t.createCommentVNode('', !0)
                ],
                64
              ))
        ],
        2
      )
    )
  }
  const { componentName: sa, create: ca } = o('countup')
  var ua = ca({
    props: {
      initNum: { type: Number, default: 0 },
      endNum: { type: Number, default: 0 },
      speed: { type: Number, default: 1 },
      toFixed: { type: Number, default: 0 },
      during: { type: Number, default: 1e3 },
      startFlag: { type: Boolean, default: !0 },
      numWidth: { type: Number, default: 20 },
      numHeight: { type: Number, default: 20 },
      scrolling: { type: Boolean, default: !1 },
      customBgImg: { type: String, default: '' },
      customSpacNum: { type: Number, default: 0 },
      customChangeNum: { type: Number, default: 1 },
      type: { type: String, default: '' },
      machineNum: { type: Number, default: 3 },
      machinePrizeNum: { type: Number, default: 0 },
      machinePrizeLevel: { type: Number, default: 0 },
      machineTrunMore: { type: Number, default: 0 }
    },
    components: {},
    emits: ['click', 'scroll-end'],
    setup(e, { emit: n }) {
      const o = t.reactive({
          valFlag: !1,
          current: 0,
          sortFlag: 'add',
          initDigit1: 0,
          initDigit2: 0,
          to0_10: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
          to10_0: [0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1],
          timer: null,
          totalCount: 0,
          pointNum: 0,
          numberVal: 0,
          num_total_len: 0,
          relNum: 0,
          customNumber: 1,
          prizeLevelTrun: 0,
          prizeY: [],
          prizeYPrev: [],
          finshMachine: 0,
          notPrize: [],
          typeMachine: ''
        }),
        { startFlag: l, scrolling: a, customBgImg: i, type: r } = t.reactive(e)
      t.watch(
        () => e.customChangeNum,
        (e, t) => {
          c(), p(0)
        }
      ),
        t.watch(
          () => e.machinePrizeLevel,
          (e, t) => {
            o.prizeLevelTrun = e
          }
        ),
        t.watch(
          () => e.initNum,
          (e, t) => {
            ;(o.current = e), (o.valFlag = !1), s()
          }
        ),
        t.watch(
          () => e.endNum,
          (t, n) => {
            ;(o.current = e.initNum), (o.valFlag = !1), s()
          }
        )
      const s = () => {
          if (o.valFlag) return !1
          l &&
            (a || i
              ? 'machine' != r && p()
              : (d(),
                setTimeout(() => {
                  o.valFlag = !0
                }, 300)))
        },
        c = () => {
          clearInterval(Number(o.timer)), (o.timer = null)
        },
        u = (e, t, n) => {
          const o = (e.toString().split('.')[1] || '').length,
            l = (t.toString().split('.')[1] || '').length,
            a = Math.pow(10, Math.max(o, l))
          if ('-' == n) {
            return Number((e * a - t * a).toFixed(0)) / a
          }
          return Number((e * a + t * a).toFixed(0)) / a
        },
        d = () => {
          let { endNum: t, initNum: l, speed: a, toFixed: i } = e,
            r = setInterval(() => {
              l > t
                ? o.current <= t || o.current <= a
                  ? ((o.current = Number(t.toFixed(i))),
                    clearInterval(r),
                    n('scroll-end'),
                    (o.valFlag = !1))
                  : (o.current = Number(
                      (
                        parseFloat(String(o.current)) - parseFloat(String(a))
                      ).toFixed(i)
                    ))
                : o.current >= t
                ? ((o.current = Number(t.toFixed(i))),
                  clearInterval(r),
                  n('scroll-end'),
                  (o.valFlag = !1))
                : (o.current = Number(
                    (
                      parseFloat(String(o.current)) + parseFloat(String(a))
                    ).toFixed(i)
                  ))
            }, e.during)
        },
        p = n => {
          let l,
            i,
            r,
            s,
            { initNum: c, endNum: d, toFixed: p, customBgImg: h } = e
          h && (c = e.customChangeNum),
            0 != c
              ? (0 != p && (c = Number(c.toFixed(p))),
                String(c).indexOf('.') > -1
                  ? ((l = String(c).split('.')[0].length),
                    (i = String(c).split('.')[1].length))
                  : ((l = String(c).length), (i = 0)))
              : ((l = 1), (i = 0)),
            0 != d
              ? (0 != p && (d = Number(d.toFixed(p))),
                String(d).indexOf('.') > -1
                  ? ((r = String(d).split('.')[0].length),
                    (s = String(d).split('.')[1].length))
                  : ((r = String(d).length), (s = 0)))
              : ((r = 1), (s = 0))
          let y = l >= r ? l : r,
            f = i >= s ? i : s
          ;(o.num_total_len = y + f),
            (o.pointNum = f),
            c > d
              ? ((o.sortFlag = 'reduce'),
                (o.to0_10 = [0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]),
                (o.totalCount = u(c, d, '-')),
                (o.numberVal = Number(String(c))))
              : ((o.sortFlag = 'add'),
                (o.to0_10 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]),
                (o.totalCount = u(d, c, '-')),
                (o.numberVal = Number(String(d))))
          var v = 1
          for (let e = 0; e < o.pointNum; e++) v *= 10
          var k = o.numberVal * v
          if (
            ((o.relNum = k),
            0 != p &&
              ((o.pointNum = String(o.numberVal).split('.')[1]
                ? String(o.numberVal).split('.')[1].length
                : 0),
              (o.num_total_len = String(k).length)),
            String(c).indexOf('.') > -1)
          ) {
            let e = String(c).split('.')
            ;(o.initDigit1 = Number(e[0])), (o.initDigit2 = Number(e[1]))
          } else (o.initDigit1 = c), (o.initDigit2 = 0)
          a && !h
            ? t.nextTick(() => {
                let e =
                  document.getElementsByClassName('numberItem')[
                    o.num_total_len - 1
                  ]
                m(e)
              })
            : 0 !== n && g()
        },
        m = t => {
          c()
          var l = 1
          0 != o.pointNum && (l = 1 / Math.pow(10, o.pointNum)),
            (o.timer = setInterval(() => {
              h(t),
                (o.totalCount = u(o.totalCount, l, '-')),
                o.totalCount <= 0 && (c(), n('scroll-end'), (o.valFlag = !1))
            }, e.during))
        },
        h = t => {
          let n,
            l = t.getAttribute('turn-number')
          if (
            ((n =
              'add' == o.sortFlag
                ? parseInt(String(l)) + 1
                : parseInt(String(l)) - 1 >= 0
                ? parseInt(String(l)) - 1
                : 9),
            t.setAttribute('turn-number', String(n)),
            ('none 0s ease 0s' != t.style.transition &&
              1 != n &&
              t.style.transition) ||
              (t.style.transition = `all linear ${e.during}ms`),
            10 == n || ('reduce' == o.sortFlag && 0 == n))
          ) {
            var a = null
            ;(t.style.top = `-${
              'add' == o.sortFlag ? 100 * n : 100 * (10 - n)
            }%`),
              t.setAttribute('turn-number', '0'),
              (a = setTimeout(() => {
                a && clearTimeout(a),
                  (t.style.transition = 'none'),
                  (t.style.top = '0'),
                  10 == n && t.previousSibling && h(t.previousSibling)
              }, 0.975 * e.during))
          } else
            t.style.top = `-${'add' == o.sortFlag ? 100 * n : 100 * (10 - n)}%`
          '-100%' == t.style.top &&
            'reduce' == o.sortFlag &&
            h(t.previousSibling)
        },
        g = () => {
          0 != o.pointNum && Math.pow(10, o.pointNum),
            t.nextTick(() => {
              document
                .getElementsByClassName('run-number-img')[0]
                .addEventListener('webkitTransitionEnd', () => {
                  n('scroll-end'), (o.valFlag = !1)
                })
            })
        }
      !(function (e) {
        const n = t.getCurrentInstance()
        n && Object.assign(n.proxy, e)
      })({
        machineLuck: () => {
          const t = e.machineTrunMore < 0 ? 0 : e.machineTrunMore
          let n = e.numHeight * e.machinePrizeNum
          o.prizeLevelTrun < 0 &&
            (() => {
              for (o.notPrize = []; o.notPrize.length < 3; ) {
                var t = Math.floor(Math.random() * e.machinePrizeNum + 1)
                ;-1 == o.notPrize.indexOf(t) && o.notPrize.push(t)
              }
            })()
          for (let l = 0; l < e.machineNum; l++)
            setTimeout(() => {
              let a = n * (l + 1 + parseFloat(String(t)))
              0 != o.prizeYPrev.length && (o.prizeY[l] = o.prizeYPrev[l])
              let i = o.prizeYPrev[l] ? o.prizeYPrev[l] : 0,
                r =
                  a +
                  i +
                  (e.machinePrizeNum - o.prizeLevelTrun + 1) * e.numHeight +
                  (n - i)
              o.prizeLevelTrun < 0 && (r += e.numHeight * o.notPrize[l]),
                y(l, r, i)
            }, 500 * l)
        }
      })
      const y = (t, l, a) => {
        let i = setInterval(() => {
          if (a <= l) (a += 10), (o.prizeY[t] = parseFloat(String(a)))
          else if (
            (clearInterval(i),
            (i = null),
            (o.finshMachine += 1),
            (o.prizeY[t] = l),
            o.finshMachine == e.machineNum)
          ) {
            let t = e.numHeight * e.machinePrizeNum
            ;(o.prizeYPrev = []),
              JSON.parse(JSON.stringify(o.prizeY)).forEach(e => {
                let n = e
                for (; n > t; ) n -= t
                o.prizeYPrev.push(n)
              }),
              setTimeout(() => {
                ;(o.finshMachine = 0),
                  o.prizeLevelTrun < 0
                    ? (n('scroll-end', !1), (o.valFlag = !1))
                    : (n('scroll-end', !0), (o.valFlag = !1))
              }, 130)
          }
        }, 30)
      }
      return (
        t.onMounted(() => {
          ;(o.current = e.initNum),
            t.nextTick(() => {
              s()
            })
        }),
        t.onUnmounted(() => {
          c(), (o.timer = null)
        }),
        __spreadProps(
          __spreadValues(
            __spreadValues({}, t.toRefs(o)),
            t.toRefs(t.reactive(e))
          ),
          {
            topNumber: e => {
              let {
                  num_total_len: t,
                  pointNum: n,
                  initDigit1: l,
                  initDigit2: a,
                  sortFlag: i
                } = o,
                r =
                  'add' == i
                    ? String(a)[e - (t - n)]
                    : 10 - Number(String(a)[e - (t - n)]),
                s = 'add' == i ? String(l)[e] : 10 - Number(String(l)[e]),
                c =
                  e > t - n - 1
                    ? 100 * -r + '%'
                    : e <= String(l).length - 1
                    ? 100 * -s + '%'
                    : 0
              return '-1000%' == c && (c = 0), c
            },
            turnNumber: e => {
              let {
                  num_total_len: t,
                  pointNum: n,
                  initDigit1: l,
                  initDigit2: a,
                  sortFlag: i
                } = o,
                r = String(a)[e - (t - n)]
              return e > t - n - 1
                ? r || 0
                : e <= String(l).length - 1
                ? String(l)[e]
                : 0
            }
          }
        )
      )
    }
  })
  const da = { class: 'nut-countup' },
    pa = ['turn-number']
  ua.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock('view', da, [
        '' != e.customBgImg
          ? (t.openBlock(),
            t.createElementBlock(
              t.Fragment,
              { key: 0 },
              [
                'machine' == e.type
                  ? (t.openBlock(),
                    t.createElementBlock(
                      'view',
                      {
                        key: 0,
                        class: 'run-number-machine-img',
                        style: t.normalizeStyle({ height: e.numHeight + 'px' })
                      },
                      [
                        (t.openBlock(!0),
                        t.createElementBlock(
                          t.Fragment,
                          null,
                          t.renderList(
                            e.machineNum,
                            (n, o) => (
                              t.openBlock(),
                              t.createElementBlock(
                                'view',
                                {
                                  class: 'run-number-machine-img-li',
                                  ref: 'run-number-machine-img-li',
                                  key: 'mImg' + o,
                                  style: t.normalizeStyle({
                                    width: e.numWidth + 'px',
                                    height: e.numHeight + 'px',
                                    backgroundImage:
                                      'url(' + e.customBgImg + ')',
                                    backgroundPositionY: e.prizeY[o] + 'px'
                                  })
                                },
                                null,
                                4
                              )
                            )
                          ),
                          128
                        ))
                      ],
                      4
                    ))
                  : (t.openBlock(),
                    t.createElementBlock(
                      'view',
                      {
                        key: 1,
                        class: 'run-number-img',
                        style: t.normalizeStyle({ height: e.numHeight + 'px' })
                      },
                      [
                        (t.openBlock(!0),
                        t.createElementBlock(
                          t.Fragment,
                          null,
                          t.renderList(
                            e.num_total_len,
                            (n, o) => (
                              t.openBlock(),
                              t.createElementBlock(
                                'view',
                                {
                                  class: 'run-number-img-li',
                                  key: 'cImg' + o,
                                  style: t.normalizeStyle({
                                    width: e.numWidth + 'px',
                                    height: e.numHeight + 'px',
                                    left:
                                      e.numWidth *
                                        (o > e.num_total_len - e.pointNum - 1
                                          ? o == e.num_total_len - e.pointNum
                                            ? 1.5 * o
                                            : 1.3 * o
                                          : o) +
                                      'px',
                                    backgroundImage:
                                      'url(' + e.customBgImg + ')',
                                    backgroundPosition:
                                      '0 ' +
                                      -(
                                        String(e.relNum)[o] * e.numHeight +
                                        e.customSpacNum * String(e.relNum)[o]
                                      ) +
                                      'px',
                                    transition:
                                      'all linear ' + e.during / 10 + 'ms'
                                  })
                                },
                                null,
                                4
                              )
                            )
                          ),
                          128
                        )),
                        e.pointNum > 0
                          ? (t.openBlock(),
                            t.createElementBlock(
                              'view',
                              {
                                key: 0,
                                class: 'pointstyl',
                                style: t.normalizeStyle({
                                  width: e.numWidth / 2 + 'px',
                                  bottom: 0,
                                  left:
                                    e.numWidth *
                                      (e.num_total_len - e.pointNum) *
                                      1.1 +
                                    'px',
                                  fontSize: '30px'
                                })
                              },
                              '.',
                              4
                            ))
                          : t.createCommentVNode('', !0)
                      ],
                      4
                    ))
              ],
              64
            ))
          : (t.openBlock(),
            t.createElementBlock(
              t.Fragment,
              { key: 1 },
              [
                e.scrolling
                  ? (t.openBlock(),
                    t.createElementBlock(
                      'view',
                      {
                        key: 0,
                        class: 'run-number',
                        style: t.normalizeStyle({
                          height: e.numHeight + 'px',
                          lineHeight: e.numHeight + 'px'
                        })
                      },
                      [
                        (t.openBlock(!0),
                        t.createElementBlock(
                          t.Fragment,
                          null,
                          t.renderList(
                            e.num_total_len,
                            (n, o) => (
                              t.openBlock(),
                              t.createElementBlock(
                                'view',
                                {
                                  ref: 'numberItem',
                                  class: 'numberItem',
                                  key: n,
                                  style: t.normalizeStyle({
                                    top: e.topNumber(o),
                                    left:
                                      e.numWidth *
                                        (o > e.num_total_len - e.pointNum - 1
                                          ? 1.1 * o
                                          : o) +
                                      'px'
                                  }),
                                  'turn-number': e.turnNumber(o)
                                },
                                [
                                  (t.openBlock(!0),
                                  t.createElementBlock(
                                    t.Fragment,
                                    null,
                                    t.renderList(
                                      e.to0_10,
                                      (n, o) => (
                                        t.openBlock(),
                                        t.createElementBlock(
                                          'view',
                                          {
                                            class: 'itemSpan',
                                            key: 'dote' + o,
                                            style: t.normalizeStyle({
                                              width: e.numWidth + 'px',
                                              height: e.numHeight + 'px',
                                              lineHeight: e.numHeight + 'px'
                                            })
                                          },
                                          t.toDisplayString(n),
                                          5
                                        )
                                      )
                                    ),
                                    128
                                  ))
                                ],
                                12,
                                pa
                              )
                            )
                          ),
                          128
                        )),
                        e.pointNum > 0
                          ? (t.openBlock(),
                            t.createElementBlock(
                              'view',
                              {
                                key: 0,
                                class: 'pointstyl',
                                style: t.normalizeStyle({
                                  width: e.numWidth / 3 + 'px',
                                  height: e.numHeight + 'px',
                                  lineHeight: e.numHeight + 'px',
                                  top: 0,
                                  left:
                                    e.numWidth *
                                      (e.num_total_len - e.pointNum) +
                                    'px'
                                })
                              },
                              '.',
                              4
                            ))
                          : t.createCommentVNode('', !0)
                      ],
                      4
                    ))
                  : (t.openBlock(),
                    t.createElementBlock(
                      t.Fragment,
                      { key: 1 },
                      [t.createTextVNode(t.toDisplayString(e.current), 1)],
                      64
                    ))
              ],
              64
            ))
      ])
    )
  }
  const { create: ma } = o('numberkeyboard')
  var ha = ma({
    props: {
      title: { type: String, default: '' },
      visible: { type: Boolean, default: !1 },
      type: { type: String, default: 'default' },
      customKey: { type: Array, default: () => [] },
      value: { type: String, default: '' },
      maxlength: { type: [Number, String], default: 6 },
      randomKeys: { type: Boolean, default: !1 }
    },
    emits: ['input', 'delete', 'close', 'update:value'],
    setup(e, { emit: n }) {
      const o = t.ref(void 0),
        l = t.ref(e.visible),
        a = t.ref()
      function i() {
        return [
          ...r(),
          { id: 'lock', type: 'lock' },
          { id: 0, type: 'number' },
          { id: 'delete', type: 'delete' }
        ]
      }
      function r() {
        const t = []
        for (let e = 1; e <= 9; e++) t.push({ id: e, type: 'number' })
        return e.randomKeys ? t.sort(() => (Math.random() > 0.5 ? 1 : -1)) : t
      }
      function s() {
        const t = r(),
          { customKey: n } = e
        let o = Array.isArray(n) ? n : [n]
        return (
          o.length > 2 && (o = [o[0], o[1]]),
          1 === o.length
            ? e.title
              ? t.push(
                  { id: o[0], type: 'custom' },
                  { id: 0, type: 'number' },
                  { id: 'delete', type: 'delete' }
                )
              : t.push({ id: 0, type: 'number' }, { id: o[0], type: 'custom' })
            : 2 === o.length
            ? (t.push(
                { id: o[0], type: 'custom' },
                { id: 0, type: 'number' },
                { id: o[1], type: 'custom' }
              ),
              e.title && t.push({ id: 'delete', type: 'delete' }))
            : t.push({ id: 0, type: 'number' }),
          t
        )
      }
      const c = t.computed(() =>
        'rightColumn' == e.type || '' != e.title ? s() : i()
      )
      function u() {
        n('close')
      }
      return (
        t.watch(
          () => e.visible,
          e => {
            l.value = e
          }
        ),
        t.onMounted(() => {}),
        {
          clickKeyIndex: o,
          defaultKey: i,
          closeBoard: u,
          onTouchEnd: function () {
            o.value = void 0
          },
          onTouchMove: function (e, t) {
            t.stopPropagation()
          },
          onTouchstart: function (t, l) {
            l.stopPropagation(),
              (o.value = t.id),
              ('number' != t.type && 'custom' != t.type) ||
                (n('input', t.id),
                e.value.length < e.maxlength &&
                  n('update:value', e.value + t.id)),
              'lock' == t.type && u(),
              'delete' == t.type &&
                (n('delete'),
                n('update:value', e.value.slice(0, e.value.length - 1)))
          },
          keysList: c,
          genCustomKeys: s,
          getBasicKeys: r,
          root: a,
          show: l
        }
      )
    }
  })
  const ga = { class: 'nut-numberkeyboard', ref: 'root' },
    ya = { key: 0, class: 'number-board-header' },
    fa = { class: 'tit' },
    va = { class: 'number-board-body' },
    ka = { class: 'number-board' },
    ba = ['onTouchstart', 'onTouchmove'],
    wa = {
      key: 1,
      src: 'https://img11.360buyimg.com/imagetools/jfs/t1/146371/38/8485/738/5f606425Eca239740/14f4b4f5f20d8a68.png'
    },
    Sa = {
      key: 2,
      src: 'https://img11.360buyimg.com/imagetools/jfs/t1/129395/8/12735/2030/5f61ac37E70cab338/fb477dc11f46056c.png'
    },
    xa = { key: 0, class: 'number-board-sidebar' },
    Ca = { class: 'key-board-wrapper' },
    Ba = [
      t.createElementVNode(
        'img',
        {
          src: 'https://img11.360buyimg.com/imagetools/jfs/t1/129395/8/12735/2030/5f61ac37E70cab338/fb477dc11f46056c.png'
        },
        null,
        -1
      )
    ]
  ha.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-popup')
    return (
      t.openBlock(),
      t.createBlock(
        r,
        {
          visible: e.show,
          'onUpdate:visible': n[6] || (n[6] = t => (e.show = t)),
          position: 'bottom',
          onClickOverlay: n[7] || (n[7] = t => e.closeBoard()),
          'overlay-class': 'nut-numberkeyboard-overlay'
        },
        {
          default: t.withCtx(() => [
            t.createElementVNode(
              'div',
              ga,
              [
                e.title
                  ? (t.openBlock(),
                    t.createElementBlock('div', ya, [
                      t.createElementVNode(
                        'h3',
                        fa,
                        t.toDisplayString(e.title),
                        1
                      ),
                      t.createElementVNode(
                        'span',
                        {
                          class: 'keyboard-close',
                          onClick: n[0] || (n[0] = t => e.closeBoard())
                        },
                        '完成'
                      )
                    ]))
                  : t.createCommentVNode('', !0),
                t.createElementVNode('div', va, [
                  t.createElementVNode('div', ka, [
                    (t.openBlock(!0),
                    t.createElementBlock(
                      t.Fragment,
                      null,
                      t.renderList(
                        e.keysList,
                        o => (
                          t.openBlock(),
                          t.createElementBlock(
                            'div',
                            {
                              class: t.normalizeClass([
                                'key-board-wrapper',
                                {
                                  'key-board-wrapper-large':
                                    0 == o.id &&
                                    'rightColumn' == e.type &&
                                    Array.isArray(e.customKey) &&
                                    1 == e.customKey.length
                                }
                              ]),
                              key: 'key' + o.id
                            },
                            [
                              t.createElementVNode(
                                'div',
                                {
                                  class: t.normalizeClass([
                                    'key',
                                    { active: o.id == e.clickKeyIndex },
                                    { lock: 'lock' == o.type },
                                    { delete: 'delete' == o.type }
                                  ]),
                                  onTouchstart: t => e.onTouchstart(o, t),
                                  onTouchmove: t => e.onTouchMove(o, t),
                                  onTouchend:
                                    n[1] ||
                                    (n[1] = (...t) =>
                                      e.onTouchEnd && e.onTouchEnd(...t))
                                },
                                [
                                  'number' == o.type || 'custom' == o.type
                                    ? (t.openBlock(),
                                      t.createElementBlock(
                                        t.Fragment,
                                        { key: 0 },
                                        [
                                          t.createTextVNode(
                                            t.toDisplayString(o.id),
                                            1
                                          )
                                        ],
                                        64
                                      ))
                                    : t.createCommentVNode('', !0),
                                  'lock' == o.type
                                    ? (t.openBlock(),
                                      t.createElementBlock('img', wa))
                                    : t.createCommentVNode('', !0),
                                  'delete' == o.type
                                    ? (t.openBlock(),
                                      t.createElementBlock('img', Sa))
                                    : t.createCommentVNode('', !0)
                                ],
                                42,
                                ba
                              )
                            ],
                            2
                          )
                        )
                      ),
                      128
                    ))
                  ]),
                  'rightColumn' == e.type
                    ? (t.openBlock(),
                      t.createElementBlock('div', xa, [
                        t.createElementVNode('div', Ca, [
                          t.createElementVNode(
                            'div',
                            {
                              class: t.normalizeClass([
                                'key',
                                { active: 'delete' == e.clickKeyIndex }
                              ]),
                              onTouchstart:
                                n[2] ||
                                (n[2] = t =>
                                  e.onTouchstart(
                                    { id: 'delete', type: 'delete' },
                                    t
                                  )),
                              onTouchmove:
                                n[3] ||
                                (n[3] = t =>
                                  e.onTouchMove(
                                    { id: 'delete', type: 'delete' },
                                    t
                                  )),
                              onTouchend:
                                n[4] ||
                                (n[4] = (...t) =>
                                  e.onTouchEnd && e.onTouchEnd(...t))
                            },
                            Ba,
                            34
                          )
                        ]),
                        '' == e.title
                          ? (t.openBlock(),
                            t.createElementBlock(
                              'div',
                              {
                                key: 0,
                                class: 'key-board-wrapper',
                                onClick: n[5] || (n[5] = t => e.closeBoard())
                              },
                              [
                                t.createElementVNode(
                                  'div',
                                  {
                                    class: t.normalizeClass([
                                      'key',
                                      'finish',
                                      {
                                        activeFinsh: 'finish' == e.clickKeyIndex
                                      }
                                    ])
                                  },
                                  ' 完成 ',
                                  2
                                )
                              ]
                            ))
                          : t.createCommentVNode('', !0)
                      ]))
                    : t.createCommentVNode('', !0)
                ])
              ],
              512
            )
          ]),
          _: 1
        },
        8,
        ['visible']
      )
    )
  }
  const { componentName: Na, create: Ea } = o('countdown')
  var _a = Ea({
    props: {
      modelValue: { type: Object, default: () => ({}) },
      paused: { default: !1, type: Boolean },
      showDays: { default: !1, type: Boolean },
      showPlainText: { default: !1, type: Boolean },
      startTime: {
        type: [Number, String],
        validator: e => 'invalid date' !== new Date(e).toString().toLowerCase()
      },
      endTime: {
        type: [Number, String],
        validator: e => 'invalid date' !== new Date(e).toString().toLowerCase()
      }
    },
    components: {},
    emits: ['input', 'on-end', 'on-restart', 'on-paused'],
    setup(e, { emit: n, slots: o }) {
      console.log('componentName', Na)
      const l = t.reactive({ restTime: 0, p: 0, _curr: 0, timer: null }),
        a = t.computed(() => {
          const t = d(l.restTime),
            { d: n, h: o, m: a, s: i } = t
          return (
            !e.showDays &&
              n > 0 &&
              ((t.h = u(Number(t.h) + 24 * n)), (t.d = 0)),
            t
          )
        }),
        i = t.computed(() => {
          const { d: t, h: n, m: o, s: l } = a.value
          return `${t > 0 && e.showDays ? t + '天' + n : n}小时${o}分${l}秒`
        })
      t.watch(
        () => e.value,
        e => {}
      ),
        t.watch(
          () => l.restTime,
          e => {
            let t = d(e)
            n('update:modelValue', t), n('input', t)
          }
        ),
        t.watch(
          () => e.paused,
          (e, t) => {
            t
              ? ((l.p += s() - l._curr), n('on-restart', l.restTime))
              : ((l._curr = s()), n('on-paused', l.restTime))
          }
        ),
        t.watch(
          () => e.endTime,
          e => {
            c()
          }
        ),
        t.watch(
          () => e.startTime,
          e => {
            c()
          }
        )
      const r = t.computed(() => ({ [Na]: !0 })),
        s = e => {
          if (!e) return Date.now()
          let t = e
          return (
            (t = t > 0 ? +t : t.toString().replace(/\-/g, '/')),
            new Date(t).getTime()
          )
        },
        c = () => {
          const t = Date.now(),
            o = s(e.startTime || t),
            a = s(e.endTime || t),
            i = t - o
          ;(l.restTime = a - (o + i)),
            (l.timer = setInterval(() => {
              if (!e.paused) {
                let e = a - (Date.now() - l.p + i)
                ;(l.restTime = e),
                  e < 1e3 &&
                    ((l.restTime = 0), n('on-end'), clearInterval(l.timer))
              }
            }, 1e3))
        },
        u = e => {
          for (e += ''; e.length < 2; ) e = '0' + e
          return e
        },
        d = e => {
          const t = e
          let n = { d: '-', h: '--', m: '--', s: '--' }
          if ((0 === t && (n = { d: '0', h: '00', m: '00', s: '00' }), t)) {
            const e = 864e5,
              o = 36e5,
              l = 6e4,
              a = t >= e ? parseInt(t / e) : 0,
              i = t - a * e >= o ? parseInt((t - a * e) / o) : 0,
              r =
                t - a * e - i * o >= l ? parseInt((t - a * e - i * o) / l) : 0,
              s = Math.round((t - a * e - i * o - r * l) / 1e3)
            a >= 0 && (n.d = a + ''),
              i >= 0 && (n.h = u(i)),
              r >= 0 && (n.m = u(r)),
              s >= 0 && (n.s = u(s))
          }
          return n
        }
      return (
        c(),
        __spreadProps(__spreadValues({}, t.toRefs(e)), {
          slots: o,
          classes: r,
          getTimeStamp: s,
          initTimer: c,
          resttime: a,
          plainText: i
        })
      )
    }
  })
  const za = { key: 1, class: 'nut-cd-block' },
    Ta = { class: 'nut-cd-block' },
    Va = t.createElementVNode('view', { class: 'nut-cd-dot' }, '天', -1),
    Da = { class: 'nut-cd-block' },
    Ia = t.createElementVNode('view', { class: 'nut-cd-dot' }, ':', -1),
    Ma = { class: 'nut-cd-block' },
    La = t.createElementVNode('view', { class: 'nut-cd-dot' }, ':', -1),
    Pa = { class: 'nut-cd-block' }
  _a.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        {
          class: t.normalizeClass(e.classes),
          onClick:
            n[0] || (n[0] = (...t) => e.handleClick && e.handleClick(...t))
        },
        [
          e.slots.default
            ? t.renderSlot(e.$slots, 'default', { key: 0 })
            : e.showPlainText
            ? (t.openBlock(),
              t.createElementBlock(
                'view',
                za,
                t.toDisplayString(e.plainText),
                1
              ))
            : (t.openBlock(),
              t.createElementBlock(
                t.Fragment,
                { key: 2 },
                [
                  e.resttime.d >= 0 && e.showDays
                    ? (t.openBlock(),
                      t.createElementBlock(
                        t.Fragment,
                        { key: 0 },
                        [
                          t.createElementVNode(
                            'view',
                            Ta,
                            t.toDisplayString(e.resttime.d),
                            1
                          ),
                          Va
                        ],
                        64
                      ))
                    : t.createCommentVNode('', !0),
                  t.createElementVNode(
                    'view',
                    Da,
                    t.toDisplayString(e.resttime.h),
                    1
                  ),
                  Ia,
                  t.createElementVNode(
                    'view',
                    Ma,
                    t.toDisplayString(e.resttime.m),
                    1
                  ),
                  La,
                  t.createElementVNode(
                    'view',
                    Pa,
                    t.toDisplayString(e.resttime.s),
                    1
                  )
                ],
                64
              ))
        ],
        2
      )
    )
  }
  var ja = { exports: {} },
    $a = Object.getOwnPropertySymbols,
    Aa = Object.prototype.hasOwnProperty,
    Fa = Object.prototype.propertyIsEnumerable
  function Oa(e) {
    if (null == e)
      throw new TypeError(
        'Object.assign cannot be called with null or undefined'
      )
    return Object(e)
  }
  const qa = (function () {
      try {
        if (!Object.assign) return !1
        var e = new String('abc')
        if (((e[5] = 'de'), '5' === Object.getOwnPropertyNames(e)[0])) return !1
        for (var t = {}, n = 0; n < 10; n++) t['_' + String.fromCharCode(n)] = n
        if (
          '0123456789' !==
          Object.getOwnPropertyNames(t)
            .map(function (e) {
              return t[e]
            })
            .join('')
        )
          return !1
        var o = {}
        return (
          'abcdefghijklmnopqrst'.split('').forEach(function (e) {
            o[e] = e
          }),
          'abcdefghijklmnopqrst' === Object.keys(Object.assign({}, o)).join('')
        )
      } catch (l) {
        return !1
      }
    })()
      ? Object.assign
      : function (e, t) {
          for (var n, o, l = Oa(e), a = 1; a < arguments.length; a++) {
            for (var i in (n = Object(arguments[a])))
              Aa.call(n, i) && (l[i] = n[i])
            if ($a) {
              o = $a(n)
              for (var r = 0; r < o.length; r++)
                Fa.call(n, o[r]) && (l[o[r]] = n[o[r]])
            }
          }
          return l
        },
    Ra = 0,
    Ha = 1,
    Ya = 2,
    Wa = 5,
    Xa = 3,
    Ua = 4,
    Ka = { style: Ha, segment: !1, heteronym: !1 },
    Ga = 'b,p,m,f,d,t,n,l,g,k,h,j,q,x,r,zh,ch,sh,z,c,s'.split(','),
    Ja = {
      ā: 'a1',
      á: 'a2',
      ǎ: 'a3',
      à: 'a4',
      ē: 'e1',
      é: 'e2',
      ě: 'e3',
      è: 'e4',
      ō: 'o1',
      ó: 'o2',
      ǒ: 'o3',
      ò: 'o4',
      ī: 'i1',
      í: 'i2',
      ǐ: 'i3',
      ì: 'i4',
      ū: 'u1',
      ú: 'u2',
      ǔ: 'u3',
      ù: 'u4',
      ü: 'v0',
      ǘ: 'v2',
      ǚ: 'v3',
      ǜ: 'v4',
      ń: 'n2',
      ň: 'n3',
      '': 'm2'
    },
    Qa = new RegExp('([' + Object.keys(Ja).join('') + '])', 'g'),
    Za = /([aeoiuvnm])([0-4])$/
  class ei {
    constructor(e) {
      this._dict = e
    }
    convert(e, t) {
      if ('string' != typeof e) return []
      t = qa({}, Ka, t)
      let n = [],
        o = ''
      for (let l, a, i = 0, r = e.length; i < r; i++)
        (a = e[i]),
          (l = a.charCodeAt(0)),
          this._dict[l]
            ? (o.length > 0 && (n.push([o]), (o = '')),
              n.push(this.single_pinyin(a, t)))
            : (o += a)
      return o.length > 0 && (n.push([o]), (o = '')), n
    }
    single_pinyin(e, t) {
      if ('string' != typeof e) return []
      if (1 !== e.length) return this.single_pinyin(e.charAt(0), t)
      let n = e.charCodeAt(0)
      if (!this._dict[n]) return [e]
      let o = this._dict[n].split(',')
      if (!t.heteronym) return [ei.toFixed(o[0], t.style)]
      let l = {},
        a = []
      for (let i, r = 0, s = o.length; r < s; r++)
        (i = ei.toFixed(o[r], t.style)),
          l.hasOwnProperty(i) || ((l[i] = i), a.push(i))
      return a
    }
    static toFixed(e, t) {
      let n,
        o,
        l = ''
      switch (t) {
        case Xa:
          return (function (e) {
            for (let t = 0, n = Ga.length; t < n; t++)
              if (0 === e.indexOf(Ga[t])) return Ga[t]
            return ''
          })(e)
        case Ua:
          return (
            (n = e.charAt(0)), Ja.hasOwnProperty(n) && (n = Ja[n].charAt(0)), n
          )
        case Ra:
          return e.replace(Qa, function (e, t) {
            return Ja[t].replace(Za, '$1')
          })
        case Wa:
          return e.replace(Qa, function (e, t) {
            return Ja[t]
          })
        case Ya:
          return (
            (o = e.replace(Qa, function (e, t) {
              return (l = Ja[t].replace(Za, '$2')), Ja[t].replace(Za, '$1')
            })),
            o + l
          )
        case Ha:
        default:
          return e
      }
    }
    compare(e, t) {
      const n = this.convert(e, Ka),
        o = this.convert(t, Ka)
      return String(n).localeCompare(String(o))
    }
    static get STYLE_NORMAL() {
      return Ra
    }
    static get STYLE_TONE() {
      return Ha
    }
    static get STYLE_TONE2() {
      return Ya
    }
    static get STYLE_TO3NE() {
      return Wa
    }
    static get STYLE_INITIALS() {
      return Xa
    }
    static get STYLE_FIRST_LETTER() {
      return Ua
    }
    static get DEFAULT_OPTIONS() {
      return Ka
    }
  }
  const ti = ei,
    ni = new ti(
      (function (e) {
        let t,
          n = {}
        for (let o in e) {
          t = e[o]
          for (let e, l = 0, a = t.length; l < a; l++)
            (e = t.charCodeAt(l)),
              n.hasOwnProperty(e) ? (n[e] += ',' + o) : (n[e] = o)
        }
        return n
      })({
        a: '',
        ā: '吖锕錒',
        á: '嗄',
        ǎ: '',
        à: '',
        āi: '哎哀埃娭溾嗳銰锿噯諰鎄',
        ái: '啀娾捱皑凒隑嵦溰嘊敱敳皚磑癌',
        ǎi: '毐昹娾欸絠嗳矮蔼躷噯濭藹譪霭靄',
        ài: '艾伌欬爱砹硋堨焥隘嗌嗳塧嫒愛碍叆暧瑷僾噯壒嬡懓薆鴱懝曖璦賹餲皧瞹馤礙譺鑀鱫靉',
        ān: '安侒峖桉氨偣庵菴谙啽媕萻葊痷腤裺鹌蓭誝鞍鞌盦諳馣鮟盫鵪韽鶕',
        án: '玵啽雸儑',
        ǎn: '垵俺唵埯铵揞晻罯銨',
        àn: '厈屵屽犴岸咹按洝荌案胺豻堓隌晻暗貋儑錌闇黯',
        āng: '肮骯',
        áng: '卬岇昂昻',
        ǎng: '',
        àng: '枊盎醠',
        āo: '泑柪眑梎軪熝爊',
        áo: '敖厫隞嗷嗸嶅廒慠滶獓蔜遨骜摮獒璈磝墽翱聱螯翶謷謸翺鳌鏕鏖鰲鷔鼇',
        ǎo: '艹抝芺袄眑郩镺媪媼襖',
        ào: '岙扷抝坳垇岰柪傲奡軪奧嫯嶅慠澚隩墺嶴懊擙澳鏊驁',
        ba: '罷',
        bā: '丷八仈巴叭朳玐夿岜扷芭峇柭疤哱哵捌笆粑羓蚆釟豝鲃魞',
        bá: '叐犮抜妭拔茇炦癹胈菝詙跋軷颰魃鼥',
        bǎ: '钯鈀靶',
        bà: '坝弝爸皅垻跁鲃魞鲅鲌罷鮁鮊覇矲霸壩灞欛',
        bāi: '挀掰擘',
        bái: '白',
        bǎi: '百佰栢瓸捭竡粨絔摆擺襬',
        bài: '呗庍拝败拜唄敗猈稗粺薭贁韛',
        bān: '扳攽朌肦班般颁斑搬斒頒搫瘢鳻螌褩癍辬',
        bǎn: '阪坂岅昄板版瓪钣粄舨鈑蝂魬闆',
        bàn: '办半伴扮坢姅怑绊柈秚湴絆跘鉡靽辦瓣',
        bāng: '邦垹帮捠梆浜邫幇幚縍幫鞤',
        bǎng: '绑綁牓膀髈',
        bàng: '玤挷蚄傍棒棓硥谤塝搒稖蒡蛖蜯镑縍艕謗鎊',
        bāo: '勹包佨孢苞枹胞剝笣煲龅裦蕔褒襃闁齙',
        báo: '窇雹',
        bǎo: '宝怉饱保鸨宲珤堢媬葆寚飹飽褓駂鳵緥鴇賲藵寳寶靌',
        bào: '勽犳报怉抱豹趵铇菢蚫袌報鉋鲍骲髱虣鮑儤曓嚗曝爆犦忁鑤',
        bei: '呗唄',
        bēi: '陂卑杯柸盃庳桮悲揹棓椑碑鹎箄諀鞞藣鵯',
        běi: '鉳',
        bèi: '贝孛狈貝邶备昁杮牬苝郥钡俻倍悖狽偝偹梖珼鄁備僃惫棑棓焙琲軰辈愂碚禙蓓蛽犕褙誖鞁骳輩鋇憊糒鞴鐾',
        bēn: '泍贲栟喯犇賁锛漰錛蟦',
        běn: '夲本苯奙畚翉楍',
        bèn: '坋坌泍炃倴捹桳渀笨逩撪',
        bēng: '伻祊奟崩絣閍嗙嵭痭嘣綳繃',
        béng: '甮甭',
        běng: '埄埲菶琣琫綳繃鞛',
        bèng: '泵迸堋逬揼跰塴綳甏镚繃蹦鏰',
        bī: '皀屄偪毴逼楅榌豍螕鵖鲾鎞鰏',
        bí: '荸鼻嬶',
        bǐ: '匕比夶朼佊吡妣沘疕纰彼毞肶柀秕俾娝笔粃紕舭啚崥筆鄙聛貏',
        bì: '币必毕闬闭佖坒庇芘诐邲咇妼怭怶畁畀肶苾哔柲毖珌畐疪祕胇荜贲陛毙狴畢笓粊袐铋婢敝旇梐紴翍萆萞閇閈閉堛弼弻愊愎湢皕禆筚詖貱賁赑嗶彃滗滭煏痺痹睤睥腷蓖蓽蜌裨跸鉍閟飶幣弊熚獙碧稫箅箆綼蔽鄪馝幤潷獘罼襅駜髲壁嬖廦篦篳縪薜觱避鮅斃濞蹕鞞髀奰璧鄨鎞鏎饆繴襣襞鞸韠魓躃躄驆鶝朇贔鐴鷝鷩鼊',
        biān: '辺边炞砭笾猵编萹煸牑甂箯糄編臱蝙鞕獱邉鍽鳊邊鞭鯾鯿籓籩',
        biǎn: '贬疺窆匾貶惼揙碥稨褊糄鴘藊覵鶣',
        biàn: '卞弁忭抃汳汴苄釆变峅玣変昪覍徧缏遍閞辡緶艑諚辧辨辩辫辮辯變',
        biāo: '灬杓标飑骉髟彪淲猋脿颩僄墂幖摽滮蔈颮骠標熛膔膘麃瘭磦镖飚飙儦檦篻颷瀌藨謤爂臕贆鏢穮镳飈飆飊飇鑣驫',
        biáo: '嫑',
        biǎo: '表婊裱諘褾錶檦',
        biào: '俵摽鳔',
        biē: '柭憋蟞癟鳖鱉鼈虌龞',
        bié: '別柲莂蛂徶襒蟞蹩',
        biě: '癟',
        biè: '別彆',
        bīn: '汃邠玢砏宾彬梹傧斌椕滨缤槟瑸豩賓賔镔儐濒頻濱濵虨豳檳璸瀕霦繽鑌顮',
        bǐn: '',
        bìn: '摈殡膑髩儐擯鬂殯臏髌鬓髕鬢',
        bīng: '冫仌仒氷冰兵幷栟掤梹蛃絣槟鋲檳',
        bǐng: '丙邴陃怲抦秉苪昞昺柄炳饼眪偋屛寎棅琕禀稟鈵鉼鞆餅餠鞞鞸',
        bìng: '並併幷枋垪庰倂栤病窉竝偋傡寎摒誁鮩靐',
        bo: '啵蔔噃',
        bō: '癶拨波癷玻剝哱盋砵趵钵饽紴缽菠袰溊碆鉢僠嶓撥播餑磻礡蹳皪驋鱍',
        bó: '仢彴肑驳帛狛瓝苩侼柭胉郣亳挬浡瓟秡袯钹铂桲淿脖舶萡袹博殕渤葧鹁愽搏猼鉑鈸馎鲌僰榑煿牔箔膊艊誖馛駁踣鋍镈壆馞駮鮊穛襏謈嚗懪簙鎛餺鵓糪髆髉欂襮礴鑮',
        bǒ: '癷蚾跛',
        bò: '孹擗擘檗檘譒蘗',
        bū: '峬庯逋钸晡鈽誧餔錻鯆鵏',
        bú: '鳪轐醭',
        bǔ: '卟补哺捕捬補鸔',
        bù: '布佈吥步咘怖抪歩歨柨钚勏埔埗悑捗荹部埠婄瓿鈈廍蔀箁踄郶篰餢',
        cā: '嚓擦攃',
        cǎ: '礤礸',
        cà: '遪囃',
        cāi: '偲猜',
        cái: '才扐材财財裁纔',
        cǎi: '毝倸啋埰婇寀彩採棌睬跴綵踩',
        cài: '埰寀菜蔡縩',
        cān: '參叄飡骖叅喰湌傪嬠餐爘驂囋',
        cán: '残蚕惭殘慚摲蝅慙蠺蠶',
        cǎn: '惨朁慘憯穇篸黪黲',
        càn: '灿孱傪粲嘇摻儏澯薒燦璨謲鏒',
        cāng: '仓仺伧沧苍玱鸧倉舱傖凔嵢滄獊蒼瑲濸篬艙螥鶬',
        cáng: '匨臧欌鑶',
        càng: '賶',
        cāo: '撡操糙',
        cáo: '曺曹傮嘈嶆慒漕蓸槽褿艚螬鏪',
        cǎo: '屮艸草愺慅懆騲',
        cào: '肏鄵襙鼜',
        cè: '夨冊册厕恻拺测荝敇畟側厠笧粣萗廁惻測策萴筞筴蓛箣憡簎',
        cēn: '參叄叅嵾穇篸',
        cén: '岑汵埁涔笒',
        cēng: '噌',
        céng: '层曽層嶒橧竲驓',
        cèng: '蹭',
        cī: '呰呲玼疵趀偨跐縒骴髊蠀齹',
        cí: '词珁兹垐柌祠茨瓷粢詞辝慈甆辞磁雌鹚糍辤飺餈嬨濨薋鴜礠辭鷀鶿',
        cǐ: '此佌泚玼皉啙跐鮆',
        cì: '朿次佽刾庛茦栨莿絘蛓赐螆賜',
        cōng: '匆囪囱苁忩枞茐怱悤棇焧葱楤漗聡蓯蔥骢暰樅樬潨熜瑽璁聦聪瞛篵聰蟌鍯繱鏓鏦騘驄',
        cóng: '丛徔従婃孮徖從悰淙琮碂慒漎潀潈誴賨賩樷錝藂叢灇欉爜',
        cǒng: '',
        còng: '愡憁謥',
        cōu: '',
        cóu: '',
        cǒu: '',
        còu: '凑湊傶楱腠辏輳',
        cū: '怚粗觕麁麄橻麆麤',
        cú: '徂殂',
        cǔ: '皻',
        cù: '促猝脨媨瘄蔟誎趗噈憱踧醋瘯踿簇縬趨鼀蹙蹵蹴顣',
        cuān: '汆撺鋑镩蹿攛躥鑹',
        cuán: '濽櫕巑攢灒欑穳',
        cuàn: '窜殩熶窽篡窾簒竄爨',
        cuī: '隹崔脺催凗嵟缞墔慛摧榱漼槯磪縗鏙',
        cuǐ: '漼熣璀趡皠',
        cuì: '伜忰疩倅粋紣翆脃脆啐啛崒悴淬萃椊毳焠琗瘁粹綷翠膵膬濢竁襊顇臎',
        cūn: '邨村皴踆澊竴膥',
        cún: '存侟拵壿澊',
        cǔn: '刌忖',
        cùn: '寸吋籿',
        cuō: '搓瑳遳磋蹉醝鎈',
        cuó: '虘嵯嵳痤睉矬蒫瘥蔖鹾酂鹺酇',
        cuǒ: '脞',
        cuò: '剉剒厝夎挫莡莝庴措逪锉蓌错縒諎銼錯',
        chā: '扠扱芆臿挿偛嗏插揷馇銟锸艖疀嚓鍤鎈餷',
        chá: '秅苴垞査茬茶捈梌嵖搽猹靫楂槎詧察摖檫',
        chǎ: '紁蹅镲鑔',
        chà: '仛奼汊岔侘衩诧剎姹紁詫',
        chāi: '芆肞钗釵',
        chái: '犲侪柴豺祡喍儕',
        chǎi: '茝',
        chài: '虿袃訍瘥蠆囆',
        chān: '辿觇梴搀覘裧摻緂鋓幨襜攙',
        chán: '苂婵谗單孱棎湹禅馋煘缠僝嶃嶄獑蝉誗鋋儃嬋廛潹潺緾澶磛禪毚螹蟐鄽瀍繟蟬儳劖繵蟾酁嚵壥巉瀺欃纏纒躔镵艬讒鑱饞',
        chǎn: '产刬旵丳斺浐剗谄啴產産铲阐蒇剷嵼摌滻嘽幝蕆諂閳骣燀簅冁繟醦譂鏟闡囅灛讇',
        chàn: '忏刬剗硟摲幝幨燀懴儳懺羼韂顫',
        chāng: '伥昌倀娼淐猖菖阊椙琩裮锠錩閶鲳闛鯧鼚',
        cháng: '仩仧兏肠苌镸長尝偿常徜瓺萇場甞腸嘗塲嫦瑺膓償嚐鲿鱨',
        chǎng: '昶惝場敞僘厰塲廠氅鋹',
        chàng: '怅玚畅鬯唱悵焻瑒暢畼誯韔',
        chāo: '抄弨怊欩钞訬焯超鈔勦摷綽劋樔窼',
        cháo: '牊晁巣巢鄛鼌漅樔潮窲罺鼂轈謿',
        chǎo: '炒眧粆焣煼槱麨巐',
        chào: '仦仯耖觘',
        chē: '伡車俥砗唓莗硨蛼',
        ché: '',
        chě: '扯偖撦奲',
        chè: '屮彻呫坼迠烢烲焎聅掣揊硩頙徹摰撤澈勶瞮爡',
        chen: '伧傖',
        chēn: '肜抻郴捵棽琛嗔綝瘨瞋諃賝謓',
        chén: '尘臣忱沉辰陈迧茞宸栕莀莐陳敐晨桭梣訦谌軙愖跈鈂煁蔯塵敶樄瘎霃螴諶薼麎曟鷐',
        chěn: '趻硶碜墋夦磣踸鍖贂醦',
        chèn: '衬爯疢龀偁趂趁榇稱齓齔儭嚫穪谶櫬襯讖',
        chēng:
          '朾阷泟柽爯凈棦浾琤偁淨碀蛏晿牚搶赪僜憆摚稱靗撐撑緽橖橕瞠赬頳檉竀罉鎗矃穪蟶鏿鐣饓鐺',
        chéng:
          '氶丞成朾呈承枨诚郕乗城埩娍宬峸洆荿埕挰晟浧珹掁珵窚脭铖堘惩揨棖椉程筬絾裎塍塖溗誠畻酲鋮憕撜澂橙檙鯎瀓懲騬',
        chěng: '侱徎悜逞骋庱睈裎騁',
        chèng: '秤牚稱竀穪',
        chi: '麶',
        chī: '吃妛哧彨胵蚩鸱瓻眵笞粚喫訵嗤媸摛痴絺樆噄殦瞝誺噭螭鴟鵄癡魑齝攡彲黐',
        chí: '弛池驰迟坻沶狋茌迡持柢竾荎俿歭耛菭蚳赿筂貾遅跢遟馳箈箎墀徲漦踟遲篪謘鍉邌鶗鶙',
        chǐ: '叺伬扡呎肔侈卶齿垑奓拸胣恥耻蚇袳豉欼歯袲裭誃鉹褫齒',
        chì: '彳叱斥佁杘灻赤饬侙抶勅恜柅炽勑捇眙翄翅敕烾啻湁飭傺痸腟誃鉓雴憏瘈翤遫銐慗慸瘛翨熾懘趩鶒鷘',
        chōng: '充忡沖茺浺珫翀舂嘃摏徸憃憧衝罿艟蹖',
        chóng: '虫崈崇痋隀漴褈緟蝩蟲爞',
        chǒng: '宠埫寵',
        chòng: '铳揰銃',
        chou: '鮘',
        chōu: '抽牰婤掫紬搊跾瘳篘醔犨犫',
        chóu: '怞俦诪帱栦惆梼畤紬绸菗椆畴絒愁皗稠筹裯詶酧酬綢踌儔雔嚋嬦幬懤盩薵檮燽雠疇籌躊醻讐讎雦',
        chǒu: '丒丑吜杽杻偢瞅醜矁魗',
        chòu: '臰遚殠',
        chu: '橻',
        chū: '出岀初榋摢摴樗貙櫖齣',
        chú: '刍除芻耝厨滁蒢豠锄媰耡蒭蜍趎鉏雏犓廚篨鋤橱幮櫉藸蟵躇雛櫥蹰鶵躕',
        chǔ: '処杵础椘處储楮禇楚褚濋儲檚璴礎齭齼',
        chù: '亍処竌怵泏绌豖欪炪竐俶敊埱珿絀菆傗鄐慉搐滀触閦儊嘼諔憷斶歜臅黜觸矗',
        chuā: '欻',
        chuǎ: '',
        chuà: '',
        chuāi: '搋',
        chuái: '膗',
        chuǎi: '',
        chuài: '啜欼膪踹',
        chuān: '巛川氚穿猭瑏',
        chuán: '舡舩剶船圌遄傳椯椽歂暷篅膞輲',
        chuǎn: '舛荈喘堾歂僢踳',
        chuàn: '汌串玔钏釧猭賗鶨',
        chuāng: '刅疮窓創窗牎摐牕瘡窻',
        chuáng: '床牀喠噇朣橦',
        chuǎng: '闯傸磢闖',
        chuàng: '怆刱剏剙創愴',
        chuī: '吹炊龡',
        chuí: '垂倕埀桘陲捶菙圌搥棰腄槌硾锤箠錘鎚顀',
        chuǐ: '',
        chuì: '惙',
        chūn: '芚旾杶春萅媋暙椿槆瑃箺蝽橁輴櫄鰆鶞',
        chún: '纯肫陙唇浱純莼脣湻犉滣蒓鹑漘蓴膞醇醕錞鯙鶉',
        chǔn: '朐偆萶惷睶賰蠢',
        chuō: '逴趠踔戳繛',
        chuò: '辶吷辵拺哾娖娕啜婥婼惙涰淖辍酫綽踀箹輟鋜龊擉磭餟繛歠鏃嚽齪鑡孎',
        da: '繨',
        dā: '咑哒耷笚嗒搭褡噠墶撘鎝鎉',
        dá: '达迏迖迚呾妲怛沓垯炟羍荅荙畗剳匒惮畣笪逹溚詚達跶靼憚薘鞑燵蟽鐽韃龖龘',
        dǎ: '',
        dà: '亣汏眔',
        dāi: '呆呔獃懛',
        dǎi: '歹逮傣',
        dài: '代诒轪侢垈岱帒甙绐迨带怠柋殆玳贷帯貣軑埭帶紿蚮袋軚逮釱棣詒貸軩瑇跢廗箉叇曃緿蝳駘鮘鴏戴艜黛簤蹛瀻霴襶黱靆',
        dān: '丹妉単眈砃耼耽郸聃躭酖單媅愖殚瘅匰箪褝鄲頕儋勯擔殫甔癉襌簞聸',
        dǎn: '伔刐抌玬瓭胆衴疸紞赕亶馾撢撣賧燀黕膽皽黵',
        dàn: '旦但帎呾沊泹狚诞唌柦疍訑啗啖惔惮淡萏蛋啿弾氮腅蜑觛亶瘅窞蓞誕僤噉馾髧儋嘾彈憚醈憺擔澹禫餤駳鴠癉膻癚嚪繵贉霮饏黮',
        dāng: '珰裆筜當儅噹澢璫襠簹艡蟷鐺闣',
        dǎng: '党谠當擋譡黨攩灙欓讜',
        dàng: '氹凼圵宕砀垱荡档偒菪婸崵愓瓽逿嵣當雼潒碭儅瞊蕩趤壋擋檔璗盪礑簜蘯闣',
        dāo: '刀刂忉朷氘舠釖鱽裯魛螩',
        dáo: '捯',
        dǎo: '导岛陦島捣祷禂搗隝嘄嶋嶌槝導隯壔嶹擣蹈檮禱',
        dào: '辺到帱悼梼焘盗菿椡盜絩道稲箌翢噵稻艔衜檤衟幬燾翿軇瓙纛',
        de: '旳',
        dē: '嘚',
        dé: '恴淂蚮悳惪棏锝徳德鍀',
        dēi: '嘚',
        děi: '',
        dèn: '扥扽',
        dēng: '灯登豋僜噔嬁燈璒竳簦艠蹬',
        děng: '等戥',
        dèng: '邓凳鄧隥墱嶝憕瞪磴镫櫈瀓覴鐙',
        dī: '氐仾低奃岻彽秪袛啲埞羝隄堤渧趆滴碮樀磾鞮鏑',
        dí: '扚廸旳狄肑籴苖迪唙敌浟涤荻啇梑笛觌靮滌蓧馰髢嘀嫡翟蔋蔐頔敵篴镝嚁藡豴蹢鏑糴覿鸐',
        dǐ: '氐厎坘诋邸阺呧坻弤抵拞枑柢牴砥掋菧觝詆軧楴聜骶鯳',
        dì: '坔旳杕玓怟枤苐俤哋埅帝埊娣逓递偙梊焍珶眱祶第菂谛釱媂揥棣渧睇缔蒂遆僀楴禘腣遞鉪墆墑墬嵽摕疐碲蔕蝃遰慸甋締蝭嶳諦諟踶螮',
        diǎ: '嗲',
        diān: '佔敁掂傎厧嵮滇槇槙瘨窴颠蹎巅顚顛癫巓攧巔癲齻',
        dián: '',
        diǎn: '典奌点婰敟椣跕碘蒧蕇踮點嚸',
        diàn: '电阽坫店垫扂玷痁钿婝惦淀奠琔殿痶蜔鈿電墊壂橂橝澱靛磹癜簟驔',
        diāo: '刁叼汈刟虭凋奝弴彫蛁椆琱貂碉鳭瞗錭雕鮉鲷簓鼦鯛鵰',
        diǎo: '扚屌鳥',
        diào: '弔伄吊钓盄窎訋掉釣铞铫絩鈟竨蓧誂銚銱雿魡調瘹窵鋽藋鑃',
        diē: '爹跌褺',
        dié: '佚怢泆苵迭咥垤峌恎挕昳柣绖胅瓞眣耊啑戜眰谍喋堞崼幉惵揲畳絰耋臷詄趃跕軼镻叠楪殜牃牒跮嵽碟蜨褋槢艓蝶疂諜蹀鴩螲鲽鞢曡疉鰈疊氎',
        diě: '',
        diè: '哋',
        dīng: '仃叮奵帄玎甼町疔盯耵虰酊釘靪',
        dǐng: '奵艼顶酊頂鼎嵿鼑濎薡鐤',
        dìng: '订忊饤矴定訂釘飣啶掟萣铤椗腚碇锭碠聢蝊鋌錠磸顁',
        diū: '丟丢铥颩銩',
        dōng: '东冬咚岽東苳昸氡倲鸫埬娻崬崠涷笗菄徚氭蝀鮗鼕鯟鶇鶫',
        dǒng: '揰董墥嬞懂箽蕫諌',
        dòng: '动冻侗垌姛峒恫挏栋洞狪胨迵凍戙烔胴動娻崠硐棟湩絧腖働勭燑駧霘',
        dōu: '吺枓侸唗兜兠蔸橷瞗篼',
        dóu: '唞',
        dǒu: '乧阧抖钭陡蚪鈄',
        dòu: '吋豆郖浢狵荳逗饾鬥梪毭渎脰酘痘閗窦鬦鋀餖斣瀆闘竇鬪鬬鬭',
        dū: '厾剢阇嘟督醏闍',
        dú: '独涜渎椟牍犊裻読獨錖凟匵嬻瀆櫝殰牘犢瓄皾騳黩讀豄贕韣髑鑟韇韥黷讟',
        dǔ: '竺笃堵暏琽赌睹覩賭篤',
        dù: '芏妒杜妬姤荰秺晵渡靯镀螙斁殬鍍蠧蠹',
        duān: '耑偳剬媏端褍鍴',
        duǎn: '短',
        duàn: '段断塅缎葮椴煅瑖腶碫锻緞毈簖鍛斷躖籪',
        duī: '垖堆塠痽磓镦鴭鐓鐜',
        duǐ: '啍頧',
        duì: '队对兊兌対杸祋怼陮敓敚隊碓綐對憞憝濧濻薱懟瀢瀩譈譵轛',
        dūn: '吨惇蜳墪墫墩撴獤噸撉橔犜礅蹾蹲驐',
        dǔn: '盹趸躉',
        dùn: '伅坉庉忳沌炖盾砘逇钝顿遁鈍楯頓碷遯憞潡燉踲',
        duo: '',
        duō: '夛多咄哆畓剟掇敠敪毲裰跢嚉',
        duó: '仛夺沰铎剫敓敚喥痥鈬奪凙踱鐸',
        duǒ: '朵朶哚垜挆埵崜缍袳椯硾趓躱躲綞亸軃鬌嚲奲',
        duò: '杕杝刴剁枤沲陊陏饳垜尮挆挅柁柂柮桗舵隋媠惰隓跢跥跺飿馱墮憜駄墯隳鵽',
        ē: '妸妿娿婀屙痾',
        é: '讹吪囮迗俄峉哦娥峩峨涐莪珴訛皒睋鈋锇鹅磀誐鋨頟额魤額鵞鵝譌',
        ě: '枙娿砨惡頋噁騀鵈',
        è: '厄戹歺岋阨呃扼苊阸呝枙砐轭咢咹垩姶洝砈匎敋蚅饿偔卾堊娾悪硆谔軛鄂阏堮堨崿惡愕湂萼豟軶遌遏鈪廅搕搤搹琧痷腭僫蝁锷鹗蕚遻頞颚餓噩擜覨諤閼餩鍔鳄歞顎礘櫮鰐鶚鰪讍齃鑩齶鱷',
        ēi: '诶欸誒',
        éi: '诶欸誒',
        ěi: '诶欸誒',
        èi: '诶欸誒',
        ēn: '奀恩蒽煾',
        ěn: '峎',
        èn: '摁',
        ēng: '鞥',
        ér: '儿而児杒侕兒陑峏洏耏荋栭胹唲梕袻鸸粫聏輀鲕隭髵鮞鴯轜',
        ěr: '尒尓尔耳迩洱饵栮毦珥铒衈爾鉺餌駬薾邇趰',
        èr: '二弍弐佴刵咡贰貮貳誀樲髶',
        fā: '冹沷発發彂醗醱',
        fá: '乏伐姂坺垡浌疺罚茷阀栰笩傠筏瞂罰閥墢罸橃藅',
        fǎ: '佱法峜砝鍅灋',
        fà: '珐琺髪蕟髮',
        fān: '帆忛犿拚畨勫噃嬏幡憣旙旛繙翻藩轓颿籓飜鱕',
        fán: '凢凣凡匥杋柉矾籵钒舤烦舧笲釩棥煩緐墦樊蕃燔璠膰薠襎羳蹯瀿礬蘩鐇鐢蠜鷭',
        fǎn: '反払仮返橎',
        fàn: '氾犯奿汎泛饭范贩畈訉軓婏桳梵盕笵販軬飰飯滼嬎範輽瀪',
        fāng: '匚方邡汸芳枋牥祊钫淓蚄堏趽鈁錺鴋',
        fáng: '防妨房肪埅鲂魴',
        fǎng: '仿访彷纺昉昘瓬眆倣旊眪紡舫訪髣鶭',
        fàng: '放趽',
        fēi: '飞妃非飛啡婓婔渄绯扉斐暃猆靟裶緋蜚霏鲱餥馡騑騛鯡飝',
        féi: '肥疿淝腓痱蜰',
        fěi: '朏胐匪诽奜悱斐棐榧翡蕜誹篚',
        fèi: '吠犻芾废杮柹沸狒肺胏昲胇费俷剕厞疿砩陫屝笰萉廃費痱镄廢曊橃橨癈鼣濷蟦櫠鐨靅',
        fēn: '吩帉纷芬昐氛玢砏竕衯紛翂梤棻訜躮酚鈖雰馚朆餴饙',
        fén: '坆坟妢岎汾朌枌炃羒蚠蚡棼焚蒶隫墳幩濆獖蕡魵鳻橨燌燓豮鼢羵鼖豶轒鐼馩黂',
        fěn: '粉黺',
        fèn: '坋弅奋忿秎偾愤粪僨憤獖瞓奮橨膹糞鲼瀵鱝',
        fēng: '丰仹凨凬夆妦沣沨凮枫炐封疯盽砜風埄峰峯莑偑桻烽琒堼崶渢猦葑锋楓犎蜂熢瘋碸僼篈鄷鋒檒豐鎽鏠酆寷灃蘴霻蠭靊飌麷',
        féng: '夆浲逢堸溄馮摓漨綘艂縫',
        fěng: '讽風覂唪諷',
        fèng: '凤奉俸桻湗焨煈赗鳯鳳鴌縫賵',
        fó: '仏仸坲梻',
        fōu: '',
        fóu: '紑',
        fǒu: '缶妚炰缹缻殕雬鴀',
        fū: '伕邞呋妋抙姇枎玞肤怤柎砆胕荂衭娐尃捊荴旉琈紨趺酜麸稃跗鈇筟綒鄜孵粰蓲敷膚鳺麩糐麬麱懯璷',
        fú: '乀巿弗払伏凫甶刜孚扶芣芙芾咈姇宓岪帗怫枎泭绂绋苻茀俘垘枹柫柭氟洑炥玸畉畐祓罘胕茯郛韨鳬哹垺栿浮畗砩莩蚨袚匐桴涪烰琈符笰紱紼翇艴菔虙袱幅棴絥罦葍福綍艀蜉辐鉘鉜颫鳧榑稪箁箙粰褔豧韍颰幞澓蝠髴鴔諨踾輻鮄癁襆鮲黻襥鵩纀鶝',
        fǔ: '阝呒抚甫乶府弣拊斧俌俛柎郙俯蚥釡釜捬脯辅椨焤盙腑滏蜅腐輔嘸撫頫鬴簠黼',
        fù: '讣付妇负附咐坿彿竎阜驸复峊柎洑祔訃負赴蚥袝偩冨婏婦捬紨蚹傅媍富復秿萯蛗覄詂赋椱缚腹鲋榑禣複褔赙緮蕧蝜蝮賦駙嬔縛輹鮒賻鍑鍢鳆覆馥鰒',
        gā: '旮伽夾嘎嘠',
        gá: '钆軋尜釓嘎嘠噶錷',
        gǎ: '尕玍朒嘎嘠',
        gà: '尬魀',
        gāi: '侅该郂陔垓姟峐荄晐赅畡祴絯隑該豥賅賌',
        gǎi: '忋改絠',
        gài: '丐乢匄匃杚钙摡溉葢鈣戤概槩蓋漑槪瓂',
        gān: '甘忓迀攼玕肝咁坩泔矸苷柑玵竿疳酐粓凲尲尴筸漧鳱尶尷魐',
        gǎn: '仠芉皯秆衦赶敢桿稈感澉趕橄擀澸篢簳鳡鱤',
        gàn: '佄旰汵盰绀倝凎淦紺詌骭幹榦檊簳贑赣贛灨',
        gāng: '冈冮刚纲肛岡牨疘矼缸剛罡堈崗掆釭棡犅堽摃碙綱罁鋼鎠',
        gǎng: '岗犺崗',
        gàng: '焵焹筻槓鋼戅戆戇',
        gāo: '皋羔羙高皐髙臯睪槔睾槹獋橰篙糕餻櫜韟鷎鼛鷱',
        gǎo: '夰杲菒稁搞缟槀槁稾稿镐縞藁檺藳鎬',
        gào: '吿告勂诰郜峼祮祰锆筶禞誥鋯',
        gē: '戈仡圪扢犵纥戓肐牫咯紇饹哥袼鸽割彁滒戨歌鴚擱謌鴿鎶',
        gé: '呄佮佫匌挌阁革敋格鬲愅猲臵蛒裓隔颌嗝塥滆觡搿槅膈閣閤獦镉鞈韐骼臈諽輵擱鮥鮯櫊鎑鎘韚轕鞷騔',
        gě: '個哿笴舸嘅嗰蓋鲄',
        gè: '亇吤茖虼個硌铬箇鉻',
        gěi: '給',
        gēn: '根跟',
        gén: '哏',
        gěn: '',
        gèn: '亙亘艮茛揯搄',
        gēng: '刯庚畊浭耕菮椩焿絙絚赓鹒緪縆羮賡羹鶊',
        gěng: '郠哽埂峺挭绠耿莄梗綆鲠骾鯁',
        gèng: '堩緪縆',
        gōng: '工弓公厷功攻杛侊糿糼肱宫紅宮恭躬龚匑塨幊愩觥躳慐匔碽篢髸觵龏龔',
        gǒng: '廾巩汞拱唝拲栱珙嗊輁澒銾鞏',
        gòng: '贡羾唝貢嗊愩慐熕',
        gōu: '佝沟芶钩痀袧缑鈎溝鉤緱褠篝簼鞲韝',
        gǒu: '芶岣狗苟枸玽耉耇笱耈蚼豿',
        gòu: '呴坸构诟购垢姤冓啂夠够傋訽媾彀搆詬遘雊構煹觏撀糓覯購',
        gū: '杚呱咕姑孤沽泒苽巭巬柧轱唃唂罛鸪笟菇菰蛄蓇觚軱軲辜酤稒鈲磆箍箛嫴篐橭鮕鴣',
        gú: '',
        gǔ: '夃古扢抇汩诂谷股牯罟羖逧钴傦啒淈脵蛊嗗尳愲詁馉毂賈鈷鼔鼓嘏榖皷鹘穀縎糓薣濲皼臌轂餶櫎瀔盬瞽鶻蠱',
        gù: '固怘故凅顾堌崓崮梏牿棝祻雇榾痼锢僱錮鲴鯝顧',
        guā: '瓜刮呱胍栝桰铦鸹歄煱颪趏劀緺銛諣踻銽颳鴰騧',
        guá: '',
        guǎ: '冎叧呙呱咼剐剮寡',
        guà: '卦坬诖挂啩掛罣袿絓罫褂詿',
        guāi: '乖',
        guái: '叏',
        guǎi: '拐枴柺罫箉',
        guài: '夬怪恠',
        guān: '关纶官矜覌倌矝莞涫棺蒄窤閞綸関瘝癏観闗鳏關鰥觀鱞',
        guǎn: '莞馆琯痯筦斡管輨璭舘錧館鳤',
        guàn: '卝毌丱贯泴覌悺惯掼淉貫悹祼慣摜潅遦樌盥罆雚観躀鏆灌爟瓘矔礶鹳罐觀鑵欟鱹鸛',
        guāng: '光灮炚炛炗咣垙姯挄洸茪桄烡珖胱硄僙輄潢銧黆',
        guǎng: '広犷廣獷臩',
        guàng: '俇桄逛臦撗',
        guī: '归圭妫规邽皈茥闺帰珪胿亀硅窐袿規媯廆椝瑰郌嫢摫閨鲑嬀嶲槣槻槼鳺璝瞡龜鮭巂歸雟鬶騩櫰櫷瓌蘬鬹',
        guǐ: '宄氿朹轨庋佹匦诡陒垝姽恑攱癸軌鬼庪祪軓匭晷湀蛫觤詭厬簋蟡',
        guì: '攰刿刽昋炅攱贵桂桧匮眭硊趹椢猤筀貴溎蓕跪匱瞆劊劌嶡撌槶螝樻檜瞶禬簂櫃癐襘鐀鳜鞼鑎鱖鱥',
        gǔn: '丨衮惃硍绲袞辊滚蓘裷滾緄蔉磙緷輥鲧鮌鯀',
        gùn: '睔謴',
        guo: '',
        guō: '呙咼咶埚郭啯堝崞渦猓楇聒鈛锅墎瘑嘓彉濄蝈鍋彍蟈懖矌',
        guó: '囗囯囶囻国圀敋喐國帼掴腘摑幗慖漍聝蔮膕虢簂馘',
        guǒ: '果惈淉菓馃椁褁槨粿綶蜾裹輠餜櫎',
        guò: '過腂鐹',
        hā: '虾紦铪鉿蝦',
        há: '',
        hǎ: '奤',
        hà: '',
        hāi: '咍嗨',
        hái: '郂孩骸還嚡',
        hǎi: '海胲烸塰酼醢',
        hài: '亥妎拸骇害氦猲絯嗐餀駭駴饚',
        han: '兯爳',
        hān: '犴佄顸哻蚶酣頇嫨谽憨馠魽歛鼾',
        hán: '邗含汵邯函肣凾虷唅圅娢浛笒崡晗梒涵焓琀寒嵅韩椷甝筨馯蜬澏鋡韓',
        hǎn: '丆罕浫喊豃闞',
        hàn: '仠厈汉屽忓扞闬攼旰旱肣唅垾悍捍涆猂莟晘焊菡釬閈皔睅傼蛿颔馯撖漢蔊蜭鳱暵熯輚銲鋎憾撼翰螒頷顄駻譀雗瀚鶾',
        hāng: '',
        háng: '邟妔苀迒斻杭垳绗桁笐航蚢颃裄貥筕絎頏魧',
        hàng: '忼沆笐',
        hāo: '茠蒿嚆薅薧',
        háo: '乚毜呺竓皋蚝毫椃嗥獆號貉噑獔豪嘷獋諕儫嚎壕濠籇蠔譹',
        hǎo: '郝',
        hào: '昊侴昦秏哠恏悎浩耗晧淏傐皓鄗滈滜聕號暠暤暭澔皜皞镐曍皡薃皥藃鎬颢灏顥鰝灝',
        hē: '诃抲欱訶嗬蠚',
        hé: '禾纥呙劾咊咼姀河郃峆曷柇狢盇籺紇阂饸敆盉盍荷釛啝涸渮盒菏萂龁喛惒粭訸颌楁毼澕蓋詥貈貉鉌阖鲄朅熆閡閤餄鹖麧噈頜篕翮螛魺礉闔鞨齕覈鶡皬鑉龢',
        hě: '',
        hè: '咊抲垎贺哬袔隺寉焃惒猲賀嗃煂碋熇褐赫鹤翯嚇壑癋謞燺爀鶮鶴靍靎鸖靏',
        hēi: '黒黑嗨潶',
        hén: '拫痕鞎',
        hěn: '佷哏很狠詪噷',
        hèn: '恨噷',
        hēng: '亨哼悙涥脝',
        héng: '姮恆恒桁烆珩胻鸻撗橫衡鴴鵆蘅鑅',
        hèng: '悙啈橫',
        hng: '哼',
        hōng: '叿吽呍灴轰訇烘軣揈渹焢硡谾薨輷嚝鍧巆轟',
        hóng: '厷仜弘叿妅屸吰宏汯玒瓨纮闳宖泓玜苰垬娂沗洪竑紅羾荭虹浤浲紘翃耾硔紭谹鸿渱溄竤粠葓葒鈜閎綋翝谼潂鉷鞃魟篊鋐彋霐黉霟鴻黌',
        hǒng: '唝晎嗊愩慐',
        hòng: '讧訌閧撔澒銾蕻闂鬨闀',
        hōu: '齁',
        hóu: '矦鄇喉帿猴葔瘊睺銗篌糇翭骺翵鍭餱鯸',
        hǒu: '吼吽犼呴',
        hòu: '后郈厚垕後洉矦茩逅候堠豞鲎鲘鮜鱟',
        hū: '乎乯匢虍芴呼垀忽昒曶泘苸恗烀芔轷匫唿惚淴虖軤雽嘑寣滹雐幠戯歑戱膴戲謼',
        hú: '囫抇弧狐瓳胡壶隺壷斛焀喖壺媩搰湖猢絗葫鹄楜煳瑚瓡嘝蔛鹕鹘槲箶縎蝴衚魱縠螜醐頶觳鍸餬礐鵠瀫鬍鰗鶘鶦鶻鶮',
        hǔ: '乕汻虎浒俿淲萀琥虝滸錿鯱',
        hù: '互弖戶戸户冱芐帍护沍沪岵怙戽昈曶枑姱怘祜笏粐婟扈瓠楛嗃嗀綔鄠雽嫭嫮摢滬蔰槴熩鳸濩簄豰鍙嚛鹱觷護鳠頀鱯鸌',
        huā: '吪芲花砉埖婲華椛硴蒊嘩糀誮錵蘤',
        huá: '呚姡骅華釪釫铧滑猾嘩搳撶劃磆蕐螖鋘譁鏵驊鷨',
        huà: '夻杹枠画话崋桦華婳畫嬅畵觟話劃摦樺嫿槬澅諙諣黊繣舙譮',
        huái: '怀佪徊淮槐褢踝懐褱懷瀤櫰耲蘹',
        huài: '咶壊壞蘾',
        huān: '欢犿狟貆歓鴅懁鵍酄嚾孉懽獾歡讙貛驩',
        huán: '环郇峘洹狟荁垸桓萈萑堚寏絙雈獂綄羦蒝貆锾瞏圜嬛寰澴缳還阛環豲鍰雚镮鹮糫繯鐶闤鬟瓛',
        huǎn: '睆缓緩',
        huàn: '幻奂肒奐宦唤换浣涣烉患梙焕逭喚喛嵈愌換渙痪煥瑍綄豢漶瘓槵鲩擐澣藧鯇攌嚾轘鯶鰀',
        huāng: '巟肓荒衁宺朚塃慌',
        huáng:
          '皇偟凰隍黄喤堭媓崲徨惶揘湟葟遑黃楻煌瑝墴潢獚锽熿璜篁艎蝗癀磺穔諻簧蟥鍠餭鳇趪韹鐄騜鰉鱑鷬',
        huǎng: '汻怳恍炾宺晄奛谎幌詤熀熿縨謊兤櫎爌',
        huàng: '愰滉榥曂皝鎤皩',
        hui: '',
        huī: '灰灳诙咴恢拻挥洃虺袆晖烣珲豗婎媈揮翚辉隓暉椲楎煇琿睢禈詼墮幑睳褘噅噕撝翬輝麾徽隳瀈蘳孈鰴',
        huí: '囘回囬佪廻廽恛洄茴迴烠蚘逥痐缋蛕蛔蜖藱鮰繢',
        huǐ: '虺悔烠毀毁螝毇檓燬譭',
        huì: '卉屷屶汇讳泋哕浍绘芔荟诲恚恵桧烩贿彗晦秽喙廆惠湏絵缋翙阓匯彚彙會滙詯賄颒僡嘒瘣蔧誨銊圚寭慧憓暳槥潓潰蕙噦嬒徻橞殨澮濊獩璤薈薉諱頮檅檜燴璯篲藱餯嚖懳瞺穢繢蟪櫘繪翽譓儶鏸闠鐬靧譿顪',
        hūn: '昏昬荤婚惛涽焄阍棔殙湣葷睧睯蔒閽轋',
        hún: '忶浑珲馄渾湷琿魂餛鼲',
        hǔn: '',
        hùn: '诨俒眃倱圂婫掍焝溷尡慁睴觨諢',
        huō: '吙秴耠劐攉騞',
        huó: '佸姡活秮秳趏',
        huǒ: '灬火伙邩钬鈥漷煷夥',
        huò: '沎或货咟俰捇眓获閄剨喐掝祸貨惑旤湱禍漷窢蒦锪嚄奯擭濊濩獲篧鍃霍檴謋雘矆礊穫镬嚯彟瀖耯艧藿蠖嚿曤臛癨矐鑊韄靃彠',
        jī: '丌讥击刉叽饥乩刏圾机玑肌芨矶鸡枅苙咭剞唧姬屐积笄飢基庴喞嵆嵇幾攲敧朞犄筓缉赍嗘畸稘跻鳮僟毄箕綨緁銈嘰撃槣樭畿緝觭諅賫踑躸齑墼撽機激璣禨積錤隮懠擊磯簊羁賷櫅耭雞譏韲鶏譤鐖饑癪躋鞿魕鶺鷄羇虀鑇覉鑙齏羈鸄覊',
        jí: '乁亽亼及尐伋吉岌彶忣汲级即极皀亟佶诘郆卽叝姞急皍笈級堲揤疾觙偮卙唶楖淁焏谻戢棘極殛湒集塉嫉愱楫蒺蝍趌辑槉耤膌銡嶯潗濈瘠箿蕀蕺諔趞踖鞊鹡檝螏輯磼簎藉襋蹐鍓艥籍轚鏶霵齎躤雧',
        jǐ: '己丮妀屰犱泲虮挤脊掎済鱾幾戟給嵴麂魢撠憿橶擠濟穖蟣',
        jì: '彐彑旡计记伎坖妓忌技汥芰际剂季哜垍既洎紀茍茤荠計迹剤畟紒继觊記偈寄寂帺徛悸旣梞済绩塈惎臮葪蔇兾勣痵継蓟裚跡際鬾魝摖暨漃漈禝稩穊誋跽霁魥鲚暩瞉稷諅鲫冀劑曁禨穄薊襀髻嚌懠檕濟穖績繋罽薺覬鮆檵櫅櫭璾蹟鯽鵋齌廭懻癠穧繫蘎骥鯚瀱繼蘮鱀蘻霽鰶鰿鷑鱭驥',
        jia: '',
        jiā: '加乫伽夾宊抸佳拁泇徍枷毠浃珈哿埉挾浹痂梜笳耞袈傢猳葭跏椵犌腵鉫嘉擖镓糘豭貑鴐鎵麚',
        jiá: '圿夾忦扴郏拮荚郟唊恝莢戛脥袷铗戞猰蛱裌颉颊蛺鋏頬頰鴶鵊',
        jiǎ: '甲岬叚玾胛斚钾婽徦斝椵賈鉀榎槚瘕檟',
        jià: '驾架嫁幏賈榢價稼駕',
        jiān: '戋奸尖幵坚歼冿戔玪肩艰姧姦兼堅帴惤猏笺菅菺豜傔揃湔牋犍缄葌閒間雃靬搛椷椾煎瑊睷碊缣蒹豣漸監箋蔪樫熞稴緘蕑蕳鋑鲣鳽鹣熸篯縑鋻艱鞬餰馢麉瀐濺鞯鳒鵑殱礛籈鵳攕瀸鰔櫼殲譼鰜鶼礷籛韀鰹囏虃鑯韉',
        jiǎn: '囝拣枧俭柬茧倹挸捡笕减剪帴揵梘检湕趼堿揀揃検減睑硷裥詃锏弿暕瑐筧简絸谫彅戩戬碱儉翦鋄撿橏篯檢藆襇襉謇蹇瞼礆簡繭謭鎫鬋鰎鹸瀽蠒鐗鐧鹻籛譾襺鹼',
        jiàn: '件見侟建饯剑洊牮荐贱俴健剣栫涧珔舰剱徤揵袸谏釰釼寋旔朁楗毽腱臶跈践閒間賎鉴键僣僭榗槛漸監劎劍墹澗箭糋諓賤趝踐踺劒劔薦諫鋻鍵餞瞷瞯磵礀螹鍳鞬擶檻濺繝瀳覵覸譛鏩聻艦轞鐱鑒鑑鑬鑳',
        jiāng: '江姜茳畕豇將葁畺摪翞僵漿螀壃缰薑橿殭螿鳉疅礓繮韁鱂',
        jiǎng: '讲奖桨傋塂蒋奨奬蔣槳獎耩膙講顜',
        jiàng: '匞匠夅弜洚绛將弶強絳畺酱勥滰嵹摾漿彊犟糡醤糨醬櫤謽',
        jiāo: '艽交郊姣娇峧浇茮茭骄胶敎喬椒焦蛟跤僬嘐虠鲛嬌嶕嶣憍憢澆膠蕉燋膲礁穚鮫鵁鹪簥蟭轇鐎驕鷦鷮',
        jiáo: '矯',
        jiǎo: '臫佼恔挢狡绞饺捁晈烄笅皎脚釥铰搅湫筊絞勦敫湬煍腳賋僥摎摷暞踋鉸餃儌劋徺撟撹樔徼憿敽敿燞曒璬矯皦蟜繳譑孂纐攪灚鱎龣',
        jiào: '叫呌峤挍訆悎珓窌笅轿较敎斍覐窖筊覚滘較嘂嘄嘦斠漖酵噍嶠潐噭嬓徼獥癄藠趭轎醮灂覺譥皭釂',
        jie: '價',
        jiē: '阶疖哜皆袓接掲痎秸菨階喈喼嗟堦媘嫅椄湝結脻街裓楬煯瑎稭鞂擑蝔嚌癤謯鶛',
        jié: '卩卪孑尐讦扢刧刦劫岊昅杢刼劼杰疌衱诘拮洁狤迼倢桀桔桝洯紒莭訐偈偼啑婕崨捷掶袷袺傑媫嵑結絜蛣颉嵥搩楶滐睫節蜐詰趌跲鉣截榤碣竭蓵鲒嶱潔羯誱踕镼鞊頡幯擳嶻擮礍鍻鮚巀蠞蠘蠽',
        jiě: '姐毑媎觧飷檞',
        jiè: '丯介吤妎岕庎戒屆届斺玠畍界疥砎衸诫借悈紒蚧唶徣堺楐琾蛶觧骱犗耤誡褯魪嶰藉鎅鶡',
        jīn: '巾今仐斤钅竻釒金津矜砛荕衿觔埐珒矝紟惍琎菳堻琻筋釿璡鹶黅襟',
        jǐn: '侭卺巹紧堇婜菫僅厪谨锦嫤廑慬漌緊蓳馑槿瑾儘錦謹饉',
        jìn: '伒劤妗近进枃勁浕荩晉晋浸烬笒紟赆唫祲進煡臸僅寖搢溍缙靳墐嫤慬榗瑨盡馸僸凚歏殣觐噤嬐濅縉賮嚍壗嬧濜藎燼璶覲贐齽',
        jīng: '坕坙巠京泾经茎亰秔荊荆涇粇婛惊旍旌猄経菁晶稉腈葏睛粳經兢箐精綡聙鋞橸鲸鯨鶁鶄麖鼱驚麠',
        jǐng: '井丼阱刭坓宑汫汬肼剄穽殌儆頚幜憬擏澋璄憼暻璟璥頸蟼警',
        jìng: '劤妌弪径迳俓勁婙浄胫倞凈弳徑痉竞莖逕婧桱梷殑淨竟竫脛敬痙竧靓傹靖境獍誩踁静靚憼曔镜靜瀞鵛鏡競竸',
        jiōng: '冂冋坰扃埛扄浻絅銄駉駫蘏蘔',
        jiǒng: '冏囧泂炅迥侰炯逈浻烱絅煚窘颎綗臦僒煛熲澃褧燛顈臩',
        jiòng: '',
        jiū: '丩勼纠朻牞究糺鸠糾赳阄萛啾揂揪剹揫鳩摎稵樛鬏鬮',
        jiú: '',
        jiǔ: '九乆久乣氿奺汣杦灸玖糺舏韭紤酒镹韮',
        jiù: '匛旧臼咎疚柩柾倃捄桕匓厩救就廄廐舅僦廏慦殧舊鹫匶鯦麔欍齨鷲',
        jū: '凥伡抅車匊居岨泃狙苴驹俥毩疽眗砠罝陱娵婮崌掬梮涺揟椐毱琚腒趄跔跙锔裾雎艍蜛諊踘躹鋦駒據鋸鮈鴡檋鞠鞫鶋',
        jú: '局泦侷狊挶桔啹婅淗焗菊郹椈湨犑輂僪粷蓻跼閰趜鋦橘駶繘鵙蹫鵴巈蘜鶪鼰鼳驧',
        jǔ: '咀岨弆举枸矩莒挙椇筥榉榘蒟龃聥舉踽擧櫸齟欅襷',
        jù: '巨乬巪讵姖岠怇拒洰苣邭具怐怚拠昛歫炬珇秬钜俱倨倶剧烥粔耟蚷袓埧埾惧詎距焣犋跙鉅飓蒩虡豦锯寠愳窭聚駏劇勮屦踞鮔壉懅據澽窶螶遽鋸屨颶瞿貗簴躆醵忂懼鐻',
        juān: '姢勌娟捐涓朘梋焆瓹脧圏裐鹃勬鋑鋗镌鞙鎸鐫蠲',
        juǎn: '呟巻帣埍捲菤锩臇錈闂',
        juàn: '奆劵奍巻帣弮倦勌悁桊狷绢隽婘惓淃瓹眷鄄圏棬椦睊絭罥腃雋睠絹飬慻蔨嶲鋗餋獧縳巂羂讂',
        juē: '噘撅撧屩屫',
        jué: '亅孒孓决刔氒诀吷妜弡抉決芵叕泬玨玦挗珏疦砄绝虳埆捔欮蚗袦崫崛掘斍桷覐觖訣赽趹傕厥焳矞絕絶覚趉鈌劂瑴谲駃噊嶡嶥憰撅熦爴獗瘚蕝蕨觮鴂鴃噱壆憠橜橛燋璚爵臄镢櫭繘蟨蟩爑譎蹷蹶髉匷矍覺鐍鐝鳜灍爝觼穱彏戄攫玃鷢矡貜躩钁',
        juě: '蹶',
        juè: '誳',
        jūn: '军君均汮姰袀軍钧莙蚐桾皲鈞碅筠皸皹覠銁銞鲪頵麇龜鍕鮶麏麕',
        jǔn: '',
        jùn: '呁俊郡陖埈峻捃浚隽馂骏晙焌珺棞畯竣葰雋儁箘箟蜠賐寯懏餕燇濬駿鵘鵔鵕攈攟',
        kā: '喀',
        kǎ: '佧咔咯垰胩裃鉲',
        kāi: '开奒揩锎開鐦',
        kǎi: '凯剀垲恺闿豈铠凱剴嘅慨蒈塏嵦愷輆暟锴鍇鎧闓颽',
        kài: '忾炌欯欬烗勓愒愾濭鎎',
        kān: '刊栞勘龛堪嵁戡龕',
        kǎn: '凵冚坎扻侃砍莰偘埳惂欿歁槛輡檻顑竷轗',
        kàn: '衎崁墈阚瞰磡闞竷鬫矙',
        kāng: '忼闶砊粇康閌嫝嵻慷漮槺穅糠躿鏮鱇',
        káng: '',
        kǎng: '',
        kàng: '亢伉匟邟囥抗犺闶炕钪鈧閌',
        kāo: '尻嵪髛',
        kǎo: '丂攷考拷洘栲烤薧',
        kào: '洘铐犒銬鲓靠鮳鯌',
        kē: '匼柯牁牱珂科轲疴砢趷钶蚵铪嵙棵痾萪軻颏嗑搕犐稞窠鈳榼薖鉿颗樖瞌磕蝌頦窼醘顆髁礚',
        ké: '殻揢殼翗',
        kě: '岢炣渇嵑敤渴軻閜磆嶱',
        kè: '克刻剋勀勊客峇恪娔尅悈袔课堁氪骒愘硞缂衉嗑愙歁溘锞碦緙艐課濭錁礊騍',
        kēi: '剋尅',
        kēn: '',
        kěn: '肎肯肻垦恳啃龂豤貇龈墾錹懇',
        kèn: '珢掯硍裉褃',
        kēng: '劥阬坈坑妔挳硁殸牼揁硜铿硻摼誙銵鍞鏗',
        kěng: '硻',
        kōng: '倥埪崆悾涳椌硿箜躻錓鵼',
        kǒng: '孔倥恐悾',
        kòng: '矼控羫鞚',
        kōu: '抠芤眍眗剾彄摳瞘',
        kǒu: '口劶竘',
        kòu: '叩扣佝怐敂冦宼寇釦窛筘滱蔲蔻瞉簆鷇',
        kū: '扝刳矻郀朏枯胐哭桍秙窋堀圐跍窟骷鮬',
        kú: '',
        kǔ: '狜苦楛',
        kù: '库俈绔庫捁秙焅袴喾硞絝裤瘔酷廤褲嚳',
        kuā: '咵姱恗晇絓舿誇',
        kuǎ: '侉垮楇銙',
        kuà: '胯趶誇跨骻',
        kuǎi: '蒯擓',
        kuài: '巜凷圦块快侩郐哙浍狯脍欳塊蒉會筷駃鲙儈墤鄶噲廥澮獪璯膾旝糩鱠',
        kuān: '宽寛寬臗髋鑧髖',
        kuǎn: '梡欵款歀窽窾',
        kuàn: '',
        kuāng: '匡迋劻诓邼匩哐恇洭硄筐筺誆軭',
        kuáng: '忹抂狅狂诳軖軠誑鵟',
        kuǎng: '夼儣懭',
        kuàng:
          '卝丱邝圹纩况旷岲況矿昿贶框眖砿眶絋絖貺軦鉱鋛鄺壙黋懬曠爌矌礦穬纊鑛',
        kuī: '亏刲岿悝盔窥聧窺虧顝闚巋',
        kuí: '奎晆逵鄈隗馗喹揆葵骙戣暌楏楑魁睽蝰頯櫆藈鍨鍷騤夔蘷巙虁犪躨',
        kuǐ: '尯煃跬頍磈蹞',
        kuì: '尯胿匮喟媿愧愦蒉馈匱瞆嘳嬇憒潰篑聭聩蕢殨膭謉瞶餽簣聵籄饋',
        kūn: '坤昆堃堒婫崑崐晜猑菎裈焜琨髠裩貇锟髡鹍潉蜫褌髨熴瑻醌錕鲲騉鯤鵾鶤',
        kǔn: '悃捆阃壸梱祵硱稇裍壼稛綑閫閸',
        kùn: '困涃睏',
        kuò: '扩拡挄适秮秳铦筈萿葀蛞阔廓漷銛噋銽頢髺擴濶闊鞟韕霩鞹鬠',
        la: '鞡',
        lā: '垃柆砬菈搚磖邋',
        lá: '旯剌砬揦磖嚹',
        lǎ: '喇藞',
        là: '剌翋揦溂揧楋瘌蜡蝋辢辣蝲臈擸攋爉臘鬎櫴瓎镴鯻蠟鑞',
        lái: '来來俫倈崃徕涞莱郲婡崍庲徠梾淶猍萊逨棶琜筙铼箂錸騋鯠鶆麳',
        lǎi: '襰',
        lài: '疠娕徕唻婡徠赉睐睞赖誺賚濑賴頼癘顂癞鵣攋瀨瀬籁藾櫴癩籟',
        lán: '兰岚拦栏啉婪惏嵐葻阑暕蓝谰厱澜褴儖斓篮懢燣燷藍襕镧闌璼幱襤譋攔瀾灆籃繿蘫蘭斕欄襴囒灡籣欗讕躝襽鑭韊',
        lǎn: '览浨揽缆榄漤罱醂壈懒覧擥嬾懶孄覽孏攬灠欖爦顲纜',
        làn: '坔烂滥燗嚂壏濫爁爛瓓爤爦糷钄',
        lāng: '啷',
        láng: '勆郞哴欴狼嫏廊斏桹琅蓈榔瑯硠稂锒筤艆蜋郒樃螂躴鋃鎯駺',
        lǎng: '崀朗朖烺塱蓢誏朤',
        làng: '埌浪莨阆筤蒗誏閬',
        lāo: '捞粩撈',
        láo: '労劳牢窂哰崂浶勞痨铹僗嘮嶗憦憥朥癆磱簩蟧醪鐒顟髝',
        lǎo: '耂老佬咾恅狫荖栳珯硓铑蛯銠鮱轑',
        lào: '涝絡嗠耢酪嫪嘮憦樂澇躼橯耮軂',
        le: '饹',
        lē: '嘞',
        lè: '仂阞叻忇扐氻艻牞玏泐竻砳楽韷餎樂簕鳓鰳鱳',
        lei: '嘞',
        lēi: '',
        léi: '絫雷嫘缧蔂樏畾磥檑縲攂礌镭櫑瓃羸礧纍罍蘲鐳轠儽鑘靁虆鱩欙纝鼺',
        lěi: '厽耒诔垒洡塁絫傫誄瘣樏磊蕌磥蕾儡壘癗礌藟櫑櫐矋礨礧灅蠝蘽讄壨鑸鸓',
        lèi: '泪洡类涙淚祱絫酹銇頛頪錑攂颣類礧纇蘱禷',
        lēng: '稜',
        léng: '唥崚塄楞碐稜薐',
        lěng: '冷',
        lèng: '倰堎愣睖踜',
        li: '',
        lī: '',
        lí: '刕杝厘柂剓狸离荲骊悡梨梸犁琍菞喱棃犂鹂剺漓睝筣缡艃蓠嫠孷樆璃盠竰貍犛糎蔾褵鋫鲡黎篱縭罹錅蟍謧醨嚟藜邌釐離鯏斄瓈蟸鏫鯬鵹麗黧囄灕蘺蠫孋廲劙鑗穲籬纚驪鱺鸝',
        lǐ: '礼李里俚峛峢娌峲悝浬逦理裡锂粴裏豊鋰鲤澧禮鯉醴蠡鳢邐鱧欚纚鱱',
        lì: '力历厉屴扐立吏扚朸利励叓呖坜杝沥苈例叕岦戾枥沴沵疠苙迣俐俪栃栎疬砅茘荔赲轹郦唎娳悧栛栗浰涖猁珕砬砺砾秝莉莅鬲唳婯悷笠粒粝脷蚸蛎傈凓厤棙痢蛠詈跞雳厯塛慄搮溧睙蒞蒚蜊鉝鳨厲暦歴瑮綟蜧銐蝷镉勵曆歷篥隷鴗巁檪濿癘磿隸鬁儮擽曞櫔爄犡禲蠇鎘嚦壢攊櫟瀝瓅礪藶麗櫪爏瓑皪盭礫糲蠣儷癧礰纅酈鷅麜囇孋攦觻躒轢欐讈轣攭瓥靂靋',
        liǎ: '俩倆',
        lián: '奁连帘怜涟莲連梿联裢亷嗹廉慩溓漣蓮匲奩槏槤熑覝劆匳噒嫾憐磏聨聫褳鲢濂濓縺翴聮薕螊櫣燫聯臁謰蹥檶鎌镰瀮簾蠊鬑鐮鰱籢籨',
        liǎn: '莶敛梿琏脸裣慩摙溓槤璉蔹嬚薟斂櫣歛臉鄻襝羷蘞蘝醶',
        liàn: '练炼恋殓僆堜媡湅萰链摙楝煉瑓潋稴練澰錬殮鍊鏈瀲鰊戀纞',
        liāng: '',
        liáng: '良俍莨梁涼椋辌粱粮墚踉樑輬駺糧',
        liǎng: '両两兩俩倆唡啢掚脼裲緉蜽魉魎',
        liàng: '亮倞哴悢谅涼辆喨晾湸靓輌踉諒輛鍄',
        liāo: '蹽',
        liáo: '辽疗窌聊尞僚寥嵺憀摎漻膋嘹嫽寮嶚嶛憭敹樛獠缭遼暸橑璙膫療竂鹩屪廫簝繚藔蟟蟧豂賿蹘爎爒飂髎飉鷯',
        liǎo: '钌釕鄝缪蓼憭繆曢爎镽爒',
        liào: '尥尦钌炓料釕廖撂窷镣鐐',
        lie: '',
        liē: '',
        lié: '',
        liě: '忚毟挘',
        liè: '列劣劦冽劽姴挒洌茢迾哷埓埒栵浖烈烮捩猎猟脟棙蛚煭聗趔綟巤獦颲燤儠巁鮤鴷擸爄獵爉犣躐鬛鬣鱲',
        līn: '拎',
        lín: '厸邻阾林临冧啉崊惏晽琳粦碄箖粼綝鄰隣嶙潾獜遴斴暽燐璘辚霖疄瞵磷臨繗翷麐轔壣瀶鏻鳞驎鱗麟',
        lǐn: '菻亃僯箖凜凛撛廩廪懍懔澟檁檩癝癛',
        lìn: '吝恡悋赁焛亃痳賃蔺獜橉甐膦閵疄藺蹸躏躙躪轥',
        líng: '伶刢灵呤囹坽夌姈岺彾泠狑苓昤朎柃玲瓴〇凌皊砱秢竛羐袊铃陵鸰婈崚掕棂淩琌笭紷绫羚翎聆舲菱蛉衑祾詅跉軨稜蓤裬鈴閝零龄綾蔆輘霊駖澪蕶錂霗魿鲮鴒鹷燯霝霛齢酃鯪孁齡櫺醽靈欞爧麢龗',
        lǐng: '岺袊领領嶺',
        lìng: '另炩蘦',
        liū: '熘澑蹓',
        liú: '刘畄斿浏流留旈琉畱硫裗媹嵧旒蒥蓅骝摎榴漻瑠飗劉瑬瘤磂镏駠鹠橊璢疁镠癅蟉駵嚠懰瀏藰鎏鎦麍鏐飀鐂騮飅鰡鶹驑',
        liǔ: '柳栁桞珋桺绺锍綹熮罶鋶橮嬼懰羀藰',
        liù: '窌翏塯廇遛澑磂磟鹨鎦霤餾雡飂鬸鷚',
        lo: '咯',
        lóng: '龙屸尨咙泷茏昽栊珑胧眬砻竜聋隆湰滝嶐槞漋癃窿篭龍儱蘢鏧霳嚨巃巄瀧曨朧櫳爖瓏襱矓礲礱蠬蠪龓龒籠聾豅躘靇鑨驡鸗',
        lǒng: '陇垅垄拢篢篭龍隴儱徿壟壠攏竉龓籠躘',
        lòng: '哢梇硦儱徿贚',
        lou: '喽嘍瞜',
        lōu: '摟',
        lóu: '剅娄偻婁喽溇蒌僂楼嘍寠廔慺漊蔞遱樓熡耧蝼瞜耬艛螻謱貗軁髅鞻髏鷜',
        lǒu: '嵝塿嶁摟甊篓簍',
        lòu: '陋屚漏瘘镂瘻瘺鏤',
        lū: '噜撸謢嚕擼',
        lú: '卢庐芦垆枦泸炉栌胪轳舮鸬玈舻颅鈩鲈馿魲盧嚧壚廬攎瀘獹璷蘆曥櫨爐瓐臚矑籚纑罏艫蠦轤鑪顱髗鱸鸕黸',
        lǔ: '卤虏掳鹵硵鲁虜塷滷蓾樐澛魯擄橹氇磠穞镥瀂櫓氌艣鏀艪鐪鑥',
        lù: '圥甪陆侓坴彔录峍勎赂辂陸娽淕淥渌硉菉逯鹿椂琭祿禄僇剹勠盝睩稑賂路輅塶廘摝漉箓粶緑蓼蔍戮樚熝膔趢踛辘醁潞穋蕗錄錴録璐簏螰鴼簶蹗轆騄鹭簬簵鏕鯥鵦鵱麓鏴騼籙觻虂鷺',
        luán: '娈孪峦挛栾鸾脔滦銮鵉圝奱孌孿巒攣曫欒灓羉臡臠圞灤虊鑾癴癵鸞',
        luǎn: '卵覶',
        luàn: '乱釠乿亂薍灓',
        lūn: '掄',
        lún: '仑伦囵沦纶芲侖轮倫陯圇婨崘崙掄淪菕棆腀碖綸耣蜦論踚輪磮錀鯩',
        lǔn: '埨惀碖稐耣',
        lùn: '惀溣碖論',
        luo: '囉囖',
        luō: '捋頱囉囖',
        luó: '寽罗猡脶萝逻椤腡锣箩骡镙螺攎羅覶鏍儸覼騾囉攞玀蘿邏欏驘鸁籮鑼饠囖',
        luǒ: '剆倮砢捰蓏裸躶瘰蠃臝曪攭癳',
        luò: '泺咯峈洛荦骆洜珞捰渃硌硦笿絡蛒跞詻摞漯犖雒駱磱鮥鵅擽濼攊皪躒纙',
        lǘ: '驴闾榈閭氀膢瞜櫚藘驢',
        lǚ: '吕呂侣郘侶挔捛捋旅梠焒祣偻稆铝屡絽缕僂屢慺膂褛鋁履膐褸儢縷穭鷜',
        lǜ: '垏律哷虑嵂氯葎滤綠緑慮箻膟勴繂濾櫖爈卛鑢',
        lüè: '寽掠畧略锊稤圙鋢鋝',
        ma: '嗎嘛麽',
        mā: '亇妈孖庅媽嫲榪螞',
        má: '菻麻嗎痲痳嘛嫲蔴犘蟇',
        mǎ: '马犸杩玛码馬嗎溤獁遤瑪碼螞鎷鰢鷌',
        mà: '杩祃閁骂傌睰嘜榪禡罵螞駡鬕',
        mái: '薶霾',
        mǎi: '买荬買嘪蕒鷶',
        mài: '劢迈佅売麦卖唛脈麥衇勱賣邁霡霢',
        mān: '颟顢',
        mán: '姏悗蛮絻谩慲摱馒樠瞞鞔謾饅鳗鬘鬗鰻矕蠻',
        mǎn: '娨屘満满滿螨襔蟎鏋矕',
        màn: '曼僈鄤墁嫚幔慢摱漫獌缦蔄槾澫熳澷镘縵鏝蘰',
        māng: '牤',
        máng: '邙吂忙汒芒尨杗杧盲盳厖恾笀茫哤娏庬浝狵朚牻硭釯铓痝蛖鋩駹蘉',
        mǎng: '莽莾硥茻壾漭蟒蠎',
        màng: '',
        māo: '貓',
        máo: '毛矛芼枆牦茅茆旄罞渵軞酕堥嵍楙锚緢鉾髦氂犛蝥貓髳錨蟊鶜',
        mǎo: '冇卯夘乮峁戼泖昴铆笷蓩鉚',
        mào: '冃皃芼冐茂柕眊秏贸旄耄袤覒媢帽萺貿鄚愗暓毷瑁瞀貌鄮蝐懋',
        me: '庅麽麼嚜',
        mē: '嚒',
        mè: '濹嚰',
        méi: '坆沒枚玫苺栂眉脄莓梅珻脢郿堳媒嵋湄湈猸睂葿楣楳煤瑂禖腜塺槑酶镅鹛鋂霉穈徾鎇攗鶥黴',
        měi: '毎每凂美挴浼羙媄嵄渼媺镁嬍燘躾鎂黣',
        mèi: '妹抺沬旀昧祙袂眛媚寐殙痗跊鬽煝睸韎魅篃蝞嚜櫗',
        mēn: '悶椚',
        mén: '门们扪汶怋玧钔門們閅捫菛璊瞞穈鍆亹斖虋',
        mèn: '悗惛焖悶暪燜鞔懑懣',
        mēng: '掹擝矇',
        méng: '尨甿虻庬莔萌溕盟雺甍鄳儚橗瞢蕄蝱鄸鋂髳幪懜懞濛獴曚朦檬氋礞鯍鹲艨矒靀霿饛顭鸏',
        měng: '黾冡勐猛黽锰艋蜢瞢懜懞蟒錳懵蠓鯭矒鼆',
        mèng: '孟梦夢夣懜霥癦',
        mī: '咪瞇',
        mí: '冞祢迷袮猕谜蒾詸摵瞇謎醚彌擟瞴縻藌麊麋麿檷禰靡瀰獼蘪麛镾戂攠瓕蘼爢醾醿鸍釄',
        mǐ: '米芈侎沵羋弭洣敉粎脒渳葞蔝銤彌濔孊攠灖',
        mì: '冖糸汨沕宓怽枈觅峚祕宻密淧覔覓幂谧塓幎覛嘧榓滵漞熐蔤蜜鼏冪樒幦濗謐櫁簚羃',
        mián: '宀芇杣眠婂绵媔棉綿緜臱蝒嬵檰櫋矈矊矏',
        miǎn: '丏汅免沔黾勉眄娩莬偭冕勔渑喕媔愐湎睌缅葂黽絻腼澠緬靦鮸',
        miàn: '靣面牑糆麫麪麺麵',
        miāo: '喵',
        miáo: '苗媌描瞄鹋嫹緢鶓',
        miǎo: '厸仯劰杪眇秒淼渺缈篎緲藐邈',
        miào: '妙庙玅竗庿缪廟繆',
        miē: '乜吀咩哶孭',
        mié: '',
        miè: '灭烕眜覕搣滅蔑薎鴓幭懱瀎篾櫗簚礣蠛衊鑖鱴',
        mín: '民忟垊姄岷忞怋旻旼玟苠珉盿砇罠崏捪渂琘琝缗暋瑉痻碈鈱緍緡賯錉鴖鍲',
        mǐn: '皿冺刡忟闵呡忞抿泯黾勄敃闽悯敏笢笽惽湏湣閔黽愍敯暋僶閩慜憫潣簢鳘蠠鰵',
        míng: '名明鸣洺眀茗冥朙眳铭鄍嫇溟猽蓂詺暝榠銘鳴瞑螟覭',
        mǐng: '佲姳凕嫇慏酩',
        mìng: '命掵',
        miǔ: '',
        miù: '谬缪繆謬',
        mō: '摸嚤',
        mó: '庅尛谟嫫馍摹膜骳麽麼魹橅糢嬤嬷謨謩擵饃蘑髍魔劘戂攠饝',
        mǒ: '懡',
        mò: '末圽沒妺帓殁歿歾沫茉陌帞昩枺狢皌眜眿砞秣莈眽絈袹絔蛨貃嗼塻寞漠獏蓦貈貊貉銆靺墨嫼瘼瞐瞙镆魩黙縸默瀎貘嚜藦蟔鏌爅驀礳纆耱',
        mōu: '哞',
        móu: '牟侔劺呣恈敄桙眸谋堥蛑缪踎謀繆鍪鴾麰鞪',
        mǒu: '厶某',
        mòu: '',
        mú: '毪氁',
        mǔ: '母亩牡坶姆拇畂峔牳畆畒胟娒畝畞砪畮鉧踇',
        mù: '木仫目凩朷牟沐狇坶炑牧苜毣莯蚞钼募雮墓幙幕慔楘睦鉬慕暯暮缪樢艒霂穆縸繆鞪',
        n: '',
        ń: '唔嗯',
        ň: '嗯',
        na: '',
        nā: '',
        ná: '秅拏拿挐嗱蒘搻誽镎鎿',
        nǎ: '乸雫',
        nà: '吶妠抐纳肭郍衲钠納袦捺笚笝豽軜貀鈉蒳靹魶',
        nái: '腉搱摨孻',
        nǎi: '乃奶艿氖疓妳廼迺倷釢嬭',
        nài: '佴奈柰耏耐萘渿鼐褦螚錼',
        nān: '囝囡',
        nán: '男抩枏侽柟娚畘莮喃遖暔楠諵難',
        nǎn: '赧揇湳萳煵腩嫨蝻戁',
        nàn: '妠婻諵難',
        nāng: '儾囔',
        náng: '乪涳搑憹嚢蠰饟馕欜饢',
        nǎng: '搑擃瀼曩攮灢馕',
        nàng: '儾齉',
        nāo: '孬',
        náo: '呶怓挠峱桡硇铙猱蛲詉碙摎撓嶩憹橈獶蟯夒譊鐃巎獿',
        nǎo: '垴恼悩脑匘脳堖惱嫐瑙腦碯憹獶',
        nào: '闹婥淖閙鬧臑',
        ne: '',
        né: '',
        nè: '疒讷吶抐眲訥',
        néi: '',
        něi: '娞浽馁脮腇餒鮾鯘',
        nèi: '內氝氞錗',
        nèn: '恁媆嫩嫰',
        néng: '',
        něng: '螚',
        nèng: '',
        ńg: '唔嗯',
        ňg: '嗯',
        nī: '妮',
        ní: '尼坭怩抳籾倪屔秜郳铌埿婗淣猊蚭棿蛪跜鈮聣蜺馜觬貎輗霓鲵鯢麑齯臡',
        nǐ: '伱伲你拟妳抳狔苨柅婗掜旎晲棿孴儞儗隬懝擬濔薿檷聻',
        nì: '屰氼伲抐昵胒逆匿眤秜堄惄嫟愵睨腻暱縌誽膩嬺',
        niān: '拈蔫',
        nián: '年秊哖姩秥粘溓鲇鮎鲶鵇黏鯰',
        niǎn: '涊淰焾辇榐辗撚撵碾輦簐蹍攆蹨躎',
        niàn: '卄廿念姩唸埝悥惗艌',
        niáng: '娘嬢孃釀',
        niǎng: '',
        niàng: '酿醸釀',
        niǎo: '鸟茑袅鳥嫋裊蔦樢嬝褭嬲',
        niào: '脲',
        niē: '捏揑',
        nié: '苶',
        niě: '',
        niè: '乜帇圼峊枿陧涅痆聂臬啮掜菍隉敜湼嗫嵲踂噛摰槷踗踙銸镊镍嶭篞臲鋷錜颞蹑嚙聶鎳闑孼孽櫱籋蘖囁攝齧巕糱糵蠥鑈囐囓讘躡鑷顳钀',
        nín: '囜恁脌您',
        nǐn: '拰',
        níng: '咛狞苧柠聍寍寕甯寗寜寧儜凝橣嚀嬣擰獰薴檸聹鑏鬡鸋',
        nǐng: '擰矃',
        nìng: '佞侫泞倿寍寕甯寗寜寧澝擰濘',
        niū: '妞孧',
        niú: '牜牛汼怓',
        niǔ: '忸扭沑狃纽杻炄钮紐莥鈕靵',
        niù: '抝',
        nóng: '农侬哝浓脓秾農儂辳噥濃蕽檂燶禯膿癑穠襛譨醲欁鬞',
        nǒng: '繷',
        nòng: '挊挵癑齈',
        nóu: '羺',
        nǒu: '',
        nòu: '搙槈耨獳檽鎒鐞',
        nú: '奴伮孥帑驽笯駑',
        nǔ: '伮努弩砮胬',
        nù: '怒傉搙',
        nuán: '奻渜',
        nuǎn: '渜湪暖煖煗餪',
        nuàn: '',
        nuó: '挪梛傩橠難儺',
        nuǒ: '袳袲',
        nuò: '耎诺喏掿毭逽愞搙搦锘搻榒稬諾蹃糑鍩懧懦糥穤糯',
        nǘ: '',
        nǚ: '钕籹釹',
        nǜ: '沑衂恧朒衄聏',
        nüè: '虐婩硸瘧',
        o: '筽',
        ō: '喔噢',
        ó: '哦',
        ǒ: '嚄',
        ò: '哦',
        ou: '',
        ōu: '讴吽沤欧殴瓯鸥區嘔塸漚歐毆熰甌膒鴎櫙藲謳鏂鷗',
        óu: '',
        ǒu: '吘禺偶腢嘔熰耦蕅藕',
        òu: '怄沤嘔慪漚',
        pā: '汃妑苩皅趴舥啪葩',
        pá: '杷爬钯掱琶筢潖',
        pǎ: '',
        pà: '汃帊帕怕袙',
        pāi: '拍',
        pái: '俳徘猅棑牌箄輫簲簰犤',
        pǎi: '廹',
        pài: '沠哌派渒湃蒎鎃',
        pān: '眅畨萠潘攀籓',
        pán: '丬爿肨柈洀胖眫湴盘跘媻幋蒰搫槃盤磐縏膰磻蹒瀊蟠蹣鎜鞶',
        pǎn: '坢盻',
        pàn: '冸判沜拚泮炍肨叛牉盼胖畔聁袢詊溿頖鋬闆鵥襻鑻',
        pāng: '乓汸沗胮雱滂膖霶',
        páng: '厐夆尨彷庞逄庬趽舽嫎徬膀篣螃鳑龎龐鰟',
        pǎng: '嗙耪覫',
        pàng: '炐肨胖眫',
        pāo: '抛拋脬萢藨穮',
        páo: '咆垉庖狍炰爮瓟袍铇匏烰袌跁軳鉋鞄褜麃麅',
        pǎo: '',
        pào: '奅疱皰砲袌靤麭嚗礟礮',
        pēi: '妚呸怌抷肧柸胚衃醅',
        péi: '阫陪培婄毰赔锫裵裴賠錇',
        pěi: '俖琣',
        pèi: '伂妃沛犻佩帔姵斾柭旆浿珮配淠棑媐蓜辔馷嶏霈攈轡',
        pēn: '噴濆歕',
        pén: '瓫盆湓葐',
        pěn: '呠翸',
        pèn: '喯噴',
        pēng: '亨匉怦抨泙恲胓砰梈烹硑絣軯剻閛漰嘭駍磞',
        péng: '芃朋挷竼倗捀莑堋弸淜袶棚椖傰塜塳搒漨痭硼稝蓬鹏樥熢憉澎輣篣篷膨錋韸髼蟚蟛鬅纄蘕韼鵬騯鬔鑝',
        pěng: '捧淎皏摓',
        pèng: '掽椪碰閛槰踫磞',
        pi: '榌',
        pī: '丕伓伾妚批纰邳坯岯怶披抷枈炋狉狓砒悂秛秠紕铍陴旇翍耚豾釽鈚鉟銔磇駓髬噼錃錍魾憵礕礔鎞霹',
        pí: '皮仳阰纰芘陂枇肶毘毗疲笓紕蚍郫铍啤埤崥猈蚾蚽豼焷琵禆脾腗裨鈹鲏罴膍蜱罷隦魮壀螕鮍篺螷貔鞞鵧羆朇鼙蠯',
        pǐ: '匹庀疋仳圮吡苉悂脴痞銢嶏諀鴄擗噽癖嚭',
        pì: '屁埤淠揊嫓媲睥潎稫僻澼嚊濞甓疈譬闢鷿鸊',
        piān: '囨偏媥楄犏篇翩鍂鶣',
        pián: '骈胼缏腁楩賆跰瑸緶骿蹁駢璸騈',
        piǎn: '覑谝貵諞',
        piàn: '猵骗魸獱騗騙',
        piāo: '剽勡嘌嫖彯慓缥飘旚縹翲螵犥飃飄魒',
        piáo: '嫖瓢薸闝',
        piǎo: '莩殍缥瞟篻縹醥皫顠',
        piào: '僄彯徱骠驃鰾',
        piē: '氕覕潎撆暼瞥',
        piě: '丿苤鐅',
        piè: '嫳',
        pīn: '拚姘拼砏礗穦馪驞',
        pín: '玭贫娦貧琕嫔嬪薲嚬矉蘋蠙颦顰',
        pǐn: '品榀',
        pìn: '牝汖聘',
        pīng: '乒甹俜娉涄砯聠艵頩',
        píng: '平评凭呯坪岼泙郱帡庰枰洴玶胓荓瓶帲淜硑萍蚲塀幈焩甁缾蓱蛢評馮軿鲆凴竮鉼慿箳輧憑鮃檘簈蘋',
        pǐng: '屛',
        pìng: '',
        pō: '钋陂坡岥泺泼釙翍颇溌酦頗潑醗濼醱鏺',
        pó: '婆嘙搫蔢鄱皤櫇嚩',
        pǒ: '叵尀钷笸鉕箥駊髲',
        pò: '廹岶敀昢洦珀哱烞砶破粕奤湐猼蒪魄',
        pōu: '抙剖娝捊',
        póu: '抔抙垺捊掊裒箁',
        pǒu: '咅哣婄掊棓犃',
        pū: '攵攴扑抪炇柨陠痡秿噗撲潽鋪鯆',
        pú: '圤匍捗莆菩菐葡蒲蒱僕箁酺墣獛璞濮瞨穙镤贌纀鏷',
        pǔ: '圃埔浦烳普圑溥暜谱諩擈樸氆檏镨譜蹼鐠',
        pù: '痡舗舖鋪曝',
        qi: '啐',
        qī: '七迉沏恓柒倛凄桤郪娸悽戚捿桼淒萋喰攲敧棲欹欺紪缉傶褄僛嘁墄慽榿漆緀慼緝諆踦螇霋蹊魌鏚鶈',
        qí: '丌亓伎祁圻岓岐忯芪亝斉歧畁祇祈肵俟疧荠剘斊旂竒耆脐蚔蚑蚚陭颀埼崎帺掑淇猉畦萁萕跂軝釮骐骑嵜棊棋琦琪祺蛴隑愭碁碕稘褀锜頎鬿旗粸綥綨綦蜝蜞齊璂禥蕲觭螧錡鲯懠濝薺藄鄿檱櫀簯簱臍騎騏鳍蘄鯕鵸鶀麒籏艩蠐鬐騹鰭玂麡',
        qǐ: '乞邔企屺芑启呇杞玘盀唘豈起啔啓啟婍梩绮袳跂晵棨綮綺諬闙',
        qì: '气讫忔扱気汔迄呚弃汽矵芞亟呮泣炁盵咠洓竐栔欫氣訖唭焏夡愒棄湆湇葺滊碛摖暣甈碶噐憇槭趞器憩磜磧磩藒礘罊蟿鐑',
        qiā: '抲掐袷揢葜擖',
        qiá: '',
        qiǎ: '拤峠跒酠鞐',
        qià: '圶冾匼咭帢恰洽胢殎硈愘磍髂',
        qiān: '千仟阡圱圲奷扦汘芊迁佥岍杄汧茾欦竏臤钎拪牵粁悭挳蚈谸婜孯牽釺掔谦鈆僉愆签鉛骞鹐慳搴摼撁厱磏諐遷鳽褰謙顅檶攐攑櫏簽鏲鵮孅攓騫籖鬜鬝籤韆',
        qián: '仱岒忴扲拑玪乹前炶荨钤歬虔蚙钱钳偂掮揵軡亁媊朁犍葥鈐煔鉗墘榩箝銭撍潛潜羬蕁橬錢黔鎆黚騝濳騚灊鰬',
        qiǎn: '凵肷唊淺嵰遣槏膁蜸谴缱繾譴鑓',
        qiàn: '欠刋伣芡俔茜倩悓堑掅傔棈椠欿嗛慊皘蒨塹歉綪蔳儙槧篏輤篟壍嬱縴',
        qiāng:
          '羌戕戗斨枪玱矼羗猐啌跄嗴椌溬獇腔嗆搶蜣锖嶈戧摤槍牄瑲羫锵篬謒蹌蹡鎗鏘鏹鶬',
        qiáng: '強墙嫱蔷樯漒蔃墻嬙廧彊薔檣牆艢蘠',
        qiǎng: '強羟搶羥墏彊繈襁镪繦鏹',
        qiàng: '戗炝唴跄嗆戧摪熗羻',
        qiāo: '帩硗郻喿嵪煍跷鄥鄡劁勪幓敲毃踍锹墝碻磝頝骹墽幧橇燆缲橾磽鍬鍫礉繑繰趬蹺蹻鏒鐰',
        qiáo: '乔侨峤荍荞桥硚菬喬睄僑摮槗谯嘺墧嫶嶠憔潐蕎鞒樵橋燋犞癄瞧礄翹櫵藮譙趫鐈鞽顦',
        qiǎo: '丂巧釥愀髜',
        qiào: '诮陗峭窍偢殻殼誚髚僺嘺撬箾噭撽鞘韒礉竅翹鞩躈',
        qiē: '苆',
        qié: '癿伽茄聺',
        qiě: '',
        qiè: '厒妾怯疌郄匧窃悏挈栔洯帹惬淁笡愜椄猰蛪趄跙嗛慊朅稧箧锲篋踥穕鍥鯜竊籡',
        qīn: '兓侵钦衾骎菳媇嵚欽嵰綅誛嶔親顉駸鮼寴',
        qín: '庈忴扲芩芹肣矜埐珡矝秦耹菦蚙捦菳琴琹禽覃鈙鈫雂勤嗪嫀溱靲廑慬噙嶜擒斳鳹懄檎澿瘽螓懃蠄鵭',
        qǐn: '坅昑笉梫赾寑锓寝寖寢鋟螼',
        qìn: '吢吣抋沁唚菣揿搇撳寴瀙藽',
        qīng: '靑青氢轻倾卿郬圊埥寈氫淸清軽傾綪蜻輕錆鲭鯖鑋',
        qíng: '夝甠剠勍啨情殑硘晴棾氰葝暒擏樈擎檠黥',
        qǐng: '苘顷请庼頃廎漀請檾謦',
        qìng: '庆凊掅殸渹碃箐綮靘慶磬親儬濪罄櫦',
        qiōng: '',
        qióng:
          '卭邛宆穷穹茕桏惸琁筇笻赹焪焭琼舼蛬蛩煢熍睘跫銎瞏窮儝嬛憌橩璚藑瓊竆藭瓗',
        qiòng: '',
        qiū: '丘丠邱坵恘秌秋恷蚯媝湫萩楸湬塸蓲鹙篍緧蝵穐趥龜橚鳅蟗鞦鞧蘒鰌鰍鶖蠤龝',
        qiú: '厹叴囚扏犰玌艽芁朹汓肍求虬泅牫虯俅觓訅訄酋唒浗紌莍逎逑釚梂殏毬球赇釻頄崷巯渞湭皳盚遒煪絿蛷裘巰觩賕璆蝤銶醔鮂鼽鯄鰽',
        qiǔ: '搝糗',
        qiù: '',
        qū: '伹佉匤岖诎阹驱呿坥屈岴抾浀祛胠袪區焌紶蛆躯煀筁粬蛐詘趍嶇憈駆敺觑誳駈麹髷魼趨麯覰覷軀鶌麴黢覻驅鰸鱋',
        qú: '佢劬斪朐胊菃衐鸲淭絇翑蚼葋軥蕖璖磲螶鴝璩翵蟝瞿鼩蘧忂灈戵欋氍爠籧臞癯欔蠷衢躣蠼鑺鸜',
        qǔ: '苣取竘娶紶詓竬蝺龋齲',
        qù: '去厺刞欪耝阒觑閴麮闃鼁覰覷覻',
        quān: '奍弮悛圏棬椦箞鐉',
        quán: '全权佺狋诠姾峑恮泉洤荃拳牷辁啳埢婘惓捲痊硂铨椦湶犈筌絟葲搼楾瑔觠詮跧輇蜷銓槫権踡縓醛駩闎鳈鬈騡孉巏鰁權齤矔蠸颧顴灥',
        quǎn: '犭犬犮畎烇绻綣虇',
        quàn: '劝牶勧韏勸灥',
        quē: '炔缺缼蚗蒛阙闕',
        qué: '瘸',
        què: '汋却卻埆崅悫琷傕敠敪棤硞确阕塙搉皵碏阙鹊愨榷墧慤碻確趞燩闋礐闕鵲礭',
        qūn: '夋囷逡箘歏',
        qún: '宭峮帬裙羣群裠麇',
        qǔn: '',
        rán: '呥肰衻袇蚦袡蚺然髥嘫髯燃繎',
        rǎn: '冄冉姌苒染珃媣蒅熯橪',
        ràn: '',
        rāng: '',
        ráng: '穣儴勷瀼獽蘘禳瓤穰躟鬤',
        rǎng: '壌壤攘爙纕',
        ràng: '让懹譲讓',
        ráo: '娆荛饶桡嬈蕘橈襓饒',
        rǎo: '扰娆隢嬈擾',
        rào: '绕遶穘繞',
        ré: '捼',
        rě: '喏惹',
        rè: '热渃熱',
        rén: '亻人仁壬忈朲忎秂芢魜銋鵀',
        rěn: '忍荏栠栣荵秹菍棯稔綛躵銋',
        rèn: '刃刄认仞仭讱屻岃扨纫妊杒牣纴肕轫韧饪祍姙紉衽紝訒軔梕袵釰釼絍腍鈓靱靭韌飪認餁',
        rēng: '扔',
        réng: '仍辸礽芿陾',
        rì: '日驲囸氜衵釰釼鈤馹',
        róng: '戎肜栄狨绒茙茸荣容峵毧烿傛媶嵘搑絨羢嫆嵤搈榵溶蓉榕榮熔瑢穁槦縙蝾褣镕螎融駥嬫嶸爃鎔瀜曧蠑',
        rǒng: '冗宂坈傇軵縙氄',
        ròng: '穃縙',
        róu: '厹禸柔粈脜媃揉渘葇楺煣瑈腬糅蝚蹂輮鍒鞣瓇騥鰇鶔',
        rǒu: '韖',
        ròu: '肉宍楺譳',
        rū: '嶿',
        rú: '邚如吺侞帤茹挐桇袽铷渪筎蒘銣蕠蝡儒鴑嚅嬬孺濡獳薷鴽曘檽襦繻蠕颥醹顬鱬',
        rǔ: '汝肗乳辱鄏擩',
        rù: '入扖杁洳嗕媷溽缛蓐鳰褥縟',
        ruán: '堧撋壖',
        ruǎn: '阮朊软耎偄軟媆瑌腝碝緛輭檽瓀礝',
        ruàn: '緛',
        ruí: '苼桵甤緌蕤',
        ruǐ: '惢蕋蕊橤繠壡蘃蘂',
        ruì: '兊兌抐汭芮枘笍蚋锐瑞蜹睿銳鋭叡鏸',
        rún: '瞤',
        rǔn: '',
        rùn: '闰润閏閠潤橍膶',
        ruó: '挼捼',
        ruò: '叒偌弱鄀婼渃焫楉嵶蒻箬篛爇鰙鰯鶸',
        sa: '',
        sā: '仨',
        sǎ: '訯靸潵鞈攃灑躠纚',
        sà: '卅泧钑飒脎萨鈒摋隡馺蕯颯薩櫒鏾',
        sāi: '毢愢揌毸腮嘥噻鳃顋鰓',
        sǎi: '嗮',
        sài: '赛僿賽簺',
        san: '壭',
        sān: '三弎叁參叄叅毶毵厁毿犙鬖',
        sǎn: '仐伞傘糁馓糝糤糣繖鏒鏾饊',
        sàn: '俕帴閐潵',
        sāng: '桒桑喪槡',
        sǎng: '嗓搡磉褬颡鎟顙',
        sàng: '喪',
        sāo: '掻慅搔溞缫懆缲螦繅鳋颾騒繰騷鰠鱢',
        sǎo: '埽掃嫂',
        sào: '埽掃瘙懆氉矂髞',
        sē: '閪',
        sè: '色拺洓栜涩啬渋粣铯雭歮琗嗇瑟摵歰銫槭澁廧懎擌濇濏瘷穑薔澀璱瀒穡鎍繬穯轖鏼闟譅飋',
        sēn: '森椮槮襂',
        sěn: '',
        sēng: '僧鬙',
        sèng: '',
        sī: '厶纟丝司糹糸私咝泀俬恖虒鸶偲傂媤愢斯絲缌蛳楒禗鉰飔凘厮禠罳蜤銯锶嘶噝廝撕澌磃緦蕬鋖燍螄鍶蟖蟴颸騦鯣鐁鷥鼶',
        sí: '',
        sǐ: '死愢',
        sì: '巳亖四寺汜佀兕姒泤祀価孠杫泗饲驷俟娰枱柶洠牭洍涘肂飤梩笥耛耜釲竢覗嗣肆貄鈶鈻飴飼榹銉禩駟蕼儩騃瀃',
        sōng: '忪枀松枩娀柗倯凇崧庺梥淞菘愡揔棇嵩硹憽濍檧鬆',
        sóng: '',
        sǒng: '怂悚捒耸竦傱愯楤嵷摗漎慫聳駷',
        sòng: '吅讼宋诵送颂訟頌誦鎹餸',
        sōu: '凁捒捜鄋嗖廀廋搜溲獀蒐蓃馊摉飕摗锼撨艘螋醙鎪餿颼颾鏉騪',
        sǒu: '叜叟傁棷蓃嗾瞍擞薮擻藪櫢籔',
        sòu: '欶嗽擞瘶擻',
        sū: '甦酥稡稣窣穌鯂蘇蘓櫯囌',
        sú: '圱俗',
        sǔ: '',
        sù: '玊夙诉泝肃洬涑珟素莤速埣梀殐粛骕傃棴粟訴谡嗉塑塐嫊愫溯溸肅遡鹔僳愬摵榡膆蔌觫趚遬憟樕樎潥碿鋉餗潚縤橚璛簌縮藗謖蹜驌鱐鷫',
        suān: '狻痠酸',
        suǎn: '匴篹',
        suàn: '祘笇筭蒜算',
        suī: '夊芕虽倠哸娞浽荾荽眭毸滖睢缞嗺熣濉縗鞖雖',
        suí: '绥隋随遀綏隨瓍髄',
        suǐ: '膸瀡髓',
        suì: '亗岁砕祟谇埣嵗遂歲歳煫睟碎隧嬘澻穂誶賥檖燧璲禭穗穟繀襚邃旞繐繸譢鐆鏸鐩韢',
        sūn: '狲荪孫喰飧飱搎猻蓀槂蕵薞',
        sǔn: '扻损笋隼筍損榫箰簨鎨鶽',
        sùn: '摌',
        suō: '唆娑挱莏莎傞挲桫梭睃嗍嗦羧蓑摍趖簑簔縮鮻',
        suó: '',
        suǒ: '所乺唢索琑琐嫅惢锁嗩暛溑獕瑣褨璅縒鎍鎖鎻鏁',
        suò: '逤溹蜶',
        shā: '杀杉纱乷剎砂唦挱殺猀粆紗莎挲桬毮铩痧硰摋蔱裟榝樧魦鲨閷髿鎩鯊鯋繺',
        shá: '啥',
        shǎ: '傻儍',
        shà: '倽唼啑帹菨萐喢嗄廈歃翜歰箑翣濈閯霎',
        shāi: '筛篩諰簁簛籭',
        shǎi: '摋',
        shài: '晒攦曬',
        shān: '山彡邖圸删刪杉芟姍姗衫钐埏挻柵炶狦珊舢痁脠軕笘釤閊傓跚剼搧煔嘇幓煽潸澘穇檆縿膻鯅羴羶',
        shán: '',
        shǎn: '闪陕炶陝閃閄晱煔睒摻熌覢',
        shàn: '讪汕姍姗疝钐剡訕赸掞釤善單椫禅銏骟僐鄯儃墡墠撣潬缮嬗嶦擅敾樿歚禪膳磰謆赡繕蟮蟺譱贍鐥饍騸鳝鳣灗鱓鱔',
        shang: '',
        shāng: '伤殇商愓湯觞傷禓墒慯滳漡蔏殤熵螪觴謪鬺',
        shǎng: '垧扄晌埫赏樉賞鋿鏛贘鑜',
        shàng: '丄尙尚恦绱緔鞝',
        shāo: '娋弰烧莦焼萷旓筲艄輎蕱燒鞘髾鮹',
        sháo: '勺芍杓苕柖玿韶',
        shǎo: '',
        shào: '佋劭卲邵绍柖哨娋袑紹睄綤潲',
        shē: '奓奢猞赊畭畬畲輋賒賖檨',
        shé: '舌佘虵阇揲蛥闍磼',
        shě: '舍捨',
        shè: '厍设社泏舎舍厙挕涉涻渉設赦弽慑摂滠慴蔎歙蠂韘騇懾攝灄麝欇',
        shéi: '誰',
        shēn: '申屾扟伸身侁冞呻妽籶绅罙诜姺柛氠珅穼籸娠峷甡眒砷莘參叄堔敒深紳兟叅棽葠裑訷嫀搷罧蓡詵幓甧糁蔘糂燊薓駪鲹曑糝糣鯓鵢鯵鰺',
        shén: '神榊鉮鰰',
        shěn: '邥吲弞抌审矤哂矧宷谂谉婶淰渖訠棯審諗頣魫曋瞫嬸瀋覾讅',
        shèn: '肾侺昚胂涁眘渗祳脤谌腎葚愼慎椹瘆蜄蜃滲鋠瘮黮',
        shēng: '升生阩呏声斘昇枡泩狌苼殅牲珄竔陞曻陹殸笙湦焺甥鉎聲鍟鼪鵿',
        shéng: '渑绳憴澠縄繉繩譝',
        shěng: '眚偗渻',
        shèng: '圣乗娍胜晠晟剰剩勝椉貹嵊琞聖墭榺蕂橳賸',
        shi: '辻籂',
        shī: '尸失师厔呞虱诗邿鸤屍施浉狮師絁釶湤湿葹溮溼獅蒒蓍詩鉇嘘瑡酾鳲噓箷蝨鳾褷鲺濕鍦鯴鰤鶳襹釃',
        shí: '十饣乭时竍実实旹飠姼峕炻祏蚀埘宲時莳寔湜遈塒嵵溡蒔鉐實榯碩蝕鲥鮖鼫識鼭鰣',
        shǐ: '史矢乨豕使始驶兘宩屎狶痑笶榁鉂駛',
        shì: '士礻丗世仕市示卋式忕亊忯戺事侍势呩柹视试饰冟咶室峙恀恃拭昰是枾柿狧眂贳适栻烒眎眡耆舐莳轼逝铈啫埶畤秲視釈崼崻弑徥惿揓谥貰释勢嗜弒楴煶睗筮蒔觢試軾鈰鉃飾舓誓適鉽馶奭銴餝餙噬嬕澨澤諡諟遾檡螫謚簭襫醳釋鰘',
        shōu: '収收敊',
        shóu: '熟',
        shǒu: '扌手守垨首艏',
        shòu: '寿受狩兽售授涭绶痩膄壽夀瘦綬嘼獣獸鏉',
        shū: '书殳疋忬抒纾叔杸枢陎姝倐倏捈書殊紓婌悆掓梳淑焂菽軗鄃琡疎疏舒摅毹毺綀输瑹跾踈樞緰蔬輸橾鮛儵攄瀭鵨',
        shú: '朮尗秫孰赎蒣塾熟璹贖',
        shǔ: '鼡暏暑稌黍署蜀鼠數潻薥薯曙癙藷襡糬襩屬籔蠴鱪鱰',
        shù: '朮戍束沭述侸俞兪咰怸怷树竖荗恕捒庻庶絉蒁術隃尌裋竪腧鉥墅漱潄數澍豎樹濖錰霔鏣鶐虪',
        shuā: '唰',
        shuǎ: '耍',
        shuà: '誜',
        shuāi: '缞摔縗',
        shuǎi: '甩',
        shuài: '帅帥蟀卛',
        shuān: '闩拴閂栓絟',
        shuàn: '涮腨槫',
        shuāng: '双泷霜雙孀瀧骦孇騻欆礵鷞鹴艭驦鸘',
        shuǎng: '爽塽慡漺縔鏯',
        shuàng: '灀',
        shuí: '谁脽誰',
        shuǐ: '氵水氺閖',
        shuì: '帨挩捝涗涚娷祱稅税裞睡說説',
        shǔn: '吮楯',
        shùn: '顺眴舜順蕣橓瞚瞤瞬鬊',
        shuō: '說説',
        shuò: '妁洬烁朔铄欶矟搠蒴銏愬槊獡碩數箾鎙爍鑠',
        ta: '侤',
        tā: '他它牠祂趿铊塌榙溻鉈褟闧',
        tá: '',
        tǎ: '塔溚墖獭鮙鳎獺鰨',
        tà: '沓挞狧闼粏崉涾傝嗒搨遝遢阘榻毾漯禢撻澾誻踏鞈嚃橽錔濌蹋鞜鎉鎑闒鞳蹹躂嚺闟闥譶躢',
        tāi: '囼孡珆胎',
        tái: '旲邰坮抬骀枱炱炲菭跆鲐箈臺颱駘儓鮐嬯擡薹檯斄籉',
        tǎi: '奤',
        tài: '太冭夳忕汏忲汰汱态肽钛泰舦酞鈦溙態燤',
        tān: '坍贪怹啴痑舑貪摊滩嘽潬瘫擹攤灘癱',
        tán: '坛昙倓谈郯埮婒惔弾覃榃痰锬谭嘾墰墵彈憛潭談醈壇曇橝澹燂錟檀顃罈藫壜繵譚貚醰譠罎',
        tǎn: '忐坦袒钽菼毯僋鉭嗿緂儃憳憻暺醓璮襢',
        tàn: '叹炭倓埮探傝湠僋嘆碳舕歎',
        tāng: '铴湯嘡劏羰蝪薚镗蹚鏜闛鞺鼞',
        táng: '坣唐堂傏啺愓棠鄌塘嵣搪溏蓎隚榶漟煻瑭禟膅樘磄糃膛橖篖糖螗踼糛螳赯醣鎕餹鏜闛饄鶶',
        tǎng: '伖帑偒傥耥躺镋鎲儻戃灙曭爣矘钂',
        tàng: '烫铴摥燙鐋',
        tāo: '夲夵弢抭涛绦掏涭絛詜嫍幍慆搯滔槄瑫韬飸縚縧濤謟轁鞱韜饕',
        táo: '匋迯咷洮逃桃陶啕梼淘绹萄祹裪綯蜪鞀醄鞉鋾駣檮饀騊鼗',
        tǎo: '讨討',
        tào: '套',
        tè: '忑忒特脦犆铽慝鋱蟘',
        tēng: '熥膯鼟',
        téng: '疼痋幐腾誊漛滕邆縢螣駦謄儯藤騰籐鰧籘虅驣',
        tèng: '霯',
        tī: '剔梯锑踢銻擿鷉鷈體',
        tí: '苐厗荑桋绨偍珶啼媂媞崹惿渧稊缇罤遆鹈嗁瑅禔綈睼碮褆徲漽磃緹蕛题趧蹄醍謕蹏鍗鳀題鮷鵜騠鯷鶗鶙禵鷤',
        tǐ: '挮徥躰骵醍軆體',
        tì: '戻奃屉剃朑俶倜悌挮涕眣绨逖啑屜悐惕掦笹逷屟惖揥替棣綈裼褅歒殢髰薙嚏鬀嚔瓋鬄籊趯',
        tiān: '天兲呑婖添酟靔黇靝',
        tián: '田屇沺恬畑畋盷胋钿甛甜菾湉塡搷阗瑱碵緂磌窴鴫璳闐鷆鷏',
        tiǎn: '奵忝殄倎栝唺悿淟紾铦晪琠腆觍痶睓舔銛餂覥賟銽錪',
        tiàn: '掭菾琠瑱舚',
        tiāo: '旫佻庣恌條祧聎',
        tiáo: '芀朷岧岹苕迢祒條笤萔铫蓚蓨蓧龆樤蜩銚調鋚鞗髫鲦鯈鎥齠鰷',
        tiǎo: '宨晀朓脁窕誂斢窱嬥',
        tiào: '啁眺粜絩覜趒糶',
        tiē: '怗贴萜聑貼跕',
        tié: '',
        tiě: '铁蛈鉄僣銕鐡鐵驖',
        tiè: '呫飻餮',
        tīng: '厅庁汀听庍耓厛烃桯烴渟綎鞓聴聼廰聽廳',
        tíng: '邒廷亭庭莛停婷嵉渟筳葶蜓楟榳閮霆聤蝏諪鼮',
        tǐng: '圢甼町侹侱娗挺涏梃烶珽脡铤艇颋誔鋌閮頲',
        tìng: '忊梃濎',
        tōng: '囲炵通痌絧嗵蓪樋',
        tóng: '仝佟彤侗峂庝哃垌峒峝狪茼晍桐浵烔砼蚒偅痌眮秱铜硧童粡絧詷赨酮鉖僮勭鉵銅餇鲖潼獞曈朣橦氃燑犝膧瞳穜鮦',
        tǒng: '侗统捅桶筒統筩綂',
        tòng: '恸痛衕慟憅',
        tou: '',
        tōu: '偸偷婾媮緰鋀鍮',
        tóu: '亠投骰頭',
        tǒu: '妵紏敨飳斢黈蘣',
        tòu: '透埱',
        tu: '汢',
        tū: '凸宊禿秃怢突涋捸堗湥痜葖嶀鋵鵚鼵',
        tú: '図图凃峹庩徒悇捈涂荼莵途啚屠梌菟揬稌趃塗嵞瘏筡腯蒤鈯圗圖廜摕潳瑹跿酴墿馟檡鍎駼鵌鶟鷋鷵',
        tǔ: '土圡钍唋釷',
        tù: '兎迌兔唋莵堍菟鋀鵵',
        tuān: '湍猯圕煓貒',
        tuán: '団团抟剸團塼慱摶漙槫篿檲鏄糰鷒鷻',
        tuǎn: '畽墥疃',
        tuàn: '彖湪猯褖貒',
        tuī: '忒推蓷藬讉',
        tuí: '弚颓僓隤墤尵橔頺頹頽魋穨蘈蹪',
        tuǐ: '俀聉腿僓蹆骽',
        tuì: '侻退娧煺蛻蜕螁駾',
        tūn: '吞呑旽涒啍朜焞噋憞暾',
        tún: '坉庉忳芚饨蛌豘豚軘飩鲀魨霕黗臀臋',
        tǔn: '氽',
        tùn: '',
        tuō: '乇仛讬托扡汑饦杔侂咃咜拕拖沰挩捝莌袉袥託啴涶脫脱飥馲魠鮵',
        tuó: '阤驮佗陀陁坨岮沱沲狏驼侻柁砤砣袉铊鸵紽堶媠詑跎酡碢鉈馱槖駄鋖駞駝橐鮀鴕鼧騨鼍驒驝鼉',
        tuǒ: '彵妥庹椭楕嫷撱橢鵎鰖',
        tuò: '杝柝毤唾涶萚跅毻嶞箨蘀籜',
        wa: '哇',
        wā: '屲穵呙劸咼哇徍挖洼娲畖窊唲啘媧窐嗗瓾蛙搲溛漥窪鼃攨韈',
        wá: '娃',
        wǎ: '佤邷咓砙瓸搲',
        wà: '帓袜婠聉嗢搲腽膃韎襪韤',
        wai: '',
        wāi: '呙咼歪喎竵瀤',
        wǎi: '崴',
        wài: '外顡',
        wān: '毌夗弯剜埦婠帵捥塆湾睕蜿潫豌鋺彎壪灣',
        wán: '丸刓汍纨芄完岏忨抏杬玩笂紈捖蚖顽烷琓貦頑翫',
        wǎn: '夘夗倇唍挽盌莞莬埦婉惋捥晚晥梚涴绾脘菀萖惌晩晼椀琬皖畹碗箢綩綰輓踠鋔鋺',
        wàn: '卍卐妧杤捥脕掔腕萬絻綄輐槾澫鋄瞣薍錽蟃贃鎫贎',
        wāng: '尣尫尪汪尩瀇',
        wáng: '亾兦仼莣蚟朚',
        wǎng: '罓罒网彺忹抂徃往枉罖罔迬惘菵暀棢蛧辋網蝄誷輞瀇魍',
        wàng: '妄忘迋旺盳徍望暀朢',
        wēi: '厃危威倭烓偎逶隇隈喴媙崴嵔愄揋揻葨葳微椳楲溦煨詴蜲縅蝛覣嶶薇燰鳂癐癓巍鰃鰄霺',
        wéi: '囗韦圩囲围帏沩违闱隹峗峞洈為韋桅涠唯帷惟硙维喡圍媁嵬幃湋溈爲琟違潍維蓶鄬撝潙潿醀濰鍏闈鮠壝矀覹犩欈',
        wěi: '伟伪纬芛苇炜玮洧娓屗捤浘荱诿偉偽唩崣捼梶痏硊萎隗骩媁嵔廆徫愇渨猥葦蒍骫骪暐椲煒瑋痿腲艉韪僞嶉撱碨磈鲔寪緯蔿諉踓韑頠薳儰濻鍡鮪瀢韙颹韡亹瓗斖',
        wèi: '卫未位味苿為畏胃叞軎猚硙菋谓喂喡媦渭爲猬煟墛瞆碨蔚蜼慰熭犚磑緭蝟衛懀罻衞謂餧鮇螱褽餵魏藯轊鏏霨鳚蘶饖瓗讆躗讏躛',
        wēn: '昷塭温缊榅殟溫瑥辒韫榲瘟緼縕豱輼轀鎾饂鳁鞰鰛鰮',
        wén: '文彣芠炆玟闻紋蚉蚊珳阌雯瘒聞馼駇魰鳼鴍螡閺閿蟁闅鼤繧闦',
        wěn: '伆刎吻呅忟抆呡忞歾肳紊桽脗稳穏穩',
        wèn: '问妏汶紋莬問渂揾搵絻顐璺',
        wēng: '翁嗡滃鹟聬螉鎓鶲',
        wěng: '勜奣塕嵡滃蓊暡瞈攚',
        wèng: '瓮蕹甕罋齆',
        wō: '挝倭莴唩涹渦猧萵喔窝窩蜗撾濄緺蝸踒薶',
        wǒ: '呙我咼婑婐捰',
        wò: '仴沃肟卧枂臥偓捾涴媉幄握渥焥硪楃腛斡瞃濣瓁臒龌馧龏齷',
        wū: '乌圬弙扜扝汚汙污邬呜巫杅杇於屋洿诬钨烏剭窏釫惡鄔嗚誈僫歍誣箼鋘螐鴮鎢鰞',
        wú: '无毋吳吴吾呉芜郚唔娪峿洖浯茣莁梧珸祦無铻鹀蜈墲蕪鋙鋘橆璑蟱鯃鵐譕鼯鷡',
        wǔ: '乄五午仵伍妩庑忤怃迕旿武玝侮倵娒捂逜陚啎娬牾堥珷摀碔鹉熓瑦舞嫵廡憮潕儛甒膴瞴鵡躌',
        wù: '兀勿务戊阢屼扤坞岉杌沕芴忢旿物矹俉卼敄柮误務唔娪悟悞悮粅趶晤焐婺嵍惡渞痦隖靰骛塢奦嵨溩雺雾僫寤熃誤鹜鋈窹霚鼿霧齀蘁騖鶩',
        xī: '夕兮邜吸忚扱汐西希扸卥昔析矽穸肸肹俙咥咭徆怸恓诶郗饻唏奚娭屖息悕氥浠牺狶莃唽悉惜晞桸欷淅渓烯焁焈琋硒羛菥赥釸傒惁晰晳焟焬犀睎稀粞翖翕舾鄎厀嵠徯溪煕皙碏蒠裼锡僖榽熄熈熙獡緆蜥覡誒豨閪餏嘻噏嬆嬉嶲憘潝瘜磎膝凞暿樨橀歙熻熺熹窸羲螅螇錫燨犠瞦礂蟋豀谿豯貕蹊巂糦繥釐雟鯑鵗觹譆醯鏭鐊隵嚱巇曦爔犧酅饎觽鼷蠵鸂觿鑴',
        xí: '习郋席習袭觋雭喺媳椺蒵蓆嶍漝趘槢薂隰檄謵鎴霫鳛飁騱騽鰼襲驨',
        xǐ: '杫枲玺徙喜葈葸鈢鉩鉨屣漇蓰銑憘憙暿橲歖禧諰壐縰謑鳃蟢蹝釐璽鰓瓕鱚囍矖纚躧',
        xì: '匸卌扢屃忾饩呬忥怬细郄钑係恄欪盻郤屓欯绤細釳阋傒摡椞舃舄趇隙愾慀滊禊綌蒵赩隟墍熂犔稧戯潟澙蕮覤戱縘黖戲磶虩餼鬩繫闟霼屭衋',
        xiā: '呷虲疨虾谺傄閕煆颬瘕瞎蝦鰕',
        xiá: '匣侠狎俠峡柙炠狭陜埉峽烚狹珨祫捾硖笚翈舺陿徦硤遐敮暇瑕筪舝瘕碬辖磍蕸縖螛赮魻轄鍜霞鎋黠騢鶷',
        xiǎ: '閕閜',
        xià: '丅下乤圷芐疜夏梺廈睱諕嚇懗罅夓鎼鏬',
        xiān: '仚仙屳先奾佡忺氙杴欦祆秈苮姺枮籼珗莶掀铦搟綅跹酰锨僊僲嘕摻銛暹銽韯嬐憸薟鍁繊褼韱鮮蹮馦孅廯攕醶纎鶱襳躚纖鱻',
        xián: '伭咞闲咁妶弦臤贤咸唌挦涎玹盷胘娴娹婱絃舷蚿衔啣湺痫蛝閑閒鹇嗛嫌溓衘甉銜嫻嫺憪撏澖稴羬誸賢諴輱醎癇癎瞯藖礥鹹麙贒鑦鷴鷼鷳',
        xiǎn: '彡冼狝显险崄毨烍猃蚬険赻筅尟尠搟禒蜆跣銑箲險嶮獫獮藓鍌鮮燹顕幰攇櫶蘚譣玁韅顯灦',
        xiàn: '咞岘苋見现线臽限姭宪県陥哯垷娊峴涀莧軐陷埳晛現硍馅睍絤綖缐羡塪搚溓献粯羨腺僩僴槏綫誢憪撊線鋧憲橌橺縣錎餡壏懢豏麲瀗臔獻糮鏾霰鼸',
        xiāng:
          '乡芗香郷厢啍鄉鄊廂湘缃萫葙鄕楿稥薌箱緗膷襄儴勷忀骧麘欀瓖镶鱜纕鑲驤',
        xiáng: '夅瓨佭庠羏栙祥絴翔詳跭',
        xiǎng: '享亯响蚃饷晑飨想銄餉鲞蠁鮝鯗響饗饟鱶',
        xiàng: '向姠项珦象缿衖項像勨嶑潒銗閧曏橡襐闂嚮蟓鐌鱌',
        xiāo: '灲灱呺枭侾哓枵骁宯宵庨消烋绡莦虓逍鸮婋梟焇猇萧痚痟睄硣硝窙翛销嗃揱綃蛸嘐歊潇熇箫踃嘵憢撨獟獢箾銷霄骹彇膮蕭颵魈鴞穘簘藃蟂蟏鴵嚣瀟簫蟰髇櫹嚻囂髐鷍蠨驍毊虈',
        xiáo: '姣洨郩崤淆訤殽誵',
        xiǎo: '小晓暁筱筿皛曉篠謏皢',
        xiào: '孝効咲恔俲哮效涍笑啸傚敩殽嗃詨嘋嘨誟嘯薂歗熽斅斆',
        xiē: '娎揳猲楔歇滊獦蝎蠍',
        xié: '劦协旪協胁垥奊峫恊拹挾脇脅脋衺偕斜梋谐絜翓颉嗋愶慀搚携瑎綊熁膎鲑勰撷擕緳縀缬蝢鞋諧燲鮭嚡擷鞵儶襭孈攜讗龤',
        xiě: '写冩寫藛',
        xiè: '伳灺泻祄绁缷卸枻洩炨炧卨屑栧偞偰徢械烲焎禼紲亵媟屟渫絏絬谢僁塮觟觧榍榝榭褉靾噧寫屧暬樧碿緤嶰廨懈澥獬糏薤薢邂韰燮褻謝夑瀉鞢韘瀣爕繲蟹蠏齘齛纈齥齂躠躞',
        xīn: '忄心邤妡忻辛昕杺欣盺俽莘惞訢鈊锌新歆廞鋅噺噷嬜薪馨鑫馫',
        xín: '枔襑镡礥鐔',
        xǐn: '伈',
        xìn: '阠伩囟孞炘軐脪衅訫愖焮馸顖舋釁',
        xīng: '狌星垶骍惺猩煋瑆腥觪箵篂興謃鮏曐觲騂皨鯹',
        xíng: '刑邢饧巠形陉侀郉哘型洐荥钘陘娙硎铏鈃蛵滎鉶銒鋞餳',
        xǐng: '睲醒擤',
        xìng: '杏姓幸性荇倖莕婞悻涬葕睲緈鋞嬹臖',
        xiōng: '凶匂兄兇匈芎讻忷汹哅恟洶胷胸訩詾賯',
        xióng: '雄熊熋',
        xiǒng: '焽焸',
        xiòng: '诇詗夐敻',
        xiū: '俢修咻庥烌烋羞脩脙鸺臹貅馐樇銝髤髹鎀鮴鵂鏅饈鱃飍',
        xiú: '苬',
        xiǔ: '朽滫潃糔',
        xiù: '秀岫峀珛绣袖琇锈嗅溴綉璓褏褎銹螑嚊繍鏅繡鏥鏽齅',
        xū: '圩戌旴姁疞盱欨砉胥须眗訏顼偦虗虚裇許谞媭揟欻湏湑虛須楈綇頊嘘墟稰蓲需魆噓嬃歔緰縃蕦蝑歘藇諝燸譃魖驉鑐鬚',
        xú: '俆冔徐禑蒣',
        xǔ: '呴姁诩浒栩珝喣湑蛡暊詡滸稰鄦糈諿醑盨',
        xù: '旭伵序旴汿芧侐卹妶怴沀叙恓恤昫朐洫垿晇欰殈烅珬勗勖喐惐掝敍敘淢烼绪续蚼酗壻婿朂溆矞絮聓訹慉滀煦続蓄賉槒漵潊盢瞁緒聟蓿銊嘼獝稸緖藇藚續鱮',
        xuān: '吅轩昍咺宣弲晅軒梋谖喧塇媗愃愋揎萲萱暄煊瑄蓒睻儇禤箮翧蝖鋗嬛懁蕿諠諼鞙駨鍹駽矎翾藼蘐蠉譞鰚讂',
        xuán: '玄伭妶玹痃悬琁蜁嫙漩暶璇縣檈璿懸',
        xuǎn: '咺选烜喛暅選癣癬',
        xuàn: '怰泫昡炫绚眩袨铉琄眴衒渲絢楥楦鉉夐敻碹蔙镟颴縼繏鏇贙',
        xuē: '疶蒆靴薛辥辪鞾',
        xué: '穴斈乴学峃茓泶袕鸴敩踅噱壆學嶨澩燢觷鷽',
        xuě: '彐雪樰膤艝轌鳕鱈',
        xuè: '吷坹岤怴泬狘疦桖谑滈趐謔瞲瀥',
        xūn: '坃勋埙焄勛塤煇窨勲勳薫嚑壎獯薰曛燻臐矄蘍壦爋纁醺',
        xún: '廵寻巡旬杊畃询郇咰姰峋恂洵浔紃荀荨栒桪毥珣偱眴尋循揗詢鄩鲟噚潯蕁攳樳燅燖璕駨蟫蟳爓鱘鱏灥',
        xùn: '卂训讯伨汛迅驯侚巺徇狥迿逊孫殉毥浚訊訓訙奞巽殾稄遜馴愻噀潠蕈濬爋顨鶽鑂',
        ya: '',
        yā: '丫圧吖亞庘押枒垭鸦桠鸭啞孲铔椏鴉錏鴨壓鵶鐚',
        yá: '牙伢厑岈芽厓拁琊笌蚜堐崕崖涯猚釾睚衙漄齖',
        yǎ: '疋厊庌挜疨唖啞掗痖雅瘂蕥',
        yà: '劜圠轧亚冴襾覀讶亜犽迓亞玡軋姶娅挜砑俹氩埡婭掗訝铔揠氬猰聐圔椻稏碣窫潝磍壓瓛齾',
        yān: '恹剦烟珚胭崦淊淹焑焉菸阉殗渰湮傿歅煙硽鄢嫣漹嶖樮醃橪閹閼嬮懨篶懕臙黫黰',
        yán: '讠厃延闫严妍芫訁言岩昖沿炏炎郔唌埏姸娫狿莚娮梴盐啱琂硏訮閆阎喦嵓嵒筵綖蜒塩揅楌詽碞蔅羬颜厳虤閻檐顏顔嚴壛巌簷櫩壧巖巗欕礹鹽麣',
        yǎn: '夵抁沇乵兖俨兗匽弇衍剡偃厣掞掩眼萒郾酓隁嵃愝扊揜晻棪渰渷琰遃隒椼硽罨裺演褗戭窴蝘魇噞嬐躽縯檿黡厴甗鰋鶠黤儼黬黭龑孍顩鼴巘巚曮魘鼹礹齴黶',
        yàn: '厌妟觃牪匽姲彥彦洝砚唁宴晏烻艳覎验偐掞焔猏硏谚隁喭堰敥棪殗焱焰猒硯雁傿椻溎滟豣鳫厭墕暥熖酽鳱嬊谳餍鴈燄諺赝鬳嚈嬮曕鴳酀騐験嚥嬿艶贋軅曣爓醶騴齞鷃灔贗囐觾讌醼饜驗鷰艷灎釅驠灧讞豓豔灩',
        yāng: '央姎抰泱柍殃胦眏秧鸯鉠雵鞅鍈鴦',
        yáng: '扬阦阳旸杨炀玚飏佯劷氜疡钖垟徉昜洋羏烊珜眻陽婸崵崸愓揚蛘敭暘楊煬瑒禓瘍諹輰鍚鴹颺鰑霷鸉',
        yǎng: '卬佒咉坱岟养柍炴氧眏痒紻傟勜楧軮慃氱蝆飬養駚懩攁瀁癢礢',
        yàng: '怏柍恙样烊羕楧詇煬様漾鞅樣瀁',
        yāo: '幺夭吆妖枖殀祅約訞喓葽楆腰鴁撽邀鴢',
        yáo: '爻尧匋尭肴垚姚峣恌轺倄烑珧皐窕窑铫隃傜堯揺殽谣軺嗂媱徭愮搖摇滧猺遙遥僥摿暚榣瑤瑶銚飖餆嶢嶤徺磘窯窰餚繇謡謠鎐鳐颻蘨邎顤鰩鱙',
        yǎo: '仸宎岆抭杳枖狕苭咬柼眑窅窈舀偠婹崾溔蓔榚闄騕齩鷕',
        yào: '怮穾药烄袎窔筄葯詏愮熎瘧覞靿樂獟箹鹞薬鼼曜燿艞藥矅耀纅鷂讑',
        ye: '亪',
        yē: '吔耶倻椰暍歋窫噎潱擨蠮',
        yé: '爷耶峫捓揶铘爺瑘釾鋣鎁',
        yě: '也冶埜野嘢漜壄',
        yè: '业曳页曵邺夜抴亱拽枼洂頁捙晔枽烨液焆谒堨揲殗腋葉墷楪業煠痷馌僷曅燁璍擖擛曄皣瞱緤鄴靥嶪嶫澲謁餣擫曗瞸鍱擪爗礏鎑饁鵺鐷靨驜瓛鸈',
        yi: '弬',
        yī: '一乊弌辷衤伊衣医吚壱依祎咿洢悘渏猗畩郼铱壹揖蛜禕嫛漪稦銥嬄撎噫夁瑿鹥繄檹毉醫黟譩鷖黳',
        yí: '乁仪匜圯夷彵迆冝宐杝沂诒侇宜怡沶狏狋迤迱饴咦姨峓恞拸柂洟珆瓵荑贻迻宧巸扅栘桋眙胰袘貤痍移萓釶椬羠蛦詒貽遗媐暆椸煕誃跠頉颐飴儀熪箷遺嶬彛彜螔頥頤寲嶷簃顊鮧鴺彞彝謻鏔籎觺讉',
        yǐ: '乚乛乙已以扡迆钇佁攺矣苡叕苢迤迱庡舣蚁釔倚扆笖逘酏偯猗崺攲敧旑鈘鉯鳦裿旖輢嬟敼螘檥礒艤蟻顗轙齮',
        yì: '乂义亿弋刈忆艺仡匇肊艾议阣亦伇屹异忔芅伿佚劮呓坄役抑杙耴苅译邑佾呭呹妷峄怈怿易枍欥泆炈秇绎衪诣驿俋奕帟帠弈昳枻浂玴疫羿轶唈垼悒挹栺栧欭浥浳益袘袣谊貤勚埶埸悘悥掜殹異羛翊翌萟訳訲豙豛逸釴隿幆敡晹棭殔湙焲焬蛡詍跇軼鄓鈠骮亄兿嗌意溢獈痬睪竩缢義肄裔裛詣勩嫕廙榏潩瘗膉蓺蜴駅億槸毅熠熤熼瘞篒誼镒鹝鹢黓儗劓圛墿嬑嶧憶懌曀殪澺燚瘱瞖穓縊艗薏螠褹寱懝斁曎檍歝燡燱翳翼臆貖鮨癔藝藙贀鎰镱繶繹豷霬鯣鶃鶂鶍瀷蘙議譯醳醷饐囈鐿鷁鷊懿襼驛鷧虉鸃鷾讛齸',
        yīn: '囙因阥阴侌垔姻洇茵荫音骃栶欭氤陰凐秵裀铟陻隂喑堙婣愔湮筃絪歅溵禋蒑蔭慇瘖銦磤緸鞇諲霒駰噾濦闉霠齗韾',
        yín: '冘乑伒吟圻犾苂斦烎垠泿圁峾狺珢荶訔訚唫婬寅崟崯淫訡银鈝龂滛碒鄞夤蔩銀龈噖殥璌誾嚚檭蟫霪齦鷣',
        yǐn: '廴尹引吲饮粌蚓硍赺淾鈏飲隠靷飮朄輑磤趛檃瘾隱嶾濥縯螾檼蘟櫽癮讔',
        yìn: '廴印茚洕胤荫垽梀堷湚猌飲廕隠飮窨酳慭癊憗憖隱鮣懚',
        yīng: '応旲英柍荥偀桜珱莺啨婴媖愥渶绬朠楧焽焸煐瑛嫈碤锳嘤撄甇緓缨罂蝧賏樱璎噟罃褮霙鴬鹦嬰應膺韺甖鹰鶑鶧嚶孆孾攖瀴罌蘡譍櫻瓔礯譻鶯鑍纓蠳鷪軈鷹鸎鸚',
        yíng: '夃盁迎茔盈荧浧耺莹営桯萤萦营蛍溁溋萾僌塋嵤楹滢蓥滎潆熒蝇瑩禜蝿嬴營縈螢濙濚濴藀覮謍赢瀅爃蠅鎣巆攍瀛瀠瀯櫿贏灐籝灜籯',
        yǐng: '矨郢浧梬颍颕颖摬影潁瘿穎頴覮巊廮瀴鐛癭',
        yìng: '応映眏暎硬媵膡鞕應瀴鱦',
        yo: '喲',
        yō: '唷喲',
        yōng: '拥痈邕庸傭嗈鄘雍墉嫞慵滽槦牅牗銿噰壅擁澭郺镛臃癕雝鏞鳙廱灉饔鱅鷛癰',
        yóng: '喁揘颙顒鰫',
        yǒng: '永甬咏怺泳俑勈勇栐埇悀柡恿惥愑湧硧詠塎嵱彮愹蛹慂踊鲬噰澭踴鯒',
        yòng: '用苚砽蒏醟',
        yōu: '优妋忧攸呦怮泑幽峳浟逌悠羪麀滺憂優鄾嚘懮瀀獶櫌纋耰獿',
        yóu: '尢冘尤由甴汼沋犹邮怞油肬怣斿柚疣庮秞莜莤莸郵铀偤蚰訧逰揂游猶遊鱿楢猷鈾鲉輏駀蕕蝣魷輶鮋繇櫾',
        yǒu: '友丣卣苃酉羑栯莠梄聈铕湵楢禉蜏銪槱牖牗黝懮',
        yòu: '又右幼佑佦侑孧泑狖哊囿姷宥峟柚牰祐诱迶唀梎痏蚴亴貁釉酭誘鼬櫾',
        yū: '込扜扝纡迃迂穻陓紆唹淤盓瘀箊',
        yú: '丂亐于邘伃余妤扵杅欤玗玙於盂臾衧鱼乻俞兪捓禺竽舁茰虶娛娯娪娱桙狳谀酑馀渔萸釪隃隅雩魚堣堬婾媀媮崳嵎嵛揄楰渝湡畬腴萮逾骬愚楡榆歈牏瑜艅虞觎漁睮窬舆褕歶羭蕍蝓諛雓餘魣嬩懙澞覦踰歟璵螸輿鍝謣髃鮽旟籅騟鯲蘛轝鰅鷠鸆齵',
        yǔ: '伛宇屿羽穻俁俣挧禹圄祤偊匬圉庾敔鄅斞萭傴寙楀瑀瘐與語窳頨龉噳嶼懙貐斔穥麌齬',
        yù: '肀玉驭圫聿芌芋吾妪忬汩灹饫欥育郁俞昱狱禺秗茟俼叞峪彧栯浴砡钰预域堉悆惐捥欲淢淯痏粖翑袬谕逳阈喅喩喻媀寓庽御棛棜棫焴琙琟矞硢硲裕遇飫馭鹆奧愈滪煜稢罭艈蒮蓣誉鈺預僪嫗嶎戫毓澚獄瘉緎蜟蜮語輍銉隩慾潏熨稶蓹薁豫遹鋊鳿澦燏燠蕷藇諭錥閾鴧鴪鴥儥礇禦魊鹬癒礖礜篽醧鵒櫲饇蘌譽鐭霱雤欎驈鬻籞鱊鷸鸒欝軉鬰鬱灪籲爩',
        yuān: '夗囦肙鸢剈冤弲悁眢鸳寃涴渆渁渊渕惌淵葾棩蒬蜎裷鹓箢鳶蜵駌鋺鴛嬽鵷灁鼘鼝',
        yuán: '元円贠邧园妧沅芫杬茒垣爰貟原員圆笎蚖袁厡酛傆喛圎媛援湲猨缘鈨鼋園圓塬媴嫄楥溒源猿蒝榞榬辕緣縁蝝蝯褤魭圜橼羱薗螈黿謜轅鎱櫞邍騵鶢鶰厵',
        yuǎn: '盶逺遠薳鋺',
        yuàn: '夗妴苑怨院垸衏傆媛掾瑗禐愿裫褑噮願',
        yuē: '曰曱扚約啘箹矱',
        yuě: '哕噦',
        yuè: '月戉兊刖兌妜岄抈礿岳枂泧玥恱栎哾悅悦蚏蚎軏钺阅捳跀跃粤越鈅楽粵鉞說説樂閲閱嬳樾篗髺嶽臒龠擽矆櫟籆瀹蘥黦爚禴趯躍籥鑰鸑籰鸙',
        yūn: '涒缊蒀暈氲煴蒕氳熅煾奫緼蝹縕赟馧贇',
        yún: '云勻匀伝囩妘抣沄纭芸昀畇眃秐貟郧員涢紜耘耺鄖雲愪溳筠筼蒷熉澐蕓鋆橒篔縜',
        yǔn: '允阭夽抎狁玧陨荺殒喗鈗隕煴殞熅馻磒賱霣齫齳',
        yùn: '孕贠运枟郓恽貟員菀鄆酝傊惲愠缊運慍暈榅煇腪韫韵褞熨緷緼蕰蕴縕薀醖醞餫藴鞰韗韞蘊韻',
        zā: '帀匝沞迊咂拶桚紥紮鉔噈魳臜臢',
        zá: '杂沯砸偺喒韴雑襍雜囃囋囐雥',
        zǎ: '咋偺喒',
        zāi: '災灾甾哉栽烖畠菑渽溨睵賳',
        zǎi: '宰崽',
        zài: '再在扗抂洅傤載酨儎縡',
        zān: '兂撍糌橵篸簪簮鵤鐕鐟',
        zán: '偺喒',
        zǎn: '拶昝桚寁揝噆撍儧攅儹攢趱趲',
        zàn: '暂暫賛赞錾鄼濽蹔酂瓉贊鏩鏨瓒酇囋灒讃瓚禶穳襸讚饡',
        zāng: '匨牂羘赃賍臧賘贓髒贜',
        zǎng: '驵駔',
        zàng: '奘弉脏塟葬臧蔵銺臓臟',
        zāo: '傮遭糟蹧醩',
        záo: '凿鑿',
        zǎo: '早枣栆蚤棗璅澡璪薻藻',
        zào: '灶皁皂唣唕造梍喿慥煰艁噪簉燥竃竈譟趮躁',
        zé: '则択沢咋泎责迮則唶啧帻笮舴責溭滜睪矠飵嘖嫧幘箦蔶樍歵諎赜擇澤皟瞔簀耫礋襗謮賾蠌灂齚齰鸅',
        zè: '仄庂汄昃昗捑側崱稄',
        zéi: '贼戝賊鲗蠈鰂鱡',
        zēn: '撍',
        zěn: '怎',
        zèn: '谮譖',
        zēng: '曽増鄫增憎缯橧璔縡矰磳竲罾繒譄鱛',
        zěng: '',
        zèng: '锃綜缯鋥熷甑赠繒鬵贈囎',
        zi: '嗭',
        zī: '孖孜甾茊兹呲咨姕姿茲栥玆畠紎赀资崰淄秶缁菑谘赼嗞孳嵫椔湽滋粢葘辎鄑孶禌觜訾貲資趑锱稵緕緇鈭镃龇輜鼒澬薋諮趦輺錙髭鲻鍿鎡璾頾頿鯔鶅齍纃鰦齜',
        zí: '蓻',
        zǐ: '子吇芓姉姊杍沝矷秄胏呰秭籽耔茈虸笫梓釨啙紫滓訿榟橴',
        zì: '字自芓秄洓茡荢倳剚恣牸渍眦眥菑胔胾漬',
        zōng: '宗枞倧骔堫嵏嵕惾棕猣腙葼朡椶潈稯綜緃樅熧緵翪蝬踨踪磫繌鍐豵蹤騌鬃騣鬉鬷鯮鯼鑁',
        zǒng: '总倊偬捴惣揔搃焧傯蓗嵸摠潀稯総熜緫縂燪縱總',
        zòng: '昮疭從猔碂粽潨糉緵瘲縦縱繌糭',
        zōu: '邹驺诹郰陬掫菆棸棷鄒箃緅諏鄹鲰鯫黀騶齱齺',
        zǒu: '赱走搊鯐',
        zòu: '奏揍媰楱',
        zū: '怚柤租菹葅蒩',
        zú: '卆足倅哫崒崪族椊稡箤踤镞鎐鏃',
        zǔ: '诅阻组俎柤爼珇祖唨組詛靻鎺',
        zù: '',
        zuān: '鉆劗躜鑚躦鑽',
        zuǎn: '繤缵纂纉籫纘',
        zuàn: '揝篹賺攥',
        zuī: '厜朘嗺樶蟕纗',
        zuí: '',
        zuǐ: '咀觜嶊嘴噿濢璻',
        zuì: '冣栬絊酔晬最祽睟稡罪辠槜酻蕞醉嶵檇鋷錊檌欈',
        zūn: '尊噂墫嶟遵樽繜罇鶎鐏鳟鱒鷷',
        zǔn: '僔撙繜譐',
        zùn: '拵捘栫袸銌瀳',
        zuo: '咗',
        zuō: '嘬穝',
        zuó: '苲昨柮秨莋捽笮稓筰鈼',
        zuǒ: '左佐繓',
        zuò: '作坐阼岝岞怍侳柞祚胙唑座袏做葄葃酢蓙飵諎糳',
        zhā: '吒咋抯挓柤査哳紥偧紮揸渣楂飵劄摣潳皶樝觰皻譇齄齇',
        zhá: '札甴軋闸剳蚻铡喋煠牐閘劄箚霅耫鍘譗',
        zhǎ: '厏拃苲眨砟鲊鲝諎鮓鮺',
        zhà: '乍吒灹诈怍咤奓柞宱痄蚱喥溠詐搾鲊榨鮓醡',
        zhāi: '亝哜夈粂捚斋側斎摘榸齊嚌擿齋',
        zhái: '厇宅翟擇檡',
        zhǎi: '厏抧窄鉙',
        zhài: '责债砦責債寨瘵',
        zhān: '岾怗枬沾毡旃栴粘蛅飦惉詀趈詹閚谵鳽噡嶦薝邅霑氈氊瞻覱鹯旜譫饘鳣驙魙鱣鸇',
        zhán: '讝',
        zhǎn: '斩飐展盏斬琖搌盞嶃嶄榐辗颭嫸醆橏輾皽黵',
        zhàn: '佔战栈桟站偡绽菚嵁棧湛戦碊僝綻嶘戰虥虦覱轏譧欃蘸驏',
        zhāng: '弡张張章傽鄣嫜彰慞漳獐粻蔁遧暲樟璋餦蟑鏱騿鱆麞',
        zhǎng: '仉仧兏長掌漲幥礃鞝',
        zhàng: '丈仗扙帐杖胀账粀帳涱脹痮障墇嶂幛漲賬瘬瘴瞕',
        zhāo: '佋钊妱巶招昭炤釗啁釽鉊鳭駋鍣皽',
        zháo: '',
        zhǎo: '爫找沼菬瑵',
        zhào: '兆诏枛垗炤狣赵笊肁啅旐棹罀詔照罩箌肈肇趙曌濯燳鮡櫂瞾羄',
        zhe: '嗻',
        zhē: '嗻嫬遮螫',
        zhé: '乇厇扸杔歽矺砓籷虴哲埑粍袩啠悊晢晣辄喆棏聑蛰詟搩蜇谪馲摺輒慹磔輙銸辙蟄嚞謫謺鮿轍讁讋',
        zhě: '者乽啫锗赭踷褶鍺襵',
        zhè: '柘浙這淛嗻蔗樜鹧蟅鷓',
        zhèi: '',
        zhēn: '贞针侦侲帧枮浈珎珍胗貞帪桢眞真砧祯針偵酙寊幀揕湞葴遉嫃搸斟椹楨溱獉甄禎蒖蓁鉁榛槙殝瑧碪禛潧箴樼澵臻薽錱轃鍼籈鱵',
        zhén: '',
        zhěn: '诊抮枕姫弫昣轸屒畛疹眕袗紾聄萙竧裖覙診軫嫃缜槙稹駗縝縥辴鬒黰',
        zhèn: '圳阵纼甽侲挋陣鸩振朕栚紖桭眹赈塦揕絼榐瑱誫賑鋴镇震鴆鎮鎭',
        zhēng:
          '凧争佂姃征怔爭糽埩峥炡狰烝眐脀钲埥崝崢掙猙睁聇铮媜揁筝徰睜蒸踭鉦徴箏綪錚徵篜鬇癥鏳',
        zhěng: '氶抍糽拯掟晸愸撜整',
        zhèng: '氶证诤郑政徎钲掙幁証塣諍靕鄭憕鴊證',
        zhī: '之支卮汁芝巵汥呮泜肢栀祗秓胑胝衼倁栺疷祬脂隻梔菭椥臸搘稙綕榰蜘馶憄鳷鴲織鼅蘵',
        zhí: '执侄妷直秇姪郦値值聀釞埴執淔职戠植犆禃絷臷跖瓡摕摭馽嬂慹漐潪踯樴膱縶職蟙蹠軄躑',
        zhǐ: '夂止凪劧旨阯坁址帋扺汦沚纸芷坧抧杫祇祉茋咫恉指枳洔砋秖衹轵淽疻紙蚔訨趾軹黹禔筫絺酯墌徴徵槯藢襧',
        zhì: '至芖坁志忮扻豸制厔垁帙帜斦治炙质迣郅俧峙庢庤挃柣栉洷祑陟娡徏挚捗晊桎歭狾秩致袟贽轾乿偫剬徝掷梽楖猘畤痓痔眰秲秷窒紩翐袠觗貭铚鸷傂崻彘智滞痣蛭骘寘廌搱滍稚筫置跱輊锧雉墆滯潌疐瘈聜製覟誌銍幟憄摨摯潪熫稺膣觯質踬銴鋕擳旘瀄璏緻隲駤鴙儨劕懥擲擿櫛穉螲懫織贄櫍瓆觶騭鯯礩豑鶨騺驇躓鷙鑕豒',
        zhōng:
          '夂伀汷刣妐彸忪忠泈炂终柊盅衳钟舯衷終鈡幒蔠蜙锺銿螤鴤螽鍾斔鼨蹱鐘籦',
        zhǒng: '肿冢喠尰塚歱煄腫瘇種徸踵穜',
        zhòng: '仲众妕狆祌茽衶蚛偅眾堹媑筗衆種緟諥',
        zhōu: '州舟诌侜周洲炿诪烐珘辀郮啁婤徟掫淍矪週鸼喌赒輈翢銂賙輖霌駲嚋盩謅鵃騆譸',
        zhóu: '妯軸碡',
        zhǒu: '肘帚疛胕菷晭睭箒鯞',
        zhòu: '纣伷呪咒宙绉冑咮昼紂胄荮皱酎晝粙椆葤詋軸甃僽皺駎噣縐繇薵骤籀籕籒驟',
        zhū: '侏诛邾洙茱株珠诸猪硃秼袾铢絑蛛誅跦槠潴蕏蝫銖橥諸豬駯鮢鴸瀦藸鼄櫧櫫鯺蠩',
        zhú: '朮竹竺炢笁茿烛窋逐笜舳逫瘃蓫敱磩築篴斀燭蠋躅鱁劚孎灟斸曯欘爥蠾钃',
        zhǔ: '丶主劯宔拄砫罜陼帾渚煑煮詝褚嘱濐燝麈瞩屬囑鸀矚',
        zhù: '伫佇住纻芧苎坾拀杼注苧贮迬驻乼壴柱柷殶炷祝疰眝砫祩竚莇紵紸羜蛀尌嵀註貯跓軴铸筯鉒飳馵嗻墸箸翥樦澍鋳駐築篫麆簗櫡鑄',
        zhuā: '抓挝撾檛膼簻髽',
        zhuǎ: '爫',
        zhuāi: '拽',
        zhuǎi: '跩',
        zhuài: '拽睉',
        zhuān: '专叀専恮砖耑專剸鄟塼嫥漙瑼甎磗膞颛磚諯篿蟤顓鱄',
        zhuǎn: '孨転膞竱轉',
        zhuàn: '灷啭転堟蒃傳瑑腞僎僝赚撰篆馔篹縳襈賺簨贃譔饌囀籑',
        zhuāng: '妆庄妝庒荘娤桩莊梉湷粧装裝樁糚',
        zhuǎng: '奘',
        zhuàng: '壮壯状狀壵焋僮漴撞戅戆戇',
        zhuī: '隹骓锥錐騅鵻',
        zhuǐ: '沝',
        zhuì: '坠笍奞娷缀隊惴甀缒腏畷硾膇墜綴赘縋諈醊錣礈贅鑆',
        zhūn: '圫宒忳迍肫窀谆啍諄衠',
        zhǔn: '准埻凖準稕綧',
        zhùn: '旽訰稕綧',
        zhuō: '拙炪倬捉桌梲棁涿淖棳棹焯窧槕穛鐯穱',
        zhuó: '圴彴汋犳灼卓叕妰茁斫浊丵剢捔浞烵诼酌啄啅娺聉斱斮晫椓琸硺窡罬蓔墌撯擆斲禚劅諁諑趠鋜噣濁燋篧擢斀斵濯藋櫡謶镯繳鵫灂蠗鐲籗鷟蠿籱',
        zhuò: '',
        'chǎng,ān,hàn': '厂',
        'dīng,zhēng': '丁',
        'bǔ,bo': '卜',
        'jǐ,jī': '几',
        'le,liǎo': '了',
        'gān,gàn': '干',
        'dà,dài,tài': '大',
        'yǔ,yù,yú': '与',
        'shàng,shǎng': '上',
        'wàn,mò': '万',
        'gè,gě': '个各',
        'me,mó,ma,yāo': '么',
        'guǎng,ān': '广',
        'wáng,wú': '亡',
        'nǚ,rǔ': '女',
        'chā,chá,chǎ': '叉',
        'wáng,wàng': '王',
        'fū,fú': '夫',
        'zhā,zā,zhá': '扎',
        'bù,fǒu': '不',
        'qū,ōu': '区',
        'chē,jū': '车',
        'qiè,qiē': '切',
        'wǎ,wà': '瓦',
        'tún,zhūn': '屯',
        'shǎo,shào': '少',
        'zhōng,zhòng': '中',
        'nèi,nà': '内',
        'jiàn,xiàn': '见',
        'cháng,zhǎng': '长',
        'shén,shí': '什',
        'piàn,piān': '片',
        'pú,pū': '仆',
        'huà,huā': '化',
        'chóu,qiú': '仇',
        'zhuǎ,zhǎo': '爪',
        'jǐn,jìn': '仅',
        'fù,fǔ': '父',
        'cóng,zòng': '从',
        'fēn,fèn': '分',
        'shì,zhī': '氏',
        'fēng,fěng': '风',
        'gōu,gòu': '勾',
        'liù,lù': '六',
        'dǒu,dòu': '斗',
        'wèi,wéi': '为',
        'chǐ,chě': '尺',
        'yǔ,yú': '予',
        'dǎ,dá': '打',
        'zhèng,zhēng': '正症挣',
        'bā,pá': '扒',
        'jié,jiē': '节结',
        'shù,shú,zhú': '术',
        'kě,kè': '可',
        'shí,dàn': '石',
        'kǎ,qiǎ': '卡',
        'běi,bèi': '北',
        'zhàn,zhān': '占',
        'qiě,jū': '且',
        'yè,xié': '叶',
        'hào,háo': '号',
        'zhī,zhǐ': '只',
        'dāo,tāo': '叨',
        'zǎi,zǐ,zī': '仔',
        'lìng,líng,lǐng': '令',
        'lè,yuè': '乐',
        'jù,gōu': '句',
        'chù,chǔ': '处',
        'tóu,tou': '头',
        'níng,nìng,zhù': '宁',
        'zhào,shào': '召',
        'fā,fà': '发',
        'tái,tāi': '台苔',
        'káng,gāng': '扛',
        'dì,de': '地',
        'sǎo,sào': '扫',
        'chǎng,cháng': '场',
        'pǔ,pò,pō,piáo': '朴',
        'guò,guo,guō': '过',
        'yā,yà': '压',
        'yǒu,yòu': '有',
        'kuā,kuà': '夸',
        'xié,yá,yé,yú,xú': '邪',
        'jiá,jiā,gā,xiá': '夹',
        'huà,huá': '划',
        'dāng,dàng': '当',
        'tù,tǔ': '吐',
        'xià,hè': '吓',
        'tóng,tòng': '同',
        'qū,qǔ': '曲',
        'ma,má,mǎ': '吗',
        'qǐ,kǎi': '岂',
        'zhū,shú': '朱',
        'chuán,zhuàn': '传',
        'xiū,xǔ': '休',
        'rèn,rén': '任',
        'huá,huà,huā': '华',
        'jià,jiè,jie': '价',
        'fèn,bīn': '份',
        'yǎng,áng': '仰',
        'xiě,xuè': '血',
        'sì,shì': '似',
        'háng,xíng': '行',
        'huì,kuài': '会',
        'hé,gě': '合',
        'chuàng,chuāng': '创',
        'chōng,chòng': '冲',
        'qí,jì,zī,zhāi': '齐',
        'yáng,xiáng': '羊',
        'bìng,bīng': '并',
        'hàn,hán': '汗',
        'tāng,shāng': '汤',
        'xīng,xìng': '兴',
        'xǔ,hǔ': '许',
        'lùn,lún': '论',
        'nà,nǎ,nèi,nā': '那',
        'jìn,jǐn': '尽',
        'sūn,xùn': '孙',
        'xì,hū': '戏',
        'hǎo,hào': '好',
        'tā,jiě': '她',
        'guān,guàn': '观冠',
        'hóng,gōng': '红',
        'xiān,qiàn': '纤',
        'jì,jǐ': '纪济',
        'yuē,yāo': '约',
        'nòng,lòng': '弄',
        'yuǎn,yuàn': '远',
        'huài,pēi,pī,péi': '坏',
        'zhé,shé,zhē': '折',
        'qiǎng,qiāng,chēng': '抢',
        'ké,qiào': '壳',
        'fāng,fáng': '坊',
        'bǎ,bà': '把',
        'gān,gǎn': '杆',
        'sū,sù': '苏',
        'gàng,gāng': '杠',
        'gèng,gēng': '更',
        'lì,lí': '丽',
        'hái,huán': '还',
        'fǒu,pǐ': '否',
        'xiàn,xuán': '县',
        'zhù,chú': '助',
        'ya,yā': '呀',
        'chǎo,chāo': '吵',
        'yuán,yún,yùn': '员',
        'ba,bā': '吧',
        'bié,biè': '别',
        'dīng,dìng': '钉',
        'gū,gù': '估',
        'hé,hē,hè': '何',
        'tǐ,tī,bèn': '体',
        'bó,bǎi,bà': '伯',
        'yòng,yōng': '佣',
        'fó,fú,bì,bó': '佛',
        'dù,dǔ': '肚',
        'guī,jūn,qiū': '龟',
        'jiǎo,jué': '角',
        'tiáo,tiāo': '条',
        'xì,jì': '系',
        'yìng,yīng': '应',
        'zhè,zhèi': '这',
        'jiān,jiàn': '间监',
        'mēn,mèn': '闷',
        'dì,tì,tuí': '弟',
        'shā,shà': '沙',
        'shà,shā': '煞',
        'méi,mò': '没',
        'shěn,chén': '沈',
        'shí,zhì': '识',
        'niào,suī': '尿',
        'wěi,yǐ': '尾',
        'ē,ā': '阿',
        'jìn,jìng': '劲',
        'zòng,zǒng': '纵',
        'wén,wèn': '纹',
        'mǒ,mò,mā': '抹',
        'dān,dàn,dǎn': '担',
        'chāi,cā': '拆',
        'jū,gōu': '拘',
        'lā,lá': '拉',
        'bàn,pàn': '拌',
        'zé,zhái': '择',
        'qí,jī': '其奇',
        'ruò,rě': '若',
        'píng,pēng': '苹',
        'zhī,qí': '枝',
        'guì,jǔ': '柜',
        'sàng,sāng': '丧',
        'cì,cī': '刺',
        'yǔ,yù': '雨语',
        'bēn,bèn': '奔',
        'qī,qì': '妻',
        'zhuǎn,zhuàn,zhuǎi': '转',
        'xiē,suò': '些',
        'ne,ní': '呢',
        'tiě,tiē,tiè,': '帖',
        'lǐng,líng': '岭',
        'zhī,zhì': '知织',
        'hé,hè,huó,huò,hú': '和',
        'gòng,gōng': '供共',
        'wěi,wēi': '委',
        'cè,zè,zhāi': '侧',
        'pò,pǎi': '迫',
        'de,dì,dí': '的',
        'cǎi,cài': '采',
        'fú,fù': '服',
        'dǐ,de': '底',
        'jìng,chēng': '净',
        'juàn,juǎn': '卷',
        'quàn,xuàn': '券',
        'dān,shàn,chán': '单',
        'qiǎn,jiān': '浅',
        'xiè,yì': '泄',
        'pō,bó': '泊',
        'pào,pāo': '泡',
        'ní,nì': '泥',
        'zé,shì': '泽',
        'kōng,kòng,kǒng': '空',
        'láng,làng': '郎',
        'xiáng,yáng': '详',
        'lì,dài': '隶',
        'shuā,shuà': '刷',
        'jiàng,xiáng': '降',
        'cān,shēn,cēn,sān': '参',
        'dú,dài': '毒',
        'kuà,kū': '挎',
        'dǎng,dàng': '挡',
        'kuò,guā': '括',
        'shí,shè': '拾',
        'tiāo,tiǎo': '挑',
        'shèn,shén': '甚',
        'xiàng,hàng': '巷',
        'nán,nā': '南',
        'xiāng,xiàng': '相',
        'chá,zhā': '查',
        'bǎi,bó,bò': '柏',
        'yào,yāo': '要',
        'yán,yàn': '研',
        'qì,qiè': '砌',
        'bèi,bēi': '背',
        'shěng,xǐng': '省',
        'xiāo,xuē': '削',
        'hǒng,hōng,hòng': '哄',
        'mào,mò': '冒',
        'yǎ,yā': '哑',
        'sī,sāi': '思',
        'mǎ,mā,mà': '蚂',
        'huá,huā': '哗',
        'yè,yàn,yān': '咽',
        'zán,zǎ': '咱',
        'hā,hǎ,hà': '哈',
        'nǎ,něi,na,né': '哪',
        'hāi,ké': '咳',
        'gǔ,gū': '骨',
        'gāng,gàng': '钢',
        'yào,yuè': '钥',
        'kàn,kān': '看',
        'zhòng,zhǒng,chóng': '种',
        'biàn,pián': '便',
        'zhòng,chóng': '重',
        'xìn,shēn': '信',
        'zhuī,duī': '追',
        'dài,dāi': '待',
        'shí,sì,yì': '食',
        'mài,mò': '脉',
        'jiāng,jiàng': '将浆',
        'dù,duó': '度',
        'qīn,qìng': '亲',
        'chà,chā,chāi,cī': '差',
        'zhà,zhá': '炸',
        'pào,páo,bāo': '炮',
        'sǎ,xǐ': '洒',
        'xǐ,xiǎn': '洗',
        'jué,jiào': '觉',
        'biǎn,piān': '扁',
        'shuō,shuì,yuè': '说',
        'lǎo,mǔ': '姥',
        'gěi,jǐ': '给',
        'luò,lào': '络',
        'zǎi,zài': '载',
        'mái,mán': '埋',
        'shāo,shào': '捎稍',
        'dū,dōu': '都',
        'ái,āi': '挨',
        'mò,mù': '莫',
        'è,wù,ě,wū': '恶',
        'xiào,jiào': '校',
        'hé,hú': '核',
        'yūn,yùn': '晕',
        'huàng,huǎng': '晃',
        'ài,āi': '唉',
        'ā,á,ǎ,à,a': '啊',
        'bà,ba,pí': '罢',
        'zuàn,zuān': '钻',
        'qiān,yán': '铅',
        'chéng,shèng': '乘',
        'mì,bì': '秘泌',
        'chēng,chèn,chèng': '称',
        'dào,dǎo': '倒',
        'tǎng,cháng': '倘',
        'chàng,chāng': '倡',
        'chòu,xiù': '臭',
        'shè,yè,yì': '射',
        'gē,gé': '胳搁',
        'shuāi,cuī': '衰',
        'liáng,liàng': '凉量',
        'chù,xù': '畜',
        'páng,bàng': '旁磅',
        'zhǎng,zhàng': '涨',
        'yǒng,chōng': '涌',
        'qiāo,qiǎo': '悄',
        'jiā,jia,jie': '迦家',
        'dú,dòu': '读',
        'shàn,shān': '扇',
        'shān,shàn': '苫',
        'bèi,pī': '被',
        'tiáo,diào,zhōu': '调',
        'bō,bāo': '剥',
        'néng,nài': '能',
        'nán,nàn,nuó': '难',
        'pái,pǎi': '排',
        'jiào,jiāo': '教',
        'jù,jū': '据',
        'zhù,zhuó,zhe': '著',
        'jūn,jùn': '菌',
        'lè,lēi': '勒',
        'shāo,sào': '梢',
        'fù,pì': '副',
        'piào,piāo': '票',
        'shèng,chéng': '盛',
        'què,qiāo,qiǎo': '雀',
        'chí,shi': '匙',
        'mī,mí': '眯',
        'la,lā': '啦',
        'shé,yí': '蛇',
        'lèi,léi,lěi': '累',
        'zhǎn,chán': '崭',
        'quān,juàn,juān': '圈',
        'lóng,lǒng': '笼',
        'dé,děi,de': '得',
        'jiǎ,jià': '假',
        'māo,máo': '猫',
        'xuán,xuàn': '旋',
        'zhe,zhuó,zháo,zhāo': '着',
        'lǜ,shuài': '率',
        'gài,gě,hé': '盖',
        'lín,lìn': '淋',
        'qú,jù': '渠',
        'jiàn,jiān': '渐溅',
        'hùn,hún': '混',
        'sù,xiǔ,xiù': '宿',
        'tán,dàn': '弹',
        'yǐn,yìn': '隐',
        'jǐng,gěng': '颈',
        'lǜ,lù': '绿',
        'qū,cù': '趋',
        'tí,dī,dǐ': '提',
        'jiē,qì': '揭',
        'lǒu,lōu': '搂',
        'qī,jī': '期',
        'sàn,sǎn': '散',
        'gě,gé': '葛',
        'zhāo,cháo': '朝',
        'luò,là,lào': '落',
        'yǐ,yī': '椅',
        'gùn,hùn': '棍',
        'zhí,shi': '殖',
        'xià,shà': '厦',
        'liè,liě': '裂',
        'jǐng,yǐng': '景',
        'pēn,pèn': '喷',
        'pǎo,páo': '跑',
        'hē,hè,yè': '喝',
        'pù,pū': '铺',
        'zhù,zhú': '筑',
        'dá,dā': '答',
        'bǎo,bǔ,pù': '堡',
        'ào,yù': '奥',
        'fān,pān': '番',
        'là,xī': '腊',
        'gǎng,jiǎng': '港',
        'céng,zēng': '曾',
        'yú,tōu': '愉',
        'qiáng,qiǎng,jiàng': '强',
        'shǔ,zhǔ': '属',
        'zhōu,yù': '粥',
        'shè,niè': '摄',
        'tián,zhèn': '填',
        'méng,mēng,měng': '蒙',
        'jìn,jīn': '禁',
        'lù,liù': '碌',
        'tiào,táo': '跳',
        'é,yǐ': '蛾',
        'jiě,jiè,xiè': '解',
        'shù,shǔ,shuò': '数',
        'liū,liù': '溜',
        'sāi,sài,sè': '塞',
        'pì,bì': '辟',
        'fèng,féng': '缝',
        'piě,piē': '撇',
        'mó,mú': '模',
        'bǎng,bàng': '榜',
        'shang,cháng': '裳',
        'xiān,xiǎn': '鲜',
        'yí,nǐ': '疑',
        'gāo,gào': '膏',
        'piāo,piào,piǎo': '漂',
        'suō,sù': '缩',
        'qù,cù': '趣',
        'sā,sǎ': '撒',
        'tàng,tāng': '趟',
        'héng,hèng': '横',
        'mán,mén': '瞒',
        'bào,pù': '暴',
        'mó,mā': '摩',
        'hú,hū,hù': '糊',
        'pī,pǐ': '劈',
        'yàn,yān': '燕',
        'báo,bó,bò': '薄',
        'mó,mò': '磨',
        'jiǎo,zhuó': '缴',
        'cáng,zàng': '藏',
        'fán,pó': '繁',
        'bì,bei': '臂',
        'chàn,zhàn': '颤',
        'jiāng,qiáng': '疆',
        'jiáo,jué,jiào': '嚼',
        'rǎng,rāng': '嚷',
        'lù,lòu': '露',
        'náng,nāng': '囊',
        'hāng,bèn': '夯',
        'āo,wā': '凹',
        'féng,píng': '冯',
        'xū,yù': '吁',
        'lèi,lē': '肋',
        'lūn,lún': '抡',
        'jiè,gài': '芥',
        'xīn,xìn': '芯',
        'chā,chà': '杈',
        'xiāo,xiào': '肖',
        'zhī,zī': '吱',
        'ǒu,ōu,òu': '呕',
        'nà,nè': '呐',
        'qiàng,qiāng': '呛',
        'tún,dùn': '囤',
        'kēng,háng': '吭',
        'diàn,tián': '佃',
        'sì,cì': '伺',
        'diàn,tián,shèng': '甸',
        'páo,bào': '刨',
        'duì,ruì,yuè': '兑',
        'kē,kě': '坷',
        'tuò,tà,zhí': '拓',
        'fú,bì': '拂',
        'nǐng,níng,nìng': '拧',
        'ào,ǎo,niù': '拗',
        'kē,hē': '苛',
        'yān,yǎn': '奄',
        'hē,a,kē': '呵',
        'gā,kā': '咖',
        'jiǎo,yáo': '侥',
        'chà,shā': '刹',
        'nüè,yào': '疟',
        'máng,méng': '氓',
        'gē,yì': '疙',
        'jǔ,jù': '沮',
        'zú,cù': '卒',
        'wǎn,yuān': '宛',
        'mí,mǐ': '弥',
        'qì,qiè,xiè': '契',
        'xié,jiā': '挟',
        'duò,duǒ': '垛',
        'zhà,shān,shi,cè': '栅',
        'bó,bèi': '勃',
        'zhóu,zhòu': '轴',
        'liē,liě,lié,lie': '咧',
        'yo,yō': '哟',
        'qiào,xiào': '俏',
        'hóu,hòu': '侯',
        'píng,bǐng': '屏',
        'nà,nuó': '娜',
        'pá,bà': '耙',
        'qī,xī': '栖',
        'jiǎ,gǔ': '贾',
        'láo,lào': '唠',
        'bàng,bèng': '蚌',
        'gōng,zhōng': '蚣',
        'li,lǐ,lī': '哩',
        'juè,jué': '倔',
        'yīn,yān,yǐn': '殷',
        'wō,guō': '涡',
        'lào,luò': '烙',
        'niǎn,niē': '捻',
        'yè,yē': '掖',
        'chān,xiān,càn,shǎn': '掺',
        'dǎn,shàn': '掸',
        'fēi,fěi': '菲',
        'qián,gān': '乾',
        'shuò,shí': '硕',
        'luō,luó,luo': '啰',
        'hǔ,xià': '唬',
        'dāng,chēng': '铛',
        'xiǎn,xǐ': '铣',
        'jiǎo,jiáo': '矫',
        'kuǐ,guī': '傀',
        'jì,zhài': '祭',
        'tǎng,chǎng': '淌',
        'chún,zhūn': '淳',
        'wèi,yù': '尉',
        'duò,huī': '堕',
        'chuò,chāo': '绰',
        'bēng,běng,bèng': '绷',
        'zōng,zèng': '综',
        'zhuó,zuó': '琢',
        'chuǎi,chuài,chuāi,tuán,zhuī': '揣',
        'péng,bāng': '彭',
        'zhuī,chuí': '椎',
        'léng,lēng,líng': '棱',
        'qiào,qiáo': '翘',
        'zhā,chā': '喳',
        'há,gé': '蛤',
        'qiàn,kàn': '嵌',
        'yān,ā': '腌',
        'dūn,duì': '敦',
        'kuì,huì': '溃',
        'sāo,sǎo': '骚',
        'kǎi,jiē': '楷',
        'pín,bīn': '频',
        'liú,liù': '馏',
        'nì,niào': '溺',
        'jiǎo,chāo': '剿',
        'áo,āo': '熬',
        'màn,wàn': '蔓',
        'chá,chā': '碴',
        'xūn,xùn': '熏',
        'da,dá': '瘩',
        'tuì,tùn': '褪',
        'liáo,liāo': '撩',
        'cuō,zuǒ': '撮',
        'cháo,zhāo': '嘲',
        'hēi,mò': '嘿',
        'zhuàng,chuáng': '幢',
        'jī,qǐ': '稽',
        'biě,biē': '瘪',
        'liáo,lào,lǎo': '潦',
        'chéng,dèng': '澄',
        'lèi,léi': '擂',
        'mò,má': '蟆',
        'liáo,liǎo': '燎',
        'liào,liǎo': '瞭',
        'sào,sāo': '臊',
        'mí,méi': '糜',
        'huò,huō,huá': '豁',
        'pù,bào': '瀑',
        'zǎn,cuán': '攒',
        'bò,bǒ': '簸',
        'bó,bù': '簿'
      })
    )
  ;(ja.exports = ni.convert.bind(ni)),
    (ja.exports.compare = ni.compare.bind(ni)),
    (ja.exports.STYLE_NORMAL = ti.STYLE_NORMAL),
    (ja.exports.STYLE_TONE = ti.STYLE_TONE),
    (ja.exports.STYLE_TONE2 = ti.STYLE_TONE2),
    (ja.exports.STYLE_TO3NE = ti.STYLE_TO3NE),
    (ja.exports.STYLE_INITIALS = ti.STYLE_INITIALS),
    (ja.exports.STYLE_FIRST_LETTER = ti.STYLE_FIRST_LETTER)
  var oi = ja.exports
  const li = e => {
      if (!Array.isArray(e)) throw new TypeError('params muse be array.')
      if (!e.length) return []
      const t = []
      return (
        (e = (e = e.map(e => {
          if (!e.name) return new Error('the data must includes `name` props')
          let t = oi(e.name, { style: oi.STYLE_NORMAL })
          return __spreadProps(__spreadValues({}, e), {
            firstCode: t[0][0].charAt(0).toUpperCase()
          })
        })).sort((e, t) => e.firstCode.localeCompare(t.firstCode))).forEach(
          e => {
            const n = t.findIndex(t => t.title === e.firstCode)
            n <= -1
              ? t.push({ title: e.firstCode, list: [].concat(e) })
              : (t[n] = { title: e.firstCode, list: t[n].list.concat(e) })
          }
        ),
        t
      )
    },
    { componentName: ai, create: ii } = o('address')
  var ri = ii({
    inheritAttrs: !1,
    props: {
      visible: { type: Boolean, default: !1 },
      type: { type: String, default: 'custom' },
      customAddressTitle: { type: String, default: '请选择所在地区' },
      province: { type: Array, default: () => [] },
      city: { type: Array, default: () => [] },
      country: { type: Array, default: () => [] },
      town: { type: Array, default: () => [] },
      isShowCustomAddress: { type: Boolean, default: !0 },
      existAddress: { type: Array, default: () => [] },
      existAddressTitle: { type: String, default: '配送至' },
      customAndExistTitle: { type: String, default: '选择其他地址' },
      defaultIcon: { type: String, default: 'location2' },
      selectedIcon: { type: String, default: 'Check' },
      closeBtnIcon: { type: String, default: 'circle-close' },
      backBtnIcon: { type: String, default: 'left' },
      height: { type: [String, Number], default: '200px' }
    },
    emits: [
      'update:visible',
      'type',
      'change',
      'selected',
      'close',
      'close-mask',
      'switch-module'
    ],
    setup(e, { emit: n }) {
      const o = t.ref(null),
        l = t.reactive({
          province: t.ref(null),
          city: t.ref(null),
          country: t.ref(null),
          town: t.ref(null)
        }),
        a = t.ref(e.visible),
        i = t.ref(e.type),
        r = t.ref(0),
        s = t.ref(['province', 'city', 'country', 'town']),
        c = t.computed(() => 'custom2' === e.type),
        u = t.reactive({
          province: c.value ? li(e.province) : e.province,
          city: c.value ? li(e.city) : e.city,
          country: c.value ? li(e.country) : e.country,
          town: c.value ? li(e.town) : e.town
        }),
        d = t.reactive({ province: {}, city: {}, country: {}, town: {} })
      let p = t.reactive({})
      const m = t.ref('self'),
        h = t.ref(20),
        g = (t = 'self') => {
          e.closeBtnIcon &&
            ((m.value = 'cross' == t ? 'cross' : 'self'), (a.value = !1))
        },
        y = () => {
          const e = l[s.value[r.value]]
          t.nextTick(() => {
            if (e) {
              const t = e.offsetLeft
              ;(h.value = t), console.log(e)
            }
          })
        },
        f = e => {
          const t = { next: '', value: '', custom: s.value[r.value] }
          d[s.value[r.value]] = e
          for (let n = r.value; n < r.value - 1; n++) d[s.value[n + 1]] = {}
          r.value < 3
            ? ((r.value = r.value + 1),
              y(),
              (t.next = s.value[r.value]),
              (t.value = e),
              n('change', t))
            : g()
        },
        v = () => {
          for (let e = 0; e < s.value.length; e++) d[s.value[e]] = {}
          ;(r.value = 0), y()
        },
        k = () => {
          const e = Object.assign({ addressIdStr: '', addressStr: '' }, d),
            t = { data: {}, type: i.value }
          if ('custom' == i.value || 'custom2' == i.value) {
            const { province: n, city: o, country: l, town: a } = e
            ;(e.addressIdStr = [
              n.id || 0,
              o.id || 0,
              l.id || 0,
              a.id || 0
            ].join('_')),
              (e.addressStr = [n.name, o.name, l.name, a.name].join('')),
              (t.data = e)
          } else t.data = p
          v(),
            'self' == m.value
              ? n('close', t)
              : n('close-mask', { closeWay: m }),
            n('update:visible', !1)
        }
      return (
        t.watch(
          () => e.visible,
          e => {
            a.value = e
          }
        ),
        t.watch(
          () => a.value,
          e => {
            0 == e && k()
          }
        ),
        t.watch(
          () => e.province,
          e => {
            u.province = c.value ? li(e) : e
          }
        ),
        t.watch(
          () => e.city,
          e => {
            u.city = c.value ? li(e) : e
          }
        ),
        t.watch(
          () => e.country,
          e => {
            u.country = c.value ? li(e) : e
          }
        ),
        t.watch(
          () => e.town,
          e => {
            u.town = c.value ? li(e) : e
          }
        ),
        t.watch(
          () => e.existAddress,
          e => {
            e.forEach((e, t) => {
              e.selectedAddress && (p = e)
            })
          }
        ),
        __spreadValues(
          __spreadValues(
            {
              showPopup: a,
              privateType: i,
              tabIndex: r,
              tabName: s,
              regionList: u,
              selectedRegion: d,
              selectedExistAddress: p,
              switchModule: () => {
                'exist' == i.value ? (i.value = 'custom') : (i.value = 'exist'),
                  v(),
                  n('switch-module', { type: i.value })
              },
              closeWay: m,
              close: k,
              getTabName: (e, t) => (e.name || r.value < t ? e.name : '请选择'),
              nextAreaList: f,
              regionLine: o,
              lineDistance: h,
              changeRegionTab: (e, t, n) => {
                ;(r.value = n), y()
              },
              selectedExist: t => {
                const o = e.existAddress
                let l = {}
                o.forEach((e, t) => {
                  e && e.selectedAddress && (l = e), (e.selectedAddress = !1)
                }),
                  (t.selectedAddress = !0),
                  (p = t),
                  n('selected', l, t, o),
                  g()
              },
              clickOverlay: () => {
                m.value = 'mask'
              },
              handClose: g,
              handleElevatorItem: (e, t) => {
                f(t)
              }
            },
            t.toRefs(e)
          ),
          t.toRefs(l)
        )
      )
    }
  })
  t.pushScopeId('data-v-0667dfaf')
  const si = { class: 'nut-address' },
    ci = { class: 'nut-address__header' },
    ui = { class: 'nut-address__header__title' },
    di = { key: 0, class: 'custom-address' },
    pi = { class: 'region-tab' },
    mi = ['onClick'],
    hi = { class: 'region-con' },
    gi = { class: 'region-group' },
    yi = ['onClick'],
    fi = { key: 1, class: 'custom-address' },
    vi = { class: 'region-tab' },
    ki = ['onClick'],
    bi = { class: 'elevator-group' },
    wi = { key: 2, class: 'exist-address' },
    Si = { class: 'exist-address-group' },
    xi = { class: 'exist-ul' },
    Ci = ['onClick'],
    Bi = { class: 'exist-item-info' },
    Ni = { key: 0, class: 'exist-item-info-top' },
    Ei = { class: 'exist-item-info-name' },
    _i = { class: 'exist-item-info-phone' },
    zi = { class: 'exist-item-info-bottom' },
    Ti = { class: 'btn' }
  t.popScopeId(),
    (ri.render = function (e, n, o, l, a, i) {
      const r = t.resolveComponent('nut-icon'),
        s = t.resolveComponent('nut-elevator'),
        c = t.resolveComponent('nut-popup')
      return (
        t.openBlock(),
        t.createBlock(
          c,
          {
            position: 'bottom',
            onClose: e.close,
            onClickOverlay: e.clickOverlay,
            onOpen: n[3] || (n[3] = t => (e.closeWay = 'self')),
            visible: e.showPopup,
            'onUpdate:visible': n[4] || (n[4] = t => (e.showPopup = t))
          },
          {
            default: t.withCtx(() => [
              t.createElementVNode('view', si, [
                t.createElementVNode('view', ci, [
                  t.createElementVNode(
                    'view',
                    {
                      class: 'arrow-back',
                      onClick:
                        n[0] ||
                        (n[0] = (...t) =>
                          e.switchModule && e.switchModule(...t))
                    },
                    [
                      t.withDirectives(
                        t.createVNode(
                          r,
                          { name: e.backBtnIcon, color: '#cccccc' },
                          null,
                          8,
                          ['name']
                        ),
                        [[t.vShow, 'custom' == e.privateType && e.backBtnIcon]]
                      )
                    ]
                  ),
                  t.createElementVNode(
                    'view',
                    ui,
                    t.toDisplayString(
                      'custom' == e.privateType
                        ? e.customAddressTitle
                        : e.existAddressTitle
                    ),
                    1
                  ),
                  t.createElementVNode(
                    'view',
                    {
                      class: 'arrow-close',
                      onClick: n[1] || (n[1] = t => e.handClose('cross'))
                    },
                    [
                      e.closeBtnIcon
                        ? (t.openBlock(),
                          t.createBlock(
                            r,
                            {
                              key: 0,
                              name: e.closeBtnIcon,
                              color: '#cccccc',
                              size: '18px'
                            },
                            null,
                            8,
                            ['name']
                          ))
                        : t.createCommentVNode('', !0)
                    ]
                  )
                ]),
                'custom' == e.privateType
                  ? (t.openBlock(),
                    t.createElementBlock('view', di, [
                      t.createElementVNode('view', pi, [
                        (t.openBlock(!0),
                        t.createElementBlock(
                          t.Fragment,
                          null,
                          t.renderList(
                            e.selectedRegion,
                            (n, o, l) => (
                              t.openBlock(),
                              t.createElementBlock(
                                'view',
                                {
                                  class: t.normalizeClass([
                                    'tab-item',
                                    [l == e.tabIndex ? 'active' : '']
                                  ]),
                                  key: l,
                                  ref: o,
                                  onClick: t => e.changeRegionTab(n, o, l)
                                },
                                [
                                  t.createElementVNode(
                                    'view',
                                    null,
                                    t.toDisplayString(e.getTabName(n, l)),
                                    1
                                  )
                                ],
                                10,
                                mi
                              )
                            )
                          ),
                          128
                        )),
                        t.createElementVNode(
                          'view',
                          {
                            class: 'region-tab-line',
                            ref: 'regionLine',
                            style: t.normalizeStyle({
                              left: e.lineDistance + 'px'
                            })
                          },
                          null,
                          4
                        )
                      ]),
                      t.createElementVNode('view', hi, [
                        t.createElementVNode('ul', gi, [
                          (t.openBlock(!0),
                          t.createElementBlock(
                            t.Fragment,
                            null,
                            t.renderList(
                              e.regionList[e.tabName[e.tabIndex]],
                              (n, o) => (
                                t.openBlock(),
                                t.createElementBlock(
                                  'li',
                                  {
                                    key: o,
                                    class: t.normalizeClass([
                                      'region-item',
                                      [
                                        e.selectedRegion[e.tabName[e.tabIndex]]
                                          .id == n.id
                                          ? 'active'
                                          : ''
                                      ]
                                    ]),
                                    onClick: t => e.nextAreaList(n)
                                  },
                                  [
                                    e.selectedRegion[e.tabName[e.tabIndex]]
                                      .id == n.id
                                      ? (t.openBlock(),
                                        t.createBlock(
                                          r,
                                          {
                                            key: 0,
                                            class: 'region-item-icon',
                                            type: 'self',
                                            name: e.selectedIcon,
                                            color: '#FA2C19',
                                            size: '13px'
                                          },
                                          null,
                                          8,
                                          ['name']
                                        ))
                                      : t.createCommentVNode('', !0),
                                    t.createTextVNode(
                                      t.toDisplayString(n.name),
                                      1
                                    )
                                  ],
                                  10,
                                  yi
                                )
                              )
                            ),
                            128
                          ))
                        ])
                      ])
                    ]))
                  : 'custom2' == e.privateType
                  ? (t.openBlock(),
                    t.createElementBlock('view', fi, [
                      t.createElementVNode('view', vi, [
                        (t.openBlock(!0),
                        t.createElementBlock(
                          t.Fragment,
                          null,
                          t.renderList(
                            e.selectedRegion,
                            (n, o, l) => (
                              t.openBlock(),
                              t.createElementBlock(
                                'view',
                                {
                                  class: t.normalizeClass([
                                    'tab-item',
                                    [l == e.tabIndex ? 'active' : '']
                                  ]),
                                  key: l,
                                  ref: o,
                                  onClick: t => e.changeRegionTab(n, o, l)
                                },
                                [
                                  t.createElementVNode(
                                    'view',
                                    null,
                                    t.toDisplayString(e.getTabName(n, l)),
                                    1
                                  )
                                ],
                                10,
                                ki
                              )
                            )
                          ),
                          128
                        )),
                        t.createElementVNode(
                          'view',
                          {
                            class: 'region-tab-line',
                            ref: 'regionLine',
                            style: t.normalizeStyle({
                              left: e.lineDistance + 'px'
                            })
                          },
                          null,
                          4
                        )
                      ]),
                      t.createElementVNode('view', bi, [
                        t.createVNode(
                          s,
                          {
                            height: e.height,
                            'index-list': e.regionList[e.tabName[e.tabIndex]],
                            onClickItem: e.handleElevatorItem
                          },
                          null,
                          8,
                          ['height', 'index-list', 'onClickItem']
                        )
                      ])
                    ]))
                  : 'exist' == e.privateType
                  ? (t.openBlock(),
                    t.createElementBlock('view', wi, [
                      t.createElementVNode('div', Si, [
                        t.createElementVNode('ul', xi, [
                          (t.openBlock(!0),
                          t.createElementBlock(
                            t.Fragment,
                            null,
                            t.renderList(
                              e.existAddress,
                              (n, o) => (
                                t.openBlock(),
                                t.createElementBlock(
                                  'li',
                                  {
                                    class: t.normalizeClass([
                                      'exist-item',
                                      [n.selectedAddress ? 'active' : '']
                                    ]),
                                    key: o,
                                    onClick: t => e.selectedExist(n)
                                  },
                                  [
                                    t.createVNode(
                                      r,
                                      {
                                        class: 'exist-item-icon',
                                        type: 'self',
                                        name: n.selectedAddress
                                          ? e.selectedIcon
                                          : e.defaultIcon,
                                        color: n.selectedAddress
                                          ? '#FA2C19'
                                          : '',
                                        size: '13px'
                                      },
                                      null,
                                      8,
                                      ['name', 'color']
                                    ),
                                    t.createElementVNode('div', Bi, [
                                      n.name && n.phone
                                        ? (t.openBlock(),
                                          t.createElementBlock('div', Ni, [
                                            t.createElementVNode(
                                              'div',
                                              Ei,
                                              t.toDisplayString(n.name),
                                              1
                                            ),
                                            t.createElementVNode(
                                              'div',
                                              _i,
                                              t.toDisplayString(n.phone),
                                              1
                                            )
                                          ]))
                                        : t.createCommentVNode('', !0),
                                      t.createElementVNode('div', zi, [
                                        t.createElementVNode(
                                          'view',
                                          null,
                                          t.toDisplayString(
                                            n.provinceName +
                                              n.cityName +
                                              n.countyName +
                                              n.townName +
                                              n.addressDetail
                                          ),
                                          1
                                        )
                                      ])
                                    ])
                                  ],
                                  10,
                                  Ci
                                )
                              )
                            ),
                            128
                          ))
                        ])
                      ]),
                      e.isShowCustomAddress
                        ? (t.openBlock(),
                          t.createElementBlock(
                            'div',
                            {
                              key: 0,
                              class: 'choose-other',
                              onClick:
                                n[2] ||
                                (n[2] = (...t) =>
                                  e.switchModule && e.switchModule(...t))
                            },
                            [
                              t.createElementVNode(
                                'div',
                                Ti,
                                t.toDisplayString(e.customAndExistTitle),
                                1
                              )
                            ]
                          ))
                        : t.createCommentVNode('', !0)
                    ]))
                  : t.createCommentVNode('', !0)
              ])
            ]),
            _: 1
          },
          8,
          ['onClose', 'onClickOverlay', 'visible']
        )
      )
    }),
    (ri.__scopeId = 'data-v-0667dfaf')
  const { componentName: Vi, create: Di } = o('barrage')
  var Ii = Di({
    props: {
      danmu: { type: Array, default: () => [] },
      frequency: { type: Number, default: 200 },
      speeds: { type: Number, default: 2e3 },
      rows: { type: Number, default: 3 },
      top: { type: Number, default: 10 },
      loop: { type: Boolean, default: !0 }
    },
    emits: ['click'],
    setup(e, { emit: n }) {
      const o = t.computed(() => ({ [Vi]: !0 }))
      let l = t.ref(document.createElement('div')),
        a = t.ref(document.createElement('div')),
        i = 0
      const r = t.ref(e.danmu),
        s = t.ref(e.rows),
        c = t.ref(e.top),
        u = t.ref(0),
        d = e.speeds,
        p = t.ref(0)
      t.onMounted(() => {
        ;(p.value = l.value.offsetWidth), m()
      }),
        t.onUnmounted(() => {
          clearInterval(i), (i = 0)
        }),
        t.onDeactivated(() => {
          clearInterval(i), (i = 0)
        }),
        t.watch(
          () => e.danmu,
          (e, t) => {
            r.value = [...e]
          }
        )
      const m = () => {
          clearInterval(i),
            (i = 0),
            (i = setInterval(() => {
              h(), m()
            }, e.frequency))
        },
        h = () => {
          const n = e.loop ? u.value % r.value.length : u.value
          let o = document.createElement('view')
          ;(o.innerHTML = r.value[n]),
            o.classList.add('dmitem'),
            a.value.appendChild(o),
            t.nextTick(() => {
              const e = o.offsetWidth,
                t = o.offsetHeight
              o.classList.add('move'),
                (o.style.animationDuration = `${d}ms`),
                (o.style.top = (n % s.value) * (t + c.value) + 'px'),
                (o.style.width = e + 20 + 'px'),
                o.style.setProperty('--move-distance', `-${p.value}px`),
                (o.dataset.index = `${n}`),
                o.addEventListener('animationend', () => {
                  a.value.removeChild(o)
                }),
                u.value++
            })
        }
      return {
        classes: o,
        danmuList: r,
        dmBody: l,
        dmContainer: a,
        add: e => {
          const t = u.value % r.value.length
          r.value.splice(t, 0, e)
        }
      }
    }
  })
  const Mi = { ref: 'dmContainer', class: 'dmContainer' }
  Ii.render = function (e, n, o, l, a, i) {
    return (
      t.openBlock(),
      t.createElementBlock(
        'view',
        { ref: 'dmBody', class: t.normalizeClass(e.classes) },
        [t.createElementVNode('view', Mi, null, 512)],
        2
      )
    )
  }
  const { componentName: Li, create: Pi } = o('signature')
  var ji = Pi({
    props: {
      customClass: { type: String, default: '' },
      lineWidth: { type: Number, default: 2 },
      strokeStyle: { type: String, default: '#000' },
      type: { type: String, default: 'png' },
      unSupportTpl: {
        type: String,
        default: '对不起，当前浏览器不支持Canvas，无法使用本控件！'
      }
    },
    components: {},
    emits: ['confirm', 'clear'],
    setup(e, { emit: n }) {
      const o = t.ref(null),
        l = t.ref(null),
        a = t.computed(() => ({
          [Li]: !0,
          [`${e.customClass}`]: e.customClass
        })),
        i = t.reactive({
          canvasHeight: 0,
          canvasWidth: 0,
          ctx: null,
          isSupportTouch: 'ontouchstart' in window,
          events:
            'ontouchstart' in window
              ? ['touchstart', 'touchmove', 'touchend', 'touchleave']
              : ['mousedown', 'mousemove', 'mouseup', 'mouseleave']
        }),
        r = () => {
          let e = document.createElement('canvas')
          return !(!e.getContext || !e.getContext('2d'))
        },
        s = t => {
          t.preventDefault(),
            i.ctx.beginPath(),
            (i.ctx.lineWidth = e.lineWidth),
            (i.ctx.strokeStyle = e.strokeStyle),
            o.value.addEventListener(i.events[1], c, !1),
            o.value.addEventListener(i.events[2], u, !1),
            o.value.addEventListener(i.events[3], d, !1)
        },
        c = e => {
          e.preventDefault()
          let t = i.isSupportTouch ? e.touches[0] : e,
            n = o.value.getBoundingClientRect(),
            l = t.clientX - n.left,
            a = t.clientY - n.top
          i.ctx.lineTo(l, a), i.ctx.stroke()
        },
        u = e => {
          e.preventDefault(),
            o.value.removeEventListener(i.events[1], c, !1),
            o.value.removeEventListener(i.events[2], u, !1)
        },
        d = e => {
          e.preventDefault(),
            o.value.removeEventListener(i.events[1], c, !1),
            o.value.removeEventListener(i.events[2], u, !1)
        },
        p = () => {
          o.value.addEventListener(i.events[2], u, !1),
            i.ctx.clearRect(0, 0, i.canvasWidth, i.canvasHeight),
            i.ctx.closePath(),
            n('clear')
        },
        m = t => {
          let o
          switch (e.type) {
            case 'png':
              o = t.toDataURL('image/png')
              break
            case 'jpg':
              o = t.toDataURL('image/jpeg', 0.8)
          }
          p(), n('confirm', t, o)
        }
      return (
        t.onMounted(() => {
          r() &&
            ((i.ctx = o.value.getContext('2d')),
            (i.canvasWidth = l.value.offsetWidth),
            (i.canvasHeight = l.value.offsetHeight),
            o.value.addEventListener(i.events[0], s, !1))
        }),
        {
          canvas: o,
          wrap: l,
          isCanvasSupported: r,
          confirm: () => {
            m(o.value)
          },
          clear: p,
          classes: a
        }
      )
    }
  })
  const $i = { class: 'nut-signature-inner', ref: 'wrap' },
    Ai = ['height', 'width'],
    Fi = { key: 1, class: 'nut-signature-unsopport' },
    Oi = t.createTextVNode('重签'),
    qi = t.createTextVNode('确认')
  function Ri(e) {
    ;[
      i,
      h,
      v,
      x,
      d,
      _,
      P,
      $,
      O,
      H,
      U,
      re,
      ye,
      ve,
      we,
      Ie,
      qe,
      Ye,
      st,
      pt,
      St,
      le,
      Pt,
      At,
      Kt,
      Qt,
      tn,
      gn,
      fn,
      wn,
      _n,
      In,
      An,
      Un,
      eo,
      oo,
      ro,
      co,
      fo,
      Ao,
      qo,
      Yo,
      rl,
      ul,
      yl,
      xl,
      Nl,
      zl,
      Zo,
      Dl,
      Hl,
      Ql,
      ua,
      ha,
      _a,
      ri,
      Ii,
      ji
    ].forEach(t => {
      t.install ? e.use(t) : t.name && e.component(t.name, t)
    })
  }
  ji.render = function (e, n, o, l, a, i) {
    const r = t.resolveComponent('nut-button')
    return (
      t.openBlock(),
      t.createElementBlock(
        'div',
        { class: t.normalizeClass(e.classes) },
        [
          t.createElementVNode(
            'div',
            $i,
            [
              e.isCanvasSupported
                ? (t.openBlock(),
                  t.createElementBlock(
                    'canvas',
                    {
                      key: 0,
                      ref: 'canvas',
                      height: e.canvasHeight,
                      width: e.canvasWidth
                    },
                    null,
                    8,
                    Ai
                  ))
                : (t.openBlock(),
                  t.createElementBlock(
                    'p',
                    Fi,
                    t.toDisplayString(e.unSupportTpl),
                    1
                  ))
            ],
            512
          ),
          t.createVNode(
            r,
            {
              class: 'nut-signature-btn',
              type: 'default',
              onClick: n[0] || (n[0] = t => e.clear())
            },
            { default: t.withCtx(() => [Oi]), _: 1 }
          ),
          t.createVNode(
            r,
            {
              class: 'nut-signature-btn',
              type: 'primary',
              onClick: n[1] || (n[1] = t => e.confirm())
            },
            { default: t.withCtx(() => [qi]), _: 1 }
          )
        ],
        2
      )
    )
  }
  var Hi = { install: Ri, version: '3.1.5' }
  ;(e.ActionSheet = re),
    (e.Address = ri),
    (e.Avatar = i),
    (e.BackTop = ye),
    (e.Barrage = Ii),
    (e.Button = h),
    (e.Calendar = Ao),
    (e.Cell = v),
    (e.CellGroup = x),
    (e.Checkbox = qo),
    (e.CheckboxGroup = Yo),
    (e.CircleProgress = wn),
    (e.Col = O),
    (e.Collapse = ve),
    (e.CollapseItem = we),
    (e.CountDown = _a),
    (e.CountUp = ua),
    (e.DatePicker = rl),
    (e.Dialog = qe),
    (e.Drag = Ie),
    (e.Elevator = fo),
    (e.FixedNav = An),
    (e.Icon = d),
    (e.InfiniteLoading = Ye),
    (e.Input = yl),
    (e.InputNumber = ul),
    (e.Layout = $),
    (e.MenuItem = oo),
    (e.Navbar = In),
    (e.NoticeBar = _n),
    (e.Notify = st),
    (e.NumberKeyboard = ha),
    (e.OverLay = P),
    (e.Picker = Zo),
    (e.Popup = le),
    (e.Price = _),
    (e.Progress = fn),
    (e.Radio = xl),
    (e.RadioGroup = Nl),
    (e.Range = pt),
    (e.Rate = zl),
    (e.Row = H),
    (e.ShortPassword = Dl),
    (e.Signature = ji),
    (e.Step = At),
    (e.Steps = Pt),
    (e.Swipe = U),
    (e.Swiper = Kt),
    (e.SwiperItem = Qt),
    (e.Switch = tn),
    (e.Tab = Un),
    (e.TabPanel = eo),
    (e.Tabbar = ro),
    (e.TabbarItem = co),
    (e.TextArea = Hl),
    (e.Toast = gn),
    (e.Uploader = Ql),
    (e.Video = St),
    (e.default = Hi),
    (e.install = Ri),
    Object.defineProperty(e, '__esModule', { value: !0 }),
    (e[Symbol.toStringTag] = 'Module')
})
