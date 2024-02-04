import Konva from "konva"

export const drawLine = (line: Konva.Line, x: number, y: number) => {
  if(!line.value) return
  const pointers = line.points().concat([x,y])
  line.points(pointers)
}