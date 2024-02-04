<script lang="ts" setup>
  import { createBrush } from '../core/brush/brush'
  import { createRect } from '../core/shape/rectangle/rect';
  import { setActiveTool } from '../infrastructure/store'
  const brush = createBrush()
  const rect = createRect()
  import { color, setColor } from '../core/domain/change-color'
</script>

<template>
  <div>
    <input type="color" :value="color" @input="(e) => setColor((e.target as HTMLInputElement).value)">
    <button @click="setActiveTool(brush)">
      brush
    </button>
    <button @click="setActiveTool(rect)">
      brush
    </button>
  </div>
</template>

<style scoped>
  
</style>