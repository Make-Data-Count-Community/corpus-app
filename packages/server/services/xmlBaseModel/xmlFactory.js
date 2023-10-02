class XmlFactory {
  static xmlToModel(content, Model, options = {}) {
    return new Model(content, options)
  }
}

module.exports = XmlFactory
