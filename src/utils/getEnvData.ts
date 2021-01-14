import { loadConfigFromEnv, DotenvParseOutput, replaceHomeDir } from '../'

/**
 * 获取env文件数据
 */
export function getEnvData(): Record<string, DotenvParseOutput> {
  const config = loadConfigFromEnv()

  if (!config || !config['ENVIRONMENT'] || !config['ENVIRONMENT_VARIABLE']) return {}

  const configEnv = config['ENVIRONMENT'].split(',')
  const configEnvData = config['ENVIRONMENT_VARIABLE'].split(',')
  const result: Record<string, DotenvParseOutput> = {}

  configEnv.map((env) => {
    result[env] = {}
    configEnvData.map((envData) => {
      const configEnvDataKey = [env.toUpperCase(), envData.toUpperCase()].join('_')

      result[env][envData] =
        envData === 'private_key'
          ? replaceHomeDir(config[configEnvDataKey])
          : config[configEnvDataKey]
    })
  })

  result['default'] = result[configEnv[0]]
  return result
}

// 根据env获取对应环境的数据
export function getDataByEnv(env = 'default'): DotenvParseOutput {
  const datas = getEnvData()
  if (Object.prototype.hasOwnProperty.call(datas, env)) {
    return datas[env]
  }
  return {}
}
