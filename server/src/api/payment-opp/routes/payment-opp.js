module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/payment-opp',
     handler: 'payment-opp.proceedPay',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
}; 
