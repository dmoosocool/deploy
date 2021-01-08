import AdmZip from 'adm-zip'
import crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'

/**
 * 根据文件路劲返回文件md5
 *
 * @param file 需要加密文件的路径
 */
function encryptFile(file: string): string {
  if (!fs.existsSync(file)) return ''

  const content = fs.readFileSync(file, 'utf8')
  const md5 = crypto.createHash('md5')
  md5.update(content)
  return md5.digest('hex')
}

/**
 * 对zip包中的文件进行加密返回一组 { 压缩包文件的路径: 文件md5值 }
 *
 * @param zipFile zip文件路径
 */
function encryptZipFile(zipFile: string): Record<string, string> {
  const entries = new AdmZip(zipFile).getEntries()
  const filesHash: Record<string, string> = {}
  entries.forEach((entry) => {
    // 过滤掉目录和MacOS自动生成的目录
    if (entry.isDirectory || entry.entryName.indexOf('__MACOSX') > -1) return true
    const md5 = encryptFile(entry.entryName)
    filesHash[entry.entryName] = md5
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
  newerZipFileHash: Record<string, string>,
  olderZipFileHash: Record<string, string>
): Array<string> {
  const diffFile: Array<string> = []

  Object.keys(newerZipFileHash).forEach((entryName: string) => {
    if (newerZipFileHash[entryName] !== olderZipFileHash[entryName]) {
      diffFile.push(entryName)
    }
  })
  return diffFile
}

/**
 * 根据一组文件数组生成zip包
 *
 * @param {Array<string>} filesArray
 * @param {string} zipname
 */
function filesArrayToZip(filesArray: Array<string>, zipname: string): void {
  const zip = new AdmZip()
  filesArray.forEach((file: string) => {
    const fileData = fs.readFileSync(file, { encoding: 'utf8' })
    zip.addFile(file, Buffer.alloc(fileData.length, fileData))
  })
  zip.writeZip(path.resolve(zipname))
}

/**
 * 根据两个zip包, 生成增量包
 *
 * @param {string} newzip 较新的zip资源包路径
 * @param {string} oldzip 较旧的zip资源包路径
 */
export function generateIncrementalPackage(newzip: string, oldzip: string): void {
  const newer = encryptZipFile(newzip)
  const older = encryptZipFile(oldzip)
  const diffArray = diffZipFileHash(newer, older)
  filesArrayToZip(diffArray, path.resolve(process.cwd(), 'dist'))

  return void 0
}
