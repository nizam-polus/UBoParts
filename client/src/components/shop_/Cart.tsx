import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '../shared/AppImage';
import { useRouter } from 'next/router';
import Link from 'next/link';
import APIs from '~/services/apiService';
import { BASE_URL } from 'configuration';
import { UserContext } from '../account_/UserContext';

function Cart() {

    const { user, saveUser } = UserContext();
    const [cartProducts, setCartProducts] = useState<any>([]);
    const [totalCartPrice, setTotal] = useState(0);
    

    const router = useRouter();

    useEffect(() => {
        APIs.getCartData({ "customerid": user.id }).then((response: any) => {
            setCartProducts(response.data.rows);
            if (response.data.rows.length) {
                let total = 0;
                for (const obj of response.data.rows) {
                    total += obj.total_price;
                }
                setTotal(total);
            }
        })
            .catch((error) => {
                // setError(error);
            });
    }, []);

    const handleCartItemDelete = (product: any) => {
        APIs.deleteCartData({ customerid: product.customer_id, id: product.id }).then(response => {
            APIs.getCartData({ "customerid": user.id }).then((response: any) => {
                setCartProducts(response.data.rows);
                let total = 0;
                if (response.data.rows.length) {
                    for (const obj of response.data.rows) {
                        total += obj.total_price;
                    }
                }
                setTotal(total);
            })
                .catch((error) => {
                    // setError(error);
                });
        }).catch(err => {
            console.log(err);
        })
    }

    const handleQuantityChange = (product: any, valueChange: string, index: number) => {
        let quantity = product.quantity;
        if (valueChange === 'inc') {
            quantity++;
        }
        if (valueChange === 'dec') {
            quantity !== 1 && quantity--;
        }
        APIs.updateCartData({ customerid: user.id, id: product.id, quantity: quantity, productprice: product.price }).then(response => {
            APIs.getCartData({ "customerid": user.id }).then((response: any) => {
                setCartProducts(response.data.rows);
                if (response.data.rows.length) {
                    let total = 0;
                    for (const obj of response.data.rows) {
                        total += obj.total_price;
                    }
                    setTotal(total);
                }
            })
                .catch((error) => {
                    // setError(error);
                });
        }).catch(err => {
            console.log(err);
        })
    }

    

   

    return (
        <>
            <div className="main-body pb-4 pt-4">
                <div className="container pb-4">
                    <section className="card-wrapper">
                        <div className="row">
                            <div className="col text-center pt-2 pb-2">
                                <span className="semifont bg-image-text custom-color-8 text-center">Shopping Cart</span>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-12 col-md-9">
                                <div className="table-responsive">
                                    <table className="table cart-table coulmn-bg-color-1 rounded ">
                                        <tbody>
                                            <tr className="border-bottom ">
                                                <th className=" p-3 custom-color-3 regularfont boldfontsize text-center border-top-0 lightfotweight col-sm-2">IMAGE</th>
                                                <th className=" p-3 custom-color-3 regularfont boldfontsize border-top-0 lightfotweight col-sm-5">PRODUCT</th>
                                                <th className=" p-3 custom-color-3 regularfont boldfontsize text-center border-top-0 lightfotweight col-sm-2">PRICE</th>
                                                <th className=" p-3 custom-color-3 regularfont boldfontsize text-center border-top-0 lightfotweight col-sm-1">QUANTITY</th>
                                                <th className=" p-3 custom-color-3 regularfont boldfontsize text-center border-top-0 lightfotweight col-sm-2">TOTAL</th>
                                                <th className=" pr-3 custom-color-3 regularfont boldfontsize text-center border-top-0 lightfotweight col-sm-2">DELETE</th>
                                            </tr>
                                            {cartProducts && cartProducts.map((product: any, index: any) => {
                                                return (<tr>
                                                    <td className="p-3 text-center">
                                                        <AppImage src={BASE_URL + product.url} className="rounded" />
                                                    </td>
                                                    <td className="p-3 custom-color-3 regularfont mini-text-2">
                                                        <div>
                                                            <Link href={'/products_/' + product.product_id}>
                                                                <span style={{ textDecoration: 'none', cursor: 'pointer' }}>{product.title}</span>
                                                            </Link>
                                                        </div>
                                                        {/* <div className="d-md-flex">
                                                            <span>Kila International</span>
                                                            <span className="in-stock custom-color-6 rounded-pill d-flex mini-text-4">Seller</span></div> */}
                                                    </td>
                                                    <td className="p-3 custom-color-3 semifont mini-text-3 text-center ">€{product.price}</td>
                                                    <td className="p-3 custom-color-3 regularfont">
                                                        <div className="input-group quanitity-box quanitity-incrementor">
                                                            <span className="input-group-btn plus-icon regularfont pointer" onClick={() => handleQuantityChange(product, 'dec', index)}>
                                                                <i className="fa fa-minus mini-text-0 mini-text-0-color " aria-hidden="true"></i>
                                                            </span>
                                                            {/* <input type="text" 
                                                                name="quant[1]" 
                                                                style={{ maxHeight: '20px' }}
                                                                className="form-control input-number text-center rounded-pill border-0 regularfont px-2 pb-1 pt-1 mini-text-3 h-auto" 
                                                                value={product.quantity} min="1" max="10"
                                                                onChange={(e) => product.quantity = e.target.value}
                                                            /> */}

                                                            <input type="text"
                                                                name="quant[1]"
                                                                style={{ maxHeight: '25px' }}
                                                                className="form-control input-number text-center rounded-pill border-0 regularfont px-2 pb-1 pt-1 mini-text-3 h-auto"
                                                                value={product.quantity} 
                                                                min="1" max="10"
                                                                onChange={(e) => {
                                                                    const newQuantity = e.target.value;
                                                                    
                                                                    // Update the local product quantity immediately
                                                                    product.quantity = newQuantity;
                                                            
                                                                    // Make the API call to update the cart data
                                                                    APIs.updateCartData({
                                                                        customerid: user.id,
                                                                        id: product.id,
                                                                        quantity: newQuantity,
                                                                        productprice: product.price
                                                                    }).then(response => {
                                                                        // After updating the cart data, fetch the updated cart data
                                                                        APIs.getCartData({ customerid: user.id }).then((response) => {
                                                                            setCartProducts(response.data.rows);
                                                                            if (response.data.rows.length) {
                                                                                let total = 0;
                                                                                for (const obj of response.data.rows) {
                                                                                    total += obj.total_price;
                                                                                }
                                                                                setTotal(total);
                                                                            }
                                                                        }).catch((error) => {
                                                                            // Handle any errors that occur during fetching
                                                                            console.error(error);
                                                                        });
                                                                    }).catch(err => {
                                                                        // Handle any errors that occur during the updateCartData API call
                                                                        console.error(err);
                                                                    });
                                                                }}
                                                            />

                                                            <span className="input-group-btn minus-icon regularfont pointer" onClick={() => handleQuantityChange(product, 'inc', index)}>
                                                                <i className="fa fa-plus mini-text-0 mini-text-0-color " aria-hidden="true"></i>
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 custom-color-3 semifont mini-text-3 text-center">€{product.total_price}</td>
                                                    <td className='pl-3'><i className='fa fa-trash pointer' onClick={() => handleCartItemDelete(product)}></i></td>
                                                </tr>)
                                            })}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td className="p-3" colSpan={2}>
                                                    <Link href={'/shop'}><button type="button"
                                                        className="add-more-rows custom-color-7 semifont mini-text-3 rounded border-0 button-bg-color-1"
                                                    >Add more items</button></Link>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <div className="col-12 col-md-3">
                                <div className="table-responsive">
                                    <table className="cart-total table coulmn-bg-color-1 rounded">
                                        <tbody >
                                            <tr>
                                                <th className="p-3 custom-color-3 boldfont subtitles-1 border-top-0">Cart Total</th>
                                            </tr>

                                            <tr className="border-top">
                                                <td className="pb-1 pt-4 pl-3 regularfont placeholderfontsize border-top-0">Subtotal</td>
                                                <td className="pb-1 pt-4 semifont border-top-0 menu_font_size custom-color-3">€{totalCartPrice}</td>
                                            </tr>
                                            <tr>
                                                <td className="pb-0 pt-0 pr-0 pl-3 semifont boldfontsize border-top-0"> <hr className="p-0 m-0 " /></td>
                                                <td className="pb-0 pt-0 pl-0 pr-4 regularfont boldfontsize border-top-0"> <hr className="p-0 m-0" /></td>
                                            </tr>
                                            <tr>
                                                <td className="pb-2 pt-1 pr-0 pl-3 semifont boldfontsize border-top-0"> Total</td>
                                                <td className="pb-2 pt-1 pl-0 semifont boldfontsize border-top-0 custom-color-3">€{totalCartPrice}</td>
                                            </tr>
                                            <tr><td colSpan={2} className="px-3 pt-3 pb-2 w-100">
                                                <button type="button" className=" w-100 proceed-to-checkout custom-color-7 semifont mini-text-3 rounded border-0 button-bg-color-1">
                                                    <AppLink href={`${cartProducts?.length ? '/checkoutpage' : '/cartpage'}`} className="custom-color-7">
                                                        <button type="button" className=" w-100 proceed-to-checkout custom-color-7 semifont mini-text-3 rounded border-0 button-bg-color-1"
                                                        >Proceed to checkout</button>
                                                    </AppLink>
                                                </button>
                                            </td></tr>
                                            <tr>
                                                <td className="advanced_search pb-2 pt-0 pr-0 pl-4 semifont mini-text-1 border-top-0">* Shipping cost will be extra</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
export default Cart;