<script lang="ts" setup>
import Konva from 'konva';
import { onMounted, onUnmounted } from 'vue';
import { cursorMove, hidePaintCursor, setCursorDiameter, showPaintCursor } from '../cursor'
import { canvas, stage, layer } from './viewport'
import { brush } from './brush/paint';
import { rect } from './shapes/rectangle/rect';
import { color } from '@/palette/palette.model';
import { brushSize } from './brush/options';

const drawFactory  = () => {
  type DrawType = 'paint' | 'rectangle' // Square, Circle, etc..
  const createDrawingFactory = (type: DrawType) => {
    switch(type){
      case 'rectangle': 
        return rect({options: {color: color.value}})
      case 'paint': 
        return brush({options: {color: color.value, size: brushSize.value}})
      default: 
        throw new Error("Invalid type")
    }
  }
  const choseDraw = createDrawingFactory('paint')

  return {
    startDraw: choseDraw.startDraw,
  }
}


const initStage = ({width, height}:{width: number, height: number}) => {
  if(!canvas.value) return
  stage.value = new Konva.Stage({
    container: canvas.value,
    width,
    height,
  })
}
const initLayer = () => {
  if(!stage.value) return
  const newLayer = new Konva.Layer()
  newLayer.getContext().getCanvas()._canvas.style.backgroundColor = '#ffffff'
  layer.value = newLayer
  stage.value?.add(newLayer)
}

const {startDraw} = drawFactory()

const initCanvas = () => {
  if(!canvas.value) return
  initStage({
    width: 500,
    height: 500
  })
  canvas.value!.style.backgroundColor = '#435585'
  canvas.value?.addEventListener('mousedown', startDraw)
  initLayer()
  setCursorDiameter(10)
}
onMounted(() => {
  initCanvas()
})

onUnmounted(() => {
  canvas.value?.removeEventListener('mousedown', startDraw)
})
defineExpose({
  initCanvas,
  canvas,
  stage,
  layer
})
</script>

<template>
  <div>
    <div 
      @mouseleave="hidePaintCursor" 
      @mouseenter="showPaintCursor" 
      @mousemove="cursorMove"
      class="canvas" 
      :ref="(el) => canvas = el as HTMLDivElement" 
      id="canvas-container"></div>
  </div>
</template>
<style scoped>
.canvas {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: none
}
</style>