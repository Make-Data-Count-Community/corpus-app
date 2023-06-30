/* eslint-disable no-param-reassign */
const { Transform } = require('stream')
const { logger } = require('@coko/server')
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
    const { crossrefDoi } = chunk.event

    if (!crossrefDoi) {
      callback(null, chunk)
      return
    }

    const responseSubj = await axios.crossrefApi(
      `${Crossref.URL}${crossrefDoi}`,
    )

    if (responseSubj.data && responseSubj.status === 200) {
      chunk.crossref = await XmlFactory.xmlToModel(
        responseSubj.data,
        CrossrefMetadataXml,
      )
    }

    this.count += 1

    // if (this.count % 100 === 0) {
    logger.info('Item:', this.count)
    // }

    callback(null, chunk)
  }
}

module.exports = Crossref
