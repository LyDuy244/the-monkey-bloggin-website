
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import DashboardHeading from "../dashboard/DashboardHeading";
import Field from "../../components/field/Field";
import { Label } from "../../components/label";
import Input from "../../components/input/Input";
import Radio from "../../components/checkbox/Radio";
import Button from "../../components/button/Button";
import FieldCheckboxes from "../../components/field/FieldCheckboxes";
import slugify from "slugify";
import { categoryStatus } from "../../utils/constants";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { toast } from "react-toastify";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup"
const schema = yup.object({
  name: yup.string().required("Please enter your category name"),
});
const CategoryAddNew = () => {
  const {
    control,
    watch,
    reset,
    formState: { isSubmitting, isValid, errors },
    handleSubmit
  } = useForm({
    mode: onchange,
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      status: categoryStatus.APPROVE,
      createdAt: new Date(),
    }
  });
  const handleAddNewCategory = async (values) => {
    if (!isValid) return;
    try {
      const newValues = { ...values };
      newValues.slug = slugify(newValues.slug || newValues.name, { lower: true })
      newValues.status = Number(newValues.status);
      const colRef = collection(db, "categories");
      try {
        await addDoc(colRef, {
          ...newValues,
          createdAt: serverTimestamp()
        });
        toast.success("Create new Category successfully")
      } catch (error) {
        toast.error(error.message)
      } finally {
        reset({
          name: "",
          slug: "",
          status: categoryStatus.APPROVE,
          createdAt: new Date(),
        })
      }
    } catch (error) {
      console.log(error);
      toast.error("Create category failed")
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
  const watchStatus = watch("status")
  return (
    <div>
      <DashboardHeading
        title="New category"
        desc="Add new category"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleAddNewCategory)} autoComplete="off">
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
          Add new category
        </Button>
      </form>
    </div>
  );
};

export default CategoryAddNew;