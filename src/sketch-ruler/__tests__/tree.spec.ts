import { mount } from '@vue/test-utils'

// The component to test
const MessageComponent = {
  template: '<p>{{ msg }}</p>',
  props: ['msg']
}

test('displays message', () => {
  const wrapper = mount(MessageComponent, {
    props: {
      msg: 'Hello world'
    }
  })

  // Assert the rendered text of the component
  expect(wrapper.text()).toContain('Hello world')
})

// Step 1: 定义一个测试套 Test Suite
// Step 1: 定义一个测试套 Test Suite
// describe('tree', () => {
//   // Step 2: 定义一个单元测试 Test
//   // i think 'tree should render correctly'
//   it('should render correctly', () => {
//     // Step 3: 编写测试断言，期望（expect）1等于1
//     expect(1).toEqual(1)
//   })
// })
