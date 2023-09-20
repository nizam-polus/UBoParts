import { useEffect, useRef, useState } from "react";
import SellerSideBar from "./seller/SellerSideBar";
import APIs from "~/services/apiService";
import { UserContext } from "./account_/UserContext";
import Link from "next/link";
import copy from 'copy-to-clipboard'
import { toast } from "react-toastify";

function PurchaseHistory() {

    const { user } = UserContext();

    const [orderDetails, setOrderDetails] = useState<any>([]);

    useEffect(() => {
        APIs.getCustomerOrder(user.username).then((response: any) => {
            console.log(response.data.data)
            setOrderDetails(response.data.data);
        })
    }, []);

    const copyOrderID = (order: any) => {
        let isCopy = copy(order?.attributes?.orderid);
        isCopy && toast.info('Order ID copied to clipboard');
    }

    return (
        <> 
            <div className="main-body pb-2 mb-5">
            <div className="container">
                <section className="quote-wrapper mt-5">
                    <div className="row mt-3 g-4">
                        <SellerSideBar />
                        <div className="col-12 col-md-9">
                            <div className="coulmn-bg-color-1 rounded">
                                <div className="row d-flex justify-content-between p-3 pb-1 pt-3">
                                    <div className="col-auto"><span className="custom-color-2 boldfont body-sub-titles">Purchase History</span></div>
                                </div>
                                <div className="row px-4">
                                    <div className="table-responsive">
                                        <table className="table m-0 purchase-history">
                                            <thead>
                                                <tr>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Orders</th>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Product Name</th>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Quantity</th>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Date</th>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Status</th>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Total</th>
                                                    {/* <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Action</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orderDetails.map((order: any) => {
                                                    return (
                                                        <tr>
                                                            <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">
                                                                {order?.attributes?.orderid.substring(0, 16)}
                                                                <span title={order?.attributes?.orderid} className="pointer">....</span>
                                                                <i className="pl-1 fa fa-copy pointer" onClick={() => copyOrderID(order)}></i>
                                                            </td>
                                                            <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle pointer">
                                                                <Link href={'/products_/' + order?.attributes?.product_id}>{order?.attributes?.product_name.substring(0, 20)}</Link>
                                                                <span title={order?.attributes?.product_name} className="pointer">....</span>
                                                            </td>
                                                            <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle text-center">{order?.attributes?.quantity}</td>
                                                            <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle"
                                                            >{new Date(order?.attributes?.updatedAt).toDateString().substring(4)}
                                                            </td>
                                                            <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">{order?.attributes?.status}</td>
                                                            <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">€{order?.attributes?.total_price}</td>
                                                        </tr>
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
    )
}

export default PurchaseHistory;