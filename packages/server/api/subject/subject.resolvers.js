const { getSubjects } = require('../../controllers/subject.controllers')

const getSubjectResolver = async (_, input) => {
  return getSubjects(input)
}

module.exports = {
  Query: {
    getSubjects: getSubjectResolver,
  },
  Mutation: {},
  Subject: {},
}
