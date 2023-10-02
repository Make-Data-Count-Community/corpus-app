const { getSources } = require('../../controllers/source.controllers')

const getSourceResolver = async () => {
  return getSources()
}

module.exports = {
  Query: {
    getSources: getSourceResolver,
  },
  Mutation: {},
  Source: {},
}
