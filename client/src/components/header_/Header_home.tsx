// react
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image'
import AppImage from '../shared/AppImage';
import Forgotpass from '../forgot/Forgotpass';
import Login from '../account_/Login';
import { useRouter } from 'next/router';
import Link from 'next/dist/client/link';
import APIs from '~/services/apiService';
import { UserContext } from '../account_/UserContext';


function Header_home(props: any) {
  
    const router = useRouter();
    const {user, saveUser} = UserContext();
    const [userToken, setUserToken] = useState<any>();

    useEffect(() => {
        const tokendata = localStorage.getItem('usertoken');
        setUserToken(tokendata);  
    },[userToken]);

    useEffect(() => {
        setLoginModalIsOpen(false);
        const tokendata: any = localStorage.getItem('usertoken');
        setUserToken(tokendata);
    }, [user]);
    
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
        APIs.getCartData({customerid: user.id}).then(response => {
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
        setIsOpen(!isOpen)
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
                                <li className="menu_font_size regularfont" onClick={() =>setIsOpen(false)}><Link href="/homepage">Home</Link></li>
                                <li className="menu_font_size regularfont" onClick={() =>setIsOpen(false)}><Link href="/shop">Shop</Link></li>
                                <li className="menu_font_size regularfont" onClick={() =>setIsOpen(false)}><Link href="/about_us_">About us</Link></li>
                                <li className="menu_font_size regularfont" onClick={() =>setIsOpen(false)}><Link href="/request">Request</Link></li>
                                <li className="menu_font_size regularfont" onClick={() =>setIsOpen(false)}><Link href="/dismantle_car">Dismantle Car</Link></li>
                                {!userToken && <li className="menu_font_size regularfont" onClick={() =>setIsOpen(false)}><Link href="/seller-registration">Start Selling</Link></li>}
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
                                        <div className='position-absolute menu-dropdown account-dropdown'>
                                            {user.user_type === 'seller' && <div className='dropdownitem'>
                                                <span className='menu_font_size regularfont pointer' 
                                                    onClick={() => {
                                                        router.push('/seller/dashboard');
                                                        setIsOpen(!isOpen);
                                                    }}
                                                >Dashboard</span>
                                            </div>}
                                            <div className='dropdownitem'>
                                                <span className='menu_font_size regularfont pointer' 
                                                    onClick={() => {
                                                        router.push('/profile_');
                                                        setIsOpen(!isOpen);
                                                    }}
                                                >Profile</span>
                                            </div>
                                            <div className='dropdownitem'>
                                                <span className='menu_font_size regularfont pointer' 
                                                    style={{zIndex: 2, position: 'relative'}} 
                                                    onClick={logout}
                                                >Logout</span>
                                            </div>
                                            {user.user_type !== 'seller' && <div className='dropdownitem'>
                                                <span className='menu_font_size regularfont pointer required-text' 
                                                    style={{zIndex: 2, position: 'relative'}} 
                                                    onClick={() => console.log('become a seller')}
                                                >Start Selling</span>
                                            </div>}
                                        </div>
                                    )}
                                </div>
                                <span className='' onClick={() =>setIsOpen(false)}><AppImage src="/images/svg/my-account.svg" className="my-account"/></span>
                                <li className='mt-1 pointer' 
                                    onClick={() =>setIsOpen(false)}
                                >
                                    <Link href="/cartpage">
                                        <span>
                                            <AppImage src="/images/cart-white.svg"/>
                                            <span className="home_count">{cartCount}</span>
                                        </span>
                                    </Link>
                                </li>
                            </div>   
                        }  
                    </div>
                </div>
                {router.pathname == '/request' && <div className="container">
                    <div className="row d-flex align-items-center header-middle-text pl-5">
                        <div className="col box w-100">
                            <p className="semifont heading_text text-white">Request Parts<br /> With Us</p>
                            <p className="lightfont sub-text-1 text-white">Browse our expansive selection<br /> featuring hundreds of brands and<br /> tens of thousands of quality parts.</p>
                        </div>
                    </div>
                </div>}
                {router.pathname == '/dismantle_car' && <div className="container">
                    <div className="row d-flex align-items-center header-middle-text pl-5 ml-5">
                        <div className="col box w-100">
                            <p className="semifont heading_text text-white">Dismantle your<br /> car with us</p>
                            <p className="lightfont sub-text-1 text-white">Browse our expansive selection<br /> featuring hundreds of brands and<br /> tens of thousands of quality parts.</p>
                        </div>
                    </div>
                </div>}
                {router.pathname == '/seller-registration' && <div className="container">
                    <div className="row d-flex align-items-center header-middle-text pl-5 ml-5">
                        <div className="col box w-100">
                            <p className="semifont heading_text text-white">Dismantle your<br /> car with us</p>
                            <p className="lightfont sub-text-1 text-white">Browse our expansive selection<br /> featuring hundreds of brands and<br /> tens of thousands of quality parts.</p>
                        </div>
                    </div>
                </div>}
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
