const { getRepositories } = require('../../controllers/repository.controllers')

const getRepositoryResolver = async (_, input) => {
  return getRepositories(input)
}

module.exports = {
  Query: {
    getRepositories: getRepositoryResolver,
  },
  Mutation: {},
  Repository: {},
}
