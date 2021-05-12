import { getDataByEnv } from '../../'
import * as chai from 'chai'
const expect = chai.expect

describe('@dmoosocool/deploy `getDataByEnv`', () => {
  it('get default config datas by empty env string', () => {
    const defaultEnvDatas = getDataByEnv()
    expect(defaultEnvDatas).to.contains.keys(
      '_env',
      '_supportedEnv',
      'host',
      'port',
      'username',
      'password',
      'private_key'
    )

    expect(defaultEnvDatas._env).to.equal('stg')
  })

  it('get stg config datas by "stg" env string', () => {
    const stgEnvDatas = getDataByEnv('stg')
    expect(stgEnvDatas).to.contains.keys(
      '_env',
      '_supportedEnv',
      'host',
      'port',
      'username',
      'password',
      'private_key'
    )

    expect(stgEnvDatas._env).to.equal('stg')
  })

  it('get uat config datas by "uat" env string', () => {
    const uatEnvDatas = getDataByEnv('uat')
    expect(uatEnvDatas).to.contains.keys(
      '_env',
      '_supportedEnv',
      'host',
      'port',
      'username',
      'password',
      'private_key'
    )

    expect(uatEnvDatas._env).to.equal('uat')
  })
})
