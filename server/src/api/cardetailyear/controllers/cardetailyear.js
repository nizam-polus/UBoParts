'use strict';

/**
 * A set of functions called "actions" for `cardetailyear`
 */

module.exports = {
  findAll: async (ctx, next) => {
    try {
    console.log(ctx.request.body);
     const entries = await strapi.db.connection.raw(
       `SELECT DISTINCT year FROM public.cardetails WHERE make='${ctx.request.body.param_make}' AND model='${ctx.request.body.param_model}' ORDER BY year ASC;`
     );
     ctx.body = entries;
    } catch (err) {
     //console.log(err)
      ctx.body = err;
    }
  }
};
