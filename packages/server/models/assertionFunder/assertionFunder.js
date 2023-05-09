const { BaseModel } = require('@coko/server')

class assertionFunder extends BaseModel {
  constructor(properties) {
    super(properties)
    this.type = 'assertionFunder'
  }

  static get tableName() {
    return 'assertions_funders'
  }

  static get schema() {
    return {
      properties: {
        assertionId: {
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

module.exports = assertionFunder
