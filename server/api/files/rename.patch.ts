import { rename } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { oldPath, newPath } = body
  
  if (!oldPath || !newPath) {
    throw createError({
      statusCode: 400,
      message: 'Both oldPath and newPath are required'
    })
  }

  // Security: Restrict to workspace directory
  const workspacePath = process.cwd()
  const fullOldPath = join(workspacePath, oldPath)
  const fullNewPath = join(workspacePath, newPath)
  
  // Prevent directory traversal
  if (!fullOldPath.startsWith(workspacePath) || !fullNewPath.startsWith(workspacePath)) {
    throw createError({
      statusCode: 403,
      message: 'Access denied'
    })
  }

  try {
    await rename(fullOldPath, fullNewPath)
    
    return {
      success: true,
      oldPath,
      newPath
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.code === 'ENOENT' ? 404 : 500,
      message: error.message
    })
  }
})
