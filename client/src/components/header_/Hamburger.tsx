import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const HamburgerMenu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [userToken, setUserToken] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call the function once to initialize the state

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const tokendata = localStorage.getItem('usertoken');
    setUserToken(tokendata);  
},[userToken]);

  return (
    <div className={`hamburger-menu ${showMenu ? 'open' : ''}`}>
      <div className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
          <ul>
              <li className="menu_font_size regularfont" onClick={() => setIsOpen(false)}><Link href="/homepage">Home</Link></li>
              <li className="menu_font_size regularfont" onClick={() => setIsOpen(false)}><Link href="/shop">Shop</Link></li>
              <li className="menu_font_size regularfont" onClick={() => setIsOpen(false)}><Link href="/about_us_">About us</Link></li>
              <li className="menu_font_size regularfont" onClick={() => setIsOpen(false)}><Link href="/request">Request</Link></li>
              <li className="menu_font_size regularfont" onClick={() => setIsOpen(false)}><Link href="/dismantle_car">Dismantle Car</Link></li>
              {!userToken && <li className="menu_font_size regularfont" onClick={() => setIsOpen(false)}><Link href="/seller-registration">Start Selling</Link></li>}
              {!userToken && <li className="menu_font_size regularfont"><button type="button" className="ub_login">Login</button></li>}
              {/*props.userToken && <li className="menu_font_size regularfont"> 
                                <a href=""><AppImage src="/images/svg/my-account.svg" className="my-account"/></a></li>*/}
          </ul>
    </div>
  );
};

export default HamburgerMenu;
