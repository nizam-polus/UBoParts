module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/getcartdetails',
      handler: 'getcartdetails.getcartdata',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
}; 
