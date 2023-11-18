<script setup lang="ts">
import { ref } from 'vue';
import Canvas from '../canvas/canvas.vue'
const refToCanvas = ref<InstanceType<typeof Canvas> | null>(null)
</script>
<template>
  <Canvas  ref="refToCanvas"/>
</template>