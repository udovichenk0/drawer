import Konva from 'konva';
import { ref } from 'vue';
export const canvas = ref<HTMLDivElement | null>(null)
export const stage = ref<Konva.Stage>()
export const layer = ref<Konva.Layer>()