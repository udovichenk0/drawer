<script lang="ts" setup>
import Konva from 'konva';
import { onMounted, reactive, ref } from 'vue';
import { cursorMove, hidePaintCursor, setCursorDiameter, showPaintCursor } from '../cursor'
import { isNull } from '@/shared/lib/is-null';
const canvas = ref<HTMLDivElement | null>(null)
const stage = ref<Konva.Stage>()
const layer = ref<Konva.Layer>()
type Shape = {
  startDraw: () => void,
}
type Coordinate = {
  x: null | number,
  y: null | number
}
const roundCoordinate = (crd: number) => {
  if(crd >= 0 && crd <= 500) return crd
  else if(crd > 500) return 500 
  return 0
}    
const calculateOutsidePosition = (offsetX: number, offsetY: number) => {
  const width = canvas.value!.getBoundingClientRect().width - 500
  const height = canvas.value!.getBoundingClientRect().height - 500
  const xPosition = offsetX - (width/2)
  const yPosition = offsetY - (height/2)
  return {
    xPosition,
    yPosition
  }
}


const trackOutsidePosition = () => {
  const isOutside = ref(false)
  const setIsOutside = () => isOutside.value = true
  const unsetIsOutside = () => isOutside.value = false
  const startTrack = () => {
    stage.value!.on('mouseleave', setIsOutside)
    stage.value!.on('mouseenter', unsetIsOutside)
  }
  const stopTrack = () => {
    stage.value!.off('mouseleave', setIsOutside)
    stage.value!.off('mouseenter', unsetIsOutside)
  }
  return {
    isOutside,
    startTrack,
    stopTrack,
  }
}
const rect = ({
  color
}: {
    color: string
}): Shape => {
  const endPosition = reactive<Coordinate>({x: null, y: null})
  const startPosition = reactive<Coordinate>({x: null, y: null})
  const mouseTracker = trackOutsidePosition()
  const startDraw = () => {
    const pos = stage.value?.getPointerPosition()
    if(!pos) return
    startPosition.x = pos.x
    startPosition.y = pos.y
    trackEvents()
  }
  const draw = (e:any) => {
    if(mouseTracker.isOutside.value){
      const { xPosition, yPosition } = calculateOutsidePosition(e.offsetX, e.offsetY)
      endPosition.x = roundCoordinate(xPosition)
      endPosition.y = roundCoordinate(yPosition)
    }
    else {
      endPosition.x = e.offsetX
      endPosition.y = e.offsetY
    }
  }
  const stopDraw = () => {
    if(isNull(endPosition.x) || isNull(endPosition.y)) return
    const rectWidth = endPosition.x! - startPosition.x!
    const rectHeight = endPosition.y! - startPosition.y!
    const newRect = new Konva.Rect({
      fill: color,
      x: startPosition.x!,
      y: startPosition.y!,
      width: rectWidth,
      height: rectHeight,
    })
    layer.value?.add(newRect)
    resetPosition()
    untrackEvents()
  }
  const trackEvents = () => {
    if(!canvas.value || !stage.value) return
    canvas.value.addEventListener('mousemove', draw)
    canvas.value.addEventListener('mouseup', stopDraw)
    mouseTracker.startTrack()
  }
  const untrackEvents = () => {
    if(!canvas.value || !stage.value) return
    canvas.value.removeEventListener('mousemove', draw)
    canvas.value.removeEventListener('mouseup', stopDraw)
    mouseTracker.stopTrack()
  }
  const resetPosition = () => {
    endPosition.x = null
    endPosition.y = null
    startPosition.x = null
    startPosition.y = null
  }
  return {
    startDraw
  }
}

