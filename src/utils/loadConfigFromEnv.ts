import * as dotenv from 'dotenv'

/**
 * 获取 dotenv 配置的值
 */
export function loadConfigFromEnv(): dotenv.DotenvParseOutput | undefined {
  const config = dotenv.config()
  return config.parsed
}

export { DotenvParseOutput } from 'dotenv'
