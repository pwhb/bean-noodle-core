const options = {
  match: {},
  limit: 20,
};

const read = async (db, { match, limit } = options) =>
  await db
    .collection("logs")
    .aggregate([
      {
        $match: match || options.match,
      },
      { $limit: limit || options.limit },
    ])
    .toArray();

const readOne = async (db, _id) =>
  await db.collection("logs").findOne({ _id: _id });

const create = async (db, body) => {
  const inserted = await db.collection("logs").insertOne({
    ...body,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return inserted.insertedId;
};

const update = async (db, _id, body) => {
  await db
    .collection("logs")
    .updateOne({ _id: _id }, { $set: { ...body, updatedAt: new Date() } });
  const doc = await db.collection("logs").findOne({ _id: _id });
  return doc;
};

const deleteOne = async (db, _id) => {
  await db.collection("logs").deleteOne({ _id: _id });
};

module.exports = { create, read, readOne, update, deleteOne };
