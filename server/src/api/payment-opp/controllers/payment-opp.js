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
        "products": [
        {
            "name": "Gearbox",

            "price": 400,

            "quantity": 1
        }

        ],
        "return_url": "http://uboparts.polussoftware.com:3000/payment-result",
        "notify_url": "http://10.199.100.156:1337/api/payment-status-update",// update transaction status api
        "total_price": 400,
        "checkout": false
      });
      const url =  request.object_ul
      const response = await fetch('https://api-sandbox.onlinebetaalplatform.nl/v1/transactions', {
        method: "POST", headers: {
          'Content-Type': 'application/json',
          "Content-Length": data.length.toString(),
          "Authorization": "Bearer 1eb53db743cfa43b902e4b8d83bc6c55"
        },
        body: data,
      });
      const result = await response.json();
      
      // insert transaction status details into table transaction query based on the result

      const entries = await strapi.db.connection.raw(
        `INSERT INTO public.transaction(
          id, tid, sid, status, created_at, updated_at)
          VALUES (DEFAULT, '${result.uid}', '${result.statuses[0].uid}', '${result.status}', DEFAULT, DEFAULT);`
       );

      ctx.body = entries;

    } catch (err) {
      ctx.body = err;
    }
  }
};
