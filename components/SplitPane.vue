<template>
  <div class="split-pane" ref="container">
    <div 
      class="pane left-pane"
      :style="{ width: `${leftWidth}px` }"
    >
      <slot name="left"></slot>
    </div>
    
    <div 
      class="divider"
      @mousedown="startResize"
    ></div>
    
    <div 
      class="pane right-pane"
      :style="{ width: `calc(100% - ${leftWidth + 5}px)` }"
    >
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  initialLeftWidth?: number
  minLeftWidth?: number
  maxLeftWidth?: number
}>()

const container = ref<HTMLElement | null>(null)
const leftWidth = ref(props.initialLeftWidth || 250)
const isResizing = ref(false)

const startResize = (e: MouseEvent) => {
  isResizing.value = true
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  e.preventDefault()
}

const handleResize = (e: MouseEvent) => {
  if (!isResizing.value || !container.value) return
  
  const containerRect = container.value.getBoundingClientRect()
  const newWidth = e.clientX - containerRect.left
  
  const min = props.minLeftWidth || 150
  const max = props.maxLeftWidth || containerRect.width - 200
  
  leftWidth.value = Math.max(min, Math.min(max, newWidth))
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
.split-pane {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.pane {
  overflow: hidden;
}

.left-pane {
  flex-shrink: 0;
}

.right-pane {
  flex: 1;
}

.divider {
  width: 5px;
  background: #3e3e42;
  cursor: col-resize;
  flex-shrink: 0;
  position: relative;
}

.divider:hover {
  background: #007acc;
}
</style>
