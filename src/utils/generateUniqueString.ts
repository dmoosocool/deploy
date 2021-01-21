import dayjs from 'dayjs'

export function generateUniqueString(): string {
  return dayjs().format('YYYYMMDDHHmmssSSS')
}
