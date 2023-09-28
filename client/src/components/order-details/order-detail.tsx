import { useRouter } from "next/router";
import SellerSideBar from "../seller/SellerSideBar";
import { useEffect, useState } from "react";
import APIs from "~/services/apiService";
import { BASE_URL } from "configuration";
import AppImage from "../shared/AppImage";

function OrderDetails() {

    const router = useRouter();
    const orderId: any = router.query.orderId;

    const [orderDetails, setOrderDetails] = useState<any>([]);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        APIs.getOrderDetails(orderId).then(response => {
            let orders = response.data.data;
            setOrderDetails(orders);
            if (orders.length) {
                let total = 0;
                for (const obj of orders) {
                    total += obj?.attributes?.total_price;
                }
                setTotal(total);
            }
        })
    },[])

    return (
        <> 
            <div className="main-body pb-2 mb-5">
            <div className="container">
                <section className="quote-wrapper mt-5">
                    <div className="row">
                        <SellerSideBar />
                        <div className="col-12 col-md-9">
                            <div className="coulmn-bg-color-1 rounded p-3">
                                <div className="d-flex justify-content-between m-0 pt-3 ml-3">
                                    <span className="custom-color-2 boldfont body-sub-titles">Order details <span className="pl-1">#</span><span className=" order-no regularfont body-sub-titles">{orderId}</span></span><br />
                                </div>
                                <div className="row mt-3">
                                    <div className="col-8">
                                        <div style={{border: '1px solid lightgrey', borderRadius: '10px'}} className="px-4 py-4 ml-3 mr-1">
                                            <div className="d-flex justify-content-between m-0 pb-4 ml-3">
                                                <span className="custom-color-2 semifont body-sub-titles-1">Order summary</span><br />
                                            </div>
                                            <div className="row m-0 px-0">
                                                <div className="col-3">
                                                    <table >
                                                        <thead>
                                                            <tr>
                                                                <th className="custom-color-2 regularfont body-sub-titles-2 my-0 mx-3">Order Date</th>
                                                            </tr>
                                                            <tr>
                                                                <th className="custom-color-2 regularfont body-sub-titles-2 my-0 mx-3">Order ID</th>
                                                            </tr>
                                                            <tr>
                                                                <th className="custom-color-2 regularfont body-sub-titles-2 my-0 mx-3">Order Total</th>
                                                            </tr>
                                                        </thead>
                                                    </table>
                                                </div>
                                                <div className="col-9">
                                                    <table className="order-table">
                                                        <tbody>
                                                            <tr>
                                                                <td className="custom-color-2 regularfont body-sub-titles-2 my-0">
                                                                    {new Date(orderDetails[0]?.attributes?.publishedAt).toDateString().substring(4)}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="custom-color-2 regularfont body-sub-titles-2 my-0">
                                                                    {orderId}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="custom-color-2 regularfont body-sub-titles-2 my-0">
                                                                    €{total}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="coulmn-bg-color-1 rounded mt-4 mb-3">
                                            <div style={{border: '1px solid lightgrey', borderRadius: '10px'}} className="px-4 py-4 mr-1 ml-3">
                                                <table className="order-table2">
                                                    <thead>
                                                        <tr>
                                                            <td className="custom-color-2 boldfont body-sub-titles-2 pb-2 border-bottom">Item Summary</td>
                                                            <td className="custom-color-2 boldfont body-sub-titles-2 pb-2 border-bottom text-center">Quantity</td>
                                                            <td className="custom-color-2 boldfont body-sub-titles-2 pb-2 border-bottom text-center">Price</td>
                                                            <td className="custom-color-2 boldfont body-sub-titles-2 pb-2 border-bottom text-center">Total Price</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-center">
                                                        {orderDetails.map((order: any) => {
                                                            return (
                                                                <>
                                                                    <tr className="order-data">                                                   
                                                                        <td className="custom-color-2 regularfont body-sub-titles-2 py-3 border-bottom w-50">
                                                                            <div className="d-inline-flex">
                                                                                <div className="col-3"> <AppImage style={{height: '2.9rem', width: '2.9rem'}} src={BASE_URL + order?.attributes?.product_image} className="rounded mr-4" /></div>
                                                                                <div className="col">{order?.attributes?.product_name}</div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="custom-color-2 regularfont body-sub-titles-2 py-3 border-bottom text-center">{order?.attributes?.quantity}</td>
                                                                        <td className="custom-color-2 regularfont body-sub-titles-2 py-3 border-bottom text-center">{order?.attributes?.product_price}</td>
                                                                        <td className="custom-color-2 regularfont body-sub-titles-2 py-3 border-bottom text-center">{order?.attributes?.total_price}</td>
                                                                    </tr>
                                                                </>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-4 pl-2 pr-1">
                                        <div style={{border: '1px solid lightgrey', borderRadius: '10px'}} className="px-3 py-3 mr-4">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="col-auto">
                                                        <p className="custom-color-2 semifont body-sub-titles-1">Delivery Address</p>
                                                        <span className="custom-color-2  semifont mini-text-2">Street Address : </span><span className="custom-color-2 regularfont mini-text-2">{orderDetails[0]?.attributes?.address_housenumber}</span><br />
                                                        {orderDetails[0]?.attributes?.address_apartment && 
                                                            <>
                                                                <span className="custom-color-2 regularfont body-sub-titles-2">{orderDetails[0]?.attributes?.address_apartment}</span>
                                                                <br />
                                                            </>
                                                        }
                                                        <span className="custom-color-2  semifont mini-text-2 ">City : </span><span className="custom-color-2 regularfont mini-text-2">{orderDetails[0]?.attributes?.city}</span><br />
                                                        <span className="custom-color-2  semifont mini-text-2">State : </span><span className="custom-color-2 regularfont mini-text-2">{orderDetails[0]?.attributes?.state}</span><br />
                                                        <span className="custom-color-2  semifont mini-text-2">Country : </span><span className="custom-color-2 regularfont mini-text-2">{orderDetails[0]?.attributes?.country}</span><br />
                                                        <span className="custom-color-2  semifont mini-text-2">Postcode : </span><span className="custom-color-2 regularfont mini-text-2">{orderDetails[0]?.attributes?.postcode}</span><br />
                                                    </div>
                                                </div>
                                            </div>
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
    )
}

export default OrderDetails;