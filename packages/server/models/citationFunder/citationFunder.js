const { BaseModel } = require('@coko/server')

class CitationFunder extends BaseModel {
  constructor(properties) {
    super(properties)
    this.type = 'citationFunder'
  }

  static get tableName() {
    return 'citations_funders'
  }

  static get schema() {
    return {
      properties: {
        citationId: {
          type: ['string', 'null'],
        },
        funderId: {
          type: ['string', 'null'],
        },
      },
      type: 'object',
    }
  }
}

module.exports = CitationFunder
