import React, { useEffect, useMemo, useState } from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import styled from "styled-components";
import Field from "../../components/field/Field";
import { Label } from "../../components/label";
import Input from "../../components/input/Input";
import Toggle from "../../components/toggle/Toggle";
import FieldCheckboxes from "../../components/field/FieldCheckboxes";
import Radio from "../../components/checkbox/Radio";
import ImageUpload from "../../components/image/ImageUpload";
import Dropdown from "../../components/dropdown/Dropdown";
import Select from "../../components/dropdown/Select";
import List from "../../components/dropdown/List";
import Option from "../../components/dropdown/Option";
import Button from "../../components/button/Button";
import { useForm } from "react-hook-form";
import { useFirebaseImage } from "../../hooks/useFirebaseImage";
import { postStatus } from "../../utils/constants";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { toast } from "react-toastify";
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageUploader from 'quill-image-uploader';
import axios from "axios";
import { imgbbAPI } from "../../config/apiConfig";
import slugify from "slugify";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup"
import { useUserStore } from "../../zustand/newsStore";
Quill.register('modules/imageUploader', ImageUploader);
const schema = yup.object({
  title: yup.string().required("Please enter your title post"),
});

const PostAddNewStyles = styled.div`
`
const PostUpdate = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [post, setPost] = useState({});
  const { userInfo } = useUserStore(state => state);

  const [content, setContent] = useState("")
  const { reset, handleSubmit, setValue, getValues, control, watch, formState: { isSubmitting, isValid, errors } } = useForm({
    mode: onchange,
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      status: postStatus.PENDING,
      total_view: 0,
      hot: false,
      image: ""
    }
  });

  const imageUrl = getValues("image")

  const deleteImage = async () => {
    const colRef = doc(db, "users", id);
    await updateDoc(colRef, {
      image: "",
      image_name: "",
    })
  }
  const {
    progress,
    handleDeleteImage,
    handleSelectImage,
    image, setImage
  } = useFirebaseImage(setValue, getValues, userInfo?.username, deleteImage)
  const watchHot = watch("hot");
  const watchStatus = watch("status");

  const handleClickOption = (item) => {
    setValue("categoryId", item.id);
    setSelectCategory(item.name)
  }

  useEffect(() => {
    if (!post.categoryId) return;
    async function fetchSelectCategory() {
      const docRef = doc(db, "categories", post?.categoryId);
      const docData = await getDoc(docRef);
      setSelectCategory(docData.data().name);
    }
    fetchSelectCategory()
  }, [post.categoryId])

  useEffect(() => {
    async function fetchCategoriesData() {
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
    fetchCategoriesData();
  }, [])


  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage])

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      const colRef = doc(db, 'posts', id)
      const docData = await getDoc(colRef);
      if (docData.data()) {
        reset(docData.data());
        setContent(docData.data()?.content)
        setPost({
          id: docData.id,
          ...docData.data()
        })
      }
    }

    fetchPost();
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

  const updatePostHandler = async (values) => {
    if (!isValid) return;
    try {
      const docRef = doc(db, "posts", id);
      await updateDoc(docRef, {
        ...values,
        status: Number(values.status),
        slug: slugify(values.slug || values.title, { lower: true }),
        content
      })
      toast.success("Update doc successfully");
    } catch (error) {
      console.log(error);
      toast.error("Update post failed")
    }

  }

  const module = useMemo(() => (
    {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['link', 'image']
      ],
      imageUploader: {
        upload: async (file) => {
          const bodyFormData = new FormData();
          bodyFormData.append("image", file);
          const response = await axios({
            method: "post",
            url: imgbbAPI,
            data: bodyFormData,
            headers: {
              "Content-Type": "multipart/form-data",
            }
          });

          return response.data.data.url
        },
      },
    }
  ), []);
  if (!id) return null
  return <PostAddNewStyles>
    <DashboardHeading title="Update post" desc="Update post content"></DashboardHeading>
    <form onSubmit={handleSubmit(updatePostHandler)}>
      <div className="form-layout">
        <Field>
          <Label>Title</Label>
          <Input
            control={control}
            placeholder="Enter your title"
            name="title"
            required
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
          <Label>Image</Label>
          <ImageUpload name="image" progress={progress} handleDeleteImage={handleDeleteImage} image={image} onChange={handleSelectImage} className="h-[250px]"></ImageUpload>
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
      <div className="mb-10">
        <Field >
          <Label>Content</Label>
          <div className="w-full entry-content">
            <ReactQuill modules={module} theme="snow" value={content} onChange={setContent} />
          </div>
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
      <Button disabled={isSubmitting} isLoading={isSubmitting} className="w-full max-w-[300px] mx-auto" type="submit">
        Update post
      </Button>
    </form>
  </PostAddNewStyles>
};

export default PostUpdate;