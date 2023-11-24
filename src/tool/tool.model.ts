import { ref } from 'vue'
import { Tool } from './types'
export const activeTool = ref<Tool | null>(null)

export const setActiveTool = (tool: Tool) => {
  activeTool.value = tool
} 