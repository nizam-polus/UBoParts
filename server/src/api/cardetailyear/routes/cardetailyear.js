module.exports = {
  routes: [
     {
      method: 'POST',
      path: '/cardetailyear',
      handler: 'cardetailyear.findAll',
      config: {
        policies: [],
        middlewares: [],
      },
     },
  ],
};
