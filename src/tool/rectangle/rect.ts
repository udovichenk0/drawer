import { isCanvas } from './../../shared/lib/is-canvas';
import Konva from "konva"
import { reactive } from "vue"
import { isNull } from '@/shared/lib/is-null'
import { Coordinate, Tool } from "../types"
import { stage } from "@/canvas/viewport"
import { getCoords } from "@/shared/lib/get-coords"
import { normilizeCoord } from "@/shared/lib/normilize-coord"
import { color } from "@/palette"

export const rect = (): Tool => {
  const endPosition = reactive<Coordinate>({x:null, y:null})
  const startPosition = reactive<Coordinate>({x:null, y:null})
  const startDraw = (e: MouseEvent) => {
    if(e.button == 0 && isCanvas(e.target)) {
      const { x, y } = getCoords(e, getCanvas()!)
      startPosition.x = x
      startPosition.y = y
      trackEvents()
    }
  }
  const draw = (e:any) => {
    const { x, y } = getCoords(e, getCanvas()!)
    endPosition.x = x
    endPosition.y = y
  }
  const stopDraw = () => {
    if(isNull(endPosition.x) || isNull(endPosition.y)) return
    const rectWidth = normilizeCoord(endPosition.x!) - startPosition.x!
    const rectHeight = normilizeCoord(endPosition.y!) - startPosition.y!
    const newRect = new Konva.Rect({
      fill: color.value,
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
  const resetPosition = () => {
    const initialPos = {x:null, y:null}
    Object.assign(endPosition, initialPos)
    Object.assign(startPosition, initialPos)
  }
  return {
    startDraw,
    meta: {
      name: 'rectangle'
    }
  }
}