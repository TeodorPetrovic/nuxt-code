import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const requestedPath = query.path as string
  
  if (!requestedPath) {
    throw createError({
      statusCode: 400,
      message: 'Path parameter is required'
    })
  }

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
    const content = await readFile(fullPath, 'utf-8')
    return {
      path: requestedPath,
      content
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.code === 'ENOENT' ? 404 : 500,
      message: error.message
    })
  }
})
