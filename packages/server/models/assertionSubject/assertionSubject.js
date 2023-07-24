const { BaseModel } = require('@coko/server')

class AssertionSubject extends BaseModel {
  constructor(properties) {
    super(properties)
    this.type = 'assertionSubject'
  }

  static get tableName() {
    return 'assertions_subjects'
  }

  static get schema() {
    return {
      properties: {
        assertionId: {
          type: ['string', 'null'],
        },
        subjectId: {
          type: ['string', 'null'],
        },
        inferred: {
          default: false,
          type: ['boolean', false],
        },
      },
      type: 'object',
    }
  }
}

module.exports = AssertionSubject
