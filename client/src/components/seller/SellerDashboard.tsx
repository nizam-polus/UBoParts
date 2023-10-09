import React, { useEffect, useState } from 'react';
import AppImage from '~/components/shared/AppImage';
import SellerSideBar from './SellerSideBar';
import { UserContext } from '../account_/UserContext';
import { BASE_URL } from 'configuration';
import APIs from '~/services/apiService';
import Link from 'next/link';

function SellerDashboard() {

    const {user} = UserContext();
    const [orderDetails, setOrderDetails] = useState<any>([]);

    useEffect(() => {
        APIs.getSellerOrder(user.username).then((response: any) => {
            let order = response.data.rows.length ? response.data.rows.slice(0, 4) : [];
            setOrderDetails(order);
        }).catch(err => console.log(err))
    }, [])

    return (
        <> 
          <div className="main-body pb-2 mb-5">
            <div className="container">
                <section className="quote-wrapper mt-5">
                    <div className="row mt-3 g-4">
                        <SellerSideBar />
                        <div className="col-12 col-md-9">
                            <div className="coulmn-bg-color-1 rounded px-5 pt-5 pb-0">
                                <div className="row">
                                    <div className="col">
                                        <div className="img-seller-wrapper ps-4 pe-4">
                                            <div className="table-responsive">
                                                <table className="table seller-table1 m-0">
                                                    <thead>
                                                        <tr>
                                                            <th className="p-2 pb-3 ps-0 text-center">
                                                                <AppImage style={{height: '15rem', borderRadius: '100%', width: '15rem', objectFit: 'cover'}}
                                                                    src={ user.profile_image ? BASE_URL + user.profile_image.url : "/images/svg/my-account.svg"}
                                                                />
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="border-0 text-center semifont pt-3 boldfontsize">{user?.first_name && user?.first_name.toUpperCase() + ' ' + user?.last_name.toUpperCase()}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="border-0 text-center semifont pt-3 boldfontsize">{user?.company_name}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="col">
                                        <div className="month-wise-wrapper m-2 ms-3 me-3 p-4">
                                            <div className="row d-flex justify-content-between p-4">
                                                <div className="col-auto"><span className="product-price custom-color-2 semifont boldfontsize">Sales Status</span></div>
                                                <div className="col-auto"><span className="in-stock custom-color-6 rounded-pill p-3 pb-1 pt-1 d-flex mini-text-1">18 July, 2023</span></div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="table-responsive">
                                                    <table className="table m-0 seller-table2">
                                                        <thead>
                                                            <tr>
                                                                <th className="p-3 ps-4 semifont placeholderfontsize custom-color-2">Month/Year</th>
                                                                <th className="p-3 pe-4 semifont placeholderfontsize custom-color-2 text-end">Sale(€)</th>
                                                            </tr>
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
                                    </div> */}
                                </div>
                            </div>
                            <div className="coulmn-bg-color-1 rounded mt-4 pb-4">
                                <div className="row d-flex justify-content-between p-3 pb-1 pt-3">
                                    <div className="col-auto"><span className="custom-color-2 boldfont body-sub-titles">Latest Orders</span></div>
                                </div>
                                <div className="row mt-2 mx-3">
                                    <div className="table-responsive">
                                        <table className="table m-0 seller-table3">
                                            <thead>
                                                <tr>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Orders</th>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Date</th>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orderDetails.map((order: any) => {
                                                    return (
                                                        <>
                                                            <tr>
                                                                <td className="custom-color-2 lightfont placeholderfontsize border-0 pl-4 ps-3 pb-3 pt-3 align-middle">
                                                                    <Link href={'/seller/seller-orders/' + order?.orderid}>{order?.orderid}</Link>
                                                                </td>
                                                                <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">
                                                                    {new Date(order?.created_at).toDateString().substring(4)}
                                                                </td>
                                                                <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">{order?.status}</td>
                                                            </tr>
                                                        </>
                                                    )
                                                })}
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