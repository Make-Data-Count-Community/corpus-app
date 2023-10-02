const dataDump = require('./data-dump')

module.exports = {
  server: () => app => dataDump(app),
}
