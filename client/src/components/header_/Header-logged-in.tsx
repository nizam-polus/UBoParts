// react
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image'
import AppImage from '../shared/AppImage';
import Forgotpass from '../forgot/Forgotpass';
import Login from '../account_/Login';
import axios from 'axios';

function Header_logged_in() {
    
    const token = '1038115969def4915ab7b14c9d5583d38a3305f256de2f5512ae6ee9551201716f465b5e6e1e61fc28ac0f78a2831731b4ba1549a0099f4efda222b572e4e47f8108f0569538ee578dc1abb0a8e1e2f10d410b08a73ae37b28a0feebc37f137ae82d2efb688fe7d6175c6b36573a831bb52e15914e20cb462874a817440853a0'
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    const [cartCount, setCartCount] = useState(0)

    useEffect(() => {
        axios.post('http://52.6.187.235:1337/api/getcartdetails', {customerid: '2'}, {headers}).then(response => {
            let totalCartItem = response.data.rows.length;
            setCartCount(totalCartItem)
        })
    })

    return (
        <>
            
            <header className="normal_head ub_desktop_header">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-lg-auto">
                        <div className="logo1"><AppImage src="images/svg/LOGO.svg"/></div>
                    </div>
                    <div className="col text-lg-end">
                        <div className="bar">
                            <ul className="p-0">
                                <li className="menu_font_size regularfont"><a href="/homepage">Home</a></li>
                                <li className="menu_font_size regularfont"><a href="/shop">Shop</a></li>
                                <li className="menu_font_size regularfont"><a href="/about_us_">About us</a></li>
                                <li className="menu_font_size regularfont"><a href="/request">Request</a></li>
                                <li className="menu_font_size regularfont"><a href="">Dismantle Car</a></li>
                                <li className="menu_font_size regularfont"><a href="">My Account <AppImage src="images/svg/my-account.svg" className="my-account"/></a></li>
                                <li><a href="/cartpage"><AppImage src="/images/cart-white.svg"/><span className="count">{cartCount}</span></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
            
        </>
    );
}

export default Header_logged_in;
