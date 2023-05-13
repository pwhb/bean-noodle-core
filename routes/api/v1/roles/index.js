"use strict";

const {
  readHandler,
  readOneHandler,
  createHandler,
  updateHandler,
  deleteHandler,
} = require("../../../../controllers/roles");

module.exports = async function (fastify, opts) {
  fastify.route({
    method: "GET",
    url: "/",
    onRequest: fastify.auth([fastify.verifyJWT]),
    handler: readHandler,
  });

  fastify.route({
    method: "GET",
    url: "/:id",
    onRequest: fastify.auth([fastify.verifyJWT]),
    handler: readOneHandler,
  });

  fastify.route({
    method: "POST",
    url: "/",
    onRequest: fastify.auth([fastify.verifyJWT]),
    handler: createHandler,
  });

  fastify.route({
    method: "PUT",
    url: "/:id",
    onRequest: fastify.auth([fastify.verifyJWT]),
    handler: updateHandler,
  });

  fastify.route({
    method: "DELETE",
    url: "/:id",
    onRequest: fastify.auth([fastify.verifyJWT]),
    handler: deleteHandler,
  });
};
