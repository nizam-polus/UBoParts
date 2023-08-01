// react
import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import { IVehicle } from '~/interfaces/vehicle';
import Image from 'next/image'
import Link from 'next/link';
import AppImage from './shared/AppImage';
import axios from 'axios';
import Forgotpass from './forgot/Forgotpass';
import Login from './account/Login';
function Home() {
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

    const [forgotPasswordPickerIsOpen, setforgotPasswordPickerIsOpen] = useState(false);
   
    const showForgotPassword = () => {
        setforgotPasswordPickerIsOpen(true);
    };

    const onForgotPasswordClose = () => {
        setforgotPasswordPickerIsOpen(false);
    };
    
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const showLoginModal = () => {
        setLoginModalIsOpen(true);
    };

   const onLoginModalClose = () => {
        setLoginModalIsOpen(false);
    };
    useEffect(() => {
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

    const categoriesArray = (resData: any) => {
        return [...new Set(resData.map((item: any) => item.attributes.category_name))];
    }

    const optionsArray = (value: any) => {
        return [...new Set(data.map((item: any) => item.attributes[value]))];
    }

    const handleMakeChange = (event: any) => {
        setSearched(false);
        setSelectedMake(event.target.value);
    };

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
           <Forgotpass

                isOpen={forgotPasswordPickerIsOpen}
                onClose={onForgotPasswordClose}

            />
            <Login

                isOpen={loginModalIsOpen}
                onClose={onLoginModalClose}
            />
            <header className="home-header">
                <div className="container">
                    <div className="container-wrapper">
                        <div className="logo">
                            <AppImage src="/images/svg/LOGO.svg" />
                        </div>
                        <div className="bar w-100">
                            <ul>
                                <li className="menu_font_size regularfont"><a href="/homepage">Home</a></li>
                                <li className="menu_font_size regularfont"><a href="/shop">Shop</a></li>
                                <li className="menu_font_size regularfont"><a href="">About us</a></li>
                                <li className="menu_font_size regularfont"><a href="">Request</a></li>
                                <li className="menu_font_size regularfont"><a href="">Dismantle Car</a></li>
                                <li className="menu_font_size regularfont"><button type="button" onClick={showLoginModal} className="ub_login">Login</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
            <div className="main-body">
                <div className="container">
                    <section className="section-search-wrapper">
                        <form action="" className="search-wrapper">
                            <div className="row g-5 flex-column flex-lg-row">
                                <div className="col">
                                    <div className="row g-2 flex-column flex-lg-row">
                                        <div className="col">
                                            <div className="form-group">
                                                <input type="form-control" onChange={handleLicenseplateChange} name="plate_number" className="semifont placeholderfontsize" placeholder="Search with Car's Plate Number" />
                                            </div>
                                        </div>
                                        <div className="col-auto or_block"><span className="or_label semifont placeholderfontsize field3">or</span></div>
                                        <div className="col">
                                            <div className="form-group">
                                                <input type="form-control" name="article_number" className="semifont placeholderfontsize" placeholder="Search with product Article" />
                                            </div>
                                        </div>
                                    </div>
                                    {toggleSearch &&<div className="row g-4 flex-column flex-lg-row mt-2">
                                        <div className="col">
                                            <div className="form-group">
                                                <select className="form-select semifont placeholderfontsize" name="make" id="makeOption"
                                                    value={selectedMake} onChange={handleMakeChange}>
                                                    <option value="" disabled={true}>Select Make</option>
                                                    {makesArray.map((make: any, index: any) => (
                                                        <option key={index} value={make}>{make}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <select className="form-select semifont placeholderfontsize" name="model" id="modelOption"
                                                    value={selectedModel} onChange={handleModelChange}>
                                                    <option value="" disabled={true}>Select Model</option>
                                                    {modelArray.map((model: any, index: any) => (
                                                        <option key={index} value={model}>{model}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <select className="form-select semifont placeholderfontsize" name="year" id="yearOption"
                                                    value={selectedYear} onChange={handleYearChange}>
                                                    <option value="" disabled={true}>Select Year</option>
                                                    {yearArray.map((year: any, index: any) => (
                                                        <option key={index} value={year}>{year}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <select className="form-select semifont placeholderfontsize" name="category" id="categoryOption"
                                                    value={selectedCategory} onChange={handleCategoryChange}>
                                                    <option value="" disabled={true}>Select Category</option>
                                                    {categories.map((category: any, index: any) => (
                                                        <option key={index} value={category}>{category}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>}
                                </div>
                                <div className="col-12 col-lg-3 d-flex align-items-end mb-3">
                                    <button type="button" onClick={searchProducts} className="search boldfont boldfontsize">Search</button>
                                </div>
                            </div>
                            <div className="row mt-2" >
                                <span onClick={toggleAdvancedSearch} style={{cursor: 'pointer'}} className="advanced_search placeholderfontsize regularfont">{toggleSearch ? 'Show less' :'Advanced Search'}</span>
                            </div>
                        </form>
                    </section>
                    <section className="latest-products-second-wrapper mt-5 mb-5">
                    {searched && <span className="popular_categories body-sub-titles regularfont">
                            All {selectedMake} Products</span>}
                        <div className="row mt-5 mt-lg-4 mt-xxl-5 g-4">
                        {searchedProducts.map((product: any, index: any) => {
                            return (
                            <div className="col-6 col-md-3" key={index}>
                                <div className="latest-prods card">
                                    <Link href={`/products_/${product?.id}`}>
                                    <AppImage src={'http://192.168.1.31:1337'+ product?.attributes?.product_image?.data?.attributes?.formats?.medium?.url} className="card-img-top" />
                                    <div className="card-body">
                                        <div className="row g-1">
                                            <div className="col-12">
                                                <span className="article-number regularfont mini-text">Article #{product?.attributes?.article_number}</span>
                                            </div>
                                            <div className="col-12">
                                                <span className="product-name regularfont">{product?.attributes?.title}</span>
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
                                                <span className="product-price">€{product?.attributes?.price}</span>
                                                <i className="fa fa-shopping-cart body-sub-titles"></i>
                                            </div>
                                        </div>
                                    </div>
                                    </Link>
                                </div>
                            </div>)})}
                        </div>
                    </section>
                    <section className="cards-wrapper">
                        <div className="row mt-3 g-4">
                            <div className="col">
                                <div className="specific_part">
                                    <h3 className="text-white bg-image-text semifont m-0 selling-text">Need A <br />Specific Part?</h3>
                                </div>
                            </div>
                            <div className="col">
                                <div className="start_selling">
                                    <h3 className="text-white bg-image-text semifont m-0 selling-text">Start Selling <br />With Us</h3>
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
                                    <AppImage src="/images/svg/prod1.svg" className="card-img-top" />
                                    <div className="card-body"><a href="" className="boldfont body-sub-titles">Engine</a></div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="prod-cats card">
                                    <AppImage src="/images/svg/prod2.svg" className="card-img-top" />
                                    <div className="card-body"><a href="" className="boldfont body-sub-titles">Engine</a></div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="prod-cats card">
                                    <AppImage src="/images/svg/prod2.svg" className="card-img-top" />
                                    <div className="card-body"><a href="" className="boldfont body-sub-titles">Engine</a></div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="prod-cats card">
                                    <AppImage src="/images/svg/prod3.svg" className="card-img-top" />
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
                                    <AppImage src="/images/svg/cat-prod-1.svg" className="card-img-top" />
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
                                    <AppImage src="/images/svg/cat-prod-1.svg" className="card-img-top" />
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
                                    <AppImage src="/images/svg/cat-prod-1.svg" className="card-img-top" />
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
                                    <AppImage src="/images/svg/cat-prod-1.svg" className="card-img-top" />
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
        </>
    );
}

export default Home;
