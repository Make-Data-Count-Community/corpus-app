/* eslint-disable class-methods-use-this */
const { parseString } = require('xml2js')
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
      publishedDate: {
        path: {
          location: [
            `crossref_result query_result body query doi_record crossref journal journal_article publication_date[media_type=print]`,
          ],
        },
        defaultValue: null,
      },
    }
  }

  publishedDate(date) {
    if (!date) return Promise.resolve(null)
    return new Promise(resolve => {
      parseString(
        `<date>${date}</date>`,
        { explicitArray: false, trim: true },
        (_err, value) => {
          let {
            date: { year = null, month = 1, day = 1 },
          } = value

          month = parseInt(month, 10) > 0 && parseInt(month, 10) < 13
          day = parseInt(day, 10) > 0 && parseInt(day, 10) < 32

          const dt = [year, month, day].filter(d => d !== null).join('-')

          const checkValidYear = new Date(dt).getFullYear()

          resolve(checkValidYear ? dt : null)
        },
      )
    })
  }
}

module.exports = CrossrefMetadataXml
