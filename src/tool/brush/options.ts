import { ref } from 'vue';
const DEFAULT_SIZE = 40
export const brushSize = ref(DEFAULT_SIZE)
export const changeBrushSize = (width: number) => {
  brushSize.value = width
}