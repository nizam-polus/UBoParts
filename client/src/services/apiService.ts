import axios from "axios";
import { DataService as ds } from "./dataService";
import { BASE_URL } from "configuration";

const BACKEND_URL = BASE_URL + '/api/'

const getToken = () => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('usertoken') || '')?.replace(/"/g, '');
    }
}

const token = '16a1c655799a2c5d2dc3a390d2ee7b0cc86d38c8f3facdb8a42e76332906d3f52fd2288f9675f996b17efbb264e72e4479237f7e34abb6221017c5acfa53569cb6e24bcdb0b434d27a2383625734321b2e58ba29e75ba437b97430c7af9fcb70962ce73eef1b4a31add2910407a4c9b80df6dc741c2e2be049c3628dbeba1f92';

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

    getCarModel: (makeId: number) => axios.post(BACKEND_URL + 'cardetailmodel', {param_make: makeId}, {headers}),

    getCarYear: (modelId: number) => axios.post(BACKEND_URL + 'cardetailyear', {param_model: modelId}, {headers}),

    getSale: () => axios.get(BACKEND_URL + 'sales?sort[0]=createdAt:asc'),

    searchProducts: (make: string, model: string, year: string, category: string, filter: any) => {
        return axios.get(
            BACKEND_URL + `products?populate=*` + `${filter.sort}&pagination[page]=${filter.page}&pagination[pageSize]=18` + `&filters[$and][][cardetail][make][$eq]=${make}&filters[$and][][cardetail][model][$eq]=${model}${year && 
                '&filters[$and][][cardetail][year][$eq]='+year}${category && `&filters[$and][][category][category_name][$eq]=${category}`}`, {headers}
        )
    },

    searchFilter: (vehicle: any, categories: [], selectedCategories: [], selectedSubcategories: [], price: any, filter: any) => {
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
            `${vehicle.make && `&filters[$and][${incrementAndPosition() + ''}][cardetail][make][$contains]=${vehicle.make}`}` +
            `${vehicle.model && `&filters[$and][${incrementAndPosition() + ''}][cardetail][model][$contains]=${vehicle.model}`}` +
            `${vehicle.year && `&filters[$and][${incrementAndPosition() + ''}][cardetail][year][$eq]=${vehicle.year}`}` +
            `${(filterCategories.length) ? categoryQuery() : ''}`,
            {headers}
        )
    },
    
    getParts: (input: any) => axios.get(BACKEND_URL + `parts?populate=*&filters[$and][][parts][$contains]=${input}`, {headers}),

    getAllProducts: (sortFilter = '') => axios.get(BACKEND_URL + 'products?populate=*' + sortFilter, {headers}),

    getCheckAllProducts: (articleNumber: any) => axios.get(BACKEND_URL + 'products?populate=*' + 
                                       `&filters[$and][0][article_number][$eq]=${articleNumber}`, {headers}),

    getAllPaginationProducts: (page = '1', filter = "sort[0]=createdAt:desc") => {
        return axios.get(BACKEND_URL + `products?${filter}&pagination[page]=${page}&pagination[pageSize]=18&populate=*`, {headers})
    },

    getAllSellerProducts: (username: any, page="1") => {
        return axios.get(BACKEND_URL + `products?populate=*&filters[$and][][seller][$eq]=${username}` + 
                    `&sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=10`, {headers})
    },
    
    getProduct: (id: any) => axios.get(BACKEND_URL + 'products/' + id + '?populate=*', {headers}),
       
    getCountries: () => axios.get(BACKEND_URL + 'countries/', {headers}),

    getMakes: (pageNum: any, itemCount: any) => axios.get(BACKEND_URL + `makes?populate=*&sort[0]=id:asc&pagination[page]=${pageNum}&pagination[pageSize]=${itemCount}`),

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

    getShippingCost: (data: any) => ds.post(BACKEND_URL + 'shipping-cost', data),

}

export default APIs