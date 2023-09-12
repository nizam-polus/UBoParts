"use strict";
const axios = require("axios");

/**
 * A set of functions called "actions" for `payment-opp`
 */

module.exports = {
  proceedPay: async (ctx, next) => {
    console.log("proceedPay");
    try {
      console.log(ctx.request.body);
      const data = JSON.stringify({
        merchant_uid: "mer_e60f0100bd43",
        products: ctx.request.body.products,
        return_url: "http://uboparts.polussoftware.com:3000/payment-result",
        notify_url: "http://52.6.187.235:1337/api/payment-status-update", // update transaction status api
        total_price: ctx.request.body.total_price,
        checkout: false,
      });

      const response = await axios({
        method: "post",
        url: "https://api-sandbox.onlinebetaalplatform.nl/v1/transactions",
        data: data,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length.toString(),
          Authorization: "Bearer 1eb53db743cfa43b902e4b8d83bc6c55",
        },
      });

      //insert status into transaction table based on the responce

      console.log(response.data);
      const entries = await strapi.db.connection.raw(
        `INSERT INTO public.transaction(
            id, tid, sid, status, created_at, updated_at, customer_id)
            VALUES (DEFAULT, '${response.data.uid}', '${response.data.statuses[0].uid}', '${response.data.status}', DEFAULT, DEFAULT, ${ctx.request.body.customerid});`
      );
      ctx.body = response.data;

    } catch (err) {
      ctx.body = err;
    }
  },
};
