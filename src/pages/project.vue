<script setup lang="ts">
import { ref } from 'vue';
import Canvas from '@/features/canvas/ui/canvas.vue'
const refToCanvas = ref<InstanceType<typeof Canvas> | null>(null)
import { activeTool } from '@/features/tools/infrastructure';
</script>
<template>
  <Canvas :on-draw="activeTool?.startDraw" ref="refToCanvas"/>
</template>