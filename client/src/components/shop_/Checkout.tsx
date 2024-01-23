import React, { useCallback, useEffect, useState } from 'react';
import APIs from '~/services/apiService';
import { UserContext } from '../account_/UserContext';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';
// import PaymentDropdown from '../PaymentDropdown/PaymentDropdown';
import router from 'next/router';

function Checkout() {

    const placeholderTranslations: any = {
        nl: {
            email: 'E-mail',
            first_name: 'Voornaam',
            last_name: 'Achternaam',
            username: 'Gebruikersnaam',
            phone_number: 'Telefoonnummer',
            streetaddress_housenumber: 'Straatnaam Huisnummer',
            streetaddress_apartment: 'Appartement',
            city: 'Stad',
            state: 'Provincie',
            country: 'Land',
            postcode: 'Postcode',
            company_name: 'Bedrijfsnaam',
            Account_type: 'Accounttype',
            Account_title: 'Accounttitel',
            Bank_name: 'Banknaam',
            iban_number: 'IBAN-nummer',
            password: 'Wachtwoord',
            kvk_number: 'KvK-nummer',
            company_btw: 'Bedrijfs-BTW',
        },
        en: {
            email: 'Email',
            first_name: 'First Name',
            last_name: 'Last Name',
            username: 'Username',
            phone_number: 'Phone Number',
            streetaddress_housenumber: 'Street Address House Number',
            streetaddress_apartment: 'Apartment',
            city: 'City',
            state: 'State',
            country: 'Country',
            postcode: 'Postcode',
            company_name: 'Company Name',
            Account_type: 'Account Type',
            Account_title: 'Account Title',
            Bank_name: 'Bank Name',
            iban_number: 'IBAN Number',
            password: 'Password',
            kvk_number: 'KvK Number',
            company_btw: 'Company VAT',
        }
    };

    const { user, saveUser, language, setPaymentStatus } = UserContext();
    const [checkoutProducts, setCheckoutProducts]: any = useState([]);
    const [pickup, setPickup] = useState<boolean>(false)
    const [selectPickup, setSelectPickup] = useState<boolean>(false)
    const [pickupMethod, setPickupMethod] =  useState("")
    const [total, setTotal]: any = useState(0);
    const [totalShippingCost, setTotalShippingCost] = useState<any>(0)
    const [shippingCostArray, setShippingCostArray] = useState<any>([])
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
    const [differentAddr, setDifferentAddr] = useState(false);
    const [clicked, setClicked] = useState<boolean>(true)
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
    const [paymentMethodSelected, setPaymentMethodSelected] = useState(false)


    const getContryCode = (country: string, countries: any[]) => {
        let countryData: any = countries.find((item: any, index) => item.attributes.country == country);
        return countryData?.attributes?.code;
    }

    useEffect(() => {
        let redirectUrl: any = localStorage.getItem('redirect');
        let transactionId: any = localStorage.getItem('uid');
        APIs.paymentStatus(transactionId, user.id).then(response => {
            let status = response?.data?.rows && response?.data?.rows[0]?.status;
            setPaymentStatus(status);
            if (status !== 'created' && status !== 'pending') {
                localStorage.removeItem('redirect');
            } else {
                if (redirectUrl && redirectUrl !== "undefined") {
                    window.location.assign(redirectUrl);
                }
            }
        })
        setFormData((prevFormData) => ({
            ...prevFormData,
            first_name: user.first_name,
            last_name: user.last_name,
            company: user.company,
            email: user.email.toLowerCase(),
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
        setShippingData({ ...shippingData });
    }, []);

    useEffect(() => {
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
                Promise.all(shippingDataPromises).then((shippingDataArray) => {
                    shippingcostapidataArray = shippingDataArray;
                    APIs.getShippingCost({ "shipping_data": shippingcostapidataArray[0] }).then((res: any) => {
                        const isAnyUnavailable = res.data.some((item: any) => item.price_details === "unavailable");
                        if (!res || (res && isAnyUnavailable)) {
                            setPickup(true)
                            // toast.warning("you can choose pickup method to proceed payment")
                            setClicked(false)
                        } else {
                            const shippingCostArray = res.data;
                            setShippingCostArray(shippingCostArray)
                            const totalShippingCost = shippingCostArray.reduce((total: any, item: any) => {
                                return total + parseFloat(item.price_details);
                            }, 0);
                            setTotalShippingCost(totalShippingCost)
                            setClicked(false)
                        }
                    });
                });
            }).catch(err => {
                console.log(err);
            });
        });

    }, [formData.country, formData.postcode, shippingData.shippingaddress_country, shippingData.shippingaddress_postcode])

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
        shippingincomplete = differentAddr && !(!!shippingData.shippingaddress_city &&
            !!shippingData.shippingaddress_country && !!shippingData.shippingaddress_phonenumber &&
            !!shippingData.shippingaddress_postcode && !!shippingData.shippingaddress_state &&
            !!shippingData.shippingaddress_streataddress_housenumber);
        setShippingIncomplete(shippingincomplete);
        return shippingincomplete;
    }

    const handleFormChange = (event: any) => {
        const { name, value } = event.target;
        setFormData((prevFormData => ({ ...prevFormData, [name]: value })));
    }

    const handleShippingAddChange = (event: any) => {
        const { name, value } = event.target;
        setShippingData((prevData) => ({ ...prevData, [name]: value }));
    }

    const handlePickupChange = (event: any) => {
        const selectedMethod = event.target.value;
        setPickupMethod(selectedMethod)
        setSelectPickup(true)
    }

    const handlepayment = () => {
        setClicked(true)
        let incomplete = checkFormStatus();
        let shippingincomplete = checkShippingDataStatus();
        let reqElement = document.getElementById('required');
        if (reqElement) reqElement.scrollIntoView({ behavior: 'smooth' });
        shippingData.shippingaddress_city = shippingData.shippingaddress_city || formData.city;
        shippingData.shippingaddress_country = shippingData.shippingaddress_country || formData.country;
        shippingData.shippingaddress_phonenumber = shippingData.shippingaddress_phonenumber || formData.phone_number;
        shippingData.shippingaddress_postcode = shippingData.shippingaddress_postcode || formData.postcode;
        shippingData.shippingaddress_state = shippingData.shippingaddress_state || formData.state;
        shippingData.shippingaddress_streataddress_apartment = shippingData.shippingaddress_streataddress_apartment || formData.streetaddress_apartment;
        shippingData.shippingaddress_streataddress_housenumber = shippingData.shippingaddress_streataddress_housenumber || formData.streetaddress_housenumber;
        setShippingData({ ...shippingData });
        if (!incomplete && !shippingincomplete) {
            let formdata: any = { ...formData, ...shippingData };
            APIs.updateSpecificUser(user.id, formdata).then(response => {
                saveUser(response.data);
                localStorage.setItem('userdetails', JSON.stringify(response.data));
                let cartData: any = [];
                checkoutProducts.forEach((element: any) => {

                    let product = {
                        // seller_id : '',
                        // product_id : '',
                        // name: '',
                        id: "",
                        price: 0,
                        quantity: ''
                    };
                    // product.seller_id = element.seller_id;
                    // product.product_id = element.id
                    // product.name = element.title;
                    product.id = element.product_id;
                    product.price = typeof (element.price) == 'string' ? (Number(element.price) - (Number(element.discount_price) / element.quantity)) : ((element.price) - Number(element.discount_price / element.quantity))
                    product.quantity = element.quantity;

                    cartData.push(product);
                });
                let totalPrice = typeof (total) == 'string' ? Number(total) * 100 : total * 100;
                // let checkoutData = {
                //     products: cartData, 
                //     total_price: totalPrice, 
                //     customerid: user.id, 
                //     shipping_costs : shippingCostArray,
                //     shipping_cost: totalShippingCost,
                //     lang: language.value
                // }
                // let checkoutData = {
                //     "customerid":user.id,
                //     "shipping_cost": totalShippingCost,
                //     "lang": language.value
                // }
                let checkoutData = {
                    products: cartData,
                    "customerid": user.id,
                    "shipping_cost": totalShippingCost,
                    "pickup": pickupMethod,
                    "lang": language.value

                }
                APIs.getCartData({ customerid: user.id }).then(response => {
                    let cartData = response.data.rows;
                    const hasZeroStock = cartData.some((item: any) => item.stock_count <= 0);
                    if (cartData[0].payment_process === 'true') {
                        toast.warning(() => (<FormattedMessage id="PAYMENT_INITIATED" />));
                        setClicked(false)
                    } else if (hasZeroStock) {
                        toast.warning(() => (<FormattedMessage id="SOME_OUT_OF_STOCK" />))
                    } else {
                        // APIs.cartPayment(checkoutData).then(response => {
                        //     if (response.data.redirect_url) {
                        //         let redirectUrl = response.data.redirect_url
                        //         let transactionId = response.data.uid
                        //         localStorage.setItem('uid', transactionId);
                        //         localStorage.setItem('redirect', redirectUrl);
                        //         window.location.assign(redirectUrl);
                        //     }
                        //     // router.push("/payment-result")
                        // }).catch(err => console.log(err));
                        // APIs.newPayment(checkoutData).then(response => {
                        //     if (response.data) {
                        //         let transactionId = response.data
                        //         localStorage.setItem('uid', transactionId);
                        //         console.log(response.data)
                        //         router.push("/payment-result")
                        //     }else{
                        //         toast.warning(<FormattedMessage id="SOMETHING_WRONG" />)
                        //     }
                        // }).catch(err => console.log(err));
                        APIs.newPaymentStrip(checkoutData).then(response => {
                            if (response.data.url) {
                                console.log("strip call response", response.data)
                                let transactionId = response.data.id;
                                let redirectUrl = response.data.url;
                                localStorage.setItem('uid', transactionId)
                                localStorage.setItem("redirect", redirectUrl)
                                window.location.assign(redirectUrl)
                            } else {
                                toast.error(<FormattedMessage id="SOMETHING_WRONG" />)
                            }
                        })
                    }
                })
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
                                <p className="boldfont bg-image-text custom-color-8 text-center "><FormattedMessage id="CHECKOUT" /></p>
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
                                            {language.value &&
                                                <tbody>
                                                    <tr className="double ">
                                                        <th colSpan={2} className="p-2 custom-color-3 regularfont subtitles-1 border-bottom border-top-0"><FormattedMessage id="BILLING_DETAILS" /></th>
                                                    </tr>

                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="FIRST_NAME" /> <span className="required">*</span></label>
                                                            <input type="text" value={formData.first_name}
                                                                className={`check-form form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.first_name ? 'required-field' : 'border-0'}`}
                                                                name="first_name" placeholder={placeholderTranslations[language.value]['first_name']}
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="LAST_NAME" /> <span className="required">*</span></label>
                                                            <input type="text" value={formData.last_name}
                                                                className={`check-form form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.last_name ? 'required-field' : 'border-0'}`}
                                                                name="last_name" placeholder={placeholderTranslations[language.value]['last_name']}
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="COMPANY_NAME" /> (Optional)</label>
                                                            <input type="text" value={formData.company}
                                                                className="check-form form-control input-bg-color-2 border-0 body-sub-titles"
                                                                name="company" placeholder={placeholderTranslations[language.value]['company_name']}
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="COUNTRY" /> <span className="required">*</span></label>
                                                            <select className={`form-control input-bg-color-2 body-sub-titles  ${incomplete && !formData.country ? 'required-field' : 'border-0'}`}
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
                                                                <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="STREET_ADDRESS" /> <span className="required">*</span></label>
                                                                <input type="text" value={formData.streetaddress_housenumber}
                                                                    className={`check-form form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.streetaddress_housenumber ? 'required-field' : 'border-0'}`}
                                                                    name="streetaddress_housenumber" placeholder={placeholderTranslations[language.value]['streetaddress_housenumber']}
                                                                    onChange={(e) => handleFormChange(e)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <input type="text" value={formData.streetaddress_apartment}
                                                                    className="check-form form-control input-bg-color-2 border-0 body-sub-titles"
                                                                    name="streetaddress_apartment" placeholder={placeholderTranslations[language.value]['streetaddress_apartment']}
                                                                    onChange={(e) => handleFormChange(e)}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="CITY" /><span className="required">*</span></label>
                                                            <input type="text" value={formData.city}
                                                                className={`check-form form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.city ? 'required-field' : 'border-0'}`}
                                                                name="city" placeholder={placeholderTranslations[language.value]['city']}
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="STATE" /> <span className="required">*</span></label>
                                                            <input type="text" value={formData.state}
                                                                className={`check-form form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.state ? 'required-field' : 'border-0'}`}
                                                                name="state" placeholder={placeholderTranslations[language.value]['state']}
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="POST_CODE" /> <span className="required">*</span></label>
                                                            <input type="text" value={formData.postcode}
                                                                className={`check-form form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.postcode ? 'required-field' : 'border-0'}`}
                                                                name="postcode" placeholder={placeholderTranslations[language.value]['postcode']}
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="EMAIL_ADDRESS" /></label>
                                                            <input type="text" value={formData.email} disabled
                                                                className={`check-form form-control input-bg-color-2 body-sub-titles border-0`}
                                                                name="email-address" placeholder={placeholderTranslations[language.value]['email']}
                                                            />
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="PHONE_NO" /> <span className="required">*</span></label>
                                                            <input type="text" value={formData.phone_number}
                                                                className={`check-form form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.phone_number ? 'required-field' : 'border-0'}`}
                                                                name="phone_number" placeholder="(XXX) XXX-XXXX"
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            }
                                        </table>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table checkout-table coulmn-bg-color-1 rounded-lg">
                                            {
                                                language.value &&
                                                <tbody>
                                                    <tr className="single border-bottom">
                                                        <th colSpan={2} className="p-2 custom-color-3 regularfont subtitles-1 border-top-0"><FormattedMessage id="SHOPPING_DETAILS" /></th>
                                                    </tr>

                                                    <tr className="single">
                                                        <td colSpan={2} className="d-flex">
                                                            <label className="ms-3 create-label">
                                                                <input type="checkbox" name="agreement" className="width-checkout"
                                                                    onClick={(e: any) => {
                                                                        setDifferentAddr(!differentAddr);
                                                                        setShippingIncomplete(!differentAddr)
                                                                    }}
                                                                />
                                                                <FormattedMessage id="SHIP_TO_DIFFRENT" />
                                                            </label>
                                                        </td>
                                                    </tr>
                                                    {differentAddr && <>
                                                        <tr className="single">
                                                            <td colSpan={2}>
                                                                <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="COUNTRY" /> <span className="required">*</span></label>
                                                                <select className={`form-control input-bg-color-2 body-sub-titles ${shippingIncomplete && !shippingData.shippingaddress_country ? 'required-field' : 'border-0'}`}
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
                                                                    <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="STREET_ADDRESS" /> <span className="required">*</span></label>
                                                                    <input type="text" value={shippingData.shippingaddress_streataddress_housenumber}
                                                                        className={`check-form form-control input-bg-color-2 body-sub-titles ${shippingIncomplete && !shippingData.shippingaddress_streataddress_housenumber ? 'required-field' : 'border-0'}`}
                                                                        name="shippingaddress_streataddress_housenumber" placeholder={placeholderTranslations[language.value]['streetaddress_housenumber']}
                                                                        onChange={(e) => handleShippingAddChange(e)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <input type="text" value={shippingData.shippingaddress_streataddress_apartment}
                                                                        className="check-form form-control input-bg-color-2 border-0 body-sub-titles"
                                                                        name="shippingaddress_streataddress_apartment" placeholder={placeholderTranslations[language.value]['streetaddress_apartment']}
                                                                        onChange={(e) => handleShippingAddChange(e)}
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr className="single">
                                                            <td colSpan={2}>
                                                                <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="CITY" /> <span className="required">*</span></label>
                                                                <input type="text" value={shippingData.shippingaddress_city}
                                                                    className={`check-form form-control input-bg-color-2 body-sub-titles ${shippingIncomplete && !shippingData.shippingaddress_city ? 'required-field' : 'border-0'}`}
                                                                    name="shippingaddress_city" placeholder={placeholderTranslations[language.value]['city']}
                                                                    onChange={(e) => handleShippingAddChange(e)}
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr className="single">
                                                            <td colSpan={2}>
                                                                <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="STATE" /> <span className="required">*</span></label>
                                                                <input type="text" value={shippingData.shippingaddress_state}
                                                                    className={`check-form form-control input-bg-color-2 body-sub-titles ${shippingIncomplete && !shippingData.shippingaddress_state ? 'required-field' : 'border-0'}`}
                                                                    name="shippingaddress_state" placeholder={placeholderTranslations[language.value]['state']}
                                                                    onChange={(e) => handleShippingAddChange(e)}
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr className="single">
                                                            <td colSpan={2}>
                                                                <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="POST_CODE" /> <span className="required">*</span></label>
                                                                <input type="text" value={shippingData.shippingaddress_postcode}
                                                                    className={`check-form form-control input-bg-color-2 body-sub-titles ${shippingIncomplete && !shippingData.shippingaddress_postcode ? 'required-field' : 'border-0'}`}
                                                                    name="shippingaddress_postcode" placeholder={placeholderTranslations[language.value]['postcode']}
                                                                    onChange={(e) => handleShippingAddChange(e)}
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr className="single">
                                                            <td colSpan={2}>
                                                                <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="PHONE_NO" /> <span className="required">*</span></label>
                                                                <input type="text" value={shippingData.shippingaddress_phonenumber}
                                                                    className={`check-form form-control input-bg-color-2 body-sub-titles ${shippingIncomplete && !shippingData.shippingaddress_phonenumber ? 'required-field' : 'border-0'}`}
                                                                    name="shippingaddress_phonenumber" placeholder="(XXX) XXX-XXXX"
                                                                    onChange={(e) => handleShippingAddChange(e)}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </>}
                                                </tbody>
                                            }
                                        </table>
                                    </div>
                                </form>
                            </div>
                            <div className="col-12 col-md-3">
                                <div className="table-responsive">
                                    <table className="cart-total table coulmn-bg-color-1 rounded">
                                        <tbody>
                                            <tr className="border-bottom">
                                                <th colSpan={2} className="pb-2 pt-2 ps-3 pe-3 custom-color-3 regularfont subtitles-1 border-top-0"><FormattedMessage id="CART_TOTAL" /></th>
                                            </tr>
                                            <tr>
                                                <td className="pb-1 pt-4 pl-3 semifont body-sub-titles-1 fw-bold border-0"><span><FormattedMessage id="PRODUCT" /></span></td>
                                                <td className="pb-1 pt-4 pr-4 semifont body-sub-titles-1 fw-bold border-0 text-right"><span><FormattedMessage id="PRICE" /></span></td>
                                            </tr>
                                            <tr>
                                                <td className="pb-0 pt-0 pr-0 pl-3 semifont boldfontsize border-top-0"> <hr className="p-0 m-0 " /></td>
                                                <td className="pb-0 pt-0 pl-0 pr-4 regularfont boldfontsize border-top-0"> <hr className="p-0 m-0" /></td>
                                            </tr>
                                            {checkoutProducts?.map((product: any, index: any) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className="pb-0 pt-3 pl-3 regularfont mini-text-1 border-0">{product?.title}</td>
                                                        <td className="pb-0 pt-3 pr-4 regularfont mini-text-1 border-0 text-right">€{(product?.price * product.quantity - product.discount_price).toFixed(2)}</td>

                                                    </tr>
                                                )
                                            })}
                                            <tr>
                                                <td className="pb-1 pt-2 pr-0 pl-3 semifont boldfontsize border-top-0"> <hr className="p-0 m-0 " /></td>
                                                <td className="pb-1 pt-2 pl-0 pr-4 regularfont boldfontsize border-top-0"> <hr className="p-0 m-0" /></td>
                                            </tr>
                                            <tr>
                                                <td className="pb-1 pt-0 pl-3 regularfont mini-text-2 border-0"><span><FormattedMessage id="SHIPPING_COST" /></span></td>
                                                <td className="pb-1 pt-0 pr-4 regularfont mini-text-2 border-0 text-right"><span>€{totalShippingCost}</span></td>
                                            </tr>
                                            <tr>
                                                <td className="pb-1 pt-2 pr-0 pl-3 semifont boldfontsize border-top-0"> <hr className="p-0 m-0 " /></td>
                                                <td className="pb-1 pt-2 pl-0 pr-4 regularfont boldfontsize border-top-0"> <hr className="p-0 m-0" /></td>
                                            </tr>
                                            <tr>
                                                <td className="pb-2 pt-1 px-3 semifont body-sub-titles-1 fw-bold border-0"><FormattedMessage id="TOTAL" /></td>
                                                <td className="pb-2 pt-1 pr-4 semifont body-sub-titles-1 fw-bold border-0 text-right">€{(total + totalShippingCost).toFixed(2)}</td>
                                            </tr>
                                            {/* <tr className="border-bottom ">
                                                <th colSpan={2} className="pb-2 pt-4 ps-3 pe-3 custom-color-3 regularfont subtitles-1 border-top-0"><FormattedMessage id="PAYMENT_METHOD"/></th>
                                            </tr>
                                            <tr>
                                                <td colSpan={2}>
                                                    <div className='pt-1 pb-3'>

                                                    <PaymentDropdown selectFn={setPaymentMethodSelected}/>
                                                    </div>
                                                </td>
                                            </tr> */}
                                            {/* {
                                                pickup && <tr>
                                                    <td colSpan={2}>
                                                        <div className='d-flex'>
                                                            <input  type="checkbox" value="" onChange={handlePickupChange}/>
                                                            <label className="form-check-label pl-2" >
                                                                Select for pickup option to proceed Payment
                                                            </label>
                                                        </div>
                                                    </td>
                                                </tr>
                                            } */}
                                            {
                                                pickup &&
                                                <tr>
                                                    <td colSpan={2}>
                                                        <div className='d-flex'>
                                                            <label className="form-check-label pl-2" >
                                                                Select pickup option to proceed Payment
                                                            </label>
                                                            <select
                                                                className="form-control ml-2"
                                                                onChange={handlePickupChange}
                                                               
                                                            >
                                                                <option value=""disabled={!!pickupMethod}>Select</option>
                                                                <option value="on pickup">Pickup</option>
                                                                <option disabled value="on request">Request Pickup</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                </tr>
                                               
                                            }
                                            <tr className='w-100'>
                                                <td colSpan={2}>
                                                    <div className="form-group regularfont body-sub-titles-2 mb-0" style={{ color: 'black', fontSize: '0.9rem' }}>
                                                        By proceeding you are agreeing to the <a href="https://stripe.com/en-nl/legal/consumer" target='_blank'>Terms of Service (Stripe.com)</a>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr><td colSpan={2} className="p-3">
                                                {
                                                    clicked ?
                                                        <button type="button"
                                                            disabled
                                                            className="proceed-to-checkout custom-color-7 semifont mini-text-3 rounded border-0 button-bg-color-1"
                                                            style={{ cursor: "not-allowed" }}
                                                        ><FormattedMessage id="WAIT" />
                                                        </button>
                                                        :
                                                        <button type="button" disabled={!checkoutProducts?.length || (pickup && !selectPickup)}
                                                            style={{ cursor: `${(pickup && !selectPickup) ? "not-allowed" : "pointer"}` }}
                                                            className={`proceed-to-checkout custom-color-7 semifont mini-text-3 rounded border-0  ${(pickup && !selectPickup) ? "button-bg-color-05" : "button-bg-color-1"}`}
                                                            onClick={handlepayment}
                                                        ><FormattedMessage id="PROCEED_TO_PAYMENT" />
                                                        </button>
                                                }

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