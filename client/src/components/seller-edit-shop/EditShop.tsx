import React, { useEffect, useState } from "react";
import { UserContext } from "../account_/UserContext";
import APIs from '../../services/apiService';
import { useRouter } from "next/router";
import SellerSideBar from "../seller/SellerSideBar";

function EditShop() {

    const { user, saveUser } = UserContext();
    const router = useRouter();
    console.log(user)

    const [formData, setFormData] = useState({
        user_type: "seller",
        isApproved: "Pending",
        company_name: '',
        commission_amount: '',
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

    useEffect(() => {
        // window.onbeforeunload = function () {
        //     return "Changes may not be saved!";
        // }
        if (user && user.id) {
            formData.company_name = user.company_name;
            formData.Account_type = user.Account_type
            formData.Account_title = user.account_title
            formData.commission_amount = user.commission_amount
            formData.Bank_name = user.bank_name;
            formData.iban_number = user.iban_number
            setFormData({ ...formData });
        }
    }, [])

    const checkFormStatus = () => {
        let incomplete = true;
        incomplete = !(!!formData.company_name &&
            !!formData.Account_title && !!formData.Bank_name &&
            !!formData.iban_number && !!formData.Account_type && agreement);
        return incomplete;
    }

    const handleFormChange = (event: any) => {
        const { name, value } = event.target;
        setFormData((prevFormData => ({ ...prevFormData, [name]: value })));
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        let incomplete = checkFormStatus();
        setIncomplete(incomplete);
        let reqElement = document.getElementById('required');
        if (reqElement) reqElement.scrollIntoView({ behavior: 'smooth' })
        let sellerData: any = {
            company_name: formData.company_name,
            Account_type: formData.Account_type,
            account_title: formData.Account_title,
            bank_name: formData.Bank_name,
            iban_number: formData.iban_number,
            commission_amount: formData.commission_amount,
            user_type: user.user_type,
            isApproved: user.isApproved,
            kvk_number: formData.kvk_number,
            company_btw: formData.company_btw
        };
        if (!incomplete) {
            APIs.updateSpecificUser(user.id, sellerData).then(response => {
                getAndSaveUser(response.data.id);
            }).catch((err) => console.log(err));
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
                        <div className="row mt-3 g-4">
                            <SellerSideBar />
                            <div className="col-12 col-md-9 p-0 p-sm-3">
                                <div>
                                    {incomplete && <p className='required-text text-danger' id='required'>* Please fill the required fields</p>}
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="quote-inner-wrapper coulmn-bg-color-1 rounded p-3 p-sm-5 ps-5 pe-5">
                                            <form onSubmit={(e) => handleSubmit(e)}>
                                                <div className="table-responsive">
                                                    <table className="table quote-table">
                                                        <tbody>
                                                            <tr>
                                                                <th colSpan={2}
                                                                    className="pt-0 pb-0 px-0 ps-0 custom-color-2 regularfont subtitles fw-normal border-top-0 border-bottom-0"
                                                                >Edit shop with us <span className="regularfont body-sub-titles ml-sm-3 align-middle font-weight-normal d-inline-block d-sm-inline">Edit your shop information</span></th>

                                                            </tr>
                                                            <tr>
                                                                <td colSpan={2}
                                                                    className="pb-4 pt-4 pl-0 semifont boldfontsize border-top-0">
                                                                    <hr className="p-0 m-0 " />
                                                                </td>
                                                            </tr>
                                                            <tr className="double">
                                                                <td >
                                                                    <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Account Type <span className="required">*</span></label>
                                                                    <select className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.Account_type ? 'required-field' : 'border-0'}`}
                                                                        style={{ height: '3.5rem' }} name="Account_type" value={formData.Account_type}
                                                                        onChange={(e) => handleFormChange(e)}
                                                                    >
                                                                        <option value='' disabled>Select an account type</option>
                                                                        <option value="Individual">Individual</option>
                                                                        <option value="Business">Business/Company</option>
                                                                    </select>
                                                                </td>
                                                                <td>
                                                                    <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Commission Amount <span className="required">*</span></label>
                                                                    <input type="text" value={formData.commission_amount}
                                                                        className={`form-control input-bg-color-2 body-sub-titles `}
                                                                        name="commission_amount" placeholder="Commission amount."
                                                                        readOnly
                                                                    />
                                                                </td>
                                                            </tr>
                                                            {formData.Account_type === 'Business' &&
                                                                <>
                                                                    <tr className="double">
                                                                        <td>
                                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Company BTW # (Optional)</label>
                                                                            <input type="text" value={formData.company_btw}
                                                                                className="form-control input-bg-color-2 border-0 body-sub-titles"
                                                                                name="company_btw" placeholder="Example: 32165421"
                                                                                onChange={(e) => handleFormChange(e)}
                                                                            />
                                                                        </td>
                                                                        <td >
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
                                                                    <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Company or Shop name <span className="required">*</span></label>
                                                                    <input type="text" value={formData.company_name}
                                                                        className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.company_name ? 'required-field' : 'border-0'}`}
                                                                        name="company_name" placeholder="Aw parts corp."
                                                                        onChange={(e) => handleFormChange(e)}
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr className="single">
                                                                <td colSpan={2}>
                                                                    <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Account Title <span className="required">*</span></label>
                                                                    <input type="text" value={formData.Account_title}
                                                                        className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.Account_title ? 'required-field' : 'border-0'}`}
                                                                        name="Account_title" placeholder="Aw parts corp."
                                                                        onChange={(e) => handleFormChange(e)}
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr className="double">
                                                                <td>
                                                                    <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Bank Name <span className="required">*</span></label>
                                                                    <input type="text" value={formData.Bank_name}
                                                                        className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.Bank_name ? 'required-field' : 'border-0'}`}
                                                                        name="Bank_name" placeholder="Bank name."
                                                                        onChange={(e) => handleFormChange(e)}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Iban Number <span className="required">*</span></label>
                                                                    <input
                                                                        type="text"
                                                                        value={formData.iban_number}
                                                                        className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.iban_number ? 'required-field' : 'border-0'
                                                                            }`}
                                                                        name="iban_number"
                                                                        placeholder="Iban number."
                                                                        onChange={(e) => {
                                                                            const newValue = e.target.value
                                                                            handleFormChange({ target: { name: 'iban_number', value: newValue } });
                                                                        }}
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
                                                                    {(!agreement && incomplete) && <p className="required-text text-danger">Agree to the terms</p>}
                                                                </td>
                                                            </tr>
                                                            <tr className="single">
                                                                <td colSpan={2} className="">
                                                                    <button type="submit"
                                                                        className="place-quote text-white mediumfont body-sub-titles-1 rounded-lg border-0 button-bg-color-1 h-auto p-2 ubo-btn-custom"
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
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}

export default EditShop;