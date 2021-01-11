import * as path from 'path'
import { uploadFile } from '../src'
uploadFile(path.join(process.cwd(), 'test.zip'), '/root/stg/test.zip')
