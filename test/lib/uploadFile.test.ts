import {
  uploadFile,
  packageFolder,
  runRemoteShell,
  getDataByEnv,
  generateUniqueString,
} from '../../'
import * as chai from 'chai'
import * as path from 'path'
const expect = chai.expect

describe('@dmoosocool/deploy `uploadFile`', () => {
  it('package and upload dist-first folder', async () => {
    const distFirstPath = path.join(process.cwd(), 'test', 'dist-first')
    const publishPath = path.join(process.cwd(), 'test', 'publish')
    const uploadFilePath = await packageFolder(distFirstPath, publishPath)
    const uploadFilename = generateUniqueString()
    const remotePath = `/www/uploads/${uploadFilename}.zip`
    const remoteShellPath = `/www/shell/testForUploadFile.sh`
    const shellPath = path.join(process.cwd(), 'test', 'shell', 'testForUploadFile.sh')

    // 上传shell脚本至远程服务器
    await uploadFile(shellPath, remoteShellPath)

    // 上传zip包至远程服务器
    await uploadFile(uploadFilePath, remotePath)
    const stgServerConfig = getDataByEnv('stg')

    // 执行远程脚本
    const stdout = await runRemoteShell(stgServerConfig, remoteShellPath + ` ${remotePath}`)
    expect(stdout).to.be.equal('1')
  })
})
