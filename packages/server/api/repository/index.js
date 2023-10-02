const fs = require('fs')
const path = require('path')

const repositoryResolvers = require('./repository.resolvers')

module.exports = {
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'repository.graphql'),
    'utf-8',
  ),
  resolvers: repositoryResolvers,
}
