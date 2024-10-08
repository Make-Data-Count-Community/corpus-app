const { BaseModel } = require('@coko/server')

class Publisher extends BaseModel {
  constructor(properties) {
    super(properties)
    this.type = 'publisher'
  }

  static get tableName() {
    return 'publishers'
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

module.exports = Publisher
