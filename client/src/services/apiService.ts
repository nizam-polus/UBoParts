import axios from "axios";
import { DataService as ds } from "./dataService";
import { BASE_URL } from "configuration";

const BACKEND_URL = BASE_URL + '/api/'

const getToken = () => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('usertoken') || '')?.replace(/"/g, '');
    }
}

const token = '925e88460339fd6cc775aa8f823fcc53e4e8bc4b64a40a4697ccefd8cfea7e8592090979dbd98c2398cf9f3ef42aca0b9386d0fb044d6d5735a12196fa4ca5cbded0e585a65c18410d343e0c751129de9b7370a73a92f0c1e4eebeda1ff3382e50a9567f06308cf6adb26fb8f8b65e0a5cd2e132cd637f85076169e18ba62abf';

const headers = {
    Authorization: `Bearer ${token}`,
}

const APIs = {

    /* ---------------- general token based apis ----------------- */

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

    searchFilter: (make: string, model: string, year: string, categories: [], sub_category: [], price: any) => {
        let searchposition = 0, orposition = -1, andposition = 0;
        const incrementSearchPosition = () => searchposition += 1;
        const incrementOrPosition = () => orposition += 1;
        const incrementAndPosition = () => andposition += 1;
        // console.log(incrementOrPosition(), incrementAndPosition())
        // let categoryQuery = categories.map((category: any) => (
        //     `&filters[$or][${incrementFilterPosition() + ''}][category][category_name][$eq]=${category}`
        // ));
        // let subcategoryQuery = sub_category.map((subcat: any) => (
        //     `&filters[$or][${incrementFilterPosition() + ''}][sub_category][name][$eq]=${subcat}`
        // ));

        // return axios.get(
        //     BACKEND_URL + `products?populate=*${`&filters[$or][0][price][$between]=${price.min}&filters[$or][0][price][$between]=${price.max}`}` +
        //     `${make && `&filters[$or][1][$and][${incrementSearchPosition() + ''}][cardetail][make][$contains]=${make}`}` +
        //     `${model && `&filters[$or][1][$and][${incrementSearchPosition() + ''}][cardetail][model][$contains]=${model}`}` +
        //     `${year && `&filters[$or][1][$and][${incrementSearchPosition() + ''}][cardetail][year][$eq]=${year}`}` +
        //     `${(categoryQuery.length && !subcategoryQuery.length) ? categoryQuery.join().replace(',', '') : ''}` +
        //     `${subcategoryQuery.length ? subcategoryQuery.join().replace(',', '') : ''}`, 
        //     {headers}
        // )
        const categoryQuery = () => (categories.map((category: any) => (
            `&filters[$or][${incrementOrPosition() + ''}][$and][${incrementAndPosition() + ''}][category][category_name][$eq]=${category}`
        )).join().replace(',', ''));
        const subcategoryQuery = () => (sub_category.map((subcat: any) => (
            `&filters[$or][${incrementOrPosition() + ''}][$and][${incrementAndPosition() + ''}][sub_category][name][$eq]=${subcat}`
        )).join().replace(',', ''));

        return axios.get(
            BACKEND_URL + `products?populate=*${`&filters[$and][0][price][$between]=${price.min}&filters[$and][0][price][$between]=${price.max}`}` +
            `${make && `&filters[$and][${incrementSearchPosition() + ''}][cardetail][make][$eq]=${make}`}` +
            `${model && `&filters[$and][${incrementSearchPosition() + ''}][cardetail][model][$eq]=${model}`}` +
            `${year && `&filters[$and][${incrementSearchPosition() + ''}][cardetail][year][$eq]=${year}`}` +
            `${(categories.length) ? categoryQuery() : ''}` +
            `${sub_category.length ? subcategoryQuery() : ''}`, 
            {headers}
        )
    },
    
    getParts: (input: any) => axios.get(BACKEND_URL + `parts?populate=*&filters[$and][][parts][$contains]=${input}`, {headers}),

    getAllProducts: (sortFilter = '') => axios.get(BACKEND_URL + 'products?populate=*' + sortFilter, {headers}),

    getAllSellerProducts: (username: any) => axios.get(BACKEND_URL + `products?populate=*&filters[$and][][seller][$eq]=${username}&sort[0]=createdAt:desc`, {headers}),
    
    getProduct: (id: any) => axios.get(BACKEND_URL + 'products/' + id + '?populate=*', {headers}),

    paymentUpdate: () => axios.post(BACKEND_URL + 'payment-status-update', {headers}),

    getLicenseplate: (data: any) => axios.get(BACKEND_URL + `cardetails?populate=*&filters[licenseplate][$contains]=${data}`, {headers}),    


        /* ---------------- jwt token based apis ----------------- */

    addToCart: (cartData: {}) => ds.post(BACKEND_URL + 'cartdata', cartData),
    
    getCartData: (customerData: {}) => ds.post(BACKEND_URL + 'getcartdetails', customerData),
    
    updateCartData: (updateItem: {}) => ds.post(BACKEND_URL + 'updatecartdata', updateItem),
    
    deleteCartData: (deleteItem: {}) => ds.post(BACKEND_URL + 'deletecartdata', deleteItem),
    
    cartPayment: (productsData: {}) => ds.post(BACKEND_URL + 'Payment-opp', productsData),

    paymentStatus: (transactionId: string) => ds.post(BACKEND_URL + 'payment-status-get', {transactionid: transactionId}),

    getSpecificUser: (id: number) => ds.get(BACKEND_URL + `users/${id}?populate=*`),

    updateSpecificUser: (id: number, userData: any) => ds.put(BACKEND_URL + `users/${id}`, userData),
    
    createNewList: (data: any) => ds.post(BACKEND_URL + 'products', {...data}),

    updateList: (id: any , data: any) => ds.put(BACKEND_URL + 'products/' + id, {...data}),

    deleteProduct: (id: any) => ds.delete(BACKEND_URL + 'products/'+ id, {headers}),

    uploadImage: (picData: any) => axios.post(BACKEND_URL + 'upload', picData, {headers: {
        Authorization: `Bearer ${getToken()}`,
        'content-type': 'multipart/form-data'
    }}),

    getCustomerOrder: (username: string) => ds.post(BACKEND_URL + 'order-distinct-user?populate=*', {user_name: username}),

    getOrderDetails: (orderId: string) => ds.get(BACKEND_URL + 'order-details?populate=*&filters[$and][0][orderid][$eq]=' + orderId),

    getOrderWithTransactionid: (transactionId: string) => ds.get(BACKEND_URL + 'order-details?populate=*&filters[$and][0][transaction_id][$eq]=' + transactionId),

    getSellerOrder: (sellerUsername: string) => ds.post(BACKEND_URL + 'order-distinct-seller?populate=*', {seller_name: sellerUsername}),

    setParts: (data: any) => ds.post(BACKEND_URL + 'parts',  {...data}),


}

export default APIs