<script lang="ts" setup>
import Konva from 'konva';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { cursorMove, hidePaintCursor, setCursorDiameter, showPaintCursor } from '../cursor'
import { isNull } from '@/shared/lib/is-null';
import { getCoords } from '@/shared/lib/get-coords'
import { normilizeCoord } from '@/shared/lib/normilize-coord'
import { isOutsideOfCanvas } from '@/shared/lib/is-outside-of-canvas'
import { drawLine } from '@/shared/lib/draw-line'
const canvas = ref<HTMLDivElement | null>(null)
const stage = ref<Konva.Stage>()
const layer = ref<Konva.Layer>()
type Shape = {
  startDraw: (event: MouseEvent) => void,
}
type Coordinate = {
  x: null | number,
  y: null | number
}
type Options = {
  color: string,
  size?: number
}
  



const rect = ({
  options,
}: {
  options: Options,
}): Shape => {
  const endPosition = reactive<Coordinate>({x: null, y: null})
  const startPosition = reactive<Coordinate>({x: null, y: null})
  const { color } = options
  const startDraw = (e: MouseEvent) => {
    if(e.button == 0) {
      const { x, y } = getCoords(e, canvas.value!)
      startPosition.x = x
      startPosition.y = y
      trackEvents()
    }
  }
  const draw = (e:any) => {
    const { x, y } = getCoords(e, canvas.value!)
    endPosition.x = x
    endPosition.y = y
  }
  const stopDraw = () => {
    if(isNull(endPosition.x) || isNull(endPosition.y)) return
    const rectWidth = normilizeCoord(endPosition.x!) - startPosition.x!
    const rectHeight = normilizeCoord(endPosition.y!) - startPosition.y!
    const newRect = new Konva.Rect({
      fill: color,
      x: startPosition.x!,
      y: startPosition.y!,
      width: rectWidth,
      height: rectHeight,
    })
    getActiveLayer()?.add(newRect)
    resetPosition()
    untrackEvents()
  }
  const trackEvents = () => {
    const canvas = getCanvas()
    if(!canvas || !stage.value) return
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stopDraw)
  }
  const untrackEvents = () => {
    const canvas = getCanvas()
    if(!canvas || !stage.value) return
    canvas.removeEventListener('mousemove', draw)
    canvas.removeEventListener('mouseup', stopDraw)
  }
  const getCanvas = () => {
    if(stage.value){
      return stage.value!.container()
    }
  }
  const getActiveLayer = () => {
    if(stage.value){
      //temporary harcoded
      return stage.value!.getLayers()[0]
    }
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
const brush = ({
  size,
  color
}: {
  size: number,
  color: string
}): Shape => {
  const outsidePosition = reactive<Coordinate>({x: null, y: null})
  const line = ref<Konva.Line>()
  const shouldPaint = ref(false)
  const startDraw = (e: MouseEvent) => {
    if(e.button == 0){
      const { x, y } = getCoords(e, canvas.value!)
      const newLine = new Konva.Line({
        points: [x, y, x, y],
        stroke: color,
        strokeWidth: size,
        lineCap: 'round',
        lineJoin: 'round',
      });
      line.value = newLine
      shouldPaint.value = true
      getActiveLayer()?.add(newLine)
      trackEvents()
    }
  }
  const draw = (e: any) => {
    if(!line.value) return
    if(isNull(line.value)) return
    const {x,y} = getCoords(e, canvas.value!)
    if(isOutsideOfCanvas(x, y)) {
      outsidePosition.x = x
      outsidePosition.y = y
    }
    if(isOutsideOfCanvas(x,y) && shouldPaint.value) {
      drawLine(line.value as Konva.Line, normilizeCoord(x), normilizeCoord(y))
      shouldPaint.value = false
    }
    if(!isOutsideOfCanvas(x,y) && !shouldPaint.value){
      shouldPaint.value = true
      const x = normilizeCoord(outsidePosition.x!)
      const y = normilizeCoord(outsidePosition.y!)
      line.value = new Konva.Line({
        points: [x,y],
        stroke: color,
        strokeWidth: size,
        lineCap: 'round',
        lineJoin: 'round',
      });
      getActiveLayer()?.add(line.value)
      restoreOutsidePosition()
    }
    if(!shouldPaint.value) return
    drawLine(line.value, x, y)
  }
  const stopDraw = () => {
    shouldPaint.value = false
    restoreOutsidePosition()
    untrackEvents()
  }

  //====

  const restoreOutsidePosition = () => {
    outsidePosition.x = null
    outsidePosition.y = null
  }
  const trackEvents = () => {
    getCanvas()?.addEventListener('mousemove', draw)
    getCanvas()?.addEventListener('mouseup', stopDraw)
  }
  const untrackEvents = () => {
    getCanvas()?.removeEventListener('mousemove', draw)
    getCanvas()?.removeEventListener('mouseup', stopDraw)
  }
  
  const getCanvas = () => {
    if(stage.value){
      return stage.value!.container()
    }
  }
  const getActiveLayer = () => {
    if(stage.value){
      //temporary harcoded
      return stage.value!.getLayers()[0]
    }
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
        return rect({
          options: {color: activeColor.value}
        })
      case 'paint': 
        return brush({size: strokeWidth.value, color: activeColor.value})
      default: 
        throw new Error("Invalid type")
    }
  }
  const choseDraw = createDrawingFactory('paint')

  return {
    changeColor,
    changeStrokeWidth,
    startDraw: choseDraw.startDraw,
    strokeWidth,
    activeColor
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

const {strokeWidth,startDraw} = drawFactory()

const initCanvas = () => {
  if(!canvas.value) return
  initStage({
    width: 500,
    height: 500
  })
  canvas.value!.style.backgroundColor = '#435585'
  canvas.value?.addEventListener('mousedown', startDraw)
  initLayer()
  setCursorDiameter(strokeWidth.value)
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

<!-- const brush = ({
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
  const startDraw = (e: MouseEvent) => {
  const pos = stage.value?.getPointerPosition()
    if(!pos || e.button !== 0) return
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
} -->