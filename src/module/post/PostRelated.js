import React, { useEffect, useState } from 'react';
import Heading from '../../components/layout/Heading';
import PostItem from './PostItem';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase-app/firebase-config';
import { Swiper, SwiperSlide } from 'swiper/react';
import styled from 'styled-components';
const PostRelatedStyles = styled.div`

    .post-list .swiper-slide {
        width: 350px;
        height: auto;
    }
`
const PostRelated = ({ postId = "", categoryId = "" }) => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        if (!categoryId) return;
        async function fetchPosts() {
            const q = query(collection(db, "posts"), where("categoryId", "==", categoryId));
            onSnapshot(q, snapShot => {
                const results = [];
                snapShot.forEach(doc => {
                    if (doc.id !== postId) {
                        results.push({
                            id: doc.id,
                            ...doc.data()
                        })
                    }
                }
                )
                setPosts(results);
            })
        }

        fetchPosts();
    }, [categoryId, postId])


    if (!categoryId) return null;
    return (
        <PostRelatedStyles>
            {
                posts.length > 0 &&
                <div className="post-related">
                    <Heading>Bài viết liên quan</Heading>
                    <div className="post-list">
                        <Swiper
                            spaceBetween={40}
                            slidesPerView={"auto"}
                            grabCursor={true}>
                            {
                                posts.length > 0 &&
                                posts.map(item => (
                                    <SwiperSlide key={item.id}>
                                        <PostItem data={item}></PostItem>
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>
                </div>
            }
        </PostRelatedStyles>
    );
};

export default PostRelated;