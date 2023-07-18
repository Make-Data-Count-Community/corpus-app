/* eslint-disable no-param-reassign */
const fs = require('fs')
const { db, uuid, logger } = require('@coko/server')
const Seven = require('node-7z')
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
    const tempJsonPath = '/tmp/data-dump.json'
    const tempFilePath = '/tmp/data-dump.zip'
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
      fileName = `${uuid()}-all-assertions.zip`
      query = `SELECT * FROM assertions`
    } else if (action === 'last-month') {
      fileName = `${uuid()}-last-month-assertions.zip`
      query = `SELECT * FROM assertions where created >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'`
    }

    const transformStream = StreamingService.getTransform(
      data => {
        data.subjects = assertionSubjects[data.id] || []
        data.affiliations = assertionAffiliation[data.id] || []
        data.funders = assertionFunders[data.id] || []
        return data
      },
      () => {},
    )

    const writeStream = fs.createWriteStream(tempJsonPath)

    const stream = db
      .raw(query)
      .stream({ batchSize: 1000, highWaterMark: 10000 })

    stream.pipe(transformStream)

    transformStream.pipe(writeStream)

    writeStream.on('finish', () => {
      const myStream = Seven.add(tempFilePath, tempJsonPath)

      myStream.on('end', async () => {
        const outputStream = fs.createReadStream(tempFilePath)
        await awsService.uploadS3File(
          'exported-data-files',
          fileName,
          outputStream,
        )

        fs.unlink(tempFilePath, error => {
          if (error) {
            logger.error(
              'An error occurred while deleting the temporary file:',
              error,
            )
          }
        })
        fs.unlink(tempJsonPath, error => {
          if (error) {
            logger.error(
              'An error occurred while deleting the temporary file:',
              error,
            )
          }
        })
        logger.info('File compressed successfully.')
      })

      myStream.on('error', error => {
        logger.error('Zipping File failed', error)
      })
    })

    res.status(202).json({
      message: 'Your request has been accepted and is being processed.',
      status_uri: fileName,
    })
  })

  app.get('/api/data-dump/get/:filename', async (req, res, next) => {
    const { filename } = req.params
    const awsService = new AwsS3Service()

    try {
      const data = await awsService.getS3File('exported-data-files', filename)

      const fileStream = StreamingService.bufferToStream(data.Body)

      logger.info(`Got S3 object : ${JSON.stringify(data)}`)
      res.set({
        'Content-Type': data.ContentType,
        'Content-Length': data.ContentLength,
        'Content-Disposition': `attachment; filename=${filename}`,
      })

      fileStream.pipe(res)
    } catch (e) {
      logger.error(e)
      res.status(500).send(`Error retrieving File: ${filename}`)
    }
  })
}
