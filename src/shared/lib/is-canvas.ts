export const isCanvas = (element: unknown): element is HTMLCanvasElement => {
  return element instanceof HTMLCanvasElement
}