const {
  create,
  read,
  readOne,
  update,
  deleteOne,
} = require("../lib/api/roles");

const createHandler = async function (request, reply) {
  try {
    const { name, level } = request.body;
    const db = this.mongo.pwhb.db;
    const alreadyExists = await db.collection("roles").findOne({ name });
    if (alreadyExists) {
      return {
        success: false,
        error: {
          message: "role already exists",
        },
      };
    }
    const doc = await create(db, {
      name,
      level,
      createdBy: new this.mongo.ObjectId(request.user._id),
    });
    return reply.code(201).send({ success: true, data: doc });
  } catch (e) {
    console.error(e);
    return reply.code(400).send({ success: false, error: e });
  }
};

const readHandler = async function (request, reply) {
  try {
    const db = this.mongo.pwhb.db;
    const docs = await read(db);
    return reply.code(200).send({ success: true, data: docs });
  } catch (e) {
    console.error(e);
    return reply.code(400).send({ success: false, error: e });
  }
};

const readOneHandler = async function (request, reply) {
  try {
    const { id } = request.params;
    const db = this.mongo.pwhb.db;
    const _id = new this.mongo.ObjectId(id);
    const doc = await readOne(db, _id);
    if (!doc) {
      return reply.code(404).send({
        success: false,
        error: {
          message: "role doesn't exist",
        },
      });
    }
    return reply.code(200).send({ success: true, data: doc });
  } catch (e) {
    console.error(e);
    return reply.code(400).send({ success: false, error: e });
  }
};

const updateHandler = async function (request, reply) {
  try {
    const { name, level } = request.body;
    const { id } = request.params;
    const db = this.mongo.pwhb.db;
    const _id = new this.mongo.ObjectId(id);
    const alreadyExists = await readOne(db, _id);

    if (!alreadyExists) {
      return {
        success: false,
        error: {
          message: "role doesn't exist",
        },
      };
    }
    const doc = await update(db, _id, {
      name,
      level,
    });
    return reply.code(201).send({ success: true, data: doc });
  } catch (e) {
    console.error(e);
    return reply.code(400).send({ success: false, error: e });
  }
};

const deleteHandler = async function (request, reply) {
  try {
    const { id } = request.params;
    const db = this.mongo.pwhb.db;
    const _id = new this.mongo.ObjectId(id);
    const docs = await read(db, { match: { _id: _id }, limit: 1 });
    if (!docs[0]) {
      return {
        success: false,
        error: {
          message: "not found",
        },
      };
    }

    await deleteOne(db, _id);
    return reply.code(200).send({ success: true, data: docs[0] });
  } catch (e) {
    console.error(e);
    return reply.code(400).send({ success: false, error: e });
  }
};

module.exports = {
  createHandler,
  readHandler,
  readOneHandler,
  updateHandler,
  deleteHandler,
};
