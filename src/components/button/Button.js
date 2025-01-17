import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import LoadingSpinner from '../loading/LoadingSpinner';
import { NavLink } from 'react-router-dom';
const ButtonStyles = styled.button`
    cursor: pointer;
    padding: 0 25px;
    line-height: 1;
    color: white;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    height: ${props => props.height || "66px"};
    display: flex;
    justify-content: center;
    align-items: center;
   
    ${props => props.kind === "primary" && css`
        color:  white;
        background-color: ${(props) => props.theme.primary};
    `};
    ${props => props.kind === "secondary" && css`
        background-color: white;
        color: ${props => props.theme.primary};
    `};
    ${(props) =>
        props.kind === "ghost" &&
        css`
      color: ${(props) => props.theme.primary};
      background-color: rgba(29, 192, 113, 0.1);
    `};
    &:disabled{
        opacity: .5;
        pointer-events: none;
        user-select: none;
    }
`

/** 
 * @param {function} onClick handle onClick
 * @requires
 * @param {string} type Type of button "button", "submit"
*/
const Button = ({ children, kind = "primary", disabled, type = "button", onClick = () => { }, ...props }) => {
    const { isLoading, to } = props;
    const child = !!isLoading ? <LoadingSpinner></LoadingSpinner> : children;
    if (to !== "" && typeof to === 'string') {
        return <NavLink to={to} className="inline-block">
            <ButtonStyles kind={kind} type={type} {...props} >
                {child}
            </ButtonStyles>
        </NavLink>
    }
    return (
        <ButtonStyles kind={kind} type={type} onClick={onClick} {...props} disabled={disabled}>
            {child}
        </ButtonStyles>
    );
};


Button.propTypes = {
    type: PropTypes.oneOf(["button", "submit"]),
    isLoading: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.node,
    kind: PropTypes.oneOf(["primary", "secondary", "ghost"]),
};

export default Button;