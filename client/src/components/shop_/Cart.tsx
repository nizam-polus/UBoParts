import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '../shared/AppImage';
import { useRouter } from 'next/router';
import Link from 'next/link';
import APIs from '~/services/apiService';
import { BASE_URL } from 'configuration';
import { UserContext } from '../account_/UserContext';
import { toast } from 'react-toastify';

function Cart() {

    const { user, saveUser, setCartCount } = UserContext();
    const [cartProducts, setCartProducts] = useState<any>([]);
    const [totalCartPrice, setTotal] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0)
    const [isError, setIsError] = useState<{ [key: string]: string | null }>({});
    const [inputValue, setInputValue] = useState("");
    const [debouncedInputValue, setDebouncedInputValue] = useState("");
    const [changeProduct,setChangeProduct] = useState<any>({})
    const [totalShippingCost, setTotalShippingCost] = useState<any>()
    const [countries, setCountries] = useState([]);
    const [checkoutProducts, setCheckoutProducts]: any = useState([]);
    const [clicked, setClicked] = useState<boolean>(false)
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        company: '',
        email: '',
        phone_number: '',
        streetaddress_housenumber: '',
        streetaddress_apartment: '',
        city: '',
        state: '',
        country: '',
        postcode: ''
    });
    const [shippingData, setShippingData] = useState({
        shippingaddress_country: formData.country,
        shippingaddress_streataddress_housenumber: formData.streetaddress_housenumber,
        shippingaddress_streataddress_apartment: formData.streetaddress_apartment,
        shippingaddress_city: formData.city,
        shippingaddress_state: formData.state,
        shippingaddress_postcode: formData.postcode,
        shippingaddress_phonenumber: formData.phone_number
    });
    const router = useRouter();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedInputValue(inputValue);
            debouncedQuantityInputOnChange(changeProduct, inputValue, null)
        }, 500);
        return () => clearTimeout(timeoutId);
      }, [inputValue, 500]);

    useEffect(() => {
        APIs.getCartData({ "customerid": user.id }).then((response: any) => {
            setCartProducts(response.data.rows);
            if (response.data.rows.length) {
                let total = 0;
                let totalDiscount = 0
                for (const obj of response.data.rows) {
                    total += obj.total_price;
                    totalDiscount += obj.discount_price
                }
                setTotal(total);
                setTotalDiscount(totalDiscount)
            }
        })
            .catch((error) => {
                // setError(error);
            });
    }, []);

    const handleCartItemDelete = (product: any) => {
        APIs.deleteCartData({ customerid: product.customer_id, id: product.id }).then(response => {
            APIs.getCartData({ "customerid": user.id }).then((response: any) => {
                setCartProducts(response.data.rows);
                setCartCount(response.data.rows.length);
                let total = 0;
                let totalDiscount = 0;
                if (response.data.rows.length) {
                    for (const obj of response.data.rows) {
                        total += obj.total_price;
                        totalDiscount += obj.discount_price
                    }
                }
                setTotal(total);
                setTotalDiscount(totalDiscount)
            })
                .catch((error) => {
                    // setError(error);
                });
        }).catch(err => {
            console.log(err);
        })
    }
    function discountAmount(originalPrice: any, discountPercentage: any) {
        const original = parseFloat(originalPrice);
        const discount = parseFloat(discountPercentage);
        if (isNaN(discount)) {
            return 0; 
        }
        const discountAmount = (original * discount) / 100;
        return +discountAmount.toFixed(2); 
    }  
    const handleQuantityChange = (product: any, valueChange: string, index: number) => {
        let newQuantity = product.quantity;
        if (valueChange === 'inc') {
            newQuantity++;
        } else if (valueChange === 'dec' && newQuantity > 1) {
            newQuantity--;
        }
        const updatedCartProducts = [...cartProducts]; 
        updatedCartProducts[index].quantity = newQuantity; 
        setCartProducts(updatedCartProducts); 
    
        APIs.updateCartData({
            customerid: user.id,
            id: product.id,
            quantity: newQuantity,
            productprice: product.price,
            "productWeight": product?.product_weight,
            "discountPrice": discountAmount(product.price,product.discount_percentage_value),
        }).then(response => {
            if (response.data.error) {
                setIsError(prevErrors => ({
                    ...prevErrors,
                    [response.data.error.id]: response.data.error.message
                }));
                setTimeout(() => {
                    setIsError(prevErrors => ({
                        ...prevErrors,
                        [response.data.error.id]: null
                    }));
                }, 3000);
            } else {
                setIsError(prevErrors => ({
                    ...prevErrors,
                    [product.product_id]: null
                }));          
            }
            APIs.getCartData({ customerid: user.id }).then((response: any) => {            
                setCartProducts(response.data.rows);
                if (response.data.rows.length) {
                    let total = 0;
                    let totalDiscount =0;
                    for (const obj of response.data.rows) {
                        total += obj.total_price;
                        totalDiscount += obj.discount_price
                    }
                    setTotal(total);
                    setTotalDiscount(totalDiscount)
                }
            }).catch((error) => {
                console.error(error);
            });
           
        }).catch(err => {
            console.error(err);
        });
    }
    const updateLocalState = (product:any, newQuantity:any, index:any) => {
        product.quantity = newQuantity;
        const updatedCartProducts = [...cartProducts]; 
        updatedCartProducts[index].quantity = newQuantity; 
        setCartProducts(updatedCartProducts); 
    };
    const debouncedQuantityInputOnChange = (product:any, newQuantity:any, index:any) => {
        APIs.updateCartData({
            customerid: user.id,
            id: product.id,
            quantity: newQuantity,
            productprice: product.price,
            "productWeight": product?.product_weight,
            "discountPrice": discountAmount(product.price,product.discount_percentage_value),
        }).then(response => {
            if (response.data.error) {
                setIsError(prevErrors => ({
                    ...prevErrors,
                    [response.data.error.id]: response.data.error.message
                }));
                setTimeout(() => {
                    setIsError(prevErrors => ({
                        ...prevErrors,
                        [response.data.error.id]: null
                    }));
                }, 3000);
            } else {
                setIsError(prevErrors => ({
                    ...prevErrors,
                    [product.product_id]: null
                }));
            }
                  APIs.getCartData({ customerid: user.id }).then((response) => {
                    setCartProducts(response.data.rows);
                    if (response.data.rows.length) {
                        let total = 0;
                        let totalDiscount = 0;
                        for (const obj of response.data.rows) {
                            total += obj.total_price;
                            totalDiscount += obj.discount_price
                        }
                        setTotal(total);
                        setTotalDiscount(totalDiscount)
                    }
                }).catch((error) => {
                    console.error(error);
                });  
        }).catch(err => {
            console.error(err);
        });
    }

    const quantityInputOnChange = (product:any, newQuantity:any, index:any) => {
        setInputValue(newQuantity);
        setChangeProduct(product);
        updateLocalState(product, newQuantity, index); // Update local state immediately
    };

    const CheckoutFunction = () =>{
        setClicked(true)
        let isValidShipping = true
        APIs.getCountries().then(response => {
            let countries: any = response.data.data;
            setCountries(countries);
            APIs.getCartData({ customerid: user.id }).then(response => {
                let checkoutProducts = response.data.rows;
                setCheckoutProducts(checkoutProducts);
                let sellerIdsArray: any = [];
                checkoutProducts.forEach((product: any) => {
                    let sellerId = product.seller_id;
                    if (!sellerIdsArray.includes(sellerId)) {
                        sellerIdsArray.push(sellerId);
                    }
                });
                let totalShippingCost = 0;
                let shippingcostapidataArray: any = [];

                const getContryCode = (country: string, countries: any[]) =>{
                    let countryData: any = countries.find((item: any, index) => item.attributes.country == country);
                    return countryData?.attributes?.code;
                 }        
                const shippingDataPromises = sellerIdsArray.map((sellerId: any) => {
                    return APIs.getSpecificUser(sellerId).then((res) => {
                        let shippingCountryCode = getContryCode(res.data.shippingaddress_country, countries);
                        let buyyerShippingCountryCode = getContryCode((user.shippingaddress_country || formData.country), countries)
                        let postingCode = res.data.shippingaddress_postcode;
                        let total: any = 0, totalDiscount = 0, totalWeight = 0;
                        if (checkoutProducts.length) {
                            checkoutProducts.forEach((product: any) => {
                                if (product.seller_id === sellerId) {
                                  totalWeight += product.total_weight;
                                }
                            });
                        }
                        const shippingDataForApi = {
                            "seller_id": sellerId,
                            "shippingaddress_postcode": user.shippingaddress_postcode ? user.shippingaddress_postcode : formData.postcode,
                            "shippingaddress_country": buyyerShippingCountryCode,
                            "product_weight": totalWeight,
                            "from_postal_code": postingCode,
                            "from_country": shippingCountryCode  
                        }
                        shippingcostapidataArray.push(shippingDataForApi)
                        return shippingcostapidataArray   
                    });
                });
                Promise.all(shippingDataPromises).then((shippingDataArray) => {
                    shippingcostapidataArray = shippingDataArray;
                    APIs.getShippingCost({ "shipping_data": shippingcostapidataArray[0] }).then((res: any) => {
                        if (!res?.data?.length) {
                            isValidShipping = false;
                        } else {
                            const shippingCostArray = res.data; 
                            let totalShippingCost = 0; 
                            for (const item of shippingCostArray) {
                                const price = parseFloat(item.price_details);
                                if (isNaN(price)) {
                                    isValidShipping = false
                                    break;
                                } else {
                                    totalShippingCost += price;
                                }
                            }
                            setTotalShippingCost(totalShippingCost);
                        }
                        if (!user.country || !user.postcode){
                            toast.error(() => <div>Please complete your profile to proceed. <Link href={'/profile_'}>Profile</Link></div>, {autoClose: 4000});
                            setClicked(false);
                            return;
                        }
                        if (!cartProducts.length){
                            toast.warning("Your cart is Empty");
                            router.push("/cartpage");
                            setClicked(false)
                        } else if (!isValidShipping){
                            toast.error("Product weight or Delivery region is not eligible for shipping.", {autoClose: 4000});
                            setClicked(false)
                            return;
                        } else {
                            router.push('/checkoutpage');
                        }
                    });
                });
            }).catch(err => {
                console.log(err);
            });
        });    
    }

    return (
        <>
            <div className="main-body pb-4 pt-4">
                <div className="container pb-4">
                    <section className="card-wrapper">
                        <div className="row">
                            <div className="col text-center pt-2 pb-2">
                                <span className="semifont bg-image-text custom-color-8 text-center">Shopping Cart</span>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-12 col-md-9">
                                <div className="table-responsive">
                                    <table className="table cart-table coulmn-bg-color-1 rounded ">
                                        <tbody>
                                            <tr className="border-bottom ">
                                                <th className=" p-3 custom-color-3 regularfont boldfontsize text-center border-top-0 lightfotweight col-sm-2">IMAGE</th>
                                                <th className=" p-3 custom-color-3 regularfont boldfontsize border-top-0 lightfotweight col-sm-5">PRODUCT</th>
                                                <th className=" p-3 custom-color-3 regularfont boldfontsize text-center border-top-0 lightfotweight col-sm-2">PRICE</th>
                                                <th className=" p-3 custom-color-3 regularfont boldfontsize text-center border-top-0 lightfotweight col-sm-1">QUANTITY</th>
                                                <th className=" p-3 custom-color-3 regularfont boldfontsize text-center border-top-0 lightfotweight col-sm-2">TOTAL</th>
                                                <th className=" pr-3 custom-color-3 regularfont boldfontsize text-center border-top-0 lightfotweight col-sm-2">DELETE</th>
                                            </tr>
                                            {cartProducts && cartProducts.map((product: any, index: any) => {
                                                
                                                return (<tr>
                                                    <td className="p-3 text-center">
                                                        <AppImage src={BASE_URL + product.url} className="rounded" />
                                                    </td>
                                                    <td className="p-3 custom-color-3 regularfont mini-text-2">
                                                        <div>
                                                            <Link href={'/products_/' + product.product_id}>
                                                                <span style={{ textDecoration: 'none', cursor: 'pointer' }}>{product.title}</span>
                                                            </Link>
                                                        </div>
                                                        {/* <div className="d-md-flex">
                                                            <span>Kila International</span>
                                                            <span className="in-stock custom-color-6 rounded-pill d-flex mini-text-4">Seller</span></div> */}
                                                    </td>
                                                    {
                                                    product.discount_price == 0
                                                        ?
                                                        <td className="p-3 custom-color-3 semifont mini-text-3 text-center ">€{product.price}</td>
                                                        :
                                                        <td className="p-3 custom-color-3 semifont mini-text-3 text-center "><s style={{color: "grey"}}>€{product.price}</s>  €{product.price - discountAmount(product.price,product.discount_percentage_value)}</td>
                                                    }
                                                    
                                                    <td className="p-3 custom-color-3 regularfont">
                                                        <div className="input-group quanitity-box quanitity-incrementor">
                                                            <span className="input-group-btn plus-icon regularfont pointer" style={{cursor: `${product.quantity == 1 ? "not-allowed" : "pointer"}`}} onClick={() => handleQuantityChange(product, 'dec', index)}>
                                                                <i className="fa fa-minus mini-text-0 mini-text-0-color " aria-hidden="true"></i>
                                                            </span>
                                                                 <input
                                                                   type="text"
                                                                   name="quant[1]"
                                                                   style={{ maxHeight: '25px' }}
                                                                   className="form-control input-number text-center rounded-pill border-0 regularfont px-2 pb-1 pt-1 mini-text-3 h-auto"
                                                                   value={product.quantity}
                                                                   min="1"
                                                                   max="10"
                                                                   onChange={(e) => {
                                                                     const newValue = e.target.value.replace(/[^0-9.]/g, '');
                                                                     if (newValue === '0' || newValue == "") {
                                                                       // Treat '0' as an empty input
                                                                       e.target.value = '';
                                                                    //    alert("Quantity cannot be zero(0) / empty")
                                                                     }
                                                                     else{
                                                                         quantityInputOnChange(product, newValue, index);
                                                                     }
                                                                   }}
                                                                 />
                                                            {
                                                                product.quantity === product.stock_count  ?
                                                                    <span className="input-group-btn minus-icon regularfont" style={{cursor: "not-allowed"}}>
                                                                        <i className="fa fa-plus mini-text-0 mini-text-0-color " aria-hidden="true"></i>
                                                                    </span>
                                                                    :
                                                                    <span className="input-group-btn minus-icon regularfont pointer" onClick={() => handleQuantityChange(product, 'inc', index)}>
                                                                        <i className="fa fa-plus mini-text-0 mini-text-0-color " aria-hidden="true"></i>
                                                                    </span>
                                                            } 
                                                            <span className="text-center text-danger mini-text-0" >
                                                                {isError[product.product_id]}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 custom-color-3 semifont mini-text-3 text-center">€{product.total_price - product.discount_price}</td>
                                                    <td className='pl-3'><i className='fa fa-trash pointer' onClick={() => handleCartItemDelete(product)}></i></td>
                                                </tr>)
                                            })}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td className="p-3" colSpan={2}>
                                                    <Link href={'/shop'}><button type="button"
                                                        className="add-more-rows custom-color-7 semifont mini-text-3 rounded border-0 button-bg-color-1"
                                                    >Add more items</button></Link>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <div className="col-12 col-md-3">
                                <div className="table-responsive">
                                    <table className="cart-total table coulmn-bg-color-1 rounded">
                                        <tbody >
                                            <tr>
                                                <th className="p-3 custom-color-3 boldfont subtitles-1 border-top-0">Cart Total</th>
                                            </tr>
                                            {totalDiscount != 0 
                                            ?
                                                <>
                                                    <tr className="border-top">
                                                        <td className="pb-1 pt-4 pl-3 regularfont placeholderfontsize border-top-0">Price</td>
                                                        <td className="pb-1 pt-4  border-top-0 menu_font_size custom-color-3">€{totalCartPrice.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="pb-1 pt-4 pl-3 regularfont placeholderfontsize border-top-0">Discount</td>
                                                        <td className="pb-1 pt-4 border-top-0 menu_font_size custom-color-3">- €{totalDiscount.toFixed(2)}</td>
                                                    </tr>
                                                </>
                                            :
                                                ""
                                            }
                                            <tr>
                                                <td className="pb-0 pt-0 pr-0 pl-3 semifont boldfontsize border-top-0"> <hr className="p-0 m-0 " /></td>
                                                <td className="pb-0 pt-0 pl-0 pr-4 regularfont boldfontsize border-top-0"> <hr className="p-0 m-0" /></td>
                                            </tr>
                                            <tr>
                                                <td className="pb-2 pt-1 pr-0 pl-3 semifont boldfontsize border-top-0"> Subtotal</td>
                                                <td className="pb-2 pt-1 pl-0 semifont boldfontsize border-top-0 custom-color-3">€{(totalCartPrice - totalDiscount).toFixed(2)}</td>
                                            </tr>
                                            <tr><td colSpan={2} className="px-3 pt-3 pb-2 w-100">
                                                {
                                                clicked ? 
                                                    <button type="button" disabled className=" w-100 proceed-to-checkout custom-color-7 semifont mini-text-3 rounded border-0 button-bg-color-1">
                                                    <button type="button" className=" w-100 proceed-to-checkout custom-color-7 semifont mini-text-3 rounded border-0 button-bg-color-1"
                                                        >Proceeding..</button>
                                                    </button>
                                                :
                                                    <button type="button" onClick={CheckoutFunction} className=" w-100 proceed-to-checkout custom-color-7 semifont mini-text-3 rounded border-0 button-bg-color-1">
                                                    <button type="button" className=" w-100 proceed-to-checkout custom-color-7 semifont mini-text-3 rounded border-0 button-bg-color-1"
                                                        >Proceed to checkout</button>
                                                    </button>
                                                }
                                               
                                            </td></tr>
                                            <tr>
                                                <td className="advanced_search pb-2 pt-0 pr-0 pl-4 semifont mini-text-1 border-top-0">* Shipping cost will be extra</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
export default Cart;