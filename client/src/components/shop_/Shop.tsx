// react
import React, { useCallback, useEffect, useState } from 'react';
import AppImage from '../shared/AppImage';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import APIs from '~/services/apiService';
import { BASE_URL } from 'configuration';
import Link from 'next/dist/client/link';
import { UserContext } from '../account_/UserContext';
import Login from '../account_/Login';
import 'react-toastify/dist/ReactToastify.css';
import { FormattedMessage } from 'react-intl';

function Shop() {
    
    const {
        user, 
        setCartCount, 
        appliedFilter, 
        setAppliedFilter,
        category,
        subcategory,
        setCategory, 
        setSubcategory,
        availableCategories,
        setAvailableCategories
    } = UserContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [makesArray, setMakesArray] = useState<any>([]);
    const [modelArray, setModelArray] = useState<any>([]);
    const [yearArray, setYearArray] = useState<any>([]);
    const [categories, setCategories] = useState<any>([]);
    const [selectedMake, setSelectedMake] = useState<any>('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [toggleSearch, setToggleSearch] = useState(false);
    const [searchedProducts, setSearchedProducts] = useState<any>([]);
    const [pagination, setPagination] = useState<any>({});
    const [pageRange, setPageRange] = useState<number[]>([]);
    const [filterToggle, setFiltertoggle] = useState({
        categories: false,
        price: false
    });
    const [filterCategory, setFilterCategory] = useState<any>(category || []);
    const [filterSubcategory, setFilterSubcategory] = useState<any>(subcategory || []);
    const [openLogin, setOpenLogin] = useState(false);
    const [addToCartCompleted, setAddToCartCompleted] = useState<boolean>(true);
    const [itemId, setItemId] = useState<any>('');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [sortOption, setSortOption] = useState('Latest');
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState();
    const [sortState, setSortState] = useState("sort[0]=createdAt:desc");
    const [viewFilter, setViewFilter] = useState(true);
    const [sellerId, setSellerId] = useState("");
    const [filterApplied, setFilterApplied] = useState<boolean>(false);
    
    const router = useRouter();
    const { HomeMakeId } : any = router.query;
    let locale: any;
    
    if(typeof window !== 'undefined'){
        locale = localStorage.getItem("locale")
    }

    const categoriesArray = (resData: any) => {
        return [...new Set(resData.map((item: any) => ({
                id: item.id,
                category_name: item.attributes.category_name,
                category_name_nl: item.attributes.category_name_nl,
                subcategories: item.attributes.sub_categories.data.map((subItem: any) => ({
                    id: subItem.id,
                    name: subItem.attributes.name,
                    name_nl: subItem.attributes.name_nl
                }))
            })
        ))];
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            
            if (HomeMakeId && HomeMakeId !== 'undefined') {
                localStorage.setItem('makeId', HomeMakeId);
                localStorage.removeItem('modelId');
                localStorage.removeItem('yearId');
            };
        }
        setSellerId(user.user_type == "seller" ? user.id : "")
        setSearchedProducts([]);
        let makeId, modelId, yearId, category, articleNumber;
        APIs.getCarMake().then((response: any) => {
            setMakesArray(response.data.rows);
            makeId = localStorage.getItem('makeId') || '';
            modelId = localStorage.getItem('modelId') || '';
            yearId = localStorage.getItem('yearId') || '';
            category = localStorage.getItem('category') || '';
            articleNumber = localStorage.getItem('article') || '';
            makeId && getModel(makeId);
            makeId && modelId && getYear(modelId);
            setSelectedMake(makeId);
            setSelectedModel(modelId);
            setSelectedYear(yearId);
            setSelectedCategory(category);
            if (appliedFilter || filterApplied) {
                let filteredCategory = filterCategory || category;
                let filteredSubcategory = filterSubcategory || subcategory;
                console.log(filteredCategory, filteredSubcategory)
                searchFilter(filteredCategory, filteredSubcategory, {sort: "sort[0]=createdAt:desc", page: 1});
            } else if (articleNumber) {
                APIs.getProductUsingArticleNumber(articleNumber).then(response => {
                    setSearchedProducts(response.data.data)
                })
            } else if (makeId) {
                searchProducts(makeId, modelId, yearId, category);
            } else {
                searchProducts('', '', '', '');
            }
        }).catch((error) => {
            setError(error);
        });
        APIs.getCategories().then((response: any) => {
            let categories = categoriesArray(response.data.data)
            console.log("category response",response.data.data)
            setCategories(categories);
            setAvailableCategories(categories);
            filterToggle.categories = true;
            setFiltertoggle({...filterToggle});
        }).catch((error) => {
            setError(error);
        });
    }, []);

    const getModel = (makeId: any) => {
        Number(makeId);
        APIs.getCarModel(makeId).then((response: any) => {
                setModelArray(response.data.rows);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }

    const getYear = (modelId: any) => {
        Number(modelId);
        APIs.getCarYear(modelId).then((response: any) => {
                setYearArray(response.data.rows);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }

    const pageRangeFinder = (pageCount: number) => {
        let start = 0, range = []
        while (start !== pageCount) {
            range.push(start+1)
            start++
        }
        return range;
    }

    const searchProducts = (make: any, model: any, year: any, category: any, pageNumber = '1', sortData = 'sort[0]=createdAt:desc') => {
        setSortState(sortData);
        APIs.searchProducts(make, model, year, category, {sort: sortData, page: pageNumber}, sellerId).then((response: any) => {
            setSearchedProducts(response.data.data);
            let pagination = response.data.meta.pagination
            setPagination(pagination);
            setPageRange(pageRangeFinder(pagination.pageCount));
            setPageCount(response.data.meta.pagination.pageCount)
        }).catch((error) => {
            setError(error);
            setLoading(false);
        });
    }

    const searchFilter = (filterCategory: [], filterSubcategory: [], sortData: any, make = selectedMake, model = selectedModel, year = selectedYear) => {
        let filteringcategories = categories.length ? categories : availableCategories;
        APIs.searchFilter(
            {make: make, model: model, year: year},
            filteringcategories,
            filterCategory,
            filterSubcategory,
            filterToggle.price,
            {min: minPrice, max: maxPrice},
            sortData,
            sellerId
        ).then(response => {
            let pagination = response.data.meta.pagination;
            setPageRange(pageRangeFinder(pagination.pageCount));
            setPagination(pagination);
            setSearchedProducts(response.data.data)
            setPageCount(response.data.meta.pagination.pageCount)
        }).catch(err => console.log)
    }

    const handleMakeChange = (event: any) => {
        let makeId = event.target.value || '';
        getModel(makeId);
        setSelectedMake(event.target.value);
        router.replace('/shop', undefined, {shallow:true});
        localStorage.setItem('makeId', makeId);
        setSelectedModel('');
        setSelectedYear('');
        setFilterCategory([]);
        setCategory([]);
        searchProducts(makeId, '', '', '');
        localStorage.removeItem('article');
    };

    const handleModelChange = (event: any) => {
        let modelId = event.target.value;
        getYear(modelId);
        setSelectedModel(modelId);
        localStorage.setItem('modelId', modelId);
        setSelectedYear('');
        searchProducts(selectedMake, modelId, '', '');
    };

    const handleYearChange = (event: any) => {
        let year = event.target.value
        setSelectedYear(year);
        localStorage.setItem('yearId', year);
        searchProducts(selectedMake, selectedModel, year, '');
        setFilterCategory([]);
        setCategory([]);
    };

    const handleCategoryChange = (event: any) => {
        let category = event.target.value
        setSelectedCategory(category);
        localStorage.setItem('category', category);
        searchProducts(selectedMake, selectedModel, selectedYear, category);
        setFilterCategory([]);
        setCategory([]);
    };

    const clearSearch = (event: any) => {
        event.preventDefault();
        router.replace('/shop', undefined, {shallow:true});
        localStorage.removeItem('makeId');
        localStorage.removeItem('modelId');
        localStorage.removeItem('yearId');
        localStorage.removeItem('category');
        localStorage.removeItem('article');
        setSelectedMake('');
        setSelectedModel('');
        setSelectedYear('');
        setSelectedCategory('');
        if (filterApplied) {
            searchFilter(filterCategory, filterCategory, {sort: "sort[0]=createdAt:desc", page: 1}, '', '', '');
        } else {
            searchProducts('', '', '', '');
        }
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
            setSubcategory(tempFilteredSubcategories);
        }
        setFilterCategory(filteredCategories);
        setCategory(filteredCategories);
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
        setSubcategory(filteredSubcategories);
    }

    const handleApplyFilter = (event: any) => {
        event.preventDefault();
        setFilterApplied(true);
        setAppliedFilter(true);
        searchFilter(filterCategory, filterSubcategory, {sort: sortState, page: '1'});
    }

    const handleClearFilter = (event: any) => {
        event.preventDefault();
        setFilterApplied(false);
        setAppliedFilter(false);
        setFilterCategory([]);
        setCategory([]);
        setFilterSubcategory([]);
        setSubcategory([]);
        searchProducts(selectedMake, selectedModel, selectedYear, selectedCategory);
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
                productprice: productData?.attributes?.price,
                "productWeight": productData?.attributes?.product_weight || 0,
                "discountPrice": discountAmount(productData?.attributes?.price, productData?.attributes?.sale?.data?.attributes?.discount_percentage_value),
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
                                    <FormattedMessage id="ITEM_ADDED_TO"/><Link href={"/cartpage"}>{locale == "nl" ? "Winkelwagen" : "cart"}</Link>
                                </>
                            ));
                            APIs.getCartData({ customerid: user.id }).then(response => {
                                setCartCount(response.data.rows.length);
                            }).then(()=> setAddToCartCompleted(true));
                        }).catch(err => {
                            toast.error(() =>(
                                <>
                                <FormattedMessage id="SOMETHING_WRONG_CART" />
                                </>
                            ));
                            setAddToCartCompleted(true)
                        });
                    } else {
                        setAddToCartCompleted(true)
                        toast.error(() => (
                            <FormattedMessage id="STOCK_EXCEEDED" />
                        ));
                    }
                }).catch(err => {
                    toast.error(() =>{
                        <FormattedMessage id="SOMETHING_WRONG_FETCHING" />
                    });
                    setAddToCartCompleted(true)
                });
            })
    
        }
    }

    const handleSortChange = (event: any) => {
        let sort = ''
        const selectedOption = event.target.value;
        setSortOption(selectedOption);
      
        if (selectedOption === 'Latest') {
          setSortState('&sort[0]=createdAt:desc');
          sort = '&sort[0]=createdAt:desc';
        } else if (selectedOption === 'highToLow') {
          setSortState('&sort[0]=price:desc');
          sort = '&sort[0]=price:desc';
        } else if (selectedOption === 'lowToHigh') {
          setSortState('&sort[0]=price:asc');
          sort = '&sort[0]=price:asc';
        }
        filteredProductData(sort);
      };

    const filteredProductData = (sortData: string) => {
        if (filterApplied) {
            searchFilter(filterCategory, filterSubcategory, { sort: sortData, page: '1' });
        } else if (selectedMake) {
            searchProducts(selectedMake, selectedModel, selectedYear, selectedCategory, undefined, sortData);
        } else {
            searchProducts('', '', '', '', undefined, sortData);
        }
    }

    function discountedPrice(originalPrice: any, discountPercentage: any) {
        const original = parseFloat(originalPrice);
        const discount = parseFloat(discountPercentage);
        if (isNaN(discount)) {
            return original; 
        }
        const discountAmount = (original * discount) / 100;
        const discounted = original - discountAmount;
        return +discounted.toFixed(2); 
    }

    function discountAmount(originalPrice: any, discountPercentage: any) {
        const original = parseFloat(originalPrice);
        const discount = parseFloat(discountPercentage);
        if (isNaN(discount)) {
            return 0; 
        }
        const discountAmount = (original * discount) / 100;
        return +discountAmount.toFixed(2); 
    }

    const loginModalClose = () => {
        setOpenLogin(false);
    };

    const handlePageChange = (page:any) =>{
        page >= 1 && setPageNumber(page);
        filterApplied ? 
            searchFilter(filterCategory, filterSubcategory, {sort: sortState, page: page}) : searchProducts('', '', '', '', page);
    }

    return (
        <>
            <Login isOpen={openLogin} onClose={loginModalClose} />
            <div className="main-body pb-5 mb-5">
                <div className="container">
                    <section className="coulmn-bg-color-1 search-wrapper mt-5 mb-5">
                        <div className="row p-4 pt-2 text-center">
                            <div className="col">
                                <p className="semifont inner-page-main-headings custom-color-1 mb-2"><FormattedMessage id="FIND_PARTS"/></p>
                                <p className="semifont custom-color-1 boldfontsize"><FormattedMessage id="TENS_OF_PARTS"/></p>
                            </div>
                        </div>
                        <div className="row">
                            <form action="" className="w-100 mx-auto">
                                <div className="row g-4 flex-column flex-lg-row mt-2">
                                    <div className="col">
                                        <div className="form-group">
                                            <select className="form-select semifont placeholderfontsize" name="make" id="makeOption"
                                                value={selectedMake} onChange={handleMakeChange}
                                            >
                                                <option value="" disabled={true}>{locale == "nl" ? "Selecteer merk" : "Select Make"}</option>
                                                {makesArray.map((make: any, index: any) => (
                                                    <option key={index} value={make.id}>{make.make}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <select disabled={!selectedMake} className="form-select semifont placeholderfontsize" name="model" id="modelOption"
                                                value={selectedModel} onChange={handleModelChange}
                                            >
                                                <option value="" disabled={true}>{locale == "nl"? "Selecteer Model" : "Select Model"}</option>
                                                {modelArray.map((model: any, index: any) => (
                                                    <option key={index} value={model.id}>{model.model}</option>
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
                                                <option value="" disabled={true}>{locale == "nl"? "Selecteer Jaar" : "Select Year"}</option>
                                                {yearArray.map((year: any, index: any) => (
                                                    <option key={index} value={year.id}>{year.year}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <select disabled={!selectedYear} className="form-select semifont placeholderfontsize" name="category" id="categoryOption"
                                                value={selectedCategory} onChange={handleCategoryChange}>
                                                <option value="" disabled={true}>{locale == "nl" ? "Selecteer categorie": "Select category"}</option>
                                                {categories.map((category: any, index: any) => (
                                                    <option key={index} value={category.category_name}>{locale == "nl" ?  category.category_name_nl : category.category_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <button className='regularfont w-100 btn-dark btn' 
                                                onClick={(e) => clearSearch(e)}
                                            >
                                                <FormattedMessage id="CLEAR"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </section>

                    <section className="categories-wrapper section-inner-padding">
                        <div className="row mt-5">
                            <div className="col-12 d-lg-flex justify-content-between">
                                <div><span className="custom-color-2 mediumfont bg-image-text">{locale == "nl" ? "Ontdekken" : "Explore"}</span>
                                </div>
                            </div>
                            <div className="col-12 mt-5">
                                <div className="row g-5">
                                    <div className="col-12 col-sm-3 pb-4 pb-xl-0">
                                        <div className="responsive-filter">
                                            <button type="button" 
                                                onClick={() => setViewFilter(!viewFilter)}
                                                className="boldfont boldfontsize button-bg-color-1 border-0 text-white p-2 rounded" 
                                                data-bs-toggle="modal" data-bs-target="#view-filters"
                                            >
                                                {
                                                    viewFilter ? "Hide Filter" :  <FormattedMessage id="VIEW_FILTER"/>
                                                }
                                            </button>
                                        </div>
                                        <div className="desktop-filter" style={{display: `${viewFilter ? "block" : "none"}`}}>
                                            <div className="row mb-2 flex-column">
                                                <button 
                                                    className="btn coulmn-bg-color-1 border-0 text-start justify-content-between 
                                                                d-flex align-items-center regularfont mini-text-2"
                                                    onClick={() => {setFiltertoggle((prevValue: any) => ({...prevValue, categories: !filterToggle.categories}))}}
                                                >
                                                    <span><FormattedMessage id="CATEGORIES"/></span><i className={`${filterToggle.categories ? 'fa fa-angle-up' : 'fa fa-angle-down'}`}></i>
                                                </button>
                                                {filterToggle.categories && <div className=" p-3">
                                                    {categories.map((category: any, idx: any) => 
                                                    
                                                        <div key={idx}>
                                                            {console.log("test",category)}
                                                            <div className="form-check mb-2">
                                                                <input type="checkbox" 
                                                                    className="form-check-input border-0" checked={!!filterCategory.find((ele: any) => ele === category.category_name)}
                                                                    id={idx} name={category.category_name} value={category.category_name} 
                                                                    onChange={(e) => handleCategoryFilter(e)}
                                                                />
                                                                <label className="form-check-label" htmlFor={idx}>{locale == "nl" ? category.category_name_nl : category.category_name}</label>
                                                                {filterCategory.map((item: any) => item === category.category_name && category.subcategories.map((subcategory: any) => (
                                                                    <div key={idx}>
                                                                        <div className="form-check mb-2">
                                                                            <input type="checkbox" 
                                                                                className="form-check-input border-0" checked={!!filterSubcategory.find((ele: any) => ele === subcategory.name)}
                                                                                id={subcategory.name} name={subcategory.name} value={subcategory.name} 
                                                                                onChange={(e) => handleSubcategoryFilter(e)}
                                                                                />
                                                                            <label className="form-check-label" htmlFor={subcategory.name}>{locale == "nl" ? subcategory.name_nl : subcategory.name}</label>
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
                                             <span><FormattedMessage id="PRICE"/></span>
                                             <i className={`${filterToggle.price ? 'fa fa-angle-up' : 'fa fa-angle-down'}`}></i>
                                           </button>
                                           {filterToggle.price && (
                                             <div className="group-check p-4 " style={{display: "grid", gridTemplateColumns: "1fr 1fr" , gap: "20px"}}>
                                               <div className="form-group d-flex flex-column align-items-center justify-content-center ">
                                                 <label htmlFor="minPrice"><FormattedMessage id="MIN_PRICE"/>:</label>
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
                                                 <label htmlFor="maxPrice"><FormattedMessage id="MAX_PRICE"/>:</label>
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
                                            <button 
                                                    className='mr-3 mb-2'
                                                    style={{background: 'none', color:'black', border: '1.7px solid black', padding: '0.3rem 1.4rem'}}
                                                    onClick={(e) => handleClearFilter(e)}
                                                >
                                                    <FormattedMessage id="CLEAR_FILTER"/>
                                                </button>
                                                <button style={{background: '#587E50', color:'white', border: 'none', padding: '0.4rem 1.5rem'}}
                                                    onClick={(e) => handleApplyFilter(e)}
                                                >
                                                    <FormattedMessage id="APPLY_FILTER"/>
                                                </button>
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="d-flex justify-content-end">
                                            <div className="col-12 col-md-5 d-flex">
                                                <label htmlFor="filterDropdown" 
                                                    className="form-label me-2 d-flex align-items-center justify-content-center mb-2" 
                                                    style={{minWidth: "100px"}}
                                                ><FormattedMessage id="SORT_BY"/>:</label>
                                                <select
                                                    id="filterDropdown"
                                                    className="form-select mb-2 border-0"
                                                    value={sortOption}
                                                    onChange={handleSortChange}
                                                >
                                                    <option value='Latest'>{locale == "nl" ? "Nieuwste" : "Latest"}</option>
                                                    <option value="highToLow">{locale == "nl" ? "Prijs: Hoog naar Laag" : "Price: High to Low"}</option>
                                                    <option value="lowToHigh">{locale == "nl" ? "Prijs: Laag naar Hoog" : "Price: Low to High"}</option>
                                                    {/* Add more filter options as needed */}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row g-4 pt-3">
                                            {!searchedProducts.length && <div className='w-100 text-center mt-4'>
                                                <div>No products available</div>
                                            </div>}
                                            {searchedProducts.map((product: any, index: any) => {
                                                return (
                                                    <div className="col-12 col-sm-12 col-md-6 col-xl-4  mb-4" key={index}>
                                                    {(product.attributes?.sale?.data?.attributes?.discount_percentage_value != 0 && product?.attributes?.sale?.data != null)&& (
                                                      locale == "nl" ?   <span  className="sale-tag position-absolute">{product.attributes?.sale?.data?.attributes?.nl_discount_text}</span>
                                                      :
                                                      <span  className="sale-tag position-absolute">{product.attributes?.sale?.data?.attributes?.en_discount_text}</span>
                                                    )}
                                                        <div className="latest-prods card card-shadows" style={{height: "100%"}}>
                                                        <AppImage 
                                                                src={BASE_URL + product?.attributes?.product_image?.data?.attributes?.url} 
                                                                className="card-img-top img-prod-height pointer "
                                                                style={{height: '20rem', objectFit: 'contain', borderTopLeftRadius: "30px", borderTopRightRadius: "30px", filter:`${product.attributes.stock_count <= 0 ? "blur(3px)" : "none"}`}} 
                                                                onClick={() => handleProductClick(product)}    
                                                            />
                                                            {
                                                            product.attributes.stock_count <= 0 &&  
                                                                <div  onClick={() => handleProductClick(product)} className='out-of-stock d-flex position-absolute justify-content-center align-items-center' >
                                                                   <p className='text-out-of-stock mb-0'><FormattedMessage id="OUT_OF_STOCK"/></p>
                                                                </div>
                                                             }
                                                            <div className="card-body">
                                                                <div className="row g-1">
                                                                    <div className="col-12">
                                                                        <span className="article-number regularfont mini-text"><FormattedMessage id="ARTICLE"/> #{product?.attributes?.article_number}</span>
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
                                                                        {
                                                                            (product.attributes?.sale?.data?.attributes?.discount_percentage_value != 0 && product?.attributes?.sale?.data != null) ?
                                                                                <span className="product-price"><s>€{product?.attributes?.price}</s> €{discountedPrice(product.attributes.price, product.attributes.sale.data.attributes.discount_percentage_value)}</span>
                                                                                :
                                                                                <span className="product-price">€{product?.attributes?.price}</span>
                                                                        }
                                                                        { product.attributes.stock_count <= 0 ? (
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
                                        {pageCount && 
                                            <div className="row mt-5">
                                            <div className="col text-center">
                                                <ul className="pagination d-inline-flex">
                                                    <li className="page-item">
                                                        {pageNumber !== 1 ? (
                                                            <a
                                                                onClick={() => handlePageChange(pageNumber - 1)}
                                                                className="page-link border-0 regularfont mini-text-1"
                                                                href="#"
                                                            >
                                                                <i className="fa fa-angle-left custom-color-4 mini-text-1 m-1"></i> <FormattedMessage id="PREVIOUS"/>
                                                            </a>
                                                        ) : (
                                                            <a
                                                                className="page-link border-0 regularfont mini-text-1 disabled custom-color-4"
                                                                style={{ cursor: "not-allowed" }}
                                                            >
                                                                <i className="fa fa-angle-left custom-color-4 mini-text-1 m-1"></i> <FormattedMessage id="PREVIOUS"/>
                                                            </a>
                                                        )}
                                                    </li>
                                                    {pageRange.map((page: number, idx: number) => {
                                                        return (
                                                            <li className={`page-item ${page === pagination.page ? 'active': ''}`} key={idx}>
                                                                <a onClick={() => handlePageChange(page)} className="page-link border-0 custom-color-3 regularfont mini-text-1" href="#">{page}</a>
                                                            </li>
                                                        )
                                                    })}
                                                   
                                                    <li className="page-item">
                                                    { pageCount &&
                                                        pageCount == pageNumber || pageCount == '1' ? 

                                                        <a className="page-link border-0 custom-color-4 regularfont mini-text-1 disabled"
                                                        style={{ cursor: "not-allowed" }} 
                                                        >
                                                            <FormattedMessage id="NEXT"/>
                                                             <i className="fa fa-angle-right custom-color-4 mini-text-1 m-1  ">
                                                            </i>
                                                        </a>
                                                          :
                                                          <a onClick={() => handlePageChange(pageNumber+ 1)} className="page-link border-0 custom-color-3 regularfont mini-text-1"
                                                          href="#"
                                                      ><FormattedMessage id="NEXT"/> <i className="fa fa-angle-right custom-color-3 mini-text-1 m-1"></i></a>
                                                    }
                                                        
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        }
                                        
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
        </>
    );
}

export default Shop;
