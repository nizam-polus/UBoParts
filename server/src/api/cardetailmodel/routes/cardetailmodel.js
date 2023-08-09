module.exports = {
  routes: [
     {
      method: 'POST',
      path: '/cardetailmodel',
      handler: 'cardetailmodel.findAll',
      config: {
        policies: [],
        middlewares: [],
      },
     },
  ],
};
