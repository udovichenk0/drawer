import { isCanvas } from './../../shared/lib/is-canvas';
import { brushSize } from './options';
import { drawLine } from "@/shared/lib/draw-line"
import { getCoords } from "@/shared/lib/get-coords"
import { isOutsideOfCanvas } from "@/shared/lib/is-outside-of-canvas"
import { normilizeCoord } from "@/shared/lib/normilize-coord"
import Konva from "konva"
import { reactive } from "vue"
import { Tool, Coordinate } from "../types"
import { isNull } from "@/shared/lib/is-null"
import { stage } from '@/canvas/viewport';
import { color } from '@/palette';

export const brush = (): Tool => {
  const initialPos = {x:null, y:null}
  let outsidePosition = reactive<Coordinate>(initialPos)
  let line:Konva.Line
  let shouldPaint = false

  const startDraw = (e: MouseEvent) => {
    if(e.button == 0 && isCanvas(e.target)){
      const { x, y } = getCoords(e, getCanvas()!)
      const newLine = new Konva.Line({
        points: [x, y, x, y],
        stroke: color.value,
        strokeWidth: brushSize.value,
        lineCap: 'round',
        lineJoin: 'round',
      });
      line = newLine
      shouldPaint = true
      getActiveLayer()?.add(newLine)
      trackEvents()
    }
  }
  const draw = (e: MouseEvent) => {
    if(!line.value) return
    if(isNull(line.value)) return
    const {x,y} = getCoords(e, getCanvas()!)
    if(isOutsideOfCanvas(x, y)) {
      outsidePosition.x = x
      outsidePosition.y = y
    }
    if(isOutsideOfCanvas(x,y) && shouldPaint) {
      drawLine(line, normilizeCoord(x), normilizeCoord(y))
      shouldPaint = false
    }
    if(!isOutsideOfCanvas(x,y) && !shouldPaint){
      shouldPaint = true
      const x = normilizeCoord(outsidePosition.x!)
      const y = normilizeCoord(outsidePosition.y!)
      line = new Konva.Line({
        points: [x,y],
        stroke: color.value,
        strokeWidth: brushSize.value,
        lineCap: 'round',
        lineJoin: 'round',
      });
      getActiveLayer()?.add(line)
      resetPosition()
    }
    if(!shouldPaint) return
    drawLine(line, x, y)
  }
  const getCursor = () => {
    const coof = 1.2
    var size = brushSize.value
    return (
        `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size * coof}px' height='${size * coof}px' viewBox='0 0 120 120' style='stroke: black; stroke-width: 3;' fill='%2300000000' %3E %3Ccircle cx='51' cy='51' r='50'/%3E %3C/svg%3E") ${size/2} ${size/2}, auto`
      )
  }
  const stopDraw = () => {
    shouldPaint = false
    resetPosition()
    untrackEvents()
  }
  
  //====

  const resetPosition = () => {
    Object.assign(outsidePosition, initialPos)
  }
  const trackEvents = () => {
    getContainer()?.addEventListener('mousemove', draw)
    getContainer()?.addEventListener('mouseup', stopDraw)
  }
  const untrackEvents = () => {
    getContainer()?.removeEventListener('mousemove', draw)
    getContainer()?.removeEventListener('mouseup', stopDraw)
  }
  
  const getContainer = () => {
    if(stage.value){
      return stage.value!.container()
    }
  }
  const getCanvas = () => {
    return getActiveLayer()?.getCanvas()._canvas
  }
  const getActiveLayer = () => {
    if(stage.value){
      //temporary harcoded
      return stage.value!.getLayers()[0]
    }
  }
  return {
    startDraw,
    meta: {
      name: "brush"
    },
    getCursor
  }
}