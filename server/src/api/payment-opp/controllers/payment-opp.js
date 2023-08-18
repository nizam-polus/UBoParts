'use strict';
const axios = require('axios');
/**
 * A set of functions called "actions" for `payment-opp`
 */

module.exports = {
  // exampleAction: async (ctx, next) => {
  //   try {
  //     ctx.body = 'ok';
  //   } catch (err) {
  //     ctx.body = err;
  //   }
  // }

  proceedPay: async (ctx, next) => {
    try {
      console.log(ctx.request.body);
      const data = JSON.stringify({
        "merchant_uid": "mer_e60f0100bd43",
        "products": ctx.request.body.products,
        "return_url": "http://uboparts.polussoftware.com:3000/payment-result",
        "notify_url": "http://52.6.187.235:3001/test_notify",// update transaction status api
        "total_price": ctx.request.body.total_price,
        "checkout": false
      });
      const response = await fetch('https://api-sandbox.onlinebetaalplatform.nl/v1/transactions', {
        method: "POST", headers: {
          'Content-Type': 'application/json',
          "Content-Length": data.length.toString(),
          "Authorization": "Bearer 1eb53db743cfa43b902e4b8d83bc6c55"
        },
        body: data,
      });
      const result = await response.json();

      // insert transaction status  query based on the result

      const entries = await strapi.db.connection.raw(
        `UPDATE public.carts
        SET quantity = ${ctx.request.body.quantity}
        WHERE customer_id = ${ctx.request.body.customerid} AND id = ${ctx.request.body.id};`
       );

      ctx.body = result;

    } catch (err) {
      ctx.body = err;
    }
  }
};
