/* eslint-disable handle-callback-err */
const cheerio = require('cheerio')

const isArray = require('lodash/isArray')
const isString = require('lodash/isString')
const fs = require('fs')
const decoder = require('html-entities')
const { isEmpty } = require('lodash')

class XmlBase {
  constructor(path, options) {
    this.path = path
    this.cheerio = cheerio
    this.options = options || {}
    // eslint-disable-next-line no-constructor-return
    if (path) return this.parseXml()
  }

  parseXml() {
    const { path } = this

    if (fs.existsSync(path)) {
      fs.readFile(path, (_err, data) => {
        this.xmlObject = cheerio.load(data, {
          xmlMode: true,
          decodeEntities: false,
          xml: {
            decodeEntities: false,
          },
        })

        this.root = this.xmlObject('*').get(0)
          ? this.xmlObject('*').get(0).tagName
          : this.xmlObject('*').get(0)

        this.loadFromSchema()

        return this.model
      })
    } else {
      this.xmlObject = cheerio.load(path, {
        xmlMode: true,
        decodeEntities: false,
        xml: {
          decodeEntities: false,
        },
      })

      this.root = this.xmlObject('*').get(0)
        ? this.xmlObject('*').get(0).tagName
        : this.xmlObject('*').get(0)

      this.loadFromSchema()
    }

    return this.model
  }

  loadFromSchema() {
    const schema = this.OverwriteSchema
      ? this.schema()
      : Object.assign(this.rootSchema(), this.schema() || {})

    this.fields = Object.keys(schema)
    this.model = {}

    this.fields.forEach(field => {
      const { path, parser = false } = schema[field]
      let value = {}

      const { node, attribute } = this.chooseExistingPath(path)

      if (attribute) {
        value = this.xmlObject(node).attr(attribute)
      } else if (path.children) {
        value = this.xmlObject(node)
          .children()
          .filter((i, el) => el.name.includes(path.children))
      } else if (parser) {
        const attrVal = this.xmlObject(node).attr(parser.attr)

        if (
          (isEmpty(attrVal) || attrVal === parser.value) &&
          parser.multiValue
        ) {
          value = []

          this.xmlObject(node).each((i, elm) => {
            value.push(this.xmlObject(elm).html())
          })
        } else {
          value = this.xmlObject(node).html()
        }
      } else {
        value = this.xmlObject(node).html()
      }

      let modelVal

      if (this[field]) {
        modelVal = this[field](value)
      } else if (value) {
        // Decode strings back from html-entities escaping
        // if they are leaf nodes, and not being passed into a method
        modelVal = decoder.decode(value)
      } else {
        modelVal = null
      }

      this.model[field] = modelVal
    })
  }

  // eslint-disable-next-line class-methods-use-this
  extractNodeAttr(loc) {
    let node = null
    let attribute = null

    if (isString(loc)) {
      const locArray = loc.split(/:(.*)/s)

      // eslint-disable-next-line prefer-destructuring
      node = locArray[0]
      attribute = locArray[1] || null
    } else {
      node = loc.tag
      attribute = loc.attribute
    }

    return { node, attribute }
  }

  chooseExistingPath(path) {
    if (isArray(path.location)) {
      let found = null

      path.location.forEach(loc => {
        const { node, attribute } = this.extractNodeAttr(loc)

        if (this.xmlObject('*').is(node)) {
          if (attribute) {
            if (!!this.xmlObject(node).attr(attribute) && !found) {
              found = { node, attribute }
            }
          } else if (!found) {
            found = { node, attribute }
          }
        }
      })

      return found || this.extractNodeAttr(path.location[0])
    }

    return this.extractNodeAttr(path.location)
  }

  getContent(value, tag) {
    const content = this.cheerio.load(value, {
      xmlMode: true,
      decodeEntities: false,
      xml: {
        decodeEntities: false,
      },
    })

    return content(tag).html()
  }

  rootSchema() {
    return {
      id: {
        path: {
          location: `${this.root}:id`,
        },
      },
    }
  }
}

module.exports = XmlBase
