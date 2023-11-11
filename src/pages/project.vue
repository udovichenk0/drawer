<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Canvas from '../canvas/canvas.vue'
import { drawFactory } from '@/draw/draw.model';
import { canvas } from '@/canvas/model';
const refToCanvas = ref<InstanceType<typeof Canvas> | null>(null)
// const {startDraw, strokeWidth} = drawFactory({canvas, stage, layer})
const s = () => {
  const a = () => {
    console.log(canvas.value)
  }
  return a
}
const a = s()
onMounted(() => {
  if(refToCanvas.value){
    console.log(refToCanvas.value.canvas)
  }
})
</script>
<template>
  <button @click="a"></button>
  <Canvas  ref="refToCanvas"/>
</template>