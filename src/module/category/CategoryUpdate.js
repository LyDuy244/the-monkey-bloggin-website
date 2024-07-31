import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardHeading from "../dashboard/DashboardHeading";
import Field from "../../components/field/Field";
import { Label } from "../../components/label";
import Input from "../../components/input/Input";
import FieldCheckboxes from "../../components/field/FieldCheckboxes";
import Radio from "../../components/checkbox/Radio";
import { categoryStatus, userRole } from "../../utils/constants";
import Button from "../../components/button/Button";
import { useForm } from "react-hook-form";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import slugify from "slugify";
import { toast } from "react-toastify";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup"
import { useUserStore } from "../../zustand/newsStore";

const schema = yup.object({
  name: yup.string().required("Please enter your category name"),
});

const CategoryUpdate = () => {
  const { userInfo } = useUserStore(state => state)
  const { id } = useParams();
  const { control, reset, watch, handleSubmit, formState: { isSubmitting, errors } } = useForm({
    mode: onchange,
    resolver: yupResolver(schema)
  })
  const watchStatus = watch("status")
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) return;
    async function fetchCategory() {
      const colRef = doc(db, "categories", id);
      const singleDoc = await getDoc(colRef);

      reset(singleDoc.data())
    }
    fetchCategory()
  }, [id, reset])
  const handleUpdateCategory = async (values) => {
    if (!id) return;
    try {
      const colRef = doc(db, "categories", id);
      await updateDoc(colRef, {
        name: values.name,
        slug: slugify(values.slug || values.name, { lower: true }),
        status: Number(values.status),
      })
      toast.success("Update category successfully");
      navigate("/manage/category")
    } catch (error) {
      console.log(error)
      toast.error("Update category failed")
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
    document.title = "Monkey Blogging - Update Category"
  }, [])
  if (userInfo?.role !== userRole.ADMIN || !id) {
    return null;
  }
  return <div>
    <DashboardHeading title="Update Category" desc={`Update your category id: ${id}`}></DashboardHeading>
    <form onSubmit={handleSubmit(handleUpdateCategory)} autoComplete="off">
      <div className="form-layout">
        <Field>
          <Label>Name</Label>
          <Input
            control={control}
            name="name"
            placeholder="Enter your category name"
          ></Input>
        </Field>
        <Field>
          <Label>Slug</Label>
          <Input
            control={control}
            name="slug"
            placeholder="Enter your slug"
          ></Input>
        </Field>
      </div>
      <div className="form-layout">
        <Field>
          <Label>Status</Label>
          <FieldCheckboxes>
            <Radio name="status" control={control} checked={parseInt(watchStatus) === categoryStatus.APPROVE} value={categoryStatus.APPROVE}>
              Approved
            </Radio>
            <Radio name="status" control={control} checked={parseInt(watchStatus) === categoryStatus.UNAPPROVED} value={categoryStatus.UNAPPROVED}>
              Unapproved
            </Radio>
          </FieldCheckboxes>
        </Field>
      </div>
      <Button disabled={isSubmitting} isLoading={isSubmitting} type={"submit"} kind="primary" className="w-full max-w-[200px] mx-auto">
        Update category
      </Button>
    </form>
  </div>;
};

export default CategoryUpdate;