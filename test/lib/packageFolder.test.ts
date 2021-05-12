import { packageFolder } from '../../'
import * as chai from 'chai'
import * as path from 'path'
import * as fs from 'fs'
const expect = chai.expect

describe('@dmoosocool/deploy `packageFolder`', () => {
  it(`package 'test/dist-first' folder`, async () => {
    const packageFolderPath = path.join(process.cwd(), 'test', 'dist-first')
    const publishFolderPath = path.join(process.cwd(), 'test', 'publish')

    const pathString = await packageFolder(packageFolderPath, publishFolderPath)
    // 判断生成的zip包文件后缀是否为.zip
    expect(path.extname(pathString)).to.be.equal('.zip')
    const isExits = fs.existsSync(pathString)

    // 判断生成的zip包文件路径是否存在.
    expect(isExits).to.be.equal(true)
  })
})
