import { generateIncrementalPackage, packageFolder } from '../../'
import * as chai from 'chai'
import * as path from 'path'
import * as fs from 'fs'
const expect = chai.expect

describe('@dmoosocool/deploy `generateIncrementalPackage`', () => {
  it(`package dist-first dist-second fold and generate a incremental zip`, async () => {
    const publishFolderPath = path.join(process.cwd(), 'test', 'publish')
    const distFirstPath = path.join(process.cwd(), 'test', 'dist-first')
    const distSecondPath = path.join(process.cwd(), 'test', 'dist-second')

    const firstzip = await packageFolder(distFirstPath, publishFolderPath)
    const secondzip = await packageFolder(distSecondPath, publishFolderPath)

    const incrementalZipPath = generateIncrementalPackage(firstzip, secondzip, publishFolderPath)

    // // 判断生成的zip包文件后缀是否为.zip
    expect(path.extname(incrementalZipPath)).to.be.equal('.zip')
    const isExits = fs.existsSync(incrementalZipPath)

    // 判断生成的zip包文件路径是否存在.
    expect(isExits).to.be.equal(true)
  })
})
