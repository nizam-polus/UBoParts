import React, { useEffect, useState } from "react";
import { UserContext } from "../account_/UserContext";
import APIs from '../../services/apiService';
import { useRouter } from "next/router";


function SellerRegistration() {

    const {user, saveUser} = UserContext();
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
        password: '',
        kvk_number: '',
        company_btw: '',
    });
    const [agreement, setAgreement] = useState(false);
    const [incomplete, setIncomplete] = useState(false);
    const [password, setPassword] = useState('');
    const [cnfrmPassword, setCnfrmPassword] = useState('');
    const [pwdmatch, setPwdmatch] = useState(true);

    useEffect(() => {
        window.onbeforeunload = function() {
            return "Changes may not be saved!";
        }
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
        // checkFormStatus();
        const { name, value } = event.target;
        setFormData((prevFormData => ({...prevFormData, [name]: value})));
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        let incomplete = checkFormStatus();
        setIncomplete(incomplete);
        let reqElement = document.getElementById('required');
        if (reqElement) reqElement.scrollIntoView({behavior: 'smooth'})
        let sellerData: any = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            username: formData.username,
            email: formData.email,
            phone_number: formData.phone_number,
            streetaddress_housenumber: formData.streetaddress_housenumber,
            streetaddress_apartment: formData.streetaddress_apartment,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            postcode: formData.postcode,
            company_name: formData.company_name,
            Account_type: formData.Account_type,
            user_type: "seller",
            isApproved: "Pending",
            shippingaddress_company: formData.company_name,
            shippingaddress_country: formData.country,
            shippingaddress_streataddress_housenumber: formData.streetaddress_housenumber,
            shippingaddress_streataddress_apartment: formData.streetaddress_apartment,
            shippingaddress_city: formData.city,
            shippingaddress_state: formData.state,
            shippingaddress_postcode: formData.postcode,
            shippingaddress_phonenumber: formData.phone_number
        };
        if (!incomplete) {
            let userdetails: any = {};
            if (!user || (user && !user.id)) {
                sellerData.password = cnfrmPassword;
                APIs.register(sellerData).then(response => {
                    userdetails = response.data.user;
                    localStorage.setItem('usertoken', response.data.jwt);
                    localStorage.setItem('userdetails', JSON.stringify(userdetails));
                    saveUser(userdetails);
                    router.push('/homepage');
                }).catch(err => console.log(err))
            } else {
                APIs.updateSpecificUser(user.id, sellerData).then(response => {
                    userdetails = response.data;
                    localStorage.setItem('userdetails', JSON.stringify(userdetails));
                    saveUser(userdetails);
                    router.push('/homepage');
                }).catch((err) => console.log(err));
            }
        }
    }
    

    return (
        <>
            <div className="main-body pb-2 mb-5">
                <div className="container">
                    <section className="quote-wrapper mt-5">
                        <div>
                            {incomplete && <p className='required-text' id='required'>* Please fill the required fields</p>}
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="quote-inner-wrapper coulmn-bg-color-1 rounded p-5 ps-5 pe-5">
                                    <form onSubmit={(e) => handleSubmit(e)}>
                                        <div className="table-responsive">
                                            <table className="table quote-table">
                                                <tbody>
                                                    <tr>
                                                        <th colSpan={2} 
                                                            className="pt-0 pb-0 px-0 ps-0 custom-color-2 regularfont subtitles fw-normal border-top-0 border-bottom-0"
                                                        >Start selling with us <span className="regularfont body-sub-titles ml-3 align-middle font-weight-normal">Fill your account information</span></th>
                                                        
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={2} 
                                                            className="pb-4 pt-4 pl-0 semifont boldfontsize border-top-0"> 
                                                            <hr className="p-0 m-0 " />
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">First Name</label>
                                                            <input type="text" value={formData.first_name} disabled={user.first_name}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.first_name ? 'required-field' : 'border-0'}`}
                                                                name="first_name" placeholder="Mark"
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Last Name</label>
                                                            <input type="text" value={formData.last_name} disabled={user.last_name}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.last_name ? 'required-field' : 'border-0'}`}
                                                                name="last_name" placeholder="Twain" 
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Email Address</label>
                                                            <input type="text" value={formData.email} disabled={user.email}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.email ? 'required-field' : 'border-0'}`}
                                                                name="email" placeholder="user@example.com"
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Username</label>
                                                            <input type="text" value={formData.username} disabled={user.username}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.username ? 'required-field' : 'border-0'}`}
                                                                name="username" placeholder="username" 
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Create Password</label>
                                                            <input type="password" value={password} disabled={user.id}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !password ? 'required-field' : 'border-0'}`}
                                                                name="password" placeholder="Create Password" 
                                                                onChange={(e) => {
                                                                    setPassword(e.target.value);
                                                                    e.target.value.length < 6 && !user.id ? setIncomplete(true) : setIncomplete(false);
                                                                }}
                                                            />
                                                            {(password.length < 6 && incomplete && !user.id) && <span className="required-text">Password must be at least 6 characters </span>}
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Confirm Password</label>
                                                            <input type="password" value={cnfrmPassword} disabled={user.id}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !cnfrmPassword ? 'required-field' : 'border-0'}`}
                                                                name="c_password" placeholder="Confirm Password" 
                                                                onChange={(e) => handlePwdChange(e)}
                                                            />
                                                            {!pwdmatch && !user.id && <span className="required-text">Password does not match</span>}
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Phone Number</label>
                                                            <input type="text" value={formData.phone_number} disabled={user.phone_number}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.phone_number ? 'required-field' : 'border-0'}`}
                                                                name="phone_number" placeholder="(XXX) XXX-XXXX" 
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Account Type</label>
                                                            <select className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.Account_type ? 'required-field' : 'border-0'}`}
                                                                style={{height: '3.5rem'}} name="Account_type" value={formData.Account_type}
                                                                onChange={(e) => handleFormChange(e)}
                                                            >
                                                                <option value='' disabled>Select an account type</option>
                                                                <option value="Individual">Individual</option>
                                                                <option value="Business">Business/Company</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Company or Shop name</label>
                                                            <input type="text" value={formData.company_name}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.company_name ? 'required-field' : 'border-0'}`}
                                                                name="company_name" placeholder="Aw parts corp." 
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    { formData.Account_type === 'business' && 
                                                        <>
                                                            <tr className="single">
                                                                <td colSpan={2}>
                                                                    <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Company BTW # (Optional)</label>
                                                                    <input type="text" value={formData.company_btw}
                                                                        className="form-control input-bg-color-2 border-0 body-sub-titles" 
                                                                        name="company_btw" placeholder="Example: 32165421" 
                                                                        onChange={(e) => handleFormChange(e)}
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr className="single">
                                                                <td colSpan={2}>
                                                                    <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">KVK Chamber of Commerce Number</label>
                                                                    <input type="text" value={formData.kvk_number}
                                                                        className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.kvk_number ? 'required-field' : 'border-0'}`}
                                                                        name="kvk_number" placeholder="KVK Number" 
                                                                        onChange={(e) => handleFormChange(e)}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        </>
                                                    }
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Country</label>
                                                            <select className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.country ? 'required-field' : 'border-0'}`}
                                                                style={{height: '3.5rem'}} name="country" value={formData.country}
                                                                onChange={(e) => handleFormChange(e)} disabled={user.country}
                                                            >
                                                                <option className="mini-text-2" value="" selected disabled>Select Country</option>
                                                                <option value="Netherlands">Netherlands</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <div className="mb-3">
                                                                <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Street Address</label>
                                                                <input type="text" value={formData.streetaddress_housenumber} disabled={user.streetaddress_housenumber}
                                                                    className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.streetaddress_housenumber ? 'required-field' : 'border-0'}`} 
                                                                    name="streetaddress_housenumber" placeholder="House number and street name" 
                                                                    onChange={(e) => handleFormChange(e)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <input type="text" value={formData.streetaddress_apartment} disabled={user.streetaddress_apartment}
                                                                    className="form-control input-bg-color-2 border-0 body-sub-titles" 
                                                                    name="streetaddress_apartment" placeholder="Apartment, suite, unit etc..." 
                                                                    onChange={(e) => handleFormChange(e)}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">City</label>
                                                            <input type="text" value={formData.city} disabled={user.city}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.city ? 'required-field' : 'border-0'}`}
                                                                name="city" placeholder="City" 
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">State</label>
                                                            <input type="text" value={formData.state} disabled={user.state}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.state ? 'required-field' : 'border-0'}`}
                                                                name="state" placeholder="State" 
                                                                onChange={(e) => handleFormChange(e)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Postcode</label>
                                                            <input type="text" value={formData.postcode} disabled={user.postcode}
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.postcode ? 'required-field' : 'border-0'}`}
                                                                name="postcode" placeholder="Postcode" 
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
                                                                Accept terms & conditons
                                                            </label>
                                                            {(!agreement && incomplete) && <p className="required-text">Agree to the terms</p>}
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2} className="">
                                                            <button type="submit" 
                                                                className="place-quote text-white mediumfont body-sub-titles-1 rounded-lg border-0 button-bg-color-1 h-auto p-2"
                                                            >Submit</button>
                                                        </td>
                                                    </tr>
                                                </tbody>
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