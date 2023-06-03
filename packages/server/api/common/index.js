/* eslint-disable global-require */
const fs = require('fs')
const path = require('path')

module.exports = {
  typeDefs: fs.readFileSync(path.join(__dirname, 'common.graphql'), 'utf-8'),
}
