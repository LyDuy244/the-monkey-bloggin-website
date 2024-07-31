import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardHeading from '../dashboard/DashboardHeading';
import ImageUpload from '../../components/image/ImageUpload';
import Field from '../../components/field/Field';
import { Label } from '../../components/label';
import Input from '../../components/input/Input';
import InputPasswordToggle from '../../components/input/InputPasswordToggle';
import FieldCheckboxes from '../../components/field/FieldCheckboxes';
import Radio from '../../components/checkbox/Radio';
import Button from '../../components/button/Button';
import { userRole, userStatus } from '../../utils/constants';
import { useFirebaseImage } from '../../hooks/useFirebaseImage';
import { useForm } from 'react-hook-form';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-app/firebase-config';
import { toast } from 'react-toastify';
import slugify from 'slugify';
import TextArea from '../../components/textarea/TextArea';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup"
import { useUserStore } from '../../zustand/newsStore';

const schema = yup.object({
    fullname: yup.string().required("Please enter your fullname"),
    email: yup.string().email("Please enter valid email address").required("Please enter your email"),
    password: yup.string().min(8, "Your password must be at lease 8 characters or greater").required("Please enter your password"),
});
const UserUpdate = () => {
    const { id } = useParams();
    const { userInfo } = useUserStore(state => state);
    const { control, reset, watch, handleSubmit, setValue, getValues, formState: { isSubmitting, isValid, errors } } = useForm({
        mode: onchange,
        resolver: yupResolver(schema),
        defaultValues: {
            fullname: "",
            email: "",
            password: "",
            username: "",
            avatar: "",
            description: "",
            status: userStatus.ACTIVE,
            role: userRole.USER,
            createdAt: new Date()
        }
    });
    const watchStatus = watch("status");
    const watchRole = watch("role");
    const imageUrl = getValues("avatar");
    const imageRegex = (/%2F(\S+)\?/gm).exec(imageUrl)
    const imageName = imageRegex?.length > 0 ? imageRegex[1] : "";
    const deleteAvatar = async () => {
        const colRef = doc(db, "posts", id);
        await updateDoc(colRef, {
            avatar: "",
            image_name: "",
        })
    }
    const {
        handleSelectImage,
        handleDeleteImage,
        progress,
        image,
        setImage,
    } = useFirebaseImage(setValue, getValues, userInfo?.username, imageName, deleteAvatar)

    const handleUpdateUser = async (values) => {
        if (!isValid) return;
        try {
            const colRef = doc(db, 'users', id);
            await updateDoc(colRef, {
                ...values,
                username: slugify(values.username || values.fullname, { lower: true, trim: true }),
                status: Number(values.status),
                role: Number(values.role),
                avatar: image
            })
            toast.success("Update user information successfully")
        } catch (error) {
            console.log(error);
            toast.error("Update user failed")
        }
    }
    useEffect(() => {
        setImage(imageUrl);
    }, [imageUrl, setImage])
    useEffect(() => {
        if (!id) return;

        async function fetchUser() {
            const colRef = doc(db, "users", id);
            const docData = await getDoc(colRef);
            reset(docData && {
                ...docData.data(),
                // image: docData.data().avatar
            });
        }
        fetchUser();
    }, [id, reset])
    useEffect(() => {
        const arrErrors = Object.values(errors);
        if (arrErrors.length > 0) {
            toast.error(arrErrors[0]?.message, {
                pauseOnHover: false,
                delay: 0
            })
        }
    }, [errors])
    if (userInfo?.role !== userRole.ADMIN) {
        return null;
    }
    if (!id) return null;
    return (
        <div>
            <DashboardHeading
                title="New user"
                desc="Add new user to system"
            ></DashboardHeading>
            <form onSubmit={handleSubmit(handleUpdateUser)}>
                <div className="w-[200px] h-[200px] rounded-full mx-auto mb-10">
                    <ImageUpload name="avatar" image={image} process={progress} onChange={handleSelectImage} handleDeleteImage={handleDeleteImage} className="!rounded-full h-full"></ImageUpload>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Fullname</Label>
                        <Input
                            name="fullname"
                            placeholder="Enter your fullname"
                            control={control}
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Username</Label>
                        <Input
                            name="username"
                            placeholder="Enter your username"
                            control={control}
                        ></Input>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Email</Label>
                        <Input
                            name="email"
                            placeholder="Enter your email"
                            control={control}
                            type="email"
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Password</Label>
                        <InputPasswordToggle control={control}></InputPasswordToggle>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Status</Label>
                        <FieldCheckboxes>
                            <Radio name="status" control={control} value={userStatus.ACTIVE} checked={Number(watchStatus) === userStatus.ACTIVE}>
                                Active
                            </Radio>
                            <Radio name="status" control={control} value={userStatus.PENDING} checked={Number(watchStatus) === userStatus.PENDING}>
                                Pending
                            </Radio>
                            <Radio name="status" control={control} value={userStatus.BAN} checked={Number(watchStatus) === userStatus.BAN}>
                                Banned
                            </Radio>
                        </FieldCheckboxes>
                    </Field>
                    <Field>
                        <Label>Role</Label>
                        <FieldCheckboxes>
                            <Radio name="role" control={control} value={userRole.ADMIN} checked={Number(watchRole) === userRole.ADMIN}>
                                Admin
                            </Radio>
                            <Radio name="role" control={control} value={userRole.MOD} checked={Number(watchRole) === userRole.MOD}>
                                Moderator
                            </Radio>
                            <Radio name="role" control={control} value={userRole.USER} checked={Number(watchRole) === userRole.USER}>
                                User
                            </Radio>
                        </FieldCheckboxes>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Description</Label>
                        <TextArea name="description" control={control}></TextArea>
                    </Field>
                </div>
                <Button disabled={isSubmitting} isLoading={isSubmitting} type={'submit'} kind="primary" className="mx-auto w-[200px]">
                    Update
                </Button>
            </form>
        </div>
    );
};

export default UserUpdate;