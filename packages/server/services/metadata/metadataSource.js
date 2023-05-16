const { Writable, Readable } = require('stream')

const DataCite = require('./datacite')
const Crossref = require('./crossref')

const { model: ActivityLog } = require('../../models/activityLog')

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
        write: (chunk, encoding, callback) => {
          // Push the transformed chunk into the output array
          this.result.push(chunk)
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

  static async loadCitationsFromDB() {
    const metadataApis = [new DataCite(), new Crossref()]

    const metadataSource = new MetadataSource(metadataApis)

    const citationData = await ActivityLog.query().where({ proccessed: false })

    const item = citationData[Math.floor(Math.random() * citationData.length)]

    if (item) {
      await ActivityLog.query().patchAndFetchById(item.id, { proccessed: true })
      const data = JSON.parse(item.data)
      data.forEach(citation => {
        // eslint-disable-next-line no-console
        console.log(`retrieve item ${citation.id}`)

        const assertions = {
          event: citation,
          datacite: {},
          crossref: {},
        }

        metadataSource.startStreamCitations(assertions)
      })

      metadataSource.startStreamCitations(null)

      try {
        this.result = await metadataSource.getResult
        return this.result
      } catch (e) {
        throw new Error(e)
      }
    }

    return []
  }
}

module.exports = MetadataSource
