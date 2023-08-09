'use strict';

/**
 * cardetail-make service
 */

module.exports = () => ({
   /* cardetailmake: async () => {
        try {
          // fetching the data
          // we dont really need contentSections for this example.
          // its kept here, just for your reference
          const entries = await strapi.entityService.findMany('api::cardetail.cardetail', {
            
           
                fields: ['id','make'],
            
          });

          // reducing the data to a simple array
          let entriesReduced;
          if (entries && Array.isArray(entries)) {
            entriesReduced = entries.reduce((acc, item) => {
              acc = acc || [];
              console.log(acc);
              acc.push({
                id: item.id,
                make: item.make || ''
              });
              return acc;
            }, [])

            // returning the reduced data
            return entriesReduced;
          }
        } catch (err) {
          return err;
        }
      }*/
});
