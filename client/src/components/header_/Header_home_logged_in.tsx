// react
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image'
import AppImage from '../shared/AppImage';
import Forgotpass from '../forgot/Forgotpass';
import Login from '../account_/Login';

function Header_home_logged_in() {

    let [profiledropdown, setProfiledropdown] = useState(false);
  
    return (
        <>
            <header className="home">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-2">
                            <div className="logo w-100"><AppImage src="/images/svg/LOGO.svg"/></div>
                        </div>
                        <div className="col text-lg-end">
                            <div className="bar">
                                <ul>
                                    <li className="menu_font_size regularfont"><a href="/homepage">Home</a></li>
                                    <li className="menu_font_size regularfont"><a href="/shop">Shop</a></li>
                                    <li className="menu_font_size regularfont"><a href="/about_us_">About us</a></li>
                                    <li className="menu_font_size regularfont"><a href="/request">Request</a></li>
                                    <li className="menu_font_size regularfont"><a href="/dismantle_car ">Dismantle Car</a></li>
                                    <li className="menu_font_size regularfont"><a href="" onClick={ () => {setProfiledropdown(true)}}>My Account <AppImage src="/images/svg/my-account.svg" className="my-account"/></a></li>
                                   
                                       { /*<div id="myDropdown" className="dropdown-content" show={profiledropdown} onClickOutside={() => {setProfiledropdown(false)}}>
                                            <a href="#home">Home</a>
                                            <a href="#about">About</a>
                                            <a href="#contact">Contact</a>
    </div>*/}
                                    
                                    <li><AppImage src="/images/svg/cart-white.svg"/><span className="count">0</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
        </>
    );
}

export default Header_home_logged_in;