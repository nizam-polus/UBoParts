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
import { UserContext } from './account_/UserContext';
import { toast } from 'react-toastify';

function Home() {
    const router = useRouter();
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
    const [showInvaidLicense, setShowInvaidLicense] = useState(false);
    const [products,setProducts] = useState<any>([])
    const [selectedItem, setSelectedItem] = useState<any>('All')
    const [latestItems, setLatestItems] = useState([]);
    const [categoriesDetail, setCategoriesDetail] = useState([])
    const [role, setRole] = useState("")
    const [addToCartCompleted, setAddToCartCompleted] = useState<boolean>(true)
    const [openLogin, setOpenLogin] = useState(false);
    const [itemId, setItemId] = useState<any>('')
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
                setCategoriesDetail(response.data.data)
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

    useEffect(() => {
     APIs.getAllProducts('&sort[0]=createdAt:desc').then((response: any) =>{
        setProducts(response.data.data)
     })
    }, [])
    useEffect(() => {
        // Function to filter and get the latest 4 items based on category
        const getLatestItemsByCategory = (categoryName: any) => {
            
            if (!products || products.length === 0) {
              return []; // Handle the case when products array is empty
            }
            if (categoryName === 'All') {
                return products.slice(0, 4);
            } else {
                // Check if the category exists in the data before filtering
                const filteredProducts = products.filter(
                  (product: any) => (
                    product.attributes.category.data.attributes.category_name === categoryName
                  )
                );
                return  filteredProducts.slice(0, 4);
            }
        };
    
        // Call the function and set the latest items whenever products or selectedCategory changes
        setLatestItems(getLatestItemsByCategory(selectedItem));
      }, [products, selectedItem]);

      const handleCategoryClick = (categoryName : any) => {
        setSelectedItem(categoryName);
      };
    
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

    const handleProductClick = (product: any) => {
        router.push('/products_/' + product.id);
    }

    const handleAddToCart = (productData: any) => {
        setAddToCartCompleted(false)
        setItemId(productData?.id)
        if (!user || user && !user.id) {
            setOpenLogin(true);
        } else {
            setOpenLogin(false);
            let productQuantityInCart = 0;
            let cartData = {
                customerid: user.id,
                productid: productData?.id,
                quantity: '1',
                productprice: productData?.attributes?.price
            }
            APIs.getCartData({ customerid: user.id }).then(response => {
                let productCartItems = response.data.rows;
                for (const cartItem of productCartItems) {
                    if (cartItem.product_id === productData?.id) {
                        productQuantityInCart = cartItem.quantity + 1;
                        break; 
                    }
                }
                APIs.getProduct(cartData.productid).then(response => {
                    let productStock = response.data.data.attributes.stock_count;
        
                    // Check if the quantity exceeds the stock count
                    if (productQuantityInCart <= productStock && productStock !== 0) {
                        // Quantity is within stock limit, add to cart
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
                        // Quantity exceeds stock limit, display a toast message
                        toast.error('Stock exceeded. Cannot add this item to the cart.');
                    }
                }).catch(err => {
                    toast.error('Something went wrong while fetching product information.');
                    setAddToCartCompleted(true)
                });
            })
        }
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
                {user.role ? user.role.name == "seller" ? null :  (
                <section className="cards-wrapper">
                    <div className="row mt-3 g-4">
                      <div className="col" onClick={() => router.push('/request')}>
                       <div className="specific_part">
                        <h3 className="text-white bg-image-text semifont m-0 selling-text">Need A <br />Specific Part?</h3>
                       </div>
                      </div>
                       <div className="col" onClick={() => router.push('/seller-registration')}>
                         <div className="start_selling">
                         <h3 className="text-white bg-image-text semifont m-0 selling-text">Start Selling <br />With Us</h3>
                        </div>
                       </div>
                    </div>
                </section>
                        ) : 
                <section className="cards-wrapper">
                  <div className="row mt-3 g-4">
                     <div className="col" onClick={() => router.push('/request')}>
                        <div className="specific_part">
                              <h3 className="text-white bg-image-text semifont m-0 selling-text">Need A <br />Specific Part?</h3>
                        </div>
                     </div>
                     <div className="col" onClick={() => router.push('/seller-registration')}>
                       <div className="start_selling">
                          <h3 className="text-white bg-image-text semifont m-0 selling-text">Start Selling <br />With Us</h3>
                    </div>
                     </div>
                  </div>
                </section>
                }
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
                        {categoriesDetail.length > 0 ? categoriesDetail.slice(0, 4).map((item:any, index:any) => {
                      return (
                       <div key={index} className="col-6 col-md-3">
                           <div className="prod-cats card">
                           {item.attributes.category_image.data ? (
                              <AppImage  style={{maxHeight: "270px", objectFit: "contain"}} src={BASE_URL + item.attributes.category_image.data[0].attributes.url} className="card-img-top" />
                            ) : (
                              <AppImage style={{maxHeight: "270px", objectFit: "contain"}} src='data:image/png;base64,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' className="card-img-top" />
                            )}
                              
                                  <div className="card-body"><a href="" className="boldfont body-sub-titles">{item.attributes.category_name}</a></div>
                            </div>
                       </div>
                       )
                       }) : ""}
                           
                            {/* <div className="col-6 col-md-3">
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
                            </div> */}
                        </div>
                    </section>
                    <section className="latest-products-wrapper">
                        <div className="row mt-5">
                            <div className="col-12 d-flex justify-content-between">
                                <div><span className="popular_categories body-sub-titles regularfont">Latest Products</span>
                                </div>
                                  <div>
                                    <button
                                      type="button"
                                      className={`saleoffers regularfont body-sub-titles ${selectedItem === 'All' ? 'active' : ''}`}
                                      onClick={() => handleCategoryClick('All')}
                                    >
                                      All
                                    </button>
                                    <button
                                      type="button"
                                      className={`saleoffers regularfont body-sub-titles ${selectedItem === 'Audio' ? 'active' : ''}`}
                                      onClick={() => handleCategoryClick('Audio')}
                                    >
                                    Audio
                                   </button>
                                    <button
                                     type="button"
                                     className={`saleoffers regularfont body-sub-titles ${selectedItem === 'Lights' ? 'active' : ''}`}
                                     onClick={() => handleCategoryClick('Lights')}
                                    >
                                     Lights
                                   </button>
                                   <button
                                     type="button"
                                     className={`saleoffers regularfont body-sub-titles ${selectedItem === 'Body Parts ' ? 'active' : ''}`}
                                     onClick={() => handleCategoryClick('Body Parts ')}
                                   >
                                     Body Parts
                                   </button>
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
                        {latestItems
                         && latestItems
                             .map((product: any, index: any) => {
                                                return (
                                                    <div className="col-12 col-sm-6 col-lg-3 mb-4" key={index}>
                                                        <div className="latest-prods card card-shadows">   
                                                            <AppImage 
                                                                src={BASE_URL + product?.attributes?.product_image?.data?.attributes?.formats?.medium?.url} 
                                                                className="card-img-top img-prod-height pointer "
                                                                style={{height: '20rem', objectFit: 'cover', filter:`${product.attributes.stock_count == 0 ? "blur(3px)" : "none"}`}} 
                                                                onClick={() => handleProductClick(product)}    
                                                            />
                                                            {
                                                            product.attributes.stock_count == 0 &&  
                                                                <div onClick={() => handleProductClick(product)} className='out-of-stock d-flex position-absolute justify-content-center align-items-center' >
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
