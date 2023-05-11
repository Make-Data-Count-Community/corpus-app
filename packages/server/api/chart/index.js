const fs = require('fs')
const path = require('path')

const chartResolvers = require('./chart.resolvers')

module.exports = {
  typeDefs: fs.readFileSync(path.join(__dirname, 'chart.graphql'), 'utf-8'),
  resolvers: chartResolvers,
}
