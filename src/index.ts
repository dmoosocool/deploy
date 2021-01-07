// import { loadConfigFromEnv, replaceHomeDir } from './utils'

// const config = loadConfigFromEnv()
// if (!config) {
//   throw new Error('get config failed')
// }

// const server = {
//   stg: {
//     host: config.STG_HOST,
//     port: config.STG_PORT,
//     user: config.STG_USER,
//     privateKey: replaceHomeDir(config.STG_PRIVATE_KEY),
//   },
// }

// console.log(server)

// // replaceHomeDir('~/.ssh/authorized_keys/../../.ssh/id_rsa/~/asd')

import { getEnvData } from './utils'
getEnvData()
