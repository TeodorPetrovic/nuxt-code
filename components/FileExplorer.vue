<template>
  <div class="file-explorer">
    <div class="explorer-header">
      <h3>EXPLORER</h3>
      <div class="actions">
        <button @click="createFile" title="New File">📄</button>
        <button @click="createFolder" title="New Folder">📁</button>
        <button @click="refresh" title="Refresh">🔄</button>
      </div>
    </div>
    <div class="file-tree">
      <TreeNode
        v-for="item in files"
        :key="item.path"
        :item="item"
        :depth="0"
        @select="handleSelect"
        @delete="handleDelete"
        @rename="handleRename"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface FileItem {
  name: string
  path: string
  isDirectory: boolean
  size: number
  modified: Date
}

const emit = defineEmits<{
  (e: 'open-file', path: string): void
}>()

const files = ref<FileItem[]>([])

const loadFiles = async (path = '.') => {
  try {
    const response = await $fetch<FileItem[]>(`/api/files?path=${path}`)
    files.value = response
  } catch (error) {
    console.error('Failed to load files:', error)
  }
}

const refresh = () => {
  loadFiles()
}

const handleSelect = (item: FileItem) => {
  if (!item.isDirectory) {
    emit('open-file', item.path)
  }
}

const handleDelete = async (item: FileItem) => {
  if (!confirm(`Are you sure you want to delete ${item.name}?`)) return
  
  try {
    await $fetch(`/api/files/delete?path=${item.path}`, { method: 'DELETE' })
    refresh()
  } catch (error) {
    console.error('Failed to delete:', error)
    alert('Failed to delete file')
  }
}

const handleRename = async (item: FileItem, newName: string) => {
  const oldPath = item.path
  const newPath = oldPath.substring(0, oldPath.lastIndexOf('/') + 1) + newName
  
  try {
    await $fetch('/api/files/rename', {
      method: 'PATCH',
      body: { oldPath, newPath }
    })
    refresh()
  } catch (error) {
    console.error('Failed to rename:', error)
    alert('Failed to rename file')
  }
}

const createFile = async () => {
  const name = prompt('Enter file name:')
  if (!name) return
  
  try {
    await $fetch('/api/files/create', {
      method: 'POST',
      body: { path: name, isDirectory: false }
    })
    refresh()
  } catch (error) {
    console.error('Failed to create file:', error)
    alert('Failed to create file')
  }
}

const createFolder = async () => {
  const name = prompt('Enter folder name:')
  if (!name) return
  
  try {
    await $fetch('/api/files/create', {
      method: 'POST',
      body: { path: name, isDirectory: true }
    })
    refresh()
  } catch (error) {
    console.error('Failed to create folder:', error)
    alert('Failed to create folder')
  }
}

onMounted(() => {
  loadFiles()
})
</script>

<style scoped>
.file-explorer {
  background: #252526;
  color: #cccccc;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.explorer-header {
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #3e3e42;
}

.explorer-header h3 {
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.actions {
  display: flex;
  gap: 4px;
}

.actions button {
  background: transparent;
  border: none;
  color: #cccccc;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.actions button:hover {
  background: #2a2d2e;
}

.file-tree {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}
</style>
