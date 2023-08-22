'use strict';

/**
 * A set of functions called "actions" for `payment-status-update`
 */

module.exports = {
  paymentStatusUpdate: async (ctx, next) => {
     try {
      const object_url = ctx.request.body.object_url;

      const response = await fetch(`'${object_url}'`, {
        method: "POST", headers: {
          'Content-Type': 'application/json',
          "Content-Length": data.length.toString(),
          "Authorization": "Bearer 1eb53db743cfa43b902e4b8d83bc6c55"
        },
        body: data,
      });
      const result = await response.json();
      const entries = await strapi.db.connection.raw(
        `UPDATE public.transaction
        SET status=${result.status}
        WHERE tid = ${result.uid};`
       );

       ctx.body = entries; 
     } catch (err) {
       ctx.body = err;
     }
   }
};
