// react
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image'
import AppImage from '../shared/AppImage';
import Forgotpass from '../forgot/Forgotpass';
import Login from '../account/Login';

function Header_home_logged_in() {
  
    return (
        <>
            <header className="home">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-2">
                            <div className="logo w-100"><AppImage src="images/LOGO.svg"/></div>
                        </div>
                        <div className="col text-lg-end">
                            <div className="bar">
                                <ul>
                                    <li className="menu_font_size regularfont"><a href="/homepage">Home</a></li>
                                    <li className="menu_font_size regularfont"><a href="/shop">Shop</a></li>
                                    <li className="menu_font_size regularfont"><a href="/about_us_">About us</a></li>
                                    <li className="menu_font_size regularfont"><a href="/request">Request</a></li>
                                    <li className="menu_font_size regularfont"><a href="">Dismantle Car</a></li>
                                    <li className="menu_font_size regularfont"><a href="">My Account <AppImage src="images/my-account.svg" className="my-account"/></a></li>
                                    <li><AppImage src="images/cart-white.svg"/><span className="count">0</span></li>
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