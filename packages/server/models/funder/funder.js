const { BaseModel } = require('@coko/server')

class Funder extends BaseModel {
  constructor(properties) {
    super(properties)
    this.type = 'funder'
  }

  static get tableName() {
    return 'funders'
  }

  static get schema() {
    return {
      properties: {
        firstName: {
          type: ['string', 'null'],
        },
        lastName: {
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

module.exports = Funder
