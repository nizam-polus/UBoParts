'use strict';
const axios = require("axios");
/**
 * A set of functions called "actions" for `cardetail-external-internal`
 */

module.exports = {
  getcardata: async (ctx, next) => {
     try {
      let entries;
      //console.log('hii',ctx.request.body.licenseplate);
      
      const selectentries = await strapi.db.connection.raw(
       `SELECT * FROM public.cardetails
       WHERE licenseplate = '${ctx.request.body.licenseplate}' ORDER BY id ASC;`
      );
      //console.log('hii',response.data);
      
      if(selectentries.rows.length && selectentries.rows[0].licenseplate){
        entries = selectentries.rows[0];
      }else{
      //console.log('else part');

      //call external api 
      const external_api = `https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=${ctx.request.body.licenseplate}`;
      const response = await axios({
        method: "get",
        url: external_api,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log('hii',response.data[0].datum_eerste_toelating_dt.substring(0,4));   

      //insert external api data to DB
      const row_countdata = await strapi.db.connection.raw(
        `SELECT COUNT(id) 
        FROM 
        public.cardetails;`
      );
      //console.log(row_countdata.rows[0].count);
      const row_data= parseInt(row_countdata.rows[0].count);
      const insert_data_id = row_data+1;
      console.log(insert_data_id);
      const external_to_db = await strapi.db.connection.raw(
        `INSERT INTO public.cardetails(
            id, licenseplate, make, model, year, created_at, updated_at, published_at, created_by_id, updated_by_id)
            VALUES ('${insert_data_id}', '${response.data[0].kenteken}', '${response.data[0].merk}', '${response.data[0].handelsbenaming}', '${response.data[0].datum_eerste_toelating_dt.substring(0,4)}', DEFAULT, DEFAULT, '2023-07-24 15:06:31', DEFAULT, DEFAULT) RETURNING *;
        ;`
      );
        const obj = {licenseplate: `${response.data[0].kenteken}`, make: `${response.data[0].merk}`, model: `${response.data[0].handelsbenaming}`, year: `${response.data[0].datum_eerste_toelating_dt.substring(0,4)}`};
        const external_data = JSON.stringify(obj);
        entries = external_data;
      }
     ctx.body = entries;

     } catch (err) {
      console.log(err);
      ctx.body = err;

     }
   }
};
