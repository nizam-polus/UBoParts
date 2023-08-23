// react
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image'
import AppImage from '../shared/AppImage';
import Forgotpass from '../forgot/Forgotpass';
import Login from '../account_/Login';
import axios from 'axios';

function Header_logged_in() {
    
    const token = '06260c6d8d00a89764faeed708915d97ec4e9f184ad6ab627cca06ac48af38cb943fce62340d5a330a019077b4fa6462b6f6a84000b412cd4cb6022ad1c5725b03ba10849d61dc0862615204e05d01be610c0074dba6ab23f3ec2f9753587a4233e30546f13424d5eba13dea15e6e0f04595c2da1e6335bb947889472ebeb081'
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
