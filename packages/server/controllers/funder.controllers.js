const { model: Funder } = require('../models/funder')

const getFunders = async () => Funder.query()

module.exports = {
  getFunders,
}
