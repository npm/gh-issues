'use strict'
const fs = require('fs')
const ndjson = require('ndjson')
const fun = require('funstream')
const moment = require('moment')
const Bluebird = require('bluebird')
require('./app')(main)

// don't let this filter close issues
const safeTags = [ 'bug', 'big-bug', 'feature-request' ]

function moreThanDaysAgo (days, date) {
  return moment(date).isBefore(moment().subtract(days, 'days'))
}

async function main () {
  await fun(fs.createReadStream('issue-list.ndjson')).pipe(ndjson()).filter(issue => {
    return moreThanDaysAgo(3, issue.updated_at)
  }).filter(issue => {
    const labels = issue.labels.map(issue => issue.name)
    return labels.some(l => l === 'support') && !labels.some(l => safeTags.some(t => t === l))
  }).forEach(issue => {
    console.log(issue.number)
  })
}