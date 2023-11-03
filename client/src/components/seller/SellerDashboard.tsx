import React, { useEffect, useState } from 'react';
import AppImage from '~/components/shared/AppImage';
import SellerSideBar from './SellerSideBar';
import { UserContext } from '../account_/UserContext';
import { BASE_URL } from 'configuration';
import APIs from '~/services/apiService';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';

function SellerDashboard() {

    const {user} = UserContext();
    const [orderDetails, setOrderDetails] = useState<any>([]);
    const [salesData, setSalesData] = useState<any>({
        thisMonth: 0,
        lastMonth: 0,
        thisYear: 0,
        lastYear: 0
    });
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        APIs.getSellerOrder(user.username).then((response: any) => {
            let order = response.data.rows.length ? response.data.rows.slice(0, 4) : [];
            setOrderDetails(order);
        }).catch(err => console.log(err));
        
        APIs.getAllSellerOrders(user.username).then((response: any) => {
            let sellerOrders = response.data.data;
            formatSellerOrders(sellerOrders);
            if (response.data.data.length) {
                let total = 0;
                for (const obj of response.data.data) {
                    total += obj.attributes.total_price;
                }
                setTotal(total);
            }
        });
    }, [])

    // function to get sales data from seller order data
    const formatSellerOrders = (sellerOrders: any) => {
        let currentMonth: any, currentYear: any;
        let thisMonthSales = 0, lastMonthSales = 0, thisYearSales = 0, lastYearSales = 0;
        let formattedOrders = sellerOrders.map((order: any) => {
            let purchasedYear = new Date(order.attributes.createdAt).getFullYear();
            let purchasedMonth = new Date(order.attributes.createdAt).getMonth() + 1;
            return {
                orderid: order.attributes.orderid,
                product_price: order.attributes.product_price,
                quantity: order.attributes.quantity,
                total_price: order.attributes.total_price,
                status: order.attributes.status,
                purchased_year: purchasedYear,
                purchased_month: purchasedMonth
            }
        });
        currentMonth = new Date().getMonth() + 1;
        currentYear = new Date().getFullYear();
        // calculating sales data
        formattedOrders.forEach((order: any) => {
            (order.purchased_month === currentMonth) && (thisMonthSales += order.total_price);
            (order.purchased_month === currentMonth - 1) && (lastMonthSales += order.total_price);
            (order.purchased_year === currentYear) && (thisYearSales += order.total_price);
            (order.purchased_year === currentYear - 1) && (lastYearSales += order.total_price);
        });
        salesData.thisMonth = thisMonthSales;
        salesData.lastMonth = lastMonthSales;
        salesData.thisYear = thisYearSales;
        salesData.lastYear = lastYearSales;
        setSalesData({...salesData});
    }

    return (
        <> 
          <div className="main-body pb-2 mb-5">
            <div className="container">
                <section className="quote-wrapper mt-5">
                    <div className="row mt-3 g-4">
                        <SellerSideBar />
                        <div className="col-12 col-md-9 p-0 p-sm-3">
                            <div className="coulmn-bg-color-1 rounded px-sm-5 pt-sm-5 pb-sm-5">
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
                                    <div className="col">
                                        <div className="month-wise-wrapper m-2 ms-3 me-3 p-4">
                                            <div className="row d-flex justify-content-between p-4">
                                                <div className="col-auto"><span className="product-price custom-color-2 semifont boldfontsize"><FormattedMessage id="SALES_STATUS"/></span></div>
                                                <div className="col-auto"><span className="in-stock custom-color-6 rounded-pill p-3 pb-1 pt-1 d-flex mini-text-1">{new Date().toDateString().slice(4)}</span></div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="table-responsive">
                                                    <table className="table m-0 seller-table2">
                                                        <thead>
                                                            <tr>
                                                                <th className="p-3 ps-4 semifont placeholderfontsize custom-color-2"><FormattedMessage id="MONTH/YEAR"/></th>
                                                                <th className="p-3 pe-4 semifont placeholderfontsize custom-color-2 text-end"><FormattedMessage id="SALE"/></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="p-3 ps-4 lightfont placeholderfontsize custom-color-2 align-middle"><FormattedMessage id="THIS_MONTH"/></td>
                                                                <td className="p-3 pe-4 lightfont placeholderfontsize custom-color-2 align-middle text-end">€{salesData.thisMonth}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="p-3 ps-4 lightfont placeholderfontsize custom-color-2 align-middle"><FormattedMessage id="LAST_MONTH"/></td>
                                                                <td className="p-3 pe-4 lightfont placeholderfontsize custom-color-2 align-middle text-end">€{salesData.lastMonth}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="p-3 ps-4 lightfont placeholderfontsize custom-color-2 align-middle"><FormattedMessage id="THIS_YEAR"/></td>
                                                                <td className="p-3 pe-4 lightfont placeholderfontsize custom-color-2 align-middle text-end">€{salesData.thisYear}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="p-3 ps-4 lightfont placeholderfontsize custom-color-2 align-middle"><FormattedMessage id="LAST_YEAR"/></td>
                                                                <td className="p-3 pe-4 lightfont placeholderfontsize custom-color-2 align-middle text-end">€{salesData.lastYear}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="p-3 ps-4 semifont placeholderfontsize custom-color-2 align-middle"><FormattedMessage id="ALL_TIME"/></td>
                                                                <td className="p-3 pe-4 semifont placeholderfontsize custom-color-2 align-middle text-end">€{total}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="coulmn-bg-color-1 rounded mt-4 pb-4">
                                <div className="row d-flex justify-content-between p-3 pb-1 pt-3">
                                    <div className="col-auto"><span className="custom-color-2 boldfont body-sub-titles">Latest <FormattedMessage id="LATEST_ORDERS"/></span></div>
                                </div>
                                <div className="row mt-2 mx-3">
                                    <div className="table-responsive">
                                        <table className="table m-0 seller-table3">
                                            <thead>
                                                <tr>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2"><FormattedMessage id="ORDERS"/></th>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2"><FormattedMessage id="DATE"/></th>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2"><FormattedMessage id="STATUS"/></th>
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