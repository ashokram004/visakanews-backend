"use strict";

/**
 * analytic controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::analytic.analytic",
  ({ strapi }) => ({

    async create(ctx) {

      // ✅ Best IP source in Strapi (cloud + local)
      const ip =
        ctx.state.ip ||
        ctx.request.headers["x-forwarded-for"]?.split(",")[0] ||
        ctx.request.ip ||
        ctx.req.socket?.remoteAddress ||
        null;

      // Make sure data exists
      if (!ctx.request.body?.data) {
        ctx.request.body = { data: {} };
      }

      // Attach IP
      ctx.request.body.data.ipAddress = ip;

      return await super.create(ctx);
    },

  })
);
