// react
import React, { useCallback, useEffect, useState, useRef } from 'react';
import AppImage from '../shared/AppImage';
import Header_logged_in from '../header_/Header-logged-in';
import Footer from '../footer_/Footer';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import APIs from '~/services/apiService';
import { BASE_URL } from 'configuration';
import Qrgenerator from './Qrgenerator';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FormattedMessage } from 'react-intl';

const SellerListSingle = () => {

    const router = useRouter();
    const id = router.query.id;
    const [productData, setProductData] = useState<any>({})
    const [productImage, setProductImage] = useState<any>({})
    const [productGallery, setProductGallery] = useState([])
    const [quantity, setQuantity] = useState(1);
    const componentRef:any = useRef();

    useEffect(() => {
        APIs.getProduct(id).then(response => {
            let product = response.data.data;
            let productGallery: any = [];
            let productImage = response.data.data.attributes?.product_image?.data.attributes.url;
            productGallery.unshift({attributes: {url: productImage}})
            if (response.data.data.attributes?.product_gallary_image?.data) {
                let gallery = response.data.data.attributes?.product_gallary_image?.data;
                for(let obj of gallery) {
                    productGallery.push(obj);
                }
            }
            setProductData(product);
            setProductGallery(productGallery);
            setProductImage(productImage);           
        }).catch(err => console.log(err))
    }, []);

    const handleImageChange = (url: string) => {
        setProductImage(url);
    }

    function discountedPrice(originalPrice: any, discountPercentage:any) {
        const original = parseFloat(originalPrice);
        const discount = parseFloat(discountPercentage);
      
        if (isNaN(discount)) {
          return original; 
        }
        const discountAmount = (original * discount) / 100;
        const discounted = original - discountAmount;
        return +discounted.toFixed(2); 
    }

    const handleDownload = () => {
        const qrCodeElement = componentRef.current;
        if (qrCodeElement) {
          const qrCodeSVG = new XMLSerializer().serializeToString(qrCodeElement);
          const blob = new Blob([qrCodeSVG], { type: 'image/svg+xml' });
          const a = document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          a.download = 'qrcode.svg'; // Specify the desired filename with an SVG extension
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      };

      const printBarcode = () =>{
        const input = componentRef.current;
        if (input) {
          const mainPdf = new jsPDF('landscape', 'in', [4, 2], true);
          html2canvas(input, { logging: true, allowTaint: false, useCORS: true, onclone: function (clonedDoc: any) {
           } }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = 2; // 11cm in mm
            const pdfHeight = 4; // 5cm in mm
            mainPdf.addImage(imgData, 'PNG', 0, 0, 4 , 2 );
            // mainPdf.save('invoice.pdf');
            const pdfBlob = mainPdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            const newWindow : any= window.open(pdfUrl, '_blank', 'width=600,height=800');
            newWindow.print();
            newWindow.onafterprint = function () {
              newWindow.close();
            };
          });
        }
    }
      
    return (
        <>
            <div className="main-body pb-5 mb-5">
                <div className="container">
                    <section className="products-description-wrapper mt-5 mb-5">
                        <div className="row">
                            <div className="col-12 col-md-6 col-lg-4">
                                <div className="row">
                                    <AppImage style={{ objectFit: 'contain', height: '30rem' }} className="rounded w-100" src={BASE_URL + productImage} />
                                </div>
                                <div className="row product-thumbnails g-3 mt-3 justify-content-center">
                                    {productGallery && productGallery.map((galleryImg: any) => {
                                        return (
                                            <div className="col-auto px-2"
                                                style={{ "cursor": "pointer" }}
                                                onClick={() => handleImageChange(galleryImg?.attributes?.url)}
                                            >
                                                <img className="rounded" src={BASE_URL + galleryImg?.attributes?.url} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-5 px-5 pb-lg-0 pt-lg-0 mt-5 mt-md-0 mt-lg-0">
                                <p className="semifont inner-page-main-headings custom-color-5">{productData?.attributes?.title}</p>
                                <p className="custom-color-3 regularfont placeholderfontsize mb-1">{productData?.attributes?.description}</p>
                                {/* <p className="mb-1">
                                    <span className="ratings">
                                        <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                        <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                        <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                        <i className="fa fa-star placeholderfontsize" aria-hidden="true"></i>
                                    </span>
                                    <span className="rating-count regularfont mini-text-1">675</span>
                                </p> */}
                                <p>
                                    {
                                         (productData.attributes?.sale?.data?.attributes?.discount_percentage_value != 0 && productData?.attributes?.sale?.data != null) ?
                                        <span className="product-price custom-color-3 regularfont boldfontsize"><s>€{productData?.attributes?.price} </s>  €{discountedPrice(productData.attributes.price, productData.attributes.sale.data.attributes.discount)}</span>
                                        :
                                        <span className="product-price custom-color-3 regularfont boldfontsize">€{productData?.attributes?.price} </span>
                                    }
                                </p>
                                <hr />
                                <p className="semifont placeholderfontsize custom-color-5 mb-1"><FormattedMessage id="KEY_FEATURES"/>:</p>
                                <ul className="list-group custom-color-2 regularfont placeholderfontsize p-3 pt-0 pb-4">
                                    <li className="mb-1"><FormattedMessage id="MAKE"/>: {productData?.attributes?.make?.data?.attributes?.make_name}</li>
                                    <li className="mb-1"><FormattedMessage id="MODEL"/>: {productData?.attributes?.model?.data?.attributes?.model_name}</li>
                                    <li><FormattedMessage id="YEAR"/>: {productData?.attributes?.year?.data?.attributes?.year}</li>
                                </ul>
                                <hr />
                                {/* <p className="custom-color-6 regularfont mini-text-2">See Full Specifications</p> */}
                            </div>
                            <div className="col-12 col-md-12 col-lg-3 mt-5 mt-lg-0">
                                <div className="more-info p-3 rounded">
                                    <div className="row d-flex justify-content-between">
                                        <div className="col-auto">
                                            {
                                                 (productData.attributes?.sale?.data?.attributes?.discount_percentage_value != 0 && productData?.attributes?.sale?.data != null) ?
                                                <span className="product-price custom-color-3 regularfont"><s>€{productData?.attributes?.price} </s>  €{discountedPrice(productData.attributes.price, productData.attributes.sale.data.attributes.discount)}</span>
                                                :
                                                <span className="product-price custom-color-3 regularfont">€{quantity * productData?.attributes?.price}</span>
                                            }
                                        </div>
                                        <div className="col-auto"><span className="in-stock custom-color-6 rounded-pill px-3 pb-1 pt-1 d-flex mini-text-2 semifont">{productData?.attributes?.stock_count > 0 ? "In Stock" : "Out of Stock" }</span></div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-12">
                                            {/* <div className="row pt-1 pb-1 border-bottom-row">
                                                <div className="col-4 col-xl-5"><span className="semifont mini-text-3 custom-color-3">Saller:</span></div>
                                                <div className="col-8 col-xl-7"><span className="semifont mini-text-3 seller-name">Kila International AUODEMONTAGEBED</span></div>
                                            </div> */}
                                            <div className="row pt-1 pb-1 border-bottom-row">
                                                <div className="col-4 col-xl-5"><span className="semifont mini-text-3 custom-color-3"><FormattedMessage id="CATEGORY"/> </span></div>
                                                <div className="col-8 col-xl-7"><span className="semifont mini-text-3 seller-name">{productData?.attributes?.category?.data?.attributes?.category_name}</span></div>
                                            </div>
                                            <div className="row pt-1 pb-1 border-bottom-row">
                                                <div className="col-4 col-xl-5"><span className="semifont mini-text-3 custom-color-3"><FormattedMessage id="SUB_CATEGORY"/> </span></div>
                                                <div className="col-8 col-xl-7"><span className="semifont mini-text-3 seller-name">{productData?.attributes?.sub_category?.data?.attributes?.name}</span></div>
                                            </div>
                                            <div className="row pt-1 pb-1 border-bottom-row">
                                                <div className="col-4 col-xl-5"><span className="semifont mini-text-3 custom-color-3"><FormattedMessage id="ARTICLE"/>  </span></div>
                                                <div className="col-8 col-xl-7"><span className="semifont mini-text-3 seller-name">{productData?.attributes?.article_number}</span></div>
                                            </div>
                                            <div className="row pt-1 pb-1 border-bottom-row">
                                                <div className="col-4 col-xl-5"><span className="semifont mini-text-3 custom-color-3"><FormattedMessage id="WAREHOUSE"/></span></div>
                                                <div className="col-8 col-xl-7"><span className="semifont mini-text-3 seller-name">
                                                    <span>{productData?.attributes?.product_location_warehouse}</span>
                                                </span></div>
                                            </div>
                                            <div className="row pt-1 pb-1 border-bottom-row">
                                                <div className="col-4 col-xl-5"><span className="semifont mini-text-3 custom-color-3"><FormattedMessage id="STATUS"/></span></div>
                                                <div className="col-8 col-xl-7"><span className="semifont mini-text-3 seller-name">
                                                    <span>{productData?.attributes?.product_status}</span>
                                                </span></div>
                                            </div>
                                            <div className="row pt-1 pb-1 border-bottom-row">
                                                <div className="col-4 col-xl-5"><span className="semifont mini-text-3 custom-color-3"><FormattedMessage id="STOCK"/></span></div>
                                                <div className="col-8 col-xl-7"><span className="semifont mini-text-3 seller-name">
                                                    <span>{productData?.attributes?.stock_count}</span>
                                                </span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="more-info p-3 rounded mt-3" style={{background: "none"}}>
                                    <div className="row p-1" style={{ display: "grid", placeContent: "center" }}>
                                        <div className="col-12 text-center" style={{background: "#fff", padding: "20px", marginTop: "20px", borderRadius: "10px"}}>
                                            <div className="qr-image" ref={componentRef}>
                                                <div style={{ padding: "5px", background: `#ffcf00`, width: "415.7480315px", height: "188.97637795px" }} 
                                                    className='d-flex align-items-center justify-content-center flex-column'>
                                                    <div className="details d-flex" style={{ width: "100%", fontWeight: "bolder", padding: "0px 10px 0 10px", fontSize: "14px" }}>
                                                        <div className='d-flex justify-content-between' style={{minWidth: "180px"}}>
                                                            <Qrgenerator qrValue={productData?.attributes?.part_no_barcode_no}/>
                                                        </div>
                                                        <div className='d-flex flex-column'>
                                                            <div>
                                                                 <div className='text-right'>UBOPARTS</div>
                                                                 <div className='text-right'>{productData?.attributes?.title.toUpperCase()}</div>
                                                            </div>
                                                            <div className='text-right' style={{minWidth: "110px"}}>
                                                                <div>REK NUMMER : {productData?.attributes?.product_location_warehouse}</div>
                                                                {/* <div> {productData?.attributes?.product_location_warehouse}</div> */}
                                                            </div>
                                                            <div className='text-right'>ARTICLE NO {productData?.attributes?.article_number}</div>
                                                            <div className='text-right'>{productData?.attributes?.make?.data?.attributes?.make_name} {productData?.attributes?.model?.data?.attributes?.model_name} {productData?.attributes?.year?.data?.attributes?.year}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", placeContent: "center", width: "100%", gap: "20px"}}>
                                        <div>
                                        {/* <ReactToPrint
                                             pageStyle={`
                                             @page {
                                                 size: 11cm 5cm;
                                                 margin: 0;
                                             }
                                             @media print {
                                                 body {
                                                     width: 11cm;
                                                     height: 5cm;
                                                 }
                                             }
                                         `}
                                            trigger={() => (
                                                <button
                                                type="button"
                                                className="edit rounded button-bg-color-1 text-white boldfont mini-text-1 custom-border-2 p-2 my-2"
                                                style={{ width: "100%" }}
                                                >
                                                Print
                                                </button>
                                            )}
                                            content={() => componentRef.current}
                                        /> */}

                                            <button
                                                type="button"
                                                className="edit rounded button-bg-color-1 text-white boldfont mini-text-1 custom-border-2 p-2 my-2"
                                                style={{ width: "100%" }}
                                                onClick={printBarcode}
                                            >
                                                <FormattedMessage id="PRINT"/>
                                            </button>
                                        </div>
                                        <div>
                                            <button type="button"
                                                onClick={handleDownload}
                                                className="delete edit rounded custom-color-6 boldfont mini-text-1 custom-border-1 p-2 my-2" style={{ width: "100%" }}
                                            >
                                                <FormattedMessage id="DOWNLOAD"/>
                                            </button>
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

export default SellerListSingle