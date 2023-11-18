<script setup lang="ts">
import { PaintCursor } from '@/shared/cursor'
import { Project } from './pages'
import { color, setColor } from './palette/palette.model';
import { setActiveTool } from './tool/tool.model';
import { brush } from './tool/brush/paint';
import { rect } from './tool/rectangle/rect';
</script>

<template >
  <div style="display: flex; flex-direction: column">
    <div>
      <input type="color" :value="color" @input="(e) => setColor((e.target as HTMLInputElement).value)">
      <!-- <RangeInput :min="1" :max="125" :value="strokeWidth" @change="changeStrokeWidth" /> -->
      <button @click="() => setActiveTool(brush())">Pick brush</button>
      <button @click="() => setActiveTool(rect())">Pick rect</button>
    </div> 
    <PaintCursor/>
    <Project/>
  </div>
</template>