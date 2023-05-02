const merge = require('lodash/merge')
const chart = require('./chart')

module.exports = {
  typeDefs: [
    // Add Here your TypeDefs
    chart.typeDefs
  ].join(' '),
  resolvers: merge(
    {},
    // Add here your resolvers
    chart.resolvers
  ),
}
