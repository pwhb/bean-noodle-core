"use strict";

const {
  createHandler,
  readHandler,
  readOneHandler,
  listHandler,
} = require("../../../../controllers/uploads");

module.exports = async function (fastify, opts) {
  fastify.route({
    method: "GET",
    url: "/:id",
    handler: readOneHandler,
  });

  fastify.route({
    method: "GET",
    url: "/listS3",
    handler: listHandler,
  });

  fastify.route({
    method: "GET",
    url: "/",
    handler: readHandler,
  });

  fastify.route({
    method: "POST",
    url: "/",
    handler: createHandler,
  });
};
