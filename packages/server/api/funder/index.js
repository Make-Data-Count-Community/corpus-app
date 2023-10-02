const fs = require('fs')
const path = require('path')

const funderResolvers = require('./funder.resolvers')

module.exports = {
  typeDefs: fs.readFileSync(path.join(__dirname, 'funder.graphql'), 'utf-8'),
  resolvers: funderResolvers,
}
