<script setup lang="ts">
import Konva from 'konva'
import { onMounted, ref } from 'vue';
const canvas = ref<HTMLDivElement>()
const stg = ref<Konva.Stage>()
const lyr = ref<Konva.Layer>()
const line = ref<Konva.Line>()
const isPaint = ref(false)

const activeColor = ref('#fff')
const changeColor = (event: any) => {
  if(!event.target && !event.target.value) return
  const color = event.target.value
  activeColor.value = color
}
onMounted(() => {
  if(!canvas.value) return
  const stage = new Konva.Stage({
    container: canvas.value,
    width: 500,
    height: 500,
  });
  stg.value = stage
  const layer = new Konva.Layer();
  lyr.value = layer
  stg.value.add(layer);
})
const startDraw = () => {
  if(!stg.value) return
  stg.value.on('mousemove', () => {
    const selectedLine = line.value
    const pos = stg.value?.getPointerPosition()
    if(!pos || !isPaint.value || !selectedLine) return
    const {x,y} = pos
    const pointers = selectedLine.points().concat([x,y])
    selectedLine.points(pointers)
  })
  stg.value.on('mouseleave', stopDraw)
}
const stopDraw = () => {
  if(!stg.value) return
  isPaint.value = false
  stg.value.off('mousemove')
  stg.value.off('mouseleave')
}
onMounted(() => {
  if(!canvas.value || !stg.value) return
  stg.value.on('mousedown', () => {
    const pos = stg.value?.getPointerPosition()
    if(!pos) return
    const { x, y } = pos
    line.value = new Konva.Line({
      points: [x, y, x, y],
      stroke: activeColor.value,
      strokeWidth: 15,
      lineCap: 'round',
      lineJoin: 'round',
    });
    isPaint.value = true
    lyr.value?.add(line.value)
    startDraw()
  })
  stg.value?.on('mouseup', stopDraw)
})

</script>

<template>
  <div>
    <div>
      <h1>Colors:</h1>
      <input type="color" @change="changeColor">
    </div>
    <div style="border: 1px solid white" ref="canvas" id="canvas-container"></div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
