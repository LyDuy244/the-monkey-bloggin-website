import Heading from "../../components/layout/Heading";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PostNewestLarge from "../post/PostNewestLarge";
import PostNewestItem from "../post/PostNewestItem";
import PostItem from "../post/PostItem";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { Swiper, SwiperSlide } from "swiper/react";


const HomeNewestStyles = styled.div`
  .layout {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 40px;
    margin-bottom: 40px;
    align-items: start;
  }
  .sidebar {
    padding: 28px 20px;
    background-color: #f3edff;
    border-radius: 16px;
  }
  .post-list .swiper-slide {
    width: 350px;
    height: auto;
  }
 
  @media screen and (max-width: 1023.98px) {
    .layout {
      grid-template-columns: 100%;
    }
    .sidebar {
      padding: 14px 10px;
    }
  }
`;

const HomeNewest = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "posts");
    const queries = query(colRef, where("status", '==', 1), where('hot', '==', false))
    onSnapshot(queries, (snapShot) => {
      const list = [];
      snapShot.docs.forEach(doc => (
        list.push({
          id: doc.id,
          ...doc.data()
        })
      ))
      setPosts(list)
    })
  }, [])

  if (posts.length <= 0) return null;
  const [first, ...other] = posts;
  return (
    <HomeNewestStyles className="home-block">
      <div className="container">
        <Heading>Latest posts</Heading>
        <div className="layout">
          <PostNewestLarge data={first}></PostNewestLarge>
          <div className="sidebar">
            {
              other.length > 0 &&
              other.slice(1, 4).map(item => (<PostNewestItem key={item.id} data={item}></PostNewestItem>))
            }
          </div>
        </div>
        <div className="post-list">
          <Swiper
            spaceBetween={40}
            slidesPerView={"auto"}>
            {
              other.length > 0 &&
              other.slice(5).map(item => (
                <SwiperSlide key={item.id}>
                  <PostItem data={item}></PostItem>
                </SwiperSlide>
              ))
            }
          </Swiper>
        </div>
      </div>
    </HomeNewestStyles>
  );
};

export default HomeNewest;