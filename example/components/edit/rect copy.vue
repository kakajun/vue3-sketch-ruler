<template>
  <div id="leafer-rect"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Leafer, Rect } from 'leafer-ui'
onMounted(() => {
  const leafer = new Leafer({ view: 'leafer-rect' })

  const rect = new Rect({
    width: 100,
    height: 100,
    fill: 'rgb(50,205,121)'
  })

  leafer.add(rect)
})
</script>

<style lang="scss" scoped>
#leafer-view {
  width: 100%;
  height: 100%;
}
</style>
