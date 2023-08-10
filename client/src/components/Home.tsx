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
import Header_home from './header_/Header_home'
function Home() {
    const token = '8c8e5c1a7170f4c17b38cd6f13fac42026d6b359d341e39faf6356621134a52cc6ee233f4e151c7c888b95c13674fef01232525470e727c96d9bd0ce7bbf0793f97938a6a3329c1d73cda53b5b874f307e62c76eb8b26db4180b71ef66651511d92901f23d15759c4b0880c9640735e7f400bfe494a16c2294ec283b2a255d7c'
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
        axios.get('http://10.199.100.156:1337/api/cardetails?populate=*&pagination[page]=1&pagination[pageSize]=1000&sort[0]=licenseplate:asc', { headers })
            .then((response: any) => {
                setData(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });

        axios.get('http://10.199.100.156:1337/api/categories?populate=*&sort[0]=id:asc', { headers })
            .then((response: any) => {
                setCategories(categoriesArray(response.data.data));
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });

        axios.get('http://10.199.100.156:1337/api/cardetail-make', { headers })
        .then((response: any) => {
            setMakesArray(response.data.rows);
            setLoading(false);
        })
        .catch((error) => {
            setError(error);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        //setMakesArray(optionsArray('make'));
        //setModelArray(optionsArray('model'));
        //setYearArray(optionsArray('year'));
    }, [data]);

    const searchProducts = () => {
        axios.get(`http://10.199.100.156:1337/api/products?populate=*&filters[$and][][cardetail][licenseplate][$contains]=${licenseplate}&filters[$and][][cardetail][make][$contains]=${selectedMake}&filters[$and][][cardetail][model][$contains]=${selectedModel}&filters[$and][][category][category_name][$contains]=${selectedCategory}`, { headers })
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

    const getModel = (make: string) => {
        const setHeaders = {'param_make': make}
        axios.post(`http://10.199.100.156:1337/api/cardetailmodel`, {...setHeaders}, { headers })
        .then((response: any) => {
            setModelArray(response.data.rows);
            if (response.data.rows && response.data.rows.length) {
                // setSelectedModel(response.data.rows[0].model);
                // getYear(response.data.rows[0].model);
            }
        })
        .catch((error) => {
            setError(error);
            setLoading(false);
        });
    }

    const getYear = (model: string) => {
        const setHeaders = {'param_make': selectedMake, 'param_model': model}
        axios.post(`http://10.199.100.156:1337/api/cardetailyear`, {...setHeaders}, { headers })
        .then((response: any) => {
            setYearArray(response.data.rows);
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
        setSelectedModel('');
        setSelectedYear('');
        setSelectedCategory('');
        getModel(event.target.value);
    };

    const handleLicenseplateChange = (event: any) => {
        setSearched(false);
        setLicenseplate(event.target.value);
    };

    const handleModelChange = (event: any) => {
        setSearched(false);
        setSelectedModel(event.target.value);
        setSelectedYear('');
        setSelectedCategory('');
        getYear(event.target.value);
    };

    const handleYearChange = (event: any) => {
        setSelectedYear(event.target.value);
        setSelectedCategory('');
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
            
            <div className="home-header">
                <Header_home />
            </div>   
            <div className="main-body pb-5 mb-5">
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
                                                        <option key={index} value={make.make}>{make.make}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <select disabled={!selectedMake} className="form-select semifont placeholderfontsize" name="model" id="modelOption"
                                                    value={selectedModel} onChange={handleModelChange}>
                                                    <option value="" disabled={true}>Select Model</option>
                                                    {modelArray.map((model: any, index: any) => (
                                                        <option key={index} value={model.model}>{model.model}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <select disabled={!selectedModel || (yearArray && yearArray.length && !yearArray[0].year)} className="form-select semifont placeholderfontsize" name="year" id="yearOption"
                                                    value={selectedYear} onChange={handleYearChange}>
                                                    <option value="" disabled={true}>Select Year</option>
                                                    {yearArray.map((year: any, index: any) => (
                                                        <option key={index} value={year.year}>{year.year}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <select disabled={!selectedYear} className="form-select semifont placeholderfontsize" name="category" id="categoryOption"
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
                                    <AppImage src={'http://10.199.100.156:1337'+ product?.attributes?.product_image?.data?.attributes?.formats?.medium?.url} className="card-img-top" />
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
