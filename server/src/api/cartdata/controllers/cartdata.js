'use strict';

/**
 * A set of functions called "actions" for `cartdata`
 */

module.exports = {
  addcartdata: async (ctx, next) => {
     try {
       console.log(ctx.request.body);
       let entries;
       const totalprice=  `${ctx.request.body.quantity}*${ctx.request.body.productprice}`;
       
       const selectentries = await strapi.db.connection.raw(
        `SELECT quantity FROM public.carts
        WHERE customer_id='${ctx.request.body.customerid}' AND product_id ='${ctx.request.body.productid}';`
       );
       console.log('hii',ctx.request.body.quantity);
       if(selectentries.rows.length && selectentries.rows[0].quantity){
         //console.log('if');
	const exist_quantity = parseInt(`${selectentries.rows[0].quantity}`);
	const additional_quantity = parseInt(`${ctx.request.body.quantity}`);
	const update_quantity = exist_quantity+additional_quantity;
	const update_total_price = update_quantity*ctx.request.body.productprice;	
        entries = await strapi.db.connection.raw(
          `UPDATE public.carts
          SET quantity ='${update_quantity}', total_price= ${update_total_price}
          WHERE customer_id='${ctx.request.body.customerid}' AND product_id = '${ctx.request.body.productid}';`
         );
       }else{
	//console.log('else part');
        entries = await strapi.db.connection.raw(
        `INSERT INTO public.carts(id, customer_id, product_id, quantity, created_at, updated_at, total_price) VALUES (DEFAULT, '${ctx.request.body.customerid}', '${ctx.request.body.productid}', '${ctx.request.body.quantity}', DEFAULT, DEFAULT, ${totalprice});`
       );}
      ctx.body = entries;
    } catch (err) {
      console.log(err)
       ctx.body = err;
     }
   }
};

//'use strict';

/**
 * A set of functions called "actions" for `cartdata`
 */

/*module.exports = {
   findAll: async (ctx, next) => {
     try {
      console.log(ctx.cartdata.body);
      const entries = await strapi.db.connection.raw(
        `INSERT INTO public.carts(customer_id, product_id, quantity) VALUES (${ctx.request.body.customerid}, ${ctx.request.body.productid}, ${ctx.request.body.quantity});`
      );
      ctx.body = entries;
    } catch (err) {
      console.log(err)
       ctx.body = err;
    }
   }
}; */
