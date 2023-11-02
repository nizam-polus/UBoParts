import axios from "axios";
import { DataService as ds } from "./dataService";
import { BASE_URL } from "configuration";

const BACKEND_URL = BASE_URL + '/api/'

const getToken = () => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('usertoken') || '')?.replace(/"/g, '');
    }
}

const token = 'f7a6b0263f2c433d17994cefee193b9d8e6a7fed0daa9ae53599bd1f5d2d63ea1a2b00eeea638bff0833d169d8da8413ef49cc5ac03e1e601025c924e93c9039b07a384ad6fee46b1069c79d34b68951f10580b87d59142351ae682cf14a091c81acff1ed6c2ff62e66e966e62d9a6226bbbcac88961692f5bf7dd5378e47c0d';

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

    getSaleOffers: () => axios.get(BACKEND_URL + 'products?populate=*&filters[$and][][sale][discount_percentage_value][$gt]=0&sort[0]=updatedAt:desc', {headers}),

    getTopSelling: () => axios.get(BACKEND_URL + 'top-selling', {headers}),

    getSubcategories: (categoryId: number) => axios.post(BACKEND_URL + 'select-subcategory', {categoryid: categoryId}, {headers}),

    getCarMake: () => axios.get(BACKEND_URL + 'cardetail-make', {headers}),

    getCarModel: (makeId: number) => axios.post(BACKEND_URL + 'cardetailmodel', {param_make: makeId}, {headers}),

    getCarYear: (modelId: number) => axios.post(BACKEND_URL + 'cardetailyear', {param_model: modelId}, {headers}),

    getSale: () => axios.get(BACKEND_URL + 'sales?sort[0]=createdAt:asc'),

    searchProducts: (make: string, model: string, year: string, category: string, filter: any, sellerid = '') => {
        return axios.get(
            BACKEND_URL + `products?populate=*` + `${filter.sort}&pagination[page]=${filter.page}&pagination[pageSize]=18` + 
                `${make && `&filters[$and][0][make][id][$eq]=${make}`}` +
                `${model && `&filters[$and][1][model][id][$eq]=${model}`}` + 
                `${year && '&filters[$and][2][year][id][$eq]='+year}${category && `&filters[$and][][category][category_name][$eq]=${category}`}` + 
                `${sellerid && '&filters[$and][3][seller_id][$ne]=' + sellerid}`, {headers}
        )
    },

    searchFilter: (vehicle: any, categories: [], selectedCategories: [], selectedSubcategories: [], price: any, filter: any, sellerid = '') => {
        let searchposition = -1, orposition = -1, andposition = 0;
        let filterCategories: any = [];
        const incrementSearchPosition = () => searchposition += 1;
        const incrementOrPosition = () => orposition += 1;
        const incrementAndPosition = () => andposition += 1;

        for (let obj of categories) {
            for (let category of selectedCategories) {
                let newCategory: any = {category: '', subcategory: []}
                if (category === obj['category_name']) {
                    newCategory.category = category;
                    let subCategoryObject: any = obj['subcategories'];
                    for (let subCatObj of subCategoryObject) {
                        for (let subCat of selectedSubcategories) {
                            if (subCatObj.name === subCat) {
                                delete newCategory.category;
                                newCategory.subcategory.push(subCat);
                            }
                        }
                    }
                    filterCategories.push(newCategory);
                }
            }
        }
        
        const categoryQuery = () => {
            let query = '';
            filterCategories.forEach((filtered: any) => {
                query += filtered.category ? `&filters[$or][${incrementOrPosition() + ''}][category][category_name][$eq]=${filtered.category}` : '';
                query += filtered.subcategory.length ? 
                        filtered.subcategory.map((subcat: any) => (`&filters[$or][${incrementOrPosition() + ''}][sub_category][name][$eq]=${subcat}`)).join().replace(',', '') : '';
            })
            return query;
        };

        return axios.get(
            BACKEND_URL + `products?populate=*` + `${filter.sort}&pagination[page]=${filter.page}&pagination[pageSize]=18` +
            `${`&filters[$and][0][price][$between]=${price.min}&filters[$and][0][price][$between]=${price.max}`}` +
            `${vehicle.make && `&filters[$and][${incrementAndPosition() + ''}][make][id][$eq]=${vehicle.make}`}` +
            `${vehicle.model && `&filters[$and][${incrementAndPosition() + ''}][model][id][$eq]=${vehicle.model}`}` +
            `${vehicle.year && `&filters[$and][${incrementAndPosition() + ''}][year][id][$eq]=${vehicle.year}`}` +
            `${(filterCategories.length) ? categoryQuery() : ''}` +
            `${sellerid && `&filters[$and][${incrementAndPosition()}][seller_id][$ne]=${sellerid}`}`,
            {headers}
        )
    },
    
    getParts: (input: any) => axios.get(BACKEND_URL + `parts?populate=*&filters[$and][][parts][$contains]=${input}`, {headers}),

    getAllProducts: (sortFilter = '') => axios.get(BACKEND_URL + 'products?populate=*' + sortFilter, {headers}),

    getCheckAllProducts: (articleNumber: any) => axios.get(BACKEND_URL + 'products?populate=*' + 
                                       `&filters[$and][0][article_number][$eq]=${articleNumber}`, {headers}),

    getAllPaginationProducts: (page = '1', filter = "sort[0]=createdAt:desc", sellerid='') => {
        return axios.get(BACKEND_URL + `products?${filter}&pagination[page]=${page}&pagination[pageSize]=18&populate=*` + 
        `${sellerid && '&filters[$and][3][seller_id][$ne]=' + sellerid}`, {headers})
    },

    getAllSellerProducts: (username: any, page="1") => {
        return axios.get(BACKEND_URL + `products?populate=*&filters[$and][][seller][$eq]=${username}` + 
                    `&sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=10`, {headers})
    },
    
    getProduct: (id: any) => axios.get(BACKEND_URL + 'products/' + id + '?populate=*', {headers}),

    getProductUsingArticleNumber: (articleNumber: any) => axios.get(BACKEND_URL + 'products?populate=*&filters[$and][0][article_number][$contains]=' + articleNumber, {headers}),
       
    getCountries: () => axios.get(BACKEND_URL + 'countries/', {headers}),

    getMakes: (pageNum: any, itemCount: any) => axios.get(BACKEND_URL + `makes?populate=*&sort[0]=id:asc&pagination[page]=${pageNum}&pagination[pageSize]=${itemCount}`),

    paymentUpdate: () => axios.post(BACKEND_URL + 'payment-status-update', {headers}),

    getLicenseplate: (data: any) => axios.get(BACKEND_URL + `cardetails?populate=*&filters[licenseplate][$contains]=${data}`, {headers}),    

    requestPart: (formData: any) => axios.post(BACKEND_URL + 'request-parts', {data: formData}, {headers}),

    dismantleCar: (formData: any) => axios.post(BACKEND_URL + 'dismantles', {data: formData}, {headers}),

    uploadImageForDismantle: (picData: any) => axios.post(BACKEND_URL + 'upload', picData, {headers: {
        Authorization: headers.Authorization,
        'content-type': 'multipart/form-data'
    }}),

    verifyUser: (userData: any) => axios.post(BACKEND_URL + 'user-verify', userData, {headers}),

    forgotPassword: (data: any) => axios.post(BACKEND_URL + 'forget-password-mail', data, {headers}),

    resetPassword: (resetData: any) => axios.post(BACKEND_URL + 'forget-password-reset', resetData, {headers}),

    userToSeller: (data: any) => axios.post(BACKEND_URL + 'user-to-seller', data, {headers}),

    contactUs: (contactData: any) => axios.post(BACKEND_URL + 'contact-us', contactData, {headers}),

    newsletter: (email: string) => axios.post(BACKEND_URL + 'newsletters', {data: {email}}, {headers}),


        /* ---------------- jwt token based apis ----------------- */

    addToCart: (cartData: {}) => ds.post(BACKEND_URL + 'cartdata', cartData),
    
    getCartData: (customerData: {}) => ds.post(BACKEND_URL + 'getcartdetails', customerData),
    
    updateCartData: (updateItem: {}) => ds.post(BACKEND_URL + 'updatecartdata', updateItem),
    
    deleteCartData: (deleteItem: {}) => ds.post(BACKEND_URL + 'deletecartdata', deleteItem),
    
    cartPayment: (productsData: {}) => ds.post(BACKEND_URL + 'Payment-opp', productsData),

    paymentStatus: (transactionId: string, customerId: number) => ds.post(BACKEND_URL + 'payment-status-get', {transactionid: transactionId, customerid: customerId}),

    getSpecificUser: (id: number) => ds.get(BACKEND_URL + `users/${id}?populate=*`),

    updateSpecificUser: (id: number, userData: any) => ds.put(BACKEND_URL + `users/${id}`, userData),
    
    createNewList: (data: any) => ds.post(BACKEND_URL + 'products', {...data}),

    updateList: (id: any , data: any) => ds.put(BACKEND_URL + 'products/' + id, {...data}),

    deleteProduct: (id: any) => ds.delete(BACKEND_URL + 'products/'+ id, {headers}),

    uploadImage: (picData: any) => axios.post(BACKEND_URL + 'upload', picData, {headers: {
        Authorization: `Bearer ${getToken()}`,
        'content-type': 'multipart/form-data'
    }}),

    deleteImage: ( id: any) => axios.delete(BACKEND_URL + `upload/files/${id}`,  {headers: {
        Authorization: `Bearer ${getToken()}`,
        'content-type': 'multipart/form-data'
    }}),

    getCustomerOrder: (username: string) => ds.post(BACKEND_URL + 'order-distinct-user?populate=*&sort[0]=createdAt:desc', {user_name: username}),

    getOrderDetails: (orderId: string) => ds.get(BACKEND_URL + 'order-details?populate=*&filters[$and][0][orderid][$eq]=' + orderId),

    getOrderWithTransactionid: (transactionId: string) => ds.get(BACKEND_URL + 'order-details?populate=*&filters[$and][0][transaction_id][$eq]=' + transactionId),

    getSellerOrder: (sellerUsername: string) => ds.post(BACKEND_URL + 'order-distinct-seller?populate=*&sort[0]=id:desc', {seller_name: sellerUsername}),

    getAllSellerOrders: (sellerUsername: string) => ds.get(BACKEND_URL + 'order-details?populate=*&filters[$and][][seller][$eq]=' + sellerUsername),

    setParts: (data: any) => ds.post(BACKEND_URL + 'parts',  {...data}),

    getShippingCost: (data: any) => ds.post(BACKEND_URL + 'shipping-cost', data),

    getAdminStatus: () => axios.get(BACKEND_URL + 'merchant-profile-data'),

    getAccountStatus: (data: any) => ds.post(BACKEND_URL + "merchant-specific-bank-details", data)
}

export default APIs