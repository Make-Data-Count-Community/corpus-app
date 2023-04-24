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
  './models/citation',
  './models/affiliation',
  './models/citationAffiliation',
  './models/journal',
  './models/repository',
  './models/subject',
  './models/publisher',
  './models/funder',
  './models/citationFunder',
  './models/source',
]
