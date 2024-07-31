import React from 'react';
import styled from 'styled-components';
const AuthorBoxStyles = styled.div`
    margin-top: 40px;
    margin-bottom: 80px;
    display: flex;
    border-radius: 20px;
    background-color: ${(props) => props.theme.grayF3};
    .author {
        &-image {
        width: 200px;
        height: 200px;
        flex-shrink: 0;
        border-radius: inherit;
        }
        &-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: inherit;
        }
        &-content {
        flex: 1;
        padding: 20px;
        }
        &-name {
        font-weight: bold;
        margin-bottom: 10px;
        font-size: 20px;
        }
        &-desc {
        font-size: 14px;
        line-height: 2;
        }
    }
    @media screen and (max-width: 1023.98px) {
        padding-bottom: 40px;
        flex-direction: column;
        &-image {
            width: 100%;
            height: auto;
        }
  }
`
const AuthorBox = ({ user = {} }) => {

    if (!user) return null;
    return (
        <AuthorBoxStyles>
            <div className="author-image">
                <img src={user?.avatar} alt={user?.fullname} />
            </div>
            <div className="author-content">
                <h3 className="author-name">{user?.fullname}</h3>
                <p className="author-desc">
                    {user?.description }
                </p>
            </div>
        </AuthorBoxStyles>
    );
};

export default AuthorBox;