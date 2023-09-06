import axios from "axios";
import { DataService as ds } from "./dataService";
import { BASE_URL } from "configuration";

const BACKEND_URL = BASE_URL + '/api/'

const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('usertoken')
    }
}

const APIs = {

    auth: (userdata: {}) => axios.post(BACKEND_URL + 'auth/local', userdata),

    register: (userdata: {}) => axios.post(BACKEND_URL + 'auth/local/register', userdata),

    getCarDetailsUsingLicence: (licenseplate: string) => ds.post(BACKEND_URL + `cardetail-external-internal`, {licenseplate: licenseplate}),

    getCarDetails: () => ds.get(BACKEND_URL + 'cardetails?populate=*&pagination[page]=1&pagination[pageSize]=1000&sort[0]=licenseplate:asc'),

    getCategories: () => ds.get(BACKEND_URL + 'categories?populate=*&sort[0]=id:asc'),

    getCarMake: () => ds.get(BACKEND_URL + 'cardetail-make'),

    getCarModel: (make: {}) => ds.post(BACKEND_URL + 'cardetailmodel', make),

    getCarYear: (make_model: {}) => ds.post(BACKEND_URL + 'cardetailyear', make_model),

    searchProducts: (make: string, model: string, year: string, category: string) => {
        return ds.get(
            BACKEND_URL + `products?populate=*&filters[$and][][cardetail][make][$contains]=${make}&filters[$and][][cardetail][model][$contains]=${model}${year && 
                '&filters[$and][][cardetail][year][$eq]='+year}&filters[$and][][category][category_name][$contains]=${category}`
        )
    },

    getAllProducts: () => ds.get(BACKEND_URL + 'products?populate=*'),

    addToCart: (cartData: {}) => ds.post(BACKEND_URL + 'cartdata', cartData),

    getProduct: (id: any) => ds.get(BACKEND_URL + 'products/' + id + '?populate=*'),

    getCartData: (customerData: {}) => ds.post(BACKEND_URL + 'getcartdetails', customerData),

    updateCartData: (updateItem: {}) => ds.post(BACKEND_URL + 'updatecartdata', updateItem),

    deleteCartData: (deleteItem: {}) => ds.post(BACKEND_URL + 'deletecartdata', deleteItem),

    cartPayment: (productsData: {}) => ds.post(BACKEND_URL + 'Payment-opp', productsData),

    paymentStatus: (transactionId: string) => ds.post(BACKEND_URL + 'payment-status-get', {transactionid: transactionId}),

    paymentUpdate: () => ds.post(BACKEND_URL + 'payment-status-update', ),

    getSpecificUser: (id: number) => axios.get(BACKEND_URL + `users/${id}?populate=*`, {headers: {
        Authorization: `Bearer ${getToken()?.replace(/"/g, '')}`
    }}),

    updateSpecificUser: (id: number, userData: any) => axios.put(BACKEND_URL + `users/${id}`, userData, {headers: {
        Authorization: `Bearer ${getToken()?.replace(/"/g, '')}`
    }})

}

export default APIs