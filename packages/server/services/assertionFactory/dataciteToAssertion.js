/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
const { uuid } = require('@coko/server')

const {
  // Repository,
  AssertionSubject,
  // Affiliation,
  // AssertionAffiliation,
  // AssertionFunder,
  // Funder,
} = require('@pubsweet/models')

const AssertionHelpers = require('./assertionHelpers')

class DataciteToAssertion extends AssertionHelpers {
  async transformToAssertion(assertionInstance, chunk, trx) {
    assertionInstance.sourceId = chunk.source
    assertionInstance.title = chunk.datacite.title
    assertionInstance.id = assertionInstance.id || uuid()

    if (chunk.datacite.subjects) {
      const titles = chunk.datacite.subjects

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < titles.length; i++) {
        const exists = this.subjects.find(
          subj => subj.title.toLowerCase() === titles[i].toLowerCase(),
        )

        if (exists) {
          const subjectId = exists.id
          await AssertionSubject.query(trx)
            .insert({
              assertionId: assertionInstance.id,
              subjectId,
            })
            .debug()
        }
      }
    }

    // if (chunk.datacite.affiliations) {
    //   const titles = chunk.datacite.affiliations

    //   // eslint-disable-next-line no-plusplus
    //   for (let i = 0; i < titles.length; i++) {
    //     const exists = await Affiliation.query(trx).findOne({
    //       title: titles[i].name,
    //     })

    //     let affiliation = null

    //     if (!exists) {
    //       affiliation = await Affiliation.query(trx)
    //         .insert({ title: titles[i].name, externalId: titles[i].identifier })
    //         .returning('*')
    //     }

    //     const affiliationId = (exists || {}).id || affiliation.id
    //     await AssertionAffiliation.query(trx).insert({
    //       assertionId: assertionInstance.id,
    //       affiliationId,
    //     })
    //   }
    // }

    // if (chunk.datacite.funders) {
    //   const titles = chunk.datacite.funders

    //   // eslint-disable-next-line no-plusplus
    //   for (let i = 0; i < titles.length; i++) {
    //     const exists = await Funder.query(trx).findOne({
    //       title: titles[i].name,
    //     })

    //     let funder = null

    //     if (!exists) {
    //       funder = await Funder.query(trx)
    //         .insert({ title: titles[i].name, externalId: titles[i].identifier })
    //         .returning('*')
    //     }

    //     const funderId = (exists || {}).id || funder.id
    //     await AssertionFunder.query(trx).insert({
    //       assertionId: assertionInstance.id,
    //       funderId,
    //     })
    //   }
    // }

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
  }
}

module.exports = DataciteToAssertion
