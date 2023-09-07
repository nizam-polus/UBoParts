import { useRouter } from 'next/router';
import React from 'react';

function SellerSideBar() {
    const router = useRouter();
    console.log("router",router)
    return (
    <div className="col-12 col-md-3">
        <div className="quote-inner-wrapper coulmn-bg-color-1 rounded p-3 ps-4 pe-4">
            <div className="table-responsive">
                <table className="table quote-table seller-table">
                    <thead>
                        <th className="p-2 pb-3 ps-0 custom-color-2 mediumfont subtitles">Shop Manager</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={router.pathname.includes('/dashboard') ? "active" : ""}>
                                <div>
                                    <a href="/seller/dashboard" className="custom-color-2 regularfont body-sub-titles">Dashboard</a>
                                    {router.pathname.includes('/dashboard') && <span className="arrow-right"></span>}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className={router.pathname.includes('/listings') ? "active" : ""}>
                                <a href="/seller/listings" className="custom-color-2 regularfont body-sub-titles">Listings</a>
                                {router.pathname.includes('/listings') && <span className="arrow-right"></span>}
                            </td>
                        </tr>
                        <tr>
                            <td className={router.pathname.includes('/messages') ? "active" : ""}>
                                <a href="" className="custom-color-2 regularfont body-sub-titles">Messages</a>
                                {router.pathname.includes('/messages') && <span className="arrow-right"></span>}
                            </td>
                        </tr>
                        <tr>
                            <td className={router.pathname.includes('/orders') ? "active" : ""}>
                                <a href="" className="custom-color-2 regularfont body-sub-titles">Orders</a>
                                {router.pathname.includes('/orders') && <span className="arrow-right"></span>}
                            </td>
                        </tr>
                        <tr>
                            <td className={router.pathname.includes('/edit_shop') ? "active" : ""}>
                                <a href="" className="custom-color-2 regularfont body-sub-titles">Edit shop</a>
                                {router.pathname.includes('/edit_shop') && <span className="arrow-right"></span>}
                            </td>
                        </tr>
                        <tr>
                            <td className={router.pathname.includes('/password') ? "active" : ""}>
                                <a href="" className="custom-color-2 regularfont body-sub-titles">Password</a>
                                {router.pathname.includes('/password') && <span className="arrow-right"></span>}
                            </td>
                        </tr>
                        <tr>
                            <td className={router.pathname.includes('/logout') ? "active" : ""}>
                                <a href="" className="custom-color-2 regularfont body-sub-titles">Logout</a>
                                {router.pathname.includes('/logout') && <span className="arrow-right"></span>}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    )
}

export default SellerSideBar;