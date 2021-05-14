import { NodeSSH, Config } from 'node-ssh'
import { getDataByEnv } from '../'

/**
 * 根据环境变量进行文件上传. 默认为env文件中的第一个
 *
 * @param localPath 本地文件路径
 * @param remotePath 需要上传到远程服务器的路径
 */
export async function uploadFile(
  localPath: string,
  remotePath: string,
  env?: string
): Promise<void> {
  env = process.env.DEPLOY_ENV || ''
  const envDatas: Config = getDataByEnv(env)
  const ssh = new NodeSSH()
  await ssh.connect(envDatas)
  await ssh.putFile(localPath, remotePath)
  ssh.dispose()
}
