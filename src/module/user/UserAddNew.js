
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import DashboardHeading from "../dashboard/DashboardHeading";
import Field from "../../components/field/Field";
import { Label } from "../../components/label";
import Input from "../../components/input/Input";
import FieldCheckboxes from "../../components/field/FieldCheckboxes";
import Radio from "../../components/checkbox/Radio";
import Button from "../../components/button/Button";
import ImageUpload from "../../components/image/ImageUpload";
import { useFirebaseImage } from "../../hooks/useFirebaseImage";
import { userRole, userStatus } from "../../utils/constants";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase-app/firebase-config";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import slugify from "slugify";
import { toast } from "react-toastify";
import InputPasswordToggle from "../../components/input/InputPasswordToggle";
import { useUserStore } from "../../zustand/newsStore";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup"

const schema = yup.object({
  fullname: yup.string().required("Please enter your fullname"),
  email: yup.string().email("Please enter valid email address").required("Please enter your email"),
  password: yup.string().min(8, "Your password must be at lease 8 characters or greater").required("Please enter your password"),
});
const UserAddNew = () => {
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
      status: userStatus.ACTIVE,
      role: userRole.USER,
      createdAt: new Date()
    }
  });
  const {
    handleSelectImage,
    handleDeleteImage,
    progress,
    image,
    handleResetUpload
  } = useFirebaseImage(setValue, getValues, userInfo?.username)
  const watchStatus = watch("status");
  const watchRole = watch("role");


  const handleCreateUser = async (values) => {
    if (!isValid) return;
    let originalUser = auth.currentUser
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password)
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        username: slugify(values.username || values.fullname, { lower: true, trim: true }),
        avatar: image,
        status: Number(values.status),
        role: Number(values.role),
        createdAt: serverTimestamp()
      })

      toast.success(`Create new user with email: ${values.email} successfully`)
      handleResetUpload()
      reset({
        fullname: "",
        email: "",
        password: "",
        username: "",
        avatar: "",
        image_name: "",
        status: userStatus.ACTIVE,
        role: userRole.USER,
        createdAt: new Date()
      });
    } catch (error) {
      console.log(error)
      toast.error("Can not create new user")
    }
    auth.updateCurrentUser(originalUser)

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
  if (userInfo?.role !== userRole.ADMIN) {
    return null;
  }
  return (
    <div>
      <DashboardHeading
        title="New user"
        desc="Add new user to system"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleCreateUser)}>
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
        <Button disabled={isSubmitting} isLoading={isSubmitting} type={'submit'} kind="primary" className="mx-auto w-[200px]">
          Add new user
        </Button>
      </form>
    </div>
  );
};

export default UserAddNew;