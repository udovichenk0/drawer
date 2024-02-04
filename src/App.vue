<script setup lang="ts">
import { Project } from './pages'
// import { activeTool } from './tool/tool.model';
// import { brush } from './tool/brush/brush';
// import { rect } from './tool/shape/rectangle/rect';
// import { stage } from './canvas/viewport';
import Panel from './features/tools/ui/panel.vue'
import { activeTool } from '@/features/tools/infrastructure'
</script>

<template >
  <div style="display: flex; flex-direction: column; height: 100vh;">
    <Panel/>
    <!-- <div >
      <input type="color" :value="color" @input="(e) => setColor((e.target as HTMLInputElement).value)">
      <button @click="() => {
        setActiveTool(brush())
      }">Pick brush</button>
      <button @click="() => {
        setActiveTool(rect(stage))
      }">Pick rect</button>
    </div>  -->
    <Project 
      :style="{
        cursor: activeTool?.getCursor()
      }"
    />
  </div>
</template>
<style scoped>
  .myCursor {
    cursor: crosshair
  }
</style>