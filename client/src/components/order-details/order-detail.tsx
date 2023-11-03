import { useRouter } from "next/router";
import SellerSideBar from "../seller/SellerSideBar";
import { useEffect, useState } from "react";
import APIs from "~/services/apiService";
import { BASE_URL } from "configuration";
import AppImage from "../shared/AppImage";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { display } from "html2canvas/dist/types/css/property-descriptors/display";
import { FormattedMessage } from "react-intl";


function OrderDetails() {

    const router = useRouter();
    const orderId: any = router.query.orderId;
    const pdfRef = useRef(null);

    const [totalDiscount, setTotalDiscount] = useState<any>(0)
    const [invoiceId, setInvoiceId] = useState()
    const [orderDetails, setOrderDetails] = useState<any>([]);
    const [total, setTotal] = useState<number>(0);
    const [hide, setHide] = useState(true)
    const [shippingCost, setShippingCost] = useState(0)


    useEffect(() => {
        APIs.getOrderDetails(orderId).then(response => {
            let orders = response.data.data;
            setOrderDetails(orders);
            let invoiceID = orders[0]?.attributes?.invoice_id
            let shippingCost = orders[0]?.attributes?.shipping_cost
            setInvoiceId(invoiceID)
            setShippingCost(shippingCost)
            if (orders.length) {
                let total = 0;
                let totalDiscount = 0;
                for (const obj of orders) {
                    total += obj?.attributes?.total_price;
                    totalDiscount += obj?.attributes?.discount_price
                }
                setTotal(total);
                setTotalDiscount(totalDiscount)
            }
        })
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

    return (
        <> 
            <div className="main-body pb-2 mb-5">
            <div className="container">
                <section className="quote-wrapper mt-5">
                    <div className="row">
                        <SellerSideBar />
                        <div className="col-12 col-md-9 p-0 p-sm-3">
                            <div id="downloadDiv" className="coulmn-bg-color-1 rounded p-3" ref={pdfRef} >
                                    <header id="header1" className="header-download custom-border-2 rounded mb-5 " style={{ display: "none" }} >
                                        <div className="boldfont" style={{ textAlign: "center" }}>Order Invoice</div>
                                    </header>
                                <div className="d-flex justify-content-between m-0 pt-3 ml-sm-3">
                                    <div className="col-8 p-0">
                                        <span className="custom-color-2 boldfont body-sub-titles"><FormattedMessage id="ORDER_DETAILS"/> 
                                            <span className="pl-1">#</span>
                                            <span className=" order-no regularfont body-sub-titles">{orderId}</span>
                                        </span>
                                    </div>
                                   
                                    <div className="col-4 d-flex flex-row-reverse">
                                        <button onClick={downloadPdf}  className="delete edit rounded custom-color-6 boldfont mini-text-1 custom-border-1 p-2" style={{visibility: hide ? "visible" : "hidden"}}><FormattedMessage id="DOWNLOAD"/></button>
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
                                                                <th className="custom-color-2 regularfont body-sub-titles-2 my-0 mx-3"><FormattedMessage id="ORDER_DATE"/></th>
                                                            </tr>
                                                            <tr>
                                                                <th className="custom-color-2 regularfont body-sub-titles-2 my-0 mx-3"><FormattedMessage id="ORDER_NO"/></th>
                                                            </tr>
                                                            <tr>
                                                                <th className="custom-color-2 regularfont body-sub-titles-2 my-0 mx-3"><FormattedMessage id="INVOICE_NO"/></th>
                                                            </tr>
                                                            <tr>
                                                                <th className="custom-color-2 regularfont body-sub-titles-2 my-0 mx-3"><FormattedMessage id="SHIPPING"/></th>
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
                                                                    € {shippingCost}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="custom-color-2 regularfont body-sub-titles-2 my-0">

                                                                    € {(total - totalDiscount + shippingCost).toFixed(2)}
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
                                                                                <div className="col-3"> <AppImage style={{height: '2.9rem', width: '2.9rem'}} src={BASE_URL + order?.attributes?.product_image} className="rounded mr-4" /></div>
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
                                        <div className="ubo-inner-box px-sm-4 py-4 ml-sm-3 mr-1 px-sm-3 py-sm-3 mr-sm-4">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="col-auto">
                                                        <p className="custom-color-2 semifont body-sub-titles-1"><FormattedMessage id="DELIVERY_ADDRESS"/></p>
                                                        <span className="custom-color-2  semifont mini-text-2"><FormattedMessage id="STREET_ADDRESS"/> : </span><span className="custom-color-2 regularfont mini-text-2">{orderDetails[0]?.attributes?.address_housenumber}</span><br />
                                                        {orderDetails[0]?.attributes?.address_apartment && 
                                                            <>
                                                                <span className="custom-color-2 regularfont body-sub-titles-2">{orderDetails[0]?.attributes?.address_apartment}</span>
                                                                <br />
                                                            </>
                                                        }
                                                        <span className="custom-color-2  semifont mini-text-2 "><FormattedMessage id="CITY"/> : </span><span className="custom-color-2 regularfont mini-text-2">{orderDetails[0]?.attributes?.city}</span><br />
                                                        <span className="custom-color-2  semifont mini-text-2"><FormattedMessage id="STATE"/> : </span><span className="custom-color-2 regularfont mini-text-2">{orderDetails[0]?.attributes?.state}</span><br />
                                                        <span className="custom-color-2  semifont mini-text-2"><FormattedMessage id="COUNTRY"/> : </span><span className="custom-color-2 regularfont mini-text-2">{orderDetails[0]?.attributes?.country}</span><br />
                                                        <span className="custom-color-2  semifont mini-text-2"><FormattedMessage id="POSTCODE"/> : </span><span className="custom-color-2 regularfont mini-text-2">{orderDetails[0]?.attributes?.postcode}</span><br />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    <footer id="footer1" className="footer-download custom-border-2 rounded " style={{ visibility: "hidden" }}  >
                                        <div style={{ textAlign: "center" }}>
                                            <img src="/images/svg/LOGO.svg" alt="" width="150px" />
                                        </div>
                                        <div style={{ textAlign: "center" }}>info@uboparts.com</div>
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

export default OrderDetails;