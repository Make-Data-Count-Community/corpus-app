const fs = require('fs')
const path = require('path')

const sourceResolvers = require('./source.resolvers')

module.exports = {
  typeDefs: fs.readFileSync(path.join(__dirname, 'source.graphql'), 'utf-8'),
  resolvers: sourceResolvers,
}
