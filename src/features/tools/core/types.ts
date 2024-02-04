type ToolType = 'rectangle' | 'brush'
export type Tool = {
  startDraw: (event: MouseEvent) => void,
  getCursor: () => string,
  meta: {
    name: ToolType
  }
}
export type Coordinate = {
  x: null | number,
  y: null | number
}
export type Options = {
  color: string,
  size?: number
}