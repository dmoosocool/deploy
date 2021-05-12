import { generateUniqueString } from '../../'
import * as chai from 'chai'
import dayjs from 'dayjs'
const expect = chai.expect

describe('@dmoosocool/deploy `generateUniqueString`', () => {
  it(`generate a unique string`, () => {
    const a = generateUniqueString()
    setTimeout(() => {
      const b = generateUniqueString()
      expect(a).to.be.not.equal(b)
    }, 20)
  })

  it(`check unique string is a date string`, () => {
    const uniqueString = generateUniqueString()

    const formated = dayjs(uniqueString, 'YYYYMMDDHHmmssSSS', true)
    let formatedYear = formated.year()
    let formatedMonth = formated.month()
    let formatedDate = formated.date()

    let year = new Date().getFullYear()
    let month = new Date().getMonth()
    let date = new Date().getDate()

    const formatDay = `${formatedYear}-${formatedMonth}-${formatedDate}`
    const currentDay = `${year}-${month}-${date}`
    expect(formatDay).to.be.equal(currentDay)
  })
})
