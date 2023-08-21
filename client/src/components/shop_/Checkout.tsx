import React, { useCallback, useEffect, useState } from 'react';
import AppImage from '../shared/AppImage';
import Header_home from '../header_/Header_home';
function Checkout() {

    const token = '2c82df0e9f171ad5cea40c8451ce811b84d898b32e03b43ecec923457735b5ce6446ffcd68659ff11fd6bd1e1f4ba89498a58e30229a15fe683147d245498446d8ebb0c1e56437835fbd320246fd4519f7c23cf04c9eb29aff57c21052913af1b8f60432385cd21b6325ced78ecedd666a58bd0e80f44cf60d56e82d5cc022cb'
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const [checkoutProducts, setCheckoutProducts]: any = useState([])
    const [total, setTotal]: any = useState(0)

    useEffect(() => {
        axios.post('http://10.199.100.156:1337/api/getcartdetails', {customerid: '2'}, {headers}).then(response => {
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
    }, [])

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
                                                <td className="pb-0 pt-3 pl-3 lightfont mini-text-1 border-0"><span>Mercedes sprinter achter as</span></td>
                                                <td className="pb-0 pt-3 pr-4 regularfont mini-text-1 border-0 text-right">€700</td>
                                            </tr>
                                            <tr>
                                                <td className="pb-3 pt-3 pl-3 lightfont mini-text-1 border-0">Mercedes sprinter achter as</td>
                                                <td className="pb-3 pt-3 pr-4 regularfont mini-text-1 border-0 text-right">€700</td>
                                            </tr>
                                            <tr>
                                                <td className="pb-0 pt-0 pr-0 pl-3 semifont boldfontsize border-top-0"> <hr className="p-0 m-0 " /></td>
                                                <td className="pb-0 pt-0 pl-0 pr-4 regularfont boldfontsize border-top-0"> <hr className="p-0 m-0"/></td>
                                            </tr>
                                            <tr>
                                                <td className="pb-1 pt-1 px-3 regularfont placeholderfontsize border-0 ">Subtotal</td>
                                                <td className="pb-1 pt-1 pr-4 regularfont placeholderfontsize border-0 text-right">€1,500</td>
                                            </tr>
                                            <tr>
                                                <td className="pb-0 pt-0 pr-0 pl-3 semifont boldfontsize border-top-0"> <hr className="p-0 m-0 " /></td>
                                                <td className="pb-0 pt-0 pl-0 pr-4 regularfont boldfontsize border-top-0"> <hr className="p-0 m-0"/></td>
                                            </tr>
                                            <tr>
                                                <td className="pb-4 pt-1 px-3 semifont body-sub-titles-1 fw-bold border-0">Total</td>
                                                <td className="pb-4 pt-1 pr-4 semifont body-sub-titles-1 fw-bold border-0 text-right">€1,500</td>
                                            </tr>
                                            <tr  className="single">
                                                
                                            </tr>
                                            <tr><td colSpan={2} className="p-3"><button type="button" className="proceed-to-checkout custom-color-7 semifont mini-text-3 rounded border-0 button-bg-color-1">Proceed to checkout</button></td></tr>
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