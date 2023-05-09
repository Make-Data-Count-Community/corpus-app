const TeamMember = require('@coko/server/src/models/teamMember/teamMember.model')
const Team = require('@coko/server/src/models/team/team.model')
const Identity = require('@coko/server/src/models/identity/identity.model')
const User = require('@coko/server/src/models/user/user.model')
const ActivityLog = require('./activityLog')
const assertion = require('./assertion')
const Affiliation = require('./affiliation')
const assertionAffiliation = require('./assertionAffiliation')
const Funder = require('./funder')
const assertionFunder = require('./assertionFunder')
const Repository = require('./repository')
const Subject = require('./subject')
const Journal = require('./journal')
const Publisher = require('./publisher')
const Sources = require('./source')

module.exports = {
  ActivityLog,
  assertion,
  Affiliation,
  assertionAffiliation,
  assertionFunder,
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
