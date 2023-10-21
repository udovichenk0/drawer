<script lang="ts" setup>
defineProps<{
  max: number, 
  min: number, 
  value: number
}>()
const emit = defineEmits<{
  (e: 'change', value: number): void
}>()
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('change', +target.value)
}
</script>
<template>
  {{ value }}
  <input type="range" :min="min" :max="max" value="value" @input="handleInput">
</template>