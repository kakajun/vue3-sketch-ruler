<template>
  <div class="tabs-container">
    <ul class="tab-buttons">
      <TabItem
        v-for="(item, index) in tabs"
        :key="index"
        :name="item.name"
        :isActive="currentIndex === index"
        @click="switchTab(index)"
      >
        {{ item.label }}
      </TabItem>
    </ul>
    <div class="tab-contents">
      <div class="tab-content">
        <component :is="currentComponent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import UserRuler from './components/user-rulerts.vue'
import UserRuler2 from './components/user-rulerts2.vue'
import UserRuler3 from './components/user-rulerts3.vue'
import { ref } from 'vue'
import TabItem from './TabItem.vue'

const tabs = [
  { label: '写法1', index: 0 },
  { label: '写法2', index: 1 },
  { label: '自定义按键', index: 2 }
]
const currentIndex = ref(0)
const currentComponent = ref(UserRuler)
function switchTab(index) {
  currentIndex.value = index
  switch (index) {
    case 0:
      currentComponent.value = UserRuler
      break
    case 1:
      currentComponent.value = UserRuler2
      break
    case 2:
      currentComponent.value = UserRuler3
      break
    default:
      currentComponent.value = UserRuler
  }
}
</script>

<style scoped>
.tabs-container {
  display: flex;
  flex-direction: column;
}

.tab-buttons {
  display: flex;
  gap: 10px;
  list-style-type: none; /* 去掉 li 标签前面的点 */
  padding-left: 10px; /* 清除默认的左侧内边距 */
}
</style>
