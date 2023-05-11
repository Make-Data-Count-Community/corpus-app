const { model: Repository } = require('../models/repository')

const getRepositories = async () => Repository.query()

module.exports = {
  getRepositories,
}
