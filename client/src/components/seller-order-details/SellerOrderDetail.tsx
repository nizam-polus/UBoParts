import { useRouter } from "next/router";
import SellerSideBar from "../seller/SellerSideBar";
import { useEffect, useState, useRef } from "react";
import APIs from "~/services/apiService";
import { BASE_URL } from "configuration";
import AppImage from "../shared/AppImage";
import { UserContext } from "../account_/UserContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";

function SellerOrderDetails() {

    const router = useRouter();
    const orderId: any = router.query.orderId;
    const pdfRef = useRef(null);
    const { user } = UserContext();
    
    const [invoiceId, setInvoiceId] = useState(0)
    const [status, setStatus] = useState("")
    const [orderDetails, setOrderDetails] = useState<any>([]);
    const [totalDiscount, setTotalDiscount] = useState<any>(0)
    const [total, setTotal] = useState<number>(0);
    const [customer, setCustomer] = useState<any>();
    const [hide, setHide] = useState(true)
    const [shippngCost, setShippingCost] = useState(0)
    const [transactionId, setTransactionId] = useState("")

    useEffect(() => {
        APIs.getOrderDetails(orderId).then(response => {
            let orders = response.data.data;
            setOrderDetails(orders);
            let customerId = orders[0]?.attributes?.customer_id;
            let invoiceID = orders[0]?.attributes?.invoice_id
            let shippingCost = orders[0]?.attributes?.shipping_cost
            let status = orders[0]?.attributes?.status
            let transactionId = orders[0]?.attributes?.transaction_id
            setInvoiceId(invoiceID)
            setShippingCost(shippingCost)
            setStatus(status)
            setTransactionId(transactionId)
            APIs.getSpecificUser(customerId).then(response => {
                setCustomer(response.data);
            })
            if (orders.length) {
                let total = 0;
                let totalDiscount = 0
                for (const obj of orders) {
                    total += obj?.attributes?.total_price;
                    totalDiscount += obj?.attributes?.discount_price
                }
                setTotal(total);
                setTotalDiscount(totalDiscount)
            }
        }).catch(err => console.log(err))
    },[])
 
    useEffect(() => {
        if (!hide) {
          const input = pdfRef.current;
    
          if (input) {
            const mainPdf = new jsPDF('p', 'mm', 'a4', true);
    
            html2canvas(input, { logging: true, allowTaint: false, useCORS: true, onclone: function (clonedDoc: any) {
                // I made the div hidden and here I am changing it to visible
               clonedDoc.getElementById('footer1').style.visibility = 'visible';
               clonedDoc.getElementById('header1').style.display = 'block';
             } }).then((canvas) => {
                
              const imgData = canvas.toDataURL('image/png');
              const pdfWidth = mainPdf.internal.pageSize.getWidth();
              const pdfHeight = mainPdf.internal.pageSize.getHeight();
              const imgWidth = canvas.width;
              const imgHeight = canvas.height;
              const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
              const imgX = (pdfWidth - imgWidth * ratio) / 2;
              const imgY = 30;
              mainPdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
              mainPdf.save("invoice.pdf");
              setHide(true);
            });
          }
        }
      }, [hide]);
    
      const downloadPdf = () => {
        setHide(false);
      };

      const paymentRefundFunction = () =>{
        APIs.paymentRefund({
            "transactionUid": transactionId,
            "payoutDescription": "Your transaction refunded due to technical reasons"
        }).then((res) =>{
            console.log(res)
            toast.success("refunded")
        }).catch((err) =>{
            console.log(err)
            toast.error(err)
        })
    }

    return (
        <> 
            <div className="main-body pb-2 mb-5">
                <div className="container">
                    <section className="quote-wrapper mt-5">
                        <div className="row">
                            <SellerSideBar />
                            <div className="col-12 col-md-9 p-0 p-sm-3">
                                <div className="coulmn-bg-color-1 rounded px-3 pb-5 pt-3" ref={pdfRef}>
                                    <header id="header1" className="header-download custom-border-2 rounded mb-5 " style={{display: "none"}} >
                                        <div className="boldfont" style={{ textAlign: "center" }}>Order Invoice</div>
                                    </header>
                                    <div className="d-flex justify-content-between m-0 pt-3 ml-sm-3">
                                        <div className="col-8 p-0">
                                            <span className="custom-color-2 boldfont body-sub-titles"><FormattedMessage id="ORDER_DETAILS" />
                                                <span className="pl-1">#</span>
                                                <span className=" order-no regularfont body-sub-titles">{orderId}</span>
                                            </span>
                                            <span data-value={status} className="badge badge-pill badge-info px-3 py-2 ml-2 ubo-badge">
                                                    {status == "chargeback" ? "refunded"  : status}
                                            </span>
                                            {
                                            status == "completed" ? 
                                                <button onClick={paymentRefundFunction} className="badge badge-pill badge-warning px-3 py-2 ml-2 ubo-badge">Click to Refund</button>
                                            :
                                                ""
                                            }
                                        </div>
                                        <div className="col-4 d-flex flex-row-reverse">
                                            <button onClick={downloadPdf} className="delete edit rounded custom-color-6 boldfont mini-text-1 custom-border-1 p-2" style={{visibility: hide ? "visible" : "hidden"}}><FormattedMessage id="DOWNLOAD"/></button>
                                        </div>
                                        <br />
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-12 col-sm-8">
                                            <div className="ubo-inner-box ml-sm-3 mr-sm-1 px-sm-4 py-2 py-sm-4">
                                                    {/* <div className="d-flex justify-content-between m-0 pb-4 ml-3">
                                                        <span className="custom-color-2 semifont body-sub-titles-1">Order summary</span><br />
                                                    </div> */}
                                                    <div className="row m-0 px-0">
                                                        <div className="col-6 col-sm-7">
                                                            <table >
                                                                <thead>
                                                                    <tr>
                                                                        <th className="custom-color-2 regularfont body-sub-titles-2 my-0 mx-3"><FormattedMessage id="ORDER_DATE" /></th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th className="custom-color-2 regularfont body-sub-titles-2 my-0 mx-3"><FormattedMessage id="ORDER_NO" /></th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th className="custom-color-2 regularfont body-sub-titles-2 my-0 mx-3"><FormattedMessage id="INVOICE_NO" /></th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th className="custom-color-2 regularfont body-sub-titles-2 my-0 mx-3"><FormattedMessage id="SHIPPING_COST"/></th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th className="custom-color-2 regularfont body-sub-titles-2 my-0 mx-3"><FormattedMessage id="ORDER_TOTAL"/></th>
                                                                    </tr>
                                                                   
                                                                </thead>
                                                            </table>
                                                        </div>
                                                        <div className="col-6 col-sm-5">
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
                                                                            {invoiceId}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="custom-color-2 regularfont body-sub-titles-2 my-0">
                                                                        € {shippngCost}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>    
                                                                        <td className="custom-color-2 regularfont body-sub-titles-2 my-0">

                                                                        € {(total - totalDiscount + shippngCost).toFixed(2)}
                                                                        </td>
                                                                     </tr>
                                                                   
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="coulmn-bg-color-1 rounded mt-4 mb-3">
                                                <div className="ubo-inner-box px-sm-4 py-4 mr-1 ml-sm-3">
                                                    <div className="table-responsive">
                                                    <table className="table order-table2">
                                                        <thead>
                                                            <tr>
                                                                <td className="custom-color-2 boldfont body-sub-titles-2 pb-2 border-bottom"><FormattedMessage id="ITEM_SUMMARY"/></td>
                                                                <td className="custom-color-2 boldfont body-sub-titles-2 pb-2 border-bottom text-center"><FormattedMessage id="QUANTITY"/></td>
                                                                <td className="custom-color-2 boldfont body-sub-titles-2 pb-2 border-bottom text-center"><FormattedMessage id="PRICE"/></td>
                                                                <td className="custom-color-2 boldfont body-sub-titles-2 pb-2 border-bottom text-center"><FormattedMessage id="TOTAL_PRICE"/></td>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-center">
                                                            {orderDetails.map((order: any) => {
                                                                return (
                                                                    <>
                                                                        <tr className="order-data">                                                   
                                                                            <td className="custom-color-2 regularfont body-sub-titles-2 py-3 border-bottom w-50">
                                                                                <div className="d-inline-flex">
                                                                                    <div className="col-3"> <AppImage style={{height: '2.9rem', width: '2.9rem', objectFit: 'cover'}} src={BASE_URL + order?.attributes?.product_image} className="rounded mr-4" /></div>
                                                                                    <div className="col ml-2">{order?.attributes?.product_name}</div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="custom-color-2 regularfont body-sub-titles-2 py-3 border-bottom text-center">{order?.attributes?.quantity}</td>
                                                                           <td className="custom-color-2 regularfont body-sub-titles-2 py-3 border-bottom text-center"> {(order?.attributes?.product_price - (order?.attributes?.discount_price / order?.attributes?.quantity)).toFixed(2)}</td>
                                                                            <td className="custom-color-2 regularfont body-sub-titles-2 py-3 border-bottom text-center">{(order?.attributes?.total_price - order?.attributes?.discount_price).toFixed(2)}</td>
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
                                        <div className="col-12 col-sm-4 pl-sm-2 pr-sm-1">
                                            <div className="ubo-inner-box px-sm-3 py-4 mr-sm-4 mb-4">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="col-auto">
                                                            <p className="custom-color-3 semifont body-sub-titles-1 pb-2"><FormattedMessage id="CUSTOMER_DETAILS"/></p>
                                                            <div className="d-inline-flex pb-4 w-100">
                                                                <div className="col-3 p-0"> 
                                                                    <AppImage style={{height: '3.9rem', width: '3.9rem', objectFit: 'cover'}} src={BASE_URL + customer?.profile_image?.url} className="rounded mr-4" />
                                                                </div>
                                                                <div className="col ml-2">
                                                                    <span className="custom-color-2 regularfont body-sub-titles-2">{customer?.first_name && (customer?.first_name + ' ' + customer?.last_name)}</span><br />
                                                                </div>
                                                            </div>
                                                            <span className="custom-color-2  semifont mini-text-2 "><FormattedMessage id="EMAIL"/>: </span><span className="custom-color-2 regularfont body-sub-titles-2">{customer?.email}</span><br />
                                                            <span className="custom-color-2  semifont mini-text-2 "><FormattedMessage id="PHONE"/> : </span><span className="custom-color-2 regularfont body-sub-titles-2">{customer?.phone_number}</span><br />
                                                            <span className="custom-color-2  semifont mini-text-2 "><FormattedMessage id="COUNTRY"/> : </span><span className="custom-color-2 regularfont body-sub-titles-2">{customer?.country}</span><br />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ubo-inner-box px-sm-3 py-4 mr-sm-4">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="col-auto">
                                                            <p className="custom-color-2 semifont body-sub-titles-1"><FormattedMessage id="DELIVERY_ADDRESS"/></p>
                                                            <span className="custom-color-2  semifont mini-text-2"><FormattedMessage id="STREET_ADDRESS"/>: </span><span className="custom-color-2 regularfont mini-text-2">{orderDetails[0]?.attributes?.address_housenumber}</span><br />
                                                            {orderDetails[0]?.attributes?.address_apartment && 
                                                                <>
                                                                    <span className="custom-color-2 regularfont body-sub-titles-2">{orderDetails[0]?.attributes?.address_apartment}</span>
                                                                    <br />
                                                                </>
                                                            }
                                                            <span className="custom-color-2  semifont mini-text-2 "><FormattedMessage id="CITY"/> : </span><span className="custom-color-2 regularfont mini-text-2">{orderDetails[0]?.attributes?.city}</span><br />
                                                            <span className="custom-color-2  semifont mini-text-2"><FormattedMessage id="STATE"/> : </span><span className="custom-color-2 regularfont mini-text-2">{orderDetails[0]?.attributes?.state}</span><br />
                                                            <span className="custom-color-2  semifont mini-text-2"><FormattedMessage id="COUNTRY"/> : </span><span className="custom-color-2 regularfont mini-text-2">{orderDetails[0]?.attributes?.country}</span><br />
                                                            <span className="custom-color-2  semifont mini-text-2"><FormattedMessage id="POST_CODE"/> : </span><span className="custom-color-2 regularfont mini-text-2">{orderDetails[0]?.attributes?.postcode}</span><br />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>    
                                    </div>
                                    <footer id="footer1" className="footer-download custom-border-2 rounded " style={{visibility: "hidden"}} >
                                        <div className="d-flex" style={{gap: "20px"}}>
                                            <div style={{width: "400px"}}>
                                                <div>
                                                    <img src="/images/svg/LOGO.svg" alt="" width="150px" />
                                                </div>
                                                <div>info@uboparts.com</div>
                                                <div>UboParts, Zomerdijk 11, 1505HW Zaandam, The Netherlands</div>
                                            </div>
                                            <div className="align-items-start">
                                                <h6>This invoice is generated at  {new Date(orderDetails[0]?.attributes?.publishedAt).toDateString()}</h6>
                                            </div>
                                        </div>
                                    </footer>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                </div>
            </div>
        </>
    )
}

export default SellerOrderDetails;