/* eslint-disable no-param-reassign */
const { Transform } = require('stream')
const { logger } = require('@coko/server')
const path = require('path')
const moment = require('moment')
const fs = require('fs')
const axios = require('../axiosService')
const CrossrefMetadataXml = require('./crossrefMetadataXml')
const XmlFactory = require('../xmlBaseModel/xmlFactory')

class Crossref extends Transform {
  static URL = '/works/'
  static LOCALURL = '/paper/'

  constructor(_obj) {
    super({ objectMode: true })
    this.count = 0
    this.localHits = 0
    this.apiCalls = 0
    this.errorLogPath = '/home/node/app/logs/crossrefErrors.jsonl'

    const logsDir = path.dirname(this.errorLogPath)

    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
    }

    this.errorLogStream = fs.createWriteStream(this.errorLogPath, { flags: 'a' })
    logger.info(`Crossref error logging initialized: ${this.errorLogPath}`)
  }

  // eslint-disable-next-line class-methods-use-this
  formatLocalDate(dateString) {
    if (!dateString) return null

    try {
      let year, month, day

      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Full date: "2025-02-15"
        [year, month, day] = dateString.split('-')
      } else if (dateString.match(/^\d{4}-\d{2}$/)) {
        // Year-month only: "2025-02"
        [year, month] = dateString.split('-')
        day = '01'
      } else if (dateString.match(/^\d{4}$/)) {
        // Year only: "2025"
        year = dateString
        month = '01'
        day = '01'
      } else {
        return null
      }

      month = parseInt(month, 10) > 0 && parseInt(month, 10) < 13 ? month.padStart(2, '0') : '01'
      day = parseInt(day, 10) > 0 && parseInt(day, 10) < 32 ? day.padStart(2, '0') : '01'

      const formattedDate = `${year}-${month}-${day}`
      const momentDate = moment(formattedDate, 'YYYY-MM-DD')

      return momentDate.isValid() ? formattedDate : null
    } catch (error) {
      logger.warn(`Error formatting date: ${dateString}`, error)
      return null
    }
  }

  // eslint-disable-next-line class-methods-use-this
  transformLocalResponse(localData) {
    return {
      publishedDate: this.formatLocalDate(localData.published_date),
      publisher: localData.publisher,
      journal: localData.journal
    }
  }

  logCrossrefError(crossrefDoi, responseData, status, additionalInfo = {}) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      crossrefDoi,
      status,
      responseData,
      url: `${Crossref.URL}${crossrefDoi}`,
      ...additionalInfo
    }

    this.errorLogStream.write(`${JSON.stringify(errorEntry)}\n`)

    logger.error('Crossref Error:', responseData, status, `CROSSREF DOI: ${crossrefDoi}`)
  }

  // eslint-disable-next-line class-methods-use-this, no-underscore-dangle
  async _transform(chunk, _encoding, callback) {
    const { crossrefDoi } = chunk.event

    if (!crossrefDoi) {
      callback(null, chunk)
      return
    }

    try {
      const localResponse = await axios.crossrefLocalApi(
        `${Crossref.LOCALURL}${crossrefDoi}`,
      )

      if (localResponse.status === 200 && localResponse.data && !localResponse.data.detail) {
        chunk.crossref = this.transformLocalResponse(localResponse.data)
        this.localHits += 1
        logger.info(`Local cache hit for DOI: ${crossrefDoi}`)
      } else {
        logger.info(`Local cache miss for DOI: ${crossrefDoi}, trying Crossref API`)
        this.apiCalls += 1

        const responseSubj = await axios.crossrefApi(
          `${Crossref.URL}${crossrefDoi}`,
        )

        if (responseSubj.data && responseSubj.status === 200) {
          chunk.crossref = await XmlFactory.xmlToModel(
            responseSubj.data,
            CrossrefMetadataXml,
          )
        } else {
          this.logCrossrefError(
            crossrefDoi,
            responseSubj.data || 'No response data',
            responseSubj.status || 'No status',
            {
              chunkActivityId: chunk.activityId || 'unknown',
              errorType: 'API_ERROR',
              source: 'crossref_api'
            }
          )
        }
      }
    } catch (error) {
      this.logCrossrefError(
        crossrefDoi,
        error.message,
        'EXCEPTION',
        {
          chunkActivityId: chunk.activityId || 'unknown',
          errorType: 'EXCEPTION',
          errorCode: error.code,
          source: 'unknown'
        }
      )
    }

    this.count += 1

    if (this.count % 10 === 0) {
      logger.info(`Crossref Item: ${this.count} (Local hits: ${this.localHits}, API calls: ${this.apiCalls})`)
    }

    callback(null, chunk)
  }
}

module.exports = Crossref
