/* eslint-disable class-methods-use-this */
const XmlBase = require('../xmlBaseModel/xmlBase')

class CrossrefMetadataXml extends XmlBase {
  schema() {
    return {
      publisher: {
        path: {
          location: [
            `crossref_result query_result body query crm-item[name=publisher-name]`,
          ],
        },
        defaultValue: null,
      },
      journal: {
        path: {
          location: [
            `crossref_result query_result body query doi_record crossref journal journal_metadata full_title`,
          ],
        },
        defaultValue: null,
      },
    }
  }
}

module.exports = CrossrefMetadataXml
