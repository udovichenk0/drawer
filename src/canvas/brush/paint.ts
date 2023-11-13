import { brushSize } from './options';
import { drawLine } from "@/shared/lib/draw-line"
import { getCoords } from "@/shared/lib/get-coords"
import { isOutsideOfCanvas } from "@/shared/lib/is-outside-of-canvas"
import { normilizeCoord } from "@/shared/lib/normilize-coord"
import Konva from "konva"
import { reactive, ref } from "vue"
import { Shape, Coordinate } from "../types"
import { stage } from "../viewport"
import { isNull } from "@/shared/lib/is-null"

export const brush = ({
  options
}: {
  options: {
    color: string,
    size: number
  }
}): Shape => {
  const { color, size } = options
  const outsidePosition = reactive<Coordinate>({x: null, y: null})
  const line = ref<Konva.Line>()
  const shouldPaint = ref(false)
  const startDraw = (e: MouseEvent) => {
    if(e.button == 0){
      const { x, y } = getCoords(e, getCanvas()!)
      const newLine = new Konva.Line({
        points: [x, y, x, y],
        stroke: color,
        strokeWidth: brushSize.value,
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
    const {x,y} = getCoords(e, getCanvas()!)
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