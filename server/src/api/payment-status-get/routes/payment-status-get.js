module.exports = {
  routes: [
     {
      method: 'POST',
      path: '/payment-status-get',
      handler: 'payment-status-get.getpaymentstatus',
      config: {
        policies: [],
        middlewares: [],
      },
     },
  ],
};
