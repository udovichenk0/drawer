<script lang="ts" setup>
import { onMounted } from 'vue';
import { paintCursor } from './cursor.model';
onMounted(() => {
  // console.log(paintCursor.value)
})
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
  position: absolute
}
</style>