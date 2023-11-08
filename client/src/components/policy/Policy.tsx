import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import { FormattedMessage } from 'react-intl';
import Link from 'next/link';

function Policy() {

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
                                <p className="semifont text-size-3 custom-color-1 text-center pb-3 pt-3">General Policy UBO</p>
                            </div>
                        </div>
                       
                    </section>
                    <section className="contact-wrapper regular-font coulmn-bg-color-1 mt-5 p-5">
                        <div className='custom-color-2 '>
                            <h3> Information</h3>
                            <hr />
                            <p>www.uboparts.com uses cookies. A cookie is a small file that is sent along with pages from this website and / or Flash applications and stored by your browser on the hard drive of your computer, mobile phone, smartwatch or tablet. The information stored therein can be sent back to our servers on a subsequent visit.
                            <br />
                            <br />
                                The use of cookies is of great importance for the smooth running of our website, but also cookies of which you do not immediately see the effect are very important. Thanks to the (anonymous) input from visitors, we can improve the use of the website and make it more user-friendly.
                            </p>

                            <h5>2. Permission for the use of cookies</h5>
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

                                <span className='font-weight-bold'>Personal tracking cookies:</span>these allow us to learn that besides our website have also visited the relevant other website(s) from our network. The resulting profile is not linked to your name, address, e-mail address and the like, but only serves to match advertisements to your profile, so that they are as relevant as possible to you. We ask your permission for these cookies. These cookies are therefore not placed without your permission.
                                <br />
                                <br />
                                <span className='font-weight-bold'>Tracking cookies from others:</span>these keep track of the pages you visit on the internet in order to build your personal profile. This profile is not linked to your name, address, e-mail address and the like as known to us, but only serves to match advertisements to your profile so that they are as relevant as possible to you. We ask your permission for these cookies.
                                <br />
                                <br />
                                These cookies are therefore not placed without your permission.
                                <br />
                                <span className='font-weight-bold'>Social media related cookies:</span> with these cookies websites like Facebook and LinkedIn register which articles and pages you share via their social media sharing buttons. They may also contain tracking cookies that track your surfing behavior on the web.
                                <br />
                                <br />
                                <span className='font-weight-bold'>Site improvement cookies:</span>  these allow us to test different versions of a web page to see which page is best visited.
                                <br />
                                <br />
                            </p>
                            <h5>4. Your rights with regard to your data</h5>
                            <p>
                            You have the right to inspect, rectify, limit and delete personal data. You also have the right to object to the processing of personal data and the right to data portability. You can exercise these rights by sending an e-mail to info@uboparts.com. To
                            prevent abuse, we may ask you to identify yourself adequately. When it comes to access to personal data linked to a cookie, we ask you to send a copy of the cookie in question. You can find this in the settings of your browser.
                            </p>
                            <h5>5. Blocking and deleting cookies</h5>
                            <p>
                            At any time you can easily block cookies yourself or delete them via your internet browser. You can also set your internet browser so that you receive a message when a cookie is placed. You can also indicate that certain cookies may not be placed. View the help function of your browser for this option. If you delete the cookies in your browser, this may have consequences for the pleasant use of this website. Some tracking cookies are placed by third parties which, among other things, show you advertisements via our website. You can delete these cookies centrally via <Link href={"https://youronlinechoices.com/"}>youronlinechoices.com.</Link>
                            </p>
                            <br />
                            <p>
                            Please note that if you don't want any cookies, we cannot guarantee that our website still works well. Some functions of the site may be lost or you may not be able to visit the website at all. In addition, refusing cookies does not mean that you will no longer see advertisements at all. The advertisements are then no longer tailored to your interests and can therefore be repeated more often.
                            </p>
                            <br />
                            <p>
                            How you can adjust your settings differs per browser. Please refer to the help function of your browsing or click on one of the links below to go directly to the manual of your browser.
                            </p>
                            <p>Firefox:  <Link href={"https://support.mozilla.org/nl/kb/cookies-en-websitegegevens-wissen-firefox?redirectslug=cookies-verwijderen-gegevens-wissen-websites-opgeslagen&redirectlocale=nl"}>https://support.mozilla.org/en/kb/cookies-delete-data-delete-websites-stored</Link></p>
                            <p>Google chrome:  <Link href={"https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=nl"}>https://support.google.com/chrome/answer/95647?co=GENIE.Platform=Desktop&hl=en</Link></p>
                            <p>Internet Explorer:  <Link href={"https://support.microsoft.com/nl-nl/topic/cookiebestanden-verwijderen-in-internet-explorer-bca9446f-d873-78de-77ba-d42645fa52fc"}>https://support.microsoft.com/en-gb/kb/278835</Link></p>
                            <p>Safari on SmartPhone:  <Link href={"https://support.apple.com/nl-nl/HT201265"}>https://support.apple.com/en-en/HT201265</Link></p>
                            <p>Safari on Mac:  <Link href={"https://support.apple.com/nl-be/guide/safari/sfri11471/mac"}>https://support.apple.com/en-gb/guide/safari/sfri11471/mac</Link></p>

                            <h5>6. New developments and unforeseen cookies</h5>
                            <p>
                            The texts of our website can be adjusted at any time due to continuous developments. This also applies to our cookie statement. Therefore, please read this statement regularly to stay informed of any changes. In blog articles, use can be made of content that is hosted on other sites and made accessible by www.uboparts.com by means of certain codes (embedded content), as with YouTube videos for example. These codes often use cookies. However, we have no control over what these third parties do with their cookies.
                            </p>
                            <p>
                            It is also possible that cookies are placed via our websites by others, of which we are not always aware. Do you encounter unforeseen cookies on our website that you cannot find in our overview? Please contact info@uboparts.com. You can also contact the third party directly and ask which cookies they placed, what the reason is, what the lifespan of the cookie is and how they have guaranteed your privacy.
                            </p>
                            <h5>7. Concluding remarks</h5>
                            <br />
                            <p>We will have to adjust these statements from time to time, for example when we adjust our website or change the rules regarding cookies. You can consult this webpage for the latest version.</p>
                            <br />
                            <p>If you have any questions or comments, please contact info@uboparts.com.</p>
                            <p>This cookie statement was created using a document from <span className='font-weight-bold'>Rocket Lawyer</span> <Link href={"https://www.rocketlawyer.com/nl/nl"}>(https://www.rocketlawyer.com/nl/nl)</Link>.</p>
                            <p>01 oktober 2022</p>

                            
                        </div>
                    </section>
                </div>
                <section className="contact-wrapper coulmn-bg-color-1 mt-5">
                    <div className="container-fluid">
                        <div className="container">
                            <div className="col p-5">
                                <div className='text-center'>
                                <h3>Still Have Questions?</h3><br />
                                <p className='font-weight-normal'>We will be happy to answer any questions you may have.</p>
                                </div>
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
export default Policy;