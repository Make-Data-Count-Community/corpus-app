const { Transform  } = require('stream')

class Datacite extends Transform  {
  constructor(obj) {
    super({ objectMode: true })
  }

  // eslint-disable-next-line class-methods-use-this
  transform(chunk, encoding, callback) {
    // Perform some operation on the chunk
    // eslint-disable-next-line no-console
    console.log({ chunk });
    callback(null, chunk);
  }

}
  

module.exports = Datacite