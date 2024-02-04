import Konva from 'konva';
import { ref } from 'vue';
export const canvas = ref<HTMLDivElement | null>(null)
export const stage = ref<Konva.Stage>()
export const layer = ref<Konva.Layer>()

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

export const initCanvas = () => {
  if(!canvas.value) return
  initStage({
    width: 500,
    height: 500
  })
  canvas.value!.style.backgroundColor = '#435585'
  initLayer()
}
export const getContainer = () => stage.value!.container()
export const getCanvas = () => getLayer()?.getCanvas()._canvas
export const getLayer = () => stage.value!.getLayers()[0]