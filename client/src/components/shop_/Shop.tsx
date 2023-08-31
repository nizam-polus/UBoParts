// react
import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import { IVehicle } from '~/interfaces/vehicle';
import Image from 'next/image'
import AppImage from '../shared/AppImage';
import Header_home from '../header_/Header_home';
import Footer from '../footer_/Footer';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import APIs from '~/services/apiService';
import { BASE_URL } from 'configuration';
import Link from 'next/dist/client/link';

function Shop() {
    
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
    const [pagination, setPagination] = useState<any>({});
    const [pageRange, setPageRange] = useState<number[]>([]);

    //dummy value for triggering cart count in header
    const [dummy, setDummy] = useState<any>('');

    const router = useRouter();

    const categoriesArray = (resData: any) => {
        return [...new Set(resData.map((item: any) => item.attributes.category_name))];
    }

    useEffect(() => {
        setSelectedMake(localStorage.getItem('make') || '');
        setSelectedModel(localStorage.getItem('model') || '');
        setSelectedYear(localStorage.getItem('year') || '');
        setSelectedCategory(localStorage.getItem('category') || '');
        APIs.getCategories().then((response: any) => {
                setCategories(categoriesArray(response.data.data));
            })
            .catch((error) => {
                setError(error);
            });

        APIs.getCarMake().then((response: any) => {
                setMakesArray(response.data.rows);
            })
            .catch((error) => {
                setError(error);
            });
        getModel(selectedMake);
        getYear(selectedMake, selectedModel);
    }, []);

    useEffect(() => {
        getModel(selectedMake);
        getYear(selectedMake, selectedModel);
    }, [selectedMake]);

    useEffect(() => {
        getYear(selectedMake, selectedModel);
    }, [selectedModel]);

    useEffect(() => {
        if (selectedMake || selectedModel || selectedYear || selectedCategory) {
            setTimeout(() => {
                searchProducts();
            }, 2000);
        }
    }, [selectedMake, selectedModel, selectedYear, selectedCategory]);


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

    const optionsArray = (value: any) => {
        return [...new Set(data.map((item: any) => item.attributes[value]))];
    }

    useEffect(() => {
        setMakesArray(optionsArray('make'));
        setModelArray(optionsArray('model'));
        setYearArray(optionsArray('year'));
    }, [data]);

    const searchProducts = () => {
        const pageRange = (pageCount: number): number[] => {
            let start = 0, range = []
            while (start !== pageCount) {
                range.push(start+1)
                start++
            }
            return range;
        }
        APIs.searchProducts(selectedMake, selectedModel, selectedYear, selectedCategory).then((response: any) => {
            setSearchedProducts(response.data.data);
            let pagination = response.data.meta.pagination
            setPagination(pagination);
            setSearched(true);
            setPageRange(pageRange(pagination.pageCount));
        }).catch((error) => {
            setError(error);
            setLoading(false);
        });
    }

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

    const handleMakeChange = (event: any) => {
        getModel(event.target.value);
        setSelectedMake(event.target.value);
    };

    const toggleAdvancedSearch = () => {
        setToggleSearch(!toggleSearch);
    }

    const handleProductClick = (product: any) => {
        console.log('product', product);
        router.push('/products_/' + product.id);
    }

    const handleAddToCart = (productData: any) => {
        let cartData = {
            customerid: '2',
            productid: productData?.id,
            quantity: '1',
            productprice: productData?.attributes?.price
        }
        APIs.addToCart(cartData).then(response => {
            setDummy('dummy');
            toast.success(() => (
                <>
                    Item successfully added to <Link href={"/cartpage"}>cart</Link>
                </>
            ))
        }).catch(err => {
            toast.error('Something went wrong!')
        })
    }


    return (
        <>
           <div className='page_header'>
                <Header_home />
            </div>

            <div className="main-body pb-5 mb-5">
                <div className="container">
                    <section className="coulmn-bg-color-1 search-wrapper mt-5 mb-5">
                        <div className="row p-4 pt-2 text-center">
                            <div className="col">
                                <p className="semifont inner-page-main-headings custom-color-1 mb-2">Find Parts for Your Vehicle</p>
                                <p className="semifont custom-color-1 boldfontsize">Over hundreds of brands and tens of hundreds of parts</p>
                            </div>
                        </div>
                        <div className="row">
                            <form action="" className="w-100 mx-auto">
                                <div className="row g-4 flex-column flex-lg-row mt-2">
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
                                </div>
                            </form>
                        </div>
                    </section>

                    <section className="categories-wrapper section-inner-padding">
                        <div className="row mt-5">
                            <div className="col-12 d-lg-flex justify-content-between">
                                <div><span className="custom-color-2 mediumfont bg-image-text">Explore</span>
                                </div>
                                {/* <div className="mt-3 mt-lg-0">
                                        <span className="label-color-1 mediumfont select-options m-0 m-lg-3">Sort By: </span>
                                        <select className="coulmn-bg-color-1 p-2 border-0 filter-by-rating rounded regularfont mini-text-2">
                                            <option>Top Rated</option>
                                        </select>
                                    </div> */}
                            </div>
                            <div className="col-12 mt-5">
                                <div className="row g-5">
                                    <div className="col-12 col-sm-3 pb-4 pb-xl-0">
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
                                                        <input type="checkbox" className="form-check-input border-0" id="check1" name="option1" value="something" checked />
                                                        <label className="form-check-label" htmlFor="check1">All</label>
                                                    </div>
                                                    <div className="form-check mb-2">
                                                        <input type="checkbox" className="form-check-input border-0 " id="check2" name="option1" value="something" />
                                                        <label className="form-check-label" htmlFor="check2">Audio</label>
                                                    </div>
                                                    <div className="form-check mb-2">
                                                        <input type="checkbox" className="form-check-input border-0" id="check3" name="option1" value="something" />
                                                        <label className="form-check-label" htmlFor="check3">Lights</label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input type="checkbox" className="form-check-input border-0" id="check4" name="option1" value="something" />
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
                                            {/* <div className="row mb-2 flex-column">
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
                                                </div> */}
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
                                                        <input type="checkbox" className="form-check-input border-0" id="check2" name="option1" value="something" />
                                                        <label className="form-check-label" htmlFor="check2">Audio</label>
                                                    </div>
                                                    <div className="form-check mb-2">
                                                        <input type="checkbox" className="form-check-input border-0" id="check3" name="option1" value="something" />
                                                        <label className="form-check-label" htmlFor="check3">Lights</label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input type="checkbox" className="form-check-input border-0" id="check4" name="option1" value="something" />
                                                        <label className="form-check-label" htmlFor="check4">Body Parts</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="row g-4">
                                            {searchedProducts.map((product: any, index: any) => {
                                                return (
                                                    <div className="col-12 col-sm-6 col-lg-4  mb-4" key={index}>
                                                        <div className="latest-prods card card-shadows">
                                                            <AppImage 
                                                                src={BASE_URL + product?.attributes?.product_image?.data?.attributes?.formats?.medium?.url} 
                                                                className="card-img-top img-prod-height pointer" 
                                                                style={{height: '20rem'}} 
                                                                onClick={() => handleProductClick(product)}    
                                                            />
                                                            <div className="card-body">
                                                                <div className="row g-1">
                                                                    <div className="col-12">
                                                                        <span className="article-number regularfont mini-text">Article #{product?.attributes?.article_number}</span>
                                                                    </div>
                                                                    <div className="col-12">
                                                                        <span className="product-name regularfont"
                                                                            style={{"cursor": "pointer"}} 
                                                                            onClick={() => handleProductClick(product)}
                                                                        >{product?.attributes?.title}</span>
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
                                                                        <AppImage src="images/cart-svg.svg" 
                                                                            className='pointer add_to_cart'
                                                                            onClick={() => handleAddToCart(product)}
                                                                        />
                                                                        {/* <div className="input-group quanitity-box">
                                                                            <span className="input-group-btn plus-icon semifont">
                                                                                <i className="fa fa-plus mini-text-0 mini-text-0-color" aria-hidden="true"></i>
                                                                            </span>
                                                                            <input type="text" name="quant[1]" className="form-control input-number text-center rounded-pill border-0 semifont p-1 mini-text-2 h-auto" value="1" min="1" max="10" />
                                                                            <span className="input-group-btn minus-icon semifont">
                                                                                <i className="fa fa-minus mini-text-0 mini-text-0-color" aria-hidden="true"></i>
                                                                            </span>
                                                                        </div> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className="row mt-5">
                                            <div className="col text-center">
                                                <ul className="pagination d-inline-flex">
                                                    <li className="page-item">
                                                        <a className="page-link border-0 regularfont mini-text-1 custom-color-4" href="#">
                                                    <i className="fa fa-angle-left custom-color-4 mini-text-1 m-1"></i> Previous</a></li>
                                                    {pageRange.map((page: number, idx: number) => {
                                                        return (
                                                            <li className={`page-item ${page === pagination.page ? 'active': ''}`}>
                                                                <a className="page-link border-0 custom-color-3 regularfont mini-text-1" href="#">{page}</a>
                                                            </li>
                                                        )
                                                    })}
                                                    <li className="page-item">
                                                        <a className="page-link border-0 custom-color-3 regularfont mini-text-1"
                                                            href="#"
                                                        >Next <i className="fa fa-angle-right custom-color-3 mini-text-1 m-1"></i></a>
                                                    </li>
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
            <div className="modal fade" id="view-filters" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                                    <input type="checkbox" className="form-check-input border-0" id="check1" name="option1" value="something" checked />
                                                    <label className="form-check-label" htmlFor="check1">All</label>
                                                </div>
                                                <div className="form-check mb-2">
                                                    <input type="checkbox" className="form-check-input border-0" id="check2" name="option1" value="something" />
                                                    <label className="form-check-label" htmlFor="check2">Audio</label>
                                                </div>
                                                <div className="form-check mb-2">
                                                    <input type="checkbox" className="form-check-input border-0" id="check3" name="option1" value="something" />
                                                    <label className="form-check-label" htmlFor="check3">Lights</label>
                                                </div>
                                                <div className="form-check">
                                                    <input type="checkbox" className="form-check-input border-0" id="check4" name="option1" value="something" />
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
                                                    <input type="checkbox" className="form-check-input border-0" id="check1" name="option1" value="something" checked />
                                                    <label className="form-check-label" htmlFor="check1">All</label>
                                                </div>
                                                <div className="form-check mb-2">
                                                    <input type="checkbox" className="form-check-input border-0" id="check2" name="option1" value="something" />
                                                    <label className="form-check-label" htmlFor="check2">Audio</label>
                                                </div>
                                                <div className="form-check mb-2">
                                                    <input type="checkbox" className="form-check-input border-0" id="check3" name="option1" value="something" />
                                                    <label className="form-check-label" htmlFor="check3">Lights</label>
                                                </div>
                                                <div className="form-check">
                                                    <input type="checkbox" className="form-check-input border-0" id="check4" name="option1" value="something" />
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
        </>
    );
}

export default Shop;
