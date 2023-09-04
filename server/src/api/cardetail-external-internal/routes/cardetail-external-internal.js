module.exports = {
  routes: [
     {
      method: 'POST',
      path: '/cardetail-external-internal',
      handler: 'cardetail-external-internal.getcardata',
      config: {
        policies: [],
       middlewares: [],
     },
     },
  ],
};
