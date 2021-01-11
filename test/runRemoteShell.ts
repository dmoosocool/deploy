import { runRemoteShell } from '../src'
runRemoteShell(
  {
    host: '127.0.0.1',
    port: 2222,
    username: 'root',
    password: 'woshinidejia.',
    private_key: '~/.ssh/id_rsa',
  },
  '/root/stg/test.sh'
)
