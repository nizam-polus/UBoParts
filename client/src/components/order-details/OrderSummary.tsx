import { BASE_URL } from "configuration";
import Link from "next/link";
import { useEffect, useState } from "react";
import APIs from "~/services/apiService";

function OrderSummary() {

    const [products, setProducts] = useState<any>([]);
    const [total, setTotal] = useState<number>(0);
    const [shippingCost, setShippingCost] = useState<number>(0);
    
    useEffect(() => {
        let transactionId;
        if (typeof window !== 'undefined') {
            transactionId = localStorage.getItem('uid') || '';
        }
        transactionId && APIs.getOrderWithTransactionid(transactionId).then((response: any) => {
            console.log(response.data.data)
            let OrderProducts = response.data.data;
            setShippingCost(OrderProducts[0].attributes.shipping_cost)
            setProducts(OrderProducts);
            if (OrderProducts.length) {
                let total = 0;
                for (const obj of OrderProducts) {
                    total += obj.attributes.total_price;
                }
                setTotal(total);
            }
        })
    }, [])

    return (
        <> 
            <div className="main-body">
                <div className="container">
                    <section className="quote-wrapper my-5">
                        <div className="row">
                            <div className="col-3"></div>
                            <div className="col-6">
                                <div className="coulmn-bg-color-1 rounded px-3 pb-5 pt-3">
                                    <div className="m-0 pt-3 ml-3">
                                        <div className="row">
                                            <div className="col-12">
                                                <span className="custom-color-2 boldfont body-sub-titles">Order Summary</span>
                                                <hr />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="table-responsive mx-3">
                                                <div className="">
                                                    <table className="w-100">
                                                        <tbody>
                                                            {products.map(((product: any) => {
                                                                return (
                                                                    <>
                                                                        <tr>
                                                                            <td>
                                                                                <img src={BASE_URL + product?.attributes?.product_image} className="rounded"
                                                                                    alt="" style={{height: '4rem', width: '4rem', objectFit: 'contain'}}
                                                                                />
                                                                            </td>
                                                                            <td className="custom-color-2 boldfont placeholderfontsize border-0 pl-4 ps-3 pb-3 pt-3 align-middle w-75">
                                                                                <Link href={'/products_/' + product?.attributes?.product_id}>{product?.attributes?.product_name}</Link><br />
                                                                                <span className="lightfont body-sub-titles-2">Quantity: {product?.attributes?.quantity}</span>
                                                                            </td>
                                                                            <td className="w-25">€{product?.attributes?.total_price}</td>
                                                                        </tr>
                                                                    </>
                                                                )
                                                            }))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <table className="w-100">
                                                <tbody>
                                                    <tr>
                                                        <td className="w-75 pl-4">Shipping</td>
                                                        <td className="w-25">€{shippingCost}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <table className="w-100">
                                                <tbody>
                                                    <tr>
                                                        <td className="w-75 pl-4 boldfont">Total</td>
                                                        <td className="w-25 boldfont">€{total + shippingCost}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3"></div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}

export default OrderSummary;