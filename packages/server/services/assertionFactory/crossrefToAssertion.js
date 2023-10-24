/* eslint-disable no-param-reassign */
const { Publisher, Journal } = require('@pubsweet/models')

class CrossrefToAssertion {
  // eslint-disable-next-line class-methods-use-this
  async transformToAssertion(assertionInstance, chunk, trx) {
    const publishedDate = await chunk.crossref.publishedDate
    assertionInstance.publishedDate = publishedDate

    if (chunk.notFound) {
      // the crossref call returned 404 or otherwise failed to fetch metadata
      return
    }

    if (chunk.crossref.publisher) {
      const title = chunk.crossref.publisher
      const exists = await Publisher.query(trx).findOne({ title })
      let publisher = exists

      if (!exists) {
        publisher = await Publisher.query(trx).insert({ title }).returning('*')
      }

      assertionInstance.publisherId = publisher.id
    }

    if (chunk.crossref.journal) {
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
