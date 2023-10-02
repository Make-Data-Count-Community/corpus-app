const { getFunders } = require('../../controllers/funder.controllers')

const getFunderResolver = async (_, input) => {
  return getFunders(input)
}

module.exports = {
  Query: {
    getFunders: getFunderResolver,
  },
  Mutation: {},
  Funder: {},
}
