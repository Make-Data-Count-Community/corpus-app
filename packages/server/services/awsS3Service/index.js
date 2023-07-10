const AWS = require('aws-sdk')

class AwsS3Service {
  constructor() {
    AWS.config.update({
      accessKeyId: '***REMOVED***',
      secretAccessKey: '***REMOVED***',
      region: 'eu-west-1', // Replace with your desired region
    })

    // Create an instance of the S3 service
    this.s3 = new AWS.S3()
  }

  async readS3Folder(bucket, folder) {
    if (!bucket || !folder) {
      throw new Error('You need to specify bucket and folder')
    }

    const params = {
      Bucket: bucket,
      Prefix: folder,
    }

    return new Promise((resolve, reject) => {
      this.fileStream = []

      this.s3.listObjectsV2(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          // Iterate through each object in the folder
          data.Contents.filter(cnt => !cnt.Key.endsWith('/')).forEach(
            object => {
              // Construct the file path and key
              // const filePath = path.join(__dirname, object.Key);
              const fileKey = object.Key

              // Specify the parameters for the S3 getObject operation
              const getObjectParams = {
                Bucket: bucket,
                Key: fileKey,
              }

              // Retrieve each file from the S3 bucket
              this.fileStream.push(
                this.s3.getObject(getObjectParams).createReadStream(),
              )
            },
          )
        }

        resolve(this.fileStream)
      })
    })
  }
}

module.exports = AwsS3Service
