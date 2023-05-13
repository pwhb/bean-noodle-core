const { hash } = require("bcrypt");
const {
  create,
  read,
  readOne,
  update,
  deleteOne,
} = require("../lib/api/users");

const createHandler = async function (request, reply) {
  try {
    const { firstName, lastName, username, password, email, avatar, roleId } =
      request.body;
    const db = this.mongo.db;
    const alreadyExists = await db.collection("users").findOne({ username });

    if (alreadyExists) {
      return {
        success: false,
        error: {
          message: "user already exists",
        },
      };
    }
    const doc = await create(db, {
      firstName,
      lastName,
      username,
      password: await hash(password, 10),
      email,
      avatar,
      roleId: new this.mongo.ObjectId(roleId),
      createdBy: request.user._id,
    });
    return reply.code(201).send({ success: true, data: doc });
  } catch (e) {
    console.error(e);
    return reply.code(400).send({ success: false, error: e });
  }
};
const readHandler = async function (request, reply) {
  try {
    const db = this.mongo.db;
    const docs = await read(db);
    return reply.code(200).send({ success: true, data: docs });
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
    if (!doc) {
      return reply.code(404).send({
        success: false,
        error: {
          message: "user doesn't exist",
        },
      });
    }
    return reply.code(200).send({ success: true, data: doc });
  } catch (e) {
    console.error(e);
    return reply.code(400).send({ success: false, error: e });
  }
};

const loginHandler = async function (request, reply) {
  try {
    const db = this.mongo.db;
    const { username, password } = request.body;
    const doc = (
      await read(db, {
        match: { username },
        project: {
          _id: 1,
          username: 1,
          "role.name": 1,
        },
        limit: 1,
      })
    )[0];

    if (!doc) {
      return reply.code(404).send({
        success: false,
        error: {
          message: "user doesn't exist",
        },
      });
    }
    return reply.code(200).send({
      success: true,
      data: {
        token: this.jwt.sign(doc),
      },
    });
  } catch (e) {
    console.error(e);
    return reply.code(400).send({ success: false, error: e });
  }
};

const updateHandler = async function (request, reply) {
  try {
    const { firstName, lastName, username, email, avatar, roleId } =
      request.body;
    const { id } = request.params;
    const db = this.mongo.db;
    const _id = new this.mongo.ObjectId(id);
    const alreadyExists = await readOne(db, _id);

    if (!alreadyExists) {
      return {
        success: false,
        error: {
          message: "user doesn't exist",
        },
      };
    }
    const doc = await update(db, _id, {
      firstName,
      lastName,
      username,
      email,
      avatar,
      roleId: new this.mongo.ObjectId(roleId),
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
    const db = this.mongo.db;
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
  loginHandler,
};
