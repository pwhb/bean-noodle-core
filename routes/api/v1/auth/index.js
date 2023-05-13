"use strict";

const { loginHandler } = require("../../../../controllers/users");

module.exports = async function (fastify, opts) {
  fastify.route({
    method: "POST",
    url: "/login",
    handler: loginHandler,
  });
};
