import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '~/components/shared/AppImage';
import Header_home from '~/components/header_/Header_home';
function Profile() {
    

    return (
    
        <> 
            <div className="page_header">
                <Header_home />
            </div>
            <div className="main-body pb-2 mb-5">
                <div className="container">
                    <section className="profile-wrapper">
                        <div className="row mt-5">
                            <div className="col">
                                <p className="semifont bg-image-text custom-color-8 text-center">Profile</p>
                            </div>
                        </div>
                        <div className="row mt-3 ">
                            <div className="col-12 col-md-12 col-xl-3">
                                <div className="profile-image-wrapper coulmn-bg-color-1 rounded-2 p-5 pb-2 text-center">
                                    <AppImage src="images/img/profile-img.png" className="img-fluid"/>
                                    <div>
                                    <label  htmlFor="formId" className='position-relative position-overlap-edit-icon'>
                                        <input name="" type="file" id="formId" hidden />
                                        <AppImage className="icon-size1" src="images/img/Vector.png"/>
                                    </label>
                                </div>
                                    <p className="mt-0 mb-1 custom-color-1 boldfont products-name">Mark Twain</p>
                                    <p className="mt-1 mb-2 custom-color-1 regularfont products-name">user@example.com</p>
                                </div>
                            </div>
                            <div className="col-12 col-md-12 col-xl-9 mt-4 mt-xl-0 mt-md-4">
                                <form action="">
                                    <div className="table-responsive">
                                        <table className="table profile-table-1 coulmn-bg-color-1 rounded-2">
                                            <tbody>
                                                <tr>
                                                    <th colSpan={2} className="px-5 pt-3 pb-3 custom-color-3 regularfont subtitles border-top-0 border-bottom">Personal Details</th>
                                                </tr>
                                            
                                                <tr className="double">
                                                    <td className='pl-5 pr-xl-3 pr-md-3 pr-5 pt-3 pb-2'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">First Name</label>
                                                        <input type="text" className="form-control input-bg-color-2 border-0 products-name" name="first-name" placeholder="First Name"/>
                                                    </td>
                                                    <td className='pr-5 pl-xl-3 pl-md-3 pl-5 pt-3 pb-2'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Last Name</label>
                                                        <input type="text" className="form-control input-bg-color-2 border-0 products-name" name="last-name" placeholder="Last Name"/>
                                                    </td>
                                                </tr>
                                                <tr className="double">
                                                    <td className="pl-5 pr-xl-3 pr-md-3 pr-5 pb-0 pb-xl-5 pb-md-5 border-0">
                                                        <label className="custom-color-2 regularfont products-name pb-2">Email Address</label>
                                                        <input type="text" className="form-control input-bg-color-2 border-0 products-name" name="email-address" placeholder="Email Address"/>
                                                    </td>
                                                    <td className="pr-5 pl-xl-3 pl-md-3 pl-5 pb-5 pb-xl-5 pb-md-5 border-0">
                                                        <label className="custom-color-2 regularfont products-name pb-2">Phone</label>
                                                        <input type="text" className="form-control input-bg-color-2 border-0 products-name" name="phone" placeholder="(XXX) XXX-XXXX"/>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table profile-table-1 coulmn-bg-color-1 rounded-2 mt-2">
                                            <tbody>

                                                <tr>
                                                    <th colSpan={2} className="px-5 pt-3 pb-3 custom-color-3 regularfont subtitles border-top-0 border-bottom ">
                                                        <div className="float-left pt-2">Address</div>
                                                        <div className="float-right"><button type="button" className="custom-color-7 boldfont mini-text-3 rounded border-0 button-bg-color-1 pb-2 pt-2 px-5">Add New</button></div>
                                                    </th>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2}>
                                                        <div className="mb-3 px-3 pt-2">
                                                            <label className="custom-color-2 regularfont products-name pb-2">Street Address</label>
                                                            <input type="text" className="form-control input-bg-color-2 border-0 products-name" name="street-name" placeholder="House number and street name"/>
                                                        </div>
                                                        <div className='px-3'>
                                                            <input type="text" className="form-control input-bg-color-2 border-0 products-name" name="apertment" placeholder="Apartment, suite, unit etc..."/>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className="double">
                                                    <td className='pl-5 pr-xl-3 pr-md-3 pr-5'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">City</label>
                                                        <input type="text" className="form-control input-bg-color-2 border-0 products-name" name="city" placeholder="City"/>
                                                    </td>
                                                    <td className='pr-5 pl-xl-3 pl-md-3 pl-5'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">State</label>
                                                        <input type="text" className="form-control input-bg-color-2 border-0 products-name" name="state" placeholder="State"/>
                                                    </td>
                                                </tr>
                                                <tr className="double">
                                                    <td className="pb-0 pb-xl-5 pb-md-5 pl-5 pr-xl-3 pr-md-3 pr-5">
                                                        <label className="custom-color-2 regularfont products-name pb-2">Country</label>
                                                        <input type="text" className="form-control input-bg-color-2 border-0 products-name" name="country" placeholder="Country"/>
                                                    </td>
                                                    <td className="pb-5 pr-5 pl-xl-3 pl-md-3 pl-5">
                                                        <label className="custom-color-2 regularfont products-name pb-2">Postcode</label>
                                                        <input type="text" className="form-control input-bg-color-2 border-0 products-name" name="postcode" placeholder="Postcode"/>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table profile-table-1 password-wrapper coulmn-bg-color-1 rounded mt-2 rounded-2">
                                            <tbody>
                                                <tr>
                                                    <th className="px-5 pt-3 pb-3 custom-color-3 regularfont subtitles border-top-0 border-bottom">Password</th>
                                                </tr>
                                            
                                                <tr className="single">
                                                    <td className="px-5">
                                                        <label className="custom-color-2 regularfont products-name pb-2 pt-2">Old Password</label>
                                                        <span className="password-wrapper-field">
                                                            <input type="password" className="form-control input-bg-color-2 border-0 products-name" name="old-password" placeholder="Enter Old Password"/>
                                                            <AppImage className="icon-size" src="images/svg/eye-closed.svg"/>
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td className="px-5">
                                                        <label className="custom-color-2 regularfont products-name pb-2">New Password</label>
                                                        <span className="password-wrapper-field">
                                                            <input type="password" className="form-control input-bg-color-2 border-0 products-name" name="new-password" placeholder="Enter New Password"/>
                                                            <AppImage className="icon-size" src="images/svg/eye-open.svg"/>
                                                        </span>
                                                        
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td className="px-5 pb-5">
                                                        <label className="custom-color-2 regularfont products-name pb-2">Confirm Password</label>
                                                        <span className="password-wrapper-field">
                                                            <input type="password" className="form-control input-bg-color-2 border-0 products-name" name="confirm-password" placeholder="Confirm New Password"/>
                                                            <AppImage className="icon-size" src="images/svg/eye-closed.svg"/>
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="row mt-3 px-3">
                                        <div className="col px-3">
                                            <button type="submit" className="save-profile custom-color-7 mediumfont subtitles rounded border-0 button-bg-color-1 pb-2 pt-2 px-5 d-flex align-items-center justify-content-center">Save</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
export default Profile;