/* eslint-disable no-param-reassign */
const { uuid } = require('@coko/server')
const { LABEL_REPOSITORY_MAPPING } = require('../../constants')
const {
  Repository,
} = require('@pubsweet/models')

class CziToAssertion {
  // eslint-disable-next-line class-methods-use-this
  async transformToAssertion(assertionInstance, chunk, trx) {
    console.log("CZI to Assertion")
    assertionInstance.id = assertionInstance.id || uuid()
    assertionInstance.objId = chunk.event.paper_doi || chunk.event.doi || 'none'
    assertionInstance.subjId = chunk.event.dataset || chunk.event.extracted_word || 'none'

    assertionInstance.accessionNumber = chunk.event.accessionNumber
      ? chunk.event.accessionNumber
      : null
    assertionInstance.doi = chunk.event.dataCiteDoi
      ? chunk.event.dataCiteDoi
      : null

    //CZI files provide a label field that we can manually map to a repository 
    if (chunk.event.label) {
      const repositoryAbbr = chunk.event.label.split('-').slice(-1)
      const mappedRepo = LABEL_REPOSITORY_MAPPING[repositoryAbbr]
      
      if(mappedRepo) {
        console.log(`Found repo for ${repositoryAbbr} - ${mappedRepo}`)
        const exists = await Repository.query(trx).findOne({ title: mappedRepo })
        let repository = exists
  
        if (!exists) {
          repository = await Repository.query(trx)
            .insert({ title: mappedRepo })
            .returning('*')
        }
        assertionInstance.repositoryId = repository.id
      }
    }
  }
}

module.exports = CziToAssertion
