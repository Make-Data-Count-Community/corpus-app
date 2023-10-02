/* eslint-disable global-require */
const Assertion = require('../assertion/assertion')

class AssertionLastTenYear extends Assertion {
  constructor(properties) {
    super(properties)
    this.type = 'assertion'
  }

  static get tableName() {
    return 'last_10_years_assertions'
  }

  static get schema() {
    const properties = Assertion.schema
    return {
      properties: {
        ...properties,
        year: {
          type: 'number',
        },
      },
    }
  }
}

module.exports = AssertionLastTenYear
