import React, { useEffect, useState } from 'react';
import ActionView from '../../components/action/ActionView';
import ActionEdit from '../../components/action/ActionEdit';
import ActionDelete from '../../components/action/ActionDelete';
import { useNavigate } from 'react-router-dom';
import { postStatus } from '../../utils/constants';
import LabelStatus from '../../components/label/LabelStatus';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-app/firebase-config';
import Swal from 'sweetalert2';

const PostManageItem = ({ data }) => {
    const navigate = useNavigate();
    const [category, setCategory] = useState({})
    const [user, setUser] = useState({})
    const date = data?.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000) : new Date();
    const formatDate = new Date(date).toLocaleDateString("vi-VI")
    const renderPostStatus = (status) => {
        switch (status) {
            case postStatus.APPROVE:
                return <LabelStatus type="success">Approved</LabelStatus>
            case postStatus.PENDING:
                return <LabelStatus type="warning">Pending</LabelStatus>
            case postStatus.REJECTED:
                return <LabelStatus type="danger">Rejected</LabelStatus>

            default:
                break;
        }
    }
    const handleDeletePost = (postId) => {
        const docRef = doc(db, "posts", postId);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
                await deleteDoc(docRef)
            }
        });

    }

    useEffect(() => {
        if (!data?.userId) return;
        async function fetchUserData() {
            const docRef = doc(db, "users", data?.userId);
            const docData = await getDoc(docRef);
            if (docData.data()) {
                setUser({
                    id: docData.id,
                    ...docData.data()
                })
            }
        }
        fetchUserData();
    }, [data?.userId])

    useEffect(() => {
        if (!data?.categoryId) return;
        async function fetchUserData() {
            const docRef = doc(db, "categories", data?.categoryId);
            const docData = await getDoc(docRef);
            if (docData.data()) {
                setCategory({
                    id: docData.id,
                    ...docData.data()
                })
            }
        }
        fetchUserData();
    }, [data?.categoryId])


    if (!data) return null;
    return (
        <tr key={data.id}>
            <td title={data.id}>{data.id.slice(0, 6) + "..."}</td>
            <td>
                <div className="flex items-center gap-x-3">
                    <img
                        src={data.image}
                        alt={data.title}
                        className="w-[66px] h-[55px] rounded object-cover"
                    />
                    <div className="flex-1 whitespace-pre-wrap">
                        <h3 className="font-semibold max-w-[300px] ">{data.title}</h3>
                        <time className="text-sm text-gray-500">
                            Date: {formatDate}
                        </time>
                    </div>
                </div>
            </td>
            <td>
                <span className="text-gray-500">{category?.name}</span>
            </td>
            <td>
                <span className="text-gray-500">{user?.username}</span>
            </td>
            <td>
                {
                    renderPostStatus(data.status)
                }
            </td>
            <td>
                <div className="flex gap-5 text-gray-400">
                    <ActionView onClick={() => { navigate(`/${data.slug}`) }}></ActionView>
                    <ActionEdit onClick={() => { navigate(`/manage/update-post/${data.id}`) }}></ActionEdit>
                    <ActionDelete onClick={() => { handleDeletePost(data.id) }}></ActionDelete>
                </div>
            </td>
        </tr>
    );
};

export default PostManageItem;