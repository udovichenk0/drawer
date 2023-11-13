export type Shape = {
  startDraw: (event: MouseEvent) => void,
}
export type Coordinate = {
  x: null | number,
  y: null | number
}
export type Options = {
  color: string,
  size?: number
}