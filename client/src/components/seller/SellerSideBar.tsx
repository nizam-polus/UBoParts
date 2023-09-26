import { useRouter } from 'next/router';
import React from 'react';
import { UserContext } from '../account_/UserContext';

function SellerSideBar() {

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
                                {user?.isApproved === 'Active' && (user?.role && user?.role?.type === 'seller') ? 'Shop Manager' : 'Buyer Dashboard'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user?.role && user?.role?.type === 'authenticated' && <>
                            <tr>
                                <td className={"pointer " + (router.pathname.includes('/purchase-history') ? "active p-1 pl-2" : "")}>
                                    <div>
                                        <a onClick={() => router.push('/purchase-history')} className="custom-color-2 regularfont products-name">Dashboard</a>
                                        {router.pathname.includes('/purchase-history') && <span className="arrow-right"></span>}
                                    </div>
                                </td>
                            </tr>
                        </>}
                        {user?.isApproved === 'Active' && (user?.role && user?.role?.type === 'seller') && <>
                            <tr>
                                <td className={"pointer " + (router.pathname.includes('/dashboard') ? "active p-1 pl-2" : "")}>
                                    <div>
                                        <a onClick={() => router.push('/seller/dashboard')} className="custom-color-2 regularfont products-name">Dashboard</a>
                                        {router.pathname.includes('/dashboard') && <span className="arrow-right"></span>}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className={"pointer " + (router.pathname.includes('/listings') || router.pathname.includes('/create_new_listing') ? "active p-1 pl-2" : "")}>
                                    <a onClick={() => router.push('/seller/listings')} className="custom-color-2 regularfont products-name">Listings</a>
                                    {(router.pathname.includes('/listings') || router.pathname.includes('/create_new_listing') )&& <span className="arrow-right"></span>}
                                </td>
                            </tr>
                            {/* <tr>
                                <td className={"pointer " + (router.pathname.includes('/messages') ? "active p-1 pl-2" : "")}>
                                    <a onClick={() => router.push('/seller/messages')} className="custom-color-2 regularfont products-name">Messages</a>
                                    {router.pathname.includes('/messages') && <span className="arrow-right"></span>}
                                </td>
                            </tr> */}
                            <tr>
                                <td className={"pointer " + (router.pathname.includes('/orders') ? "active p-1 pl-2" : "")}>
                                    <a onClick={() => router.push('/seller/orders')} className="custom-color-2 regularfont products-name">Orders</a>
                                    {router.pathname.includes('/orders') && <span className="arrow-right"></span>}
                                </td>
                            </tr>
                            <tr>
                                <td className={"pointer " + (router.pathname.includes('/edit_shop') ? "active p-1 pl-2" : "")}>
                                    <a onClick={() => router.push('/seller/edit_shop')} className="custom-color-2 regularfont products-name">Edit shop</a>
                                    {router.pathname.includes('/edit_shop') && <span className="arrow-right"></span>}
                                </td>
                            </tr>
                            <tr>
                                <td className={"pointer " + (router.pathname.includes('/purchase-history') ? "active p-1 pl-2" : "")}>
                                    <a onClick={() => router.push('/purchase-history')} className="custom-color-2 regularfont products-name">Purchase history</a>
                                    {router.pathname.includes('/purchase-history') && <span className="arrow-right"></span>}
                                </td>
                            </tr>
                            {/* <tr>
                                <td className={"pointer " + (router.pathname.includes('/password') ? "active p-1 pl-2" : "")}>
                                    <a onClick={() => router.push('/seller/password')} className="custom-color-2 regularfont products-name">Password</a>
                                    {router.pathname.includes('/password') && <span className="arrow-right"></span>}
                                </td>
                            </tr>
                            <tr>
                                <td className={"pointer " + (router.pathname.includes('/logout') ? "active p-1 pl-2" : "")}>
                                    <a onClick={() => router.push('/seller/logout')} className="custom-color-2 regularfont products-name">Logout</a>
                                    {router.pathname.includes('/logout') && <span className="arrow-right"></span>}
                                </td>
                            </tr> */}
                        </>}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    )
}

export default SellerSideBar;