import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import slugify from "slugify";
import { useCategoryById } from "../../hooks/useCategoryById";
import { useUserById } from "../../hooks/useUserById";
const PostFeatureItemStyles = styled.div`
  width: 100%;
  border-radius: 16px;
  position: relative;
  height: 250px;
  .post {
    &-image {
      width: 100%;
      height: 100%;
      border-radius: 16px;
    }
    &-overlay {
      position: absolute;
      inset: 0;
      border-radius: 16px;
      background-color: rgba(0, 0, 0, 0.75);
      mix-blend-mode: multiply;
      opacity: 0.6;
    }
    &-content {
      position: absolute;
      inset: 0;
      z-index: 10;
      padding: 20px;
      color: white;
    }
    &-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    &-category {
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100px;
    }
    @media screen and (min-width: 1024px) {
      height: 272px;
    }
    @media screen and (max-width: 1023.98px) {
      .post {
        &-content {
          padding: 15px;
        }
      }
    }
  }
 
`;
const PostFeatureItem = ({ data }) => {
  const {user} = useUserById(data?.userId)
  const {category} = useCategoryById(data?.categoryId)
  
  if (!data || !data.id) return null;
  const date = data?.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000) : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI")
  return (
    <PostFeatureItemStyles>
      <PostImage url={data.image} alt={data.title}></PostImage>
      <div className="post-overlay"></div>
      <div className="post-content">
        <div className="post-top">
          {
            category &&
            <PostCategory to={`${category.slug}`}>{category.name}</PostCategory>
          }
          {
            user &&
            <PostMeta
              to={slugify(user?.username || "", { lower: true })}
              author={user?.fullname}
              date={formatDate}></PostMeta>
            
          }
        </div>
        <PostTitle to={data.slug} size="big">
          {data.title}
        </PostTitle>
      </div>
    </PostFeatureItemStyles>
  );
};

export default PostFeatureItem;