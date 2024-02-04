import { ref } from "vue"

export const createBrushSizeOption = (defaultSize: number) => {
  const size = ref(defaultSize)
  
  const changeSize = (value: number) => {
    if(value < 0) return
    size.value = value
  }

  return {
    size,
    changeSize
  }
}