import dayjs = require('dayjs')

export function generateUniqueString(): string {
  return dayjs().format('YYYYMMDDHHmmssSSS')
}
