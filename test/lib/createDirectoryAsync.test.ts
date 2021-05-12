import { createDirectoryAsync } from '../../'
import * as chai from 'chai'
import * as path from 'path'
import * as fs from 'fs'
const expect = chai.expect

describe('@dmoosocool/deploy `createDirectoryAsync`', () => {
  it(`Recursively create a directory`, () => {
    const needToCreate = path.join(
      process.cwd(),
      'test',
      'test-create-directory-async',
      'src',
      'js',
      new Date().getTime().toString()
    )
    createDirectoryAsync(needToCreate)
    const isExitsPath = fs.existsSync(needToCreate)
    const isDirectory = fs.statSync(needToCreate).isDirectory()

    expect(isExitsPath).to.be.equal(true)
    expect(isDirectory).to.be.equal(true)
  })
})
