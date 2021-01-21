import { generateIncrementalPackage } from '../'
import * as fs from 'fs'
const incrementalPackagePath = generateIncrementalPackage(
  '~/.sjkh/uploads/stg/full/20210121201244206.zip',
  '~/.sjkh/uploads/stg/full/20210121200728170.zip',
  '~/.sjkh/uploads/stg/incremental/'
)

if (incrementalPackagePath !== '') {
  console.log(incrementalPackagePath)
  if (!fs.existsSync(incrementalPackagePath)) {
    console.log('生成的增量包路径不对')
  }
} else {
  console.log('没有变更的文件')
}
