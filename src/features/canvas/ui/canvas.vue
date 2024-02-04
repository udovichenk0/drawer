<script lang="ts" setup>
import { onMounted } from 'vue';
import { canvas, stage, layer, initCanvas } from '../infrastructure/store'
defineProps<{
  onDraw?: (e: MouseEvent) => void
}>()

onMounted(() => {
  initCanvas()
})

defineExpose({
  canvas,
  stage,
  layer
})

</script>

<template>
  <div 
    @mousedown="onDraw"
    class="canvas" 
    :ref="(el) => canvas = el as HTMLDivElement" 
    id="canvas-container"></div>
</template>
<style scoped>
.canvas {
  width: 100vw;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>