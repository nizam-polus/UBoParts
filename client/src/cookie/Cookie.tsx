import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import { FormattedMessage } from 'react-intl';

function Cookie() {

    return (
        <> 
            <div className="main-body pb-2 mb-5 px-0">
                <div className="container px-4 px-xl-0">
                    {/* <section className="about-content-wrapper">
                        <div className="row ps-5 pe-5 pt-4 pb-4">
                            <div className="col-12">
                                <p className="semifont heading_text custom-color-1"><FormattedMessage id="ABOUT_US"/></p>
                                <p className="body-sub-titles-1 lightfont custom-color-1"><FormattedMessage id="ABOUT_US_DISCRIPTION"/></p>
                            </div>
                        </div>
                    </section> */}
                    <section className="about-proffessionals-wrapper mt-4 pt-1 ">
                        <div className="row mt-3 mt-md-3 mt-xl-5">
                            <div className="col-12">
                                <p className="semifont text-size-3 custom-color-1 text-center pb-3 pt-3"><FormattedMessage id="COOKIE_STATEMENT"/></p>
                            </div>
                        </div>
                       
                    </section>
                    <section className="contact-wrapper coulmn-bg-color-1 mt-5 p-5">
                        <div className='custom-color-2 '>
                            <h5>1.The use of cookies</h5>
                            <p>www.uboparts.com uses cookies. A cookie is a small file that is sent along with pages from this website and / or Flash applications and stored by your browser on the hard drive of your computer, mobile phone, smartwatch or tablet. The information stored therein can be sent back to our servers on a subsequent visit.
                            <br />
                            <br />
                                The use of cookies is of great importance for the smooth running of our website, but also cookies of which you do not immediately see the effect are very important. Thanks to the (anonymous) input from visitors, we can improve the use of the website and make it more user-friendly.
                            </p>

                            <h5>2.Permission for the use of cookies</h5>
                            <p>
                                Your permission is required for the use of certain cookies. No permission is required for the cookies we use. We do this by
                                means of a so-called cookie banner.
                            </p>

                            <h5>3. The type of cookies and their objectives</h5>
                            <br />
                            <p>
                                <span className='font-weight-bold'>We use the following types of cookies:</span><br />
                                <span className='font-weight-bold'>Functional cookies:</span> these allow us to operate the website better and they make our website more user-friendly for the visitor. For example, we store your login details or what you have put in your shopping cart.
                                <br />
                                <span className='font-weight-bold'>Anonymised analytical cookies:</span>these ensure that an anonymous cookie is generated every time you visit a website. These cookies know whether you have visited the site before or not. Only on the first visit, a cookie is created and on subsequent visits the existing cookie is used. This cookie is only for statistical purposes. For example, the following data can be collected:
                                <br />
                                the number of unique visitors how often users visit the site which pages users view
                                how long users view a certain page on which page visitors leave the site
                                <br />
                                <span className='font-weight-bold'>Analytical cookies:</span>these ensure that every time you visit a website a cookie is generated. These cookies know whether you have visited the site before or not. Only on the first visit a cookie is created and on subsequent visits the existing cookie is used. This cookie is only for statistical purposes. This way data may be collected such as:
                                <br />
                                <br />
                                the specific pages you've viewed how long you stayed on a particular page on which page you left the site
                                <br />
                            </p>
                        </div>
                    </section>
                </div>
                <section className="contact-wrapper coulmn-bg-color-1 mt-5">
                    <div className="container-fluid">
                        <div className="container">
                            <div className="row p-5">
                            <div className="col text-center p-xl-5 p-md-5">
                                    <a href="/contact_us" className=" custom-color-11 button-bg-color-1 lightfont body-sub-titles px-5 pt-4 pb-4 ps-3 pe-3 rounded button-color"><FormattedMessage id="CONTACT_US" /></a>
                            </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
export default Cookie;