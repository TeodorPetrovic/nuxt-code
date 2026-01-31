<template>
  <div class="editor-container">
    <div class="tabs-bar">
      <div 
        v-for="tab in tabs" 
        :key="tab.path"
        class="tab"
        :class="{ active: tab.path === activeTab }"
        @click="selectTab(tab.path)"
      >
        <span class="tab-icon">{{ getFileIcon(tab.name) }}</span>
        <span class="tab-name">{{ tab.name }}</span>
        <span class="tab-modified" v-if="tab.modified">●</span>
        <button class="tab-close" @click.stop="closeTab(tab.path)">×</button>
      </div>
    </div>
    
    <div class="editor-content" v-if="activeTab">
      <MonacoEditor
        v-model="currentContent"
        :language="currentLanguage"
        :theme="theme"
        @save="saveCurrentFile"
      />
    </div>
    
    <div class="editor-content empty" v-else>
      <div class="welcome-message">
        <h2>Welcome to Nuxt Code</h2>
        <p>Open a file from the explorer to start editing</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Tab {
  path: string
  name: string
  content: string
  originalContent: string
  modified: boolean
}

const props = defineProps<{
  theme?: string
}>()

const tabs = ref<Tab[]>([])
const activeTab = ref<string | null>(null)

const currentTab = computed(() => {
  return tabs.value.find(t => t.path === activeTab.value)
})

const currentContent = computed({
  get: () => currentTab.value?.content || '',
  set: (value: string) => {
    if (currentTab.value) {
      currentTab.value.content = value
      currentTab.value.modified = value !== currentTab.value.originalContent
    }
  }
})

const currentLanguage = computed(() => {
  if (!currentTab.value) return 'javascript'
  
  const ext = currentTab.value.name.split('.').pop()?.toLowerCase()
  const langMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'vue': 'html',
    'json': 'json',
    'md': 'markdown',
    'css': 'css',
    'html': 'html',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'go': 'go',
    'rs': 'rust',
    'php': 'php',
    'rb': 'ruby',
    'sh': 'shell',
    'yml': 'yaml',
    'yaml': 'yaml',
    'xml': 'xml',
    'sql': 'sql',
  }
  
  return langMap[ext || ''] || 'plaintext'
})

const openFile = async (path: string) => {
  // Check if already open
  const existingTab = tabs.value.find(t => t.path === path)
  if (existingTab) {
    activeTab.value = path
    return
  }
  
  try {
    const response = await $fetch<{ path: string, content: string }>(`/api/files/read?path=${path}`)
    
    tabs.value.push({
      path: response.path,
      name: response.path.split('/').pop() || response.path,
      content: response.content,
      originalContent: response.content,
      modified: false
    })
    
    activeTab.value = response.path
  } catch (error) {
    console.error('Failed to open file:', error)
    alert('Failed to open file')
  }
}

const selectTab = (path: string) => {
  activeTab.value = path
}

const closeTab = (path: string) => {
  const tab = tabs.value.find(t => t.path === path)
  if (tab?.modified) {
    if (!confirm(`${tab.name} has unsaved changes. Close anyway?`)) {
      return
    }
  }
  
  const index = tabs.value.findIndex(t => t.path === path)
  tabs.value.splice(index, 1)
  
  if (activeTab.value === path) {
    activeTab.value = tabs.value[Math.max(0, index - 1)]?.path || null
  }
}

const saveCurrentFile = async () => {
  if (!currentTab.value) return
  
  try {
    await $fetch('/api/files/write', {
      method: 'POST',
      body: {
        path: currentTab.value.path,
        content: currentTab.value.content
      }
    })
    
    currentTab.value.originalContent = currentTab.value.content
    currentTab.value.modified = false
  } catch (error) {
    console.error('Failed to save file:', error)
    alert('Failed to save file')
  }
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
  }
  return iconMap[ext || ''] || '📄'
}

defineExpose({
  openFile
})
</script>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
}

.tabs-bar {
  display: flex;
  background: #252526;
  border-bottom: 1px solid #3e3e42;
  overflow-x: auto;
}

.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #2d2d30;
  border-right: 1px solid #3e3e42;
  cursor: pointer;
  user-select: none;
  min-width: 120px;
  max-width: 200px;
}

.tab:hover {
  background: #1e1e1e;
}

.tab.active {
  background: #1e1e1e;
  border-bottom: 1px solid #007acc;
}

.tab-icon {
  font-size: 14px;
}

.tab-name {
  flex: 1;
  font-size: 13px;
  color: #cccccc;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tab-modified {
  color: #4ec9b0;
  font-size: 16px;
  line-height: 1;
}

.tab-close {
  background: transparent;
  border: none;
  color: #888;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
}

.tab-close:hover {
  background: #5a5a5a;
  border-radius: 3px;
  color: #fff;
}

.editor-content {
  flex: 1;
  overflow: hidden;
}

.editor-content.empty {
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-message {
  text-align: center;
  color: #888;
}

.welcome-message h2 {
  font-size: 24px;
  margin-bottom: 12px;
  color: #cccccc;
}

.welcome-message p {
  font-size: 14px;
}
</style>
