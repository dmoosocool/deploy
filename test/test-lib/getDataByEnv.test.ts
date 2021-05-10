import { getDataByEnv } from '../../'
import * as chai from 'chai'
const expect = chai.expect

describe('@dmoosocool/deploy `getDataByEnv`', () => {
  it(`get default config datas by empty env string`, () => {
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
})
