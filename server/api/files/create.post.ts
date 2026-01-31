import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { path: requestedPath, isDirectory } = body
  
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
    if (isDirectory) {
      await mkdir(fullPath, { recursive: true })
    } else {
      // Ensure parent directory exists
      await mkdir(dirname(fullPath), { recursive: true })
      await writeFile(fullPath, '', 'utf-8')
    }
    
    return {
      success: true,
      path: requestedPath
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})
