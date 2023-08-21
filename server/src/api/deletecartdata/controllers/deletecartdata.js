'use strict';

/**
 * A set of functions called "actions" for `deletecartdata`
 */

module.exports = {
  deleledata: async (ctx, next) => {
     try {
      console.log(ctx.request.body);
      const entries = await strapi.db.connection.raw(
       `DELETE FROM public.carts
       WHERE customer_id = ${ctx.request.body.customerid} AND id = ${ctx.request.body.id};`
      );
     ctx.body = entries;
     } catch (err) {
       ctx.body = err;
     }
   }
};
