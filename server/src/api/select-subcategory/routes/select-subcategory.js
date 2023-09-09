
module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/select-subcategory',
      handler: 'select-subcategory.getsubcategory',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
