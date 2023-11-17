import React, { useEffect, useState } from "react";
import { UserContext } from "../account_/UserContext";
import APIs from '../../services/apiService';
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";


function SellerRegistration() {

    let locale: any;
    
    if(typeof window !== 'undefined'){
        locale = localStorage.getItem("locale")
    }

    const placeholderTranslations : any = {
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

    const {user, saveUser, language} = UserContext();
    const router = useRouter();

    const [formData, setFormData] = useState({
        user_type: "seller",
        isApproved:"Pending",
        email: '',
        first_name: '',
        last_name: '',
        username: '',
        phone_number: '',
        streetaddress_housenumber: '',
        streetaddress_apartment: '',
        city: '',
        state: '',
        country: '',
        postcode: '',
        company_name: '',
        Account_type: '',
        Account_title: '',
        Bank_name: '',
        iban_number: '',
        password: '',
        kvk_number: '',
        company_btw: '',
    });
    const [agreement, setAgreement] = useState(false);
    const [incomplete, setIncomplete] = useState(false);
    const [password, setPassword] = useState('');
    const [cnfrmPassword, setCnfrmPassword] = useState('');
    const [pwdmatch, setPwdmatch] = useState(true);
    const [countries, setCountries] = useState<any>([]);
    const [newPwdVisible, setNewPwdVisible] = useState(false);
    const [confrmpwdVisible, setConfrmpwdVisible] = useState(false);


    useEffect(() => {
        // window.onbeforeunload = function() {
        //     return "Changes may not be saved!";
        // }
        if (user && user.id) {
            formData.first_name = user.first_name;
            formData.last_name = user.last_name;
            formData.username = user.username;
            formData.email = user.email;
            formData.phone_number = user.phone_number;
            formData.streetaddress_housenumber = user.streetaddress_housenumber;
            formData.streetaddress_apartment = user.streetaddress_apartment;
            formData.city = user.city;
            formData.state = user.state;
            formData.country = user.country;
            formData.postcode = user.postcode;
            setFormData({...formData});
        }
    }, [])

    useEffect(() => {
        APIs.getCountries()
          .then(response => {
            setCountries(response.data.data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }, []); 
    

    const checkFormStatus = () => {
        let incomplete = true;
        incomplete = !(!!formData.first_name && !!formData.last_name && 
            !!formData.email && !!formData.company_name && 
            !!formData.phone_number && !!formData.streetaddress_housenumber && 
            !!formData.city && !!formData.country && !!formData.state && 
            !!formData.postcode && !!formData.Account_type && agreement);
        return incomplete;
    }

    const handlePwdChange = (event: any) => {
        setCnfrmPassword(event.target.value)
        if (password !== event.target.value) {
            setPwdmatch(false);
        } else {
            setPwdmatch(true);
        }
    }

    const handleFormChange = (event: any) => {
        const { name, value } = event.target;
        setFormData((prevFormData => ({...prevFormData, [name]: value})));
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        let incomplete = checkFormStatus();
        setIncomplete(incomplete);
        let reqElement = document.getElementById('required');
        if (reqElement && incomplete) reqElement.scrollIntoView({behavior: 'smooth'})
        let sellerData: any = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            username: formData.username,
            email: formData.email.toLowerCase(),
            phone_number: formData.phone_number,
            streetaddress_housenumber: formData.streetaddress_housenumber,
            streetaddress_apartment: formData.streetaddress_apartment,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            postcode: formData.postcode,
            company_name: formData.company_name,
            Account_type: formData.Account_type,
            Account_title: formData.Account_title,
            bank_name: formData.Bank_name,
            iban_number: formData.iban_number,
            user_type: "seller",
            isApproved: "Pending",
            shippingaddress_company: formData.company_name,
            shippingaddress_country: formData.country,
            shippingaddress_streataddress_housenumber: formData.streetaddress_housenumber,
            shippingaddress_streataddress_apartment: formData.streetaddress_apartment,
            shippingaddress_city: formData.city,
            shippingaddress_state: formData.state,
            shippingaddress_postcode: formData.postcode,
            shippingaddress_phonenumber: formData.phone_number,
            kvk_number: formData.kvk_number,
            company_btw: formData.company_btw,
            lang: language.value
        };
        if (!incomplete) {
            if (!user || (user && !user.id)) {
                sellerData.password = cnfrmPassword;

                APIs.register(sellerData).then(response => {
                    APIs.getSellerAccount({
                        "country_iso": formData.country == "uk" ? "GBR" : "NLD",
                        "email": formData.email.toLowerCase(),
                        "kvk_number": formData.kvk_number
                    }).then((res) =>{
                        console.log("getselleraccount response",res)
                        localStorage.setItem('usertoken', response.data.jwt);
                        getAndSaveUser(response.data.user.id);
                        toast.success(()=>(<FormattedMessage id="SELLER_SUCCESS" />))
                    })
                }).catch(err => {
                    let errMessage = err?.response?.data?.error?.message || 'Something went wrong!';
                    toast.error(errMessage);
                    console.log(err.response.data.error);
                })
            } else {
                
                APIs.updateSpecificUser(user.id, sellerData).then(response => {
                    getAndSaveUser(response.data.id);
                    APIs.userToSeller({user_email_id: sellerData.email, lang: language.value})
                    .then()
                    .catch(err => console.log(err))
                }).catch((err) => {
                    let errMessage = err?.response?.data?.error?.message || 'Something went wrong!';
                    toast.error(errMessage);
                    console.log(err.response.data.error);
                });
            }
        }
    }

    const getAndSaveUser = (id: number) => {
        APIs.getSpecificUser(id).then(response => {
            let userdetails = response.data;
            localStorage.setItem('userdetails', JSON.stringify(userdetails));
            saveUser(userdetails);
            router.push('/homepage');
        })
    }

    return (
        <>
            <div className="main-body pb-2 mb-5">
                <div className="container">
                    <section className="quote-wrapper mt-5">
                        <div>
                            {incomplete && <p className='required-text' id='required'>* <FormattedMessage id="FILL_REQUIRED_FIELDS"/></p>}
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="quote-inner-wrapper coulmn-bg-color-1 rounded p-5 ps-5 pe-5">
                                    <form onSubmit={(e) => handleSubmit(e)}>
                                        <div className="table-responsive">
                                            <table className="table quote-table">
                                                {
                                                    locale &&
                                                    <tbody>
                                                    <tr>
                                                        <th colSpan={2} 
                                                            className="pt-0 pb-0 px-0 ps-0 custom-color-2 regularfont subtitles fw-normal border-top-0 border-bottom-0"
                                                        ><FormattedMessage id="START_SELLING" />  <span className="regularfont body-sub-titles ml-3 align-middle font-weight-normal"><FormattedMessage id="FILL_YOUR_ACCOUNT_INFO"/></span></th>
                                                        
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={2} 
                                                            className="pb-4 pt-4 pl-0 semifont boldfontsize border-top-0"> 
                                                            <hr className="p-0 m-0 " />
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="FIRST_NAME"/>  <span className="required">*</span></label>
                                                            <input type="text" value={formData.first_name} disabled={user.first_name}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.first_name ? 'required-field' : 'border-0'}`}
                                                                name="first_name" placeholder={placeholderTranslations[locale]['first_name']}
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="LAST_NAME"/>  <span className="required">*</span></label>
                                                            <input type="text" value={formData.last_name} disabled={user.last_name}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.last_name ? 'required-field' : 'border-0'}`}
                                                                name="last_name" placeholder={placeholderTranslations[locale]['last_name']}
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="EMAIL_ADDRESS"/>  <span className="required">*</span></label>
                                                            <input type="text" value={formData.email} disabled={user.email}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.email ? 'required-field' : 'border-0'}`}
                                                                name="email" placeholder="user@example.com"
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="USER_NAME"/>  <span className="required">*</span></label>
                                                            <input type="text" value={formData.username} disabled={user.username}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.username ? 'required-field' : 'border-0'}`}
                                                                name="username"placeholder={placeholderTranslations[locale]['username']}
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="CREATE_PASSWORD"/>  <span className="required">*</span></label>
                                                            <div className="position-relative">

                                                            <input type={newPwdVisible ? "text" : "password"} value={password} disabled={user.id}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !password ? 'required-field' : 'border-0'}`}
                                                                name="password" placeholder={placeholderTranslations[locale]['password']}
                                                                onChange={(e) => {
                                                                    setPassword(e.target.value);
                                                                    e.target.value.length < 6 && !user.id ? setIncomplete(true) : setIncomplete(false);
                                                                }}
                                                            />
                                                            <div className='position-absolute p-3' style={{right: 0, top: 0}}>
                                                            <span
                                                                className="password-visibility-toggle"
                                                                onClick={() => setNewPwdVisible(!newPwdVisible)}
                                                            >
                                                                {newPwdVisible ? (
                                                                    <i className="far fa-eye"></i>
                                                                    ) : (
                                                                    <i className="far fa-eye-slash"></i>
                                                                )}
                                                            </span>
                                                            </div>
                                                            </div>
                                                            {(password.length < 6 && incomplete && !user.id) && <span className="required-text">Password must be at least 6 characters </span>}
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="CONFIRM_PASSWORD"/>  <span className="required">*</span></label>
                                                            <div className="position-relative">

                                                            <input type={confrmpwdVisible ? "text" : "password"} value={cnfrmPassword} disabled={user.id}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !cnfrmPassword ? 'required-field' : 'border-0'}`}
                                                                name="c_password" placeholder={placeholderTranslations[locale]['password']} 
                                                                onChange={(e) => handlePwdChange(e)}
                                                            />
                                                            <div className='position-absolute p-3' style={{right: 0, top: 0}}>
                                                            <span
                                                                className="password-visibility-toggle"
                                                                onClick={() => setConfrmpwdVisible(!confrmpwdVisible)}
                                                            >
                                                                {confrmpwdVisible ? (
                                                                    <i className="far fa-eye"></i>
                                                                    ) : (
                                                                    <i className="far fa-eye-slash"></i>
                                                                )}
                                                            </span>
                                                            </div>
                                                            </div>
                                                            {!pwdmatch && !user.id && <span className="required-text"><FormattedMessage id="PASSWORD_NOT_MATCH"/></span>}
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="PHONE_NO" />  <span className="required">*</span></label>
                                                            <input
                                                                type="tel" 
                                                                value={formData.phone_number}
                                                                disabled={user.phone_number}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.phone_number ? 'required-field' : 'border-0'
                                                                    }`}
                                                                name="phone_number"
                                                                placeholder="(XXX) XXX-XXXX"
                                                                onChange={(e) => {
                                                                    const numericValue = e.target.value.replace(/\D/g, '');
                                                                    handleFormChange({ target: { name: 'phone_number', value: numericValue } });
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="ACCOUNT_TYPE"/> <span className="required">*</span></label>
                                                            <select className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.Account_type ? 'required-field' : 'border-0'}`}
                                                                style={{height: '3.5rem'}} name="Account_type" value={formData.Account_type}
                                                                onChange={(e) => handleFormChange(e)}
                                                            >
                                                                <option value='' disabled>{locale == "nl" ? "Selecteer een accounttype" :"Select an account type"}</option>
                                                                <option value="Individual">{locale == "nl" ? "Individueel" :"Individual"}</option>
                                                                <option value="Business">{locale == "nl" ? "Bedrijf" :"Business/Company"}</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="ACCOUNT_TITLE"/> <span className="required">*</span></label>
                                                            <input type="text" value={formData.Account_title}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.Account_title ? 'required-field' : 'border-0'}`}
                                                                name="Account_title" placeholder={placeholderTranslations[locale]['Account_title']}
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="BANK_NAME"/>  <span className="required">*</span></label>
                                                            <input type="text" value={formData.Bank_name}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.Bank_name ? 'required-field' : 'border-0'}`}
                                                                name="Bank_name" placeholder={placeholderTranslations[locale]['Bank_name']} 
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="IBAN_NO"/>  <span className="required">*</span></label>
                                                            <input
                                                                type="text"
                                                                value={formData.iban_number}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.iban_number ? 'required-field' : 'border-0'
                                                                    }`}
                                                                name="iban_number"
                                                                placeholder={placeholderTranslations[locale]['iban_number']}
                                                                onChange={(e) => {
                                                                    // Use a regular expression to allow only numeric characters
                                                                    const numericValue = e.target.value
                                                                    handleFormChange({ target: { name: 'iban_number', value: numericValue } });
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="COMPANY_OR_SHOP_NAME"/>  <span className="required">*</span></label>
                                                            <input type="text" value={formData.company_name}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.company_name ? 'required-field' : 'border-0'}`}
                                                                name="company_name" placeholder={placeholderTranslations[locale]['company_name']} 
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    { formData.Account_type === 'Business' && 
                                                        <>
                                                            <tr className="single">
                                                                <td colSpan={2}>
                                                                    <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">{locale == "nl" ? "Bedrijf BTW # (Optioneel)" : "Company BTW # (Optional)"}</label>
                                                                    <input type="text" value={formData.company_btw}
                                                                        className="form-control input-bg-color-2 border-0 body-sub-titles" 
                                                                        name="company_btw" placeholder="Example: 32165421" 
                                                                        onChange={(e) => handleFormChange(e)}
                                                                    />
                                                                </td>
                                                            </tr>
                                                            {/* <tr className="single">
                                                                <td colSpan={2}>
                                                                    <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">{locale == "nl" ? "KVK Kamer van Koophandel Nummer" : "KVK Chamber of Commerce Number"}  <span className="required">*</span></label>
                                                                    <input type="text" value={formData.kvk_number}
                                                                        className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.kvk_number ? 'required-field' : 'border-0'}`}
                                                                        name="kvk_number" placeholder={placeholderTranslations[locale]['kvk_number']} 
                                                                        onChange={(e) => handleFormChange(e)}
                                                                    />
                                                                </td>
                                                            </tr> */}
                                                        </>
                                                    }
                                                    {/* for merchant account */}
                                                            <tr className="single">
                                                                <td colSpan={2}>
                                                                    <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">{locale == "nl" ? "KVK Kamer van Koophandel Nummer" : "KVK Chamber of Commerce Number"}  <span className="required">*</span></label>
                                                                    <input type="text" value={formData.kvk_number}
                                                                        className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.kvk_number ? 'required-field' : 'border-0'}`}
                                                                        name="kvk_number" placeholder={placeholderTranslations[locale]['kvk_number']}
                                                                        onChange={(e) => handleFormChange(e)}
                                                                    />
                                                                </td>
                                                            </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="COUNTRY"/> <span className="required">*</span></label>
                                                            <select className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.country ? 'required-field' : 'border-0'}`}
                                                                style={{height: '3.5rem'}} name="country" value={formData.country}
                                                                onChange={(e) => handleFormChange(e)} disabled={user.country}
                                                            >
                                                                <option className="mini-text-2" value="" disabled>{locale == "nl" ? "Selecteer land" : "Select country"}</option>
                                                                {countries.map((country: any) => (
                                                                <option key={country.id} value={country.attributes.country}>{country.attributes.country}</option>))}
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <div className="mb-3">
                                                                <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="STREET_ADDRESS"/>  <span className="required">*</span></label>
                                                                <input type="text" value={formData.streetaddress_housenumber} disabled={user.streetaddress_housenumber}
                                                                    className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.streetaddress_housenumber ? 'required-field' : 'border-0'}`} 
                                                                    name="streetaddress_housenumber" placeholder={placeholderTranslations[locale]['streetaddress_housenumber']}
                                                                    onChange={(e) => handleFormChange(e)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <input type="text" value={formData.streetaddress_apartment} disabled={user.streetaddress_apartment}
                                                                    className="form-control input-bg-color-2 border-0 body-sub-titles" 
                                                                    name="streetaddress_apartment" placeholder={placeholderTranslations[locale]['streetaddress_apartment']} 
                                                                    onChange={(e) => handleFormChange(e)}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="CITY"/>  <span className="required">*</span></label>
                                                            <input type="text" value={formData.city} disabled={user.city}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.city ? 'required-field' : 'border-0'}`}
                                                                name="city" placeholder={placeholderTranslations[locale]['city']} 
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="STATE"/>  <span className="required">*</span></label>
                                                            <input type="text" value={formData.state} disabled={user.state}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.state ? 'required-field' : 'border-0'}`}
                                                                name="state" placeholder={placeholderTranslations[locale]['state']}
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2"><FormattedMessage id="POST_CODE"/>  <span className="required">*</span></label>
                                                            <input type="text" value={formData.postcode} disabled={user.postcode}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.postcode ? 'required-field' : 'border-0'}`}
                                                                name="postcode" placeholder={placeholderTranslations[locale]['postcode']} 
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 ">
                                                                <input type="checkbox" name="agreement" className="width-checkout"
                                                                    onChange={() => setAgreement(!agreement)}
                                                                /> 
                                                                <FormattedMessage id="ACCEPT_TERMS_AND_CONDITIONS"/>
                                                            </label>
                                                            {(!agreement && incomplete) && <p className="required-text"><FormattedMessage id="AGREE_TO_THE_TERMS"/></p>}
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2} className="">
                                                            <button type="submit" 
                                                                className="place-quote text-white mediumfont body-sub-titles-1 rounded-lg border-0 button-bg-color-1 h-auto p-2"
                                                            ><FormattedMessage id="SUBMIT"/></button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                                }
                                            </table>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
} 

export default SellerRegistration;