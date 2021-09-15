module.exports = {
  endOfLine: 'auto',
  tabWidth: 2, // tab缩进大小, 默认为2
  useTabs: false, // 使用tab缩进, 默认false
  semi: false, // 行末分号, 默认true
  singleQuote: true, // 使用单引号, 默认false
  quoteProps: 'as-needed', // 仅在需要时在对象属性周围添加引号, 默认'as-needed'
  trailingComma: 'none', // 结尾是否强制添加逗号，默认none, 可选 none|es5|all
  bracketSpacing: true, // 对象中的空格, 默认true
  jsxSingleQuote: false, // jsx中是否使用单引号, 默认false
  // endOfLine: 'lf', // 定义结尾换行符 \n \r \n\r，默认auto
  arrowParens: 'avoid', // (x) => {} 箭头函数参数只有一个时是否要有小括号, avoid: 省略括号
  vueIndentScriptAndStyle: false // vue文件的script标签和Style标签下的内容需要缩进, 默认false
}
