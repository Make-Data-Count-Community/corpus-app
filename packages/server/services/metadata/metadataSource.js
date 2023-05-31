const { Writable, Readable } = require('stream')
const { chunk } = require('lodash')

const { useTransaction } = require('@coko/server')
const DataCite = require('./datacite')
const Crossref = require('./crossref')

const { model: ActivityLog } = require('../../models/activityLog')
const { model: Assertion } = require('../../models/assertion')
const { model: Subject } = require('../../models/subject')

class MetadataSource {
  constructor(streamApis) {
    this.readable = new Readable({
      objectMode: true,
      read: () => {},
    })

    this.streamApis = streamApis

    this.result = []

    this.getResult = this.setupStreams(streamApis)
  }

  setupStreams() {
    // Create a writable stream to capture the output of the chain of streams
    return new Promise((resolve, reject) => {
      const writable = new Writable({
        objectMode: true,
        write: (chunks, encoding, callback) => {
          // Push the transformed chunks into the output array
          this.result.push(chunks)
          callback()
        },
      })

      // Pipe the input object through the array of streams to the writable stream
      const streamPipeline = this.streamApis
        .reduce((acc, stream) => {
          return acc.pipe(stream)
        }, this.readable)
        .pipe(writable)

      // When the pipeline finishes, resolve the Promise
      streamPipeline.on('finish', () => {
        resolve(this.result)
      })

      // If there is an error in the pipeline, reject the Promise
      streamPipeline.on('error', err => {
        reject(err)
      })
    })
  }

  startStreamCitations(data) {
    this.readable.push(data)
  }

  static createInstance(sourceType) {
    let metadataApis = [new DataCite(), new Crossref()]

    if (sourceType === 'datacite') {
      metadataApis = [new DataCite()]
    }

    return new MetadataSource(metadataApis)
  }

  static async loadCitationsFromDB(selected) {
    // eslint-disable-next-line no-console
    console.log({ selected })
    const subjects = await Subject.query()

    const metadataApis = [new DataCite(subjects), new Crossref()]

    const metadataSource = new MetadataSource(metadataApis)

    const citationData = await ActivityLog.query()
      .select('id')
      .where({ proccessed: false })
      .andWhere(builder => {
        builder.whereBetween('cursorId', [selected.start, selected.end])
      })

    const item = citationData[Math.floor(Math.random() * citationData.length)]

    if (item) {
      const res = await ActivityLog.query().patchAndFetchById(item.id, {
        proccessed: true,
      })

      const data = JSON.parse(res.data)
      // eslint-disable-next-line no-console
      data.forEach(citation => {
        const assertions = {
          event: citation,
          datacite: {},
          crossref: {},
        }

        metadataSource.startStreamCitations(assertions)
      })

      metadataSource.startStreamCitations(null)

      try {
        const result = await metadataSource.getResult
        useTransaction(async trx => {
          // eslint-disable-next-line no-unused-vars
          const assertions = []

          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < result.length; i++) {
            const assertion = {}
            const chunks = result[i]
            // eslint-disable-next-line no-await-in-loop
            await Promise.all(
              metadataSource.streamApis.map(api =>
                api.transformToAssertion(assertion, chunks, trx),
              ),
            )
            assertion.activityId = item.id
            assertions.push(assertion)
          }

          const assertionsArray = chunk(assertions, 5000)

          await Promise.all(
            assertionsArray.map(assert => Assertion.query(trx).insert(assert)),
          )

          await ActivityLog.query(trx).findById(item.id).patch({ done: true })
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`failed at ${item.id} $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$`)
        throw new Error(e)
      }
    }

    return []
  }
}

module.exports = MetadataSource
