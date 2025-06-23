/* eslint-disable no-param-reassign */
const { Publisher, Journal, Repository } = require('@pubsweet/models')

class CrossrefToAssertion {
  // eslint-disable-next-line class-methods-use-this
  async transformToAssertion(assertionInstance, chunk, trx) {
    const publishedDate = await chunk.crossref.publishedDate
    assertionInstance.publishedDate = publishedDate

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

    if( chunk.repository) {
      const title = chunk.repository

      const exists = await Repository.query(trx).findOne({ title })
      let repository = exists

      if (!exists) {
        repository = await Repository.query(trx)
          .insert({ title })
          .returning('*')
      }

      assertionInstance.repositoryId = repository.id
    }
  }
}

module.exports = CrossrefToAssertion
