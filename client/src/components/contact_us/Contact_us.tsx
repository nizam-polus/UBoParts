import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '../shared/AppImage';
import { FormattedMessage } from 'react-intl';
function Contact_us() {
    const [name, setName] = useState<any>("");
    const [email, setEmail] = useState<any>("");
    const [subject, setSubject] = useState<any>("");
    const [message, setMessage] = useState<any>("");

    return (
        <> 
            <div className="main-body pb-2 mb-5 px-0">
                <div className="container px-4 px-xl-0">
                    <section className="about-proffessionals-wrapper mt-4 pt-1 ">
                        <div className="row mt-3 mt-md-3 mt-xl-5">
                            <div className="col-12">
                                <p className="semifont text-size-3 custom-color-1 text-center pb-3 pt-3"><FormattedMessage id="CONTACT_US"/></p>
                            </div>
                        </div>
                        <div className="row mt-2 g-3">
                            <div className="col-12" style={{width: "100%"}}>
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2433.033668564033!2d4.841715912393551!3d52.42418764320198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5e2cf31db3269%3A0x5e1e44cfad76c89a!2sZomerdijk%2011%2C%201505%20HW%20Zaandam%2C%20Netherlands!5e0!3m2!1sen!2sin!4v1698324709289!5m2!1sen!2sin" width="100%" height="450" ></iframe>                            
                            </div>
                        </div>
                    </section>
                    <section className="contact-wrapper coulmn-bg-color-1 mt-5 contact-details-section">
                       <div className='custom-color-2 '>
                            <div>
                                <h2 className='font-weight-bold semifont' style={{fontSize: "1.5rem"}}>Our Address</h2>
                                <p className='regularfont pb-5' style={{maxWidth: "350px", fontSize: "18px"}}>
                                    UboParts, Zomerdijk 11, 1505HW Zaandam, The Netherlands <br></br>
                                    Email: Info@uboparts.com <br></br>
                                    Phone Number: +316 334-907-82
                                </p>
                            </div>
                            <div>
                                <h3 className='font-weight-bold semifont' style={{fontSize: "1.5rem"}}>Opening Hours</h3>
                                <p className='regularfont' style={{maxWidth: "350px", fontSize: "18px"}}>
                                    Monday to Friday: 8h00-17h00
                                    Saturday: Closed <br></br>
                                    Sunday: Closed
                                </p>
                            </div>    
                       </div>
                       <div>
                            <div>
                                <h2 className='text-center semifont'>Leave us a Message</h2>
                            </div>
                            <div className="table-responsive">
                                <table className="table  coulmn-bg-color-1 rounded mt-2 rounded-2">
                                    <tbody>
                                        <tr className="double">
                                            <td className="px-5">
                                                <label className="custom-color-2 regularfont products-name pb-2">Your Name</label>
                                                <span className="">
                                                    <input type="text" onChange={(e) => setName(e.target.value)} className="form-control input-bg-color-2 border-0 products-name" name="name" placeholder="Jhon cina" />
                                                </span>
                                            </td>
                                            <td className="px-5">
                                                <label className="custom-color-2 regularfont products-name pb-2">Email</label>
                                                <span className="">
                                                    <input type="text" onChange={(e) => { setEmail(e.target.value) }} className="form-control input-bg-color-2 border-0 products-name" name="email" placeholder="jhon@gmail.com" />
                                                </span>
                                            </td>
                                        </tr>
                                        <tr className="single">
                                            <td className="px-5 pb-3" colSpan={2} style={{borderTop: "none"}}>
                                                <label className="custom-color-2 regularfont products-name pb-2">Subject</label>
                                                <span className="">
                                                    <input type="text" onChange={(e) => setSubject(e.target.value)} className="form-control input-bg-color-2 border-0 products-name" name="subject" placeholder="subject.." />
                                                </span>
                                            </td>
                                        </tr>
                                        <tr className="single">
                                            <td className="px-5 pb-5" colSpan={2} style={{borderTop: "none"}}>
                                                <label className="custom-color-2 regularfont products-name pb-2">Message</label>
                                                <span className="">
                                                    <textarea onChange={(e) => setMessage(e.target.value)} className="form-control input-bg-color-2 border-0 products-name" name="message" placeholder="Message..." />
                                                </span>
                                            </td>
                                        </tr>
                                        <div className="container">
                                            <div className="">
                                                <div className="col">
                                                    <a href="" style={{ marginLeft: "2rem" }} className="custom-color-11 button-bg-color-1 lightfont body-sub-titles px-5 pt-3 pb-3  rounded button-color"><FormattedMessage id="SEND" /></a>
                                                </div>
                                            </div>
                                        </div>
                                    </tbody>
                                </table>
                            </div>
                       </div>
                    </section>
                </div>
            </div>
        </>
    );
}
export default Contact_us;