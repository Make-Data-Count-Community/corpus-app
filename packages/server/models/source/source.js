const { BaseModel } = require('@coko/server')

class Source extends BaseModel {
  constructor(properties) {
    super(properties)
    this.type = 'source'
  }

  static get tableName() {
    return 'sources'
  }

  static get schema() {
    return {
      properties: {
        title: {
          type: ['string', 'null'],
        },
        abbreviation: {
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

module.exports = Source
