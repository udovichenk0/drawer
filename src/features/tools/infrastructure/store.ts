//active tool

import { ref } from 'vue'
import { Tool } from '../core/types'
export const activeTool = ref<Tool | null>(null)

export const setActiveTool = (tool: Tool) => {
  console.log(tool)
  activeTool.value = tool
} 