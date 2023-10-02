const { BaseModel } = require('@coko/server')

class Journal extends BaseModel {
  constructor(properties) {
    super(properties)
    this.type = 'journal'
  }

  static get tableName() {
    return 'journals'
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

module.exports = Journal
