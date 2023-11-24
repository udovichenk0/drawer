<script setup lang="ts">
import { PaintCursor } from '@/shared/cursor'
import { Project } from './pages'
import { color, setColor } from './palette/palette.model';
import { activeTool, setActiveTool } from './tool/tool.model';
import { brush } from './tool/brush/brush';
import { rect } from './tool/rectangle/rect';
import { onMounted, ref } from 'vue';

const cursor = ref<InstanceType<typeof PaintCursor> | null>(null)
onMounted(() => {
  cursor.value?.setCursorDiameter(10)
})

</script>

<template >
  <div style="display: flex; flex-direction: column; height: 100vh;">
    <div >
      <input type="color" :value="color" @input="(e) => setColor((e.target as HTMLInputElement).value)">
      <!-- <RangeInput :min="1" :max="125" :value="strokeWidth" @change="changeStrokeWidth" /> -->
      <button @click="() => {
        setActiveTool(brush())
      }">Pick brush</button>
      <button @click="() => {
        setActiveTool(rect())
      }">Pick rect</button>
    </div> 
    <Project 
      :style="{
        cursor: activeTool?.getCursor()
      }"
      @mouseleave="cursor?.hidePaintCursor" 
      @mouseenter="cursor?.showPaintCursor" 
      @mousemove="cursor?.cursorMove"
    />
  </div>
</template>
<style scoped>
  .myCursor {
    cursor: crosshair
  }
</style>