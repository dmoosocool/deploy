import { generateIncrementalPackage } from '../'
const incrementalPackagePath = generateIncrementalPackage(
  '~/.sjkh/uploads/stg/full/20210120211950196.zip',
  '~/.sjkh/uploads/stg/full/20210120211834399.zip',
  '~/.sjkh/uploads/stg/incremental/'
)

console.log(incrementalPackagePath)
