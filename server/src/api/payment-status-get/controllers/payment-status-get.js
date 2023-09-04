'use strict';

/**
 * A set of functions called "actions" for `payment-status-get`
 */

module.exports = {
  getpaymentstatus: async (ctx, next) => {
    // console.log(ctx.request.params);
    console.log(ctx.request.body);
     try {
      const entries = await strapi.db.connection.raw(
        `SELECT status
        FROM public.transaction WHERE tid='${ctx.request.body.transactionid}';`
       );
       ctx.body = entries;
    } catch (err) {
      ctx.body = err;
    }
  }
};
