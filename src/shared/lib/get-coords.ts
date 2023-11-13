export const getCoords = (e: MouseEvent, element: HTMLElement) => {
  const x = e.clientX - (element.getBoundingClientRect().width - 500) / 2
  const y = e.clientY - (element.getBoundingClientRect().height - 500) / 2
  return {
    x,
    y
  }
}