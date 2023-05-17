/* eslint-disable no-param-reassign */
const { Transform } = require('stream')

const { logger } = require('@coko/server')
const { Publisher, Journal } = require('@pubsweet/models')

const axios = require('../axiosService')
const CrossrefMetadataXml = require('./crossrefMetadataXml')
const XmlFactory = require('../xmlBaseModel/xmlFactory')

class Crossref extends Transform {
  static URL = '/works/'
  constructor(_obj) {
    super({ objectMode: true })
    this.count = 0
  }

  // eslint-disable-next-line class-methods-use-this, no-underscore-dangle
  async _transform(chunk, _encoding, callback) {
    let doi = null
    const sourceId = chunk.event.attributes['source-id']

    if (sourceId === 'crossref') {
      doi = chunk.event.attributes['subj-id'].replace('https://doi.org/', '')
    } else {
      doi = chunk.event.attributes['obj-id'].replace('https://doi.org/', '')
    }

    const responseSubj = await axios.crossrefApi(`${Crossref.URL}${doi}`)

    if (responseSubj.data && responseSubj.status === 200) {
      chunk.crossref = await XmlFactory.xmlToModel(
        responseSubj.data,
        CrossrefMetadataXml,
      )
    }

    this.count += 1
    logger.info('Item:', this.count)
    callback(null, chunk)
  }

  // eslint-disable-next-line class-methods-use-this
  async transformToAssertion(assertionInstance, chunk, trx) {
    if (chunk.crossref.publisher) {
      const title = chunk.crossref.publisher
      const exists = await Publisher.query().findOne({ title })
      let publisher = exists

      if (!exists) {
        publisher = await Publisher.query(trx)
          .insert({ title })
          .returning('*')
          .debug()
      }

      assertionInstance.publisherId = publisher.id
    }

    if (chunk.crossref.journal) {
      const title = chunk.crossref.journal
      const exists = await Journal.query().findOne({ title })
      let journal = exists

      if (!exists) {
        journal = await Journal.query(trx)
          .insert({ title })
          .returning('*')
          .debug()
      }

      assertionInstance.journalId = journal.id
    }
  }
}

module.exports = Crossref
