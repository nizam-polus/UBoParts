// react
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image'
import AppImage from '../shared/AppImage';
import Forgotpass from '../forgot/Forgotpass';
import Login from '../account_/Login';
import APIs from '~/services/apiService';
import { UserContext } from '../account_/UserContext';

function Header_logged_in() {

    const { user, saveUser } = UserContext();
    const [cartCount, setCartCount] = useState(0)

    useEffect(() => {
        if (user.id) {
            APIs.getCartData({customerid: user.id}).then(response => {
                let totalCartItem = response.data.rows.length;
                setCartCount(totalCartItem)
            })
        }
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
