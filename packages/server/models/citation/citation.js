/* eslint-disable global-require */
const { BaseModel } = require('@coko/server')
const { Model } = require('objection')

class Citation extends BaseModel {
  constructor(properties) {
    super(properties)
    this.type = 'citation'
  }

  static get tableName() {
    return 'citations'
  }

  static get relationMappings() {
    const { model: Affiliation } = require('../affiliation')
    const { model: Repository } = require('../repository')
    const { model: Subject } = require('../subject')
    const { model: Journal } = require('../journal')

    return {
      affiliations: {
        relation: Model.ManyToManyRelation,
        modelClass: Affiliation,
        join: {
          from: 'citations.id',
          through: {
            from: 'citations_affiliations.citationId',
            to: 'citations_affiliations.affiliationId',
          },
          to: 'affiliations.id',
        },
      },
      repository: {
        relation: Model.BelongsToOneRelation,
        modelClass: Repository,
        join: {
          from: 'citations.repositoryId',
          to: 'repositories.id',
        },
      },
      subject: {
        relation: Model.BelongsToOneRelation,
        modelClass: Subject,
        join: {
          from: 'citations.subjectId',
          to: 'subjects.id',
        },
      },
      journal: {
        relation: Model.BelongsToOneRelation,
        modelClass: Journal,
        join: {
          from: 'citations.journalId',
          to: 'journals.id',
        },
      },
    }
  }

  static get schema() {
    return {
      properties: {
        title: {
          type: ['string', 'null'],
        },
        accessionNumber: {
          type: ['string', 'null'],
        },
        doi: {
          type: ['string', 'null'],
        },
        repositoryId: {
          type: 'string',
          format: 'uuid',
        },
        subjectId: {
          type: 'string',
          format: 'uuid',
        },
        journalId: {
          type: 'string',
          format: 'uuid',
        },
        publisherId: {
          type: 'string',
          format: 'uuid',
        },
      },
      type: 'object',
    }
  }
}

module.exports = Citation
