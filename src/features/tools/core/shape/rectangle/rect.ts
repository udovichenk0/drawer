import { isCanvas } from '@/shared/lib/is-canvas';
import Konva from "konva"
import { Tool } from "../../types"
import { getCoords } from "@/shared/lib/get-coords"
import { initShape } from '../init-shape';
import { getCanvas, getContainer, getLayer } from '@/features/canvas/infrastructure';
import { color } from '../../domain/change-color';

export const DEFAULT_PREVIEW_COLOR = '#000000'

export const createRect = (): Tool => {
  const {
    endPosition,
    startPosition,
    resetPosition,
    getCursor
  } = initShape()
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
      getLayer()?.add(rectangle)
      startPosition.x = x
      startPosition.y = y
      trackEvents()
    }
  }
  const draw = (e: MouseEvent) => {
    if(e.buttons == 0) {
      stopDraw()
      return
    }
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
    getContainer().addEventListener('mousemove', draw)
  }
  const untrackEvents = () => {
    getContainer().removeEventListener('mousemove', draw)
  }

  return {
    startDraw,
    getCursor,
    meta: {
      name: 'rectangle'
    }
  }
}