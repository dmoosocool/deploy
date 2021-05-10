import { loadConfigFromEnv } from '../../'
import * as chai from 'chai'
const expect = chai.expect

describe('@dmoosocool/deploy `loadConfigFromEnv`', () => {
  it(`load config from env file.`, () => {
    const config = loadConfigFromEnv()
    expect(config).to.contains.keys('ENVIRONMENT', 'ENVIRONMENT_VARIABLE')
  })
})
