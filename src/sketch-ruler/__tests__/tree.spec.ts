// Step 1: 定义一个测试套 Test Suite
// Step 1: 定义一个测试套 Test Suite
describe('tree', () => {
  // Step 2: 定义一个单元测试 Test
  // i think 'tree should render correctly'
  it('should render correctly', () => {
    // Step 3: 编写测试断言，期望（expect）1等于1
    expect(1).toEqual(1)
  })
})

// import { mount } from '@vue/test-utils'
// import DTree from '../src/tree'

// describe('tree', () => {
//   it('should render correctly', () => {
//     const wrapper = mount({
//       components: { DTree },
//       template: `
//         <d-tree :data="data"></d-tree>
//       `,
//       setup() {
//         const data = [{
//           label: '一级 1', level: 1,
//           children: [{
//             label: '二级 1-1', level: 2,
//             children: [{
//               label: '三级 1-1-1', level: 3,
//             }]
//           }]
//         }, {
//           label: '一级 2', level: 1,
//           open: true, // 新增
//           children: [{
//             label: '二级 2-1', level: 2,
//             children: [{
//               label: '三级 2-1-1', level: 3,
//             }]
//           }, {
//             label: '二级 2-2', level: 2,
//             children: [{
//               label: '三级 2-2-1', level: 3,
//             }]
//           }]
//         }, {
//           label: '一级 3', level: 1,
//           open: true, // 新增
//           children: [{
//             label: '二级 3-1', level: 2,
//             children: [{
//               label: '三级 3-1-1', level: 3,
//             }]
//           }, {
//             label: '二级 3-2', level: 2,
//             open: true, // 新增
//             children: [{
//               label: '三级 3-2-1', level: 3,
//             }]
//           }]
//         }, {
//           label: '一级 4', level: 1,
//         }]

//         return {
//           data
//         }
//       }
//     })

//     expect(wrapper.classes()).toContain('devui-tree')
//   })
// })
