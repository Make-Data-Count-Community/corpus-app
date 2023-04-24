const TeamMember = require('@coko/server/src/models/teamMember/teamMember.model')
const Team = require('@coko/server/src/models/team/team.model')
const Identity = require('@coko/server/src/models/identity/identity.model')
const User = require('@coko/server/src/models/user/user.model')
const ActivityLog = require('./activityLog')
const Citation = require('./citation')
const Affiliation = require('./affiliation')
const CitationAffiliation = require('./citationAffiliation')
const Funder = require('./funder')
const CitationFunder = require('./citationFunder')
const Repository = require('./repository')
const Subject = require('./subject')
const Journal = require('./journal')
const Publisher = require('./publisher')
const Sources = require('./source')

module.exports = {
  ActivityLog,
  Citation,
  Affiliation,
  CitationAffiliation,
  CitationFunder,
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
