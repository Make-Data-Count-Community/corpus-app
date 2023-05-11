const { model: Publisher } = require('../models/publisher')

const getPublishers = async () => Publisher.query()

module.exports = {
  getPublishers,
}
