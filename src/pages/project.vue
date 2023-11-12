<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Canvas from '../canvas/canvas.vue'
const refToCanvas = ref<InstanceType<typeof Canvas> | null>(null)
onMounted(() => {
  if(refToCanvas.value){
    console.log(refToCanvas.value.canvas)
  }
})
</script>
<template>
  <Canvas  ref="refToCanvas"/>
</template>