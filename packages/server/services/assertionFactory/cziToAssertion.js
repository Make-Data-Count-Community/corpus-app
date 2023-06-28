/* eslint-disable no-param-reassign */
const { uuid } = require('@coko/server')

class CziToAssertion {
  // eslint-disable-next-line class-methods-use-this
  async transformToAssertion(assertionInstance, chunk, trx) {
    assertionInstance.id = assertionInstance.id || uuid()
    assertionInstance.objId = chunk.event.paper_doi
    assertionInstance.subjId = chunk.event.dataset

    assertionInstance.accessionNumber = chunk.event.accessionNumber
      ? chunk.event.accessionNumber
      : null
    assertionInstance.doi = chunk.event.dataCiteDoi
      ? chunk.event.dataCiteDoi
      : null
  }
}

module.exports = CziToAssertion
