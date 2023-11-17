import { BASE_URL } from "configuration";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";
import { UserContext } from "~/components/account_/UserContext";
import APIs from "~/services/apiService";

function PaymentResult() {

    const router = useRouter();
    const { user, setPaymentStatus, setCartCount } = UserContext();

    const [status, setStatus] = useState('');
    const [path, setPath] = useState('');
    const [products, setProducts] = useState<any>([]);
    const [total, setTotal] = useState<number>(0);
    const [totalDiscount, setTotalDiscount] = useState<number>(0);
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [time, setTime] = useState<any>(900);

    let interavls: any = [];

    useEffect(() => {
        let redirectUrl = localStorage.getItem('redirect');
        redirectUrl && localStorage.removeItem('redirect');
        let transactionId: string = localStorage.getItem('uid') || '';
        let checkPaymentStatus = setInterval(() => {
            interavls.push(checkPaymentStatus)
            APIs.paymentStatus(transactionId, user.id).then((response: any) => {
                let status = response.data.rows.length ? response.data.rows[0].status : 'failed';
                (status === 'pending') && setStatus(status);
                if (status !== 'created' && status !== 'pending') {
                    clearInterval(checkPaymentStatus);
                    switch(status) {
                        case 'completed':
                            getOrderDetails();
                            setStatus('completed');
                            setPaymentStatus('completed');
                            break;
                        case 'failed':
                            setPath('/homepage');
                            setStatus('failed');
                            setPaymentStatus('failed')
                            break;
                        case 'expired' :
                            setPath('/homepage');
                            setStatus('expired');
                            setPaymentStatus('expired')
                            break;
                        case 'planned' :
                            setStatus("pending")
                            paymentRefundFunction()
                            break;
                        case 'reserved' :
                            setStatus("pending");
                            paymentRefundFunction()
                            break;
                        default:
                            setPath('/homepage');
                            setStatus(status);
                            console.log('unknown status: ', status);
                            break;
                    }
                }
            }).catch(err => console.log(err));
        }, 1000 * 10);

        let timer = setInterval(() => {
            setTime((time: any) => {
                if (time === 0 ) {
                    clearInterval(timer);
                    return 0;
                } else {
                    return time-1;
                }
            })
        }, 1000)
    }, [])

    useEffect(() => {
        let timeout = 1000 * 60 * 15;
        if (status !== 'created' && status !== 'pending') timeout = 5000;
        (status !== 'completed') && setTimeout(() => {
            if (status === 'pending') {
                toast.warn('Payment is still pending...');
                router.push('/homepage');
            };
            router.push(path);
        }, timeout);
        setTimeout(() => {
            (status && status !== 'created' && status !== 'pending') && toast.warn('Payment ' + status);
            interavls.forEach((interval: any) => clearInterval(interval))
        }, 1000 * 60 * 60);
    }, [status])

    const paymentRefundFunction = () =>{
        let transactionId;
        if (typeof window !== 'undefined') {
            transactionId = localStorage.getItem('uid') || '';
        }
        APIs.paymentRefund({
            "transactionUid": transactionId,
            "payoutDescription": "Refunded due to transaction is pending"
        }).then((res) =>{
            console.log(res)
            toast.success(res)
            router.push("/")
        }).catch((err) =>{
            console.log(err)
            toast.error(err)
        })

    }

    const getOrderDetails = () => {
        let transactionId;
        if (typeof window !== 'undefined') {
            transactionId = localStorage.getItem('uid') || '';
        }
        APIs.getCartData({ customerid: user.id }).then(response => {
            setCartCount(response.data.rows.length);
        }).catch(err => console.log(err));
        transactionId && APIs.getOrderWithTransactionid(transactionId).then((response: any) => {
            let OrderProducts = response.data.data;
            OrderProducts.length && setShippingCost(OrderProducts[0]?.attributes?.shipping_cost)
            setProducts(OrderProducts);
            if (OrderProducts.length) {
                let total = 0;
                let totalDiscount = 0;
                for (const obj of OrderProducts) {
                    total += obj?.attributes?.total_price;
                    totalDiscount += obj?.attributes?.discount_price
                }
                setTotal(total);
                setTotalDiscount(totalDiscount)
            }
        }).catch(err => console.log(err));
    }
    console.log(status)

    return (
        <>
            {(!status || status === 'created') ? 
                <div style={{textAlign: 'center', position: 'relative', marginTop: '10%'}}>
                    <h2><FormattedMessage id="REQUEST_PROCESSED"/></h2>  
                    <h4>
                        {`${Math.floor(time / 60)}`.padStart(2, '0')}:{`${time % 60}`.padStart(2, '0')}
                    </h4>
                </div> : status === 'pending' ? 
                <div style={{textAlign: 'center', position: 'relative', marginTop: '5%'}} className="mb-4">
                    <h2 className="" ><FormattedMessage id="PAYMENT_TRANSACTION_PENDING" /></h2>
                    <h4>
                        {`${Math.floor(time / 60)}`.padStart(2, '0')}:{`${time % 60}`.padStart(2, '0')}
                    </h4>
                </div> : 
                <div style={{textAlign: 'center', position: 'relative', marginTop: '5%'}} className="mb-4">
                    {status === 'completed' && <i className="fa fa-check-circle pb-2" style={{fontSize: '3rem', color: '#587E50'}}></i>}
                    <h2 className="" >{status === 'completed' ? <FormattedMessage id="ORDER_PLACED_SUCCESS" /> : "Payment " + status }</h2>
                    <p>{ status !== 'completed' && <FormattedMessage id="REDIRECT_TO_HOME" /> }</p>
                </div>
            }
            {status === 'completed' &&
                <> 
                    <div className="main-body">
                        <div className="container">
                            <section className="quote-wrapper my-5">
                                <div className="row">
                                    <div className="col-3 d-none d-lg-block"></div>
                                    <div className="col-lg-6 col-12">
                                        <div className="coulmn-bg-color-1 rounded px-3 pb-5 pt-3">
                                            <div className="m-0 pt-3 ml-3">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <span className="custom-color-2 boldfont body-sub-titles"><FormattedMessage id="ORDER_SUMMARY"/></span>
                                                        <p className="custom-color-2 regularfont body-sub-titles-2">Order Id: {products[0]?.attributes?.orderid}</p>
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
                                                                                        <span className="lightfont body-sub-titles-2"><FormattedMessage id="QUANTITY"/>: {product?.attributes?.quantity}</span>
                                                                                    </td>
                                                                                    <td className="w-25">€{(product?.attributes?.total_price - product.attributes.discount_price * product.attributes.quantity).toFixed(2)}</td>
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
                                                                <td className="w-75 pl-4"><FormattedMessage id="SHIPPING"/></td>
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
                                                                <td className="w-75 pl-4 boldfont"><FormattedMessage id="TOTAL"/></td>
                                                                <td className="w-25 boldfont">€{(total + shippingCost - totalDiscount).toFixed(2)}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-3 d-none d-lg-block"></div>
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