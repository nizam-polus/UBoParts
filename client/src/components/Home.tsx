// react
import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import { IVehicle } from '~/interfaces/vehicle';

function Home() {

    return (
        <div className="main-body">
        <div className="container">
            /*-- Section for search starts */
            <section className="section-search-wrapper">
                <form action="" className="search-wrapper">
                    <div className="row g-5 flex-column flex-lg-row">
                        <div className="col">
                            <div className="row g-2 flex-column flex-lg-row">
                                <div className="col">
                                    <div className="form-group">
                                        <input type="form-control" name="article_number" className="semifont placeholderfontsize" placeholder="Search with Car’s Plate Number">
                                    </div>
                                </div>
                                <div className="col-auto or_block"><span className="or_label semifont placeholderfontsize field3">or</span></div>
                                <div className="col">
                                    <div className="form-group">
                                        <input type="form-control" name="plate_number" className="semifont placeholderfontsize" placeholder="Search with Car’s Plate Number">
                                    </div>
                                </div>
                            </div>
                            <div className="row g-4 flex-column flex-lg-row mt-2">
                                <div className="col">
                                    <div className="form-group">
                                        <select className="form-select" name="make" className="semifont placeholderfontsize">
                                            <option>Select Make</option>
                                            <option value="1">Select Make</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <select className="form-select" name="model" className="semifont placeholderfontsize">
                                            <option>Select Model</option>
                                            <option value="1">Select Make</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <select className="form-select" name="year" className="semifont placeholderfontsize">
                                            <option>Select Year</option>
                                            <option value="1">Select Make</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <select className="form-select" name="category" className="semifont placeholderfontsize">
                                            <option>Select Category</option>
                                            <option value="1">Select Make</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-3 d-flex align-items-end">
                            <button type="submit" className="search boldfont boldfontsize">Search</button>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <span className="advanced_search placeholderfontsize regularfont">Advanced Search</span>
                    </div>
                </form>
            </section>
            /*-- Section for search ends */
            <section className="cards-wrapper">
                <div className="row mt-3 g-4">
                    <div className="col">
                        <div className="specific_part">
                            <h3 className="text-white bg-image-text semifont m-0 selling-text">Need A <br>Specific Part?</h3>
                        </div>
                    </div>
                    <div className="col">
                        <div className="start_selling">
                            <h3 className="text-white bg-image-text semifont m-0 selling-text">Start Selling <br>With Us</h3>
                        </div>
                    </div>
                </div>
            </section>
            <section className="categories-wrapper">
                <div className="row mt-5">
                    <div className="col-12 d-flex justify-content-between">
                        <div><span className="popular_categories body-sub-titles regularfont">Popular Categories</span>
                        </div>
                        <div>
                            <button type="button" className="saleoffers regularfont body-sub-titles">Sale Offers</button>
                            <button type="button" className="saleoffers regularfont body-sub-titles">Top Sellers</button>
                        </div>
                    </div>
                    <div className="col"></div>
                    <div className="col text-end">
                        <div className="row">
                            <div className="col"></div>
                            <div className="col"></div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="categories-products-wrapper">
                <div className="row mt-5 mt-lg-4 mt-xxl-5 g-4">
                    <div className="col-6 col-md-3">
                        <div className="prod-cats card">
                            <img src="prod1.svg" className="card-img-top"/>
                            <div className="card-body"><a href="" className="boldfont body-sub-titles">Engine</a></div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="prod-cats card">
                            <img src="prod2.svg" className="card-img-top"/>
                            <div className="card-body"><a href="" className="boldfont body-sub-titles">Engine</a></div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="prod-cats card">
                            <img src="prod3.svg" className="card-img-top"/>
                            <div className="card-body"><a href="" className="boldfont body-sub-titles">Engine</a></div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="prod-cats card">
                            <img src="prod3.svg" className="card-img-top"/>
                            <div className="card-body"><a href="" className="boldfont body-sub-titles">Engine</a></div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="latest-products-wrapper">
                <div className="row mt-5">
                    <div className="col-12 d-flex justify-content-between">
                        <div><span className="popular_categories body-sub-titles regularfont">Latest Products</span>
                        </div>
                        <div>
                            <button type="button" className="saleoffers regularfont body-sub-titles active">All</button>
                            <button type="button" className="saleoffers regularfont body-sub-titles">Audio</button>
                            <button type="button" className="saleoffers regularfont body-sub-titles">Lights</button>
                            <button type="button" className="saleoffers regularfont body-sub-titles">Body Parts</button>
                        </div>
                    </div>
                    <div className="col"></div>
                    <div className="col text-end">
                        <div className="row">
                            <div className="col"></div>
                            <div className="col"></div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="latest-products-second-wrapper">
                <div className="row mt-5 mt-lg-4 mt-xxl-5 g-4">
                    <div className="col-6 col-md-3">
                        <div className="latest-prods card">
                            <img src="cat-prod-1.svg" className="card-img-top"/>
                            <div className="card-body">
                                <div className="row g-1">
                                    <div className="col-12">
                                        <span className="article-number regularfont mini-text">Article #12345668</span>
                                    </div>
                                    <div className="col-12">
                                        <span className="product-name regularfont">Mercedes sprinter achter as</span>
                                    </div>
                                    <div className="col-12">
                                        <span className="ratings">
                                            <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                            <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                            <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                            <i className="fa fa-star placeholderfontsize" aria-hidden="true"></i>
                                        </span>
                                        <span className="rating-count regularfont mini-text-1">675</span>
                                    </div>
                                    <div className="col-12 d-flex justify-content-between">
                                        <span className="product-price">€230</span>
                                        <i className="fa fa-shopping-cart body-sub-titles"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="latest-prods card">
                            <img src="cat-prod-1.svg" className="card-img-top"/>
                            <div className="card-body">
                                <div className="row g-1">
                                    <div className="col-12">
                                        <span className="article-number regularfont mini-text">Article #12345668</span>
                                    </div>
                                    <div className="col-12">
                                        <span className="product-name regularfont">Mercedes sprinter achter as</span>
                                    </div>
                                    <div className="col-12">
                                        <span className="ratings">
                                            <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                            <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                            <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                            <i className="fa fa-star placeholderfontsize" aria-hidden="true"></i>
                                        </span>
                                        <span className="rating-count regularfont mini-text-1">675</span>
                                    </div>
                                    <div className="col-12 d-flex justify-content-between">
                                        <span className="product-price">€230</span>
                                        <i className="fa fa-shopping-cart body-sub-titles"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="latest-prods card">
                            <img src="cat-prod-1.svg" className="card-img-top"/>
                            <div className="card-body">
                                <div className="row g-1">
                                    <div className="col-12">
                                        <span className="article-number regularfont mini-text">Article #12345668</span>
                                    </div>
                                    <div className="col-12">
                                        <span className="product-name regularfont">Mercedes sprinter achter as</span>
                                    </div>
                                    <div className="col-12">
                                        <span className="ratings">
                                            <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                            <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                            <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                            <i className="fa fa-star placeholderfontsize" aria-hidden="true"></i>
                                        </span>
                                        <span className="rating-count regularfont mini-text-1">675</span>
                                    </div>
                                    <div className="col-12 d-flex justify-content-between">
                                        <span className="product-price">€230</span>
                                        <i className="fa fa-shopping-cart body-sub-titles"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="latest-prods card">
                            <img src="cat-prod-1.svg" className="card-img-top"/>
                            <div className="card-body">
                                <div className="row g-1">
                                    <div className="col-12">
                                        <span className="article-number regularfont mini-text">Article #12345668</span>
                                    </div>
                                    <div className="col-12">
                                        <span className="product-name regularfont">Mercedes sprinter achter as</span>
                                    </div>
                                    <div className="col-12">
                                        <span className="ratings">
                                            <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                            <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                            <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                            <i className="fa fa-star placeholderfontsize" aria-hidden="true"></i>
                                        </span>
                                        <span className="rating-count regularfont mini-text-1">675</span>
                                    </div>
                                    <div className="col-12 d-flex justify-content-between">
                                        <span className="product-price">€230</span>
                                        <i className="fa fa-shopping-cart body-sub-titles"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <section className="brands-section">
            <div className="container-fluid">
                <div className="container">
                    <div className="row">
                        
                    </div>
                </div>
            </div>
        </section>
    </div>
    );
}

export default Home;
