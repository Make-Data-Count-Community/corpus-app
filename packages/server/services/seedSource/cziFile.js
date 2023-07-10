/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
const { logger, db, uuid } = require('@coko/server')
const fs = require('fs')
const JSONStream = require('JSONStream')
const es = require('event-stream')
const { model: Source } = require('../../models/source')
const { model: ActivityLog } = require('../../models/activityLog')

const files = require('../../storage/czi')

class CziFile {
  constructor(fileStreams = null) {
    this.citations = []

    this.fileNames =
      fileStreams ||
      files.map(fileName =>
        // eslint-disable-next-line node/no-path-concat
        fs.createReadStream(`${__dirname}/../../storage/czi/${fileName}`),
      )

    this.currentFileIndex = 0
    this.doiPattern = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i
  }

  readSource() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      while (this.currentFileIndex < this.fileNames.length) {
        this.citations.concat(await this.streamNextFile())
      }

      resolve(this.citations)
    })
  }

  async streamNextFile() {
    const citationBulk = []
    return new Promise((resolve, reject) => {
      const fileName = this.fileNames[this.currentFileIndex]

      const fileStream = this.fileNames[this.currentFileIndex].pipe(
        JSONStream.parse('*'),
      )

      fileStream.pipe(
        es.mapSync(async data => {
          if (data && data.length > 0) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < data.length; i++) {
              const result = data[i]

              if (this.doiPattern.test(result.dataset)) {
                citationBulk.push({
                  id: uuid(),
                  dataCiteDoi: result.dataset,
                  crossrefDoi: result.paper_doi,
                  ...result,
                })
              } else {
                citationBulk.push({
                  id: uuid(),
                  accessionNumber: result.dataset,
                  crossrefDoi: result.paper_doi,
                  ...result,
                })
              }
            }
          }
        }),
      )

      fileStream.on('end', async () => {
        logger.info(`Finished streaming file:, ${fileName}`)

        const citations = await this.filterOutExistingCitations(citationBulk)
        await ActivityLog.query().insert({
          action: 'assertion_incoming_czi',
          data: JSON.stringify(citations),
          tableName: 'assertions',
        })
        // eslint-disable-next-line no-plusplus
        this.currentFileIndex++
        resolve(citations)
      })
    })
  }

  // eslint-disable-next-line class-methods-use-this
  async filterOutExistingCitations(data) {
    let result = []
    await db.transaction(async trx => {
      const { id } = await Source.query(trx).findOne({
        abbreviation: 'czi',
      })

      await db
        .raw(
          `CREATE TEMPORARY TABLE temp_assertions (
          id uuid,
          source_id uuid,
          obj_id text not null,
          subj_id text not null
          ) ON COMMIT DROP;
        `,
        )
        .transacting(trx)

      await db('temp_assertions')
        .insert(
          data.map(d => ({
            id: d.id,
            source_id: id,
            obj_id: d.paper_doi,
            subj_id: d.dataset,
          })),
        )
        .transacting(trx)

      const notProcessed = await db
        .raw(
          'select b.id from temp_assertions b left join assertions a on b.obj_id = a.obj_id and b.subj_id = a.subj_id where a.id is null',
        )
        .transacting(trx)

      result = result.concat(notProcessed.rows.map(np => np.id))
    })

    return data.filter(d => result.includes(d.id))
  }
}

module.exports = CziFile
