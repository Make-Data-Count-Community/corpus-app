const { getFunders } = require('../../controllers/funder.controllers')

const getFunderResolver = async () => {
  return getFunders()
}

module.exports = {
  Query: {
    getFunders: getFunderResolver,
  },
  Mutation: {},
  Funder: {},
}
