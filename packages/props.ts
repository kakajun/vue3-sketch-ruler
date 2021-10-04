import type { PropType } from 'vue'
import type { PaletteType } from './index'

const DEFAULTMENU = {
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

export const props = {
  scale: {
    type: Number,
    default: 1
  },
  ratio: {
    type: Number,
    default: window.devicePixelRatio || 1
  },
  thick: {
    type: Number,
    default: 16
  },

  horLineArr: {
    type: Array as unknown as PropType<[number, number]>,
    require: true
  },
  palette: {
    type: Object as PropType<PaletteType>,
    default: () => {
      return {
        bgColor: 'rgba(225,225,225, 0)', // ruler bg color
        longfgColor: '#BABBBC', // ruler longer mark color
        shortfgColor: '#C8CDD0', // ruler shorter mark color
        fontColor: '#7D8694', // ruler font color
        shadowColor: '#E8E8E8', // ruler shadow color
        lineColor: '#EB5648',
        borderColor: '#DADADC',
        cornerActiveColor: 'rgb(235, 86, 72, 0.6)',
        menu: DEFAULTMENU
      }
    }
  }
}
