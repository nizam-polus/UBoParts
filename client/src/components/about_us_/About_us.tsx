import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '../shared/AppImage';
import Header_home from '../header_/Header_home';
function About_us() {
    return (
        <> 
            <div className="about-header">
                <Header_home />
            </div>
            <div className="main-body pb-2 mb-5 px-0">
                <div className="container px-4 px-xl-0">
                    <section className="about-content-wrapper">
                        <div className="row ps-5 pe-5 pt-4 pb-4">
                            <div className="col-12">
                                <p className="semifont heading_text custom-color-1">About Us</p>
                                <p className="body-sub-titles-1 lightfont custom-color-1">UBO Parts Inc is a Netherlands-based online third-party platform specializing in automotive technology. Our mission is to empower all participants in the Dutch automotive ecosystem, particularly car dismantlers, by enhancing the management of their spare parts operations. We commit to providing top-quality spare parts, thereby efficiently streamlining operations and promoting excellence throughout the industry.</p>
                            </div>
                        </div>
                    </section>
                    <section className="about-proffessionals-wrapper mt-4 pt-1">
                        <div className="row mt-3 mt-md-3 mt-xl-5">
                            <div className="col-12">
                                <p className="semifont text-size-3 custom-color-1 text-center pb-3 pt-3">Meet Our Professional Team</p>
                            </div>
                        </div>
                        <div className="row mt-2 g-3">
                            <div className="col-12 col-sm-6">
                                <div className="card shadow-none border-0 rounded-1 about-card mb-4 mb-xl-0">
                                <AppImage src="images/img/awais-m.jpg.png" className="rounded-side card-img-top"/>
                                    <div className="card-body text-center">
                                        <div className="row g-1">
                                            <div className="col-12">
                                                <span className="custom-color-9 regularfont subtitles">Awais khan</span>
                                            </div>
                                            <div className="col-12">
                                                <span className="custom-color-10 regularfont sub-sub body-sub-titles sub-sub1 text-uppercase">Co-Founder / CEO & CTO</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="card shadow-none border-0 rounded-1 about-card">
                                <AppImage src="images/img/hilal-m.jpg.png" className="rounded-side card-img-top"/> 
                                    <div className="card-body text-center">
                                        <div className="row g-1">
                                            <div className="col-12">
                                                <span className="custom-color-9 regularfont subtitles">Helal Said</span>
                                            </div>
                                            <div className="col-12">
                                                <span className="custom-color-10 sub-sub regularfont body-sub-titles sub-sub1 text-uppercase">Co-Founder / CEO & CTO</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="about-quote-wrapper pt-5 ps-xl-5 pe-xl-5">
                        <div className="row ps-5 pe-5 mt-3 mt-md-3 mt-xl-5">
                            <div className="col-12">
                                <p className="custom-color-1 text-center font-italic sub-subtext px-xl-5 mx-5 px-md-2">“The single biggest way to impact an organization is to focus on leadership development. There is almost no limit to the potential of an organization that recruits good people, raises them up as leaders and continually develops them.” </p>
                            </div>
                            <div className="col-12">
                                <p className="regularfont subtitles custom-color-1 text-center">— John Maxwell</p>
                            </div>
                        </div>
                    </section>
                </div>
                <section className="contact-wrapper coulmn-bg-color-1 mt-5">
                    <div className="container-fluid">
                        <div className="container">
                            <div className="row p-5">
                            <div className="col text-center p-xl-5 p-md-5">
                                    <a href="" className=" custom-color-11 button-bg-color-1 lightfont body-sub-titles px-5 pt-4 pb-4 ps-3 pe-3 rounded button-color">Contact Us</a>
                            </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
export default About_us;