<script setup lang="ts">
import Konva from 'konva'
import { onMounted, reactive, ref } from 'vue';
import { RangeInput } from './shared/ui/slider';
const canvas = ref<HTMLDivElement>()
const cursor = ref<HTMLDivElement>()
// const container = ref<HTMLDivElement>()
const stg = ref<Konva.Stage>()
const lyr = ref<Konva.Layer>()
const line = ref<Konva.Line>()

const isPaint = ref(false)

const activeColor = ref('#000')
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
const outsidePosition = reactive({x: 0, y: 0})
const isOutside = ref(false)
const draw = (e: MouseEvent) => {
  const pos = stg.value?.getPointerPosition()
  const width = canvas.value!.getBoundingClientRect().width - 500
  const height = canvas.value!.getBoundingClientRect().height - 500
  const calculatedXPosition = e.offsetX - (width/2)
  const calculatedYPosition = e.offsetY - (height/2)
  if(!pos || !line.value) return
  stg.value?.on('mouseleave', () => isOutside.value = true)
  stg.value?.on('mouseenter', () => isOutside.value = false)

  if(isOutside.value){
    outsidePosition.x = calculatedXPosition
    outsidePosition.y = calculatedYPosition
  }

  if(isOutside.value && isPaint.value) {
    const f = pos.x > 500 ? 500 : pos.x < 0 ? 0 : pos.x
    const t = pos.y > 500 ? 500 : pos.y < 0 ? 0 : pos.y
    const pointers = line.value.points().concat([f,t]) // func drawLine
    line.value.points(pointers)
    isPaint.value = false
  }

  if(!isOutside.value && outsidePosition.x && !isPaint.value){
    isPaint.value = true
    line.value = new Konva.Line({ // func startLine
      points: [outsidePosition.x, outsidePosition.y],
      stroke: activeColor.value,
      strokeWidth: strokeWidth.value,
      lineCap: 'round',
      lineJoin: 'round',
    });
    lyr.value?.add(line.value)
    outsidePosition.x = 0
    outsidePosition.y = 0
  }
  if(!isPaint.value) return
  const pointers = line.value.points().concat([pos.x,pos.y])
  line.value.points(pointers)
}
const startDraw = () => {
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
  canvas.value!.addEventListener('mousemove', draw)
}
const stopDraw = () => {
  isPaint.value = false
  outsidePosition.x = 0
  outsidePosition.y = 0
  canvas.value?.removeEventListener('mousemove', draw)
}
onMounted(() => {
  if(!canvas.value || !stg.value) return
  canvas.value!.addEventListener('mouseleave', () => cursor.value!.style.display = 'none')
  canvas.value!.addEventListener('mouseenter', () => cursor.value!.style.display = 'block')
  document.body.addEventListener('mousemove', cursorMove)
  stg.value.on('mousedown', startDraw)
  canvas.value?.addEventListener('mouseup', stopDraw)
})
</script>

<template >
  <div style="height: 100vh; display: flex; flex-direction: column">
    <div class="cursor" ref="cursor"></div>
    <div>
      <input type="color" @change="changeColor">
      <RangeInput :min="1" :max="125" v-model:strokeWidth="strokeWidth"/>
    </div>
    <!-- <div @click="console.log($event)" ref="container" id="container" style="width: 100%; height: 100vh; cursor: none;"> -->
      <div class="canvas" ref="canvas" id="canvas-container"></div>
    <!-- </div> -->
  </div>
</template>

<style scoped>
.canvas {
  background: white;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cursor {
  border: 1px solid black;
  border-radius: 100%;
  position: absolute;
  pointer-events: none;
}
</style>
