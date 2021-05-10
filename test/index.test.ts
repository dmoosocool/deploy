import {
  runRemoteShell,
  loadConfigFromEnv,
  // DotenvParseOutput,
  replaceHomeDir,
  getDataByEnv,
  packageFolder,
  generateIncrementalPackage,
  uploadFile,
  createDirectoryAsync,
  generateUniqueString,
} from '../'

import * as chai from 'chai'

const expect = chai.expect

describe('@dmoosocool/deploy entry file', () => {
  it('`runRemoteShell` should be a function', () => {
    expect(typeof runRemoteShell).to.equal('function')
  })

  it('`loadConfigFromEnv` should be a function', () => {
    expect(typeof loadConfigFromEnv).to.equal('function')
  })

  it('`replaceHomeDir` should be a function', () => {
    expect(typeof replaceHomeDir).to.equal('function')
  })

  it('`getDataByEnv` should be a function', () => {
    expect(typeof getDataByEnv).to.equal('function')
  })

  it('`generateIncrementalPackage` should be a function', () => {
    expect(typeof generateIncrementalPackage).to.equal('function')
  })

  it('`packageFolder` should be a function', () => {
    expect(typeof packageFolder).to.equal('function')
  })

  it('`uploadFile` should be a function', () => {
    expect(typeof uploadFile).to.equal('function')
  })

  it('`createDirectoryAsync` should be a function', () => {
    expect(typeof createDirectoryAsync).to.equal('function')
  })

  it('`generateUniqueString` should be a function', () => {
    expect(typeof generateUniqueString).to.equal('function')
  })
})
