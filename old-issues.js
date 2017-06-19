'use strict'
const fs = require('fs')
const ndjson = require('ndjson')
const fun = require('funstream')
const moment = require('moment')
const Bluebird = require('bluebird')
require('./app')(main)

// don't let this filter close issues
const safeTags = [ 'support', 'npm5' ]

function moreThanDaysAgo (days, date) {
  return moment(date).isBefore(moment().subtract(days, 'days'))
}

async function main () {
  await fun(fs.createReadStream('issue-list.ndjson')).pipe(ndjson()).filter(issue => {
    return moreThanDaysAgo(30, issue.updated_at)
  }).filter(issue => {
    const labels = issue.labels.map(issue => issue.name)
    return labels.length && !labels.some(l => safeTags.some(t => t === l))
  }).filter(issue => {
    return !/npm[@ ]?[v]?5/.test(issue.title) || !/npm[@ ]?[v]?5/.test(issue.body)
  }).forEach(issue => {
    console.log(issue.number)
  })
}