'use strict'
const fs = require('fs')
const os = require('os')
const GitHubApi = require('github')
const Bluebird = require('bluebird')

const github = new GitHubApi({
  headers: {
    'user-agent': 'npm gh-issues manager/1.0.0 (support@npmjs.com; https://github.com/npm/gh-issues)'
  },
  Promise: Bluebird,
  timeout: 5000,
})
github.authenticate({
  type: 'token',
  token: fs.readFileSync(`${os.homedir()}/.gh-issues-token`, 'utf8').trim()
})
module.exports = github
