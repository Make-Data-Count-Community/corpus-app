/* eslint-disable no-param-reassign */
const { Transform } = require('stream')
const { logger } = require('@coko/server')
const axios = require('../axiosService')
const CrossrefMetadataXml = require('./crossrefMetadataXml')
const XmlFactory = require('../xmlBaseModel/xmlFactory')

class CrossrefRetry extends Transform {
  static URL = '/works/'
  constructor(_obj) {
    super({ objectMode: true })
    this.count = 0
  }

  // eslint-disable-next-line class-methods-use-this, no-underscore-dangle
  async _transform(chunk, _encoding, callback) {
    const { objId } = chunk
    let crossrefData

    if (!objId) {
      logger.info('No crossref ID')
      callback(null, chunk)
      return
    }

    const responseSubj = await axios.crossrefApi(`${CrossrefRetry.URL}${objId}`)

    if (responseSubj.data && responseSubj.status === 200) {
      logger.info('Crossref found:', `${CrossrefRetry.URL}${objId}`)
      crossrefData = await XmlFactory.xmlToModel(
        responseSubj.data,
        CrossrefMetadataXml,
      )
    } else {
      logger.error(
        'Crossref Error:',
        responseSubj.data,
        responseSubj.status,
        `${CrossrefRetry.URL}${objId}`,
      )
      chunk.notFound = true
    }

    if (crossrefData) {
      chunk.crossref = crossrefData
    }

    callback(null, chunk)
  }
}

module.exports = CrossrefRetry
