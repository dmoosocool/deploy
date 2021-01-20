/* eslint-disable @typescript-eslint/no-explicit-any */

import { loadConfigFromEnv, replaceHomeDir } from '..'

/**
 * 获取env文件数据
 */
export function getDataByEnv(env?: string): Record<string, any> {
  const config = loadConfigFromEnv()
  let sjkhConfig: Record<string, any> = {}

  if (
    !config ||
    !config['ENVIRONMENT'] ||
    !config['ENVIRONMENT_VARIABLE'] ||
    config['ENVIRONMENT'].indexOf(',') === -1 ||
    config['ENVIRONMENT_VARIABLE'].indexOf(',') === -1
  ) {
    return sjkhConfig
  }

  const supportedEnv = config['ENVIRONMENT'].split(',')
  const configEnvData = config['ENVIRONMENT_VARIABLE'].split(',')
  const currentEnv = env || supportedEnv[0]

  sjkhConfig = {
    _env: currentEnv,
    _supportedEnv: supportedEnv,
  }

  if (!currentEnv || supportedEnv.indexOf(currentEnv) === -1) {
    return sjkhConfig
  }

  configEnvData.map((envData) => {
    const configEnvDataKey = [currentEnv.toUpperCase(), envData.toUpperCase()].join('_')

    sjkhConfig[envData] =
      envData === 'private_key'
        ? replaceHomeDir(config[configEnvDataKey])
        : config[configEnvDataKey]
  })

  return sjkhConfig
}
