import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '~/components/shared/AppImage';
import { BASE_URL } from 'configuration';
import SellerSideBar from './SellerSideBar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import APIs from '~/services/apiService';
import WidgetSearch from '../widgets/WidgetSearch';

function SellerListings() {
    const router = useRouter();
    const [uname, setUname] = useState<any>("");
    const [sellerList, setSellerList] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                // Retrieve the userDetails string from localStorage
                const userDetails: any = localStorage.getItem("userdetails");
                const userDetailsJSON = JSON.parse(userDetails);
                // Get the username property from the userDetails object
                const username = userDetailsJSON.username;
                setUname(username);
                // Make the API call with the username
                const res = await APIs.getAllSellerProducts(username);
                console.log(res);
                setSellerList(res.data.data);
            } catch (error) {
                console.error(error);
            }
        })(); // Invoke the async function immediately
    }, []);

    const handleProductClick = (product: any) => {
        router.push('/sellerProducts_/' + product.id);
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
                                    <div className="table-responsive">
                                        <table className="table quote-table seller-table">
                                            <thead>
                                                <th className="p-2 pb-3 ps-4 pt-4 custom-color-2 mediumfont subtitles">
                                                    <span>Listings</span>
                                                    <span className="lightfont body-sub-titles">(154)</span>
                                                    <button type="button" className="minor-button custom-color-7 boldfont mini-text-3 rounded border-0 button-bg-color-1" onClick={() => router.push('/seller/create_new_listing')}>
                                                        Create New Listing</button>
                                                </th>
                                            </thead>
                                        </table>
                                    </div>
                                    <div className="row g-4 p-4 pb-4 pt-2">
                                        {sellerList && sellerList.map((item: any, index) => {
                                            return <div className="col-12 col-sm-6 col-lg-4">
                                                <div className="latest-prods mb-5 card card-shadows seller-listing-products">
                                                    <div className="position-relative">
                                                        <AppImage
                                                            src={BASE_URL + item?.attributes?.product_image?.data?.attributes?.formats?.medium?.url}
                                                            className="card-img-top img-prod-height pointer"
                                                            style={{ height: '20rem', objectFit: 'cover' }}
                                                            onClick={() => handleProductClick(item)}
                                                        />
                                                        <span className="product-price button-bg-color-1 text-white regularfont boldfontsize">€ {item.attributes.price}</span>
                                                    </div>
                                                    <div className="card-body p-4">
                                                        <div className="row g-2" onClick={() => handleProductClick(item)}>
                                                            <div className="col-12  d-flex justify-content-between">
                                                                <span className="article-number regularfont mini-text">{item.attributes.category?.data?.attributes?.category_name}</span>
                                                                <span className='button-bg-color-1' style={{  color: 'white', padding: '5px 10px', borderRadius: '20px' }}>
                                                                    {item.attributes.stock_count}
                                                                </span>
                                                            </div>
                                                            <div className="col-12 pt-2 pb-2">
                                                                <span className="product-name regularfont">{item.attributes.title}</span>
                                                            </div>
                                                            <div className="col-12 d-flex justify-content-between " style={{ gap: "20px" }}>
                                                                <button type="button" className="edit rounded button-bg-color-1 text-white boldfont mini-text-1 custom-border-2 p-2" style={{ width: "100%" }}>Edit</button>
                                                                <button type="button" className="delete edit rounded custom-color-6 boldfont mini-text-1 custom-border-1 p-2" style={{ width: "100%" }}>Delete</button>
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
                                            <li className="page-item"><a className="page-link border-0 regularfont mini-text-1 custom-color-4" href="#"><i className="fa fa-angle-left custom-color-4 mini-text-1 m-1"></i> Previous</a></li>
                                            <li className="page-item"><a className="page-link border-0 custom-color-3 regularfont mini-text-1" href="#">1</a></li>
                                            <li className="page-item active"><a className="page-link border-0 custom-color-3 regularfont mini-text-1" href="#">2</a></li>
                                            <li className="page-item"><a className="page-link border-0 custom-color-3 regularfont mini-text-1" href="#">3</a></li>
                                            <li className="page-item"><a className="page-link border-0 custom-color-3 regularfont mini-text-1" href="#">Next <i className="fa fa-angle-right custom-color-3 mini-text-1 m-1"></i></a></li>
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