'use strict';

/**
 * A set of functions called "actions" for `updatecartdata`
 */

module.exports = {
  updatedata: async (ctx, next) => {
     try {
      console.log(ctx.request.body);

      const getstock_count =  await strapi.db.connection.raw(
         `SELECT public.products.stock_count
     FROM public.carts
     INNER JOIN public.products
     ON public.carts.product_id = public.products.id
     WHERE public.carts.customer_id = ${ctx.request.body.customerid} AND public.carts.id= ${ctx.request.body.id};`
        );	
  
      const stockcount = getstock_count.rows[0].stock_count;
      const cart_product_quntity = ctx.request.body.quantity;
  
      console.log(stockcount,cart_product_quntity);

      if(cart_product_quntity<=stockcount){

      const totalprice=  `${ctx.request.body.quantity}*${ctx.request.body.productprice}`;
      const entries = await strapi.db.connection.raw(
       `UPDATE public.carts
       SET quantity = ${ctx.request.body.quantity}, total_price= ${totalprice}
       WHERE customer_id = ${ctx.request.body.customerid} AND id = ${ctx.request.body.id};`
      );}
     ctx.body = entries;
     } catch (err) {
        ctx.body = err;
     }
   }
};
