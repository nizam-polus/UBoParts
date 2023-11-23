// react
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image'
import AppImage from '../shared/AppImage';
import Forgotpass from '../forgot/Forgotpass';
import Login from '../account_/Login';
import { useRouter } from 'next/router';
import Link from 'next/link';
import APIs from '~/services/apiService';
import { UserContext } from '../account_/UserContext';
import { BASE_URL } from 'configuration';
import Dropdown from '~/components/header/Dropdown';
import { useSetLocale } from '~/services/i18n/hooks';
import { FormattedMessage } from 'react-intl';


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
        let storedLocal: any = localStorage.getItem("locale")
        let storedCaps: any = localStorage.getItem("localCaps")
        if(storedCaps){
            setSelectedLanguage(storedCaps);
        }else{
            setSelectedLanguage("EN")
            localStorage.setItem("locale", "en")
        }
        setLocale(storedLocal)
        
    }, []);

    useEffect(() =>{
        if(user.id){
            APIs.getSpecificUser(user.id).then((res) =>{
             saveUser(res.data)
            })
        }
    },[userToken])

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
        setShowMenu(false);
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
        localStorage.removeItem('uid');
        setUserToken('');
        setIsLoggedin(false);
        setIsOpen(!isOpen);
        saveUser({});
        setIsAdmin(false);
        setShowMenu(false);
    };

    const handleItemClick = (item : any) => {
        setLocale(item.value);
        setSelectedLanguage(item.TitleShort);
        setLanguage(item);
        localStorage.setItem("locale", item.value)
        localStorage.setItem("localCaps", item.TitleShort)
    };

    let languageItems = [
        {
            title: "Dutch",
            value: "nl",
            image: "images/languages/netherlands.svg",
            TitleShort: "NL"
        },
        {
            title: "English",
            value: "en",
            image: "images/languages/united-kingdom.svg",
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
            {/* new header mobile */}
            <header className="site__mobile-header d-block d-xl-none">
                <div className="mobile-header">
                    <div className="container">
                        <div className="mobile-header__body">
                            <button className="mobile-header__menu-button" type="button" onClick={showMenuFunction}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14">
                                    <path d="M0 8V6h18v2H0zm0-8h18v2H0V0zm14 14H0v-2h14v2z"></path>
                                </svg>
                            </button>
                            <Link href="/homepage">
                                <a className="mobile-header__logo">
                                    <div className="mobile-logo">
                                        <AppImage src="/images/svg/LOGO.svg" width="130" height="20" />
                                    </div>
                                </a>
                            </Link>
                            <div className="mobile-header__indicators">
                                <div className="mobile-indicator">
                                {userToken && (
                                isAdmin ? "" : (
                                    <Link href="/cartpage">
                                        <a className="mobile-indicator__button">
                                            <span className="mobile-indicator__icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                                                    <circle cx="7" cy="17" r="2"></circle>
                                                    <circle cx="15" cy="17" r="2"></circle>
                                                    <path d="M20 4.4V5l-1.8 6.3c-.1.4-.5.7-1 .7H6.7c-.4 0-.8-.3-1-.7L3.3 3.9c-.2-.6-.7-.9-1.2-.9H.4C.2 3 0 2.8 0 2.6V1.4c0-.2.2-.4.4-.4h2.5c1 0 1.8.6 2.1 1.6l.1.4 2.3 6.8c0 .1.2.2.3.2h8.6c.1 0 .3-.1.3-.2l1.3-4.4c0-.2-.2-.4-.4-.4H9.4c-.2 0-.4-.2-.4-.4V3.4c0-.2.2-.4.4-.4h9.2c.8 0 1.4.6 1.4 1.4z"></path>
                                                </svg>
                                                <span className="mobile-indicator__counter">{cartCount}</span>
                                            </span>
                                        </a>
                                    </Link>
                                )
                                )}
                                </div>
                                <div className="mobile-indicator ml-2">
                                    <Dropdown title={selectedLanguage} items={items} onItemClick={handleItemClick} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/* new header mobile */}
            {/* new header */}
            <header className="site__header d-none d-xl-block py-0">
                <div className="header">
                    <div className="header__logo">
                        <a className="logo" onClick={() => router.push("/homepage")}>
                            <div className="logo__image">
                                <AppImage src="/images/svg/LOGO.svg" />
                            </div>
                        </a>
                    </div>
                    <div className="header__search">
                        <div className="search bar">
                            <ul className={"menu_font_size regularfont" + (isAdmin ? " d-none" : "")}>
                                <li className="menu_font_size regularfont" onClick={() => setIsOpen(false)}>
                                    <Link href="/homepage">
                                        <span className="pointer">
                                            <FormattedMessage id="HOME" />
                                        </span>
                                    </Link>
                                </li>
                                <li className="menu_font_size regularfont" onClick={() => setIsOpen(false)}>
                                    <Link href="/shop">
                                        <span className="pointer">
                                            <FormattedMessage id="SHOP" />
                                        </span>
                                    </Link>
                                </li>
                                <li className="menu_font_size regularfont" onClick={() => setIsOpen(false)}>
                                    <Link href="/about_us_">
                                        <span className="pointer">
                                            <FormattedMessage id="ABOUT_US" />
                                        </span>
                                    </Link>
                                </li>
                                <li className="menu_font_size regularfont" onClick={() => setIsOpen(false)}>
                                    <Link href="/request">
                                        <span className="pointer">
                                            <FormattedMessage id="REQUEST" />
                                        </span>
                                    </Link>
                                </li>
                                <li className="menu_font_size regularfont" onClick={() => setIsOpen(false)}>
                                    <Link href="/dismantle_car">
                                        <span className="pointer">
                                            <FormattedMessage id="DISMANTLE" />
                                        </span>
                                    </Link>
                                </li>
                                {!userToken && (
                                    <li className="menu_font_size regularfont" onClick={() => setIsOpen(false)}>
                                        <Link href="/seller-registration">
                                            <span className="pointer">
                                                <FormattedMessage id="START_SELL" />
                                            </span>
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="header__indicators">
                        <div
                            className={
                                "d-flex align-items-center indicator indicator--trigger--click ubo-acc-container mr-4" +
                                (!!isOpen ? " indicator--open" : "")
                            }
                        >
                            {!userToken && (
                                <a className="btn ub_login" onClick={showLoginModal}>
                                    <FormattedMessage id="LOGIN" />
                                </a>
                            )}

                            {userToken && (
                                <a
                                    className="indicator__button justify-content-center"
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    <button
                                        className="btn border-0 menu_font_size regularfont menu-color"
                                        onClick={() => setIsOpen(!isOpen)}
                                    >
                                        <FormattedMessage id="MY_ACCOUNT" />
                                    </button>
                                    <span className="indicator__icon ubo-header-icon">
                                        {user?.profile_image?.url ? (
                                            <AppImage
                                                src={
                                                    user?.profile_image?.url
                                                        ? BASE_URL + user?.profile_image?.url
                                                        : "/images/svg/my-account.svg"
                                                }
                                                style={{
                                                    objectFit: "cover",
                                                    borderRadius: "100%",
                                                }}
                                            />
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="32"
                                                height="32"
                                                fill="white"
                                                className="bi bi-person-circle"
                                                viewBox="0 0 16 16"
                                            >
                                                {" "}
                                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />{" "}
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                                                />
                                            </svg>
                                        )}
                                    </span>
                                </a>
                            )}
                            {userToken && (
                                <div className="indicator__content">
                                    <div className="account-menu menu-dropdown">
                                        <a className="account-menu__user menu_font_size regularfont">
                                            <div className="account-menu__user-avatar">
                                                {user?.profile_image?.url ? (
                                                    <AppImage
                                                        src={
                                                            user?.profile_image?.url
                                                                ? BASE_URL + user?.profile_image?.url
                                                                : "/images/svg/my-account.svg"
                                                        }
                                                        style={{
                                                            height: "2.4rem",
                                                            width: "2.4rem",
                                                            objectFit: "cover",
                                                            borderRadius: "100%",
                                                        }}
                                                    />
                                                ) : (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="30"
                                                        height="30"
                                                        fill="white"
                                                        className="bi bi-person-circle"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        {" "}
                                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />{" "}
                                                        <path
                                                            fill-rule="evenodd"
                                                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="account-menu__user-info">
                                                <div className=" account-menu__user-name">
                                                    {(user?.role?.type !== "admin") && user.first_name + " " + user.last_name}
                                                </div>
                                                <div className=" account-menu__user-email">{user.username}</div>
                                            </div>
                                        </a>
                                        <div className="account-menu__divider"></div>
                                        <ul className="account-menu__links menu_font_size regularfont pointer">
                                            <li>
                                                <a
                                                    onClick={() => {
                                                        let route =
                                                            user.isApproved === "Active" && user.role.type === "seller"
                                                                ? "/seller/dashboard"
                                                                : "/purchase-history";
                                                        router.push(route);
                                                        setIsOpen(!isOpen);
                                                    }}
                                                >
                                                    <FormattedMessage id="DASHBOARD" />
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    onClick={() => {
                                                        router.push("/profile_");
                                                        setIsOpen(!isOpen);
                                                    }}
                                                >
                                                    <FormattedMessage id="PROFILE" />
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="account-menu__divider"></div>
                                        <ul className="account-menu__links menu_font_size regularfont pointer">
                                            <li>
                                                <button type="button" onClick={logout}>
                                                    <FormattedMessage id="LOGOUT" />
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="indicator indicator--trigger--click">
                        {userToken && (
                                isAdmin ? "" : (

                                <Link href="/cartpage">
                                    <a
                                        className="indicator__button"
                                        onClick={() => {
                                            setIsOpen(false);
                                        }}
                                    >
                                        <span className="indicator__icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                                                <circle cx="10.5" cy="27.5" r="2.5"></circle>
                                                <circle cx="23.5" cy="27.5" r="2.5"></circle>
                                                <path d="M26.4 21H11.2c-1.2 0-2.2-.8-2.4-1.9L5.4 4.8c-.1-.5-.5-.8-1-.8H1c-.6 0-1-.4-1-1s.4-1 1-1h3.4C5.8 2 7 3 7.3 4.3l3.4 14.3c.1.2.3.4.5.4h15.2c.2 0 .4-.1.5-.4l3.1-10c.1-.2 0-.4-.1-.4-.1-.1-.2-.2-.4-.2H14c-.6 0-1-.4-1-1s.4-1 1-1h15.5c.8 0 1.5.4 2 1s.6 1.5.4 2.2l-3.1 10c-.3 1.1-1.3 1.8-2.4 1.8z"></path>
                                            </svg>
                                            {cartCount != 0 ? (
                                                <span className="indicator__counter">{cartCount}</span>
                                            ) : (
                                                ""
                                            )}
                                        </span>
                                    </a>
                                </Link>
                                )
                        )}
                        </div>

                        <div
                            className="d-flex align-items-center indicator indicator--trigger--click"
                            onClick={() => {
                                setIsOpen(false);
                            }}
                        >
                            <Dropdown title={selectedLanguage} items={items} onItemClick={handleItemClick} />
                        </div>
                    </div>
                </div>
            </header>
            {/* new header ends */}
            {/* new mobile menu */}

            <div className={"mobile-menu" + (!!showMenu ? " mobile-menu--open" : "")}>
                <div className="mobile-menu__backdrop"></div>
                <div className="mobile-menu__body">
                    <button className="mobile-menu__close" type="button" onClick={showMenuFunction}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12">
                            <path d="M10.8 10.8c-.4.4-1 .4-1.4 0L6 7.4l-3.4 3.4c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4L4.6 6 1.2 2.6c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0L6 4.6l3.4-3.4c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L7.4 6l3.4 3.4c.4.4.4 1 0 1.4z"></path>
                        </svg>
                    </button>
                    <div className="mobile-menu__conveyor" style={{ transform: "translateX(-0%)" }}>
                        <div className="mobile-menu__panel" style={{ transform: "translateX(0%)" }}>
                            <div className="mobile-menu__panel-header">
                                <div className="mobile-menu__panel-title"><FormattedMessage id="MENU" /></div>
                            </div>
                            <div className="mobile-menu__panel-body">
                                <div className="mobile-menu__divider"></div>
                                <div className="mobile-menu__links">
                                    <ul>
                                        <li className={"menu_font_size regularfont" + (isAdmin ? " d-none" : "")} onClick={showMenuFunction} >
                                            <Link href="/homepage">
                                                <a>
                                                    <FormattedMessage id="HOME" />
                                                </a>
                                            </Link>
                                        </li>
                                        <li className={"menu_font_size regularfont" + (isAdmin ? " d-none" : "")} onClick={showMenuFunction} >
                                            <Link href="/shop">
                                                <a>
                                                    <FormattedMessage id="SHOP" />
                                                </a>
                                            </Link>
                                        </li>
                                        <li className={"menu_font_size regularfont" + (isAdmin ? " d-none" : "")} onClick={showMenuFunction} >
                                            <Link href="/about_us_">
                                                <a>
                                                    <FormattedMessage id="ABOUT_US" />
                                                </a>
                                            </Link>
                                        </li>
                                        <li className={"menu_font_size regularfont" + (isAdmin ? " d-none" : "")} onClick={showMenuFunction} >
                                            <Link href="/request">
                                                <a>
                                                    <FormattedMessage id="REQUEST" />
                                                </a>
                                            </Link>
                                        </li>
                                        <li className={"menu_font_size regularfont" + (isAdmin ? " d-none" : "")} onClick={showMenuFunction} >
                                            <Link href="/dismantle_car">
                                                <a>
                                                    <FormattedMessage id="DISMANTLE" />
                                                </a>
                                            </Link>
                                        </li>
                                        {!userToken && (
                                            <li className={"menu_font_size regularfont" + (isAdmin ? " d-none" : "")} onClick={showMenuFunction} >
                                                <Link href="/seller-registration">
                                                    <a>
                                                        <FormattedMessage id="START_SELL" />
                                                    </a>
                                                </Link>
                                            </li>
                                        )}
                                        {!userToken && (
                                            <li className="menu_font_size regularfont">
                                                <button type="button" onClick={showLoginModal} className="ub_login">
                                                    <FormattedMessage id="LOGIN" />
                                                </button>
                                            </li>
                                        )}
                                        {/*props.userToken && <li className="menu_font_size regularfont"> 
                                <a href=""><AppImage src="/images/svg/my-account.svg" className="my-account"/></a></li>*/}
                                        {userToken && (
                                            <div className="">
                                                <button
                                                    className="btn border-0 menu_font_size regularfont myaccount-mobile"
                                                    onClick={() => setIsOpen(!isOpen)}
                                                >
                                                    <FormattedMessage id="MY_ACCOUNT" />
                                                </button>
                                                {isOpen && (
                                                    <div className="position-absolute menu-dropdown account-dropdown">
                                                        <div className="dropdownitem">
                                                            <span
                                                                className="menu_font_size regularfont pointer"
                                                                onClick={() => {
                                                                    let route =
                                                                        user.isApproved === "Active" &&
                                                                        user.role.type === "seller"
                                                                            ? "/seller/dashboard"
                                                                            : "/purchase-history";
                                                                    router.push(route);
                                                                    setShowMenu(!showMenu);
                                                                }}
                                                            >
                                                                <FormattedMessage id="DASHBOARD" />
                                                            </span>
                                                        </div>
                                                        <div className="dropdownitem">
                                                            <span
                                                                className="menu_font_size regularfont pointer"
                                                                onClick={() => {
                                                                    router.push("/profile_");
                                                                    setShowMenu(!showMenu);
                                                                }}
                                                            >
                                                                <FormattedMessage id="PROFILE" />
                                                            </span>
                                                        </div>
                                                        <div className="dropdownitem">
                                                            <span
                                                                className="menu_font_size regularfont pointer"
                                                                style={{ zIndex: 2, position: "relative" }}
                                                                onClick={logout}
                                                            >
                                                                <FormattedMessage id="LOGOUT" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </ul>
                                </div>
                                <div className="mobile-menu__spring"></div>
                                <div className="mobile-menu__divider"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* new mobile menu ends */}
            <header className="home p-0">
                {router.pathname == "/request" && (
                    <div className="container">
                        <div className="row d-flex align-items-center header-middle-text pl-5">
                            <div className="col box w-100">
                                <p className="semifont heading_text text-white" style={{ lineHeight: 1 }}>
                                    <FormattedMessage id="REQUEST_PART" />
                                    <br /> <FormattedMessage id="WITH_US" />
                                </p>
                                <p className="lightfont sub-text-1 text-white">
                                    <FormattedMessage id="REQUEST_DESCRIPTION_1" />
                                    <br /> <FormattedMessage id="REQUEST_DESCRIPTION_2" />
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {router.pathname == "/dismantle_car" && (
                    <div className="container">
                        <div className="row d-flex align-items-center header-middle-text pl-5">
                            <div className="col box w-100">
                                <p className="semifont heading_text text-white" style={{ lineHeight: 1 }}>
                                    <FormattedMessage id="DISMANTLE_TITLE" />
                                    <br /> <FormattedMessage id="DISMANTLE_TITLE_2" />
                                </p>
                                <p className="lightfont sub-text-1 text-white">
                                    <FormattedMessage id="DISMANTLE_DESCRIPTION_1" />
                                    <br /><FormattedMessage id="DISMANTLE_DESCRIPTION_2" />
                                    <br /> 
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {router.pathname == "/seller-registration" && (
                    <div className="container">
                        <div className="row d-flex align-items-center header-middle-text pl-5">
                            <div className="col box w-100">
                                <p className="semifont heading_text text-white" style={{ lineHeight: 1 }}>
                                    <FormattedMessage id="SELL_CAR_PARTS" />
                                    <br /> <FormattedMessage id="IN_A_CLICK" />
                                </p>
                                <p className="lightfont sub-text-1 text-white">
                                    <FormattedMessage id="SELL_DESCRIPTION_1"/>
                                    <br />  <FormattedMessage id="SELL_DESCRIPTION_2"/>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </header>
            {(!userToken || userToken == "") && (
                <Login isOpen={loginModalIsOpen} onClose={onLoginModalClose} geUserDetails={props.geUserDetails} />
            )}
        </>
    );
}

export default Header_home;
