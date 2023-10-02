const { getJournals } = require('../../controllers/journal.controllers')

const getJournalResolver = async (_, input) => {
  return getJournals(input)
}

module.exports = {
  Query: {
    getJournals: getJournalResolver,
  },
  Mutation: {},
  Journal: {},
}
