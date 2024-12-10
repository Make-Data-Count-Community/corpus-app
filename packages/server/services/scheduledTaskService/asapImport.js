const { db, logger } = require('@coko/server')
const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')
const SeedSource = require('../seedSource/seedSource')

const asapFilePath = process.env.ASAP_LOCAL_FILE_PATH

const asapImport = async () => {
  try {
    console.log('######### Start Reading ASAP files from local #########')

    // Ensure the file path is defined
    if (!asapFilePath) {
      throw new Error('ASAP_LOCAL_FILE_PATH environment variable is not set.')
    }

    // Ensure the file exists
    if (!fs.existsSync(asapFilePath)) {
      throw new Error(`ASAP file not found at path: ${asapFilePath}`)
    }

    // Step 1: Read and parse the CSV file into an array of records
    const rawContent = fs.readFileSync(asapFilePath, 'utf8') // Read file content
    const fileContent = parse(rawContent, { 
      columns: true,          // Parse the first row as column headers
      skip_empty_lines: true, // Ignore empty lines
    })

    // Step 2: Pass parsed data to SeedSource
    const seedSource = await SeedSource.createInstanceFromFile(fileContent)

    console.log('Processed records:', seedSource.data)

  } catch (e) {
    throw new Error(e)
  }
}

module.exports = asapImport
