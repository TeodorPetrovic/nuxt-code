export default defineNuxtPlugin(() => {
  if (process.client) {
    // Configure Monaco Editor worker
    (window as any).MonacoEnvironment = {
      getWorker(_: any, label: string) {
        const getWorkerModule = (moduleUrl: string, label: string) => {
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
            return getWorkerModule(
              'monaco-editor/esm/vs/language/json/json.worker?worker',
              label
            )
          case 'css':
          case 'scss':
          case 'less':
            return getWorkerModule(
              'monaco-editor/esm/vs/language/css/css.worker?worker',
              label
            )
          case 'html':
          case 'handlebars':
          case 'razor':
            return getWorkerModule(
              'monaco-editor/esm/vs/language/html/html.worker?worker',
              label
            )
          case 'typescript':
          case 'javascript':
            return getWorkerModule(
              'monaco-editor/esm/vs/language/typescript/ts.worker?worker',
              label
            )
          default:
            return getWorkerModule(
              'monaco-editor/esm/vs/editor/editor.worker?worker',
              label
            )
        }
      }
    }
  }
})
