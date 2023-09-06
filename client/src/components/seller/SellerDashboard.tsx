import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '~/components/shared/AppImage';
function SellerDashboard() {
    return (
    
        <> 
          <div className="main-body pb-2 mb-5">
            <div className="container">
                <section className="quote-wrapper mt-5">
                    <div className="row mt-3 g-4">
                        <div className="col-12 col-md-3">
                            <div className="quote-inner-wrapper coulmn-bg-color-1 rounded p-3 ps-4 pe-4">
                                <div className="table-responsive">
                                    <table className="table quote-table seller-table">
                                        <thead>
                                            <th className="p-2 pb-3 ps-0 custom-color-2 mediumfont subtitles">Shop Manager</th>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="active">
                                                    <div>
                                                        <a href="" className="custom-color-2 regularfont body-sub-titles">Dashboard</a>
                                                        <span className="arrow-right"></span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="" className="custom-color-2 regularfont body-sub-titles">Listings</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="" className="custom-color-2 regularfont body-sub-titles">Messages</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="" className="custom-color-2 regularfont body-sub-titles">Orders</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="" className="custom-color-2 regularfont body-sub-titles">Edit shop</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="" className="custom-color-2 regularfont body-sub-titles">Password</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="" className="custom-color-2 regularfont body-sub-titles">Logout</a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-9">
                            <div className="coulmn-bg-color-1 rounded p-5">
                                <div className="row">
                                    <div className="col">
                                        <div className="img-seller-wrapper ps-4 pe-4">
                                            <div className="table-responsive">
                                                <table className="table seller-table1 m-0">
                                                    <thead>
                                                        <th className="p-2 pb-3 ps-0 text-center"><AppImage src="images/seller-prod-1.png" /></th>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="border-0 text-center semifont pt-3 boldfontsize">Kila International AUTODEMONTAGEBED</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="border-0 text-center boldfontsize pt-1"><span className="me-2 regularfont">5 Open</span><span className="ms-2 mediumfont ">0 Completed</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="p-3 pg-lg-3 pb-xl-0 text-center border-0">
                                                                <button type="button" className="custom-color-7 boldfont mini-text-3 rounded border-0 button-bg-color-1 pb-2 pt-2 p-3">View Front Shop</button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="month-wise-wrapper m-2 ms-3 me-3">
                                            <div className="row d-flex justify-content-between p-4">
                                                <div className="col-auto"><span className="product-price custom-color-2 semifont boldfontsize">Sales Status</span></div>
                                                <div className="col-auto"><span className="in-stock custom-color-6 rounded-pill p-3 pb-1 pt-1 d-flex mini-text-1">18 July, 2023</span></div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="table-responsive">
                                                    <table className="table m-0 seller-table2">
                                                        <thead>
                                                            <th className="p-3 ps-4 semifont placeholderfontsize custom-color-2">Month/Year</th>
                                                            <th className="p-3 pe-4 semifont placeholderfontsize custom-color-2 text-end">Sale(€)</th>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="p-3 ps-4 lightfont placeholderfontsize custom-color-2 align-middle">This Month</td>
                                                                <td className="p-3 pe-4 lightfont placeholderfontsize custom-color-2 align-middle text-end">€0.00</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="p-3 ps-4 lightfont placeholderfontsize custom-color-2 align-middle">Last Month</td>
                                                                <td className="p-3 pe-4 lightfont placeholderfontsize custom-color-2 align-middle text-end">€0.00</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="p-3 ps-4 lightfont placeholderfontsize custom-color-2 align-middle">This Year</td>
                                                                <td className="p-3 pe-4 lightfont placeholderfontsize custom-color-2 align-middle text-end">€0.00</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="p-3 ps-4 lightfont placeholderfontsize custom-color-2 align-middle">Last Year</td>
                                                                <td className="p-3 pe-4 lightfont placeholderfontsize custom-color-2 align-middle text-end">€0.00</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="p-3 ps-4 semifont placeholderfontsize custom-color-2 align-middle">All time</td>
                                                                <td className="p-3 pe-4 semifont placeholderfontsize custom-color-2 align-middle text-end">€0.00</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="coulmn-bg-color-1 rounded mt-4">
                                <div className="row d-flex justify-content-between p-3 pb-1 pt-3">
                                    <div className="col-auto"><span className="custom-color-2 boldfont body-sub-titles">Open Orders</span></div>
                                </div>
                                <div className="row mt-2">
                                    <div className="table-responsive">
                                        <table className="table m-0 seller-table3">
                                            <thead>
                                                <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Orders</th>
                                                <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Customer</th>
                                                <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Date</th>
                                                <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Status</th>
                                                <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Total</th>
                                                <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Action</th>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">#12345678</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">Geen Geen</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">08 Jan, 2023</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">Open(Paid)</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">€1500.00</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">
                                                        <button type="button" className="custom-color-7 boldfont mini-text-3 rounded custom-border-2 button-bg-color-1 pb-2 pt-2 p-3 mb-2 mb-md-2 md-lg-0 mb-xl-0">Mark Complete</button>
                                                        <button type="button" className="custom-color-6 boldfont mini-text-3 rounded custom-border-1 pb-2 pt-2 p-3">Cancel</button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">#12345678</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">Geen Geen</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">08 Jan, 2023</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">Open(Paid)</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">€1500.00</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">
                                                        <button type="button" className="custom-color-7 boldfont mini-text-3 rounded custom-border-2 button-bg-color-1 pb-2 pt-2 p-3 mb-2 mb-md-2 md-lg-0 mb-xl-0">Mark Complete</button>
                                                        <button type="button" className="custom-color-6 boldfont mini-text-3 rounded custom-border-1 pb-2 pt-2 p-3">Cancel</button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">#12345678</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">Geen Geen</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">08 Jan, 2023</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">Open(Paid)</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">€1500.00</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">
                                                        <button type="button" className="custom-color-7 boldfont mini-text-3 rounded custom-border-2 button-bg-color-1 pb-2 pt-2 p-3 mb-2 mb-md-2 md-lg-0 mb-xl-0">Mark Complete</button>
                                                        <button type="button" className="custom-color-6 boldfont mini-text-3 rounded custom-border-1 pb-2 pt-2 p-3">Cancel</button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">#12345678</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">Geen Geen</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">08 Jan, 2023</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">Open(Paid)</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">€1500.00</td>
                                                    <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">
                                                        <button type="button" className="custom-color-7 boldfont mini-text-3 rounded custom-border-2 button-bg-color-1 pb-2 pt-2 p-3 mb-2 mb-md-2 md-lg-0 mb-xl-0">Mark Complete</button>
                                                        <button type="button" className="custom-color-6 boldfont mini-text-3 rounded custom-border-1 pb-2 pt-2 p-3">Cancel</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
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
export default SellerDashboard;