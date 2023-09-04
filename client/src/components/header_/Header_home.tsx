// react
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image'
import AppImage from '../shared/AppImage';
import Forgotpass from '../forgot/Forgotpass';
import Login from '../account_/Login';
import { useRouter } from 'next/router';
import Link from 'next/dist/client/link';
import APIs from '~/services/apiService';



function Header_home(props: any) {
  
    const router = useRouter();
    const [userToken, setUserToken] = useState<any>();
    useEffect(() => {
        const tokendata = localStorage.getItem('usertoken');
        setUserToken(tokendata);  
    },[userToken])
    
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const [profiledropdown, setProfiledropdown] = useState(false);
    const showLoginModal = () => {
        setLoginModalIsOpen(true);
    };

   const onLoginModalClose = () => {
        setLoginModalIsOpen(false);
    };

    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedin, setIsLoggedin] = useState(true);
    const [cartCount, setCartCount] = useState(0)

    useEffect(() => {
        APIs.getCartData({customerid: '2'}).then(response => {
            if (!response.data.error) {
                let totalCartItem = response.data.rows.length;
                setCartCount(totalCartItem)
            }
        }).catch((error) => console.log(error));
    })

    const logout = () => {
        localStorage.removeItem('usertoken');
        localStorage.removeItem('userdetails');
        setUserToken('');
        setIsLoggedin(false);
        router.push('/homepage');
    };
  
    return (
        <>
            <header className="home">
                <div className="container">
                    <div className="container-wrapper">
                        <div className="logo">
                            <AppImage src="/images/svg/LOGO.svg" />
                        </div>
                        <div className="bar w-100">
                            <ul>
                                <li className="menu_font_size regularfont"><Link href="/homepage">Home</Link></li>
                                <li className="menu_font_size regularfont"><Link href="/shop">Shop</Link></li>
                                <li className="menu_font_size regularfont"><Link href="/about_us_">About us</Link></li>
                                <li className="menu_font_size regularfont"><Link href="/request">Request</Link></li>
                                <li className="menu_font_size regularfont"><Link href="/dismantle_car">Dismantle Car</Link></li>
                                {!userToken && <li className="menu_font_size regularfont"><button type="button" onClick={showLoginModal} className="ub_login">Login</button></li>}
                                {/*props.userToken && <li className="menu_font_size regularfont"> 
                                <a href=""><AppImage src="/images/svg/my-account.svg" className="my-account"/></a></li>*/}
                            </ul>
                        </div>
                        {userToken && 
                            <div className="bar w-27 d-flex flex-row">
                                <div>
                                    <button className="btn border-0 menu_font_size regularfont menu-color" onClick={() => setIsOpen(!isOpen)}>My Account</button>
                                    {isOpen && (
                                        <div className='position-absolute menu-dropdown'>
                                            <div className='dropdownitem'>
                                                <span className='menu_font_size regularfont pointer' 
                                                    onClick={() => router.push('/profile_')}
                                                >Profile</span>
                                            </div>
                                            <div className='dropdownitem'>
                                                <span className='menu_font_size regularfont pointer' 
                                                    style={{zIndex: 2, position: 'relative'}} 
                                                    onClick={logout}
                                                >Logout</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <span className=''><AppImage src="/images/svg/my-account.svg" className="my-account"/></span>
                                <li className='mt-1'><a href="/cartpage"><AppImage src="/images/cart-white.svg"/><span className="home_count">{cartCount}</span></a></li>
                            </div>   
                        }  
                    </div>
                </div>
            </header>
            {(!userToken || userToken == '') &&
            <Login
                isOpen={loginModalIsOpen}
                onClose={onLoginModalClose}
                geUserDetails={props.geUserDetails}
            />
        }
        </>
    );
}

export default Header_home;
