const { model: Source } = require('../models/source')

const getSources = async () => Source.query()

module.exports = {
  getSources,
}
