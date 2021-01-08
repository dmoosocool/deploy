import archiver from 'archiver'
import dayjs from 'dayjs'
import * as path from 'path'
import * as fs from 'fs'

/**
 * 将目录打包zip
 *
 * @param {String} packageFolder 需要打包的目录
 * @param {String} publishFolder 待发布的目录
 * @return {Promise<String>} 生成zip包的文件名
 * @default
 * packageFolder path.join(process.cwd(), 'uploads')
 * publishFolder path.resolve(process.cwd())
 * @example
 * const zipname = await packageFolder(path.join(process.cwd(), 'uploads'), path.resolve(process.cwd(), 'dist'))
 * console.log(zipname); // /Users/{user}/{projectDir}/dist/20210103104902113.zip
 */
export function packageFolder(
  packageFolder: string = path.join(process.cwd(), 'uploads'),
  publishFolder: string = path.resolve(process.cwd())
): Promise<string> {
  return new Promise((resolve, reject) => {
    const zipfilename = dayjs().format('YYYYMMDDHHmmssSSS') + '.zip'
    const output = fs.createWriteStream(path.join(publishFolder, zipfilename))
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => {
      console.log(archive.pointer() + ' total bytes')
      resolve(path.join(publishFolder, zipfilename))
    })

    output.on('end', () => {
      console.log('Data has been drained')
      resolve(path.join(publishFolder, zipfilename))
    })

    archive.on('error', (err) => {
      reject(err)
    })

    archive.pipe(output)
    archive.directory(path.join(packageFolder), false, { date: new Date() })
    archive.finalize()
  })
}
