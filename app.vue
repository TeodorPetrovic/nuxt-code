<template>
  <div class="app-container">
    <div class="title-bar">
      <span class="title">Nuxt Code Editor</span>
      <div class="theme-selector">
        <label>Theme:</label>
        <select v-model="currentTheme">
          <option value="vs-dark">Dark</option>
          <option value="vs">Light</option>
          <option value="hc-black">High Contrast</option>
        </select>
      </div>
    </div>
    
    <SplitPane :initial-left-width="250" :min-left-width="150" :max-left-width="500">
      <template #left>
        <FileExplorer @open-file="handleOpenFile" />
      </template>
      
      <template #right>
        <EditorTabs ref="editorTabs" :theme="currentTheme" />
      </template>
    </SplitPane>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentTheme = ref('vs-dark')
const editorTabs = ref<any>(null)

const handleOpenFile = (path: string) => {
  editorTabs.value?.openFile(path)
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

#__nuxt {
  width: 100%;
  height: 100%;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: #1e1e1e;
  color: #cccccc;
}

.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #3c3c3c;
  border-bottom: 1px solid #007acc;
}

.title {
  font-size: 14px;
  font-weight: 600;
}

.theme-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.theme-selector label {
  color: #cccccc;
}

.theme-selector select {
  background: #252526;
  color: #cccccc;
  border: 1px solid #3e3e42;
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
}

.theme-selector select:hover {
  background: #2a2d2e;
}
</style>
