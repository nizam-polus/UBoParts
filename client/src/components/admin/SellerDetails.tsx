import React, { useCallback, useEffect, useState } from 'react';
import { UserContext } from '../account_/UserContext';
import APIs from '~/services/apiService';
import { BASE_URL } from 'configuration';
import Link from 'next/dist/client/link';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import AdminSideBar from './AdminSidebar';
import { Button } from 'reactstrap';

function SellerDetails() {
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
    const [adminDetails, setAdminDetails] = useState<any>([])
    const [adminRequirements, setAdminRequirements] = useState<any>([])
    const [verificationURL, setVerificationURL] = useState("")
    const [uid, setUid] = useState()
    const [sellersData, setSellersData] = useState([])
    const [sellerAccountData, setSellerAccountData] = useState<any>()
    const [merchantId, steMerchantId] = useState("")
    const [openSellerId, setOpenSellerId] = useState<any>(null);
    const [loading, setloading] = useState(false)

    useEffect(() => {
        APIs.getAllSellers().then((res) => {

            setSellersData(res.data)
            console.log(res.data)
        }).catch((err) => toast.error(err))
    }, []);

    const handleBankAccountShow = () => {
        document.getElementById('defaultAccount')?.classList.toggle('show');
    }
    const toggleChangeSellerAccountView = (id: any, sellerId: string) => {
        setloading(true)
        setOpenSellerId(openSellerId === sellerId ? null : sellerId);
        steMerchantId(id)
        if(!id){
            toast.warning("There is no data available")
        }else{
            APIs.getMerchantStatus({
                "merchantUid": id
            }).then((res) => {
                console.log(res);
                setSellerAccountData(res.data);
                setloading(false)
            }).catch((err) => {
                toast.error(err);
                setloading(false)
            });
        };
    }

    const approveAccountFunction = (id: any, obj_Uid: any, type: any) => {
        const typePrefix = type.split('.')[0];
       switch(typePrefix){
        case "coc_extract":
            // Call API with the required parameters for coc_extract
            // APIs.approveCocExtract({
            //     "merchantUid": id,
            //     // Additional parameters specific to coc_extract
            // });
            toast.error("some Error Occuerd")
            break;
        case "contact":
            // Call API with the required parameters for contact.verification
            APIs.approveContact({
                "merchantUid": id,
                "contactUid": obj_Uid, // Assuming contactUid is relevant
                // Additional parameters specific to contact.verification
            });
            break;
        case "ubo":
            // Call API with the required parameters for ubo.required
            APIs.approveUbo({
                "merchantUid": id,
                "ubotUid": obj_Uid
            });
            break;
        case "bank_account":
            // Call API with the required parameters for bank_account.verification
            APIs.approveAccount({
                "merchantUid": id,
                "bankUid": obj_Uid
            })
            break;
        default:
            // Handle other cases or provide an error message
            console.error("Unknown type:", type);
            toast.error("Unknown type")
    }
    }

    return (
        <>
            <div className="main-body pb-2 mb-5">
                <div className="container">
                    <section className="profile-wrapper">
                        <div className="row mt-5">
                            <div className="col">
                                <p className="semifont bg-image-text custom-color-8 text-center">All Sellers</p>
                            </div>
                        </div>
                        <div className="row mt-3 ">
                            <AdminSideBar />
                            <div className="col-12 col-md-12 col-xl-9 mt-4 mt-xl-0 mt-md-4">
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
                                        </tbody>
                                    </table>
                                </div>
                                {
                                    sellersData && sellersData.map((item: any, index: any) => {
                                        const sellerId = `seller-${index}`;
                                        return (
                                            <div className="accordion rounded-2 mt-2" id="newBankAccounts" key={index}>

                                                <div className="card">
                                                    <div className="card-header" id="headingOne">
                                                        <h2 className="mb-0">
                                                            <button className="btn btn-link btn-block text-left" type="button"
                                                                onClick={() => toggleChangeSellerAccountView(item.merchant_uid, sellerId)}
                                                                data-toggle="collapse"
                                                                data-target={`#changeBankAccountView-${sellerId}`}
                                                                aria-expanded={openSellerId === sellerId}
                                                                aria-controls={`changeBankAccountView-${sellerId}`}
                                                            >
                                                                {item.username}
                                                            </button>
                                                        </h2>
                                                    </div>
                                                   <div id={`changeBankAccountView-${sellerId}`}
                                                        className={`collapse ${openSellerId === sellerId ? 'show' : ''}`}
                                                        aria-labelledby={`heading-${sellerId}`}
                                                        data-parent={`#${sellerId}`}>
                                                        <div className="card-body">
                                                        {item.merchant_uid ?  
                                                        <>
                                                            {loading ? 
                                                            <div className='text-center'>
                                                                <button type="button" className={`btn btn-muted btn-loading btn-lg`}>
                                                                    Loading
                                                                </button>
                                                            </div> 
                                                            : 
                                                            <>
                                                            <tr className="double">
                                                            <td className="pl-5 pr-xl-3 pr-md-3 pr-5 pt-3 pb-2">
                                                                <label className="custom-color-2 regularfont products-name pb-2">
                                                                    Merchant Status
                                                                </label>
                                                                <span className="badge badge-pill badge-info px-3 py-2 ml-2">
                                                                    {" "}
                                                                    {sellerAccountData && sellerAccountData.status}
                                                                </span>
                                                            </td>
                                                            <td className="pr-5 pl-xl-3 pl-md-3 pl-5 pt-3 pb-2">
                                                                <label className="custom-color-2 regularfont products-name pb-2">
                                                                    Merchant Compliance Status
                                                                </label>
                                                                <span className="badge badge-pill badge-info px-3 py-2 ml-2">
                                                                    {" "}
                                                                    {sellerAccountData && sellerAccountData.compliance_status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        <tr className="single">
                                                            <td colSpan={2}>
                                                                <div className="mb-3 px-sm-3 pt-2">
                                                                    <h3 className='regularfont subtitles pl-3 pb-3'>Outstanding merchant compliance requirements</h3>
                                                                </div>
                                                                <div className="px-sm-3">
                                                                    <ul>
                                                                        <div>
                                                                            {sellerAccountData?.compliance_requirements.length ?
                                                                                sellerAccountData?.compliance_requirements.map((item: any, index: any) => {
                                                                                    console.log(item.object_type);
                                                                                    return (
                                                                                        <li key={index} className='mt-3 mb-3'>
                                                                                            {item.type.match(/^(.*?)\.required$/)} :{" "}
                                                                                            <span className={`badge badge-pill ${item.status == "unverified" ? "badge-danger" : "badge-warning"} ml-2`}>
                                                                                                {" "}
                                                                                                {item.status}
                                                                                            </span>
                                                                                            {item.status == "pending" ? <button className='btn btn-success btn-sm ml-4 rounded' onClick={() => approveAccountFunction(merchantId, item.object_uid, item.type)}>Approve</button> : ""}
                                                                                        </li>
                                                                                    );
                                                                                })
                                                                            :
                                                                            <p >Nil</p>
                                                                            }
                                                                        </div>
                                                                    </ul>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        </>
                                                        }
                                                              
                                                            </>
                                                        :
                                                        <p className='text-center'>No Data Available</p>
                                                        
                                                        }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
export default SellerDetails