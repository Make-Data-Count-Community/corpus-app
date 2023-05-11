const fs = require('fs')
const path = require('path')

const affiliationResolvers = require('./affiliation.resolvers')

module.exports = {
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'affiliation.graphql'),
    'utf-8',
  ),
  resolvers: affiliationResolvers,
}
