const { Transform  } = require('stream')

const DataCite = require('./datacite')

class MetadataSource {
    constructor(streamApis) {
        this.streamApis = streamApis
        this.result = []
    }

    retrieveMetadata(data) {   
        return new Promise((resolve, reject) => {
            // Create a writable stream to capture the output of the chain of streams
            const writable = new Transform({
              objectMode: true,
              transform(chunk, encoding, callback) {
                // Push the transformed chunk into the output array
                this.result.push(chunk);
                callback();
              }
            });
      
            // Pipe the input object through the array of streams to the writable stream
            const streamPipeline = this.streamApis.reduce((acc, stream) => {
              return acc.pipe(stream);
            }, new Transform({
              objectMode: true,
              transform(chunk, encoding, callback) {
                callback(null, chunk);
              }
            })).pipe(writable);
      
            // When the pipeline finishes, resolve the Promise
            streamPipeline.on('finish', () => {
              resolve();
            });
      
            // If there is an error in the pipeline, reject the Promise
            streamPipeline.on('error', (err) => {
              reject(err);
            });
      
            // Push the input object into the beginning of the stream pipeline
            streamPipeline.write(data);
      
            // End the stream pipeline to start the data flow through the streams
            streamPipeline.end();
          });
    }

    static createInstance(sourceType) {
        this.MetadataApis = [new DataCite()]

        if (sourceType === "datacite") {
            this.MetadataApis = [new DataCite()]
        }

        return new MetadataSource(this.MetadataApis)
    }
  }

module.exports = MetadataSource