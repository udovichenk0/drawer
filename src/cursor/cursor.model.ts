import { ref } from "vue"

export const paintCursor = ref<HTMLDivElement>()
export const cursorMove = (e: MouseEvent) => {
  if(!paintCursor.value) return
  const { clientX, clientY } = e
  const cursorDiameter = paintCursor.value?.getBoundingClientRect().width
  paintCursor.value.style.transform = `translate(${clientX - cursorDiameter / 2}px, ${clientY -  cursorDiameter / 2}px)`
}
export const setCursorDiameter = (diameter:number) => {
  paintCursor.value!.style.width = `${diameter}px`
  paintCursor.value!.style.height = `${diameter}px`
}

export const showPaintCursor = () => {
  if(!paintCursor.value) return
  paintCursor.value.style.display = 'block'
}
export const hidePaintCursor = () => {
  if(!paintCursor.value) return
  paintCursor.value.style.display = 'none'
}