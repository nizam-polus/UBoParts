"use strict";
const axios = require("axios");

/**
 * A set of functions called "actions" for `payment-status-update`
 */

module.exports = {
  paymentStatusUpdate: async (ctx, next) => {
    try {
      const object_url = ctx.request.body.object_url;

      // const response = await fetch(`'${object_url}'`, {
      //   method: "POST", headers: {
      //     'Content-Type': 'application/json',
      //     "Content-Length": data.length.toString(),
      //     "Authorization": "Bearer 1eb53db743cfa43b902e4b8d83bc6c55"
      //   },
      //   body: data,
      // });
      // const result = await response.json();

        const response = await axios({
        method: "post",
        url: object_url,
        //data: data,
        headers: {
          "Content-Type": "application/json",
         // "Content-Length": data.length.toString(),
          Authorization: "Bearer 1eb53db743cfa43b902e4b8d83bc6c55",
        },
      });

      console.log(response.data);
      const entries = await strapi.db.connection.raw(
        `UPDATE public.transaction
            SET status='${response.data.status}'
            WHERE tid ='${response.data.uid}';`
      );
      ctx.body = response.data;

      const cleardata = await strapi.db.connection.raw(
        `DELETE FROM public.carts
        WHERE customer_id='2';`
      );
      // .then(async ({data}) => {
      //   console.log(data);
      //   const entries = await strapi.db.connection.raw(
      //     `UPDATE public.transaction
      //     SET status='${data.status}'
      //     WHERE tid = '${data.uid}';`
      //    );
      //  ctx.body = data;
      // });
    } catch (err) {
      console.log(err);
      ctx.body = err;
    }
  },
};
