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
    const [addToCartCompleted, setAddToCartCompleted] = useState<boolean>(true)
    const [openLogin, setOpenLogin] = useState(false);
    const [itemId, setItemId] = useState<any>('')
    const [forgotPasswordPickerIsOpen, setforgotPasswordPickerIsOpen] = useState(false);
    const [startIndex, setStartIndex] = useState(0)
    const [makeData, setMakeData] = useState<any>([]);

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

      useEffect(() => {
        APIs.getMakes()
          .then(response => {
            setMakeData(response.data.data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }, []); 

   

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
        setOpenLogin(false);
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
    const handleArrowClick = () => {
        // Calculate the next start index by adding 4
        const nextIndex = startIndex + 4;
        // Ensure that the next index doesn't exceed the length of makesData
        if (nextIndex < makeData.length) {
          setStartIndex(nextIndex);
        } else {
          // If it exceeds, wrap around to the beginning
          setStartIndex(0);
        }
      };
    
    return (
        <>
            <Forgotpass
                isOpen={forgotPasswordPickerIsOpen}
                onClose={onForgotPasswordClose}
            />
            <Login
                isOpen={openLogin}
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
                                                <input type="form-control" 
                                                    onChange={handleLicenseplateChange} name="plate_number" 
                                                    className="semifont placeholderfontsize" 
                                                    placeholder="Search with Car's Plate Number" 
                                                />
                                                {showInvaidLicense &&
                                                    <div className="row mt-2 ml-2" >
                                                        <span className="advanced_search placeholderfontsize regularfont"
                                                        >No Record Found Against this Plate Number!</span>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="col-auto or_block">
                                            <span className="or_label semifont placeholderfontsize field3">or</span>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <input type="form-control" name="article_number"
                                                 className="semifont placeholderfontsize" placeholder="Search with product Article" 
                                                />
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
                                                <select disabled={!selectedMake} 
                                                    className="form-select semifont placeholderfontsize" name="model" id="modelOption"
                                                    value={selectedModel} onChange={handleModelChange}
                                                >
                                                    <option value="" disabled={true}>Select Model</option>
                                                    {modelArray.map((model: any, index: any) => (
                                                        <option key={index} value={model.model}>{model.model}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <select disabled={!selectedModel || (yearArray && yearArray.length && !yearArray[0].year)}
                                                    className="form-select semifont placeholderfontsize" name="year" id="yearOption"
                                                    value={selectedYear} onChange={handleYearChange}
                                                >
                                                    <option value="" disabled={true}>Select Year</option>
                                                    {yearArray.map((year: any, index: any) => (
                                                        <option key={index} value={year.year}>{year.year}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <select disabled={!selectedYear} 
                                                    className="form-select semifont placeholderfontsize" name="category" id="categoryOption"
                                                    value={selectedCategory} onChange={handleCategoryChange}
                                                >
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
                                    <button type="button" onClick={searchProducts} 
                                        className="search boldfont boldfontsize" disabled={showInvaidLicense}
                                    >Search</button>
                                </div>
                            </div>
                            <div className="row mt-2 ml-2" >
                                <span onClick={toggleAdvancedSearch} style={{ cursor: 'pointer' }} 
                                    className="advanced_search placeholderfontsize regularfont"
                                >{toggleSearch ? 'Show less' : 'Advanced Search'}</span>
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
                                                <AppImage 
                                                    src={BASE_URL + product?.attributes?.product_image?.data?.attributes?.formats?.medium?.url} 
                                                    className="card-img-top" 
                                                />
                                                <div className="card-body">
                                                    <div className="row g-1">
                                                        <div className="col-12">
                                                            <span className="article-number regularfont mini-text"
                                                                >Article #{product?.attributes?.article_number}</span>
                                                        </div>
                                                        <div className="col-12">
                                                            <span className="product-name regularfont">{product?.attributes?.title}</span>
                                                        </div>
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
                            { !user?.role || user.role.name !== "seller" ? (
                                <>
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
                                </>
                            ) : null}
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
                            {categoriesDetail.length > 0 ? categoriesDetail.slice(0, 4).map((item:any, index:any) => {
                                return (
                                <div key={index} className="col-6 col-md-3">
                                    <div className="prod-cats card">
                                    {item.attributes.category_image.data ? (
                                            <AppImage style={{height: "270px", objectFit: "contain"}} 
                                                src={BASE_URL + item.attributes.category_image.data[0].attributes.url} className="card-img-top" 
                                            />
                                        ) : (
                                            <AppImage style={{height: "270px", objectFit: "contain"}} src='' className="card-img-top" />
                                        )}
                                            <div className="card-body">
                                                <a href="" className="boldfont body-sub-titles">{item.attributes.category_name}</a>
                                            </div>
                                        </div>
                                </div>
                                )
                            }) : ""}
                        </div>
                    </section>
                <section className='d-flex align-items-center justify-content-center' 
                    style={{ height: "200px", margin: "50px 0", background: "white" }}
                >
                   <div className='p-4 d-flex flex-row align-items-center justify-content-center'>
                        <div style={{ width: "200px" }}>
                            <h4>Search by Car Brand</h4>
                        </div>
                        {makeData.slice(startIndex, startIndex + 4).map((item :any, index:any) => (
                            <div key={index} style={{ width: "200px" }}>
                                <img src={item.attributes.make_logo.data ? 
                                        BASE_URL + item.attributes.make_logo.data.attributes.url : ""} 
                                    alt="" width="120px" height="120px"  style={{ cursor: 'pointer' }} 
                                />
                            </div>
                        ))}
                        <button onClick={handleArrowClick} 
                            style={{ height: "75px", width: "75px", borderRadius: "50%", border: "3px solid green" }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                width="20" height="20" fill="currentColor" 
                                className="bi bi-arrow-right" viewBox="0 0 16 16"
                            >
                                <path fillRule="evenodd" 
                                    d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" 
                                />
                            </svg>
                        </button>
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
                                    >All</button>
                                    <button
                                        type="button"
                                        className={`saleoffers regularfont body-sub-titles ${selectedItem === 'Audio' ? 'active' : ''}`}
                                        onClick={() => handleCategoryClick('Audio')}
                                    >Audio</button>
                                    <button
                                        type="button"
                                        className={`saleoffers regularfont body-sub-titles ${selectedItem === 'Lights' ? 'active' : ''}`}
                                        onClick={() => handleCategoryClick('Lights')}
                                    >Lights</button>
                                   <button
                                        type="button"
                                        className={`saleoffers regularfont body-sub-titles ${selectedItem === 'Body Parts ' ? 'active' : ''}`}
                                        onClick={() => handleCategoryClick('Body Parts ')}
                                   >Body Parts</button>
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
                        {latestItems && latestItems .map((product: any, index: any) => {
                            return (
                                <div className="col-12 col-sm-6 col-lg-3 mb-4" key={index}>
                                    <div className="latest-prods card card-shadows " style={{height: "100%"}} >   
                                        <AppImage 
                                            src={BASE_URL + product?.attributes?.product_image?.data?.attributes?.formats?.medium?.url} 
                                            className="card-img-top img-prod-height pointer "
                                            style={{height: '20rem', objectFit: 'contain', filter:`${product.attributes.stock_count == 0 ? "blur(3px)" : "none"}`}} 
                                            onClick={() => handleProductClick(product)}    
                                        />
                                        {product.attributes.stock_count == 0 &&  
                                            <div onClick={() => handleProductClick(product)} className='out-of-stock d-flex position-absolute justify-content-center align-items-center' >
                                                <p className='text-out-of-stock mb-0'>OUT OF STOCK</p>
                                            </div>
                                        }
                                        <div className="card-body">
                                            <div className="row g-1">
                                                <div className="col-12">
                                                    <span className="article-number regularfont mini-text"
                                                        >Article #{product?.attributes?.article_number}</span>
                                                </div>
                                                <div className="col-12">
                                                    <span className="product-name regularfont"
                                                        style={{"cursor": "pointer"}} 
                                                        onClick={() => handleProductClick(product)}
                                                    >{product?.attributes?.title}</span>
                                                </div>
                                                <div className="col-12 d-flex justify-content-between">
                                                    <span className="product-price">€{product?.attributes?.price}</span>
                                                    {product.attributes.stock_count === 0 ? 
                                                        (<AppImage
                                                            src="images/cart-svg.svg"
                                                            className="pointer add_to_cart"
                                                            style={{opacity: "0.5", cursor: "not-allowed"}}  
                                                        />) : addToCartCompleted ? 
                                                        (<AppImage
                                                            src="images/cart-svg.svg"
                                                            className="pointer add_to_cart"
                                                            onClick={() => handleAddToCart(product)}
                                                        />) : product.id === itemId ? ("Adding..") : 
                                                        (<AppImage
                                                            src="images/cart-svg.svg"
                                                            className="pointer add_to_cart"                      
                                                        />)
                                                    }
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
                            <div className="row"></div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Home;
