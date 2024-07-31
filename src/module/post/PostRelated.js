import React, { useEffect, useState } from 'react';
import Heading from '../../components/layout/Heading';
import PostItem from './PostItem';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase-app/firebase-config';

const PostRelated = ({ postId = "", categoryId = "" }) => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        if (!categoryId) return;
        async function fetchPosts() {
            const q = query(collection(db, "posts"), where("categoryId", "==", categoryId));
            onSnapshot(q, snapShot => {
                const results = [];
                snapShot.forEach(doc =>
                {
                    if(doc.id !== postId){
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
        <>
            {
                posts.length > 0 &&
                <div className="post-related">
                    <Heading>Bài viết liên quan</Heading>
                    <div className="grid-layout grid-layout--primary">
                        {
                            posts.map(item => (
                                <PostItem key={item.id} data={item}></PostItem>
                            ))
                        }
                    </div>
                </div>
            }
        </>
    );
};

export default PostRelated;