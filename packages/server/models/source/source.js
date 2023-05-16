const { BaseModel } = require('@coko/server')

class Source extends BaseModel {
  constructor(properties) {
    super(properties)
    this.type = 'subject'
  }

  static get tableName() {
    return 'subjects'
  }

  static get schema() {
    return {
      properties: {
        title: {
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
