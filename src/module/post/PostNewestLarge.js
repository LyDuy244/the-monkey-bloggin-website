import React, {  } from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import IconEyeOpen from "../../components/icon/IconEyeOpen";
import { useCategoryById } from "../../hooks/useCategoryById";
import { useUserById } from "../../hooks/useUserById";
const PostNewestLargeStyles = styled.div`
  .post {
    &-image {
      display: block;
      margin-bottom: 16px;
      height: 433px;
      border-radius: 16px;
    }
    &-category {
      margin-bottom: 16px;
    }
    @media screen and (max-width: 1023.98px) {
      &-image {
        height: 250px;
      }
    }
  }
`;

const PostNewestLarge = ({ data }) => {
  const {user} = useUserById(data?.userId)
  const {category} = useCategoryById(data?.categoryId)

  if (!data.id) return null;
  const date = data?.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000) : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI")
  return (
    <PostNewestLargeStyles>
      <PostImage
        url={data?.image}
        alt={data?.title}></PostImage>

      <PostCategory to={category.slug}>{category?.name}</PostCategory>
      <PostTitle to={data?.slug} size="big">{data?.title}</PostTitle>
      <div className="flex items-enter mt-3">
        <div className="flex items-center gap-2">
          <IconEyeOpen></IconEyeOpen>
          <span className="text-[#999] text-sm">{data?.total_view} Lượt xem</span>
        </div>
        <PostMeta date={formatDate} author={user?.fullname} to={user?.username} ></PostMeta>
      </div>
    </PostNewestLargeStyles>
  );
};

export default PostNewestLarge;