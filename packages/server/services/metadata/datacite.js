/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
const { Transform } = require('stream')
const { uuid } = require('@coko/server')
const { flatten } = require('lodash')

const {
  Repository,
  Subject,
  AssertionSubject,
  Affiliation,
  AssertionAffiliation,
  AssertionFunder,
  Funder,
} = require('@pubsweet/models')

const axios = require('../axiosService')

class Datacite extends Transform {
  static URL = '/dois/'
  constructor(_obj) {
    super({ objectMode: true })
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

    const { data } = await axios.dataciteApi(`${Datacite.URL}${doi}`)

    if (data && !data.errors) {
      chunk.datacite.title = data.data.attributes.titles[0].title
      chunk.datacite.subjects = flatten(
        data.data.attributes.subjects
          .map(creator => creator.subject || [])
          .filter(aff => aff.length),
      )
      chunk.datacite.repository = data.data.attributes.publisher
      chunk.datacite.affiliations = flatten(
        data.data.attributes.creators
          .map(creator => creator.affiliation)
          .filter(aff => aff.length),
      )
      chunk.datacite.funders = data.data.attributes.fundingReference
    }

    callback(null, chunk)
  }

  // eslint-disable-next-line class-methods-use-this
  async transformToAssertion(assertionInstance, chunk, trx) {
    assertionInstance.title = chunk.datacite.title
    assertionInstance.id = assertionInstance.id || uuid()
    assertionInstance.publishedDate = chunk.event.attributes['occurred-at']
    assertionInstance.objId = chunk.event.attributes['obj-id']
    assertionInstance.subjId = chunk.event.attributes['subj-id']

    if (chunk.datacite.subjects) {
      const titles = chunk.datacite.subjects

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < titles.length; i++) {
        const exists = await Subject.query().findOne({ title: titles[i] })
        let subject = null

        if (!exists) {
          subject = await Subject.query(trx)
            .insert({ title: titles[i] })
            .returning('*')
        }

        const subjectId = (exists || {}).id || subject.id
        await AssertionSubject.query(trx).insert({
          assertionId: assertionInstance.id,
          subjectId,
        })
      }
    }

    if (chunk.datacite.affialiations) {
      const titles = chunk.datacite.affialiations

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < titles.length; i++) {
        const exists = await Affiliation.query().findOne({ title: titles[i] })
        let affiliation = null

        if (!exists) {
          affiliation = await Affiliation.query(trx)
            .insert({ title: titles[i] })
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
        const exists = await Funder.query().findOne({ title: titles[i] })
        let funder = null

        if (!exists) {
          funder = await Funder.query(trx)
            .insert({ title: titles[i] })
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
      const exists = await Repository.query().findOne({ title })
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
