import React, {  } from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import IconEyeOpen from "../../components/icon/IconEyeOpen";
import { useCategoryById } from "../../hooks/useCategoryById";
import { useUserById } from "../../hooks/useUserById";
const PostNewestItemStyles = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid #ddd;
  &:last-child {
  padding-bottom: 0;
  margin-bottom: 0;
  border-bottom: 0;
  }
  .post {
    &-image {
      display: block;
      flex-shrink: 0;
      width: 180px;
      height: 130px;
      border-radius: 12px;
      margin-bottom: 10px;
    }
    &-category {
      margin-bottom: 10px;
    }
    &-content {
      flex: 1;
    }

    &-title {
      margin-bottom: 20px;
    }
  }

  @media screen and (max-width: 1023.98px) {
  margin-bottom: 14px;
  padding-bottom: 14px;
  .post {
    &-image {
      width: 140px;
      height: 100px;
    }
  }
  }
`;
const PostNewestItem = ({ data }) => {
  const {user} = useUserById(data?.userId)
  const {category} = useCategoryById(data?.categoryId)

  if (!data.id) return null;
  const date = data?.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000) : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI")
  return (
    <PostNewestItemStyles>
      <PostImage
        url={data.image}
        alt={data.title}
        to={data.slug}
      ></PostImage>
      <div className="post-content">
        <PostCategory type="secondary" to={category?.slug}>{category?.name}</PostCategory>
        <PostTitle to={data.slug}>{data.title}</PostTitle>
        <div className="flex items-enter">
          <div className="flex items-center gap-2">
            <IconEyeOpen></IconEyeOpen>
            <span className="text-[#999] text-sm">{data?.total_view} Lượt xem</span>
          </div>
          <PostMeta date={formatDate} author={user?.fullname} to={user?.username} ></PostMeta>
        </div>
      </div>
    </PostNewestItemStyles>
  );
};

export default PostNewestItem;