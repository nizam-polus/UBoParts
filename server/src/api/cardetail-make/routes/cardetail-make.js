module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/cardetail-make',
      handler: 'cardetail-make.findAll',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
