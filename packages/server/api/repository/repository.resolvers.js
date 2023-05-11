const { getRepositories } = require('../../controllers/repository.controllers')

const getRepositoryResolver = async () => {
  return getRepositories()
}

module.exports = {
  Query: {
    getRepositories: getRepositoryResolver,
  },
  Mutation: {},
  Repository: {},
}
