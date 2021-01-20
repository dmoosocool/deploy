import { loadConfigFromEnv, DotenvParseOutput, replaceHomeDir } from '..'

/**
 * 获取env文件数据
 */
export function getDataByEnv(env?: string): DotenvParseOutput {
  const config = loadConfigFromEnv()

  if (!config || !config['ENVIRONMENT'] || !config['ENVIRONMENT_VARIABLE']) return {}

  const configEnv = config['ENVIRONMENT'].split(',')
  const configEnvData = config['ENVIRONMENT_VARIABLE'].split(',')
  const result: Record<string, DotenvParseOutput> = {}
  env = env || configEnv[0]

  configEnv.map((env) => {
    result[env] = {}
    configEnvData.map((envData) => {
      const configEnvDataKey = [env.toUpperCase(), envData.toUpperCase()].join('_')
      result[env].support = config['ENVIRONMENT']
      result[env].currentEnv = env
      result[env][envData] =
        envData === 'private_key'
          ? replaceHomeDir(config[configEnvDataKey])
          : config[configEnvDataKey]
    })
  })

  if (Object.prototype.hasOwnProperty.call(result, env)) {
    return result[env]
  } else {
    return {}
  }
}
