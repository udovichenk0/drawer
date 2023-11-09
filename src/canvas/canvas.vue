<script lang="ts" setup>
import Konva from 'konva';
import { onMounted, reactive, ref } from 'vue';
import { cursorMove, hidePaintCursor, setCursorDiameter, showPaintCursor } from '../cursor'
const canvas = ref<HTMLDivElement | null>(null)
const stage = ref<Konva.Stage>()
const layer = ref<Konva.Layer>()


/**
 * TODO I need to be able to paint and draw some figures,
 *  ? how should i implement these features? 
 *    * probably like factories(classes) that implement one interface, it should have methods like: startDraw, stopDraw, draw
 *  ? where should i store colors and strokeWidth?
 *    * in a parent class/factory
 *  ? how should i trigger each factory, ex. i press on square how it should understand what factory to call
 *    * seems like i have to make a factory method
 */

 /**
  * !change implementation
  */
type Shape = {
  startDraw: () => void,
}
const brush = ({
  size,
  color
}: {
  size: number,
  color: string
}): Shape => {

  const line = ref<Konva.Line>()
  const isPaint = ref(false)
  const outsidePosition = reactive({x: 0, y: 0})
  const isOutside = ref(false)
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
    canvas.value!.addEventListener('mousemove', draw)
    canvas.value!.addEventListener('mouseup', stopDraw)
  }
  const draw = (e: any) => {
    const pos = stage.value?.getPointerPosition()
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
    stage.value?.on('mouseleave', () => isOutside.value = true)
    stage.value?.on('mouseenter', () => isOutside.value = false)

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
    canvas.value?.removeEventListener('mousemove', draw)
  }
  //====
  const drawLine = (x: number, y: number) => {
    if(!line.value) return
    const pointers = line.value.points().concat([x,y])
    line.value.points(pointers)
  }
  const roundCoordinate = (crd: number) => {
    if(crd >= 0 && crd <= 500) return crd
    else if(crd > 500) return 500 
    return 0
  }
  const restoreOutsidePosition = () => {
    outsidePosition.x = 0
    outsidePosition.y = 0
  }
  return {
    startDraw
  }
}
/**
 * !reimplement
 */
const rect = ({
  color
}:{
  color: string
}): Shape => {
  const outsidePosition = reactive({x: 0, y: 0})
  const isOutside = ref(false)
  const startPosition = reactive<{x: null | number, y: null | number}>({x: null, y: null})
  const startDraw = () => {
    const pos = stage.value?.getPointerPosition()
    if(!pos) return
    startPosition.x = pos.x
    startPosition.y = pos.y
    canvas.value?.addEventListener('mousemove', draw)
    canvas.value?.addEventListener('mouseup', stopDraw)
  }
  const draw = (e:any) => {
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
    stage.value?.on('mouseleave', () => isOutside.value = true)
    stage.value?.on('mouseenter', () => isOutside.value = false)
    if(isOutside.value){
      outsidePosition.x = roundCoordinate(xPosition)
      outsidePosition.y = roundCoordinate(yPosition)
      // console.log("X: ", outsidePosition.x)
      // console.log("Y: ", outsidePosition.y)
    }
  }
  const roundCoordinate = (crd: number) => {
    if(crd >= 0 && crd <= 500) return crd
    else if(crd > 500) return 500 
    return 0
  }
  const stopDraw = () => {
    const pos = stage.value?.getPointerPosition()
    const x = outsidePosition.x
    const y = outsidePosition.y
    if(!pos) return
    if(x < 0 || x > 0) {
      console.log('here x')
    }
    if(y < 0 || y > 0) {
      console.log('here x')
    }
    const posX = x == 0 || x == 500 ? x - startPosition.x! : pos.x - startPosition.x!
    const posY = y == 0 || y == 500 ? y - startPosition.y! : pos.y - startPosition.y!
    const newRect = new Konva.Rect({
      fill: color,
      x: startPosition.x!,
      y: startPosition.y!,
      width: posX,
      height: posY,
    })
    canvas.value?.removeEventListener('mousemove', draw)
    layer.value?.add(newRect)
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
      case 'paint': 
        return brush({color: activeColor.value, size: strokeWidth.value})
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
const initCanvas = () => {
  if(!canvas.value) return
  initStage({
    width: 500,
    height: 500
  })
  initLayer()
  const {strokeWidth, startDraw} = drawFactory()
  setCursorDiameter(strokeWidth.value)
  stage.value!.on('mousedown', startDraw)
}
onMounted(() => {
  initCanvas()
})
defineExpose({
  initCanvas,
  canvas,
  stage,
  layer
})
</script>

<template>
  <div 
    @mouseleave="hidePaintCursor" 
    @mouseenter="showPaintCursor" 
    @mousemove="cursorMove"
    class="canvas" ref="canvas" id="canvas-container"></div>
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