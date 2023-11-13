import { ref } from 'vue';
const DEFAULT_COLOR = "#000000"
export const color = ref<string>(DEFAULT_COLOR)

export const setColor = (newColor: string) => {
  color.value = newColor
}