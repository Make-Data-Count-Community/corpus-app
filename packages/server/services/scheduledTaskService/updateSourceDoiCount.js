/* eslint-disable no-await-in-loop */
const { logger, db } = require('@coko/server')
const Source = require('../../models/source/source')
const Assertion = require('../../models/assertion/assertion')

/**
 * Update doi count in sources table
 */
const updateSourceDoiCount = async () => {

    logger.info(`######### Updating source doi counts ######### `)
    const sourceAssertions = await Assertion.query()
        .select(
        db.raw(
            'count(doi) as doicnt, count(accession_number) as doiaccessionnumer, source_id',
        ),
        )
        .groupBy('source_id')

    await Promise.all(
        sourceAssertions.map(assertion =>
        Source.query()
            .findOne({ id: assertion.sourceId })
            .patch({
            doiCount: assertion.doicnt ? parseInt(assertion.doicnt, 10) : 0,
            accessionNumberCount: assertion.doiaccessionnumer
                ? parseInt(assertion.doiaccessionnumer, 10)
                : 0,
            }),
        ),
    )

}

module.exports = updateSourceDoiCount