import React, { useCallback, useEffect, useState} from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '~/components/shared/AppImage';
import { BASE_URL } from 'configuration';
import SellerSideBar from './SellerSideBar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import APIs from '~/services/apiService';
import WidgetSearch from '../widgets/WidgetSearch';
import { UserContext } from '../account_/UserContext';
import { FormattedMessage } from 'react-intl';


function SellerListings() {
    
    const {user} = UserContext();

    const router = useRouter();
    const [uname, setUname] = useState<any>("");
    const [sellerList, setSellerList] = useState<any>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [itemId, setItemId] = useState<any>('')
    const [pageNumber, setPageNumber] = useState(1)
    const [totalListNumber , setTotalListNumber] = useState("")
    const [pageCount, setPageCount] = useState();
    const [pagination, setPagination] = useState<any>({});
    const [pageRange, setPageRange] = useState<number[]>([]);

    const handleDelete = async (id: any) => {
        setIsDeleting(true);
        setItemId(id)
        try {
          const deleteResponse = await APIs.deleteProduct(id);
          const response = await APIs.getAllSellerProducts(user.username);
          setSellerList(response?.data?.data);
        } catch (error) {
          console.error("Error deleting product:", error);
        } finally {
          setIsDeleting(false);
        }
      };
    
    const editProduct = (id: any) =>{
        router.push('/sellerUpdates/' + id);
    }

    const pageRangeFinder = (pageCount: number) => {
        let start = 0, range = []
        while (start !== pageCount) {
            range.push(start+1)
            start++
        }
        return range;
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

    useEffect(() => {
        (async () => {
            try {
                // Make the API call with the username
                const res = await APIs.getAllSellerProducts(user.username,"1");
                setSellerList(res.data.data);
                setTotalListNumber(res.data.meta.pagination.total)
                let pagination = res.data.meta.pagination;
                setPageCount(res.data.meta.pagination.pageCount)
                setPageRange(pageRangeFinder(pagination.pageCount));
                setPagination(pagination);
            } catch (error) {
                console.error(error);
            }
        })(); // Invoke the async function immediately
    }, []);

    const handleProductClick = (product: any) => {
        router.push('/sellerProducts_/' + product.id);
    }
  
    const handlePageChange = async(page:any) =>{
        if (page >= 1) {
            // Update the page number here
            setPageNumber(page);
        }
        const res = await APIs.getAllSellerProducts(user.username,page);
        setSellerList(res.data.data);
        let pagination = res.data.meta.pagination;
        setPageCount(res.data.meta.pagination.pageCount)
        setPageRange(pageRangeFinder(pagination.pageCount));
        setPagination(pagination);
    }
    
    return (
        <>
            <div className="main-body pb-2 mb-5">
                <div className="container">
                    <section className="quote-wrapper mt-5">
                        <div className="row mt-3 g-4">
                            <SellerSideBar />
                            <div className="col-12 col-md-9 p-0 p-sm-3">
                                <div className="coulmn-bg-color-1 rounded">
                                    <div className="table-responsive">
                                        <table className="table quote-table seller-table">
                                            <thead>
                                                <th className="p-2 pb-3 px-4 pt-4 custom-color-2 mediumfont subtitles border-top-0">
                                                    <span><FormattedMessage id="LISTINGS"/></span>
                                                    {sellerList && sellerList.length > 0 && <span className="lightfont body-sub-titles"> ({totalListNumber})</span>}
                                                    
                                                    <button type="button" className="minor-button custom-color-7 boldfont mini-text-3 rounded border-0 button-bg-color-1" onClick={() => router.push('/seller/create_new_listing')}>
                                                        <FormattedMessage id="CREATE_NEW_LISTING" />
                                                    </button>
                                                </th>
                                            </thead>
                                        </table>
                                    </div>
                                    <div className="row g-4 p-4 pb-4 pt-2">
                                        {sellerList && sellerList.map((item: any, index: any) => {
                                            return <div className="col-12 col-sm-6 col-lg-4">
                                                <div className="latest-prods mb-5 card card-shadows seller-listing-products">
                                                    {(item.attributes?.sale?.data?.attributes?.discount_percentage_value != 0 && item.attributes.sale.data != null) && (
                                                        <span  className="sale-tag position-absolute">{item.attributes.sale.data.attributes.discount}</span>
                                                    )}
                                                    <div className="position-relative d-flex align-items-center">
                                                        <AppImage
                                                            src={BASE_URL + item?.attributes?.product_image?.data?.attributes?.url}
                                                            className="card-img-top img-prod-height pointer"
                                                            style={{ height: '20rem', objectFit: 'contain', borderTopLeftRadius: "30px", borderTopRightRadius: "30px", opacity: `${item.attributes.stock_count == 0 ? "0.6" : "1"}` }}
                                                            onClick={() => handleProductClick(item)}
                                                        />
                                                         {
                                                            item.attributes.stock_count == 0 &&  
                                                               
                                                                   <p className='text-out-of-stock mb-0 position-absolute'><FormattedMessage id="OUT_OF_STOCK"/></p>
                                                                
                                                      
                                                             }
                                                        {
                                                           (item.attributes?.sale?.data?.attributes?.discount_percentage_value != 0 && item.attributes.sale.data != null) ? 
                                                                <div className=' button-bg-color-1 product-price d-flex' >
                                                                    <div >
                                                                        <span className=" text-white regularfont boldfontsize mr-1 fs-16"> <s>€{item.attributes.price} </s> </span>
                                                                    </div>
                                                                    <div>
                                                                        <span className=" text-white regularfont boldfontsize fs-20"> €{(discountedPrice(item.attributes.price, item.attributes.sale?.data?.attributes?.discount_percentage_value)).toFixed(2)}</span>
                                                                    </div>
                                                                </div>
                                                            :
                                                            <span className="product-price button-bg-color-1 text-white regularfont boldfontsize fs-20">€ {item.attributes.price}</span>
                                                        }
                                                    </div>
                                                    <div className="card-body p-4">
                                                        <div className="row g-2">
                                                            <div className="col-12  d-flex justify-content-between">
                                                                <span className="article-number regularfont mini-text"  onClick={() => handleProductClick(item)}>{item.attributes.category?.data?.attributes?.category_name}</span>
                                                                {item.attributes.stock_count > 0  ?
                                                                 <span className='button-bg-color-1' style={{  color: 'white', padding: '5px 12px', borderRadius: '20px' }}>
                                                                 {item.attributes.stock_count}          
                                                                </span>
                                                                :          
                                                                <span className='button-bg-color-1' style={{  color: 'white', padding: '5px 12px', borderRadius: '20px' }}>
                                                                {item.attributes.stock_count}          
                                                               </span>
                                                                
                                                             }
                                                               
                                                            </div>
                                                            <div className="col-12 pt-2 pb-2">
                                                                <span className="product-name regularfont">{item.attributes.title}</span>
                                                            </div>
                                                            <div className="col-12 d-flex justify-content-between " style={{ gap: "20px" }}>
                                                                <button type="button" onClick={() => editProduct(item.id)} className="edit rounded button-bg-color-1 text-white boldfont mini-text-1 custom-border-2 p-2" style={{ width: "100%" }}
                                                                >
                                                                    <FormattedMessage id="EDIT"/>
                                                                </button>
                                                              {isDeleting && item.id == itemId? 
                                                               <button
                                                               type="button"
                                                               onClick={() => handleDelete(item.id)}
                                                               className="delete edit rounded custom-color-6 boldfont mini-text-1 custom-border-1 p-2"
                                                               style={{ width: "100%", cursor: "not-allowed", opacity: "0.5"}}
                                                               disabled={isDeleting}
                                                           >
                                                                <FormattedMessage id="DELETING"/>
                                                           </button>
                                                           :
                                                           <button
                                                           type="button"
                                                           onClick={() => handleDelete(item.id)}
                                                           className="delete edit rounded custom-color-6 boldfont mini-text-1 custom-border-1 p-2"
                                                           style={{ width: "100%"}}
                                                       >
                                                          <FormattedMessage id="DELETE" />
                                                       </button>} 
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        })}


                                    </div>
                                </div>
                                <div className="row mt-5">
                                 <div className="col text-center">
                                                <ul className="pagination d-inline-flex">
                                                    <li className="page-item">
                                                        {pageNumber !== 1 ? (
                                                            <a
                                                                onClick={() => handlePageChange(pageNumber - 1)}
                                                                className="page-link border-0 regularfont mini-text-1"
                                                                href="#"
                                                            >
                                                                <i className="fa fa-angle-left custom-color-4 mini-text-1 m-1"></i> <FormattedMessage id="PREVIOUS"/>
                                                            </a>
                                                        ) : (
                                                            <a
                                                                className="page-link border-0 regularfont mini-text-1 disabled custom-color-4"
                                                                style={{ cursor: "not-allowed" }}
                                                            >
                                                                <i className="fa fa-angle-left custom-color-4 mini-text-1 m-1"></i> <FormattedMessage id="PREVIOUS"/>
                                                            </a>
                                                        )}
                                                    </li>
                                                    {pageRange.map((page: number, idx: number) => {
                                                        return (
                                                            <li className={`page-item ${page === pagination.page ? 'active': ''}`}>
                                                                <a onClick={() => handlePageChange(page)} className="page-link border-0 custom-color-3 regularfont mini-text-1" href="#">{page}</a>
                                                            </li>
                                                        )
                                                    })}
                                                   
                                                    <li className="page-item">
                                                    { pageCount &&
                                                        pageCount == pageNumber || pageCount == '1' ? 

                                                        <a className="page-link border-0 custom-color-4 regularfont mini-text-1 disabled"
                                                        style={{ cursor: "not-allowed" }} 
                                                        >
                                                            <FormattedMessage id="NEXT"/>
                                                        <i className="fa fa-angle-right custom-color-4 mini-text-1 m-1  ">
                                                            </i></a>
                                                          :
                                                          <a onClick={() => handlePageChange(pageNumber+ 1)} className="page-link border-0 custom-color-3 regularfont mini-text-1"
                                                          href="#"
                                                        >
                                                        <FormattedMessage id="NEXT"/>
                                                        <i className="fa fa-angle-right custom-color-3 mini-text-1 m-1"></i></a>
                                                    }
                                                        
                                                    </li>
                                                </ul>
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
export default SellerListings;