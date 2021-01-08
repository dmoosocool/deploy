import { runRemoteShell } from '../src'
runRemoteShell(
  {
    host: '192.168.100.23',
    port: 22,
    username: 'ddd',
    private_key: '~/.ssh/id_rsa',
  },
  '/Users/dmoo/stg/test.sh'
)
