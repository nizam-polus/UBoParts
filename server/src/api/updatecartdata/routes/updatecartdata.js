module.exports = {
  routes: [
     {
      method: 'POST',
      path: '/updatecartdata',
      handler: 'updatecartdata.updatedata',
      config: {
        policies: [],
        middlewares: [],
      },
     },
  ],
};
