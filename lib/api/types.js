const options = {
  match: {},
  limit: 20,
};

const read = async (db, { match, limit } = options) =>
  await db
    .collection("types")
    .aggregate([
      {
        $match: match || options.match,
      },
      { $limit: limit || options.limit },
    ])
    .toArray();

const readOne = async (db, _id) =>
  await db.collection("types").findOne({ _id: _id });

const create = async (db, body) => {
  const inserted = await db.collection("types").insertOne({
    ...body,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const doc = await db
    .collection("types")
    .findOne({ _id: inserted.insertedId });
  return doc;
};

const update = async (db, _id, body) => {
  await db
    .collection("types")
    .updateOne({ _id: _id }, { $set: { ...body, updatedAt: new Date() } });
  const doc = await db.collection("types").findOne({ _id: _id });
  return doc;
};

const deleteOne = async (db, _id) => {
  await db.collection("types").deleteOne({ _id: _id });
};

module.exports = { create, read, readOne, update, deleteOne };
