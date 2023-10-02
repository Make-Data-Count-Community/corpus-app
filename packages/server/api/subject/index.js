const fs = require('fs')
const path = require('path')

const subjectResolvers = require('./subject.resolvers')

module.exports = {
  typeDefs: fs.readFileSync(path.join(__dirname, 'subject.graphql'), 'utf-8'),
  resolvers: subjectResolvers,
}
