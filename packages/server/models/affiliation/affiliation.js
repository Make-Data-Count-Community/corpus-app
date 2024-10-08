const { BaseModel } = require('@coko/server')

class Affiliation extends BaseModel {
  constructor(properties) {
    super(properties)
    this.type = 'affiliation'
  }

  static get tableName() {
    return 'affiliations'
  }

  static get schema() {
    return {
      properties: {
        title: {
          type: ['string', 'null'],
        },
        externalId: {
          type: ['string', 'null'],
        },
        doiCount: {
          type: 'number',
        },
        accessionNumberCount: {
          type: 'number',
        },
      },
      type: 'object',
    }
  }
}

module.exports = Affiliation
