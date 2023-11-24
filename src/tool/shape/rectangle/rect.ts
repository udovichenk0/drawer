import { DEFAULT_PREVIEW_COLOR } from '../../config';
import { isCanvas } from '@/shared/lib/is-canvas';
import Konva from "konva"
import { Tool } from "../../types"
import { getCoords } from "@/shared/lib/get-coords"
import { color } from "@/palette"
import { createShape } from '../create-shape';


//pass canvas probably and then create factory commonFUnction with it
export const rect = (stage?: Konva.Stage): Tool => {
  const {
    getCanvas,
    endPosition,
    startPosition,
    getActiveLayer,
    resetPosition,
    getContainer,
    getCursor
  } = createShape(stage)
  let rectangle: Konva.Rect
  const startDraw = (e: MouseEvent) => {
    
    if(e.button == 0 && isCanvas(e.target) && !!stage) {
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
    if(!canvas || !stage) return
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stopDraw)
  }
  const untrackEvents = () => {
    const canvas = getContainer()
    if(!canvas || !stage) return
    canvas.removeEventListener('mousemove', draw)
    canvas.removeEventListener('mouseup', stopDraw)
  }

  return {
    startDraw,
    getCursor,
    meta: {
      name: 'rectangle'
    }
  }
}