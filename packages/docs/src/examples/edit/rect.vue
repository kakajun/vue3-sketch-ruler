<script setup lang="ts">
import { onMounted } from 'vue'
import { Leafer, Rect } from 'leafer-ui'

onMounted(() => {
  const leafer = new Leafer({ view: 'leafer-view' })

  const rect = new Rect({
    x: 100,
    y: 100,
    width: 200,
    height: 200,
    fill: '#32cd79',
    cornerRadius: [50, 80, 0, 80],
    draggable: true
  })

  leafer.add(rect)
})
</script>

<template>
  <div id="leafer-view"></div>
</template>

<style scoped>
#leafer-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
