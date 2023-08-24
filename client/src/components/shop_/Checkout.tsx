import React, { useCallback, useEffect, useState } from 'react';
import AppImage from '../shared/AppImage';
import Header_home from '../header_/Header_home';
import axios from 'axios';

function Checkout() {

    const token = '1038115969def4915ab7b14c9d5583d38a3305f256de2f5512ae6ee9551201716f465b5e6e1e61fc28ac0f78a2831731b4ba1549a0099f4efda222b572e4e47f8108f0569538ee578dc1abb0a8e1e2f10d410b08a73ae37b28a0feebc37f137ae82d2efb688fe7d6175c6b36573a831bb52e15914e20cb462874a817440853a0'
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const [checkoutProducts, setCheckoutProducts]: any = useState([])
    const [total, setTotal]: any = useState(0)

    useEffect(() => {
        axios.post('http://52.6.187.235:1337/api/getcartdetails', {customerid: '2'}, {headers}).then(response => {
            console.log(response);
            let checkoutProducts = response.data.rows;
            setCheckoutProducts(checkoutProducts);
            if (response.data.rows.length) {
                let total = 0;
                for (const obj of response.data.rows) {
                    total += obj.total_price;
                }
                console.log('total :>> ', total);
                setTotal(total);
            }
        }).catch(err => {
            console.log(err);
        })
    }, []);

    const handlepayment = () => {
        let cartData: any = [];
        checkoutProducts.forEach((element: any) => {
            let product = {
                name: '',
                price: 0,
                quantity: ''
            };
            product.name = element.title;
            product.price = typeof (element.price) == 'string' ? Number(element.price) * 100 : element.price * 100;
            product.quantity = element.quantity;
            cartData.push(product);
        });
        let totalPrice = typeof (total) == 'string' ? Number(total) * 100 : total * 100
        axios.post('http://52.6.187.235:1337/api/Payment-opp', {products: cartData, total_price: totalPrice}, {headers}).then(response => {
            console.log(response);
            let redirectUrl = response.data.redirect_url
            window.location.assign(redirectUrl);
        }).catch(err => console.log(err));
    }

    return (
        <>
            <div className='page_header'>
                <Header_home />
            </div>
            
            <div className="main-body pb-5 mb-5">
                <div className="container">
                    <section className="checkout-card-wrapper">
                        <div className="row mt-5">
                            <div className="col">
                                <p className="boldfont bg-image-text custom-color-8 text-center ">Checkout</p>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 col-md-9">
                                <form action="">
                                    <div className="table-responsive">
                                        <table className="table checkout-table coulmn-bg-color-1 rounded-lg">
                                            <tbody>
                                                <tr className="double ">
                                                    <th colSpan={2} className="p-2 custom-color-3 regularfont subtitles-1 border-bottom border-top-0">Billing Details</th>
                                                </tr>
                                           
                                                <tr className="double">
                                                    <td>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">First Name</label>
                                                        <input type="text" className="check-form form-control input-bg-color-2 border-0 body-sub-titles" name="first-name" placeholder="Mark"/>
                                                    </td>
                                                    <td>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Last Name</label>
                                                        <input type="text" className="check-form form-control input-bg-color-2 border-0 body-sub-titles" name="last-name" placeholder="Twain"/>
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2}>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Company Name (Optional)</label>
                                                        <input type="text" className="check-form form-control input-bg-color-2 border-0 body-sub-titles" name="company-name" placeholder="Company Name"/>
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2}>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Country</label>
                                                        <input type="text" className=" check-form form-control input-bg-color-2 border-0 body-sub-titles" name="country" placeholder="Select Country..."/>
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2}>
                                                        <div className="mb-3">
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Street Address</label>
                                                            <input type="text" className=" check-form form-control input-bg-color-2 border-0 body-sub-titles" name="street-name" placeholder="House number and street name"/>
                                                        </div>
                                                        <div>
                                                            <input type="text" className="check-form form-control input-bg-color-2 border-0 body-sub-titles" name="apertment" placeholder="Apartment, suite, unit etc..."/>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2}>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">City</label>
                                                        <input type="text" className=" check-form form-control input-bg-color-2 border-0 body-sub-titles" name="city" placeholder="City"/>
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2}>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">State</label>
                                                        <input type="text" className="check-form form-control input-bg-color-2 border-0 body-sub-titles" name="state" placeholder="State"/>
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2}>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Postcode</label>
                                                        <input type="text" className=" check-form form-control input-bg-color-2 border-0 body-sub-titles" name="postcode" placeholder="Postcode"/>
                                                    </td>
                                                </tr>
                                                <tr className="double">
                                                    <td>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Email Address</label>
                                                        <input type="text" className="check-form form-control input-bg-color-2 border-0 body-sub-titles" name="email-address" placeholder="Email Address"/>
                                                    </td>
                                                    <td>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Phone Number</label>
                                                        <input type="text" className="check-form form-control input-bg-color-2 border-0 body-sub-titles" name="phone" placeholder="(XXX) XXX-XXXX"/>
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2}>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Password</label>
                                                        <input type="text" className="check-form form-control input-bg-color-2 border-0 body-sub-titles" name="password" placeholder="Password"/>
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2} className="d-flex">
                                                        <span className="custom-checkbox pl-3">
                                                            <input type="checkbox" className="form-check input-bg-color-2 border-0 body-sub-titles" name="create" id="create"/>
                                                            <label htmlFor="create" className="rounded"></label>
                                                        </span>
                                                        <span className="ms-3 create-label create-label">Create an account?</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table checkout-table coulmn-bg-color-1 rounded-lg">
                                             <tbody>
                                                <tr className="single border-bottom">
                                                    <th colSpan={2} className="p-2 custom-color-3 regularfont subtitles-1 border-top-0">Shopping Details</th>
                                                </tr>
                                           
                                                <tr className="single">
                                                    <td colSpan={2} className="d-flex">
                                                        <span className="custom-checkbox pl-3">
                                                            <input type="checkbox" className="form-check input-bg-color-2 border-0 body-sub-titles" name="ship-to" id="ship-to"/>
                                                            <label htmlFor="ship-to " className="rounded"></label>
                                                        </span>
                                                        <span className="ms-3 create-label">Ship to a different address?</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </form>
                            </div>
                            <div className="col-12 col-md-3">
                                <div className="table-responsive">
                                    <table className="cart-total table coulmn-bg-color-1 rounded">
                                        <tbody>
                                            <tr className="border-bottom">
                                                <th colSpan={2} className="pb-2 pt-2 ps-3 pe-3 custom-color-3 regularfont subtitles-1 border-top-0">Cart Total</th>
                                            </tr>
                                            <tr>
                                                <td className="pb-1 pt-4 pl-3 semifont body-sub-titles-1 fw-bold border-0"><span>Product</span></td>
                                                <td className="pb-1 pt-4 pr-4 semifont body-sub-titles-1 fw-bold border-0 text-right"><span>Price</span></td>
                                            </tr>
                                            <tr>
                                                <td className="pb-0 pt-0 pr-0 pl-3 semifont boldfontsize border-top-0"> <hr className="p-0 m-0 " /></td>
                                                <td className="pb-0 pt-0 pl-0 pr-4 regularfont boldfontsize border-top-0"> <hr className="p-0 m-0"/></td>
                                            </tr>
                                            {checkoutProducts.map((product: any) => {
                                                return (
                                                    <tr>
                                                        <td className="pb-0 pt-3 pl-3 lightfont mini-text-1 border-0">{product?.title}</td>
                                                        <td className="pb-0 pt-3 pr-4 regularfont mini-text-1 border-0 text-right">{product?.price}</td>
                                                        
                                                    </tr>
                                                )
                                            })}
                                            <tr>
                                                <td className="pb-4 pt-1 px-3 semifont body-sub-titles-1 fw-bold border-0">Total</td>
                                                <td className="pb-4 pt-1 pr-4 semifont body-sub-titles-1 fw-bold border-0 text-right">€{total}</td>
                                            </tr>
                                            <tr  className="single">
                                                
                                            </tr>
                                            <tr><td colSpan={2} className="p-3">
                                                <button type="button" 
                                                    className="proceed-to-checkout custom-color-7 semifont mini-text-3 rounded border-0 button-bg-color-1"
                                                    onClick={handlepayment}
                                                >Proceed to payment</button>
                                            </td></tr>
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
export default Checkout;