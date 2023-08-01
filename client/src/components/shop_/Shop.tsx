// react
import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import { IVehicle } from '~/interfaces/vehicle';
import Image from 'next/image'
import AppImage from '../shared/AppImage';
import axios from 'axios';
import Header from '../header_/Header_af_log';
import Footer from '../footer_/Footer';

function Shop() {
    const token = 'ae148a3a68f6a84f75c1e5aa247c5bdebc52f5d7783b208baccde7167ed24dc3e63c9d37bcf4d112c3c875a4afdc5643ab6f87622dcd7e6fcddcc66650cdc8e8aa33131f32691eb5c6fee2f1082ad33603a9c9cdf9ff14d321e85ceba547c31c0e56703958405f8137d6abf7b763119767bb208f72624181fb0c8be5378edccb'
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [makesArray, setMakesArray] = useState<any>([]);
    const [modelArray, setModelArray] = useState<any>([]);
    const [yearArray, setYearArray] = useState<any>([]);
    const [categories, setCategories] = useState<any>([]);
    const [selectedMake, setSelectedMake] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [toggleSearch, setToggleSearch] = useState(false);
    const [licenseplate, setLicenseplate] = useState('');
    const [searchedProducts, setSearchedProducts] = useState<any>([]);
    const [searched, setSearched] = useState(false);
   
    /*useEffect(() => {
        // Axios get method to fetch data
        axios.get('http://192.168.1.31:1337/api/cardetails?populate=*&pagination[page]=1&pagination[pageSize]=1000&sort[0]=licenseplate:asc', { headers })
            .then((response: any) => {
                setData(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });

        axios.get('http://192.168.1.31:1337/api/categories?populate=*&sort[0]=id:asc', { headers })
            .then((response: any) => {
                setCategories(categoriesArray(response.data.data));
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        setMakesArray(optionsArray('make'));
        setModelArray(optionsArray('model'));
        setYearArray(optionsArray('year'));
    }, [data]);

    const searchProducts = () => {
        axios.get(`http://192.168.1.31:1337/api/products?populate=*&filters[$and][][cardetail][licenseplate][$contains]=${licenseplate}&filters[$and][][cardetail][make][$contains]=${selectedMake}&filters[$and][][cardetail][model][$contains]=${selectedModel}&filters[$and][][category][category_name][$contains]=${selectedCategory}`, { headers })
        .then((response: any) => {
            setSearchedProducts(response.data.data);
            setSearched(true);
            if (licenseplate) {
                setSelectedMake(response.data.data[0].attributes.cardetail.data.attributes.make);
                setSelectedModel(response.data.data[0].attributes.cardetail.data.attributes.model);
                setSelectedYear(response.data.data[0].attributes.cardetail.data.attributes.year);
            }
        })
        .catch((error) => {
            setError(error);
            setLoading(false);
        });
    }
*/
    /*const categoriesArray = (resData: any) => {
        return [...new Set(resData.map((item: any) => item.attributes.category_name))];
    }

    const optionsArray = (value: any) => {
        return [...new Set(data.map((item: any) => item.attributes[value]))];
    }

    const handleMakeChange = (event: any) => {
        setSearched(false);
        setSelectedMake(event.target.value);
    };*/

    const handleLicenseplateChange = (event: any) => {
        setSearched(false);
        setLicenseplate(event.target.value);
    };

    const handleModelChange = (event: any) => {
        setSearched(false);
        setSelectedModel(event.target.value);
    };

    const handleYearChange = (event: any) => {
        setSelectedYear(event.target.value);
    };

    const handleCategoryChange = (event: any) => {
        setSelectedCategory(event.target.value);
    };

    const toggleAdvancedSearch = () => {
        setToggleSearch(!toggleSearch);
    }


    return (
        <>
            <Header />
            
                <div className="main-body pb-5 mb-5">
                    <div className="container">
                        <section className="coulmn-bg-color-1 search-wrapper mt-5 mb-5">
                            <div className="row p-4 pt-2 text-center">
                                <div className="col">
                                    <p className="semifont inner-page-main-headings custom-color-1 mb-2">Find Parts htmlFor Your Vehicle</p>
                                    <p className="semifont custom-color-1 boldfontsize">Over hundreds of brands and tens of hundreds of parts</p>
                                </div>
                            </div>
                            <div className="row">
                                <form action="" className="w-100 mx-auto">
                                    <div className="row g-4 flex-column flex-lg-row w-100 mx-auto">
                                        <div className="col">
                                            <div className="row g-4 flex-column flex-lg-row">
                                                <div className="col">
                                                    <div className="htmlForm-group">
                                                        <select className="htmlForm-select semifont select-options semifont placeholderfontsize" name="make">
                                                            <option>Select Make</option>
                                                            <option value="1">Select Make</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="htmlForm-group">
                                                        <select className="htmlForm-select semifont select-options semifont placeholderfontsize" name="model">
                                                            <option>Select Model</option>
                                                            <option value="1">Select Make</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="htmlForm-group">
                                                        <select className="htmlForm-select semifont select-options semifont placeholderfontsize" name="year">
                                                            <option>Select Year</option>
                                                            <option value="1">Select Make</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="htmlForm-group">
                                                        <select className="htmlForm-select semifont select-options semifont placeholderfontsize" name="category">
                                                            <option>Select Category</option>
                                                            <option value="1">Select Make</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-lg-3 d-flex align-items-end">
                                            <button type="submit" className="search boldfont mini-text-2">Search</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </section>
                       
                        <section className="categories-wrapper section-inner-padding">
                            <div className="row mt-5">
                                <div className="col-12 d-lg-flex justify-content-between">
                                    <div><span className="custom-color-2 mediumfont bg-image-text">Explore</span>
                                    </div>
                                    <div className="mt-3 mt-lg-0">
                                        <span className="label-color-1 mediumfont select-options m-0 m-lg-3">Sort By: </span>
                                        <select className="coulmn-bg-color-1 p-2 border-0 filter-by-rating rounded regularfont mini-text-2">
                                            <option>Top Rated</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12 mt-5">
                                    <div className="row g-5">
                                        <div className="col-12 col-sm-3">
                                            <div className="responsive-filter">
                                                <button type="button" className="boldfont boldfontsize button-bg-color-1 border-0 text-white p-2 rounded" data-bs-toggle="modal" data-bs-target="#view-filters">View Filter</button>
                                            </div>
                                            <div className="desktop-filter">
                                                <div className="row mb-2 flex-column">
                                                    <button className="btn coulmn-bg-color-1 border-0 text-start justify-content-between d-flex align-items-center regularfont mini-text-2">
                                                        <span>Categories</span><i className="fa fa-angle-up"></i>
                                                    </button>
                                                    <div className="group-check p-3">
                                                        <div className="form-check mb-2">
                                                            <input type="checkbox" className="form-check-input border-0" id="check1" name="option1" value="something" checked/>
                                                            <label className="form-check-label" htmlFor="check1">All</label>
                                                        </div>
                                                        <div className="form-check mb-2">
                                                            <input type="checkbox" className="form-check-input border-0 " id="check2" name="option1" value="something"/>
                                                            <label className="form-check-label" htmlFor="check2">Audio</label>
                                                        </div>
                                                        <div className="form-check mb-2">
                                                            <input type="checkbox" className="form-check-input border-0" id="check3" name="option1" value="something"/>
                                                            <label className="form-check-label" htmlFor="check3">Lights</label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input type="checkbox" className="form-check-input border-0" id="check4" name="option1" value="something"/>
                                                            <label className="form-check-label" htmlFor="check4">Body Parts</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mb-2 flex-column">
                                                    <button className="btn coulmn-bg-color-1 border-0 text-start justify-content-between d-flex align-items-center regularfont mini-text-2">
                                                        <span>Price</span><i className="fa fa-angle-up"></i>
                                                    </button>
                                                    <div className="group-check p-3">
                                                      
                                                    </div>
                                                </div>
                                                <div className="row mb-2 flex-column">
                                                    <button className="btn coulmn-bg-color-1 border-0 text-start justify-content-between d-flex align-items-center regularfont mini-text-2">
                                                        <span>Ratings</span><i className="fa fa-angle-up"></i>
                                                    </button>
                                                    <div className="group-check p-3">
                                                        <div className="mb-2">
                                                            <span className="ratings">
                                                                <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                                <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                                <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                                <i className="fa fa-star placeholderfontsize" aria-hidden="true"></i>
                                                            </span>
                                                            <span className="rating-count regularfont mini-text-1">& up</span>
                                                        </div>
                                                        <div className="mb-2">
                                                            <span className="ratings">
                                                                <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                                <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                                <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                                <i className="fa fa-star placeholderfontsize" aria-hidden="true"></i>
                                                            </span>
                                                            <span className="rating-count regularfont mini-text-1">& up</span>
                                                        </div>
                                                        <div className="mb-2">
                                                            <span className="ratings">
                                                                <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                                <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                                <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                                <i className="fa fa-star placeholderfontsize" aria-hidden="true"></i>
                                                            </span>
                                                            <span className="rating-count regularfont mini-text-1">& up</span>
                                                        </div>
                                                        <div>
                                                            <span className="ratings">
                                                                <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                                <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                                <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                                <i className="fa fa-star placeholderfontsize" aria-hidden="true"></i>
                                                            </span>
                                                            <span className="rating-count regularfont mini-text-1">& up</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mb-2 flex-column">
                                                    <button className="btn coulmn-bg-color-1 border-0 text-start justify-content-between d-flex align-items-center regularfont mini-text-2">
                                                        <span>Brands</span><i className="fa fa-angle-up"></i>
                                                    </button>
                                                    <div className="group-check p-3">
                                                        <div className="form-check mb-2">
                                                            <input type="checkbox" className="form-check-input border-0" id="check1" name="option1" value="something" checked />
                                                            <label className="form-check-label" htmlFor="check1">All</label>
                                                        </div>
                                                        <div className="form-check mb-2">
                                                            <input type="checkbox" className="form-check-input border-0" id="check2" name="option1" value="something"/>
                                                            <label className="form-check-label" htmlFor="check2">Audio</label>
                                                        </div>
                                                        <div className="form-check mb-2">
                                                            <input type="checkbox" className="form-check-input border-0" id="check3" name="option1" value="something"/>
                                                            <label className="form-check-label" htmlFor="check3">Lights</label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input type="checkbox" className="form-check-input border-0" id="check4" name="option1" value="something"/>
                                                            <label className="form-check-label" htmlFor="check4">Body Parts</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="row g-4">
                                                <div className="col-12 col-sm-6 col-lg-4">
                                                    <div className="latest-prods card card-shadows">
                                                       <AppImage src="images/cat-prod-1.svg" className="card-img-top"/>
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
                                                                    <div className="input-group quanitity-box">
                                                                        <span className="input-group-btn plus-icon semifont">
                                                                            <i className="fa fa-plus mini-text-2" aria-hidden="true"></i>
                                                                        </span>
                                                                        <input type="text" name="quant[1]" className="htmlForm-control input-number text-center rounded-pill border-0 semifont p-1 mini-text-2 h-auto" value="1" min="1" max="10"/>
                                                                        <span className="input-group-btn minus-icon semifont">
                                                                            <i className="fa fa-minus mini-text-2" aria-hidden="true"></i>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-4">
                                                    <div className="latest-prods card card-shadows">
                                                       <AppImage src="images/cat-prod-1.svg" className="card-img-top"/>
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
                                                                   <AppImage src="images/cart-svg.svg"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-4">
                                                    <div className="latest-prods card card-shadows">
                                                       <AppImage src="images/cat-prod-1.svg" className="card-img-top"/>
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
                                                                   <AppImage src="images/cart-svg.svg"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-4">
                                                    <div className="latest-prods card card-shadows">
                                                       <AppImage src="images/cat-prod-1.svg" className="card-img-top"/>
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
                                                                   <AppImage src="images/cart-svg.svg"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-4">
                                                    <div className="latest-prods card card-shadows">
                                                       <AppImage src="images/cat-prod-1.svg" className="card-img-top"/>
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
                                                                   <AppImage src="images/cart-svg.svg"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-4">
                                                    <div className="latest-prods card card-shadows">
                                                       <AppImage src="images/cat-prod-1.svg" className="card-img-top"/>
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
                                                                   <AppImage src="images/cart-svg.svg"/>
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
                                </div>
                            </div>
                            <div className="row mt-5">
                                <div className="col">

                                </div>
                                <div className="col">
                                    
                                </div>
                            </div>
                        </section>
                     
                    </div>
                </div>
                <div className="modal fade" id="view-filters"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header border-0">
                        <button type="button" className="close border-0 semifont heading_text" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div className="modal-body">
                        <div className="card border-0">
                            <div className="card-body">
                                <h3 className="card-title text-center heading_text semifont">Filters</h3>
                                <div className="responsive-filter p-4">
                                    <div className="row mb-2">
                                        <button className="btn coulmn-bg-color-1 border-0 text-start justify-content-between d-flex align-items-center">
                                            <span>Categories</span><i className="fa fa-angle-up"></i>
                                        </button>
                                        <div className="group-check p-3">
                                            <div className="form-check mb-2">
                                                <input type="checkbox" className="form-check-input border-0" id="check1" name="option1" value="something" checked/>
                                                <label className="form-check-label" htmlFor="check1">All</label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input type="checkbox" className="form-check-input border-0" id="check2" name="option1" value="something"/>
                                                <label className="form-check-label" htmlFor="check2">Audio</label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input type="checkbox" className="form-check-input border-0" id="check3" name="option1" value="something"/>
                                                <label className="form-check-label" htmlFor="check3">Lights</label>
                                            </div>
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input border-0" id="check4" name="option1" value="something"/>
                                                <label className="form-check-label" htmlFor="check4">Body Parts</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <button className="btn coulmn-bg-color-1 border-0 text-start justify-content-between d-flex align-items-center">
                                            <span>Price</span><i className="fa fa-angle-up"></i>
                                        </button>
                                        <div className="group-check p-3">
                                         
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <button className="btn coulmn-bg-color-1 border-0 text-start justify-content-between d-flex align-items-center">
                                            <span>Ratings</span><i className="fa fa-angle-up"></i>
                                        </button>
                                        <div className="group-check p-3">
                                            <div className="mb-2">
                                                <span className="ratings">
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star placeholderfontsize" aria-hidden="true"></i>
                                                </span>
                                                <span className="rating-count regularfont mini-text-1">& up</span>
                                            </div>
                                            <div className="mb-2">
                                                <span className="ratings">
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star placeholderfontsize" aria-hidden="true"></i>
                                                </span>
                                                <span className="rating-count regularfont mini-text-1">& up</span>
                                            </div>
                                            <div className="mb-2">
                                                <span className="ratings">
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star placeholderfontsize" aria-hidden="true"></i>
                                                </span>
                                                <span className="rating-count regularfont mini-text-1">& up</span>
                                            </div>
                                            <div>
                                                <span className="ratings">
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star placeholderfontsize" aria-hidden="true"></i>
                                                </span>
                                                <span className="rating-count regularfont mini-text-1">& up</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <button className="btn coulmn-bg-color-1 border-0 text-start justify-content-between d-flex align-items-center">
                                            <span>Brands</span><i className="fa fa-angle-up"></i>
                                        </button>
                                        <div className="group-check p-3">
                                            <div className="form-check mb-2">
                                                <input type="checkbox" className="form-check-input border-0" id="check1" name="option1" value="something" checked/>
                                                <label className="form-check-label" htmlFor="check1">All</label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input type="checkbox" className="form-check-input border-0" id="check2" name="option1" value="something"/>
                                                <label className="form-check-label" htmlFor="check2">Audio</label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input type="checkbox" className="form-check-input border-0" id="check3" name="option1" value="something"/>
                                                <label className="form-check-label" htmlFor="check3">Lights</label>
                                            </div>
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input border-0" id="check4" name="option1" value="something"/>
                                                <label className="form-check-label" htmlFor="check4">Body Parts</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <button type="submit" className="boldfont text-white button-bg-color-1 boldfontsize border-0">Filter</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div className="modal-footer" >
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Shop;
