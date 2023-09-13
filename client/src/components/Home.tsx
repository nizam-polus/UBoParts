// react
import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import { IVehicle } from '~/interfaces/vehicle';
import Image from 'next/image'
import Link from 'next/link';
import AppImage from './shared/AppImage';
import axios from 'axios';
import Forgotpass from './forgot/Forgotpass';
import Login from './account_/Login';
import { useRouter } from 'next/router';
import APIs from '../services/apiService';
import { BASE_URL } from 'configuration';

function Home() {
    const router = useRouter();
    
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
    const [showInvaidLicense, setShowInvaidLicense] = useState(false);

    const [forgotPasswordPickerIsOpen, setforgotPasswordPickerIsOpen] = useState(false);

    useEffect(() => {
        if (licenseplate && licenseplate.length > 5) {
            const getData = setTimeout(() => {
                APIs.getCarDetailsUsingLicence(licenseplate).then((response: any) => {
                    if (response.data.licenseplate) {
                        // get make
                        let makesobjarray = makesArray;
                        let makesarray = makesobjarray.map((item: any) => item.make) 
                        !makesarray.includes(response.data.make) && makesobjarray.push({make: response.data.make})
                        setMakesArray(makesobjarray);
                        setSelectedMake(response.data.make);
                        // get model
                        getModel(response.data.make);
                        let modelsobjarray = modelArray;
                        let modelsarray = modelsobjarray.map((item: any) => item.model);
                        !modelsarray.includes(response.data.model) && modelsobjarray.push({model: response.data.model});
                        setModelArray(modelsobjarray)
                        setSelectedModel(response.data.model);
                        //get year
                        getYear(response.data.make, response.data.model);
                        let yearsobjarray = yearArray;
                        let yearsarray = yearsobjarray.map((item: any) => item.year);
                        !yearsarray.includes(response.data.year) && yearsobjarray.push({year: response.data.year});
                        setYearArray(yearsobjarray);
                        setSelectedYear(response.data.year);

                        setToggleSearch(true);
                        setShowInvaidLicense(false);
                    } else {
                        setShowInvaidLicense(true);
                        setSelectedMake('');
                        setSelectedModel('');
                        setSelectedYear('');
                        setSelectedCategory('')
                    }
                });
            }, 1000);
            return () => clearTimeout(getData);
        }
    }, [licenseplate]);

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
        APIs.getCarDetails().then((response: any) => {
                setData(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });

        APIs.getCategories().then((response: any) => {
                setCategories(categoriesArray(response.data.data));
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });

        APIs.getCarMake().then((response: any) => {
                setMakesArray(response.data.rows);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const searchProducts = () => {
        // const filterSearch = 'filters[$and][][cardetail][make][$contains]=';
        // const [selectedMake, selectedModel, ]
        // let c = [selectedMake, selectedModel];
        // let fil = '&filters[$and][][cardetail][make][$contains]=';
        // const a = [
        //     "&filters[$and][][cardetail][make][$contains]=MERCEDES-BENZ",
        //     "&filters[$and][][cardetail][make][$contains]=B 180"
        //   ];
        // const modifiedArray = a.map(item => {
        //     const withoutQuotes = item.replace(/"/g, '');
        //     const withoutCommas = withoutQuotes.replace(/,/g, '');
        //     const withoutBrackets = withoutCommas.replace(/\[|\]/g, '');
        //     return withoutBrackets;
        // });
        //   const outputString = modifiedArray.join('');
        //   console.log(outputString);
        // c.forEach((item, key) => { 
        //     c[key] = fil+item
        // });
        // console.log(JSON.stringify(c));
        localStorage.setItem('make',selectedMake);
        localStorage.setItem('model',selectedModel);
        localStorage.setItem('year',selectedYear);
        localStorage.setItem('category',selectedCategory);
        // axios.get(`http://52.6.187.235:1337/api/products?populate=*&filters[$and][][cardetail][make][$contains]=${selectedMake}&filters[$and][][cardetail][model][$contains]=${selectedModel}&filters[$and][][cardetail][year][$eq]=${selectedYear}&filters[$and][][category][category_name][$contains]=${selectedCategory}`, { headers })
        //     .then((response: any) => {
        //         console.log('response :>> ', response.data.data);
        //         setSearchedProducts(response.data.data);
        //         setSearched(true);
        //     })
        //     .catch((error) => {
        //         setError(error);
        //         setLoading(false);
        //     });
            router.push('/shop')
    }

    const getModel = (make: string) => {
        const setData = { 'param_make': make }
        APIs.getCarModel(setData).then((response: any) => {
                setModelArray(response.data.rows);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }

    const getYear = (make: string, model: string) => {
        const setData = { 'param_make': make, 'param_model': model }
        APIs.getCarYear(setData).then((response: any) => {
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
        getModel(event.target.value);
        setSelectedMake(event.target.value);
    };

    const handleLicenseplateChange = (event: any) => {
        setSearched(false);
        setLicenseplate(event.target.value.toUpperCase());
    };

    const handleModelChange = (event: any) => {
        setSearched(false);
        setSelectedModel(event.target.value);
        setSelectedYear('');
        setSelectedCategory('');
        getYear(selectedModel, event.target.value);
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
                                                {showInvaidLicense &&
                                                    <div className="row mt-2 ml-2" >
                                                        <span className="advanced_search placeholderfontsize regularfont">No Record Found Against this Plate Number!</span>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="col-auto or_block"><span className="or_label semifont placeholderfontsize field3">or</span></div>
                                        <div className="col">
                                            <div className="form-group">
                                                <input type="form-control" name="article_number" className="semifont placeholderfontsize" placeholder="Search with product Article" />
                                            </div>
                                        </div>
                                    </div>
                                    {toggleSearch && <div className="row g-4 flex-column flex-lg-row mt-2">
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
                                {/* <Link href={`/shop`}> */}
                                    <button type="button" onClick={searchProducts} className="search boldfont boldfontsize" disabled={showInvaidLicense}>Search</button>
                                {/* </Link> */}
                                </div>
                            </div>
                            <div className="row mt-2 ml-2" >
                                <span onClick={toggleAdvancedSearch} style={{ cursor: 'pointer' }} className="advanced_search placeholderfontsize regularfont">{toggleSearch ? 'Show less' : 'Advanced Search'}</span>
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
                                            <Link href={`/products_/${product?.id}`}>
                                        <div className="latest-prods card">
                                                <AppImage src={BASE_URL + product?.attributes?.product_image?.data?.attributes?.formats?.medium?.url} className="card-img-top" />
                                                <div className="card-body">
                                                    <div className="row g-1">
                                                        <div className="col-12">
                                                            <span className="article-number regularfont mini-text">Article #{product?.attributes?.article_number}</span>
                                                        </div>
                                                        <div className="col-12">
                                                            <span className="product-name regularfont">{product?.attributes?.title}</span>
                                                        </div>
                                                        {/* <div className="col-12">
                                                            <span className="ratings">
                                                                <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                                <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                                <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                                <i className="fa fa-star placeholderfontsize" aria-hidden="true"></i>
                                                            </span>
                                                            <span className="rating-count regularfont mini-text-1">675</span>
                                                        </div> */}
                                                        <div className="col-12 d-flex justify-content-between">
                                                            <span className="product-price">€{product?.attributes?.price}</span>
                                                            <i className="fa fa-shopping-cart body-sub-titles"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                        </div>
                                            </Link>
                                    </div>)
                            })}
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
                                    <AppImage src="/images/prod1.svg" className="card-img-top" />
                                    <div className="card-body"><a href="" className="boldfont body-sub-titles">Engine</a></div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="prod-cats card">
                                    <AppImage src="/images/prod2.svg" className="card-img-top" />
                                    <div className="card-body"><a href="" className="boldfont body-sub-titles">Engine</a></div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="prod-cats card">
                                    <AppImage src="/images/prod2.svg" className="card-img-top" />
                                    <div className="card-body"><a href="" className="boldfont body-sub-titles">Engine</a></div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="prod-cats card">
                                    <AppImage src="/images/prod3.svg" className="card-img-top" />
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
                                    <AppImage src="/images/cat-prod-1.svg" className="card-img-top" />
                                    <div className="card-body">
                                        <div className="row g-1">
                                            <div className="col-12">
                                                <span className="article-number regularfont mini-text">Article #12345668</span>
                                            </div>
                                            <div className="col-12">
                                                <span className="product-name regularfont">Mercedes sprinter achter as</span>
                                            </div>
                                            {/* <div className="col-12">
                                                <span className="ratings">
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star placeholderfontsize" aria-hidden="true"></i>
                                                </span>
                                                <span className="rating-count regularfont mini-text-1">675</span>
                                            </div> */}
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
                                    <AppImage src="/images/cat-prod-1.svg" className="card-img-top" />
                                    <div className="card-body">
                                        <div className="row g-1">
                                            <div className="col-12">
                                                <span className="article-number regularfont mini-text">Article #12345668</span>
                                            </div>
                                            <div className="col-12">
                                                <span className="product-name regularfont">Mercedes sprinter achter as</span>
                                            </div>
                                            {/* <div className="col-12">
                                                <span className="ratings">
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star placeholderfontsize" aria-hidden="true"></i>
                                                </span>
                                                <span className="rating-count regularfont mini-text-1">675</span>
                                            </div> */}
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
                                    <AppImage src="/images/cat-prod-1.svg" className="card-img-top" />
                                    <div className="card-body">
                                        <div className="row g-1">
                                            <div className="col-12">
                                                <span className="article-number regularfont mini-text">Article #12345668</span>
                                            </div>
                                            <div className="col-12">
                                                <span className="product-name regularfont">Mercedes sprinter achter as</span>
                                            </div>
                                            {/* <div className="col-12">
                                                <span className="ratings">
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star placeholderfontsize" aria-hidden="true"></i>
                                                </span>
                                                <span className="rating-count regularfont mini-text-1">675</span>
                                            </div> */}
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
                                    <AppImage src="/images/cat-prod-1.svg" className="card-img-top" />
                                    <div className="card-body">
                                        <div className="row g-1">
                                            <div className="col-12">
                                                <span className="article-number regularfont mini-text">Article #12345668</span>
                                            </div>
                                            <div className="col-12">
                                                <span className="product-name regularfont">Mercedes sprinter achter as</span>
                                            </div>
                                            {/* <div className="col-12">
                                                <span className="ratings">
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                                    <i className="fa fa-star placeholderfontsize" aria-hidden="true"></i>
                                                </span>
                                                <span className="rating-count regularfont mini-text-1">675</span>
                                            </div> */}
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
