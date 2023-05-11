const { getAffiliations } = require('../../controllers/affiliation.controllers')

const getAffiliationResolver = async () => {
  return getAffiliations()
}

module.exports = {
  Query: {
    getAffiliations: getAffiliationResolver,
  },
  Mutation: {},
  Affilation: {},
}
