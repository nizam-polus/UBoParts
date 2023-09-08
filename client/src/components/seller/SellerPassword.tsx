import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '~/components/shared/AppImage';
import { BASE_URL } from 'configuration';
import SellerSideBar from './SellerSideBar';
import Link from 'next/link';
import { useRouter } from 'next/router';
function SellerPassword() {
    const router = useRouter();
    return (
        <>
            <div className="main-body pb-2 mb-5">
                <div className="container">
                    <section className="quote-wrapper mt-5">
                        <div className="row mt-3 g-4">
                            <SellerSideBar />
                            <div className="col-12 col-md-9">
                                <div className="quote-inner-wrapper coulmn-bg-color-1 rounded p-3 ps-4 pe-4">
                                    <div className="table-responsive">
                                        <table className="table change-profile-table-1 password-wrapper coulmn-bg-color-1 rounded">
                                            <thead>
                                                <th className="p-2 pb-3 ps-0 custom-color-2 mediumfont subtitles">Change Password</th>
                                            </thead>
                                            <tbody>
                                                <tr className="single">
                                                    <td className="border-0 ps-0">
                                                        <label className="custom-color-2 regularfont body-sub-titles pb-2">Old Password</label>
                                                        <span className="password-wrapper-field">
                                                            <input type="password" className="form-control input-bg-color-2 border-0 body-sub-titles" name="old-password" placeholder="Enter Old Password" />
                                                            <img src="images/eye-closed.svg" />
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td className="border-0 ps-0">
                                                        <label className="custom-color-2 regularfont body-sub-titles pb-2">New Password</label>
                                                        <span className="password-wrapper-field">
                                                            <input type="password" className="form-control input-bg-color-2 border-0 body-sub-titles" name="new-password" placeholder="Enter New Password" />
                                                            <img src="images/eye-open.svg" />
                                                        </span>

                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td className="pb-3 border-0 ps-0">
                                                        <label className="custom-color-2 regularfont body-sub-titles pb-2">Confirm Password</label>
                                                        <span className="password-wrapper-field">
                                                            <input type="password" className="form-control input-bg-color-2 border-0 body-sub-titles" name="confirm-password" placeholder="Confirm New Password" />
                                                            <img src="images/eye-closed.svg" />
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col">
                                            <button type="submit" className="save-profile m-0 custom-color-7 mediumfont subtitles rounded border-0 button-bg-color-1 pb-2 pt-2 d-flex align-items-center justify-content-center">Save</button>
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
export default SellerPassword;