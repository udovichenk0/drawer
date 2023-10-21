<script setup lang="ts">
import Konva from 'konva'
import { onMounted, reactive, ref } from 'vue';
import { RangeInput } from './shared/ui/slider';
const canvas = ref<HTMLDivElement>()
const cursor = ref<HTMLDivElement>()
// const container = ref<HTMLDivElement>()
const stg = ref<Konva.Stage>()
const lyr = ref<Konva.Layer>()

const activeColor = ref('#000')
const strokeWidth = ref(10)
// const canvasFactory = () => {
//   const canvas = ref<HTMLDivElement>()
//   const layer = ref<Konva.Layer>()
//   const stage = ref<Konva.Stage>()

//   const setCanvas = (canvasElement: HTMLDivElement) => {
//     if(!canvas.value) return
//     canvas.value = canvasElement
//   }
//   const setStage = (width: number, height: number, canvasElement: HTMLDivElement) => {
//     stage.value = new Konva.Stage({
//       container: canvasElement,
//       width,
//       height,
//     });
//   }
//   const setLayer = () => {
//     layer.value = new Konva.Layer();
//   }
//   const init = (canvasElement: HTMLDivElement) => {
//     if(!canvas.value) return
//     setCanvas(canvasElement)
//     setStage(500, 500, canvas.value)
//     layer.value = new Konva.Layer();
//     stage.value?.add(layer.value)  
//   }
//   const getCanvas = () => canvas.value

//   return {
//     setCanvas,
//     getCanvas,
//     setLayer,
//     init
//   }
// }
const changeStrokeWidth = (width: number) => {
  strokeWidth.value = width
}
const drawFactory  = () => {
  const DEFAULT_COLOR = '#000'
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
  }
  const restoreOutsidePosition = () => {
    outsidePosition.x = 0
    outsidePosition.y = 0
  }
  const startDraw = () => {
    const pos = stg.value?.getPointerPosition()
    // console.log(e.evt)
    if(!pos) return
    const { x, y } = pos
    // console.log(x)

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
  // const createCanvas = canvasFactory()
  // if(canvas.value){
  //   createCanvas.init(canvas.value)
  // }
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

const painter = drawFactory()
onMounted(() => {
  if(!canvas.value || !stg.value) return
  canvas.value!.addEventListener('mouseleave', () => cursor.value!.style.display = 'none')
  canvas.value!.addEventListener('mouseenter', () => cursor.value!.style.display = 'block')
  document.body.addEventListener('mousemove', cursorMove)
  stg.value.on('mousedown', painter.startDraw)
  canvas.value?.addEventListener('mouseup', painter.stopDraw)
})
</script>

<template >
  <div style="height: 100vh; display: flex; flex-direction: column">
    <div class="cursor" ref="cursor"></div>
    <div>
      <input type="color" @change="changeColor">
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

.cursor {
  border: 1px solid black;
  border-radius: 100%;
  position: absolute;
  pointer-events: none;
}
</style>
