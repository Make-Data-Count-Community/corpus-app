/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
const { Transform } = require('stream')
const { logger } = require('@coko/server')
const { flatten, get, uniqBy } = require('lodash')

const axios = require('../axiosService')

class Datacite extends Transform {
  static URL = '/dois/'
  constructor(subjects) {
    super({ objectMode: true })
    this.subjects = subjects
  }

  // eslint-disable-next-line class-methods-use-this, no-underscore-dangle
  async _transform(chunk, _encoding, callback) {
    const { dataCiteDoi } = chunk.event

    if (!dataCiteDoi) {
      callback(null, chunk)
      return
    }

    const { data } = await axios.dataciteApiDoi(`${Datacite.URL}${dataCiteDoi}`)

    if (data && !data.errors) {
      // Exclude records that are not of type "Dataset"
      chunk.datacite.type = get(
        data,
        'data.attributes.types.resourceTypeGeneral',
        null,
      )

      if (chunk.datacite.type && chunk.datacite.type !== 'Dataset') {
        logger.info(`Excluding ${dataCiteDoi} because it is not a dataset`)
        // set excluded flag to prevent this chunk from being saved on pipeline finish
        chunk.excluded = true
        callback(null, chunk)
        return
      }

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

    callback(null, chunk)
  }
}

module.exports = Datacite
