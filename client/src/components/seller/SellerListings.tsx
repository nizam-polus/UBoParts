import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '~/components/shared/AppImage';
import { BASE_URL } from 'configuration';
import SellerSideBar from './SellerSideBar';
function SellerListings() {
    return (

        <>
           <div className="main-body pb-2 mb-5">
            <div className="container">
                <section className="quote-wrapper mt-5">
                    <div className="row mt-3 g-4">
                        <div className="col-12 col-md-3">
                            <div className="quote-inner-wrapper coulmn-bg-color-1 rounded p-3 ps-4 pe-4">
                                <div className="table-responsive">
                                    <table className="table quote-table seller-table">
                                        <thead>
                                            <th className="p-2 pb-3 ps-0 custom-color-2 mediumfont subtitles">Shop Manager</th>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="active">
                                                    <div>
                                                        <a href="" className="custom-color-2 regularfont body-sub-titles">Dashboard</a>
                                                        <span className="arrow-right"></span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="" className="custom-color-2 regularfont body-sub-titles">Listings</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="" className="custom-color-2 regularfont body-sub-titles">Messages</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="" className="custom-color-2 regularfont body-sub-titles">Orders</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="" className="custom-color-2 regularfont body-sub-titles">Edit shop</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="" className="custom-color-2 regularfont body-sub-titles">Password</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="" className="custom-color-2 regularfont body-sub-titles">Logout</a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-9">
                            <div className="coulmn-bg-color-1 rounded">
                                <div className="table-responsive">
                                    <table className="table quote-table seller-table">
                                        <thead>
                                            <th className="p-2 pb-3 ps-4 pt-4 custom-color-2 mediumfont subtitles">
                                                <span>Listings</span>
                                                <span className="lightfont body-sub-titles">(154)</span>
                                                <button type="button" className="minor-button custom-color-7 boldfont mini-text-3 rounded border-0 button-bg-color-1">Create New Listing</button>
                                            </th>
                                        </thead>
                                    </table>
                                </div>
                                <div className="row g-4 p-4 pb-4 pt-2">
                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="latest-prods card card-shadows seller-listing-products">
                                            <div className="position-relative">
                                                <AppImage src="/images/cat-prod-1.svg" className="card-img-top"/>
                                                <span className="product-price button-bg-color-1 text-white regularfont boldfontsize">€230</span>
                                            </div>
                                            <div className="card-body p-4">
                                                <div className="row g-2">
                                                    <div className="col-12">
                                                        <span className="article-number regularfont mini-text">Body Parts</span>
                                                    </div>
                                                    <div className="col-12">
                                                        <span className="product-name regularfont">Mercedes sprinter achter as</span>
                                                    </div>
                                                    <div className="col-12 d-flex justify-content-between">
                                                        <button type="button" className="edit rounded button-bg-color-1 text-white boldfont mini-text-1 custom-border-2">Edit</button>
                                                        <button type="button" className="delete edit rounded custom-color-6 boldfont mini-text-1 custom-border-1">Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="latest-prods card card-shadows seller-listing-products">
                                            <div className="position-relative">
                                                <AppImage src="/images/cat-prod-1.svg" className="card-img-top"/>
                                                <span className="product-price button-bg-color-1 text-white regularfont boldfontsize">€230</span>
                                            </div>
                                            <div className="card-body p-4">
                                                <div className="row g-2">
                                                    <div className="col-12">
                                                        <span className="article-number regularfont mini-text">Body Parts</span>
                                                    </div>
                                                    <div className="col-12">
                                                        <span className="product-name regularfont">Mercedes sprinter achter as</span>
                                                    </div>
                                                    <div className="col-12 d-flex justify-content-between">
                                                        <button type="button" className="edit rounded button-bg-color-1 text-white boldfont mini-text-1 custom-border-2">Edit</button>
                                                        <button type="button" className="delete edit rounded custom-color-6 boldfont mini-text-1 custom-border-1">Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="latest-prods card card-shadows seller-listing-products">
                                            <div className="position-relative">
                                                <AppImage src="/images/cat-prod-1.svg" className="card-img-top"/>
                                                <span className="product-price button-bg-color-1 text-white regularfont boldfontsize">€230</span>
                                            </div>
                                            <div className="card-body p-4">
                                                <div className="row g-2">
                                                    <div className="col-12">
                                                        <span className="article-number regularfont mini-text">Body Parts</span>
                                                    </div>
                                                    <div className="col-12">
                                                        <span className="product-name regularfont">Mercedes sprinter achter as</span>
                                                    </div>
                                                    <div className="col-12 d-flex justify-content-between">
                                                        <button type="button" className="edit rounded button-bg-color-1 text-white boldfont mini-text-1 custom-border-2">Edit</button>
                                                        <button type="button" className="delete edit rounded custom-color-6 boldfont mini-text-1 custom-border-1">Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="latest-prods card card-shadows seller-listing-products">
                                            <div className="position-relative">
                                                <AppImage src="/images/cat-prod-1.svg" className="card-img-top"/>
                                                <span className="product-price button-bg-color-1 text-white regularfont boldfontsize">€230</span>
                                            </div>
                                            <div className="card-body p-4">
                                                <div className="row g-2">
                                                    <div className="col-12">
                                                        <span className="article-number regularfont mini-text">Body Parts</span>
                                                    </div>
                                                    <div className="col-12">
                                                        <span className="product-name regularfont">Mercedes sprinter achter as</span>
                                                    </div>
                                                    <div className="col-12 d-flex justify-content-between">
                                                        <button type="button" className="edit rounded button-bg-color-1 text-white boldfont mini-text-1 custom-border-2">Edit</button>
                                                        <button type="button" className="delete edit rounded custom-color-6 boldfont mini-text-1 custom-border-1">Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="latest-prods card card-shadows seller-listing-products">
                                            <div className="position-relative">
                                                <AppImage src="/images/cat-prod-1.svg" className="card-img-top"/>
                                                <span className="product-price button-bg-color-1 text-white regularfont boldfontsize">€230</span>
                                            </div>
                                            <div className="card-body p-4">
                                                <div className="row g-2">
                                                    <div className="col-12">
                                                        <span className="article-number regularfont mini-text">Body Parts</span>
                                                    </div>
                                                    <div className="col-12">
                                                        <span className="product-name regularfont">Mercedes sprinter achter as</span>
                                                    </div>
                                                    <div className="col-12 d-flex justify-content-between">
                                                        <button type="button" className="edit rounded button-bg-color-1 text-white boldfont mini-text-1 custom-border-2">Edit</button>
                                                        <button type="button" className="delete edit rounded custom-color-6 boldfont mini-text-1 custom-border-1">Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="latest-prods card card-shadows seller-listing-products">
                                            <div className="position-relative">
                                                <AppImage src="/images/cat-prod-1.svg" className="card-img-top"/>
                                                <span className="product-price button-bg-color-1 text-white regularfont boldfontsize">€230</span>
                                            </div>
                                            <div className="card-body p-4">
                                                <div className="row g-2">
                                                    <div className="col-12">
                                                        <span className="article-number regularfont mini-text">Body Parts</span>
                                                    </div>
                                                    <div className="col-12">
                                                        <span className="product-name regularfont">Mercedes sprinter achter as</span>
                                                    </div>
                                                    <div className="col-12 d-flex justify-content-between">
                                                        <button type="button" className="edit rounded button-bg-color-1 text-white boldfont mini-text-1 custom-border-2">Edit</button>
                                                        <button type="button" className="delete edit rounded custom-color-6 boldfont mini-text-1 custom-border-1">Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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