module.exports = [
  // models from coko server
  '@coko/server/src/models/user',
  '@coko/server/src/models/identity',
  '@coko/server/src/models/team',
  '@coko/server/src/models/teamMember',
  // '@coko/server/src/models/file',

  // local models
  './api', // graphql
  './rest',

  // models
  './models/activityLog',
  './models/assertion',
  './models/assertionLastTenYear',
  './models/affiliation',
  './models/assertionAffiliation',
  './models/journal',
  './models/repository',
  './models/subject',
  './models/assertionSubject',
  './models/publisher',
  './models/funder',
  './models/assertionFunder',
  './models/source',
  './models/datacitePrefix',
]
