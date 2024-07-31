import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useParams } from 'react-router-dom';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase-app/firebase-config';
import Heading from '../components/layout/Heading';
import PostItem from '../module/post/PostItem';

const CategoryPage = () => {
    const { slug } = useParams();
    const [category, setCategory] = useState({});
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        if (!slug) return;
        async function fetchUserData() {
            const colRef = query(collection(db, "categories"), where("slug", "==", slug));
            onSnapshot(colRef, snapShot => {
                snapShot.forEach(doc => {
                    doc.data() && setCategory({
                        id: doc.id,
                        ...doc.data()
                    });
                })
            })
        }
        fetchUserData();
    }, [slug])
    useEffect(() => {
        if (!category?.id) return;
        async function fetchPosts() {
            const colRef = query(collection(db, 'posts'), where("categoryId", "==", category?.id))
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
    }, [category?.id])
    if (posts.length <= 0) return null;

    return (
        <Layout>
            <div className="container">
                <div className="pt-10"></div>
                <Heading>Danh mục các bài viết: {category?.name}</Heading>
                <div className="grid-layout grid-layout--primary">
                    {
                        posts.map(item => (
                            <PostItem key={item.id} data={item}></PostItem>
                        ))
                    }
                </div>
            </div>
        </Layout>
    );
};

export default CategoryPage;