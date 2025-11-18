<template>
  <div id="app">
    <ul class="tabs">
      <li
        v-for="tab in tabs"
        :key="tab.name"
        :class="{ active: activeTab === tab.name }"
        @click="switchTab(tab.name)"
      >
        {{ tab.title }}
      </li>
    </ul>
    <div class="tab-content">
      <component :is="activeTab"></component>
    </div>
  </div>
</template>

<script setup>
import tab1 from './tab1'
import tab2 from './tab2'
import tab3 from './tab3'
const activeTab = ref('tab1')
const tabs = [
  { name: 'tab1', title: 'Tab 1' },
  { name: 'tab2', title: 'Tab 2' },
  { name: 'tab3', title: 'Tab 3' }
]

const switchTab = tabName => {
  activeTab.value = tabName
}
</script>

<style>
* {
  box-sizing: border-box;
}
body {
  position: relative;
  background-color: #eee;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.tabs {
  list-style: none;
  padding: 0;
  margin: 0;
}
.tabs li {
  display: inline-block;
  margin-right: 10px;
  padding: 10px;
  cursor: pointer;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
}
.tabs li.active {
  background-color: #e0e0e0;
}
.tab-content {
  padding: 20px;
  border: 1px solid #ccc;
  border-top: none;
}
</style>
