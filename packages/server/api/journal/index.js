const fs = require('fs')
const path = require('path')

const journalResolvers = require('./journal.resolvers')

module.exports = {
  typeDefs: fs.readFileSync(path.join(__dirname, 'journal.graphql'), 'utf-8'),
  resolvers: journalResolvers,
}
