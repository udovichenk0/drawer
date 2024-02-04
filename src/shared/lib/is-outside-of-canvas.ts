export const isOutsideOfCanvas = (x: number, y: number, s: number, canvas: HTMLCanvasElement) => {
  const w = canvas.getBoundingClientRect().width
  const h = canvas.getBoundingClientRect().height
  const size = s / 2
  const xMin = -size
  const xMax = w + size
  const yMin = -size
  const yMax = h + s
  return x < xMin || x > xMax || y < yMin || y > yMax
}