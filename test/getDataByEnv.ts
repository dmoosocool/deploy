import { getDataByEnv } from '../src'

const emptyEnv = getDataByEnv()
console.log(emptyEnv)

const uatData = getDataByEnv('uat')
console.log(uatData)

const unknowData = getDataByEnv('unkownEnv')
console.log(unknowData)
