const { getSubjects } = require('../../controllers/subject.controllers')

const getSubjectResolver = async () => {
  return getSubjects()
}

module.exports = {
  Query: {
    getSubjects: getSubjectResolver,
  },
  Mutation: {},
  Subject: {},
}
