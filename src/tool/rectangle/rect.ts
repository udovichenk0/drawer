import { DEFAULT_PREVIEW_COLOR } from './../config';
import { isCanvas } from './../../shared/lib/is-canvas';
import Konva from "konva"
import { reactive } from "vue"
import { Coordinate, Tool } from "../types"
import { stage } from "@/canvas/viewport"
import { getCoords } from "@/shared/lib/get-coords"
import { color } from "@/palette"

export const rect = (): Tool => {
  const endPosition = reactive<Coordinate>({x:null, y:null})
  const startPosition = reactive<Coordinate>({x:null, y:null})
  let rectangle: Konva.Rect
  const startDraw = (e: MouseEvent) => {
    if(e.button == 0 && isCanvas(e.target)) {
      const { x, y } = getCoords(e, getCanvas()!)
      rectangle = new Konva.Rect({
        stroke: DEFAULT_PREVIEW_COLOR,
        strokeWidth: 1,
        x,
        y,
      })
      getActiveLayer()?.add(rectangle)
      startPosition.x = x
      startPosition.y = y
      trackEvents()
    }
  }
  const draw = (e: MouseEvent) => {
    const { x, y } = getCoords(e, getCanvas()!)
    rectangle.width(x - startPosition.x!)
    rectangle.height(y - startPosition.y!)
    endPosition.x = x
    endPosition.y = y
  }
  const stopDraw = () => {
    rectangle.fill(color.value)
    rectangle.opacity(1)
    rectangle.strokeWidth(0)
    resetPosition()
    untrackEvents()
  }
  const trackEvents = () => {
    const canvas = getContainer()
    if(!canvas || !stage.value) return
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stopDraw)
  }
  const untrackEvents = () => {
    const canvas = getContainer()
    if(!canvas || !stage.value) return
    canvas.removeEventListener('mousemove', draw)
    canvas.removeEventListener('mouseup', stopDraw)
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
  const getCursor = () => {
    return 'crosshair'
  }
  const resetPosition = () => {
    const initialPos = {x:null, y:null}
    Object.assign(endPosition, initialPos)
    Object.assign(startPosition, initialPos)
  }
  return {
    startDraw,
    getCursor,
    meta: {
      name: 'rectangle'
    }
  }
}