/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
const { Transform } = require('stream')
const { flatten, get, uniqBy } = require('lodash')

const { logger } = require('@coko/server')
const axios = require('../axiosService')

class Datacite extends Transform {
  static URL = '/dois/'
  constructor(subjects) {
    super({ objectMode: true })
    this.subjects = subjects
  }

  // eslint-disable-next-line class-methods-use-this
  async checkInferringDoi(chunk) {
    const { inferringDataCiteDoi } = chunk.event

    if (
      (!chunk.datacite.subjects || chunk.datacite.subjects.length === 0) &&
      inferringDataCiteDoi
    ) {
      const { data } = await axios.dataciteApiDoi(
        `${Datacite.URL}${inferringDataCiteDoi}`,
      )

      if (data && !data.errors) {
        chunk.datacite.subjects = flatten(
          get(data, 'data.attributes.subjects', [])
            .map(creator => creator.subject || [])
            .filter(aff => aff.length),
        )
      }
    }

    return chunk
  }

  // eslint-disable-next-line class-methods-use-this, no-underscore-dangle
  async _transform(chunk, _encoding, callback) {
    const { dataCiteDoi, counter } = chunk.event

    if (!dataCiteDoi) {
      callback(null, chunk)
      return
    }

    const { data } = await axios.dataciteApiDoi(`${Datacite.URL}${dataCiteDoi}`)

    if (data && !data.errors) {
      logger.info(`Counter: ${counter} : URL: ${Datacite.URL}${dataCiteDoi}`)
      // Get Title
      chunk.datacite.title = get(
        data,
        'data.attributes.titles[0].title',
        'Untitled',
      )

      // Get Subjects
      chunk.datacite.subjects = flatten(
        get(data, 'data.attributes.subjects', [])
          .map(creator => creator.subject || [])
          .filter(aff => aff.length),
      )

      // eslint-disable-next-line no-console
      console.log(chunk.datacite.subjects)

      // Get Repository
      chunk.datacite.repository = get(data, 'data.attributes.publisher', null)

      // Get Affiliations
      chunk.datacite.affiliations = uniqBy(
        flatten(
          get(data, 'data.attributes.creators', [])
            .map(creator =>
              creator.affiliation
                .map(aff => ({
                  name: aff.name,
                  identifier: aff.affiliationIdentifier,
                }))
                .filter(af => af.name),
            )
            .filter(aff => aff.length),
        ),
        'name',
      )

      // Get funders
      chunk.datacite.funders = flatten(
        get(data, 'data.attributes.fundingReferences', [])
          .map(funder => ({
            name: funder.funderName,
            identifier: funder.funderIdentifier,
          }))
          .filter(fu => fu.name),
      )
    }

    chunk = await this.checkInferringDoi(chunk)

    callback(null, chunk)
  }
}

module.exports = Datacite
