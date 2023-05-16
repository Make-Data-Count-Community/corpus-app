const axios = require('axios')

// const { logger } = require('@coko/server')

/**
 * Create an Axios Client with baseURL as default
 */

const request = async ({ clientOptions, ...options }) => {
  const client = axios.create(clientOptions)

  const onSuccess = response => {
    // logger.info('Request successful:', response)
    return response
  }

  const onError = error => {
    // logger.error(error.response)
    // logger.error('Request failed:', error.config)

    if (error.response) {
      // logger.error('Status:', error.response.status)
      // logger.error('Data:', error.response.data)
      // logger.error('Headers:', error.response.headers)
    } else {
      // log message if it wasn't based on the response
      // logger.error('Error Message:', error.message)
    }

    return error.response || error.message
  }

  const response = await client(options).then(onSuccess).catch(onError)

  return response
}

module.exports = request
