const TeamMember = require('@coko/server/src/models/teamMember/teamMember.model')
const Team = require('@coko/server/src/models/team/team.model')
const Identity = require('@coko/server/src/models/identity/identity.model')
const User = require('@coko/server/src/models/user/user.model')
const ActivityLog = require('./activityLog')
const Assertion = require('./assertion')
const AssertionLastTenYear = require('./assertionLastTenYear')
const Affiliation = require('./affiliation')
const AssertionAffiliation = require('./assertionAffiliation')
const Funder = require('./funder')
const AssertionFunder = require('./assertionFunder')
const AssertionSubject = require('./assertionSubject')
const Repository = require('./repository')
const Subject = require('./subject')
const Journal = require('./journal')
const Publisher = require('./publisher')
const Sources = require('./source')

module.exports = {
  ActivityLog,
  Assertion,
  AssertionLastTenYear,
  Affiliation,
  AssertionAffiliation,
  AssertionFunder,
  AssertionSubject,
  Funder,
  Team,
  TeamMember,
  User,
  Identity,
  Repository,
  Subject,
  Journal,
  Publisher,
  Sources,
}
