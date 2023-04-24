const { BaseModel } = require('@coko/server')

class Repository extends BaseModel {
  constructor(properties) {
    super(properties)
    this.type = 'repository'
  }

  static get tableName() {
    return 'repositories'
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

module.exports = Repository
