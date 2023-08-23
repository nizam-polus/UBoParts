// react
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image'
import AppImage from '../shared/AppImage';
import Forgotpass from '../forgot/Forgotpass';
import Login from '../account_/Login';
import axios from 'axios';

function Header_logged_in() {
    
    const token = '2c82df0e9f171ad5cea40c8451ce811b84d898b32e03b43ecec923457735b5ce6446ffcd68659ff11fd6bd1e1f4ba89498a58e30229a15fe683147d245498446d8ebb0c1e56437835fbd320246fd4519f7c23cf04c9eb29aff57c21052913af1b8f60432385cd21b6325ced78ecedd666a58bd0e80f44cf60d56e82d5cc022cb'
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    const [cartCount, setCartCount] = useState(0)

    useEffect(() => {
        axios.post('http://10.199.100.156:1337/api/getcartdetails', {customerid: '2'}, {headers}).then(response => {
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
