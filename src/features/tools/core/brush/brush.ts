import { getCoords } from "@/shared/lib/get-coords"
import { isOutsideOfCanvas } from "@/shared/lib/is-outside-of-canvas"
import Konva from "konva"
import { Tool } from "../types"
import { isNull } from "@/shared/lib/is-null"
import { toValue } from "vue"
import { createCursor } from "./cursor"
import { getCanvas, getContainer, getLayer } from "@/features/canvas/infrastructure"
import { color } from "../domain/change-color"
import { createBrushSizeOption } from "../domain/change-brush-size"
import { drawLine } from "../domain/draw-line"

export const createBrush = (): Tool => {
  let line:Konva.Line
  const brushSizeOption = createBrushSizeOption(40)
  const bSize = toValue(brushSizeOption.size)
  const startDraw = (e: MouseEvent) => {
    const {x,y} = getCoords(e, getCanvas()!)
    if(e.button == 0 && !isOutsideOfCanvas(x,y, bSize, getCanvas()!)){
      const { x, y } = getCoords(e, getCanvas()!)
      line = new Konva.Line({
        points: [x, y, x, y],
        stroke: color.value,
        strokeWidth: bSize,
        lineCap: 'round',
        lineJoin: 'round',
      });
      getLayer()?.add(line)
      trackMouseMove()
    }
  }
  const draw = (e: MouseEvent) => {
    if(e.buttons == 0) {
      untrackMouseMove()
      return
    }
    if(!line.value || isNull(line.value)) return
    const {x,y} = getCoords(e, getCanvas()!)

    if(isOutsideOfCanvas(x, y, bSize, getCanvas()!)) {
      line = new Konva.Line({
        points: [x,y],
        stroke: color.value,
        strokeWidth: bSize,
        lineCap: 'round',
        lineJoin: 'round',
      });
      getLayer()?.add(line)
    }

    drawLine(line, x, y)
  }

  const getCursor = () => createCursor(bSize)

  const trackMouseMove = () => {
    getContainer()?.addEventListener('mousemove', draw)
  }
  const untrackMouseMove = () => {
    getContainer()?.removeEventListener('mousemove', draw)
  }
  
  return {
    startDraw,
    meta: {
      name: "brush"
    },
    getCursor
  }
}