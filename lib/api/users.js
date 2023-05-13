const { slugify } = require("../helpers");

const options = {
  match: {},
  limit: 20,
};

const read = async (db, { match, limit } = options) =>
  await db
    .collection("users")
    .aggregate([
      {
        $match: match || options.match,
      },
      {
        $lookup: {
          from: "roles",
          localField: "roleId",
          foreignField: "_id",
          as: "role",
        },
      },
      {
        $addFields: {
          role: {
            $arrayElemAt: ["$role", 0],
          },
        },
      },
      { $limit: limit || options.limit },
    ])
    .toArray();

const readOne = async (db, _id) =>
  (await read(db, { match: { _id, _id }, limit: 1 }))[0];

const create = async (db, body) => {
  const { firstName, lastName } = body;
  const inserted = await db.collection("users").insertOne({
    ...body,
    slug: slugify(firstName + " " + lastName),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const doc = await readOne(db, inserted.insertedId);
  return doc;
};

const update = async (db, _id, body) => {
  const { firstName, lastName } = body;
  await db.collection("users").updateOne(
    { _id: _id },
    {
      $set: {
        ...body,
        slug: slugify(firstName + " " + lastName),
        updatedAt: new Date(),
      },
    }
  );
  const doc = await readOne(db, _id);
  return doc;
};

const deleteOne = async (db, _id) => {
  await db.collection("users").deleteOne({ _id: _id });
};

module.exports = { create, read, readOne, update, deleteOne };
