const { getPublishers } = require('../../controllers/publisher.controllers')

const getPublisherResolver = async (_, input) => {
  return getPublishers(input)
}

module.exports = {
  Query: {
    getPublishers: getPublisherResolver,
  },
  Mutation: {},
  Publisher: {},
}
