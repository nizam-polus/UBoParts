import { useRouter } from 'next/router';
import React from 'react';
import { UserContext } from '../account_/UserContext';

function AdminSideBar() {

    const {user} = UserContext();
    const router = useRouter();
    
    return (
    <div className="col-12 col-md-3">
        <div className="quote-inner-wrapper coulmn-bg-color-1 rounded  md-5 pb-5 pt-0 px-3 ps-4 pe-4">
            <div className="table-responsive">
                <table className="table quote-table seller-table">
                    <thead>
                        <tr>
                            <th className="pt-0 p-2 pb-1 ps-0 custom-color-2 regularfont body-sub-titles border-bottom border-top-0">
                               Admin Dashboard
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        
                            <tr>
                                <td className={"pointer " + (router.pathname.includes('/admin') ? "active p-1 pl-2" : "")}>
                                    <div>
                                        <a onClick={() => router.push('/admin')} className="custom-color-2 regularfont products-name">Account Details</a>
                                        {router.pathname.includes('/admin') && <span className="arrow-right"></span>}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className={"pointer " + (router.pathname.includes('/seller-details') || router.pathname.includes('/seller-details') ? "active p-1 pl-2" : "")}>
                                    <a onClick={() => router.push('/seller-details')} className="custom-color-2 regularfont products-name">Seller Details</a>
                                    {(router.pathname.includes('/seller-details') || router.pathname.includes('/create_new_listing') )&& <span className="arrow-right"></span>}
                                </td>
                            </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    )
}

export default AdminSideBar;