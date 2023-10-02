const fs = require('fs')
const path = require('path')

const publisherResolvers = require('./publisher.resolvers')

module.exports = {
  typeDefs: fs.readFileSync(path.join(__dirname, 'publisher.graphql'), 'utf-8'),
  resolvers: publisherResolvers,
}
