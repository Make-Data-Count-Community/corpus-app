/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable import/no-dynamic-require */
const { db } = require('@coko/server')
const { flatten, get } = require('lodash')

// Paths are relative to the generated migrations folder
// const MetadataSource = require(`${process.cwd()}/services/metadata/metadataSource`)
// const AssertionFactory = require(`${process.cwd()}/services/assertionFactory/assertionFactory`)
const axios = require(`${process.cwd()}/services/axiosService`)
const Subject = require(`${process.cwd()}/models/subject/subject`)
const AssertionSubject = require(`${process.cwd()}/models/assertionSubject/assertionSubject`)

exports.up = async knex => {
  try {
    const subjects = await Subject.query()

    const assertions = await db('assertions')
      .whereNotIn(
        'id',
        knex.raw(
          'SELECT ass.id FROM public.assertions ass inner join assertions_subjects as2 on ass.id = as2.assertion_id',
        ),
      )
      .limit(320000)
      .offset(parseInt(process.env.START_QUERY, 10))
      .orderBy('created', 'desc')
      .stream()

    let counter = 0
    let counterApi = 0
    let queryCounts = 0
    let counterApiFailed = 0
    const ass = {}

    // eslint-disable-next-line no-restricted-syntax
    for await (const row of assertions) {
      console.log(counter)
      const dataCiteDoi = row.doi

      const objId = row.objId.replace('https://doi.org/', '')

      const subj_id = row.subjId.replace('https://doi.org/', '')

      const inferringDataCiteDoi = objId === dataCiteDoi ? subj_id : objId

      const { data } = await axios.dataciteApiDoi(
        `/dois/${inferringDataCiteDoi}`,
      )

      if (data && !data.errors) {
        counterApi += 1

        ass[row.id] = flatten(
          get(data, 'data.attributes.subjects', [])
            .map(creator => creator.subject || [])
            .filter(aff => aff.length),
        )
      } else {
        counterApiFailed += 1
      }

      if (ass[row.id]) {
        const titles = ass[row.id]

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < titles.length; i++) {
          const exists = subjects.find(
            subj => subj.title.toLowerCase() === titles[i].toLowerCase(),
          )

          if (exists) {
            queryCounts += 1
            const subjectId = exists.id
            // eslint-disable-next-line no-await-in-loop
            await AssertionSubject.query()
              .insert({
                assertionId: row.id,
                subjectId,
              })
              .debug()
          }
        }
      }

      counter += 1
    }

    console.log({ counter, queryCounts, counterApi, counterApiFailed })
  } catch (error) {
    throw new Error(error)
  }
}
