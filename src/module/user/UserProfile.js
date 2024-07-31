import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import DashboardHeading from "../dashboard/DashboardHeading";
import ImageUpload from "../../components/image/ImageUpload";
import Field from "../../components/field/Field";
import { Label } from "../../components/label";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { userRole, userStatus } from "../../utils/constants";
import TextArea from "../../components/textarea/TextArea";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { useUserStore } from "../../zustand/newsStore";
import { useFirebaseImage } from "../../hooks/useFirebaseImage";
import { toast } from "react-toastify";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup"

const schema = yup.object({
  fullname: yup.string().required("Please enter your fullname"),
  email: yup.string().email("Please enter valid email address").required("Please enter your email"),
  password: yup.string().min(8, "Your password must be at lease 8 characters or greater").required("Please enter your password"),
});
const UserProfile = () => {
  const { userInfo } = useUserStore(state => state);
  const { control, reset, handleSubmit, setValue, getValues, formState: { isSubmitting, isValid, errors } } = useForm({
    mode: onchange,
    resolver: yupResolver(schema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      username: "",
      avatar: "",
      status: userStatus.ACTIVE,
      role: userRole.USER,
      birthday: "",
      phone: "",
      description: "",
      createdAt: new Date()
    }
  });
  const imageUrl = getValues("avatar");
  const imageRegex = (/%2F(\S+)\?/gm).exec(imageUrl)
  const imageName = imageRegex?.length > 0 ? imageRegex[1] : "";
  const deleteAvatar = async () => {
    const colRef = doc(db, "users", userInfo?.uid);
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

  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage])

  useEffect(() => {
    if (!userInfo?.uid) return;
    async function fetchUser() {
      const colRef = doc(db, "users", userInfo?.uid);
      const docData = await getDoc(colRef);
      reset(docData && {
        ...docData.data(),
      });
    }
    fetchUser();
  }, [userInfo?.uid, reset])

  const handleUpdateProfile = async (values) => {
    if (!isValid) return;
    console.log(getValues("image_name"))
    try {
      const colRef = doc(db, "users", userInfo?.uid);
      await updateDoc(colRef, {
        fullname: values.fullname,
        username: values.username,
        birthday: values.birthday,
        phone: values.phone,
        email: values.email,
        password: values.password,
        status: Number(values.status),
        role: Number(values.role),
        description: values.description,
        createdAt: serverTimestamp(),
        avatar: image,
        image_name: values.image_name
      })
      toast.success("Update profile successfully")
    } catch (error) {
      console.log(error);
      toast.error("Update user profile failed")
    }
  }
  useEffect(() => {
    const arrErrors = Object.values(errors);
    if (arrErrors.length > 0) {
      toast.error(arrErrors[0]?.message, {
        pauseOnHover: false,
        delay: 0
      })
    }
  }, [errors])
  useEffect(() => {
    document.title = "User Profile"
  }, [])

  if (!userInfo) return null;
  return (
    <div>
      <DashboardHeading
        title="Account information"
        desc="Update your account information"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="w-[200px] h-[200px] rounded-full mx-auto mb-10">
          <ImageUpload name="avatar" image={image} process={progress} onChange={handleSelectImage} handleDeleteImage={handleDeleteImage} className="!rounded-full h-full"></ImageUpload>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              control={control}
              name="fullname"
              placeholder="Enter your fullname"
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              control={control}
              name="username"
              placeholder="Enter your username"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Date of Birth</Label>
            <Input
              control={control}
              name="birthday"
              type="date"
              placeholder="dd/mm/yyyy"
            ></Input>
          </Field>
          <Field>
            <Label>Mobile Number</Label>
            <Input
              control={control}
              name="phone"
              placeholder="Enter your phone number"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              control={control}
              name="email"
              type="email"
              placeholder="Enter your email address"
            ></Input>
          </Field>
          <Field>
            <Label>Description</Label>
            <TextArea name="description" control={control}></TextArea>
          </Field>
        </div>

        <div className="form-layout">
          <Field>
            <Label>New Password</Label>
            <Input
              control={control}
              name="password"
              type="password"
              placeholder="Enter your password"
            ></Input>
          </Field>
          <Field>
            <Label>Confirm Password</Label>
            <Input
              control={control}
              name="confirmPassword"
              type="password"
              placeholder="Enter your confirm password"
            ></Input>
          </Field>
        </div>
        <Button disabled={isSubmitting} isLoading={isSubmitting} type={'submit'} kind="primary" className="mx-auto w-[200px]">
          Update
        </Button>
      </form>
    </div>
  );
};

export default UserProfile;