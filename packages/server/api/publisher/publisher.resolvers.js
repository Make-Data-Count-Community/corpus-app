const { getPublishers } = require('../../controllers/publisher.controllers')

const getPublisherResolver = async () => {
  return getPublishers()
}

module.exports = {
  Query: {
    getPublishers: getPublisherResolver,
  },
  Mutation: {},
  Publisher: {},
}
