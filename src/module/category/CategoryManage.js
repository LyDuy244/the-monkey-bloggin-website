import React, { useEffect, useState } from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import Table from "../../components/table/Table";
import LabelStatus from "../../components/label/LabelStatus";
import ActionView from "../../components/action/ActionView";
import ActionEdit from "../../components/action/ActionEdit";
import ActionDelete from "../../components/action/ActionDelete";
import Button from "../../components/button/Button";
import { collection, deleteDoc, doc, getDocs, limit, onSnapshot, query, startAfter, where } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { categoryStatus } from "../../utils/constants";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@uidotdev/usehooks";

const CATEGORY_PER_PAGE = 1;

const CategoryManage = () => {
    const [categoryList, setCategoryList] = useState([]);
    const navigate = useNavigate();
    const [filter, setFilter] = useState("")
    const queryDebounce = useDebounce(filter, 500)
    const [lastDoc, setLastDoc] = useState()
    const [total, setTotal] = useState(0);
    useEffect(() => {
        async function fetchData() {
            const colRef = collection(db, "categories");
            const newRef = queryDebounce
                ? query(
                    colRef,
                    where("name", ">=", queryDebounce),
                    where("name", "<=", queryDebounce + "utf8"),
                    limit(CATEGORY_PER_PAGE)
                )
                : query(colRef, limit(CATEGORY_PER_PAGE));

            // Get size collection
            onSnapshot(colRef, snapShot => {
                setTotal(snapShot.size)
            })

            // Get the last visible document
            const documentSnapshots = await getDocs(newRef);
            const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
            onSnapshot(newRef, (snapShot) => {
                const results = []
                snapShot.forEach(doc => {
                    results.push({
                        id: doc.id,
                        ...doc.data()
                    })
                });
                setCategoryList(results);
            })
            setLastDoc(lastVisible);

        }
        fetchData();
    }, [queryDebounce])
    const handleDeleteCategory = async (docId) => {
        const docRef = doc(db, "categories", docId);
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

    const handleLoadMoreCategory = async () => {
        // Query the first page of docs
        const nextRef = query(collection(db, "categories"),
            startAfter(lastDoc),
            limit(CATEGORY_PER_PAGE));

        onSnapshot(nextRef, (snapShot) => {
            const results = []
            snapShot.forEach(doc => {
                results.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            setCategoryList([...categoryList, ...results]);
        })

        const documentSnapshots = await getDocs(nextRef);

        // Get the last visible document
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastDoc(lastVisible);
    }

    return (
        <div>
            <DashboardHeading title="Categories" desc="Manage your category">
                <Button kind="ghost" height="60px" to="/manage/add-category">
                    Create category
                </Button>
            </DashboardHeading>
            <div className="mb-10 flex justify-end">
                <input type="text" placeholder="Search category..." className="py-4 px-5 border border-solid border-gray-300 rounded-lg" onChange={(e) => setFilter(e.target.value)} />
            </div>
            <Table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categoryList.length > 0 &&
                        categoryList.map(item => (
                            <tr key={item.id}>
                                <td>{item.id.slice(0, 6)}</td>
                                <td>{item.name}</td>
                                <td>
                                    <span className="text-gray-400">
                                        {item.slug}
                                    </span>
                                </td>
                                <td>
                                    {
                                        Number(item.status) === categoryStatus.APPROVE &&
                                        <LabelStatus type="success">Approved</LabelStatus>
                                    }
                                    {
                                        Number(item.status) === categoryStatus.UNAPPROVED &&
                                        <LabelStatus type="warning">UNAPPROVEDd</LabelStatus>
                                    }
                                </td>
                                <td>
                                    <div className="flex gap-5 text-gray-400">
                                        <ActionView></ActionView>
                                        <ActionEdit onClick={() => { navigate(`/manage/update-category/${item.id}`) }}></ActionEdit>
                                        <ActionDelete onClick={() => { handleDeleteCategory(item.id) }}></ActionDelete>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
            {
                categoryList && total > categoryList.length &&
                <div className="mt-10">
                    <Button className="mx-auto" onClick={handleLoadMoreCategory}>Load more</Button>
                </div>
            }
        </div>
    );
};

export default CategoryManage;