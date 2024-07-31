import React, { useEffect, useState } from "react";
import Table from "../../components/table/Table";
import Dropdown from "../../components/dropdown/Dropdown";
import Select from "../../components/dropdown/Select";
import Button from "../../components/button/Button";
import DashboardHeading from "../dashboard/DashboardHeading";
import { collection, getDocs, limit, onSnapshot, query, startAfter, where } from "firebase/firestore";
import { useDebounce } from "@uidotdev/usehooks";
import { db } from "../../firebase-app/firebase-config";
import { userRole } from "../../utils/constants";
import { useUserStore } from "../../zustand/newsStore";
import PostManageItem from "./PostManageItem";
const POST_PER_PAGE = 10;

const PostManage = () => {
  const [postList, setPostList] = useState([]);
  const [filter, setFilter] = useState("")
  const queryDebounce = useDebounce(filter, 500)
  const [lastDoc, setLastDoc] = useState()
  const [total, setTotal] = useState(0);
  const { userInfo } = useUserStore(state => state);
  ;
  useEffect(() => {
    if (!userInfo?.uid) return;
    async function fetchData() {
      const colRef = collection(db, "posts");
      let q = query(colRef);
      if (userInfo?.role !== userRole.ADMIN) {
        q = query(q, where("userId", "==", userInfo?.uid))
      }
      q = queryDebounce
        ? query(
          q,
          where("title", ">=", queryDebounce),
          where("title", "<=", queryDebounce + "utf8"),
          limit(POST_PER_PAGE)
        )
        : query(q, limit(POST_PER_PAGE));

      // Get size collection
      onSnapshot(q, snapShot => {
        setTotal(snapShot.size)
      })

      // Get the last visible document
      const documentSnapshots = await getDocs(q);
      const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

      onSnapshot(q, (snapShot) => {
        const results = []
        if (snapShot.docs.length > 0) {
          snapShot.forEach(doc => {
            results.push({
              id: doc.id,
              ...doc.data()
            })
          });
        }
        setPostList(results);
      })
      setLastDoc(lastVisible);
    }
    fetchData();

  }, [queryDebounce, userInfo])

  const handleLoadMorePost = async () => {
    // Query the first page of docs
    const nextRef = query(collection(db, "posts"),
      startAfter(lastDoc),
      limit(POST_PER_PAGE));

    onSnapshot(nextRef, (snapShot) => {
      const results = []
      snapShot.forEach(doc => {
        results.push({
          id: doc.id,
          ...doc.data()
        })
      });
      setPostList([...postList, ...results]);
    })

    const documentSnapshots = await getDocs(nextRef);

    // Get the last visible document
    const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);
  }


  const handleSearchPost = (e) => {
    setFilter(e.target.value)
  }

  useEffect(() => {
    document.title = "Monkey Blogging - Manage post"
  }, [])

  return (
    <div>
      <DashboardHeading
        title="All posts"
        desc="Manage all posts"
      ></DashboardHeading>
      <div className="mb-10 flex justify-end gap-5">
        <div className="w-full max-w-[200px]">
          <Dropdown>
            <Select placeholder="Category"></Select>
          </Dropdown>
        </div>
        <div className="w-full max-w-[300px]">
          <input
            type="text"
            className="w-full p-4 rounded-lg border border-solid border-gray-300"
            placeholder="Search post..."
            onChange={handleSearchPost}
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Post</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            postList.length > 0 &&
            postList.map(post => (<PostManageItem key={post.id} data={post}></PostManageItem>))
          }
        </tbody>
      </Table>
      <div className="mt-10 text-center">
        {/* <Pagination></Pagination> */}
        {
          postList && postList.length > 0 && total >= postList.length &&
          <Button onClick={handleLoadMorePost} kind="ghost" className="mx-auto w-[200px]">
            Load more
          </Button>
        }
      </div>
    </div>
  );
};

export default PostManage;