import React, { useEffect } from 'react';
import { Label } from '../components/label';
import Input from '../components/input/Input';
import { useForm } from 'react-hook-form';
import Field from '../components/field/Field';
import Button from '../components/button/Button';
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase-app/firebase-config';
import { Link, useNavigate } from 'react-router-dom';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import AuthenticationPage from './AuthenticationPage';
import InputPasswordToggle from '../components/input/InputPasswordToggle';
import slugify from 'slugify';
import { userRole, userStatus } from '../utils/constants';
import { useUserStore } from '../zustand/newsStore';

const schema = yup.object({
    fullname: yup.string().required("Please enter your fullname"),
    email: yup.string().email("Please enter valid email address").required("Please enter your email address"),
    password: yup.string().min(8, "Your password must be at lease 8 characters or greater").required("Please enter your password")
});
const SignupPage = () => {
    const { userInfo } = useUserStore(state => state);
    const { control, handleSubmit, formState: {
        errors,
        isValid,
        isSubmitting
    } } = useForm({
        mode: onchange,
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate()

    const handleSignUp = async (values) => {
        if (!isValid) return
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        updateProfile(auth.currentUser, {
            displayName: values.fullname,
            photoURL: "https://images.unsplash.com/photo-1721297013556-7277aefea757?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        })
        await setDoc(doc(db, "users", auth.currentUser.uid), {
            fullname: values.fullname,
            email: values.email,
            password: values.password,
            username: slugify(values.fullname, { lower: true }),
            avatar: "https://images.unsplash.com/photo-1721297013556-7277aefea757?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            image_name: "",
            status: userStatus.ACTIVE,
            role: userRole.USER,
            createdAt: serverTimestamp()
        })

        toast.success("Register successfully");
        navigate("/")
    }

    useEffect(() => {
        document.title = "Register Page"
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

    return (
        <AuthenticationPage>
            <form onSubmit={handleSubmit(handleSignUp)} autoComplete='off' className='form'>
                <Field>
                    <Label htmlFor="fullname">Fullname</Label>
                    <Input control={control} type="text" name='fullname' placeholder='Enter your fullname' >
                    </Input>
                </Field>
                <Field>
                    <Label htmlFor="email">Email</Label>
                    <Input control={control} type="email" name='email' placeholder='Enter your email' >
                    </Input>
                </Field>
                <Field>
                    <Label htmlFor="password">Password</Label>
                    <InputPasswordToggle control={control}></InputPasswordToggle>
                </Field>
                <div className='have-account'>
                    You already have an account? <Link className="text-blue-500 underline" to={"/signin"}>Login</Link>
                </div>
                <Button disabled={isSubmitting} isLoading={isSubmitting} type='submit' className="w-full max-w-[300px] mx-auto">Sign Up</Button>
            </form>
        </AuthenticationPage>
    );
};

export default SignupPage;  