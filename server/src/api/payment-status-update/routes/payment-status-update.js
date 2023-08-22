module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/payment-status-update',
      handler: 'payment-status-update.paymentStatusUpdate',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
