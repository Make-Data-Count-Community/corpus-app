const { BaseModel } = require('@coko/server')

class DatacitePrefix extends BaseModel {
  constructor(properties) {
    super(properties)
    this.type = 'datacitePrefix'
  }

  static get tableName() {
    return 'datacite_prefix'
  }

  static get schema() {
    return {
      properties: {
        prefix: {
          type: ['string', 'null'],
        },
      },
      type: 'object',
    }
  }
}

module.exports = DatacitePrefix
