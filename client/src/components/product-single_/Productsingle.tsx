// react
import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import AppImage from '../shared/AppImage';
import Footer from '../footer_/Footer';
import { useRouter } from 'next/router';
import Link from 'next/dist/client/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import APIs from '~/services/apiService';
import { BASE_URL } from 'configuration';
import { UserContext } from '../account_/UserContext';
import Login from '../account_/Login';
import { FormattedMessage } from 'react-intl';

function Productsingle() {

    let locale: any;
    
    if(typeof window !== 'undefined'){
        locale = localStorage.getItem("locale")
    }

    const {user, saveUser, cartCount, setCartCount} = UserContext();
    const router = useRouter();
    const id = router.query.id;

    const [productData, setProductData] = useState<any>({})
    const [productImage, setProductImage] = useState<any>({})
    const [productGallery, setProductGallery] = useState([])
    const [quantity, setQuantity] = useState(1);
    const [openLogin, setOpenLogin] = useState(false);
    const [addToCartCompleted, setAddToCartCompleted] = useState<any>(true)
    const [stockCount , setStockCount] = useState(1)
    const [latestItems, setLatestItems] = useState([]);
    const [products,setProducts] = useState<any>([])
    const [productCategory, setProductCategory] = useState("")
    
    useEffect(() => {
        APIs.getProduct(id).then(response => {
            let product = response.data.data;
            let productGallery: any = [];
            let productImage = response.data.data.attributes?.product_image?.data.attributes.url;
            productGallery.unshift({attributes: {url: productImage}})
            if (response.data.data.attributes?.product_gallary_image?.data) {
                let gallery = response.data.data.attributes?.product_gallary_image?.data;
                for(let obj of gallery) {
                    productGallery.push(obj);
                }
            }
            let productStock = response.data.data.attributes?.stock_count
            let productCategory = response.data.data.attributes?.category.data.attributes.category_name
           
            setStockCount(productStock)
            setProductData(product);
            setProductGallery(productGallery);
            setProductImage(productImage);
            setProductCategory(productCategory) 
        }).catch(err => console.log(err))
    }, []);

    const handleImageChange = (url: string) => {
        setProductImage(url);
    }

    const handleAddToCart = () => {
        if (!user || user && !user.id) {
            setOpenLogin(true);
        } else {
            setAddToCartCompleted(false)
            let productQuantityInCart = 0
            let cartData = {
                customerid: user.id,
                productid: productData?.id,
                quantity: quantity,
                productprice: productData?.attributes?.price,
                "productWeight": productData?.attributes?.product_weight,
                "discountPrice": discountAmount(productData?.attributes?.price, productData?.attributes?.sale?.data?.attributes?.discount_percentage_value),
            }
           
            APIs.getCartData({ customerid: user.id }).then(response => {
                let productCartItems = response.data.rows;
                for (const cartItem of productCartItems) {
                    if (cartItem.product_id === productData?.id) {
                        productQuantityInCart = cartItem.quantity + quantity;
                        break; 
                    }
                }
                APIs.getProduct(cartData.productid).then(response => {
                    let productStock = response.data.data.attributes.stock_count;
                    if ((productQuantityInCart <= productStock )&& (quantity <= productStock)) {
                        APIs.addToCart(cartData).then(response => {
                            toast.success(() => (
                                <>
                                    <FormattedMessage id="ITEM_ADDED_TO"/><Link href={"/cartpage"}>{locale == "nl" ? "Winkelwagen" : "cart"}</Link>
                                </>
                            ));
                            APIs.getCartData({ customerid: user.id }).then(response => {
                                setCartCount(response.data.rows.length);
                            }).then(() => setAddToCartCompleted(true));
                        }).catch(err => {
                            toast.error(() => (
                                <>
                                <FormattedMessage id="SOMETHING_WRONG_CART" />
                                </>
                            ));
                            setAddToCartCompleted(true)
                        });
                    } else {
                        toast.error(() => (
                            <>
                            <FormattedMessage id="STOCK_EXCEEDED" />
                            </>
                        ));
                        setAddToCartCompleted(true)
                    }
                }).catch(err => {
                    toast.error(() => (
                        <>
                        <FormattedMessage id="SOMETHING_WRONG_FETCHING" />
                        </>
                    ));
                    setAddToCartCompleted(true)
                });
            }).catch(err => {
                toast.error(() => (
                    <>
                    <FormattedMessage id="SOMETHING_WRONG" />
                    </>
                ));
                setAddToCartCompleted(true)
            })
        }
    }

    const loginModalClose = () => {
        setOpenLogin(false);
    };

    const handleQuantityChange = (newValue : any) =>{
       setQuantity(newValue)
    }

    useEffect(() => {
        APIs.getAllProducts('&sort[0]=createdAt:desc').then((response: any) =>{
           setProducts(response.data.data)
        })
       }, [])

       
    useEffect(() => {
        const getLatestItemsByCategory = (categoryName: any) => {
           
        if (!products || products.length === 0) {
             return []; 
        }
        if (categoryName === 'All') {
            return products.slice(0, 4);
        } else {
                const filteredProducts = products.filter(
                (product: any) => (
                (product.attributes.category.data.attributes.category_name === categoryName ) && (product.id != id)
                )
            );
            return  filteredProducts.slice(0, 4);
        }
    };
        setLatestItems(getLatestItemsByCategory(productCategory));
    }, [products, productCategory]);
   
    const handleProductClick = (product: any) => {
            const newUrl = `/products_/${product.id}`;
            window.location.href = newUrl;
    }
    
    function discountedPrice(originalPrice: any, discountPercentage:any) {
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

    return (
        <>
            <Login isOpen={openLogin} onClose={loginModalClose} />
            <div className="main-body pb-5 mb-5">
                <div className="container">
                    <section className="products-description-wrapper mt-5 mb-5">
                        <div className="row">
                            <div className="col-12 col-md-6 col-lg-4">
                                <div className="row">
                                    <AppImage style={{objectFit: 'contain', height: '30rem'}} className="rounded w-100" src={BASE_URL + productImage}/>
                                </div>
                                <div className="row product-thumbnails g-3 mt-3 justify-content-center">
                                {productGallery && productGallery.map((galleryImg: any) => {
                                    return (
                                        <div className="col-auto px-2" 
                                            style={{"cursor": "pointer"}}
                                            onClick={() => handleImageChange(galleryImg?.attributes?.url)}
                                        >
                                            <img className="rounded" src={BASE_URL + galleryImg?.attributes?.url}/>
                                        </div>
                                    )
                                })}
                                    {/* <div className="col-auto px-2"><img className="rounded" src="/images/cat-prod-1.svg"/></div>
                                    <div className="col-auto px-2"><img className="rounded" src="/images/cat-prod-1.svg"/></div>
                                    <div className="col-auto px-2"><img className="rounded" src="/images/cat-prod-1.svg"/></div>
                                    <div className="col-auto px-2"><img className="rounded" src="/images/cat-prod-1.svg"/></div> */}
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-5 px-5 pb-lg-0 pt-lg-0 mt-5 mt-md-0 mt-lg-0">
                                <p className="semifont inner-page-main-headings custom-color-5">{productData?.attributes?.title}</p>
                                <p className="custom-color-3 regularfont placeholderfontsize mb-1">{productData?.attributes?.description}</p>
                                {/* <p className="mb-1">
                                    <span className="ratings">
                                        <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                        <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                        <i className="fa fa-star active placeholderfontsize" aria-hidden="true"></i>
                                        <i className="fa fa-star placeholderfontsize" aria-hidden="true"></i>
                                    </span>
                                    <span className="rating-count regularfont mini-text-1">675</span>
                                </p> */}
                                <p>
                                    {
                                        (productData.attributes?.sale?.data?.attributes?.discount_percentage_value != 0 && productData?.attributes?.sale?.data != null) ?
                                        <span className="product-price custom-color-3 regularfont boldfontsize"><s>€{productData?.attributes?.price}</s> €{discountedPrice(productData.attributes.price, productData.attributes.sale.data.attributes.discount_percentage_value)}</span>
                                        :
                                        <span className="product-price custom-color-3 regularfont boldfontsize">€{productData?.attributes?.price}</span>
                                    }
                                </p>
                                <hr/>
                                <p className="semifont placeholderfontsize custom-color-5 mb-1"><FormattedMessage id="KEY_FEATURES" />:</p>
                                <ul className="list-group custom-color-2 regularfont placeholderfontsize p-3 pt-0 pb-4">
                                    <li className="mb-1"><FormattedMessage id="MAKE" />: {productData?.attributes?.make?.data?.attributes?.make_name}</li>
                                    <li className="mb-1"><FormattedMessage id="MODEL" />: {productData?.attributes?.model?.data?.attributes?.model_name}</li>
                                    <li><FormattedMessage id="YEAR" />: {productData?.attributes?.year?.data?.attributes?.year}</li>
                                </ul>
                                <hr/>
                                {/* <p className="custom-color-6 regularfont mini-text-2">See Full Specifications</p> */}
                            </div>
                            <div className="col-12 col-md-12 col-lg-3 mt-5 mt-lg-0">
                                <div className="more-info p-3 rounded">
                                    <div className="row d-flex justify-content-between">
                                        <div className="col-auto">
                                            {
                                                 (productData.attributes?.sale?.data?.attributes?.discount_percentage_value != 0 && productData?.attributes?.sale?.data != null) ?
                                                    <span className="product-price"><s>€{quantity * productData?.attributes?.price}</s> €{discountedPrice(quantity *productData.attributes.price, productData.attributes.sale.data.attributes.discount_percentage_value)}</span>
                                                    :
                                                    <span className="product-price custom-color-3 regularfont">€{quantity * productData?.attributes?.price}</span>
                                            }
                                            
                                        </div>
                                        {stockCount > 0 ? 
                                         <div className="col-auto"><span className="in-stock custom-color-6 rounded-pill px-3 pb-1 pt-1 d-flex mini-text-2 semifont"><FormattedMessage id="IN_STOCK" /></span></div>
                                        :
                                        <div className="col-auto"><span className="in-stock custom-color-6 rounded-pill px-3 pb-1 pt-1 d-flex mini-text-2 semifont"><FormattedMessage id="OUT_OF_STOCK" /></span></div> }
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-12">
                                            {/* <div className="row pt-1 pb-1 border-bottom-row">
                                                <div className="col-4 col-xl-5"><span className="semifont mini-text-3 custom-color-3">Saller:</span></div>
                                                <div className="col-8 col-xl-7"><span className="semifont mini-text-3 seller-name">Kila International AUODEMONTAGEBED</span></div>
                                            </div> */}
                                            <div className="row pt-1 pb-1 border-bottom-row">
                                                <div className="col-4 col-xl-5"><span className="semifont mini-text-3 custom-color-3"><FormattedMessage id="CATEGORY" />:</span></div>
                                                <div className="col-8 col-xl-7"><span className="semifont mini-text-3 seller-name">{locale == "nl" ? productData?.attributes?.category?.data?.attributes?.category_name_nl : productData?.attributes?.category?.data?.attributes?.category_name}</span></div>
                                            </div>
                                            <div className="row pt-1 pb-1 border-bottom-row">
                                                <div className="col-4 col-xl-5"><span className="semifont mini-text-3 custom-color-3"><FormattedMessage id="ARTICLE" /> #</span></div>
                                                <div className="col-8 col-xl-7"><span className="semifont mini-text-3 seller-name">{productData?.attributes?.article_number}</span></div>
                                            </div>
                                            <div className="row pt-1 pb-1 border-bottom-row">
                                                <div className="col-4 col-xl-5"><span className="semifont mini-text-3 custom-color-3"><FormattedMessage id="WEIGHT" />:</span></div>
                                                <div className="col-8 col-xl-7"><span className="semifont mini-text-3 seller-name">
                                                {productData?.attributes?.product_weight} KG
                                                </span>
                                                </div>
                                            </div>
                                            <div className="row pt-1 pb-1 d-flex justify-content-center align-items-center">
                                                <div className="col-4 col-md-4 col-lg-12 col-xl-5">
                                                    <div className="input-group quanitity-box mt-3">
                                                        {quantity == 1 ?
                                                            <span style={{ cursor: "not-allowed" }} className="input-group-btn plus-icon semifont"
                                                            >
                                                                <i className="fa fa-minus mini-text-3" aria-hidden="true"></i>
                                                            </span>
                                                            :
                                                            <span className="input-group-btn plus-icon semifont"
                                                                onClick={() => quantity !== 1 && setQuantity(Number(quantity) - 1)}
                                                            >
                                                                <i className="fa fa-minus mini-text-3" aria-hidden="true"></i>
                                                            </span>
                                                        }
                                                        <input 
                                                            type="text" name="quant[1]" 
                                                            style={{ maxHeight: '25px' }}
                                                            className="form-control input-number text-center rounded border-0 semifont pb-2 pt-2 mini-text-3 h-auto"
                                                            value={quantity} min="1" max="10"
                                                            onChange={(e) => {
                                                                const newValue = e.target.value.replace(/[^0-9.]/g, '');
                                                                if (newValue === '0' || newValue == ""){
                                                                    e.target.value = '';
                                                                    // toast.error("Quantity cannot be zero(0) ");
                                                                }
                                                                else{
                                                                    handleQuantityChange(newValue);
                                                                }                                                              
                                                            }}
                                                            />
                                                            { quantity == stockCount ? 
                                                                <span className="input-group-btn minus-icon semifont" 
                                                                style={{cursor: "not-allowed"}}
                                                                >
                                                                    <i className="fa fa-plus mini-text-3" aria-hidden="true"></i>
                                                                </span>
                                                                :
                                                                <span className="input-group-btn minus-icon semifont" 
                                                                onClick={() => setQuantity(Number(quantity) + 1)}
                                                                >
                                                                <i className="fa fa-plus mini-text-3" aria-hidden="true"></i>
                                                                </span>
                                                            }
                                                    </div>
                                                </div>
                                                <div className="col-8 col-md-8 col-lg-12 col-xl-7">
                                                    {stockCount <= 0 ? (
                                                            <a className="add-to-cart-1 button-bg-color-05 custom-color-7 rounded pb-2 pt-2 mt-3 text-center mini-text-3 text-white"
                                                                style={{ cursor: 'not-allowed' }}
                                                            >
                                                                <FormattedMessage id="OUT_OF_STOCK" />
                                                            </a>
                                                        ) : addToCartCompleted ? (
                                                            <a className="add-to-cart-1 button-bg-color-1 custom-color-7 rounded pb-2 pt-2 mt-3 text-center mini-text-3 text-white"
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={handleAddToCart}
                                                            >
                                                                <FormattedMessage id="ADD_TO_CART" />
                                                            </a>
                                                        ) : (
                                                            <a className="add-to-cart-1 button-bg-color-05 custom-color-7 rounded pb-2 pt-2 mt-3 text-center mini-text-3 text-white"
                                                                style={{ cursor: 'not-allowed' }}
                                                            >
                                                                <FormattedMessage id="ADDING_TO_CART" />
                                                            </a>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="product-more-description">
                        <div className="row">
                            <div className="col">
                                <div className="coulmn-bg-color-1 rounded p-4 pt-2 pb-5">
                                    <ul className="nav nav-tabs justify-content-center justify-content-md-start" id="myTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link active custom-color-3 regularfont body-sub-titles" id="description-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab" aria-controls="home" aria-selected="true"><FormattedMessage id="DESCRIPTION" /></button>
                                        </li>
                                        {/* <li className="nav-item" role="presentation">
                                            <button className="nav-link custom-color-3 regularfont body-sub-titles" id="specifications-tab" data-bs-toggle="tab" data-bs-target="#specifications" type="button" role="tab" aria-controls="profile" aria-selected="false">Specifications</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link custom-color-3 regularfont body-sub-titles" id="features-tab" data-bs-toggle="tab" data-bs-target="#features" type="button" role="tab" aria-controls="contact" aria-selected="false">Features</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link custom-color-3 regularfont body-sub-titles" id="faq-tab" data-bs-toggle="tab" data-bs-target="#faq" type="button" role="tab" aria-controls="contact" aria-selected="false">FAQ</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link custom-color-3 regularfont body-sub-titles" id="ratings-tab" data-bs-toggle="tab" data-bs-target="#ratings" type="button" role="tab" aria-controls="contact" aria-selected="false">Ratings</button>
                                        </li> */}
                                    </ul>
                                    <div className="tab-content mt-4" id="myTabContent">
                                        {/* <div className="tab-pane fade show active custom-color-3 regularfont select-options" id="description" role="tabpanel" aria-labelledby="description-tab">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years</div> */}
                                        <div className="tab-pane fade show active custom-color-3 regularfont select-options" id="description" role="tabpanel" aria-labelledby="description-tab">
                                            {productData?.attributes?.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="latest-products-wrapper">
                        <div className="row mt-5">
                            <div className="col-12 d-lg-flex justify-content-between">
                                <div><span className="popular_categories body-sub-titles regularfont"><FormattedMessage id="RELATED_PRODUCTS"/></span>
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
                                                        <div className="latest-prods card card-shadows" style={{height: "100%"}}>   
                                                            <AppImage 
                                                                src={BASE_URL + product?.attributes?.product_image?.data?.attributes?.formats?.medium?.url} 
                                                                className="card-img-top img-prod-height pointer "
                                                                style={{height: '20rem', objectFit: 'contain', borderTopLeftRadius: "30px", borderTopRightRadius: "30px", filter:`${product.attributes.stock_count == 0 ? "blur(3px)" : "none"}`}} 
                                                                onClick={() => handleProductClick(product)}    
                                                            />
                                                            {
                                                            product.attributes.stock_count <= 0 &&  
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
                                                                     {/* { product.attributes.stock_count === 0 ? (
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
                                                                        } */}
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
            </div>
        </>
    );
}

export default Productsingle;
