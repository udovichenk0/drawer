export const isOutsideOfCanvas = (x: number, y: number) => {
  return x < 0 || x > 500 || y < 0 || y > 500
}