<script setup lang="ts">
import { PaintCursor } from './cursor'
import { Project } from './pages'
</script>

<template >
  <div style="height: 100vh; display: flex; flex-direction: column">
    <!-- <div>
      <input type="color" :value="activeColor" @input="changeColor">
      <RangeInput :min="1" :max="125" :value="strokeWidth" @change="changeStrokeWidth" />
    </div>  -->
    <PaintCursor/>
    <Project/>
  </div>
</template>