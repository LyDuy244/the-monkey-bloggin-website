import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase-app/firebase-config';
import { postStatus } from '../utils/constants';
import Heading from '../components/layout/Heading';
import PostItem from '../module/post/PostItem';

const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        async function fetchPosts() {
            const colRef = query(collection(db, 'posts'), where("status", "==", postStatus.APPROVE))
            onSnapshot(colRef, snapShot => {
                const results = []
                snapShot.forEach(doc => {
                    results.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
                setPosts(results);
            })
        }

        fetchPosts()
    }, [])
    useEffect(() => {
        document.title = "Blog Page"
      }, [])
    
    if (posts.length <= 0) return null;
    return (
        <Layout>
             <div className="container">
                <div className="pt-10"></div>
                <Heading>Danh sách các bài viết</Heading>
                <div className="grid-layout grid-layout--primary">
                    {
                        posts.length > 0 &&
                        posts.map(item => (
                            <PostItem key={item.id} data={item}></PostItem>
                        ))
                    }
                </div>
            </div>
        </Layout>
    );
};

export default BlogPage;