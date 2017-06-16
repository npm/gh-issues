'use strict'
const onExit = require('signal-exit')
let exited = false

onExit(() => {
  if (!exited) {
    console.error('Abnormal exit: Promises not resolved')
    process.exit(1)
  }
})
module.exports = function (entry) {
  setImmediate(() => {
    entry(process.argv.slice(2)).then(() => {
      exited = true
    }, err => {
      exited = true
      console.error(err && err.stack ? err.stack : err)
      process.exit(1)
    })
  })
}
