import axios from "axios";
import { DataService as ds } from "./dataService";
import { BASE_URL } from "configuration";

const BACKEND_URL = BASE_URL + '/api/'

const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('usertoken')
    }
}

const token = '50af5309c25034cb4a3331de6d5430ceab721fcc328546dd768ecb18ce02c30472645c52a0acdec52dab3e59d18b4d2d7b413db3ef9c3895de02cd09838d793e35da5b20dc0eeb198201d1c6a697a9bb42445bc4002e2c64a0d708ba8c94c6d2900be981b66a754eeeaa3f6defe7bbf9e1de7d7f3cfb267dd6bab131466459f0';

const headers = {
    Authorization: `Bearer ${token}`
}

const APIs = {

    auth: (userdata: {}) => axios.post(BACKEND_URL + 'auth/local', userdata),

    register: (userdata: {}) => axios.post(BACKEND_URL + 'auth/local/register', userdata),

    getCarDetailsUsingLicence: (licenseplate: string) => axios.post(BACKEND_URL + `cardetail-external-internal`, {licenseplate: licenseplate}, {headers}),

    getCarDetails: () => axios.get(BACKEND_URL + 'cardetails?populate=*&pagination[page]=1&pagination[pageSize]=1000&sort[0]=licenseplate:asc', {headers}),

    getCategories: () => axios.get(BACKEND_URL + 'categories?populate=*&sort[0]=id:asc', {headers}),

    getSubcategories: (categoryId: number) => axios.post(BACKEND_URL + 'select-subcategory', {categoryid: categoryId}, {headers}),

    getCarMake: () => axios.get(BACKEND_URL + 'cardetail-make', {headers}),

    getCarModel: (make: {}) => axios.post(BACKEND_URL + 'cardetailmodel', make, {headers}),

    getCarYear: (make_model: {}) => axios.post(BACKEND_URL + 'cardetailyear', make_model, {headers}),

    searchProducts: (make: string, model: string, year: string, category: string) => {
        return axios.get(
            BACKEND_URL + `products?populate=*&filters[$and][][cardetail][make][$contains]=${make}&filters[$and][][cardetail][model][$contains]=${model}${year && 
                '&filters[$and][][cardetail][year][$eq]='+year}&filters[$and][][category][category_name][$contains]=${category}`, {headers}
        )
    },

    searchFilter: (make: string, model: string, year: string, categories: [], sub_category: [], price: string) => {

        let searchposition = -1, filterposition = 0;
        const incrementSearchPosition = () => {
            return searchposition += 1;
        };
        const incrementFilterPosition = () => {
            return filterposition += 1;
        };
        let categoryQuery = categories.map((category: any) => (
            `&filters[$or][${incrementFilterPosition() + ''}][category][category_name][$contains]=${category}`
        ));
        let subcategoryQuery = sub_category.map((subcat: any) => (
            `&filters[$and][${incrementFilterPosition() + ''}][sub_category][name][$contains]=`
        ));

        return axios.get(BACKEND_URL + `products?populate=*${make && `&filters[$or][0][$and][${incrementSearchPosition() + ''}][cardetail][make][$contains]=${make}`}`+
            `${model && `&filters[$or][0][$and][${incrementSearchPosition() + ''}][cardetail][model][$contains]=${model}`}`+
            `${year && `&filters[$or][0][$and][${incrementSearchPosition() + ''}][cardetail][year][$eq]=${year}`}`+
            `${categoryQuery.length ? categoryQuery.join() : ''}`+
            `${subcategoryQuery.length ? subcategoryQuery.join() : ''}` + '',
            // `${price ? `filters[$or][0][price][$between]=${'10'}&filters[$or][0][price][$between]=${'500'}` : `filters[$or][0][price][$between]=${'10'}&filters[$or][0][price][$between]=${'500'}`}`, 
            {headers}
        )
    },
    
    getAllProducts: () => axios.get(BACKEND_URL + 'products?populate=*', {headers}),
    
    getProduct: (id: any) => axios.get(BACKEND_URL + 'products/' + id + '?populate=*', {headers}),

    paymentUpdate: () => axios.post(BACKEND_URL + 'payment-status-update', {headers}),
    

    // jwt token based apis
    addToCart: (cartData: {}) => ds.post(BACKEND_URL + 'cartdata', cartData),
    
    getCartData: (customerData: {}) => ds.post(BACKEND_URL + 'getcartdetails', customerData),
    
    updateCartData: (updateItem: {}) => ds.post(BACKEND_URL + 'updatecartdata', updateItem),
    
    deleteCartData: (deleteItem: {}) => ds.post(BACKEND_URL + 'deletecartdata', deleteItem),
    
    cartPayment: (productsData: {}) => ds.post(BACKEND_URL + 'Payment-opp', productsData),

    paymentStatus: (transactionId: string) => ds.post(BACKEND_URL + 'payment-status-get', {transactionid: transactionId}),

    getSpecificUser: (id: number) => ds.get(BACKEND_URL + `users/${id}?populate=*`),

    updateSpecificUser: (id: number, userData: any) => ds.put(BACKEND_URL + `users/${id}`, userData),
    
    createNewList: (data: any) => ds.post(BACKEND_URL + 'products', {...data}),

    getLicenseplate: (data: any) => axios.get(BACKEND_URL + `cardetails?populate=*&filters[licenseplate][$contains]=${data}`, {headers})


}

export default APIs