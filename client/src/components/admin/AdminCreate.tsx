import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '~/components/shared/AppImage';
import { UserContext } from '../account_/UserContext';
import APIs from '~/services/apiService';
import { BASE_URL } from 'configuration';
import Link from 'next/dist/client/link';
import { useRouter } from 'next/router';

function AdminCreate() {
    let userdetails: any;
    if (typeof window !== 'undefined') {
        userdetails = localStorage.getItem('userdetails');
        userdetails = JSON.parse(userdetails);
    }
    const {user, saveUser} = UserContext();
    const router = useRouter();

    const [accountName, setAccountName] = useState<any>("");
    const [accountNumber, setAccountNumber] = useState<any>("")
    const [incomplete, setIncomplete] = useState<any>(false);
    const [profilePicURL, setProfilePicURL] = useState<string>('');
    const [countries, setCountries] = useState<any>([]);
    const [adminDetails, setAdminDetails] = useState<any>([])
    const [adminRequirements, setAdminRequirements] = useState<any>([])

    useEffect(() => {
        APIs.getCountries().then(response => {
            setCountries(response.data.data);
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
      }, []); 

      useEffect(() =>{
       APIs.getAdminStatus().then((res) =>{
        console.log(res.data)
        setAdminDetails(res.data)
        setAdminRequirements(res.data.compliance_requirements)
        setAccountNumber(res.data.bank_details[0].account.account_iban)
        setAccountName(res.data.bank_details[0].account.account_name)
       })
      },[])

    return (
        <> 
            <div className="main-body pb-2 mb-5">
                <div className="container">
                    <section className="profile-wrapper">
                        <div className="row mt-5">
                            <div className="col">
                                <p className="semifont bg-image-text custom-color-8 text-center">Admin</p>
                            </div>
                        </div>
                        <div className="row mt-3 ">
                            <div className="col-12 col-md-12 col-xl-3">
                                <div className="profile-image-wrapper coulmn-bg-color-1 rounded-2 p-5 pb-2 text-center">
                                    <AppImage src={BASE_URL + (profilePicURL || '/images/img/dummy-profile.png')} className="profile-pic" width={"70px"} height={"70px"} style={{borderRadius: "100%"}}/>
                                    <div>
                                        <label  htmlFor="formId" className='position-relative position-overlap-edit-icon'>
                                            <input type="file" id="formId" hidden />
                                            <AppImage className="icon-size1" src={'images/img/Vector.png'}/>
                                        </label>
                                    </div>
                                    <p className="mt-0 mb-1 custom-color-1 boldfont products-name">{(user.first_name || '') + ' ' + (user.last_name || '')}</p>
                                    <p className="mt-1 mb-2 custom-color-1 regularfont products-name">{user.username}</p>
                                </div>
                                {/* {user.isApproved === 'Active' && user.user_type !== 'seller' && <div className='text-center mt-3'>
                                    <Link href={'/seller-registration'}><a style={{textDecoration: 'underline', color: 'red'}}>Want to become a Seller?</a></Link>
                                </div>} */}
                            </div>
                            <div className="col-12 col-md-12 col-xl-9 mt-4 mt-xl-0 mt-md-4">
                                <form action="">
                                    <div className="table-responsive">
                                        <table className="table profile-table-1 coulmn-bg-color-1 rounded-2">
                                            <tbody>
                                                <tr>
                                                    <th colSpan={2} className="px-5 pt-3 pb-3 custom-color-3 regularfont subtitles border-top-0 border-bottom">Admin Status</th>
                                                </tr>
                                            
                                                <tr className="double">
                                                    <td className='pl-5 pr-xl-3 pr-md-3 pr-5 pt-3 pb-2'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Merchant Status</label>
                                                        <input type="text" value={adminDetails.status}
                                                            className={`form-control input-bg-color-2 products-name`}
                                                            readOnly 
                                                        />
                                                    </td>
                                                    <td className='pr-5 pl-xl-3 pl-md-3 pl-5 pt-3 pb-2'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Merchant Compliance Status</label>
                                                        <input type="text" value={adminDetails.compliance_status}
                                                            className={`form-control input-bg-color-2 products-name`}
                                                            readOnly
                                                        />
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                     <td colSpan={2}>
                                                        <div className="mb-3 px-sm-3 pt-2">
                                                        <h3>Outstanding Compliance Requirements</h3>
                                                        </div>
                                                        <div className='px-sm-3'>
                                                            <ul>
                                                                <div>
                                                                {adminRequirements && adminRequirements.map((item: any, index: any) =>{
                                                                    console.log(item.object_type)
                                                                    return (

                                                                        <li>
                                                                            {item.object_type} : <span className='ml-2' style={{color: "red"}}> {item.status}</span>
                                                                        </li> 
                                                                    )
                                                                })}
                                                                </div>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {adminDetails?.bank_details && (
                                        <div className="table-responsive">
                                        <table className="table profile-table-1 coulmn-bg-color-1 rounded-2 mt-2">
                                            <tbody>
                                                <tr>
                                                    <th colSpan={2} className="px-5 pt-3 pb-3 custom-color-3 regularfont subtitles border-top-0 border-bottom ">
                                                        <div className="float-left pt-2">Account Details</div>
                                                    </th>
                                                    <div className="row mt-3 mx-2">
                                                    <div className="col">
                                                        <button type="submit"
                                                            className="custom-color-7 mediumfont rounded border-0 button-bg-color-1 pb-2 pt-2 px-5 d-flex align-items-center justify-content-center ubo-btn-mobile"
                                                        >{adminDetails.bank_details[0].status}</button>
                                                    </div>
                                                </div>
                                                </tr>            
                                                <tr className="single">
                                                    <td>
                                                        <>
                                                            <div className='px-sm-3'>
                                                                <label className="custom-color-2 regularfont products-name pb-2">Account Number</label>
                                                                <input type="text"
                                                                    value={adminDetails?.bank_details[0]?.account.account_iban}
                                                                    className="form-control input-bg-color-2 border-0 products-name"
                                                                    name="account_number"
                                                                    readOnly
                                                                />
                                                            </div>
                                                            <div className="mb-3 px-sm-3 pt-2">
                                                                <label className="custom-color-2 regularfont products-name pb-2">Account Name</label>
                                                                <input type="text"
                                                                    value={adminDetails?.bank_details[0]?.account.account_name}
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
                                    }
                                    <div className="table-responsive">
                                        <table className="table profile-table-1 coulmn-bg-color-1 rounded-2 mt-2">
                                            <tbody>

                                                <tr>
                                                    <th colSpan={2} className="px-5 pt-3 pb-3 custom-color-3 regularfont subtitles border-top-0 border-bottom ">
                                                        <div className="float-left pt-2">Edit Account Details</div>
                                                    </th>
                                                </tr>
                                                <tr className="single">
                                                    <td>
                                                        <div className='px-sm-3'>
                                                            <label className="custom-color-2 regularfont products-name pb-2">Account Number</label>
                                                            <input type="text"
                                                                value={accountNumber}
                                                                className="form-control input-bg-color-2 border-0 products-name"
                                                                name="account_number"
                                                                onChange={(e) => setAccountNumber(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="mb-3 px-sm-3 pt-2">
                                                            <label className="custom-color-2 regularfont products-name pb-2">Account Name</label>
                                                            <input type="text" 
                                                                value={accountName}
                                                                className={`form-control input-bg-color-2 products-name `} 
                                                                name="account_name" 
                                                                onChange={(e) => setAccountName(e.target.value)}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="row mt-3 mx-2">
                                        <div className="col">
                                            <button type="submit" 
                                                className="custom-color-7 mediumfont rounded border-0 button-bg-color-1 pb-2 pt-2 px-5 d-flex align-items-center justify-content-center ubo-btn-mobile"
                                            >Change Account details</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
export default AdminCreate;