/* eslint-disable global-require */
const { BaseModel } = require('@coko/server')
const { Model } = require('objection')

class Assertion extends BaseModel {
  constructor(properties) {
    super(properties)
    this.type = 'assertion'
  }

  static get tableName() {
    return 'assertions'
  }

  static get relationMappings() {
    const { model: Affiliation } = require('../affiliation')
    const { model: Repository } = require('../repository')
    const { model: Subject } = require('../subject')
    const { model: Source } = require('../source')
    const { model: Journal } = require('../journal')
    const { model: Funder } = require('../funder')

    return {
      affiliations: {
        relation: Model.ManyToManyRelation,
        modelClass: Affiliation,
        join: {
          from: 'assertions.id',
          through: {
            from: 'assertions_affiliations.assertionId',
            to: 'assertions_affiliations.affiliationId',
          },
          to: 'affiliations.id',
        },
      },
      funders: {
        relation: Model.ManyToManyRelation,
        modelClass: Funder,
        join: {
          from: 'assertions.id',
          through: {
            from: 'assertions_funders.assertionId',
            to: 'assertions_funders.funderId',
          },
          to: 'funders.id',
        },
      },
      subjects: {
        relation: Model.ManyToManyRelation,
        modelClass: Subject,
        join: {
          from: 'assertions.id',
          through: {
            from: 'assertions_subjects.assertionId',
            to: 'assertions_subjects.subjectId',
          },
          to: 'subjects.id',
        },
      },
      repository: {
        relation: Model.BelongsToOneRelation,
        modelClass: Repository,
        join: {
          from: 'assertions.repositoryId',
          to: 'repositories.id',
        },
      },
      journal: {
        relation: Model.BelongsToOneRelation,
        modelClass: Journal,
        join: {
          from: 'assertions.journalId',
          to: 'journals.id',
        },
      },
      sourceType: {
        relation: Model.BelongsToOneRelation,
        modelClass: Source,
        join: {
          from: 'assertions.sourceType',
          to: 'sources.id',
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
        objId: {
          type: ['string', 'null'],
        },
        subjId: {
          type: ['string', 'null'],
        },
        relationTypeId: {
          type: ['string', 'null'],
        },
        publishedDate: {
          type: ['string', 'null'],
        },
        repositoryId: {
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

module.exports = Assertion
