import { brush } from './brush/paint';
import { ref } from 'vue'
import { Tool } from './types'
export const activeTool = ref<Tool>(brush())

export const setActiveTool = (tool: Tool) => {
  activeTool.value = tool
} 