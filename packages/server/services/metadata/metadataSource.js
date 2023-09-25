const { Writable, Readable } = require('stream')
const DataCite = require('./datacite')
const Crossref = require('./crossref')

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
          // Push the transformed chunks into the output array
          // some chunks may be excluded from the result array
          // eslint-disable-next-line no-console
          if (!chunk.excluded) {
            this.result.push(chunk)
            callback()
          } else {
            callback()
          }
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
        // eslint-disable-next-line no-console
        console.log(`Error ${err}`)
        reject(err)
      })
    })
  }

  startStreamCitations(data) {
    this.readable.push(data)
  }

  static async createInstance(sourceType) {
    let metadataApis = [new DataCite(), new Crossref()]

    if (sourceType === 'datacite') {
      metadataApis = [new DataCite()]
    }

    return new MetadataSource(metadataApis)
  }
}

module.exports = MetadataSource
