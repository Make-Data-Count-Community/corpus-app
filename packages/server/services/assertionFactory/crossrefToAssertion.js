/* eslint-disable no-param-reassign */
const { Publisher, Journal } = require('@pubsweet/models')

class CrossrefToAssertion {
  // eslint-disable-next-line class-methods-use-this
  async transformToAssertion(assertionInstance, chunk, trx) {
    const publishedDate = chunk.crossref
      ? await chunk.crossref.publishedDate
      : null

    assertionInstance.publishedDate = publishedDate

    if (chunk.crossref && chunk.crossref.publisher) {
      const title = chunk.crossref.publisher
      const exists = await Publisher.query(trx).findOne({ title })
      let publisher = exists

      if (!exists) {
        publisher = await Publisher.query(trx).insert({ title }).returning('*')
      }

      assertionInstance.publisherId = publisher.id
    }

    if (chunk.crossref && chunk.crossref.journal) {
      const title = chunk.crossref.journal

      const exists = await Journal.query(trx).findOne({ title })
      let journal = exists

      if (!exists) {
        journal = await Journal.query(trx).insert({ title }).returning('*')
      }

      assertionInstance.journalId = journal.id
    }
  }
}

module.exports = CrossrefToAssertion
