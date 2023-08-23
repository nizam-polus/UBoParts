import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '../shared/AppImage';
import Header_home from '../header_/Header_home';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

function Cart() {
    const token = '06260c6d8d00a89764faeed708915d97ec4e9f184ad6ab627cca06ac48af38cb943fce62340d5a330a019077b4fa6462b6f6a84000b412cd4cb6022ad1c5725b03ba10849d61dc0862615204e05d01be610c0074dba6ab23f3ec2f9753587a4233e30546f13424d5eba13dea15e6e0f04595c2da1e6335bb947889472ebeb081'
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    const [cartProducts, setCartProducts] = useState<any>([]);
    const [totalCartPrice, setTotal] = useState(0);
    const router = useRouter();

    useEffect(() => {
        axios.post('http://52.6.187.235:1337/api/getcartdetails', { "customerid": "2" }, { headers },)
            .then((response: any) => {
                console.log('response :>> ', response);
                setCartProducts(response.data.rows);
                if (response.data.rows.length) {
                    let total = 0;
                    for (const obj of response.data.rows) {
                        total += obj.total_price;
                    }
                    console.log('total :>> ', total);
                    setTotal(total);
                }
            })
            .catch((error) => {
                // setError(error);
            });
    }, []);

    const handleCartItemDelete = (product: any) => {
        axios.post('http://52.6.187.235:1337/api/deletecartdata', {customerid: product.customer_id, id: product.id}, {headers})
        .then(response => {
            console.log(response);
            axios.post('http://52.6.187.235:1337/api/getcartdetails', { "customerid": "2" }, { headers },)
            .then((response: any) => {
                console.log('response :>> ', response);
                setCartProducts(response.data.rows);
                if (response.data.rows.length) {
                    let total = 0;
                    for (const obj of response.data.rows) {
                        total += obj.total_price;
                    }
                    console.log('total :>> ', total);
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

    const handleQuantityChange = (product: any, valueChange: string, index: number) => { 
        console.log(product)
        let quantity = product.quantity;
        if (valueChange === 'inc') {
            quantity++;
        }
        if (valueChange === 'dec') {
            quantity !== 1 && quantity--;
        }
        axios.post('http://52.6.187.235:1337/api/updatecartdata', {customerid: '2', id: product.id, quantity: quantity, productprice: product.price}, {headers}).then(response => {
            console.log(response);
            axios.post('http://52.6.187.235:1337/api/getcartdetails', { "customerid": "2" }, { headers },)
            .then((response: any) => {
                console.log('response :>> ', response);
                setCartProducts(response.data.rows);
                if (response.data.rows.length) {
                    let total = 0;
                    for (const obj of response.data.rows) {
                        total += obj.total_price;
                    }
                    console.log('total :>> ', total);
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
            <div className='page_header'>
                <Header_home />
            </div>
            
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
                                                        <AppImage src="images/cat-prod-1.svg" className="rounded" />
                                                    </td>
                                                    <td className="p-3 custom-color-3 regularfont mini-text-2">
                                                        <div>
                                                            <Link href={'/products_/'+product.product_id}>
                                                                <span style={{textDecoration: 'none', cursor: 'pointer'}}>{product.title}</span>
                                                            </Link>
                                                        </div>
                                                        {/* <div className="d-md-flex">
                                                            <span>Kila International</span>
                                                            <span className="in-stock custom-color-6 rounded-pill d-flex mini-text-4">Seller</span></div> */}
                                                    </td>
                                                    <td className="p-3 custom-color-3 semifont mini-text-3 text-center ">€{product.price}</td>
                                                    <td className="p-3 custom-color-3 regularfont">
                                                        <div className="input-group quanitity-box quanitity-incrementor">
                                                        <span className="input-group-btn plus-icon regularfont" onClick={() => handleQuantityChange(product, 'dec', index)}>
                                                                <i className="fa fa-minus mini-text-0 mini-text-0-color " aria-hidden="true"></i>
                                                            </span>
                                                            <input type="text" 
                                                                name="quant[1]" 
                                                                className="form-control input-number text-center rounded-pill border-0 regularfont px-2 pb-1 pt-1 mini-text-3 h-auto" 
                                                                value={product.quantity} min="1" max="10"
                                                                onChange={(e) => product.quantity = e.target.value}
                                                            />
                                                            <span className="input-group-btn minus-icon regularfont" onClick={() => handleQuantityChange(product, 'inc', index)}>
                                                                <i className="fa fa-plus mini-text-0 mini-text-0-color " aria-hidden="true"></i>
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 custom-color-3 semifont mini-text-3 text-center">€{product.total_price}</td>
                                                    <td className='pl-3'><i className='fa fa-trash' onClick={() => handleCartItemDelete(product)}></i></td>
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
                                                <td className="pb-4 pt-1 pr-0 pl-3 semifont boldfontsize border-top-0"> Total</td>
                                                <td className="pb-4 pt-1 pl-0 semifont boldfontsize border-top-0 custom-color-3">€{totalCartPrice}</td>
                                            </tr>
                                            <tr><td colSpan={2} className="p-3 pb-4 w-100"><button type="button" className=" w-100 proceed-to-checkout custom-color-7 semifont mini-text-3 rounded border-0 button-bg-color-1"><AppLink href="/checkoutpage" className="custom-color-7"><button type="button" className=" w-100 proceed-to-checkout custom-color-7 semifont mini-text-3 rounded border-0 button-bg-color-1">Proceed to checkout</button></AppLink></button></td></tr>
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