import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import slugify from "slugify";
import IconEyeOpen from "../../components/icon/IconEyeOpen";
import { useCategoryById } from "../../hooks/useCategoryById";
import { useUserById } from "../../hooks/useUserById";

const PostItemStyles = styled.div`
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  .post {
    &-image {
      height: 202px;
      margin-bottom: 20px;
      display: block;
      width: 100%;
      border-radius: 16px;
    }
    &-category {
      margin-bottom: 10px;
    }

    &-title{
      margin-bottom: 20px;
    }
  }

  @media screen and (max-width: 1023.98px) {
    .post {
      &-image {
        aspect-ratio: 16/9;
        height: auto;
      }
    }
  }
`;

const PostItem = ({ data }) => {
  const { user } = useUserById(data?.userId)
  const { category } = useCategoryById(data?.categoryId);


  const date = data?.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000) : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI")

  if (!data) return null;
  return (
    <PostItemStyles>
      <PostImage
        url={data.image}
        alt={data.title}
        to={data.slug}>
      </PostImage>
      <div className="flex flex-col w-full h-full">
        <div className="flex items-enter justify-between w-full mb-3">
          <PostCategory className="!mb-0" to={category?.slug}>{category?.name}</PostCategory>
          <div className="flex items-center gap-2">
            <IconEyeOpen></IconEyeOpen>
            <span className="text-[#999] text-sm">{data?.total_view} Lượt xem</span>
          </div>
        </div>
        <PostTitle to={data.slug}>
          {data.title}
        </PostTitle>

        <PostMeta
          to={slugify(user?.username || "", { lower: true })}
          author={user?.fullname}
          date={formatDate}
          className="mt-auto">
        </PostMeta>
      </div>
    </PostItemStyles>
  );
};

export default PostItem;