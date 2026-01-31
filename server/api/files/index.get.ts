import { readdir, stat } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const requestedPath = (query.path as string) || '.'
  
  // Security: Restrict to workspace directory
  const workspacePath = process.cwd()
  const fullPath = join(workspacePath, requestedPath)
  
  // Prevent directory traversal
  if (!fullPath.startsWith(workspacePath)) {
    throw createError({
      statusCode: 403,
      message: 'Access denied'
    })
  }

  try {
    const files = await readdir(fullPath, { withFileTypes: true })
    
    const fileList = await Promise.all(
      files.map(async (file) => {
        const filePath = join(fullPath, file.name)
        const stats = await stat(filePath)
        
        return {
          name: file.name,
          path: join(requestedPath, file.name).replace(/\\/g, '/'),
          isDirectory: file.isDirectory(),
          size: stats.size,
          modified: stats.mtime
        }
      })
    )
    
    // Sort: directories first, then files, both alphabetically
    return fileList.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1
      if (!a.isDirectory && b.isDirectory) return 1
      return a.name.localeCompare(b.name)
    })
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})
