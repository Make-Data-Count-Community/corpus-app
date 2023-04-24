const { BaseModel } = require('@coko/server')

class CitationAffiliation extends BaseModel {
  constructor(properties) {
    super(properties)
    this.type = 'citationAffiliation'
  }

  static get tableName() {
    return 'citations_affiliations'
  }

  static get schema() {
    return {
      properties: {
        citationId: {
          type: ['string', 'null'],
        },
        affiliationId: {
          type: ['string', 'null'],
        },
      },
      type: 'object',
    }
  }
}

module.exports = CitationAffiliation
