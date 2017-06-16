'use strict'
const github = require('./github.js')
const fs = require('fs')
const issueList = fs.createWriteStream('issue-list.ndjson')
const prList = fs.createWriteStream('pr-list.ndjson')
require('./app.js')(main)

function closeStream (stream) {
  stream.end()
  return new Promise((resolve, reject) => {
    stream.on('error', reject)
    stream.on('close', resolve)
  })
}

async function main () {
  let res
  do {
    if (res) {
      res = await github.getNextPage(res)
    } else {
      res = await github.issues.getForRepo({
        owner: 'npm',
        repo: 'npm',
        state: 'open',
        assignee: 'none',
        milestone: 'none',
        per_page: 100
      })
    }
    const issues = res.data
    issues.forEach(issue => {
      if (issue.pull_request) {
        prList.write(JSON.stringify(issue) + '\n')
      } else {
        issueList.write(JSON.stringify(issue) + '\n')
      }
    })
  } while (github.hasNextPage(res))
  await Promise.all([closeStream(prList), closeStream(issueList)])
}
