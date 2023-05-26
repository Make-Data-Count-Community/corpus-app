/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
const { Transform } = require('stream')
const { uuid } = require('@coko/server')
const { flatten, get } = require('lodash')

const {
  Repository,
  // Subject,
  // AssertionSubject,
  Affiliation,
  AssertionAffiliation,
  // AssertionFunder,
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
      chunk.datacite.title = get(
        data,
        'data.attributes.titles[0].title',
        'Untitled',
      )
      chunk.datacite.subjects = flatten(
        get(data, 'data.attributes.subjects', [])
          .map(creator => creator.subject || [])
          .filter(aff => aff.length),
      )
      chunk.datacite.repository = get(data, 'data.attributes.publisher', null)
      chunk.datacite.affiliations = flatten(
        get(data, 'data.attributes.creators', [])
          .map(creator => creator.affiliation)
          .filter(aff => aff.length),
      )
      chunk.datacite.funders = flatten(
        get(data, 'data.attributes.fundingReferences', [])
          .map(funder => funder.funderName)
          .filter(fund => fund.length),
      )
    }

    callback(null, chunk)
  }

  // eslint-disable-next-line class-methods-use-this
  async transformToAssertion(
    allFunders,
    funders,
    publishers,
    journals,
    repositories,
    allSubjects,
    subjects,
    assertionInstance,
    chunk,
    trx,
  ) {
    assertionInstance.title = chunk.datacite.title
    assertionInstance.id = assertionInstance.id || uuid()
    assertionInstance.relationTypeId =
      chunk.event.attributes['relation-type-id']

    const checkValidYear = new Date(
      chunk.event.attributes['occurred-at'],
    ).getFullYear()

    assertionInstance.publishedDate = checkValidYear
      ? chunk.event.attributes['occurred-at']
      : null
    assertionInstance.objId = chunk.event.attributes['obj-id']
    assertionInstance.subjId = chunk.event.attributes['subj-id']

    // if (chunk.datacite.subjects) {
    //   const titles = chunk.datacite.subjects

    //   // eslint-disable-next-line no-plusplus
    //   for (let i = 0; i < titles.length; i++) {
    //     const exists = await Subject.query(trx).findOne({ title: titles[i] })
    //     let subject = null

    //     if (!exists) {
    //       subject = await Subject.query(trx)
    //         .insert({ title: titles[i] })
    //         .returning('*')
    //     }

    //     const subjectId = (exists || {}).id || subject.id
    //     await AssertionSubject.query(trx).insert({
    //       assertionId: assertionInstance.id,
    //       subjectId,
    //     })
    //   }
    // }

    if (chunk.datacite.subjects) {
      const titles = chunk.datacite.subjects

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < titles.length; i++) {
        const exists = allSubjects.find(
          subj => subj.title.toLowerCase() === titles[i].toLowerCase(),
        )

        if (exists) {
          const subjectId = (exists || {}).id

          if (subjectId) {
            subjects.push({
              assertionId: assertionInstance.id,
              subjectId,
            })
          }
        }
      }
    }

    if (chunk.datacite.affialiations) {
      const titles = chunk.datacite.affialiations

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < titles.length; i++) {
        const exists = await Affiliation.query(trx).findOne({
          title: titles[i],
        })

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

    // if (chunk.datacite.funders) {
    //   const titles = chunk.datacite.funders

    //   // eslint-disable-next-line no-plusplus
    //   for (let i = 0; i < titles.length; i++) {
    //     const exists = await Funder.query(trx).findOne({ title: titles[i] })
    //     let funder = null

    //     if (!exists) {
    //       funder = await Funder.query(trx)
    //         .insert({ title: titles[i] })
    //         .returning('*')
    //     }

    //     const funderId = (exists || {}).id || funder.id
    //     await AssertionFunder.query(trx).insert({
    //       assertionId: assertionInstance.id,
    //       funderId,
    //     })
    //   }
    // }

    if (chunk.datacite.funders) {
      const titles = chunk.datacite.funders

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < funders.length; i++) {
        const exists = allFunders.find(fund => fund.title === titles[i])
        let funder = null

        if (!exists) {
          funder = await Funder.query(trx)
            .insert({ title: titles[i] })
            .returning('*')
        }

        const funderId = (exists || {}).id || funder.id
        funders.push({
          assertionId: assertionInstance.id,
          funderId,
        })
      }
    }

    // if (chunk.datacite.repository) {
    //   const title = chunk.datacite.repository
    //   const exists = await Repository.query(trx).findOne({ title })
    //   let repository = exists

    //   if (!exists) {
    //     repository = await Repository.query(trx)
    //       .insert({ title })
    //       .returning('*')
    //   }

    //   assertionInstance.repositoryId = repository.id
    // }

    if (chunk.datacite.repository) {
      const title = chunk.datacite.repository
      let repository = repositories.find(subj => subj.title === title)

      if (!repository) {
        repository = await Repository.query(trx)
          .insert({ title })
          .returning('*')
      }

      assertionInstance.repositoryId = repository.id
    }
  }
}

module.exports = Datacite
