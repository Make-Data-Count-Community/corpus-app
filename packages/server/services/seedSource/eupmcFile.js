/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
const { logger, uuid } = require('@coko/server')
const { parse } = require('csv-parse')
const { model: ActivityLog } = require('../../models/activityLog')
const { model: CziFileModel } = require('../../models/cziFileModel')

const ACTIVITY_LOG_DATA_SIZE = 500

class EupmcFile {
  /*
   * @param {Object[]} files - File keys and streams.
   * @param {string} files[].fileKey - The s3 path/name of the file
   * @param {string} files[].fileStream - The readstream of the file
   */
  constructor(files, sourceId) {
	this.citations = []

	this.files = files

	this.currentFileIndex = 0
	this.doiPattern = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i
	logger.info(`Found ${this.files.length} files to process`)

	this.numberOfDOI = 0
	this.numberOfNotDOI = 0
	this.doiBaseUrl = 'https://doi.org/';
	this.sourceId = sourceId
  }

  readSource() {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve, reject) => {
	  while (this.currentFileIndex < this.files.length) {
		this.citations.concat(await this.streamNextFile())
	  }

	  resolve(this.citations)
	})
  }

  async streamNextFile() {
	const citationBulk = [];
	return new Promise((resolve, reject) => {
		const { fileKey, fileStream } = this.files[this.currentFileIndex];
		logger.info(`Streaming file: ${fileKey}`);

		const parser = fileStream.pipe(parse({ columns: true, skip_empty_lines: true, trim: true }));

		parser.on('data', async (data) => {
			citationBulk.push(this.buildActivityLogRecord(data));
		});

		parser.on('end', async () => {
			logger.info(`Finished streaming file: ${fileKey}`);
			logger.info(`Citation bulk size: ${citationBulk.length}`);
			logger.info(`Number of DOI: ${this.numberOfDOI}`);
			logger.info(`Number of Not DOI: ${this.numberOfNotDOI}`);

			
			const citations = citationBulk;

			while (citations.length > 0) {
				logger.info(
				`Inserting ${ACTIVITY_LOG_DATA_SIZE} assertions at a time from ${fileKey}`,
				);

				await ActivityLog.query().insert({
					action: 'assertion_incoming_eupmc',
					data: JSON.stringify(citations.splice(0, ACTIVITY_LOG_DATA_SIZE)),
					tableName: 'assertions',
					countDoi: this.numberOfDOI,
					countAccessionNumber: this.numberOfNotDOI,
					type: 'activityLog',
					fileKey,
				});

				logger.info(`${citations.length} citations left`);
			}

			await CziFileModel.query().insert({
				type: 'eupmc',
				proccessed: true,
				file_name: fileKey
			})

			// eslint-disable-next-line no-plusplus
			this.currentFileIndex++;
			resolve(citations);
		});

		parser.on('error', (error) => {
			logger.error(`Error parsing file: ${fileKey}`, error);
			reject(error);
		});
	});
  }

  buildActivityLogRecord(result) {
	const isDatasetDoi = this.doiPattern.test(result.dataset)
	const isPublicationDoi = this.doiPattern.test(result.publication)

	if (isDatasetDoi) {
	  // eslint-disable-next-line no-plusplus
	  this.numberOfDOI++
	}else {
	  // eslint-disable-next-line no-plusplus
	  this.numberOfNotDOI++
	}

	return {
		id: uuid(),
		doi: isDatasetDoi ? result.dataset : null,
		accessionNumber: !isDatasetDoi ? result.dataset : null,
		source: this.sourceId,
		dataset: isDatasetDoi ? `${this.doiBaseUrl}${result.dataset}` : result.dataset,
		subjId: isDatasetDoi ? `${this.doiBaseUrl}${result.dataset}` : result.dataset,
		objId: result.publication,
		publication: result.publication,
		datacite: {},
		crossref: {},
		event: {
			dataCiteDoi: isDatasetDoi ? result.dataset : null,
			crossrefDoi: isPublicationDoi ? result.publication : null,
		}
	}
  }
}

module.exports = EupmcFile
