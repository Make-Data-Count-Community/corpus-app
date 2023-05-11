const { getJournals } = require('../../controllers/journal.controllers')

const getJournalResolver = async () => {
  return getJournals()
}

module.exports = {
  Query: {
    getJournals: getJournalResolver,
  },
  Mutation: {},
  Journal: {},
}
