<script setup>
import rect from './rect.vue'
const props = defineProps({
  item: Object
})
</script>
<template>
  <component :is="item.type" :item="item"></component>
</template>
<style scoped></style>
