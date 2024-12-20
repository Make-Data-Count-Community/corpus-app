const { logger } = require('@coko/server')
const fs = require('fs')
const { parse } = require('csv-parse/sync')
const SeedSource = require('../seedSource/seedSource')
const MetadataSource = require('../metadata/metadataSource')
const AssertionFactory = require('../assertionFactory/assertionFactory')

const asapFilePath = process.env.ASAP_LOCAL_FILE_PATH

const asapImport = async () => {
  try {
    logger.info('######### Start Reading ASAP files from local #########')

    if (!asapFilePath) {
      throw new Error('ASAP_LOCAL_FILE_PATH environment variable is not set.')
    }

    if (!fs.existsSync(asapFilePath)) {
      throw new Error(`ASAP file not found at path: ${asapFilePath}`)
    }

    const rawContent = fs.readFileSync(asapFilePath, 'utf8')

    const fileContent = parse(rawContent, { 
      columns: true, 
      skip_empty_lines: true,
    })

    const seedSource = await SeedSource.createInstanceFromFile(fileContent)
    const metadataSource = await MetadataSource.createInstance()

    for (const record of seedSource.data) {
      metadataSource.startStreamCitations(record)
    }

    metadataSource.startStreamCitations(null)
    const result = await metadataSource.getResult
    logger.info(`Saving ${result.length} assertions for ASAP file...`)
    logger.info(`${JSON.stringify(result, null, 2)}`)
    await AssertionFactory.saveDataToAssertionModel(result)
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = asapImport
