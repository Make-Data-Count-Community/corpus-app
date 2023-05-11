const { model: Subject } = require('../models/subject')

const getSubjects = async () => Subject.query()

module.exports = {
  getSubjects,
}
