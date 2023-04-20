const { Transform  } = require('stream')

class Datacite extends Transform  {
  constructor(obj) {
    super({ objectMode: true })
  }

  // eslint-disable-next-line class-methods-use-this
  transform(chunk, encoding, callback) {
    // Perform some operation on the chunk
    // eslint-disable-next-line no-param-reassign
    chunk.property1 = chunk.property1.toUpperCase();
    callback(null, chunk);
  }

}
  

module.exports = Datacite