<script setup lang="ts">
import Konva from 'konva'
import { onMounted, ref } from 'vue';
import { RangeInput } from './shared/ui/slider';
const canvas = ref<HTMLDivElement>()
const cursor = ref<HTMLDivElement>()
const container = ref<HTMLDivElement>()
const stg = ref<Konva.Stage>()
const lyr = ref<Konva.Layer>()
const line = ref<Konva.Line>()
const isPaint = ref(false)

const activeColor = ref('#fff')
const strokeWidth = ref(10)
const changeColor = (event: any) => {
  if(!event.target && !event.target.value) return
  const color = event.target.value
  activeColor.value = color
}
const cursorMove = (e: MouseEvent) => {
  if(!cursor.value) return
  const { clientX, clientY } = e
  cursor.value.style.transform = `translate(${clientX - strokeWidth.value / 2}px, ${clientY -  strokeWidth.value / 2}px)`
  cursor.value.style.width = `${strokeWidth.value}px`
  cursor.value.style.height = `${strokeWidth.value}px`
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
}
onMounted(() => {
  if(!canvas.value || !stg.value) return
  container.value!.addEventListener('mouseleave', () => cursor.value!.style.display = 'none')
  container.value!.addEventListener('mouseenter', () => cursor.value!.style.display = 'block')
  document.body.addEventListener('mousemove', cursorMove)
  stg.value.on('mousedown', () => {
    const pos = stg.value?.getPointerPosition()
    if(!pos) return
    const { x, y } = pos
    line.value = new Konva.Line({
      points: [x, y, x, y],
      stroke: activeColor.value,
      strokeWidth: strokeWidth.value,
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

<template >
  <div style="height: 100vh; display: flex; flex-direction: column">
    <div class="cursor" ref="cursor"></div>
    <div>
      <input type="color" @change="changeColor">
      <RangeInput :min="1" :max="125" v-model:strokeWidth="strokeWidth"/>
    </div>
    <div @click="console.log($event)" ref="container" id="container" style="width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; cursor: none;">
      <div class="canvas" ref="canvas" id="canvas-container"></div>
    </div>
  </div>
</template>

<style scoped>
.canvas {
  border: 1px solid white;
  max-width: 500px;
}
.cursor {
  border: 1px solid white;
  border-radius: 100%;
  position: absolute;
  pointer-events: none;
}
</style>
