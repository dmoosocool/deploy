import { NodeSSH, Config } from 'node-ssh'

/**
 * 执行远程主机的shell文件
 *
 * @param serverConfig 服务器配置
 * @param shell 需要执行的shell文件路径
 */
export async function runRemoteShell(serverConfig: Config, shell = ''): Promise<string> {
  const ssh = new NodeSSH()

  // 尝试连接远程主机
  try {
    await ssh.connect(serverConfig)
  } catch (err) {
    console.log('server config failed.')
    throw new Error(err)
  }

  // 兼容shell文件传参数的写法
  let shellFile = shell
  if (shell.indexOf(' ') > -1) {
    shellFile = shell.split(' ')[0]
  }
  // 检查是否为shell文件
  if (!shellFile.endsWith('.sh')) {
    throw new Error("The remote script executed must end with '.sh'")
  }

  // 执行远程主机上的shell文件.
  const result = await ssh.execCommand(`sh ${shell}`)
  ssh.dispose()
  return result.stdout
}
