import { NodeSSH, Config } from 'node-ssh'

export async function runRemoteShell(serverConfig: Config, shell = ''): Promise<void> {
  const ssh = new NodeSSH()

  // 尝试连接远程主机
  try {
    await ssh.connect(serverConfig)
  } catch (err) {
    console.log('server config failed.')
    throw new Error(err)
  }

  // 检查是否为shell文件
  if (shell.endsWith('.sh')) {
    throw new Error("The remote script executed must end with '.sh'")
  }

  // 执行远程主机上的shell文件.
  const result = await ssh.execCommand(`sh ${shell}`)
  console.log(result.stdout)
  process.exit(0)
}
