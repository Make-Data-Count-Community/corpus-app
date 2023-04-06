const DataCite = require('./datacite')

class Metadata {
    static createInstance(sourceType) {
        if (sourceType === "dataCite") {
            return new DataCite();
        }
 
        throw new Error("Invalid sourceType");  
    }
  }

module.exports = Metadata