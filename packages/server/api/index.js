const merge = require('lodash/merge')
const chart = require('./chart')
const affiliation = require('./affiliation')
const funder = require('./funder')
const subject = require('./subject')
const publisher = require('./publisher')
const journal = require('./journal')
const repository = require('./repository')
const source = require('./source')
const common = require('./common')

module.exports = {
  typeDefs: [
    // Add Here your TypeDefs
    common.typeDefs,
    chart.typeDefs,
    affiliation.typeDefs,
    funder.typeDefs,
    subject.typeDefs,
    publisher.typeDefs,
    repository.typeDefs,
    journal.typeDefs,
    source.typeDefs,
  ].join(' '),
  resolvers: merge(
    {},
    // Add here your resolvers
    chart.resolvers,
    affiliation.resolvers,
    subject.resolvers,
    funder.resolvers,
    publisher.resolvers,
    journal.resolvers,
    repository.resolvers,
    source.resolvers,
  ),
}
