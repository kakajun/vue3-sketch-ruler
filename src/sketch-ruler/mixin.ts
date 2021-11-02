const getPalette = palette => {
  function merge(obj: { [key: string]: any }, o: { [key: string]: any }) {
    Object.keys(obj).forEach(key => {
      if (key && obj.hasOwnProperty(key)) {
        if (typeof o['key'] === 'object') {
          obj[key] = merge(obj[key], o[key])
        } else if (o.hasOwnProperty(key)) {
          obj[key] = o[key]
        }
      }
    })
    return obj
  }
  const finalObj = merge(
    {
      bgColor: 'rgba(225,225,225, 0)', // ruler bg color
      longfgColor: '#BABBBC', // ruler longer mark color
      shortfgColor: '#C8CDD0', // ruler shorter mark color
      fontColor: '#7D8694', // ruler font color
      shadowColor: '#E8E8E8', // ruler shadow color
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
    palette || {}
  )
  return finalObj
}
export default getPalette
