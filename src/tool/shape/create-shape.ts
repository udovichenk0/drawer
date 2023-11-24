import { reactive } from "vue"
import { Coordinate } from "../types"
import Konva from "konva"

export const createShape = (stage?: Konva.Stage) => {

  const startPosition = reactive<Coordinate>({x:null, y:null})
  const endPosition = reactive<Coordinate>({x:null, y:null})

  const getContainer = () => {
    if(stage){
      return stage.container()
    }
  }
  const getCanvas = () => {
    return getActiveLayer()?.getCanvas()._canvas
  }
  const getActiveLayer = () => {
    if(stage){
      //temporary harcoded
      return stage.getLayers()[0]
    }
  }
  const getCursor = () => {
    return 'crosshair'
  }
  const setPosition = (x: number, y: number) => {
    startPosition.x = x
    startPosition.y = y
  }
  const resetPosition = () => {
    const initialPos = {x:null, y:null}
    Object.assign(endPosition, initialPos)
    Object.assign(startPosition, initialPos)
  }
  return {
    startPosition,
    endPosition,
    getContainer,
    getCanvas,
    getActiveLayer,
    getCursor,
    setPosition,
    resetPosition
  }
}
