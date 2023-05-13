const slugify = (str) => {
  const split = str.toLowerCase().replace("?", "").split(" ");
  return split.join("-");
};

const uploadLocation = (id) => `${process.env.BASE_URL}/api/v1/uploads/${id}`;

module.exports = { slugify, uploadLocation };
