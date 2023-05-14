const { create, read, readOne } = require("../lib/api/uploads");
const { uploadLocation } = require("../lib/helpers");
const { list, upload, get } = require("../lib/s3");

const createHandler = async function (request, reply) {
  try {
    const file = await request.file();
    const Key = file.filename;
    const res = await upload({
      Key: Key,
      Body: await file.toBuffer(),
      ContentType: file.mimetype,
    });
    if (res) {
      const db = this.mongo.db;
      const _id = await create(db, {
        Key: Key,
        createdBy: new this.mongo.ObjectId(request.user._id),
      });
      return reply.code(200).send({
        success: true,
        data: {
          ...res,
          Location: uploadLocation(_id),
        },
      });
    }
    return reply
      .code(400)
      .send({ success: false, error: { message: "upload failed" } });
  } catch (e) {
    console.error(e);
    return reply.code(400).send({ success: false, error: e });
  }
};

const readHandler = async function (request, reply) {
  try {
    const db = this.mongo.db;
    const docs = await read(db);

    const mapped = docs.map((doc) => ({
      ...doc,
      Location: uploadLocation(doc._id),
    }));
    return reply.code(200).send({ success: true, data: mapped });
  } catch (e) {
    console.error(e);
    return reply.code(400).send({ success: false, error: e });
  }
};

const readOneHandler = async function (request, reply) {
  const { id } = request.params;
  try {
    const db = this.mongo.db;
    const _id = new this.mongo.ObjectId(id);
    const doc = await readOne(db, _id);
    const res = await get(doc.Key);
    return reply.code(200).send(res.Body);
  } catch (e) {
    console.error(e);
    return reply.code(400).send({ success: false, error: e });
  }
};

const listHandler = async function (request, reply) {
  try {
    const res = await list();
    return reply.code(200).send({
      success: true,
      data: res.Contents.map((val) => ({
        ...val,
        Location: `${process.env.BUCKET_BASE_URL}/${val.Key}`,
      })),
    });
  } catch (e) {
    console.error(e);
    return reply.code(400).send({ success: false, error: e });
  }
};

module.exports = {
  createHandler,
  readHandler,
  readOneHandler,
  listHandler,
};
