// react
import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import AppImage from '../shared/AppImage';
import Header_logged_in from '../header_/Header-logged-in';
import Footer from '../footer_/Footer';
import { useRouter } from 'next/router';
import axios from 'axios';
import Notification from '../notification/notification';
import Link from 'next/dist/client/link';

function Productsingle() {

    const token = '2c82df0e9f171ad5cea40c8451ce811b84d898b32e03b43ecec923457735b5ce6446ffcd68659ff11fd6bd1e1f4ba89498a58e30229a15fe683147d245498446d8ebb0c1e56437835fbd320246fd4519f7c23cf04c9eb29aff57c21052913af1b8f60432385cd21b6325ced78ecedd666a58bd0e80f44cf60d56e82d5cc022cb'
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    const router = useRouter();
    const id = router.query.id;
    const [productData, setProductData]:any = useState()
    const [productImage, setProductImage]: any = useState()
    const [productGallery, setProductGallery] = useState([])
    const [quantity, setQuantity] = useState(1)
    const [showMessage, setShowMessage] = useState(false)
    const [type, setType] = useState('success')
    const [message, setMessage] = useState('')

    useEffect(() => {
        axios.get('http://10.199.100.156:1337/api/products/' + id + '?populate=*', {headers}).then(response => {
            console.log(response);
            let product = response.data.data;
            let productGallery = response.data.data.attributes?.product_gallary_image?.data;
            let productImage = response.data.data.attributes?.product_gallary_image?.data[0]?.attributes?.url;
            setProductData(product);
            setProductGallery(productGallery);
            setProductImage(productImage);
        }).catch(err => console.log(err))
    }, []);

    const handleImageChange = (url: string) => {
        setProductImage(url);
    }

    const handleAddToCart = () => {
        axios.post('http://10.199.100.156:1337/api/cartdata',
            {
                customerid: '2',
                productid: productData?.id,
                quantity: quantity,
                productprice: productData?.attributes?.price
            }, {headers},
        ).then(response => {
            console.log(response);
            setShowMessage(true);
            setType('success')
            setMessage('Items successfully added to cart')
            setTimeout(() => {
                setShowMessage(false)
            }, 4000)
        }).catch(err => {
            setShowMessage(true)
            setType('danger')
            setMessage('Something went wrong')
            setTimeout(() => {
                setShowMessage(false)
            }, 4000)
        })
    }
    

    return (
        <>
            <Header_logged_in />
            <div className="main-body pb-5 mb-5">
                <div className="container">
                    <section className="products-description-wrapper mt-5 mb-5">
                        <div className="row">
                            <div className="col-12 col-md-6 col-lg-4">
                                <div className="row">
                                <AppImage className="rounded w-100" src={"http://10.199.100.156:1337" + productImage}/>
                                </div>
                                <div className="row product-thumbnails g-3 mt-3 justify-content-center">
                                {productGallery.map((galleryImg: any) => {
                                    return (
                                        <div className="col-auto px-2" 
                                            style={{"cursor": "pointer"}}
                                            onClick={() => handleImageChange(galleryImg?.attributes?.url)}
                                        >
                                            <img className="rounded" src={"http://10.199.100.156:1337" + galleryImg?.attributes?.url}/>
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
                                <p><span className="product-price custom-color-3 regularfont boldfontsize">€{productData?.attributes?.price}</span></p>
                                <hr/>
                                <p className="semifont placeholderfontsize custom-color-5 mb-1">Key Features:</p>
                                <ul className="list-group custom-color-2 regularfont placeholderfontsize p-3 pt-0 pb-4">
                                    <li className="mb-1">Make: {productData?.attributes?.cardetail?.data?.attributes?.make}</li>
                                    <li className="mb-1">Model: {productData?.attributes?.cardetail?.data?.attributes?.model}</li>
                                    <li>Year: {productData?.attributes?.cardetail?.data?.attributes?.year}</li>
                                </ul>
                                <hr/>
                                {/* <p className="custom-color-6 regularfont mini-text-2">See Full Specifications</p> */}
                            </div>
                            <div className="col-12 col-md-12 col-lg-3 mt-5 mt-lg-0">
                                <div className="more-info p-3 rounded">
                                    <div className="row d-flex justify-content-between">
                                        <div className="col-auto"><span className="product-price custom-color-3 regularfont">€{quantity * productData?.attributes?.price}</span></div>
                                        <div className="col-auto"><span className="in-stock custom-color-6 rounded-pill px-3 pb-1 pt-1 d-flex mini-text-2 semifont">In Stock</span></div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-12">
                                            {/* <div className="row pt-1 pb-1 border-bottom-row">
                                                <div className="col-4 col-xl-5"><span className="semifont mini-text-3 custom-color-3">Saller:</span></div>
                                                <div className="col-8 col-xl-7"><span className="semifont mini-text-3 seller-name">Kila International AUODEMONTAGEBED</span></div>
                                            </div> */}
                                            <div className="row pt-1 pb-1 border-bottom-row">
                                                <div className="col-4 col-xl-5"><span className="semifont mini-text-3 custom-color-3">Category:</span></div>
                                                <div className="col-8 col-xl-7"><span className="semifont mini-text-3 seller-name">{productData?.attributes?.category?.data?.attributes?.category_name}</span></div>
                                            </div>
                                            <div className="row pt-1 pb-1 border-bottom-row">
                                                <div className="col-4 col-xl-5"><span className="semifont mini-text-3 custom-color-3">Article #</span></div>
                                                <div className="col-8 col-xl-7"><span className="semifont mini-text-3 seller-name">{productData?.attributes?.article_number}</span></div>
                                            </div>
                                            <div className="row pt-1 pb-1 border-bottom-row">
                                                <div className="col-4 col-xl-5"><span className="semifont mini-text-3 custom-color-3">Country:</span></div>
                                                <div className="col-8 col-xl-7"><span className="semifont mini-text-3 seller-name">
                                                    {productData?.attributes?.countries?.data.map((country: any, i: any) => 
                                                        { return (
                                                            <span>{country?.attributes.country}{productData?.attributes?.countries?.data.length !== i+1 ? ", " : ""}</span>
                                                        )})
                                                    }
                                                </span></div>
                                            </div>
                                            <div className="row pt-1 pb-1">
                                                <div className="col-4 col-md-4 col-lg-12 col-xl-5">
                                                    <div className="input-group quanitity-box mt-3 quanitity-incrementor">
                                                        <span className="input-group-btn plus-icon semifont"
                                                            onClick={() => quantity !== 1 && setQuantity(quantity - 1)}
                                                        >
                                                            <i className="fa fa-plus mini-text-3" aria-hidden="true"></i>
                                                        </span>
                                                        <input 
                                                            type="text" name="quant[1]" 
                                                            className="form-control input-number text-center rounded border-0 semifont pb-2 pt-2 mini-text-3 h-auto"
                                                            value={quantity} min="1" max="10"/>
                                                        <span className="input-group-btn minus-icon semifont" 
                                                            onClick={() => setQuantity(quantity + 1)}
                                                        >
                                                            <i className="fa fa-plus mini-text-3" aria-hidden="true"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-8 col-md-8 col-lg-12 col-xl-7">
                                                    <a className="add-to-cart-1 button-bg-color-1 custom-color-7 rounded  pb-2 pt-2 mt-3 text-center mini-text-3 text-white"
                                                       style={{cursor: 'pointer'}}
                                                       onClick={handleAddToCart}
                                                    >Add to Cart</a>
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
                                            <button className="nav-link active custom-color-3 regularfont body-sub-titles" id="description-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab" aria-controls="home" aria-selected="true">Description</button>
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
                                        {/* <div className="tab-pane fade custom-color-3 regularfont select-options" id="specifications" role="tabpanel" aria-labelledby="specifications-tab">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.</div>
                                        <div className="tab-pane fade custom-color-3 regularfont select-options" id="features" role="tabpanel" aria-labelledby="features-tab">It is a long established fact that a reader will be distracted by the readable content of a page when looking</div>
                                        <div className="tab-pane fade custom-color-3 regularfont select-options" id="faq" role="tabpanel" aria-labelledby="faq-tab">It is a long established fact that a reader will be distracted by the readable content of a page when looking</div>
                                        <div className="tab-pane fade custom-color-3 regularfont select-options" id="ratings" role="tabpanel" aria-labelledby="ratings-tab">It is a long established fact that a reader will be distracted by the readable content of a page when looking</div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="latest-products-wrapper">
                        <div className="row mt-5">
                            <div className="col-12 d-lg-flex justify-content-between">
                                <div><span className="popular_categories body-sub-titles regularfont">Related Products</span>
                                </div>
                                <div className="mt-3 mt-lg-0">
                                    <button type="button" className="saleoffers regularfont body-sub-titles active">All</button>
                                    <button type="button" className="saleoffers regularfont body-sub-titles">Audio</button>
                                    <button type="button" className="saleoffers regularfont body-sub-titles">Lights</button>
                                    <button type="button" className="saleoffers regularfont body-sub-titles">Body Parts</button>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="latest-products-second-wrapper mb-5">
                        <div className="row mt-5 mt-lg-3 mt-xxl-5 g-4">
                            <div className="col-6 col-md-3">
                                <div className="latest-prods card">
                                <AppImage src="/images/cat-prod-1.svg" className="card-img-top"/>
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
                                                 <AppImage src="/images/cart-svg.svg"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="latest-prods card">
                                <AppImage src="/images/cat-prod-1.svg" className="card-img-top"/>
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
                                                 <AppImage src="/images/cart-svg.svg"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="latest-prods card">
                                     <AppImage src="/images/cat-prod-1.svg" className="card-img-top"/>
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
                                                 <AppImage src="/images/cart-svg.svg"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="latest-prods card">
                                <AppImage src="/images/cat-prod-1.svg" className="card-img-top"/>
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
                                                 <AppImage src="/images/cart-svg.svg"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

export default Productsingle;
