import * as path from 'path'
import * as os from 'os'

/**
 * 替换用户主目录
 *
 * @param {String} pendingPath 待处理的路径
 * @example replaceHomeDir('~/.ssh/id_rsa') => /Users/<username>/.ssh/id_rsa
 * @example replaceHomeDir('asd/asd/~/ss') => asd/asd/~/ss
 * @example replaceHomeDir('~/asd/asd/~/ss') => ~/asd/asd/~/ss
 *
 * @return {String} 处理完成的路径
 */
export function replaceHomeDir(pendingPath: string): string {
  // 如果待处理的路径包含两次 '~' 则直接返回.
  if (pendingPath.split('~').length > 2) {
    return pendingPath
  }

  // 如果待处理路径是 '~' 开始的则将 '~' 替换成 os.homedir() 的值.
  if (pendingPath.startsWith('~')) {
    const homeDir = os.homedir()
    return path.resolve(pendingPath.replace(/~/g, homeDir))
  }

  // 否则默认情况直接返回待处理路径.
  return pendingPath
}
