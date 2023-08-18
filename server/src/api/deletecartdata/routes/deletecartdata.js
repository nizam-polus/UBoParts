module.exports = {
  routes: [
     {
      method: 'POST',
      path: '/deletecartdata',
      handler: 'deletecartdata.deleledata',
      config: {
        policies: [],
        middlewares: [],
      },
   },
  ],
};
