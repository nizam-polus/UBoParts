'use strict';

/**
 * A set of functions called "actions" for `cardetailmodel`
 */

module.exports = {
  findAll: async (ctx, next) => {
     try {
      console.log(ctx.request.body);
      const entries = await strapi.db.connection.raw(
        `SELECT DISTINCT model FROM public.cardetails WHERE make='${ctx.request.body.param}' AND model IS NOT NULL ORDER BY model DESC;`
      );
      ctx.body = entries;
     } catch (err) {
      console.log(err)
       ctx.body = err;
     }
   }
};
