export const getCoords = (e: MouseEvent, element: HTMLElement) => {
  const top = element.getBoundingClientRect().top!
  const left = element.getBoundingClientRect().left!
  const x = e.clientX - left
  const y = e.clientY - top
  return {
    x,
    y
  }
}