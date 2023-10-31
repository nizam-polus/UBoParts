import { BASE_URL } from "configuration";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UserContext } from "~/components/account_/UserContext";
import APIs from "~/services/apiService";

function AccountResult() {

    const router = useRouter();
    const { user, setPaymentStatus, setCartCount } = UserContext();

    const [status, setStatus] = useState('');
    const [path, setPath] = useState('');
    const [time, setTime] = useState<any>(900);


    let interavls: any = [];

    // useEffect(() => {
        // let redirectUrl = localStorage.getItem('redirect');
        // redirectUrl && localStorage.removeItem('redirect');
        // let transactionId: string = localStorage.getItem('uid') || '';
        // let checkPaymentStatus = setInterval(() => {
        //     interavls.push(checkPaymentStatus)
        //     APIs.paymentStatus(transactionId, user.id).then((response: any) => {
        //         let status = response.data.rows.length ? response.data.rows[0].status : 'failed';
        //         if (status !== 'created' && status !== 'pending') {
        //             clearInterval(checkPaymentStatus);
        //             switch(status) {
        //                 case 'completed':
        //                     getOrderDetails();
        //                     setStatus('completed');
        //                     setPaymentStatus('completed');
        //                     break;
        //                 case 'failed':
        //                     setPath('/homepage');
        //                     setStatus('failed');
        //                     setPaymentStatus('failed')
        //                     break;
        //                 case 'expired' :
        //                     setPath('/homepage');
        //                     setStatus('expired');
        //                     setPaymentStatus('expired')
        //                     break;
        //                 default:
        //                     setPath('/homepage');
        //                     setStatus(status);
        //                     console.log('unknown status: ', status);
        //                     break;
        //             }
        //         }
        //     })
        // }, 1000 * 10);

        // let timer = setInterval(() => {
        //     setTime((time: any) => {
        //         if (time === 0 ) {
        //             clearInterval(timer);
        //             return 0;
        //         } else {
        //             return time-1;
        //         }
        //     })
        // }, 1000)
    // }, [])

    useEffect(() =>{
        let adminUID = localStorage.getItem("admin_uid");
        APIs.getAccountStatus({
            "bank_account_uid": adminUID
        }).then((res) =>{
            console.log(res)
            setStatus(res.data.status)
        })

    },[])

    // useEffect(() => {
    //     let timeout = 1000 * 60 * 15;
    //     if (status !== 'created' && status !== 'pending') timeout = 5000;        
    //     status !== 'completed' && setTimeout(() => {
    //         router.push(path);
    //     }, timeout);
    //     setTimeout(() => {
    //         interavls.forEach((interval: any) => clearInterval(interval))
    //     }, 1000 * 60 * 15);
    // }, [status])

    // const getOrderDetails = () => {
    //     let transactionId;
    //     if (typeof window !== 'undefined') {
    //         transactionId = localStorage.getItem('uid') || '';
    //     }
    //     APIs.getCartData({ customerid: user.id }).then(response => {
    //         setCartCount(response.data.rows.length);
    //     })
    //     transactionId && APIs.getOrderWithTransactionid(transactionId).then((response: any) => {
    //         let OrderProducts = response.data.data;
    //         OrderProducts.length && setShippingCost(OrderProducts[0]?.attributes?.shipping_cost)
    //         setProducts(OrderProducts);
    //         if (OrderProducts.length) {
    //             let total = 0;
    //             let totalDiscount = 0;
    //             for (const obj of OrderProducts) {
    //                 total += obj?.attributes?.total_price;
    //                 totalDiscount += obj?.attributes?.discount_price
    //             }
    //             setTotal(total);
    //             setTotalDiscount(totalDiscount)
    //         }
    //     });
    // }

    return (
        <>
            {/* {(!status || status === 'created') ? 
                <div style={{textAlign: 'center', position: 'relative', marginTop: '10%'}}>
                    
                    <h4>
                        {`${Math.floor(time / 60)}`.padStart(2, '0')}:{`${time % 60}`.padStart(2, '0')}
                    </h4>
                </div> :
                <div style={{textAlign: 'center', position: 'relative', marginTop: '5%'}} className="mb-4">
                    {status === 'completed' && <i className="fa fa-check-circle pb-2" style={{fontSize: '3rem', color: '#587E50'}}></i>}
                    <h2 className="" >{status === 'completed' ? 'Order placed successfully' : 'Payment transaction ' + status }</h2>
                    <p>{ status !== 'completed' && 'You will be redirected to homepage.' }</p>
                </div>
            } */}
            <h2>Status: {status}</h2>  
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
                                                        {/* <p className="custom-color-2 regularfont body-sub-titles-2">Order Id: {products[0]?.attributes?.orderid}</p> */}
                                                        <hr />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="table-responsive mx-3">
                                                        <div className="">
                                                            <table className="w-100">
                                                                <tbody>
                                                                    {/* {products.map(((product: any) => {
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
                                                                                    <td className="w-25">€{product?.attributes?.total_price - product.attributes.discount_price * product.attributes.quantity}</td>
                                                                                </tr>
                                                                            </>
                                                                        )
                                                                    }))} */}
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
                                                                <td className="w-75 pl-4">Shipping Cost</td>
                                                                {/* <td className="w-25">€{shippingCost}</td> */}
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
                                                                {/* <td className="w-25 boldfont">€{(total + shippingCost - totalDiscount).toFixed(2)}</td> */}
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

export default AccountResult;