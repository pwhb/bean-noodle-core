"use strict";
const { getMailOptions, sendMail } = require("../../../../lib/mail");
const { getHtml } = require("../../../../lib/parsers");
module.exports = async function (fastify, opts) {
  fastify.route({
    method: "POST",
    url: "/",
    handler: async function (request, reply) {
      try {
        const { from, to, subject, text } = request.body;
        const db = this.mongo.pwhb.db;
        const html = getHtml("welcome.html", { name: "Nilar Win Htut" });
        const mailOptions = getMailOptions({ from, to, subject, text, html });
        await sendMail(mailOptions);

        return reply
          .code(201)
          .send({ success: true, data: "mail", mailOptions });
      } catch (e) {
        console.error(e);
        return reply.code(400).send({ success: false, error: e });
      }
    },
  });
};
