import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '~/components/shared/AppImage';
import { UserContext } from '../account_/UserContext';
import APIs from '~/services/apiService';
import { BASE_URL } from 'configuration';
import Link from 'next/dist/client/link';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import SellerSideBar from "../seller/SellerSideBar";

function SellerAccount() {
    let userdetails: any;
    if (typeof window !== 'undefined') {
        userdetails = localStorage.getItem('userdetails');
        userdetails = JSON.parse(userdetails);
    }
    const { user, saveUser } = UserContext();
    const router = useRouter();

    const [accountName, setAccountName] = useState<any>("");
    const [accountNumber, setAccountNumber] = useState<any>("")
    const [incomplete, setIncomplete] = useState<any>(false);
    const [profilePicURL, setProfilePicURL] = useState<string>('');
    const [countries, setCountries] = useState<any>([]);
    const [merchantAccountDetails, setMerchantAccountDetails] = useState<any>([])
    const [merchantRequirements, setMerchantRequirements] = useState<any>([])
    const [verificationURL, setVerificationURL] = useState("")
    const [uid, setUid] = useState()
    const [merchantId, setMerchantId] = useState("")

    // useEffect(() => {
    //     APIs.getCountries().then(response => {
    //         setCountries(response.data.data);
    //     }).catch(error => {
    //         console.error('Error fetching data:', error);
    //     });
    // }, []);

    useEffect(() => {
        APIs.getSpecificUser(user.id).then((res) =>{
            console.log(res)
            APIs.getMerchantStatus({
                "merchantUid": res.data.merchant_uid
            }).then((res) => {
                console.log(res.data)
                setMerchantAccountDetails(res.data)
                setMerchantRequirements(res?.data?.compliance_requirements)
                const bankVerification = res?.data?.compliance_requirements?.find(
                    (requirement : any) => requirement.type === 'bank_account.verification.required'
                );
                
                if (bankVerification) {
                    const bankUid = bankVerification.object_uid;
                    // Set the bank_uid to localStorage
                    localStorage.setItem('bank_uid', bankUid);
                }
                
                if (res?.data?.new_accounts) {
                    setAccountNumber(res?.data?.new_accounts[0]?.account.account_iban)
                    setAccountName(res?.data?.new_accounts[0]?.account.account_name)
                    setVerificationURL(res.data.new_accounts[0]?.verification_url)
                    setUid(res?.data?.new_accounts[0]?.uid)
                    localStorage.setItem('admin_uid', res?.data?.new_accounts[0]?.uid);
                    console.log(res?.data?.new_accounts[0]?.uid)
                }
    
            })
        })
        
    }, [])

    const handleBankAccountShow = () => {
        document.getElementById('defaultAccount')?.classList.toggle('show');
    }

    const toggleChangeBankAccountView = () => {
        document.getElementById('changeBankAccountView')?.classList.toggle('show');
    }

    const VarifyAccount = () =>{
        if(uid){
            console.log(verificationURL)
            debugger
            localStorage.setItem('admin_uid', uid);
            location.href = verificationURL
            return
        }else{
            toast.error("no uid")
        }
    }

    return (
        <>
            <div className="main-body pb-2 mb-5">
                <div className="container">
                    <section className="quote-wrapper mt-5">
                        <div className="row ">
                        <SellerSideBar />
                            <div className="col-12 col-md-9 p-0 p-sm-3">
                                <div className="table-responsive">
                                    <table className="table profile-table-1 coulmn-bg-color-1 rounded-2">
                                        <tbody>
                                            <tr>
                                                <th
                                                    colSpan={2}
                                                    className="px-5 pt-3 pb-3 custom-color-3 regularfont subtitles border-top-0 border-bottom"
                                                >
                                                    OPP Current Status
                                                </th>
                                            </tr>

                                            <tr className="double">
                                                <td className="pl-5 pr-xl-3 pr-md-3 pr-5 pt-3 pb-2">
                                                    <label className="custom-color-2 regularfont products-name pb-2">
                                                        Merchant Status
                                                    </label>
                                                    <span className="badge badge-pill badge-info px-3 py-2 ml-2">
                                                        {" "}
                                                        {merchantAccountDetails.status}
                                                    </span>
                                                </td>
                                                <td className="pr-5 pl-xl-3 pl-md-3 pl-5 pt-3 pb-2">
                                                    <label className="custom-color-2 regularfont products-name pb-2">
                                                        Merchant Compliance Status
                                                    </label>
                                                    <span className="badge badge-pill badge-info px-3 py-2 ml-2">
                                                        {" "}
                                                        {merchantAccountDetails.compliance_status}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="single">
                                                <td colSpan={2}>
                                                    <div className="mb-3 px-sm-3 pt-2">
                                                        <h3>Outstanding merchant compliance requirements</h3>
                                                    </div>
                                                    <div className="px-sm-3">
                                                        <ul>
                                                            <div>
                                                                {merchantRequirements?.length ?
                                                                    merchantRequirements.map((item: any, index: any) => {
                                                                        return (
                                                                            <li>
                                                                                {item.type.replace(/\.required$/, '')} :{" "}
                                                                                <span className={`badge badge-pill ${item.status == "unverified" ? "badge-danger" : "badge-warning"} ml-2`}>
                                                                                    {" "}
                                                                                    {item.status}
                                                                                </span>
                                                                                {
                                                                                item.status == "pending" ?
                                                                                 "" :
                                                                                <span className='pl-4'><a href={item.object_redirect_url} target="_blank">Verify now</a></span>
                                                                                }
                                                                                
                                                                                
                                                                            </li>
                                                                        );
                                                                    }) : "Nil"}
                                                            </div>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="accordion" id="accountDetails">
                                    <div className="card">
                                        <div className="card-header" id="headingOne">
                                            <h2 className="mb-0">
                                                <button
                                                    className="btn btn-link btn-block text-left"
                                                    type="button"
                                                    onClick={() => handleBankAccountShow()}
                                                    data-toggle="collapse"
                                                    data-target="#defaultAccount"
                                                    aria-expanded="true"
                                                    aria-controls="defaultAccount"
                                                >
                                                    Account Details
                                                </button>
                                            </h2>
                                        </div>

                                        <div
                                            id="defaultAccount"
                                            className="collapse"
                                            aria-labelledby="headingOne"
                                            data-parent="#accountDetails"
                                        >
                                            <div className="card-body">
                                                {merchantAccountDetails?.bank_details &&
                                                    merchantAccountDetails?.bank_details.map((account: any, index: any) => {
                                                        if (
                                                            account.status === "approved" &&
                                                            account.is_default === true
                                                        )
                                                            return (
                                                                <div className="table-responsive" key={index}>
                                                                    <table className="table profile-table-1 coulmn-bg-color-1 rounded-2 mt-2">
                                                                        <tbody>
                                                                            <tr>
                                                                                <th
                                                                                    colSpan={2}
                                                                                    className="px-5 pt-3 pb-3 custom-color-3 regularfont subtitles border-top-0 border-bottom "
                                                                                >
                                                                                    <div className="float-left pt-2">
                                                                                        Default Bank Account
                                                                                    </div>
                                                                                </th>
                                                                                <div className="row mt-3 mx-2">
                                                                                    <div className="col">
                                                                                        <span className="badge badge-pill badge-info px-3 py-2 ml-2">
                                                                                            {account.status}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </tr>
                                                                            <tr className="single">
                                                                                <td>
                                                                                    <>
                                                                                        <div className="px-sm-3">
                                                                                            <label className="custom-color-2 regularfont products-name pb-2">
                                                                                                Account Number
                                                                                            </label>
                                                                                            <input
                                                                                                type="text"
                                                                                                value={
                                                                                                    account?.account.account_iban
                                                                                                }
                                                                                                className="form-control input-bg-color-2 border-0 products-name"
                                                                                                name="account_number"
                                                                                                readOnly
                                                                                            />
                                                                                        </div>
                                                                                        <div className="mb-3 px-sm-3 pt-2">
                                                                                            <label className="custom-color-2 regularfont products-name pb-2">
                                                                                                Account Name
                                                                                            </label>
                                                                                            <input
                                                                                                type="text"
                                                                                                value={
                                                                                                    account?.account.account_name
                                                                                                }
                                                                                                className={`form-control input-bg-color-2 products-name `}
                                                                                                name="account_name"
                                                                                                readOnly
                                                                                            />
                                                                                        </div>
                                                                                    </>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            );
                                                    })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion rounded-2 mt-2" id="newBankAccounts">
                                    <div className="card">
                                        <div className="card-header" id="headingOne">
                                            <h2 className="mb-0">
                                                <button className="btn btn-link btn-block text-left" type="button" onClick={() => toggleChangeBankAccountView()} data-toggle="collapse" data-target="#changeBankAccountView" aria-expanded="true" aria-controls="changeBankAccountView">
                                                    New Account(s)
                                                </button>
                                            </h2>
                                        </div>

                                        <div id="changeBankAccountView" className="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                                            <div className="card-body">

                                                {merchantAccountDetails?.new_accounts && merchantAccountDetails?.new_accounts.map((account: any, index: any) => {
                                                    return (
                                                        // <li className="list-group-item"><Link href={account.verification_url}>Change Account</Link></li>

                                                        <div className="table-responsive" key={index}>
                                                            <table className="table profile-table-1 coulmn-bg-color-1 rounded-2 mt-2 border-bottom">
                                                                <tbody>
                                                                    <tr>
                                                                        <th
                                                                            colSpan={2}
                                                                            className="px-5 pt-3 pb-3 custom-color-3 regularfont subtitles border-top-0"
                                                                        >
                                                                            <div className="float-left pt-2">
                                                                                Bank Account {index + 1}
                                                                            </div>
                                                                        </th>
                                                                        <div className="row mt-3 mx-2">
                                                                            <div className="col ubo-btn-bank-change">
                                                                                <Link href={account.verification_url}>Change to this account</Link>
                                                                            </div>
                                                                        </div>
                                                                    </tr>
                                                                    <tr className="single">
                                                                        <td>
                                                                            <>
                                                                                <div className="px-sm-3">
                                                                                    <label className="custom-color-2 regularfont products-name pb-2">
                                                                                        Account Number
                                                                                    </label>
                                                                                    <input
                                                                                        type="text"
                                                                                        value={
                                                                                            account?.account
                                                                                                .account_iban
                                                                                        }
                                                                                        className="form-control input-bg-color-2 border-0 products-name"
                                                                                        name="account_number"
                                                                                        readOnly
                                                                                    />
                                                                                </div>
                                                                                <div className="mb-3 px-sm-3 pt-2">
                                                                                    <label className="custom-color-2 regularfont products-name pb-2">
                                                                                        Account Name
                                                                                    </label>
                                                                                    <input
                                                                                        type="text"
                                                                                        value={
                                                                                            account?.account
                                                                                                .account_name
                                                                                        }
                                                                                        className={`form-control input-bg-color-2 products-name `}
                                                                                        name="account_name"
                                                                                        readOnly
                                                                                    />
                                                                                </div>
                                                                            </>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )
                                                })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
export default SellerAccount