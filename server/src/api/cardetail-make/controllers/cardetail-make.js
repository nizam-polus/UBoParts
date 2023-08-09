'use strict';

/**
 * A set of functions called "actions" for `cardetail-make`
 */

module.exports = {
  async findAll(ctx, next) {
    try {
      console.log(ctx);
      const entries = await strapi.db.connection.raw(
        'SELECT DISTINCT make FROM public.cardetails ORDER BY make;'
      );
      ctx.body = entries;
    } catch (err) {
      ctx.badRequest('Page report controller error', { moreDetails: err })
    }
  }
};
