'use strict';

/**
 * A set of functions called "actions" for `updatecartdata`
 */

module.exports = {
  updatedata: async (ctx, next) => {
     try {
      console.log(ctx.request.body);
      const totalprice=  `${ctx.request.body.quantity}*${ctx.request.body.productprice}`;
      const entries = await strapi.db.connection.raw(
       `UPDATE public.carts
       SET quantity = ${ctx.request.body.quantity}, total_price= ${totalprice}
       WHERE customer_id = ${ctx.request.body.customerid} AND id = ${ctx.request.body.id};`
      );
     ctx.body = entries;
     } catch (err) {
        ctx.body = err;
     }
   }
};
