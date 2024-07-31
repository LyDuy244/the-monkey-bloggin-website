import React from 'react';
import styled from 'styled-components';
import Button from '../../components/button/Button';


const HomerBannerStyles = styled.div`
    min-height: 520px;
    padding: 40px 0;
    margin-bottom: 60px;
    background-image: linear-gradient(to right bottom,
        ${props => props.theme.primary},
        ${props => props.theme.secondary});
    .banner{
        display:flex;
        justify-content: space-between;
        align-items: center;
        &-content{
            max-width: 600px;
            color: white;
        }
        &-heading{
            font-size: 36px;
            margin-bottom: 20px;
        }
        &-desc{
            line-height: 1.75;
            margin-bottom: 40px;
        }
    }

    @media screen and (max-width: 1023.98px) {
    .banner {
      flex-direction: column;
      min-height: unset;
      &-heading {
        font-size: 30px;
        margin-bottom: 10px;
        font-weight: bold;
      }
      &-desc {
        font-size: 14px;
        margin-bottom: 20px;
      }
      &-image {
        margin-top: 25px;
      }
      &-button {
        font-size: 14px;
        height: auto;
        padding: 15px;
      }
    }
  }
`
const HomeBanner = () => {
    return (
        <HomerBannerStyles>
            <div className="container">
                <div className="banner">
                    <div className="banner-content">
                        <div className="banner-heading">Monkey Blogging</div>
                        <p className="banner-desc">
                            Monkey Blogging is a unique and inspiring project that creates a platform for sharing knowledge in IT and related topics. It aims to build a learning and growth community where individuals, from beginners to experienced professionals, can post articles, share experiences, and exchange ideas. This project not only expands users' knowledge but also fosters connections and interactions among members, creating a dynamic and creative learning environment. Join Monkey Blogging to share, learn, and grow in IT and beyond!
                        </p>
                        <Button kind="secondary" type="button" to="/signup">Get started</Button>
                    </div>
                    <div className="banner-img">
                        <img src="./img-banner.png" alt="banner" />
                    </div>
                </div>
            </div>
        </HomerBannerStyles>
    );
};

export default HomeBanner;