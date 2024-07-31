import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import Field from "../../components/field/Field";
import { Label } from "../../components/label";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import Radio from "../../components/checkbox/Radio";
import slugify from "slugify";
import { postStatus } from "../../utils/constants";
import ImageUpload from "../../components/image/ImageUpload";
import { useFirebaseImage } from "../../hooks/useFirebaseImage";
import Toggle from "../../components/toggle/Toggle";
import Dropdown from "../../components/dropdown/Dropdown";
import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import Select from "../../components/dropdown/Select";
import List from "../../components/dropdown/List";
import Option from "../../components/dropdown/Option";
import { useUserStore } from "../../zustand/newsStore";
import { toast } from "react-toastify";
import DashboardHeading from "../dashboard/DashboardHeading";
import FieldCheckboxes from "../../components/field/FieldCheckboxes";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup"
import { random } from "lodash";
const PostAddNewStyles = styled.div``;

const schema = yup.object({
  title: yup.string().required("Please enter your title post"),
});

const PostAddNew = () => {
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const { userInfo } = useUserStore(state => state);
  ;
  const { control, watch, setValue, handleSubmit, getValues, reset, formState: {
    isSubmitting, errors, isValid
  } } = useForm({
    mode: onchange,
    defaultValues: {
      title: "",
      slug: "",
      status: postStatus.PENDING,
      total_view: 0,
      hot: false,
      image: "",
      image_name: "",
      content: ""
    },
    resolver: yupResolver(schema)
  });
  const {
    handleSelectImage,
    handleDeleteImage,
    progress,
    image,
    handleResetUpload
  } = useFirebaseImage(setValue, getValues, userInfo?.username)

  const watchStatus = watch("status");
  const watchHot = watch("hot");

  const addPostHandler = async (values) => {
    // console.log(values)
    try {
      const cloneValues = { ...values };
      cloneValues.slug = slugify(values.slug || values.title, { lower: true })
      cloneValues.status = Number(cloneValues.status);
      const colRef = collection(db, "posts")
      await addDoc(colRef, {
        ...cloneValues,
        image,
        userId: userInfo?.uid,
        total_view: random(100, 999),
        createdAt: serverTimestamp(),
      })

      toast.success("Create new post successfully")
      reset(
        {
          title: "",
          slug: "",
          status: postStatus.PENDING,
          category: {},
          total_view: 0,
          hot: false,
          image: ""
        }
      )
      handleResetUpload()
      setSelectCategory('');
    } catch (error) {
      console.log(error)
      toast.error("Add new post failed")
    }
  }

  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));
      onSnapshot(q, (snapShot) => {
        const result = [];
        snapShot.docs.forEach(doc =>
          result.push({
            id: doc.id,
            ...doc.data()
          })
        )
        setCategories(result);
      })
    }
    fetchData();
  }, [])

  const handleClickOption = (item) => {
    setValue("categoryId", item.id)
    setSelectCategory(item.name)
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
    document.title = "Monkey Blogging - Add new post"
  }, [])

  return (
    <PostAddNewStyles>
      <DashboardHeading title="Add post" desc="Add new post"></DashboardHeading>
      <form onSubmit={handleSubmit(addPostHandler)}>
        <div className="form-layout">
          <Field>
            <Label>Title</Label>
            <Input
              control={control}
              placeholder="Enter your title"
              name="title"
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              placeholder="Enter your slug"
              name="slug"
            ></Input>
          </Field>
        </div>

        <div className="form-layout">
          <Field>
            <Label>Feature post</Label>
            <Toggle on={watchHot} onClick={() => setValue("hot", !watchHot)} ></Toggle>
          </Field>
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={parseInt(watchStatus) === postStatus.APPROVE}
                value={postStatus.APPROVE}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={parseInt(watchStatus) === postStatus.PENDING}
                value={postStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={parseInt(watchStatus) === postStatus.REJECTED}
                value={postStatus.REJECTED}
              >
                Reject
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Image</Label>
            <ImageUpload progress={progress} handleDeleteImage={handleDeleteImage} image={image} onChange={handleSelectImage} className="h-[250px]"></ImageUpload>
          </Field>
          <Field>
            <Label>Category</Label>
            <Dropdown>
              <Select placeholder={`${selectCategory || "Select the category"}`}></Select>
              <List>
                {
                  categories.length > 0 &&
                  categories.map(item => (
                    <Option onClick={() => handleClickOption(item)} key={item.id}>{item.name}</Option>
                  ))
                }
              </List>
            </Dropdown>
          </Field>
        </div>
        <div className="form-layout">

        </div>
        <Button disabled={isSubmitting} isLoading={isSubmitting} className="w-full max-w-[300px] mx-auto" type="submit">
          Add new post
        </Button>
      </form>
    </PostAddNewStyles>
  );
};

export default PostAddNew;