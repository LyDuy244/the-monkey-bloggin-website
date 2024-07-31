import PostFeatureItem from "../../module/post/PostFeatureItem";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Heading from "../../components/layout/Heading";
import { collection, limit, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { Swiper, SwiperSlide } from "swiper/react";

const HomeFeatureStyles = styled.div`
 .post-list .swiper-slide {
    width: 350px;
    height: auto;
  }
`;

const HomeFeature = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "posts");
    const queries = query(colRef, where("status", '==', 1), where('hot', '==', true), limit(20))
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
  return (
    <HomeFeatureStyles className="home-block">
      <div className="container">
        <Heading>Featured posts</Heading>
        <div className="post-list">
          <Swiper
            spaceBetween={40}
            slidesPerView={"auto"}>
            {
              posts.length > 0 &&
              posts.map(item => (
                <SwiperSlide key={item.id}>
                  <PostFeatureItem data={item}></PostFeatureItem>
                </SwiperSlide>
              ))
            }
          </Swiper>
        </div>
      </div>
    </HomeFeatureStyles>
  );
};

export default HomeFeature;