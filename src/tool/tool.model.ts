import { brush } from './brush/brush';
import { ref } from 'vue'
import { Tool } from './types'
export const activeTool = ref<Tool>(brush())

export const setActiveTool = (tool: Tool) => {
  activeTool.value = tool
} 