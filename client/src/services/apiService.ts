import { DataService as ds } from "./dataService";
import { BASE_URL } from "configuration";

const BACKEND_URL = BASE_URL + '/api/'

const APIs = {

    auth: (userdata: {}) => ds.post(BACKEND_URL + 'auth/local', userdata),

    register: (userdata: {}) => ds.post(BACKEND_URL + 'auth/local/register', userdata),

    getCarDetailsUsingLicence: (licenseplate: string) => ds.get(BACKEND_URL + `cardetails?populate=*&filters[licenseplate][$contains]=${licenseplate}`),

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

    addToCart: (cartData: {}) => ds.post(BACKEND_URL + 'cartdata', cartData),

    getProduct: (id: any) => ds.get(BACKEND_URL + 'products/' + id + '?populate=*'),

    getCartData: (customerData: {}) => ds.post(BACKEND_URL + 'getcartdetails', customerData),

    updateCartData: (updateItem: {}) => ds.post(BACKEND_URL + 'updatecartdata', updateItem),

    deleteCartData: (deleteItem: {}) => ds.post(BACKEND_URL + 'deletecartdata', deleteItem),

    cartPayment: (productsData: {}) => ds.post(BACKEND_URL + 'Payment-opp', productsData),

}

export default APIs