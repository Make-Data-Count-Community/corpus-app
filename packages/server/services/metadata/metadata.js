const DataCite = require('./datacite')

class Metadata {
    static createInstance(sourceType) {
        if (sourceType === "datacite") {
            return new DataCite();
        }
 
        throw new Error("Invalid sourceType");  
    }
  }

module.exports = Metadata