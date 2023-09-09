'use strict';

/**
 * A set of functions called "actions" for `select-subcategory`
 */
module.exports = {
  getsubcategory: async (ctx, next) => {
    try {
      console.log(ctx.request.body);
      const entries = await strapi.db.connection.raw(
       `SELECT DISTINCT public.sub_categories.name from public.categories
        INNER JOIN public.sub_categories_category_links
        ON public.categories.id=public.sub_categories_category_links.category_id
        INNER JOIN public.sub_categories
        ON public.sub_categories.id=public.sub_categories_category_links.sub_category_id
        WHERE public.categories.id = '${ctx.request.body.categoryid}' ;`
      );
     ctx.body = entries;
   } catch (err) {
      ctx.body = err;
    }
  }
};

