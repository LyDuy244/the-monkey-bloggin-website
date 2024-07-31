import React from 'react';
import { useController } from 'react-hook-form';
import styled from 'styled-components';

const TextareaStyles = styled.div`
    position: relative;
    width: 100%;
    textarea{
        width: 100%;
        padding: 16px 20px;
        background-color: transparent;
        border: 1px solid ${(props) => props.theme.grayf1};
        border-radius: 8px;
        transition: all 0.2s linear;
        resize: none;
        min-height: 200px;
        color: ${(props) => props.theme.black};
        font-size: 14px;

        &::-webkit-input-placeholder{
            color: #b2b3bd;
            }
        &::-moz-input-placeholder{
            color: #b2b3bd;
        }
    }

`
/**
*
* @param {*} placeholder(optional) - Placeholder of textarea
* @param {*} name(optional) - name of textarea
* @param {*} control - control from react hook form
* @returns textarea
*/
const TextArea = ({ name, type, children, control, ...props }) => {
    const { field } = useController({ control, name, defaultValue: "" });

    return (
        <TextareaStyles>
            <textarea id={name} {...field} {...props} type={type} >

            </textarea>
        </TextareaStyles>
    );
};

export default TextArea;