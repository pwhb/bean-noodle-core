const {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const client = new S3Client({
  endpoint: process.env.ENDPOINT,
  credentials: {
    accessKeyId: process.env.APPLICATION_KEY_ID,
    secretAccessKey: process.env.APPLICATION_KEY,
  },
  region: process.env.REGION,
});

const upload = async ({ Key, Body, ContentType }) => {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: Key,
      Body: Body,
      ContentType: ContentType,
    });
    const response = await client.send(command);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const list = async (MaxKeys) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.BUCKET_NAME,
      MaxKeys: MaxKeys ? MaxKeys : 20,
    });
    const response = await client.send(command);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const get = async (Key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: Key,
    });
    const response = await client.send(command);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports = { upload, list, get };
