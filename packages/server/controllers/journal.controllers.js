const { model: Journal } = require('../models/journal')

const getJournals = async () => Journal.query()

module.exports = {
  getJournals,
}
