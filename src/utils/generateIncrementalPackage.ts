import AdmZip from 'adm-zip'
import crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import { createDirectoryAsync, generateUniqueString, replaceHomeDir } from '../'
/**
 * 根据文件路劲返回文件md5
 *
 * @param file 需要加密文件的内容
 */
function encryptFile(file: string): string {
  const md5 = crypto.createHash('md5')
  md5.update(file)
  return md5.digest('hex')
}

/**
 * 对zip包中的文件进行加密返回一组 { 压缩包文件的路径: 文件md5值 }
 *
 * @param zipFile zip文件路径
 */
function encryptZipFile(zipFile: string): Record<string, string> {
  const entries = new AdmZip(zipFile).getEntries()
  const filesHash: Record<string, any> = {}
  entries.forEach((entry) => {
    // 过滤掉目录和MacOS自动生成的目录
    if (
      entry.isDirectory ||
      entry.entryName.indexOf('__MACOSX') > -1 ||
      entry.entryName.indexOf('.DS_Store') > -1
    )
      return true
    const md5 = encryptFile(entry.getData().toString('utf8'))
    filesHash[entry.entryName] = {
      hash: md5,
      content: entry.getData().toString('utf8'),
    }
  })
  return filesHash
}

/**
 * 对比两个资源包生成差异文件数组
 *
 * @param newerZipFileHash 较新的zip包文件hash
 * @param olderZipFileHash 较旧的zip包文件hash
 */
function diffZipFileHash(
  newerZipFileHash: Record<string, any>,
  olderZipFileHash: Record<string, any>
): Record<string, any> {
  const diffFile: Record<string, any> = {}
  Object.keys(newerZipFileHash).forEach((entryName: string) => {
    if (
      entryName.indexOf('.DS_Store') === -1 &&
      (olderZipFileHash[entryName] === undefined ||
        newerZipFileHash[entryName].hash !== olderZipFileHash[entryName].hash)
    ) {
      diffFile[entryName] = newerZipFileHash[entryName]
    }
  })
  return diffFile
}

/**
 * 根据一组文件数组生成zip包
 *
 * @param {Record<string, any>} filesObject
 * @param {string} zipname
 */
function filesArrayToZip(filesObject: Record<string, any>, zipname: string): void {
  const zip = new AdmZip()
  Object.keys(filesObject).forEach((entry: string) => {
    const fileData = Buffer.from(filesObject[entry].content, 'utf8')
    zip.addFile(entry, Buffer.alloc(fileData.length, fileData))
  })
  zip.writeZip(path.resolve(zipname))
}

/**
 * 根据两个zip包, 生成增量包
 *
 * @param {string} newzip 较新的zip资源包路径
 * @param {string} oldzip 较旧的zip资源包路径
 * @param {string} incrementalPath 生成的增量包所在的路径
 */
export function generateIncrementalPackage(
  newzip: string,
  oldzip: string,
  incrementalPath: string
): string {
  // 如果包含有 '~' 则会替换至用户目录
  incrementalPath = replaceHomeDir(incrementalPath)
  newzip = replaceHomeDir(newzip)
  oldzip = replaceHomeDir(oldzip)

  const newer = encryptZipFile(newzip)
  const older = encryptZipFile(oldzip)
  const diffArray = diffZipFileHash(newer, older)

  // 如果生成的增量包路径不存在 则递归创建
  if (!fs.existsSync(incrementalPath)) {
    createDirectoryAsync(incrementalPath)
  }

  let incrementalZipPath = ''

  // 如果存在差异数据才生成增量包. 不存在则返回空字符串
  if (Object.keys(diffArray).length > 0) {
    incrementalZipPath = path.resolve(path.join(incrementalPath, generateUniqueString() + '.zip'))
    filesArrayToZip(diffArray, incrementalZipPath)
  }

  return incrementalZipPath
}
