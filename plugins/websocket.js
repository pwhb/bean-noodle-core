"use strict";

const fp = require("fastify-plugin");

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(async function (fastify, opts) {
  fastify.get(
    "/ws",
    { websocket: true },
    (connection /* SocketStream */, req /* FastifyRequest */) => {
      connection.socket.on("message", (message) => {
        // message.toString() === 'hi from client'
        connection.socket.send("hi from server");
      });
    }
  );

  fastify.get(
    "/ws/eureka/binary",
    { websocket: true },
    async (connection /* SocketStream */, req /* FastifyRequest */) => {
      const db = fastify.mongo.eureka.db;
      connection.socket.on("message", async (message) => {
        const body = JSON.parse(message);
        await db
          .collection("lab_data")
          .updateOne(
            { name: "binary-lab" },
            { $set: { name: "binary-lab", ...body } },
            { upsert: true }
          );
        fastify.websocketServer.clients.forEach((client) => {
          client.send(message, { binary: false });
        });
      });
      const initData = await db
        .collection("lab_data")
        .findOne({ name: "binary-lab" });
      connection.socket.send(JSON.stringify(initData), {
        binary: false,
      });
    }
  );
});
