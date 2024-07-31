import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthenticationPage from './AuthenticationPage';
import Field from '../components/field/Field';
import Input from '../components/input/Input';
import { Label } from '../components/label';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup"
import Button from '../components/button/Button';
import { toast } from 'react-toastify';
import InputPasswordToggle from '../components/input/InputPasswordToggle';
import { useUserStore } from '../zustand/newsStore';

const schema = yup.object({
    email: yup.string().email("Please enter valid email address").required("Please enter your email address"),
    password: yup.string().min(8, "Your password must be at lease 8 characters or greater").required("Please enter your password")
});
const SignInPage = () => {
    const { userInfo, login } = useUserStore(state => state);
    
    const { control, handleSubmit, formState: { isSubmitting, errors } } = useForm({
        mode: onchange,
        resolver: yupResolver(schema),
        defaultValues: {
            email: "",
            password: ""
        }
    })
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "Login Page";
        if (userInfo?.email) navigate("/")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo])

    useEffect(() => {
        const arrErrors = Object.values(errors);

        if (arrErrors.length > 0) {
            toast.error(arrErrors[0]?.message, {
                pauseOnHover: false,
                delay: 0
            })
        }
    }, [errors])

    const handleSignIn = async (values) => {
        try {
            login({email: values.email, password: values.password})
            toast.success("Login successfully")
            navigate("/");
        } catch (error) {
            toast.error("It seems your password or email was wrong");
        }
    }

    return (
        <AuthenticationPage>
            <form onSubmit={handleSubmit(handleSignIn)} autoComplete='off' className='form'>
                <Field>
                    <Label htmlFor="email">Email</Label>
                    <Input control={control} type="text" name='email' placeholder='Enter your email' >
                    </Input>
                </Field>
                <Field>
                    <Label htmlFor="password">Password</Label>
                    <InputPasswordToggle control={control}></InputPasswordToggle>
                </Field>
                <div className='have-account'>
                    You have not had an account? <Link className="text-blue-500 underline" to={"/signup"}>Register an account</Link>
                </div>
                <Button disabled={isSubmitting} isLoading={isSubmitting} type='submit' className="w-full max-w-[300px] mx-auto">Login</Button>
            </form>
        </AuthenticationPage>
    );
};

export default SignInPage;