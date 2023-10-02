const { BaseModel } = require('@coko/server')

class AssertionAffiliation extends BaseModel {
  constructor(properties) {
    super(properties)
    this.type = 'assertionAffiliation'
  }

  static get tableName() {
    return 'assertions_affiliations'
  }

  static get schema() {
    return {
      properties: {
        assertionId: {
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

module.exports = AssertionAffiliation
