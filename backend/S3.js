require("dotenv").config();
const AWS = require("aws-sdk");
const credentials = {
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
};

AWS.config.update({
  credentials: credentials,
  region: "ap-northeast-1",
});

const s3 = new AWS.S3();

const presignedGETURL = async (filename) => {
  return s3.getSignedUrl("getObject", {
    Bucket: "ss-shared-foods-picture",
    Key: filename,
    Expires: 600,
  });
};

const presignedImagePUTURL = async (filename) => {
  return s3.getSignedUrl("putObject", {
    Bucket: "ss-shared-foods-picture",
    Key: filename,
    Expires: 600,
    ContentType: "image",
  });
};

module.exports = {
  presignedGETURL,
  presignedImagePUTURL,
};
