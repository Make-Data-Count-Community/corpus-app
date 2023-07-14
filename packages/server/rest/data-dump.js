/* eslint-disable no-param-reassign */
const { db, uuid } = require('@coko/server')
const StreamingService = require('../services/streamService')
const { model: AssertionSubject } = require('../models/assertionSubject')

const { model: AssertionFunder } = require('../models/assertionFunder')

const {
  model: AssertionAffiliation,
} = require('../models/assertionAffiliation')

const AwsS3Service = require('../services/awsS3Service')

module.exports = app => {
  app.get('/api/data-dump/:action', async (req, res, next) => {
    const { action } = req.params
    let fileName = null
    let query = null
    const awsService = new AwsS3Service()

    const assertionFunders = {}
    const assertionAffiliations = {}
    const assertionSubjects = {}

    const assertionFunder = await AssertionFunder.query()
      .select(['assertion_id', db.raw('array_agg(funder_id) AS grouped_array')])
      .groupBy('assertionId')

    assertionFunder.forEach(element => {
      assertionFunders[element.assertionId] = element.groupedArray
    })

    const assertionSubject = await AssertionSubject.query()
      .select([
        'assertion_id',
        db.raw('array_agg(subject_id) AS grouped_array'),
      ])
      .groupBy('assertionId')

    assertionSubject.forEach(element => {
      assertionSubjects[element.assertionId] = element.groupedArray
    })

    const assertionAffiliation = await AssertionAffiliation.query()
      .select([
        'assertion_id',
        db.raw('array_agg(affiliation_id) AS grouped_array'),
      ])
      .groupBy('assertionId')

    assertionAffiliation.forEach(element => {
      assertionAffiliations[element.assertionId] = element.groupedArray
    })

    if (action === 'all') {
      fileName = `${uuid()}-all-assertions.json`
      query = `SELECT * FROM assertions`
    } else if (action === 'last-month') {
      fileName = `${uuid()}-last-month-assertions.json`
      query = `SELECT * FROM assertions`
    }

    const stream = db
      .raw(query)
      .stream({ batchSize: 1000, highWaterMark: 10000 })

    const transformStream = StreamingService.getTransform(data => {
      data.subjects = assertionSubjects[data.id] || []
      data.affiliations = assertionAffiliation[data.id] || []
      data.funders = assertionFunders[data.id] || []
      return data
    })

    stream.pipe(transformStream)

    awsService.uploadS3File('exported-data-files', fileName, transformStream)
    // transformStream.pipe(writableStream)

    // Handle stream events as needed
    // writableStream.on('finish', () => {
    //   // eslint-disable-next-line no-console
    //   console.log('Export completed successfully.')
    // })

    // writableStream.on('error', error => {
    //   console.error('Export failed:', error)
    // })

    res.status(202).json({
      message: 'Your request has been accepted and is being processed.',
      status_uri: fileName,
    })
  })

  app.get('/api/data-dump/:filename', async (req, res, next) => {})
}
