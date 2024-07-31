import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../button/Button';
import { useUserStore } from '../../zustand/newsStore';

const menuLinks = [
    {
        id: 1,
        url: "/#",
        title: "Home"
    },
    {
        id: 2,
        url: "/blog",
        title: "Blog"
    },
    {
        id: 3,
        url: "/contact",
        title: "Contact"
    },
]

const HeaderStyles = styled.div`
   --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    padding: 20px 0;
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: white;
    .header-main{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .header-auth {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .logo{
        display: block;
        max-width: 50px;
    }
    .menu{
        display:flex;
        align-items: center;
        gap: 20px;
        margin-left: 40px;
        list-style-type: none;
        font-weight: bold;
        font-size: 20px;
    }

   
    .search{
        padding: 15px;
        margin-left: auto;
        border: 1px solid #ccc;
        border-radius: 8px;
        width: 100%;
        max-width: 320px;
        display: flex;
        align-items: center;
        position: relative;
        margin-right: 20px;
    }

    .search-input{
        flex: 1;
        padding-right: 30px;
        font-weight: 500;
    }

    .search-icon{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 15px;
    }

    @media screen and (max-width: 1023.98px) {
        .logo {
            max-width: 30px;
        }
        .menu,
        .search,
        .header-button,
        .header-auth {
            display: none;
        }
    }

    .header-button{
        margin-left: 20px;
    }
`

const Header = () => {
    const { userInfo } = useUserStore(state => state);
    return (
        <HeaderStyles>
            <div className="container">
                <div className="header-main">
                    <Link to="/">
                        <img className='logo' srcSet="../logo.png 2x" alt="Monkey Blogging" />
                    </Link>
                    <ul className="menu">
                        {
                            menuLinks.map(item => (
                                <li key={item.title}>
                                    <NavLink className={({ isActive }) => isActive ? "text-primary" : ""} to={item.url}>{item.title}</NavLink>
                                </li>
                            ))
                        }
                    </ul>
                    {/* <div className="search">
                        <input type="text" className='search-input' placeholder='Search post...' />
                        <span className='search-icon'>
                            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <ellipse cx="7.66669" cy="7.05161" rx="6.66669" ry="6.05161" stroke="#999999" strokeWidth="1.5" />
                                <path d="M17.0001 15.5237L15.2223 13.9099L14.3334 13.103L12.5557 11.4893" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M11.6665 12.2964C12.9671 12.1544 13.3706 11.8067 13.4443 10.6826" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>

                        </span>
                    </div> */}

                    {
                        !userInfo ?
                            <Button type="button" to="/signin" style={{ fontSize: 16 }} height="56px" className="header-button">Sign In</Button> :
                            <div className="header-auth">
                                <Button
                                    type="button"
                                    height="56px"
                                    className="header-button"
                                    to="/dashboard"
                                >
                                    Dashboard
                                </Button>
                            </div>
                    }
                </div>
            </div>
        </HeaderStyles>
    );
};

export default Header;