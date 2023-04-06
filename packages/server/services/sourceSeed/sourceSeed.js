const DataCiteEventData = require('./dataCiteEventData')

class SourceSeed {
    static createInstance(sourceType) {
        if (sourceType === "DataCiteEventData") {
            return new DataCiteEventData();
        }
 
        throw new Error("Invalid sourceType");  
    }
  }

module.exports = SourceSeed