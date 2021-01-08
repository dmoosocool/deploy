import { loadConfigFromEnv, DotenvParseOutput, replaceHomeDir } from './'

/**
 * 根据Env文件获取数据
 */
export function getEnvData(): DotenvParseOutput {
  const config = loadConfigFromEnv()

  if (!config || !config['ENVIRONMENT'] || config['ENVIRONMENT_VARIABLE']) return {}

  const configEnv = config['ENVIRONMENT'].split(',')
  const configEnvData = config['ENVIRONMENT_VARIABLE'].split(',')
  const result: Record<string, Record<string, string>> = {}

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

  return config
}
