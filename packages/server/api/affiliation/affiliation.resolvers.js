const { getAffiliations } = require('../../controllers/affiliation.controllers')

const getAffiliationResolver = async (_, input) => {
  return getAffiliations(input)
}

module.exports = {
  Query: {
    getAffiliations: getAffiliationResolver,
  },
  Mutation: {},
  Affilation: {},
}
