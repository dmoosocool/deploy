import { packageFolder } from '../src'
import * as path from 'path'
import * as os from 'os'
packageFolder('./test333', path.resolve(path.join(os.homedir(), '.sjkh', 'uploads')))
  .then(console.log)
  .catch(console.log)
