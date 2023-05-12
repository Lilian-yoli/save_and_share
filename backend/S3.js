require("dotenv").config();
const AWS = require("aws-sdk");
const log = require("npmlog");
const credentials = {
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
};
const S3_BUCKET = process.env.S3_BUCKET;

AWS.config.update({
  credentials: credentials,
  region: "ap-northeast-1",
});

const s3 = new AWS.S3();

const presignedGETURL = async (filename) => {
  try {
    return s3.getSignedUrl("getObject", {
      Bucket: S3_BUCKET,
      Key: filename,
      Expires: 600,
    });
  } catch (error) {
    log.error({ presignedGETURL: error });
    throw error;
  }
};

const presignedImagePUTURL = async (filename) => {
  try {
    return s3.getSignedUrl("putObject", {
      Bucket: S3_BUCKET,
      Key: filename,
      Expires: 600,
      ContentType: "image/png",
    });
  } catch (error) {
    log.error({ presignedImagePUTURL: error });
    throw error;
  }
};

module.exports = {
  presignedGETURL,
  presignedImagePUTURL,
};
