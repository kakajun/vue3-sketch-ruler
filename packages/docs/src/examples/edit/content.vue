<script setup>
import rect from './rect.vue'
const props = defineProps({
  item: Object
})
</script>
<template>
  <component :item="item" :is="item.type"></component>
</template>
<style scoped></style>