const drawFactory  = () => {
  const DEFAULT_COLOR = '#000000'
  const DEFAULT_SIZE = 10
  const activeColor = ref(DEFAULT_COLOR)
  const strokeWidth = ref(DEFAULT_SIZE)

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
  type DrawType = 'paint' | 'rectangle' // Square, Circle, etc..
  const createDrawingFactory = (type: DrawType) => {
    switch(type){
      case 'rectangle': 
        return rect({color: activeColor.value})
      default: 
        throw new Error("Invalid type")
    }
  }
  const choseDraw = createDrawingFactory('rectangle')

  return {
    changeColor,
    changeStrokeWidth,
    startDraw: choseDraw.startDraw,
    strokeWidth,
    activeColor
  }
}
const brush = ({
  size,
  color
}: {
  size: number,
  color: string
}): Shape => {
  const mouseTracker = trackOutsidePosition()
  const outsidePosition = reactive<Coordinate>({x: null, y: null})
  const line = ref<Konva.Line>()
  const isPaint = ref(false)
  const startDraw = () => {
  const pos = stage.value?.getPointerPosition()
    if(!pos) return
    const { x, y } = pos
    line.value = new Konva.Line({
      points: [x, y, x, y],
      stroke: color,
      strokeWidth: size,
      lineCap: 'round',
      lineJoin: 'round',
    });
    isPaint.value = true
    layer.value?.add(line.value)
    trackEvents()
  }
  const draw = (e: any) => {
    const pos = stage.value?.getPointerPosition()
    if(!pos || !line.value) return

    if(mouseTracker.isOutside.value){
      const { xPosition, yPosition } = calculateOutsidePosition(e.offsetX, e.offsetY)
      outsidePosition.x = xPosition
      outsidePosition.y = yPosition
    }

    if(mouseTracker.isOutside.value && isPaint.value) {
      const x = roundCoordinate(pos.x)
      const y = roundCoordinate(pos.y)
      drawLine(x, y)
      isPaint.value = false
    }

    if(!mouseTracker.isOutside.value && !isPaint.value){
      isPaint.value = true
      const x = roundCoordinate(outsidePosition.x!)
      const y = roundCoordinate(outsidePosition.y!)
      line.value = new Konva.Line({
        points: [x,y],
        stroke: color,
        strokeWidth: size,
        lineCap: 'round',
        lineJoin: 'round',
      });
      layer.value?.add(line.value)
      restoreOutsidePosition()
    }
    if(!isPaint.value) return
    drawLine(pos.x, pos.y)
  }
  const stopDraw = () => {
    isPaint.value = false
    restoreOutsidePosition()
    untrackEvents()
  }
  //====
  const drawLine = (x: number, y: number) => {
    if(!line.value) return
    const pointers = line.value.points().concat([x,y])
    line.value.points(pointers)
  }
  const restoreOutsidePosition = () => {
    outsidePosition.x = null
    outsidePosition.y = null
  }
  const trackEvents = () => {
    if(!canvas.value || !stage.value) return
    canvas.value.addEventListener('mousemove', draw)
    canvas.value.addEventListener('mouseup', stopDraw)
    mouseTracker.startTrack()
  }
  const untrackEvents = () => {
    if(!canvas.value || !stage.value) return
    canvas.value.removeEventListener('mousemove', draw)
    canvas.value.removeEventListener('mouseup', stopDraw)
    mouseTracker.stopTrack()
  }
  return {
    startDraw
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
  layer.value = newLayer
  stage.value?.add(newLayer)
}

const {strokeWidth,startDraw} = drawFactory()

const initCanvas = () => {
  if(!canvas.value) return
  initStage({
    width: 500,
    height: 500
  })
  initLayer()
  setCursorDiameter(strokeWidth.value)
}
onMounted(() => {
  initCanvas()
  const a = layer.value?.getContext()
  a!.getCanvas()._canvas.style.backgroundColor = '#ffffff'
  canvas.value!.style.backgroundColor = '#435585'
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
      @mousedown="startDraw"
      @mouseleave="hidePaintCursor" 
      @mouseenter="showPaintCursor" 
      @mousemove="cursorMove"
      class="canvas" ref="canvas" id="canvas-container"></div>
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











