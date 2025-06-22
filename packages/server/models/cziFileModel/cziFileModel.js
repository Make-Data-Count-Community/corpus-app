const { BaseModel } = require('@coko/server')

class CziFileModel extends BaseModel {
  constructor(properties) {
	super(properties)
	this.type = 'CziFileModel'
  }

  static get tableName() {
	return 'czi_files'
  }

  static get schema() {
	return {
	  properties: {
		file_name: {
		  type: ['string']
		},
		type: {
		  type: ['string'],
		},
		proccessed: {
		  default: false,
		  type: ['boolean', false],
		},
		done: {
		  default: false,
		  type: ['boolean', false],
		},
	  },
	  required: ['file_name', 'type'],
	  type: 'object',
	}
  }
}

module.exports = CziFileModel
