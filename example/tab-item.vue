<template>
  <li :class="{ active: isActive }" @click="$emit('click', name)">
    <slot></slot>
  </li>
</template>

<script setup>
defineProps({
  name: String,
  isActive: Boolean
})
</script>

<style scoped>
.active {
  font-weight: bold;
}
</style>
