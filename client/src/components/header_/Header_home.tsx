// react
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image'
import AppImage from '../shared/AppImage';
import Forgotpass from '../forgot/Forgotpass';
import Login from '../account_/Login';
import { useRouter } from 'next/router';
import Link from 'next/dist/client/link';
import APIs from '~/services/apiService';
import { UserContext } from '../account_/UserContext';
import { BASE_URL } from 'configuration';
import Dropdown from '~/components/header/Dropdown';
import { useSetLocale } from '~/services/i18n/hooks';


function Header_home(props: any) {
  
    const router = useRouter();
    const {user, saveUser, cartCount, setCartCount, setLanguage} = UserContext();
    const [userToken, setUserToken] = useState<any>();
    const [selectedLanguage, setSelectedLanguage] = useState<any>("EN")
    const [showMenu, setShowMenu] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const setLocale = useSetLocale();

    useEffect(() => {
        setLanguage({
            title: "English",
            value: "en",
            image: "https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg",
            TitleShort: "EN"
        })
    }, []);

    useEffect(() => {
        const tokendata = localStorage.getItem('usertoken');
        setUserToken(tokendata);  
        if(user?.role?.type == "admin"){
            setIsAdmin(true)
        }
    },[userToken]);

    useEffect(() => {
        setLoginModalIsOpen(false);
        const tokendata: any = localStorage.getItem('usertoken');
        setUserToken(tokendata);
        user?.id && APIs.getCartData({customerid: user.id}).then(response => {
            setCartCount(response?.data?.rows?.length);
        }).catch(err => console.log(err))
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

    const logout = () => {
        localStorage.removeItem('usertoken');
        router.push('/homepage');
        localStorage.removeItem('userdetails');
        setUserToken('');
        setIsLoggedin(false);
        setIsOpen(!isOpen);
        saveUser({});
        setIsAdmin(false)
    };

    const handleItemClick = (item : any) => {
        setLocale(item.value);
        setSelectedLanguage(item.TitleShort);
        setLanguage(item);
    };

    let languageItems = [
        {
            title: "Dutch",
            value: "nl",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Flag_of_the_Netherlands.svg/800px-Flag_of_the_Netherlands.svg.png",
            TitleShort: "NL"
        },
        {
            title: "English",
            value: "en",
            image: "https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg",
            TitleShort: "EN"
        }
    ]

    const items: any[] = useMemo(() => (
        languageItems.map(((lan) => ({
            title: `${lan.title}`,
            value: `${lan.value}`,
            image: `${lan.image}`,
            TitleShort: `${lan.TitleShort}`
        })))
    ), []);

    const showMenuFunction = () =>{
        setShowMenu(!showMenu)
    }
  
    return (
        <>
            <header className="home">
                <div className="container">
                    <div className="container-wrapper ubo-menu-container">
                        <div className="logo" onClick={() => router.push("/homepage")}>
                            <AppImage src="/images/svg/LOGO.svg" />
                        </div>
                        <div className="bar w-100 bar-mobile">
                            <ul style={{display: `${isAdmin? "none" : ""}`}}>
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

                        {/* for mobile */}
                       <div className="mobile_menu" style={{display: `${showMenu ? "block" : "none"}`}}>
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
                                {userToken && 
                                    <div className=''>
                                    <button className="btn border-0 menu_font_size regularfont myaccount-mobile" onClick={() => setIsOpen(!isOpen)}>My Account</button>
                                    {isOpen && (
                                        <div className='position-absolute menu-dropdown account-dropdown'>
                                            <div className='dropdownitem'>
                                                <span className='menu_font_size regularfont pointer' 
                                                    onClick={() => {
                                                        let route = (user.isApproved === 'Active' && user.role.type === 'seller') ? '/seller/dashboard' : '/purchase-history';
                                                        router.push(route);
                                                        setIsOpen(!isOpen);
                                                    }}
                                                >Dashboard</span>
                                            </div>
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
                                        </div>
                                    )}
                                </div>
                                } 
                            </ul>
                       </div>

                        {userToken && 
                            <div className="bar w-27 d-flex flex-row ubo-menu-wrapper">
                                <div className='bar-mobile-myaccount'>
                                    <button className="btn border-0 menu_font_size regularfont menu-color" onClick={() => setIsOpen(!isOpen)}>My Account</button>
                                    {isOpen && (
                                        <div className='position-absolute menu-dropdown account-dropdown'>
                                            <div style={{display: `${isAdmin? "none" : "block"}`}} className='dropdownitem'>
                                                <span className='menu_font_size regularfont pointer' 
                                                    onClick={() => {
                                                        let route = (user.isApproved === 'Active' && user.role.type === 'seller') ? '/seller/dashboard' : '/purchase-history';
                                                        router.push(route);
                                                        setIsOpen(!isOpen);
                                                    }}
                                                >Dashboard</span>
                                            </div>
                                            <div style={{display: `${isAdmin? "none" : "block"}`}} className='dropdownitem'>
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
                                        </div>
                                    )}
                                </div>
                                <span className='ml-2' onClick={() =>setIsOpen(false)} style={{borderRadius: '100%'}}>
                                    {user?.profile_image?.url ?
                                        <AppImage src={user?.profile_image?.url ? BASE_URL + user?.profile_image?.url : "/images/svg/my-account.svg"}
                                            style={{ height: '2.4rem', width: '2.4rem', objectFit: 'cover', borderRadius: '100%' }}
                                        />
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-person-circle" viewBox="0 0 16 16">  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" /></svg>

                                    }
                                </span>
                                {
                                    isAdmin ? 
                                        ""
                                    :
                                        <ul className="pl-4">
                                            <li className='mt-1 pointer'
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <Link href="/cartpage">
                                                    <span className="position-relative">
                                                        <AppImage src="/images/cart-white.svg" />
                                                        {cartCount != 0 ? <span className="home_count">{cartCount}</span> : ""}

                                                    </span>
                                                </Link>
                                            </li>
                                        </ul>
                                }
                                
                            </div>   
                        }  
                        <Dropdown
                            title={selectedLanguage}
                            items={items}
                            onItemClick={handleItemClick}
                        />
                        <div className='hamburger' onClick={showMenuFunction}>
                            {
                                showMenu ? 
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-x" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                </svg> 
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-list" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                                </svg>
                            }
                         </div>
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
                            <p className="semifont heading_text text-white">Dismantle Your<br /> Car With Us</p>
                            <p className="lightfont sub-text-1 text-white">Browse our expansive selection<br /> featuring hundreds of brands and<br /> tens of thousands of quality parts.</p>
                        </div>
                    </div>
                </div>}
                {router.pathname == '/seller-registration' && <div className="container">
                    <div className="row d-flex align-items-center header-middle-text pl-5 ml-5">
                        <div className="col box w-100">
                            <p className="semifont heading_text text-white">Sell Quality Parts<br /> With Us</p>
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
