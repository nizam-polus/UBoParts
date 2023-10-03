// react
import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import { IVehicle } from '~/interfaces/vehicle';
import Image from 'next/image'
import AppImage from '../shared/AppImage';
import Footer from '../footer_/Footer';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import APIs from '~/services/apiService';
import { BASE_URL } from 'configuration';
import Link from 'next/dist/client/link';
import { UserContext } from '../account_/UserContext';
import Login from '../account_/Login';

function Shop() {
    
    const {user, saveUser, setCartCount} = UserContext();
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
    const [filterToggle, setFiltertoggle] = useState({
        categories: false,
        price: false
    })
    const [filterCategory, setFilterCategory] = useState<any>([]);
    const [filterSubcategory, setFilterSubcategory] = useState<any>([]);
    const [openLogin, setOpenLogin] = useState(false);
    const [addToCartCompleted, setAddToCartCompleted] = useState<boolean>(true)
    const [itemId, setItemId] = useState<any>('')
    const [stockCount, setStockCount] = useState<any>(0)
    const [price, setPrice] = useState(100)
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(1000)
    const [filterOption, setFilterOption] = useState('Latest');
    const [initialproducts, setInitialProducts] = useState<any>([])
    

    const router = useRouter();

    const categoriesArray = (resData: any) => {
        return [...new Set(resData.map((item: any) => ({
                id: item.id,
                category_name: item.attributes.category_name,
                subcategories: item.attributes.sub_categories.data.map((subItem: any) => ({
                    id: subItem.id,
                    name: subItem.attributes.name
                }))
            })
        ))];
    }

    useEffect(() => {
        setSelectedMake(localStorage.getItem('make') || '');
        setSelectedModel(localStorage.getItem('model') || '');
        setSelectedYear(localStorage.getItem('year') || '');
        setSelectedCategory(localStorage.getItem('category') || '');
        APIs.getCategories().then((response: any) => {
                setCategories(categoriesArray(response.data.data));
                filterToggle.categories = true;
                setFiltertoggle({...filterToggle});
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
        } else {
            APIs.getAllProducts('&sort[0]=createdAt:desc').then(response => {
                let pagination = response.data.meta.pagination;
                setPageRange(pageRangeFinder(pagination.pageCount));
                setPagination(pagination);
                setSearchedProducts(response.data.data);
                setInitialProducts(response.data.data)
            })
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

    const pageRangeFinder = (pageCount: number) => {
        let start = 0, range = []
        while (start !== pageCount) {
            range.push(start+1)
            start++
        }
        return range;
    }

    const searchProducts = () => {
        APIs.searchProducts(selectedMake, selectedModel, selectedYear, selectedCategory).then((response: any) => {
            setSearchedProducts(response.data.data);
            setInitialProducts(response.data.data)
            let pagination = response.data.meta.pagination
            setPagination(pagination);
            setSearched(true);
            setPageRange(pageRangeFinder(pagination.pageCount));
        }).catch((error) => {
            setError(error);
            setLoading(false);
        });
    }

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

    const clearSearch = (event: any) => {
        event.preventDefault();
        setSelectedMake('');
        setSelectedModel('');
        setSelectedYear('');
        localStorage.removeItem('make');
        localStorage.removeItem('model');
        localStorage.removeItem('year');
        localStorage.removeItem('category');
    }

    const handleProductClick = (product: any) => {
        router.push('/products_/' + product.id);
    }

    const handleCategoryFilter = (event: any) => {
        let tempCategories = categories;
        let tempFilteredSubcategories = filterSubcategory;
        let filteredCategories: any = filterCategory;
        let category = event.target.value;
        if (event.target.checked) {
            setFiltertoggle((prevValue: any) => ({...prevValue}));
            filteredCategories.push(category)
        } else {
            setFiltertoggle((prevValue: any) => ({...prevValue}));
            filteredCategories = filteredCategories.filter((item: any) => item !== category);
            // remove subcategories that are related to parent category
            [tempCategories] = tempCategories.filter((item: any) => (item.category_name === category));
            filterSubcategory.forEach((filteredSubItem: any) => {
                tempCategories.subcategories.forEach((tempSubCat: any) => {
                    if (tempSubCat.name === filteredSubItem) {
                        tempFilteredSubcategories = tempFilteredSubcategories.filter((subItem: any) => filteredSubItem !== subItem);
                    }
                })
            });
            setFilterSubcategory(tempFilteredSubcategories);
        }
        setFilterCategory(filteredCategories);
    }

    const handleSubcategoryFilter = (event: any) => {
        let filteredSubcategories: any = filterSubcategory;
        let subcategory = event.target.value;
        if (event.target.checked) {
            filteredSubcategories.push(subcategory)
        } else {
            filteredSubcategories = filteredSubcategories.filter((item: any) => item !== subcategory);
        }
        setFilterSubcategory(filteredSubcategories);
    }

    const handlePriceChange = (value: any) => {
        console.log(value[0], value[1]);
    }

    const handleApplyFilter = (event: any) => {
        event.preventDefault();
        APIs.searchFilter(selectedMake, selectedModel, selectedYear, filterCategory, filterSubcategory, {min: minPrice, max: maxPrice}).then(response => {
            setSearchedProducts(response.data.data)
        }).catch(err => console.log)
    }

    const handleAddToCart = (productData: any) => {
        
        if (!user || user && !user.id) {
            setOpenLogin(true);
        } else {
            setOpenLogin(false);
            setAddToCartCompleted(false)
            setItemId(productData?.id)
            let productQuantityInCart = 0;
            let cartData = {
                customerid: user.id,
                productid: productData?.id,
                quantity: '1',
                productprice: productData?.attributes?.price
            }
            APIs.getCartData({ customerid: user.id }).then(response => {
                let productCartItems = response.data.rows;
                // Find the quantity of the product with the given product ID
                for (const cartItem of productCartItems) {
                    if (cartItem.product_id === productData?.id) {
                        productQuantityInCart = cartItem.quantity + 1;
                        break; 
                    }
                }
                // Fetch the product stock count
                APIs.getProduct(cartData.productid).then(response => {
                    let productStock = response.data.data.attributes.stock_count;
                    if (productQuantityInCart <= productStock && productStock !== 0) {
                        APIs.addToCart(cartData).then(response => {
                            toast.success(() => (
                                <>
                                    Item successfully added to <Link href={"/cartpage"}>cart</Link>
                                </>
                            ));
                            APIs.getCartData({ customerid: user.id }).then(response => {
                                setCartCount(response.data.rows.length);
                            }).then(()=> setAddToCartCompleted(true));
                        }).catch(err => {
                            toast.error('Something went wrong while adding to cart!');
                            setAddToCartCompleted(true)
                        });
                    } else {
                        setAddToCartCompleted(true)
                        toast.error('Stock exceeded. Cannot add this item to the cart.');
                    }
                }).catch(err => {
                    toast.error('Something went wrong while fetching product information.');
                    setAddToCartCompleted(true)
                });
            })
    
        }
    }

    const handleFilterChange = (event: any) =>{
        const selectedOption = event.target.value;
    setFilterOption(selectedOption);
     if (selectedOption === 'Latest') {
        APIs.getAllProducts('&sort[0]=createdAt:desc').then(response => {
            let pagination = response.data.meta.pagination;
            setPageRange(pageRangeFinder(pagination.pageCount));
            setPagination(pagination);
            setSearchedProducts(response.data.data);
            setInitialProducts(response.data.data)
        })
     
      } else if (selectedOption === 'highToLow') {
        // Sort searchedProducts by price high to low

        // const sortedProducts = searchedProducts.slice().sort((a: any, b: any) => b.attributes.price - a.attributes.price);
        APIs.getAllProducts('&sort[0]=price:desc').then(response => {
            let pagination = response.data.meta.pagination;
            setPageRange(pageRangeFinder(pagination.pageCount));
            setPagination(pagination);
            setSearchedProducts(response.data.data);
            setInitialProducts(response.data.data)
        })
        
      } else if (selectedOption === 'lowToHigh') {
        // Sort searchedProducts by price low to high
        // const sortedProducts = searchedProducts.slice().sort((a:any, b:any) => a.attributes.price - b.attributes.price);
        APIs.getAllProducts('&sort[0]=price:asc').then(response => {
            let pagination = response.data.meta.pagination;
            setPageRange(pageRangeFinder(pagination.pageCount));
            setPagination(pagination);
            setSearchedProducts(response.data.data);
            setInitialProducts(response.data.data)
        })
        
      }
    }

    const loginModalClose = () => {
        setOpenLogin(false);
    };

    return (
        <>
            <Login isOpen={openLogin} onClose={loginModalClose} />
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
                                                    <option key={index} value={category.category_name}>{category.category_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-1">
                                        <div className="form-group">
                                            <button className='regularfont' 
                                                style={{background: '#587E50', padding: '0.2rem 1.1rem', color: 'white', border: 'none', borderRadius: '5px'}}
                                                onClick={(e) => clearSearch(e)}
                                            >Clear</button>
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
                                            <button type="button" 
                                                className="boldfont boldfontsize button-bg-color-1 border-0 text-white p-2 rounded" 
                                                data-bs-toggle="modal" data-bs-target="#view-filters"
                                            >View Filter</button>
                                        </div>
                                        <div className="desktop-filter">
                                            <div className="row mb-2 flex-column">
                                                <button 
                                                    className="btn coulmn-bg-color-1 border-0 text-start justify-content-between 
                                                                d-flex align-items-center regularfont mini-text-2"
                                                    onClick={() => {setFiltertoggle((prevValue: any) => ({...prevValue, categories: !filterToggle.categories}))}}
                                                >
                                                    <span>Categories</span><i className={`${filterToggle.categories ? 'fa fa-angle-up' : 'fa fa-angle-down'}`}></i>
                                                </button>
                                                {filterToggle.categories && <div className=" p-3">
                                                    {categories.map((category: any, idx: any) => 
                                                        <div>
                                                            <div className="form-check mb-2" key={idx}>
                                                                <input type="checkbox" 
                                                                    className="form-check-input border-0" 
                                                                    id={idx} name={category.category_name} value={category.category_name} 
                                                                    onChange={(e) => handleCategoryFilter(e)}
                                                                />
                                                                <label className="form-check-label" htmlFor={idx}>{category.category_name}</label>
                                                                {filterCategory.map((item: any) => item === category.category_name && category.subcategories.map((subcategory: any) => (
                                                                    <div>
                                                                        <div className="form-check mb-2" key={idx}>
                                                                            <input type="checkbox" 
                                                                                className="form-check-input border-0" 
                                                                                id={subcategory.name} name={subcategory.name} value={subcategory.name} 
                                                                                onChange={(e) => handleSubcategoryFilter(e)}
                                                                                />
                                                                            <label className="form-check-label" htmlFor={subcategory.name}>{subcategory.name}</label>
                                                                        </div>
                                                                    </div>
                                                                )))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>}
                                            </div>
                                            <div className="row mb-2 flex-column">
                                           <button
                                             className="btn coulmn-bg-color-1 border-0 text-start justify-content-between d-flex align-items-center regularfont mini-text-2"
                                             onClick={() => {
                                               setFiltertoggle((prevValue) => ({ ...prevValue, price: !filterToggle.price }));
                                             }}
                                           >
                                             <span>Price</span>
                                             <i className={`${filterToggle.price ? 'fa fa-angle-up' : 'fa fa-angle-down'}`}></i>
                                           </button>
                                           {filterToggle.price && (
                                             <div className="group-check p-4 " style={{display: "grid", gridTemplateColumns: "1fr 1fr" , gap: "20px"}}>
                                               <div className="form-group d-flex flex-column align-items-center justify-content-center ">
                                                 <label htmlFor="minPrice">Min Price:</label>
                                                 <input
                                                   type="number"
                                                   id="minPrice"
                                                   name="minPrice"
                                                   value={minPrice}
                                                   onChange={(e) => setMinPrice(Number(e.target.value))}
                                                   min={100}
                                                   max={maxPrice}
                                                   className="form-control text-center"
                                                 />
                                               </div>
                                               <div className="form-group  d-flex flex-column align-items-center justify-content-center">
                                                 <label htmlFor="maxPrice">Max Price:</label>
                                                 <input
                                                   type="number"
                                                   id="maxPrice"
                                                   name="maxPrice"
                                                   value={maxPrice}
                                                   onChange={(e) => setMaxPrice(Number(e.target.value))}
                                                   min={minPrice}
                                                   max={2000}
                                                   className="form-control text-center"
                                                 />
                                               </div>
                                             </div>
                                           )}
                                         </div>
                                            {/* Filter based on rating - currently not used */}
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
                                            <div className='text-center mt-4 mini-text-2'>
                                                <button style={{background: '#2a2a2a', color:'white', border: 'none', padding: '0.4rem 1.5rem'}}
                                                    onClick={(e) => handleApplyFilter(e)}
                                                >Apply Filter</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="d-flex justify-content-end">
                                            <div className="col-12 col-md-5 d-flex">
                                                <label htmlFor="filterDropdown" 
                                                    className="form-label me-2 d-flex align-items-center justify-content-center mb-2" 
                                                    style={{minWidth: "100px"}}
                                                >Sort by:</label>
                                                <select
                                                id="filterDropdown"
                                                className="form-select mb-2 border-0"
                                                value={filterOption}
                                                onChange={handleFilterChange}
                                                >
                                                <option value='Latest'>Latest</option>
                                                <option value="highToLow">Price: High to Low</option>
                                                <option value="lowToHigh">Price: Low to High</option>
                                                {/* Add more filter options as needed */}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row g-4 pt-3">
                                            {searchedProducts.map((product: any, index: any) => {
                                                return (
                                                    <div className="col-12 col-sm-6 col-lg-4  mb-4" key={index}>
                                                        <div className="latest-prods card card-shadows" style={{height: "100%"}}>
                                                        <AppImage 
                                                                src={BASE_URL + product?.attributes?.product_image?.data?.attributes?.formats?.medium?.url} 
                                                                className="card-img-top img-prod-height pointer "
                                                                style={{height: '20rem', objectFit: 'contain', filter:`${product.attributes.stock_count == 0 ? "blur(3px)" : "none"}`}} 
                                                                onClick={() => handleProductClick(product)}    
                                                            />
                                                            {
                                                            product.attributes.stock_count == 0 &&  
                                                                <div  onClick={() => handleProductClick(product)} className='out-of-stock d-flex position-absolute justify-content-center align-items-center' >
                                                                   <p className='text-out-of-stock mb-0'>OUT OF STOCK</p>
                                                                </div>
                                                      
                                                             }
                                                           
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
                                                                        { product.attributes.stock_count === 0 ? (
                                                                          <AppImage
                                                                          src="images/cart-svg.svg"
                                                                          className="pointer add_to_cart"
                                                                           style={{opacity: "0.5", cursor: "not-allowed"}}  
                                                                        />
                                                                        ) : addToCartCompleted ? (
                                                                          <AppImage
                                                                            src="images/cart-svg.svg"
                                                                            className="pointer add_to_cart"
                                                                            onClick={() => handleAddToCart(product)}
                                                                          />
                                                                        ) : product.id === itemId ? (
                                                                          "Adding.."
                                                                        ) : (
                                                                          <AppImage
                                                                            src="images/cart-svg.svg"
                                                                            className="pointer add_to_cart"                      
                                                                          />
                                                                        )
                                                                        } 
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
                                        {/* <div className="row mb-2">
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
                                        </div> */}
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
