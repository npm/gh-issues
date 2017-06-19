'use strict'
const fs = require('fs')
const ndjson = require('ndjson')
const fun = require('funstream')
const moment = require('moment')
const Bluebird = require('bluebird')
require('./app')(main)

function moreThanDaysAgo (days, date) {
  return moment(date).isBefore(moment().subtract(days, 'days'))
}

async function main () {
  await fun(fs.createReadStream('issue-list.ndjson')).pipe(ndjson()).filter(issue => {
    return moreThanDaysAgo(7, issue.updated_at)
  }).filter(issue => {
    return issue.labels.length === 0
  }).filter(issue => {
    return !/npm[@ ]?[v]?5/.test(issue.title) || !/npm[@ ]?[v]?5/.test(issue.body)
  }).forEach(issue => {
    console.log(issue.number)
  })
}