import { reactive } from "vue"
import { Coordinate } from "../types"

export const initShape = () => {

  const startPosition = reactive<Coordinate>({x:null, y:null})
  const endPosition = reactive<Coordinate>({x:null, y:null})

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
    getCursor,
    setPosition,
    resetPosition
  }
}