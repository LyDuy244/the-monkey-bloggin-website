import React, { useState } from 'react';
import Input from './Input';
import IconEyeClose from '../icon/IconEyeClose';
import IconEyeOpen from '../icon/IconEyeOpen';

const InputPasswordToggle = ({control}) => {
    const [togglePassword, setTogglePassword] = useState(false)

    return (
        <>
            <Input control={control} type={togglePassword ? "text" : "password"} name='password' placeholder='Enter your password' >
                {togglePassword ? <IconEyeOpen onClick={() => setTogglePassword(false)} ></IconEyeOpen> : <IconEyeClose onClick={() => setTogglePassword(true)}></IconEyeClose>}
            </Input>
        </>
    );
};

export default InputPasswordToggle;