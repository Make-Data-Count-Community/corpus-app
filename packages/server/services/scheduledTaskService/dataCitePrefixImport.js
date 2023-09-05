/* eslint-disable no-await-in-loop */
const { logger } = require('@coko/server')
const DataCitePrefixData = require('../seedSource/dataCitePrefixData')

/**
 * This paginates through all prefixes in dataCite API and saves
 * them to a local file
 */
const dataCitePrefixImport = async () => {

    logger.info(`######### Importing dataCite prefixes ######### `)

    const dataCitePrefixData = new DataCitePrefixData()

    dataCitePrefixData.importPrefixesToDB()

    logger.info(`######### prefixes imported ######### `)
}

module.exports = dataCitePrefixImport