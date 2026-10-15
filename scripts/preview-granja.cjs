const { spawn } = require('node:child_process')
const path = require('node:path')

// El servidor Bevy de esta versión se cierra al recargar la misma escena.
// Hammurabi es la alternativa oficial soportada por sdk-commands.
const project = path.resolve(__dirname, '..')
const child = spawn(process.execPath, [
  require.resolve('@dcl/sdk-commands/dist/index.js'),
  'start', '--explorer-alpha', '--landscape-terrain-enabled', '--no-watch',
  ...process.argv.slice(2)
], {
  cwd: project,
  stdio: 'inherit',
  env: {
    ...process.env,
    DCL_SERVER_ENGINE: 'hammurabi',
    DCL_SERVER_PACKAGE: '@dcl/hammurabi-server@1.7.2-30851429170.commit-274b256',
    DCL_DISABLE_ANALYTICS: 'true'
  }
})
child.on('error', error => { console.error(error.message); process.exitCode = 1 })
child.on('exit', code => { process.exitCode = code ?? 1 })
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal))
