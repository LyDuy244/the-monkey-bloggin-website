import React, { useEffect, useState } from 'react';
import Table from '../../components/table/Table';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase-app/firebase-config';
import ActionView from '../../components/action/ActionView';
import ActionEdit from '../../components/action/ActionEdit';
import ActionDelete from '../../components/action/ActionDelete';
import { useNavigate } from 'react-router-dom';
import { userRole, userStatus } from '../../utils/constants';
import LabelStatus from '../../components/label/LabelStatus';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const UserTable = () => {
    const [userList, setUserList] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        async function fetchUsers() {
            const colRef = collection(db, "users")
            onSnapshot(colRef, snapShot => {
                const results = []
                snapShot.forEach(doc => {
                    results.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
                setUserList(results);
            })
        }
        fetchUsers()
    }, [])

    const renderLabelStatus = (status) => {
        switch (status) {
            case userStatus.ACTIVE:
                return <LabelStatus type='success'>Active</LabelStatus>
            case userStatus.PENDING:
                return <LabelStatus type='warning'>Pending</LabelStatus>
            case userStatus.BAN:
                return <LabelStatus type='danger'>Banned</LabelStatus>
            default:
                break;
        }
    }

    const renderLabelRole = (role) => {
        switch (role) {
            case userRole.ADMIN:
                return "Admin"
            case userRole.MOD:
                return "Moderator"
            case userRole.USER:
                return "User"
            default:
                break;
        }
    }

    const handleDeleteUser = async (user) => {
        const docRef = doc(db, "users", user.id);
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
                toast.success("Delete user successfully")
                await deleteDoc(docRef)
            }
        });
    }
    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Info</th>
                        <th>UserName</th>
                        <th>Email address</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.length > 0 &&
                        userList.map(user => (
                            <tr key={user.id}>
                                <td title={user.id}>{user.id.slice(0, 6) + "..."}</td>
                                <td className='whitespace-nowrap'>
                                    <div className="flex items-center gap-x-3">
                                        <img src={user?.avatar} alt="" className='w-10 h-10 object-cover rounded-lg flex-shrink-0' />
                                        <div className='flex-1'>
                                            <h3>
                                                {user?.fullname}
                                            </h3>
                                            <time className='text-sm text-gray-300'>
                                                {new Date(user?.createdAt?.seconds * 1000).toLocaleDateString("vi-VI")}
                                            </time>
                                        </div>
                                    </div>
                                </td>
                                <td>{user?.username}</td>
                                <td title={user?.email}>{user?.email.slice(0, 5) + "..."}</td>
                                <td>
                                    {renderLabelStatus(Number(user?.status))}
                                </td>
                                <td>
                                    {renderLabelRole(Number(user.role))}
                                </td>
                                <td>
                                    <div className="flex gap-5 text-gray-400">
                                        <ActionView></ActionView>
                                        <ActionEdit onClick={() => { navigate(`/manage/update-user/${user.id}`) }}></ActionEdit>
                                        <ActionDelete onClick={() => handleDeleteUser(user)} ></ActionDelete>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </div>
    );
};

export default UserTable;