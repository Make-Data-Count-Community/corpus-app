const { Transform } = require('stream')

class StreamingService {
  static getOptions = (outStream, overrides = {}) => {
    const defaults = {
      preHook: () => {
        StreamingService.writeHead(outStream, 200)
      },
      errorHook: () => {
        StreamingService.writeHead(outStream, 500)
      },
      errorHandler: error => {
        if (!error) return
        const { stack, message } = error
        console.error({ error: { ...error, stack, message } })
      },
    }

    return Object.assign(defaults, overrides)
  }

  static writeHead = (res, status = 200) => {
    if (typeof res.headersSent === 'boolean' && !res.headersSent) {
      res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      })
    }
  }

  static getTransform = preHook => {
    return new Transform({
      writableObjectMode: true,
      // eslint-disable-next-line default-param-last
      transform(data = {}, encoding, callback) {
        // eslint-disable-next-line no-param-reassign
        data = preHook(data)
        // if (!this.comma) preHook();
        // if first data && error then no open/close brackets
        const prefix = this.comma || (data.error ? '' : '[')
        const suffix = this.comma && data.error ? ']' : ''
        this.push(`${prefix}${JSON.stringify(data)}${suffix}`)
        // set comma for subsequent data
        if (!this.comma) this.comma = ',\n'
        callback()
      },
      final(callback) {
        if (!this.comma) this.push('[')
        this.push(']')
        callback()
      },
    })
  }
}

module.exports = StreamingService
