import { replaceHomeDir } from '../../'
import * as chai from 'chai'
import * as os from 'os'
const expect = chai.expect

describe('@dmoosocool/deploy `replaceHomeDir`', () => {
  it(`replace '~' to os.homedir()`, () => {
    const preReplaceHomeDir = replaceHomeDir('~/.ssh/id_rsa')
    const homeDir = os.homedir()
    expect(preReplaceHomeDir).to.equal(`${homeDir}/.ssh/id_rsa`)
  })
})
