
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Layout from "../components/layout/Layout";
import PostImage from "../module/post/PostImage";
import PostCategory from "../module/post/PostCategory";
import PostMeta from "../module/post/PostMeta";
import { useParams } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase-app/firebase-config";
import parse from 'html-react-parser';
import AuthorBox from "../components/author/AuthorBox";
import PostRelated from "../module/post/PostRelated";
import IconEyeOpen from "../components/icon/IconEyeOpen";
import { useCategoryById } from "../hooks/useCategoryById";
import { useUserById } from "../hooks/useUserById";
const PostDetailPageStyles = styled.div`
  padding-bottom: 100px;
  .post {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 40px;
      margin: 40px 0;
    }
    &-feature {
      width: 100%;
      max-width: 640px;
      height: 466px;
      border-radius: 20px;
    }
    &-heading {
      font-weight: bold;
      font-size: 36px;
      margin-bottom: 16px;
    }
    &-info {
      flex: 1;
    }
    &-content {
      max-width: 700px;
      margin: 80px auto;
    }
  }
 
  @media screen and (max-width: 1023.98px) {
    padding-bottom: 40px;
    .post {
      &-header {
        flex-direction: column;
      }
      &-feature {
        height: auto;
      }
      &-heading {
        font-size: 26px;
      }
      &-content {
        margin: 40px 0;
      }
    }
    .author {
      flex-direction: column;
      &-image {
        width: 100%;
        height: auto;
      }
    }
  }
`;

const PostDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState({});
  const { user } = useUserById(post?.userId)
  const { category } = useCategoryById(post?.categoryId)


  useEffect(() => {
    if (!slug) return;
    async function fetchData() {
      const colRef = query(collection(db, "posts"), where("slug", "==", slug));
      onSnapshot(colRef, (snapShot) => {
        snapShot.docs.forEach(doc => {
          doc.data() && setPost({
            id: doc.id,
            ...doc.data()
          });
        })
      })
    }
    fetchData();

  }, [slug])
  const date = post?.createdAt?.seconds ? new Date(post.createdAt.seconds * 1000) : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI")

  useEffect(() => {
    document.body.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [slug])

  useEffect(() => {
    if (!post.id) return;
    async function updateTotalView() {
      const docRef = doc(db, "posts", post?.id);
      await updateDoc(docRef, {
        total_view: Number(post.total_view) + 1
      })
    }

    updateTotalView();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id])

  if (!slug) return <PageNotFound></PageNotFound>;
  if (!post?.id) return null;
  return (
    <PostDetailPageStyles>
      <Layout>
        <div className="container">
          <div className="post-header">
            <PostImage
              url={post?.image}
              className="post-feature"
            ></PostImage>
            <div className="post-info">
              <PostCategory to={category.slug} className="mb-6">{category?.name}</PostCategory>
              <h1 className="post-heading">
                {post?.title}
              </h1>
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <IconEyeOpen></IconEyeOpen>
                  <span className="text-[#999]">{post?.total_view} Lượt xem</span>
                </div>
                <PostMeta date={formatDate} to={user.username} author={user?.fullname}></PostMeta>
              </div>
            </div>
          </div>
          <div className="post-content">
            <div className="entry-content">
              {parse(post?.content || "")}
            </div>
            <AuthorBox user={user}></AuthorBox>
          </div>
          <PostRelated postId={post?.id} categoryId={post?.categoryId}></PostRelated>
        </div>
      </Layout>
    </PostDetailPageStyles>
  );
};

export default PostDetailPage;