/* eslint-disable camelcase */
/* eslint-disable import/no-dynamic-require */
const { db } = require('@coko/server')
const { chunk } = require('lodash')

// Paths are relative to the generated migrations folder
const MetadataSource = require(`${process.cwd()}/services/metadata/metadataSource`)
const AssertionFactory = require(`${process.cwd()}/services/assertionFactory/assertionFactory`)

exports.up = async knex => {
  try {
    const metadataSource = await MetadataSource.createInstance('datacite')

    const assertions = await db('assertions')
      .whereNotIn(
        'id',
        knex.raw(
          'SELECT ass.id FROM public.assertions ass inner join assertions_subjects as2 on ass.id = as2.assertion_id',
        ),
      )
      .orderBy('created', 'desc')
      .limit(600000)
      .offset(0)
      .stream()

    let counter = 0

    // eslint-disable-next-line no-restricted-syntax
    for await (const row of assertions) {
      counter += 1

      const dataCiteDoi = row.doi

      const objId = row.objId.replace('https://doi.org/', '')

      const subj_id = row.subjId.replace('https://doi.org/', '')

      const inferringDataCiteDoi = objId === dataCiteDoi ? subj_id : objId

      metadataSource.startStreamCitations({
        event: { dataCiteDoi, inferringDataCiteDoi, counter },
        datacite: {},
        source: row.sourceId,
      })
    }

    metadataSource.startStreamCitations(null)

    const result = await metadataSource.getResult

    const bulkResult = chunk(result, 5000)

    await Promise.all(
      bulkResult.map(res =>
        AssertionFactory.saveDataToAssertionModel(res, {
          addAssertions: false,
        }),
      ),
    )
  } catch (error) {
    throw new Error(error)
  }
}
