const { BaseModel } = require('@coko/server')

class ActivityLog extends BaseModel {
  constructor(properties) {
    super(properties)
    this.type = 'activityLog'
  }

  static get tableName() {
    return 'activity_log'
  }

  static get schema() {
    return {
      properties: {
        action: {
          minLength: 1,
          type: 'string',
        },
        description: {
          minLength: 1,
          type: 'string',
        },
        data: {
          minLength: 1,
          type: 'string',
        },
        objectId: {
          format: 'uuid',
          type: ['string', 'null'],
        },
        tableName: {
          minLength: 1,
          type: 'string',
        },
        userId: {
          format: 'uuid',
          type: ['string', 'null'],
        },
        proccessed: {
          default: false,
          type: ['boolean', false],
        },
        done: {
          default: false,
          type: ['boolean', false],
        },
        cursorId: {
          type: ['Integer'],
        },
        countDoi: {
          type: ['Integer'],
        },
        countAccessionNumber: {
          type: ['Integer'],
        },
        fileKey: {
          type: 'string',
        },
      },
      required: ['action'],
      type: 'object',
    }
  }
}

module.exports = ActivityLog
