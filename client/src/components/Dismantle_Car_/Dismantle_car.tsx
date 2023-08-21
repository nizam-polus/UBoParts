import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '../shared/AppImage';
import Header_home_logged_in from '../header_/Header_home_logged_in';
function Dismantle_car() {
    return (
        <>
            <div className="dismantle-header">
                <Header_home_logged_in />
                <div className="container">
                    <div className="row d-flex align-items-center header-middle-text pl-5 ml-5">
                        <div className="col box w-100">
                            <p className="semifont heading_text text-white">Dismantle your<br/> car with us</p>
                            <p className="lightfont sub-text-1 text-white">Browse our expansive selection<br/> featuring hundreds of brands and<br/> tens of thousands of quality parts.</p>
                        </div>
                    </div>
                </div>    
            </div>
            <div className="main-body pb-2 mb-5">
                <div className="container">
                    <section className="quote-wrapper mt-5">
                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="quote-inner-wrapper coulmn-bg-color-1 rounded p-5 ps-5 pe-5">
                                    <form action="">
                                        <div className="table-responsive">
                                            <table className="table quote-table">
                                                <tbody>
                                                    <tr>
                                                        <th colSpan={2} className="pt-0 pb-0 px-0 ps-0 custom-color-2 regularfont subtitles fw-normal border-top-0 border-bottom-0">Dismantle Your Car With Us</th>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={2} className="pb-4 pt-4 pl-0 semifont boldfontsize border-top-0"> <hr className="p-0 m-0 " /></td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Plate Number</label>
                                                            <input type="text" className="form-control input-bg-color-2 border-0 body-sub-titles" name="plate-number" placeholder="Plate Number"/>
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Auto Model</label>
                                                            <input type="text" className="form-control input-bg-color-2 border-0 body-sub-titles" name="auto-model" placeholder="Auto Model"/>
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Year</label>
                                                            <input type="text" className="form-control input-bg-color-2 border-0 body-sub-titles" name="year" placeholder="Year"/>
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Mark</label>
                                                            <input type="text" className="form-control input-bg-color-2 border-0 body-sub-titles" name="mark" placeholder="Mark"/>
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">First Name</label>
                                                            <input type="text" className="form-control input-bg-color-2 border-0 body-sub-titles" name="fname" placeholder="First Name"/>
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Last Name</label>
                                                            <input type="text" className="form-control input-bg-color-2 border-0 body-sub-titles" name="lname" placeholder="Last Name"/>
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Email Address</label>
                                                            <input type="text" className="form-control input-bg-color-2 border-0 body-sub-titles" name="email" placeholder="Email Address"/>
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Phone</label>
                                                            <input type="text" className="form-control input-bg-color-2 border-0 body-sub-titles" name="phone" placeholder="(XXX) XXX-XXXX"/>
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Delivery Type</label>
                                                            <div className="position-relative d-flex">
                                                                <span className="custom-checkbox">
                                                                    <input type="checkbox" className="form-check input-bg-color-2 border-0 body-sub-titles-1" name="delivery_type" id="delivery_type"/>
                                                                    <label htmlFor="delivery_type" className="rounded"></label>
                                                                </span>
                                                                <span className="ms-3 create-label regularfont pl-2">Delivery</span>
                                                            </div>
                                                            <div className="position-relative d-flex">
                                                                <span className="custom-checkbox">
                                                                    <input type="checkbox" className="form-check input-bg-color-2 border-0 body-sub-titles-1" name="delivery_type" id="pickup_type"/>
                                                                    <label htmlFor="pickup_type" className="rounded"></label>
                                                                </span>
                                                                <span className="ms-3 create-label regularfont pl-2">Pickup</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Driving Condition</label>
                                                            <div className="position-relative d-flex">
                                                                <span className="custom-checkbox">
                                                                    <input type="checkbox" className="form-check input-bg-color-2 border-0 body-sub-titles" name="driving_condition" id="driving_type_delivery"/>
                                                                    <label htmlFor="driving_type_delivery" className="rounded"></label>
                                                                </span>
                                                                <span className="ms-3 create-label regularfont pl-2">Delivery</span>
                                                            </div>
                                                            <div className="position-relative d-flex">
                                                                <span className="custom-checkbox">
                                                                    <input type="checkbox" className="form-check input-bg-color-2 border-0 body-sub-titles" name="driving_condition" id="driving_type_pickup"/>
                                                                    <label htmlFor="driving_type_pickup" className="rounded"></label>
                                                                </span>
                                                                <span className="ms-3 create-label regularfont pl-2">Pickup</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Catalyser Type</label>
                                                            <div className="position-relative d-flex">
                                                                <span className="custom-checkbox">
                                                                    <input type="checkbox" className="form-check input-bg-color-2 border-0 body-sub-titles" name="catalyser_type" id="catalyser_type_imitation"/>
                                                                    <label htmlFor="catalyser_type_imitation" className="rounded"></label>
                                                                </span>
                                                                <span className="ms-3 create-label regularfont pl-2">Imitation</span>
                                                            </div>
                                                            <div className="position-relative d-flex">
                                                                <span className="custom-checkbox">
                                                                    <input type="checkbox" className="form-check input-bg-color-2 border-0 body-sub-titles" name="driving_condition" id="catalyser_type_oiginal"/>
                                                                    <label htmlFor="catalyser_type_oiginal" className="rounded"></label>
                                                                </span>
                                                                <span className="ms-3 create-label regularfont pl-2">Original</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2 ">Asking Price (€)</label>
                                                            <input type="number" className="form-control input-bg-color-2 border-0 body-sub-titles" name="price" placeholder="Asking Price (€)"/>
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Car Image(s)</label>
                                                            <input className="form-control p-2 choosefile" type="file" id="formFile"/>
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <div className="mb-3">
                                                                <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Street Address</label>
                                                                <input type="text" className="form-control input-bg-color-2 border-0 body-sub-titles" name="street-name" placeholder="House number and street name"/>
                                                            </div>
                                                            <div>
                                                                <input type="text" className="form-control input-bg-color-2 border-0 body-sub-titles" name="apertment" placeholder="Apartment, suite, unit etc..."/>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">City</label>
                                                            <input type="text" className="form-control input-bg-color-2 border-0 body-sub-titles" name="city" placeholder="City"/>
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">State</label>
                                                            <input type="text" className="form-control input-bg-color-2 border-0 body-sub-titles" name="state" placeholder="State"/>
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Postcode</label>
                                                            <input type="text" className="form-control input-bg-color-2 border-0 body-sub-titles" name="postcode" placeholder="Postcode"/>
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">Note</label>
                                                            <textarea placeholder="Type here..." className="form-control input-bg-color-2 border-0 body-sub-titles rounded" rows={4}></textarea>
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2} className="">
                                                            <button type="submit" className="place-quote text-white mediumfont body-sub-titles-1 rounded-lg border-0 button-bg-color-1 h-auto p-2">Submit</button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );

}
export default Dismantle_car;
