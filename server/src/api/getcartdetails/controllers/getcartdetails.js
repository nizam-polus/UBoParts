'use strict';

/**
 * A set of functions called "actions" for `getcartdetails`
 */

module.exports = {
  getcartdata: async (ctx, next) => {
    try {
      console.log(ctx.request.body);
      const entries = await strapi.db.connection.raw(
       `SELECT public.carts.*,public.products.title,public.products.price,public.files.url
       FROM public.carts 
       INNER JOIN public.products ON public.carts.product_id = public.products.id
       INNER JOIN public.files_related_morphs ON public.files_related_morphs.related_id = public.products.id
       INNER JOIN public.files ON public.files.id = public.files_related_morphs.file_id WHERE public.files_related_morphs.field='product_image' and public.carts.customer_id = '${ctx.request.body.customerid}' ORDER BY created_at ;`
      );
     ctx.body = entries;
   } catch (err) {
      ctx.body = err;
    }
  }
};
