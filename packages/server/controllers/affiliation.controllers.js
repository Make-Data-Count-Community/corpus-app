const { model: Affiliation } = require('../models/affiliation')

const getAffiliations = async () => Affiliation.query()

module.exports = {
  getAffiliations,
}
