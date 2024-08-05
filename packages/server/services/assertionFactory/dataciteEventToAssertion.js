/* eslint-disable no-param-reassign */

class DataciteEventToAssertion {
  // eslint-disable-next-line class-methods-use-this
  async transformToAssertion(assertionInstance, chunk, trx) {
    assertionInstance.sourceType = chunk.event.attributes['source-id']
    assertionInstance.relationTypeId =
      chunk.event.attributes['relation-type-id']

    assertionInstance.objId = chunk.event.attributes['obj-id']
    assertionInstance.subjId = chunk.event.attributes['subj-id']
    assertionInstance.publication = chunk.event.attributes['obj-id']
    assertionInstance.dataset = chunk.event.attributes['subj-id']
  }
}

module.exports = DataciteEventToAssertion
