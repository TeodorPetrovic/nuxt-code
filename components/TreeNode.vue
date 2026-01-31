<template>
  <div>
    <div 
      class="tree-node" 
      :style="{ paddingLeft: `${depth * 16 + 8}px` }"
      @click="handleClick"
      @contextmenu.prevent="showContextMenu"
    >
      <span class="icon" v-if="item.isDirectory" @click.stop="toggleExpand">
        {{ expanded ? '📂' : '📁' }}
      </span>
      <span class="icon" v-else>
        {{ getFileIcon(item.name) }}
      </span>
      <span class="name">{{ item.name }}</span>
    </div>
    
    <div v-if="item.isDirectory && expanded && children.length > 0">
      <TreeNode
        v-for="child in children"
        :key="child.path"
        :item="child"
        :depth="depth + 1"
        @select="$emit('select', $event)"
        @delete="$emit('delete', $event)"
        @rename="$emit('rename', $event, arguments[1])"
      />
    </div>

    <div v-if="showMenu" class="context-menu" :style="menuStyle">
      <div class="menu-item" @click="handleRename">Rename</div>
      <div class="menu-item" @click="handleDelete">Delete</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface FileItem {
  name: string
  path: string
  isDirectory: boolean
  size: number
  modified: Date
}

const props = defineProps<{
  item: FileItem
  depth: number
}>()

const emit = defineEmits<{
  (e: 'select', item: FileItem): void
  (e: 'delete', item: FileItem): void
  (e: 'rename', item: FileItem, newName: string): void
}>()

const expanded = ref(false)
const children = ref<FileItem[]>([])
const showMenu = ref(false)
const menuStyle = ref({})

const toggleExpand = async () => {
  if (!props.item.isDirectory) return
  
  expanded.value = !expanded.value
  
  if (expanded.value && children.value.length === 0) {
    try {
      const response = await $fetch<FileItem[]>(`/api/files?path=${props.item.path}`)
      children.value = response
    } catch (error) {
      console.error('Failed to load children:', error)
    }
  }
}

const handleClick = () => {
  if (props.item.isDirectory) {
    toggleExpand()
  } else {
    emit('select', props.item)
  }
}

const showContextMenu = (event: MouseEvent) => {
  showMenu.value = true
  menuStyle.value = {
    position: 'fixed',
    left: `${event.clientX}px`,
    top: `${event.clientY}px`,
  }
  
  const closeMenu = () => {
    showMenu.value = false
    document.removeEventListener('click', closeMenu)
  }
  
  setTimeout(() => {
    document.addEventListener('click', closeMenu)
  }, 100)
}

const handleRename = () => {
  const newName = prompt('Enter new name:', props.item.name)
  if (newName && newName !== props.item.name) {
    emit('rename', props.item, newName)
  }
}

const handleDelete = () => {
  emit('delete', props.item)
}

const getFileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase()
  const iconMap: Record<string, string> = {
    'js': '📜',
    'ts': '📘',
    'vue': '🎨',
    'json': '📋',
    'md': '📝',
    'css': '🎨',
    'html': '🌐',
    'png': '🖼️',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'gif': '🖼️',
    'svg': '🖼️',
  }
  return iconMap[ext || ''] || '📄'
}
</script>

<style scoped>
.tree-node {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.tree-node:hover {
  background: #2a2d2e;
}

.icon {
  margin-right: 6px;
  font-size: 14px;
}

.name {
  font-size: 13px;
}

.context-menu {
  background: #3c3c3c;
  border: 1px solid #454545;
  border-radius: 4px;
  padding: 4px 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.menu-item {
  padding: 6px 16px;
  cursor: pointer;
  font-size: 13px;
}

.menu-item:hover {
  background: #094771;
}
</style>
