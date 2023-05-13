"use strict";

const {
  readHandler,
  readOneHandler,
  createHandler,
  updateHandler,
  deleteHandler,
} = require("../../../../controllers/users");

module.exports = async function (fastify, opts) {
  fastify.route({
    method: "GET",
    url: "/",
    handler: readHandler,
  });

  fastify.route({
    method: "GET",
    url: "/:id",
    handler: readOneHandler,
  });

  fastify.route({
    method: "POST",
    url: "/",
    handler: createHandler,
  });

  fastify.route({
    method: "PUT",
    url: "/",
    handler: updateHandler,
  });

  fastify.route({
    method: "DELETE",
    url: "/:id",
    handler: deleteHandler,
  });
};
