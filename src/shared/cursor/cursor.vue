<script lang="ts" setup>
import { paintCursor } from './cursor.model';
</script>
<template>
  <div class="cursor" :ref="(el) => {
    paintCursor = el as HTMLDivElement
  }"></div>
</template>

<style scoped>
.cursor {
  border: 1px solid black;
  border-radius: 100%;
  pointer-events: none;
  position: absolute;
  z-index: 100;
}
</style>