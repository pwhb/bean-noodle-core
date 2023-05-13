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
    onRequest: fastify.auth([fastify.verifyJWT]),
    handler: readOneHandler,
  });

  fastify.route({
    method: "GET",
    url: "/listS3",
    onRequest: fastify.auth([fastify.verifyJWT]),
    handler: listHandler,
  });

  fastify.route({
    method: "GET",
    url: "/",
    onRequest: fastify.auth([fastify.verifyJWT]),
    handler: readHandler,
  });

  fastify.route({
    method: "POST",
    url: "/",
    onRequest: fastify.auth([fastify.verifyJWT]),
    handler: createHandler,
  });
};
