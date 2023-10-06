import { BASE_URL } from "configuration";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import APIs from "~/services/apiService";

function PaymentResult() {

    const router = useRouter();

    const [status, setStatus] = useState('');
    const [path, setPath] = useState('');
    const [products, setProducts] = useState<any>([]);
    const [total, setTotal] = useState<number>(0);
    const [shippingCost, setShippingCost] = useState<number>(0);

    let interavls: any = [];

    useEffect(() => {
        let transactionId: string = localStorage.getItem('uid') || '';
        let checkPaymentStatus = setInterval(() => {
            interavls.push(checkPaymentStatus)
            APIs.paymentStatus(transactionId).then((response: any) => {
                let status = response.data.rows.length ? response.data.rows[0].status : 'failed';
                if (status !== 'created') {
                    clearInterval(checkPaymentStatus);
                    switch(status) {
                        case 'completed':
                            setStatus('completed');
                            break;
                        case 'failed':
                            setPath('/homepage');
                            setStatus('failed');
                            break;
                        case 'expired' :
                            setPath('/homepage');
                            setStatus('expired');
                            break;
                        default:
                            setPath('/homepage');
                            setStatus(status);
                            console.log('unknown status', status);
                            break;
                    }
                }
            })
        }, 5000)
    }, [])

    useEffect(() => {
        let transactionId;
        if (typeof window !== 'undefined') {
            transactionId = localStorage.getItem('uid') || '';
        }
        transactionId && APIs.getOrderWithTransactionid(transactionId).then((response: any) => {
            let OrderProducts = response.data.data;
            setProducts(OrderProducts);
            if (OrderProducts.length) {
                let total = 0;
                for (const obj of OrderProducts) {
                    total += obj.attributes.total_price;
                }
                setTotal(total);
            }
        })
        status !== 'completed' && setTimeout(() => {
            router.push(path);
        }, 7000);
        setTimeout(() => {
            interavls.forEach((interval: any) => clearInterval(interval))
        }, 1000 * 60 * 5);
    }, [status])

    return (
        <>
            {(!status || status === 'created') ? <h2 className="" style={{textAlign: 'center', position: 'relative', marginTop: '10%'}}>Your request is being processed ...</h2> : 
                <div style={{textAlign: 'center', position: 'relative', marginTop: '5%'}} className="mb-4">
                    {status === 'completed' && <i className="fa fa-check-circle pb-2" style={{fontSize: '3rem', color: '#587E50'}}></i>}
                    <h2 className="" >{status === 'completed' ? 'Order placed successfully' : 'Payment transaction ' + status }</h2>
                    <p>{ status !== 'completed' && 'You will be redirected to homepage.' }</p>
                </div>
            }
            {status === 'completed' &&
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
                                                        <p className="custom-color-2 regularfont body-sub-titles-2">Order Id: {products[0].attributes.orderid}</p>
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
            }
        </>
    )
}

export default PaymentResult;