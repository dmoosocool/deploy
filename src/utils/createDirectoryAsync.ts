import * as path from 'path'
import * as fs from 'fs'

/**
 * 递归创建目录
 */
export function createDirectoryAsync(dirname: string): boolean | undefined {
  if (fs.existsSync(dirname)) {
    return true
  }

  if (createDirectoryAsync(path.dirname(dirname))) {
    fs.mkdirSync(dirname)
    return true
  }
}
