import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '../shared/AppImage';
import Header_logged_in from '../header_/Header-logged-in';
function Cart() {
    return (
        <>
            <Header_logged_in />
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
                                            </tr>
                                            <tr>
                                                <td className="p-3 text-center">
                                                    <AppImage src="images/svg/cat-prod-1.svg" className="rounded"/>
                                                </td>
                                                <td className="p-3 custom-color-3 regularfont mini-text-2">
                                                    <div>Mercedes sprinter achter as</div>
                                                    <div className="d-md-flex">
                                                        <span>Kila International</span>
                                                        <span className="in-stock custom-color-6 rounded-pill d-flex mini-text-4">Seller</span></div>
                                                </td>
                                                <td className="p-3 custom-color-3 semifont mini-text-3 text-center ">€750</td>
                                                <td className="p-3 custom-color-3 regularfont">
                                                    <div className="input-group quanitity-box quanitity-incrementor">
                                                        <span className="input-group-btn plus-icon regularfont">
                                                            <i className="fa fa-minus mini-text-0 mini-text-0-color " aria-hidden="true"></i>
                                                        </span>
                                                        <input type="text" name="quant[1]" className="form-control input-number text-center rounded-pill border-0 regularfont px-2 pb-1 pt-1 mini-text-3 h-auto" value="1" min="1" max="10"/>
                                                        <span className="input-group-btn minus-icon regularfont">
                                                            <i className="fa fa-plus mini-text-0 mini-text-0-color " aria-hidden="true"></i>
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-3 custom-color-3 semifont mini-text-3 text-center">€750</td>
                                            </tr>
                                            <tr>
                                                <td className="p-3 text-center">
                                                    <AppImage src="images/svg/cat-prod-1.svg" className="rounded"/>
                                                </td>
                                                <td className="p-3 custom-color-3 regularfont mini-text-2">
                                                    <div>Mercedes sprinter achter as</div>
                                                    <div className="d-md-flex">
                                                        <span>Kila International</span>
                                                        <span className="in-stock custom-color-6 rounded-pill d-flex mini-text-4">Seller</span></div>
                                                </td>
                                                <td className="p-3 custom-color-3 semifont mini-text-3 text-center">€750</td>
                                                <td className="p-3 custom-color-3 regularfont">
                                                    <div className="input-group quanitity-box quanitity-incrementor">
                                                        <span className="input-group-btn plus-icon regularfont">
                                                            <i className="fa fa-minus mini-text-0 mini-text-0-color" aria-hidden="true"></i>
                                                        </span>
                                                        <input type="text" name="quant[1]" className="form-control input-number text-center rounded-pill border-0 regularfont px-2 pb-1 pt-1 mini-text-3 h-auto" value="1" min="1" max="10"/>
                                                        <span className="input-group-btn minus-icon regularfont">
                                                            <i className="fa fa-plus mini-text-0 mini-text-0-color" aria-hidden="true"></i>
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-3 custom-color-3 semifont mini-text-3 text-center">€750</td>
                                            </tr>
                                            <tr>
                                                <td className="p-3 text-center">
                                                    <AppImage src="images/svg/cat-prod-1.svg" className="rounded"/>
                                                </td>
                                                <td className="p-3 custom-color-3 regularfont mini-text-2">
                                                    <div>Mercedes sprinter achter as</div>
                                                    <div className="d-md-flex">
                                                        <span>Kila International</span>
                                                        <span className="in-stock custom-color-6 rounded-pill d-flex mini-text-4">Seller</span></div>
                                                </td>
                                                <td className="p-3 custom-color-3 semifont mini-text-3 text-center">€750</td>
                                                <td className="p-3 custom-color-3 regularfont">
                                                    <div className="input-group quanitity-box quanitity-incrementor">
                                                        <span className="input-group-btn plus-icon regularfont">
                                                            <i className="fa fa-minus mini-text-0 mini-text-0-color" aria-hidden="true"></i>
                                                        </span>
                                                        <input type="text" name="quant[1]" className="form-control input-number text-center rounded-pill border-0 regularfont px-2 pb-1 pt-1 mini-text-3 h-auto" value="1" min="1" max="10"/>
                                                        <span className="input-group-btn minus-icon regularfont">
                                                            <i className="fa fa-plus mini-text-0 mini-text-0-color" aria-hidden="true"></i>
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-3 custom-color-3 semifont mini-text-3 text-center">€750</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td className="p-3"  colSpan={2}><button type="button" className="add-more-rows custom-color-7 semifont mini-text-3 rounded border-0 button-bg-color-1">Add more items</button></td>
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
                                                <td className="pb-1 pt-4 semifont border-top-0 menu_font_size custom-color-3">€1,500</td>
                                            </tr>
                                            <tr>
                                                <td className="pb-0 pt-0 pr-0 pl-3 semifont boldfontsize border-top-0"> <hr className="p-0 m-0 " /></td>
                                                <td className="pb-0 pt-0 pl-0 pr-4 regularfont boldfontsize border-top-0"> <hr className="p-0 m-0"/></td>
                                            </tr>
                                            <tr>
                                                <td className="pb-4 pt-1 pr-0 pl-3 semifont boldfontsize border-top-0"> Total</td>
                                                <td className="pb-4 pt-1 pl-0 semifont boldfontsize border-top-0 custom-color-3">€1,500</td>
                                            </tr>
                                            <tr><td colSpan={2} className="p-3 pb-4 w-100"><button type="button" className=" w-100 proceed-to-checkout custom-color-7 semifont mini-text-3 rounded border-0 button-bg-color-1"><AppLink href="/checkoutpage" className="custom-color-7">Proceed to checkout</AppLink></button></td></tr>
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