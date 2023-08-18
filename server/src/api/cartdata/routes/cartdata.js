module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/cartdata',
      handler: 'cartdata.addcartdata',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
}; 
