<script lang="ts" setup>
defineProps<{
  max: number, 
  min: number, 
  strokeWidth: number
}>()
const emit = defineEmits<{
  (e: 'update:strokeWidth', value: number): void
}>()
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:strokeWidth', +target.value)
}
</script>
<template>
  {{ strokeWidth }}
  <input type="range" :min="min" :max="max" :value="strokeWidth" @input="handleInput">
</template>