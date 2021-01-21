import { generateIncrementalPackage } from '../'
const incrementalPackagePath = generateIncrementalPackage(
  '~/.sjkh/uploads/stg/full/20210121154606778.zip',
  '~/.sjkh/uploads/stg/full/20210121152931488.zip',
  '~/.sjkh/uploads/stg/incremental/'
)

if (incrementalPackagePath !== '') {
  console.log(incrementalPackagePath)
} else {
  console.log('没有变更的文件')
}
