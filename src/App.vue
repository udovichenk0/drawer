<script setup lang="ts">
import Konva from 'konva'
import { onMounted, reactive, ref } from 'vue';
import { RangeInput } from './shared/ui/slider';
import { PaintCursor } from './cursor'
import { cursorMove, hidePaintCursor, setCursorDiameter, showPaintCursor } from './cursor';
const canvas = ref<HTMLDivElement>()
const stg = ref<Konva.Stage>()
const lyr = ref<Konva.Layer>()
const initStage = ({width, height}:{width: number, height: number}) => {
  if(!canvas.value) return
  const stage = new Konva.Stage({
    container: canvas.value,
    width,
    height,
  })
  stg.value = stage
}
const initLayer = () => {
  if(!stg.value) return
  const layer = new Konva.Layer()
  lyr.value = layer
  stg.value?.add(layer)
}
const drawFactory  = () => {
  const DEFAULT_COLOR = '#000000'
  const DEFAULT_SIZE = 10
  const activeColor = ref(DEFAULT_COLOR)
  const strokeWidth = ref(DEFAULT_SIZE)
  const line = ref<Konva.Line>()
  const isPaint = ref(false)
  const outsidePosition = reactive({x: 0, y: 0})
  const isOutside = ref(false)

  const changeColor = (event: Event) => { //take color as prop
    const target = event.target as HTMLInputElement
    if(!event.target && !target.value) return
    const color = target.value
    activeColor.value = color
  }

  const changeStrokeWidth = (width: number) => {
    strokeWidth.value = width
    setCursorDiameter(width)
  }
  const restoreOutsidePosition = () => {
    outsidePosition.x = 0
    outsidePosition.y = 0
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
  const roundCoordinate = (crd: number) => {
    //temporarly make it hardcoded(500 is width of canvas)
    if(crd >= 0 && crd <= 500) return crd
    else if(crd > 500) return 500 
    return 0
  }
  const drawLine = (x: number, y: number) => {
    if(!line.value) return
    const pointers = line.value.points().concat([x,y])
    line.value.points(pointers)
  }
  const draw = (e: any) => {
    const pos = stg.value?.getPointerPosition()
    const calculateOutsidePosition = () => {
      const width = canvas.value!.getBoundingClientRect().width - 500
      const height = canvas.value!.getBoundingClientRect().height - 500
      const xPosition = e.offsetX - (width/2)
      const yPosition = e.offsetY - (height/2)
      return {
        xPosition,
        yPosition
      }
    }
    const { xPosition, yPosition } = calculateOutsidePosition()
    if(!pos || !line.value) return
    stg.value?.on('mouseleave', () => isOutside.value = true)
    stg.value?.on('mouseenter', () => isOutside.value = false)

    if(isOutside.value){
      outsidePosition.x = xPosition
      outsidePosition.y = yPosition
    }

    if(isOutside.value && isPaint.value) {
      const x = roundCoordinate(pos.x)
      const y = roundCoordinate(pos.y)
      drawLine(x, y)
      isPaint.value = false
    }

    if(!isOutside.value && !isPaint.value){
      isPaint.value = true
      const x = roundCoordinate(outsidePosition.x)
      const y = roundCoordinate(outsidePosition.y)
      line.value = new Konva.Line({
        points: [x,y],
        stroke: activeColor.value,
        strokeWidth: strokeWidth.value,
        lineCap: 'round',
        lineJoin: 'round',
      });
      lyr.value?.add(line.value)
      restoreOutsidePosition()
    }
    if(!isPaint.value) return
    drawLine(pos.x, pos.y)
  }

  const stopDraw = () => {
    isPaint.value = false
    restoreOutsidePosition()
    canvas.value?.removeEventListener('mousemove', draw)
  }
  return {
    changeColor,
    changeStrokeWidth,
    startDraw,
    stopDraw,
    strokeWidth,
    activeColor
  }
}

const {
  changeColor,
  strokeWidth,
  changeStrokeWidth,
  startDraw,
  stopDraw,
  activeColor,
} = drawFactory()


onMounted(() => {
  initStage({width: 500, height: 500})
  initLayer()
  setCursorDiameter(strokeWidth.value)
})
onMounted(() => {
  if(!canvas.value || !stg.value) return
  canvas.value!.addEventListener('mouseleave', hidePaintCursor)
  canvas.value!.addEventListener('mouseenter', showPaintCursor)
  document.body.addEventListener('mousemove', cursorMove)
  stg.value.on('mousedown', startDraw)
  canvas.value?.addEventListener('mouseup', stopDraw)
})

</script>

<template >
  <div style="height: 100vh; display: flex; flex-direction: column">
  <PaintCursor/>
    <div>
      <input type="color" :value="activeColor" @input="changeColor">
      <RangeInput :min="1" :max="125" :value="strokeWidth" @change="changeStrokeWidth" />
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
  cursor: none
}
</style>
