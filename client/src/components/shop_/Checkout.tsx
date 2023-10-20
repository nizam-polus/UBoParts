import React, { useCallback, useEffect, useState } from 'react';
import APIs from '~/services/apiService';
import { UserContext } from '../account_/UserContext';

function Checkout() {

    const {user, saveUser} = UserContext(); 
    const [checkoutProducts, setCheckoutProducts]: any = useState([]);
    const [total, setTotal]: any = useState(0);
    const [totalShippingCost, setTotalShippingCost] = useState<any>()
    const [countries, setCountries] = useState([])
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
    const [differentAdd, setDifferentAdd] = useState(false);
    const [shippingData, setShippingData] = useState({
        shippingaddress_country: formData.country,
        shippingaddress_streataddress_housenumber: formData.streetaddress_housenumber,
        shippingaddress_streataddress_apartment: formData.streetaddress_apartment,
        shippingaddress_city: formData.city,
        shippingaddress_state: formData.state,
        shippingaddress_postcode: formData.postcode,
        shippingaddress_phonenumber: formData.phone_number
    });
    const [incomplete, setIncomplete] = useState<any>(false);
    const [shippingIncomplete, setShippingIncomplete] = useState(false);
    const [shippingCostGetApiData, setShippingCostGetApiData] = useState<any>([])

    const getContryCode = (country: string, countries: any[]) =>{
       let countryData: any = countries.find((item: any, index) => item.attributes.country == country);
       return countryData?.attributes?.code;
    }

    useEffect(() => {
        
        setFormData((prevFormData) => ({...prevFormData, 
            first_name: user.first_name,
            last_name: user.last_name,
            company: user.company,
            email: user.email,
            phone_number: user.phone_number,
            streetaddress_housenumber: user.streetaddress_housenumber,
            streetaddress_apartment: user.streetaddress_apartment,
            city: user.city,
            state: user.state,
            country: prevFormData.country || user.country,
            postcode: prevFormData.postcode || user.postcode
        }))

        shippingData.shippingaddress_city = user.shippingaddress_city;
        shippingData.shippingaddress_country = user.shippingaddress_country || formData.country;
        shippingData.shippingaddress_phonenumber = user.shippingaddress_phonenumber;
        shippingData.shippingaddress_postcode = user.shippingaddress_postcode || formData.postcode;
        shippingData.shippingaddress_state = user.shippingaddress_state;
        shippingData.shippingaddress_streataddress_apartment = user.shippingaddress_streataddress_apartment;
        shippingData.shippingaddress_streataddress_housenumber = user.shippingaddress_streataddress_housenumber;
        setShippingData({...shippingData});
    }, []);

    useEffect(() =>{
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
                console.log("array", sellerIdsArray);
                let totalShippingCost = 0;
                let shippingcostapidataArray: any = [];
        
                // Create an array of promises for each seller's shipping data
                const shippingDataPromises = sellerIdsArray.map((sellerId: any) => {
                    return APIs.getSpecificUser(sellerId).then((res) => {
                        let shippingCountryCode = getContryCode(res.data.shippingaddress_country, countries);
                        let buyyerShippingCountryCode = getContryCode((user.shippingaddress_country || formData.country), countries)
                        let postingCode = res.data.shippingaddress_postcode;
                        console.log(shippingCountryCode)
                        let total: any = 0, totalDiscount = 0, totalWeight = 0;
                        if (checkoutProducts.length) {
                            checkoutProducts.forEach((product: any) => {
                                if (product.seller_id === sellerId) {
                                  totalWeight += product.total_weight;
                                }
                            });
                            for (const obj of checkoutProducts) {
                                total += obj.total_price;
                                totalDiscount += obj.discount_price
                            }

                            setTotal(total - totalDiscount);
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
        
                // Wait for all promises to resolve
                Promise.all(shippingDataPromises).then((shippingDataArray) => {
                    // All data has been collected, and the array is complete
                    shippingcostapidataArray = shippingDataArray;
        
                    console.log("shippingData", shippingcostapidataArray);

                    // Now, you can call the getShippingCost API with the complete data
                    APIs.getShippingCost({ "shipping_data": shippingcostapidataArray[0] }).then((res: any) => {
                        if (!res || (res && !res.data.length) ) {
                            setTotal(Number(total));
                        } else {
                            // Calculate the total shipping cost
                            const shippingCostArray = res.data; // Assuming res.data is your array
                    
                            // Use reduce to sum up the shipping costs
                            const totalShippingCost = shippingCostArray.reduce((total: any, item: any) => {
                                return total + parseFloat(item.price_details);
                            }, 0);
                    
                            console.log("Total Shipping Cost: " + totalShippingCost);
                    
                            // Now, you can update your state with the total shipping cost
                            setTotalShippingCost(totalShippingCost)
                            console.log("shippingside",total)
                            // setTotal(total + shippingCost);
                        }
                        console.log("shipping response",res);
                    });
                });
            }).catch(err => {
                console.log(err);
            });
        });
        
    },[formData.country, formData.postcode, shippingData.shippingaddress_country, shippingData.shippingaddress_postcode])

    const checkFormStatus = () => {
        let incomplete = true;
        incomplete = !(!!formData.first_name && 
            !!formData.last_name && !!formData.email && !!formData.phone_number && 
            !!formData.streetaddress_housenumber && !!formData.city && !!formData.state && 
            !!formData.country && !!formData.postcode);
        setIncomplete(incomplete);
        return incomplete;
    }
    const checkShippingDataStatus = () => {
        let shippingincomplete = true;
        shippingincomplete = differentAdd && !(!!shippingData.shippingaddress_city && 
            !!shippingData.shippingaddress_country && !!shippingData.shippingaddress_phonenumber &&
            !!shippingData.shippingaddress_postcode && !!shippingData.shippingaddress_state && 
            !!shippingData.shippingaddress_streataddress_housenumber);
        setShippingIncomplete(shippingincomplete);
        return shippingincomplete;
    }

    const handleFormChange = (event: any) => {
        const { name, value } = event.target;
        setFormData((prevFormData => ({...prevFormData, [name]: value})));
    }

    const handleShippingAddChange = (event: any) => {
        const { name, value } = event.target;
        setShippingData((prevData) => ({...prevData, [name]: value}));
    }

    const handlepayment = () => {     
        let incomplete = checkFormStatus();
        let shippingincomplete = checkShippingDataStatus();
        let reqElement = document.getElementById('required');
        if (reqElement) reqElement.scrollIntoView({behavior: 'smooth'});
        shippingData.shippingaddress_city = shippingData.shippingaddress_city || formData.city;
        shippingData.shippingaddress_country = shippingData.shippingaddress_country || formData.country;
        shippingData.shippingaddress_phonenumber = shippingData.shippingaddress_phonenumber || formData.phone_number;
        shippingData.shippingaddress_postcode = shippingData.shippingaddress_postcode || formData.postcode;
        shippingData.shippingaddress_state = shippingData.shippingaddress_state || formData.state;
        shippingData.shippingaddress_streataddress_apartment = shippingData.shippingaddress_streataddress_apartment || formData.streetaddress_apartment;
        shippingData.shippingaddress_streataddress_housenumber = shippingData.shippingaddress_streataddress_housenumber || formData.streetaddress_housenumber;
        setShippingData({...shippingData});
        if (!incomplete && !shippingincomplete) {
            let formdata: any = {...formData, ...shippingData};
            APIs.updateSpecificUser(user.id, formdata).then(response => {
                saveUser(response.data);
                localStorage.setItem('userdetails', JSON.stringify(response.data))
                let cartData: any = [];
                checkoutProducts.forEach((element: any) => {
                    let product = {
                        name: '',
                        price: 0,
                        quantity: ''
                    };
                    product.name = element.title;
                    product.price = typeof (element.price) == 'string' ? (Number(element.price) - Number(element.discount_price)) * 100 : ((element.price ) - Number(element.discount_price)) * 100;
                    product.quantity = element.quantity;
                    cartData.push(product);
                });
                let totalPrice = typeof (total) == 'string' ? Number(total) * 100 : total * 100;
                APIs.cartPayment({products: cartData, total_price: totalPrice, customerid: user.id, shipping_cost: totalShippingCost}).then(response => {
                    let redirectUrl = response.data.redirect_url
                    let transactionId = response.data.uid
                    localStorage.setItem('uid', transactionId);
                    window.location.assign(redirectUrl);
                }).catch(err => console.log(err));
            })
        }
    }
    return (
        <>
            <div className="main-body pb-5 mb-5">
                <div className="container">
                    <section className="checkout-card-wrapper">
                        <div className="row mt-5">
                            <div className="col">
                                <p className="boldfont bg-image-text custom-color-8 text-center ">Checkout</p>
                            </div>
                        </div>
                        <div>
                            {(incomplete || shippingIncomplete) && <p className='required-text' id='required'>* Please fill the required fields</p>}
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 col-md-9">
                                <form action="">
                                    <div className="table-responsive">
                                        <table className="table checkout-table coulmn-bg-color-1 rounded-lg">
                                            <tbody>
                                                <tr className="double ">
                                                    <th colSpan={2} className="p-2 custom-color-3 regularfont subtitles-1 border-bottom border-top-0">Billing Details</th>
                                                </tr>
                                           
                                                <tr className="double">
                                                    <td>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">First Name</label>
                                                        <input type="text" value={formData.first_name}
                                                            className={`check-form form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.first_name ? 'required-field' : 'border-0' }`} 
                                                            name="first_name" placeholder="Mark"
                                                            onChange={(e) => handleFormChange(e)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Last Name</label>
                                                        <input type="text" value={formData.last_name}
                                                            className={`check-form form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.last_name ? 'required-field' : 'border-0' }`} 
                                                            name="last_name" placeholder="Twain"
                                                            onChange={(e) => handleFormChange(e)}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2}>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Company Name (Optional)</label>
                                                        <input type="text" value={formData.company}
                                                            className="check-form form-control input-bg-color-2 border-0 body-sub-titles" 
                                                            name="company" placeholder="Company Name"
                                                            onChange={(e) => handleFormChange(e)}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2}>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Country</label>
                                                        <select className={`form-control input-bg-color-2 body-sub-titles  ${incomplete && !formData.country ? 'required-field' : 'border-0' }`}
                                                            style={{ height: '3.5rem' }} name="country" value={formData.country}
                                                            onChange={(e) => handleFormChange(e)}
                                                        >
                                                            <option className="mini-text-2" value="" disabled>Select Country</option>
                                                            {countries.map((country: any) => (
                                                                <option key={country.id} value={country.attributes.country}>{country.attributes.country}</option>))}
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2}>
                                                        <div className="mb-3">
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Street Address</label>
                                                            <input type="text" value={formData.streetaddress_housenumber}
                                                                className={`check-form form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.streetaddress_housenumber ? 'required-field' : 'border-0' }`}  
                                                                name="streetaddress_housenumber" placeholder="House number and street name"
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <input type="text" value={formData.streetaddress_apartment}
                                                                className="check-form form-control input-bg-color-2 border-0 body-sub-titles" 
                                                                name="streetaddress_apartment" placeholder="Apartment, suite, unit etc..."
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2}>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">City</label>
                                                        <input type="text" value={formData.city}
                                                            className={`check-form form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.city ? 'required-field' : 'border-0' }`} 
                                                            name="city" placeholder="City"
                                                            onChange={(e) => handleFormChange(e)}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2}>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">State</label>
                                                        <input type="text" value={formData.state}
                                                            className={`check-form form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.state ? 'required-field' : 'border-0' }`} 
                                                            name="state" placeholder="State"
                                                            onChange={(e) => handleFormChange(e)}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2}>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Postcode</label>
                                                        <input type="text" value={formData.postcode}
                                                            className={`check-form form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.postcode ? 'required-field' : 'border-0' }`} 
                                                            name="postcode" placeholder="Postcode"
                                                            onChange={(e) => handleFormChange(e)}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr className="double">
                                                    <td>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Email Address</label>
                                                        <input type="text" value={formData.email} disabled
                                                            className={`check-form form-control input-bg-color-2 body-sub-titles border-0`} 
                                                            name="email-address" placeholder="Email Address"    
                                                        />
                                                    </td>
                                                    <td>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Phone Number</label>
                                                        <input type="text" value={formData.phone_number}
                                                            className={`check-form form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.phone_number ? 'required-field' : 'border-0' }`} 
                                                            name="phone_number" placeholder="(XXX) XXX-XXXX"
                                                            onChange={(e) => handleFormChange(e)}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table checkout-table coulmn-bg-color-1 rounded-lg">
                                             <tbody>
                                                <tr className="single border-bottom">
                                                    <th colSpan={2} className="p-2 custom-color-3 regularfont subtitles-1 border-top-0">Shopping Details</th>
                                                </tr>
                                           
                                                <tr className="single">
                                                    <td colSpan={2} className="d-flex">
                                                        <label className="ms-3 create-label">
                                                                <input type="checkbox" name="agreement" className="width-checkout"
                                                                    onClick={(e: any) => {
                                                                        setDifferentAdd(!differentAdd);
                                                                        setShippingIncomplete(!differentAdd)
                                                                    }}
                                                                /> 
                                                                Ship to a different address?
                                                            </label>
                                                    </td>
                                                </tr>
                                                {differentAdd && <>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Country</label>
                                                            <select className={`form-control input-bg-color-2 body-sub-titles ${shippingIncomplete && !shippingData.shippingaddress_country ? 'required-field' : 'border-0' }`}
                                                                style={{ height: '3.5rem' }} name="shippingaddress_country" value={shippingData.shippingaddress_country}
                                                                onChange={(e) => handleShippingAddChange(e)}
                                                            >
                                                                <option className="mini-text-2" value="" disabled>Select Country</option>
                                                                {countries.map((country: any) => (
                                                                    <option key={country.id} value={country.attributes.country}>{country.attributes.country}</option>))}
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <div className="mb-3">
                                                                <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Street Address</label>
                                                                <input type="text" value={shippingData.shippingaddress_streataddress_housenumber}
                                                                    className={`check-form form-control input-bg-color-2 body-sub-titles ${shippingIncomplete && !shippingData.shippingaddress_streataddress_housenumber ? 'required-field' : 'border-0' }`}  
                                                                    name="shippingaddress_streataddress_housenumber" placeholder="House number and street name"
                                                                    onChange={(e) => handleShippingAddChange(e)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <input type="text" value={shippingData.shippingaddress_streataddress_apartment}
                                                                    className="check-form form-control input-bg-color-2 border-0 body-sub-titles" 
                                                                    name="shippingaddress_streataddress_apartment" placeholder="Apartment, suite, unit etc..."
                                                                    onChange={(e) => handleShippingAddChange(e)}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">City</label>
                                                            <input type="text" value={shippingData.shippingaddress_city}
                                                                className={`check-form form-control input-bg-color-2 body-sub-titles ${shippingIncomplete && !shippingData.shippingaddress_city ? 'required-field' : 'border-0' }`} 
                                                                name="shippingaddress_city" placeholder="City"
                                                                onChange={(e) => handleShippingAddChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">State</label>
                                                            <input type="text" value={shippingData.shippingaddress_state}
                                                                className={`check-form form-control input-bg-color-2 body-sub-titles ${shippingIncomplete && !shippingData.shippingaddress_state ? 'required-field' : 'border-0' }`} 
                                                                name="shippingaddress_state" placeholder="State"
                                                                onChange={(e) => handleShippingAddChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Postcode</label>
                                                            <input type="text" value={shippingData.shippingaddress_postcode}
                                                                className={`check-form form-control input-bg-color-2 body-sub-titles ${shippingIncomplete && !shippingData.shippingaddress_postcode ? 'required-field' : 'border-0' }`} 
                                                                name="shippingaddress_postcode" placeholder="Postcode"
                                                                onChange={(e) => handleShippingAddChange(e)}
                                                            />
                                                        </td>
                                                    </tr> 
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Phone Number</label>
                                                            <input type="text" value={shippingData.shippingaddress_phonenumber}
                                                                className={`check-form form-control input-bg-color-2 body-sub-titles ${shippingIncomplete && !shippingData.shippingaddress_phonenumber ? 'required-field' : 'border-0' }`} 
                                                                name="shippingaddress_phonenumber" placeholder="(XXX) XXX-XXXX"
                                                                onChange={(e) => handleShippingAddChange(e)}
                                                            />
                                                        </td>
                                                    </tr>    
                                                </>}
                                            </tbody>
                                        </table>
                                    </div>
                                </form>
                            </div>
                            <div className="col-12 col-md-3">
                                <div className="table-responsive">
                                    <table className="cart-total table coulmn-bg-color-1 rounded">
                                        <tbody>
                                            <tr className="border-bottom">
                                                <th colSpan={2} className="pb-2 pt-2 ps-3 pe-3 custom-color-3 regularfont subtitles-1 border-top-0">Cart Total</th>
                                            </tr>
                                            <tr>
                                                <td className="pb-1 pt-4 pl-3 semifont body-sub-titles-1 fw-bold border-0"><span>Product</span></td>
                                                <td className="pb-1 pt-4 pr-4 semifont body-sub-titles-1 fw-bold border-0 text-right"><span>Price</span></td>
                                            </tr>
                                            <tr>
                                                <td className="pb-0 pt-0 pr-0 pl-3 semifont boldfontsize border-top-0"> <hr className="p-0 m-0 " /></td>
                                                <td className="pb-0 pt-0 pl-0 pr-4 regularfont boldfontsize border-top-0"> <hr className="p-0 m-0"/></td>
                                            </tr>
                                            {checkoutProducts?.map((product: any) => {
                                                return (
                                                    <tr>
                                                        <td className="pb-0 pt-3 pl-3 regularfont mini-text-1 border-0">{product?.title}</td>
                                                        <td className="pb-0 pt-3 pr-4 regularfont mini-text-1 border-0 text-right">€{product?.price * product.quantity - product.discount_price}</td>
                                                        
                                                    </tr>
                                                )
                                            })}
                                            <tr>
                                                <td className="pb-1 pt-2 pr-0 pl-3 semifont boldfontsize border-top-0"> <hr className="p-0 m-0 " /></td>
                                                <td className="pb-1 pt-2 pl-0 pr-4 regularfont boldfontsize border-top-0"> <hr className="p-0 m-0"/></td>
                                            </tr>
                                            <tr>
                                                <td className="pb-1 pt-0 pl-3 regularfont mini-text-2 border-0"><span>Shipping Cost</span></td>
                                                <td className="pb-1 pt-0 pr-4 regularfont mini-text-2 border-0 text-right"><span>€{totalShippingCost}</span></td>
                                            </tr>
                                            <tr>
                                                <td className="pb-1 pt-2 pr-0 pl-3 semifont boldfontsize border-top-0"> <hr className="p-0 m-0 " /></td>
                                                <td className="pb-1 pt-2 pl-0 pr-4 regularfont boldfontsize border-top-0"> <hr className="p-0 m-0"/></td>
                                            </tr>
                                            <tr>
                                                <td className="pb-2 pt-1 px-3 semifont body-sub-titles-1 fw-bold border-0">Total</td>
                                                <td className="pb-2 pt-1 pr-4 semifont body-sub-titles-1 fw-bold border-0 text-right">€{(total + totalShippingCost).toFixed(2)}</td>
                                            </tr>
                                            <tr  className="single">
                                                
                                            </tr>
                                            <tr><td colSpan={2} className="p-3">
                                                <button type="button" disabled={!checkoutProducts?.length}
                                                    className="proceed-to-checkout custom-color-7 semifont mini-text-3 rounded border-0 button-bg-color-1"
                                                    onClick={handlepayment}
                                                >Proceed to payment</button>
                                            </td></tr>
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
export default Checkout;