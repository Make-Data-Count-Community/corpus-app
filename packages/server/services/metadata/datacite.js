/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
const { Transform } = require('stream')
const { uuid } = require('@coko/server')
const { flatten, get, uniqBy } = require('lodash')

const {
  Repository,
  AssertionSubject,
  Affiliation,
  AssertionAffiliation,
  AssertionFunder,
  Funder,
} = require('@pubsweet/models')

const axios = require('../axiosService')

class Datacite extends Transform {
  static URL = '/dois/'
  constructor(subjects) {
    super({ objectMode: true })
    this.subjects = subjects
  }

  // eslint-disable-next-line class-methods-use-this, no-underscore-dangle
  async _transform(chunk, _encoding, callback) {
    let doi = null
    const sourceId = chunk.event.attributes['source-id']

    if (sourceId === 'datacite-crossref') {
      doi = chunk.event.attributes['subj-id'].replace('https://doi.org/', '')
    } else {
      doi = chunk.event.attributes['obj-id'].replace('https://doi.org/', '')
    }

    const { data } = await axios.dataciteApiDoi(`${Datacite.URL}${doi}`)

    if (data && !data.errors) {
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
      // eslint-disable-next-line no-console
      console.log(get(data, 'data.attributes.creators', []))
      chunk.datacite.affiliations = uniqBy(
        flatten(
          get(data, 'data.attributes.creators', [])
            .map(creator =>
              creator.affiliation.map(aff => ({
                name: aff.name,
                identifier: aff.affiliationIdentifier,
              })),
            )
            .filter(aff => aff.length),
        ),
        'name',
      )

      // Get funders
      chunk.datacite.funders = flatten(
        get(data, 'data.attributes.fundingReferences', []).map(funder => ({
          name: funder.funderName,
          identifier: funder.funderIdentifier,
        })),
      )
    }

    callback(null, chunk)
  }

  // eslint-disable-next-line class-methods-use-this
  async transformToAssertion(assertionInstance, chunk, trx) {
    assertionInstance.sourceId = chunk.source
    assertionInstance.title = chunk.datacite.title
    assertionInstance.sourceType = chunk.event.attributes['source-id']
    assertionInstance.id = assertionInstance.id || uuid()
    assertionInstance.relationTypeId =
      chunk.event.attributes['relation-type-id']

    assertionInstance.objId = chunk.event.attributes['obj-id']
    assertionInstance.subjId = chunk.event.attributes['subj-id']

    if (chunk.datacite.subjects) {
      const titles = chunk.datacite.subjects

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < titles.length; i++) {
        const exists = this.subjects.find(
          subj => subj.title.toLowerCase() === titles[i].toLowerCase(),
        )

        if (exists) {
          const subjectId = exists.id
          await AssertionSubject.query(trx).insert({
            assertionId: assertionInstance.id,
            subjectId,
          })
        }
      }
    }

    if (chunk.datacite.affiliations) {
      const titles = chunk.datacite.affiliations

      // eslint-disable-next-line no-console
      console.log({ affiliationTitles: titles })

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < titles.length; i++) {
        // eslint-disable-next-line no-console
        console.log(titles[i].name, 'datacite 1')

        const exists = await Affiliation.query(trx).findOne({
          title: titles[i].name,
        })

        let affiliation = null

        if (!exists) {
          affiliation = await Affiliation.query(trx)
            .insert({ title: titles[i].name, externalId: titles[i].identifier })
            .returning('*')
        }

        const affiliationId = (exists || {}).id || affiliation.id
        await AssertionAffiliation.query(trx).insert({
          assertionId: assertionInstance.id,
          affiliationId,
        })
      }
    }

    if (chunk.datacite.funders) {
      const titles = chunk.datacite.funders

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < titles.length; i++) {
        // eslint-disable-next-line no-console
        console.log(titles[i].name, 'datacite 2')

        const exists = await Funder.query(trx).findOne({
          title: titles[i].name,
        })

        let funder = null

        if (!exists) {
          funder = await Funder.query(trx)
            .insert({ title: titles[i].name, externalId: titles[i].identifier })
            .returning('*')
        }

        const funderId = (exists || {}).id || funder.id
        await AssertionFunder.query(trx).insert({
          assertionId: assertionInstance.id,
          funderId,
        })
      }
    }

    if (chunk.datacite.repository) {
      const title = chunk.datacite.repository
      // eslint-disable-next-line no-console
      console.log(title, 'datacite 3')

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

module.exports = Datacite
