export default defineNuxtPlugin(() => {
  if (process.client) {
    // Configure Monaco Editor worker
    (window as any).MonacoEnvironment = {
      getWorker(_: any, label: string) {
        const getWorkerModule = (label: string) => {
          return new Worker(
            new URL(
              `monaco-editor/esm/vs/editor/editor.worker?worker&url`,
              import.meta.url
            ),
            {
              name: label,
              type: 'module'
            }
          )
        }

        switch (label) {
          case 'json':
            return getWorkerModule(label)
          case 'css':
          case 'scss':
          case 'less':
            return getWorkerModule(label)
          case 'html':
          case 'handlebars':
          case 'razor':
            return getWorkerModule(label)
          case 'typescript':
          case 'javascript':
            return getWorkerModule(label)
          default:
            return getWorkerModule(label)
        }
      }
    }
  }
})
