"use strict";

const path = require("path");
const AutoLoad = require("@fastify/autoload");
const { verifyJWT } = require("./middlewares/auth");

// Pass --options via CLI arguments in command to enable these options.
module.exports.options = {};

module.exports = async function (fastify, opts) {
  fastify.register(require("@fastify/multipart"));

  fastify.register(require("@fastify/cors"));

  fastify.register(require("@fastify/mongodb"), {
    forceClose: true,
    url: process.env.EUREKA_DEV_MONGODB_URI,
  });

  fastify.register(require("@fastify/jwt"), {
    secret: process.env.AUTH_SECRET,
  });

  fastify.register(require("@fastify/auth"));

  fastify.decorate("verifyJWT", verifyJWT);

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, opts),
  });
};
