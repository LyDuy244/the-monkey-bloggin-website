import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useUserStore } from "./zustand/newsStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase-app/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import "swiper/scss";

const HomePage = lazy(() => import("./pages/HomePage"));
const PostDetailPage = lazy(() => import("./pages/PostDetailPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const SignInPage = lazy(() => import("./pages/SignInPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const BlogPage= lazy(() => import("./pages/BlogPage"));
const DashboardLayout = lazy(() => import("./module/dashboard/DashboardLayout"));
const PostManage = lazy(() => import("./module/post/PostManage"));
const PostAddNew = lazy(() => import("./module/post/PostAddNew"));
const CategoryAddNew = lazy(() => import("./module/category/CategoryAddNew"));
const UserAddNew = lazy(() => import("./module/user/UserAddNew"));
const UserProfile = lazy(() => import("./module/user/UserProfile"));
const UserManage = lazy(() => import("./module/user/UserManage"));
const CategoryManage = lazy(() => import("./module/category/CategoryManage"));
const CategoryUpdate = lazy(() => import("./module/category/CategoryUpdate"));
const UserUpdate = lazy(() => import("./module/user/UserUpdate"));
const PostUpdate = lazy(() => import("./module/post/PostUpdate"));

function App() {
  const { setUserInfo } = useUserStore(state => state);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid)
        const docData = await getDoc(docRef);
        setUserInfo({
          ...user,
          ...docData.data()
        }
        )
      } else {
        setUserInfo(null)
      }
    })
  }, [setUserInfo])
  return <>
    <Suspense>
      <Routes>
        <Route path="/" element={<HomePage></HomePage>}></Route>
        <Route path="/signup" element={<SignupPage></SignupPage>}></Route>
        <Route path="/signin" element={<SignInPage></SignInPage>}></Route>
        <Route path="/blog" element={<BlogPage></BlogPage>}></Route>
        <Route
          path="/:slug"
          element={<PostDetailPage></PostDetailPage>}
        ></Route>
        <Route
          path="/category/:slug"
          element={<CategoryPage></CategoryPage>}
        ></Route>
        <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
        <Route element={<DashboardLayout></DashboardLayout>}>
          <Route
            path="/dashboard"
            element={<DashboardPage></DashboardPage>}
          ></Route>
          <Route
            path="/manage/posts"
            element={<PostManage></PostManage>}
          ></Route>
          <Route
            path="/manage/add-post"
            element={<PostAddNew></PostAddNew>}
          ></Route>
          <Route
            path="/manage/update-post/:id"
            element={<PostUpdate></PostUpdate>}
          ></Route>
          <Route
            path="/manage/category"
            element={<CategoryManage></CategoryManage>}
          ></Route>
          <Route
            path="/manage/add-category"
            element={<CategoryAddNew></CategoryAddNew>}
          ></Route>
          <Route
            path="/manage/update-category/:id"
            element={<CategoryUpdate></CategoryUpdate>}
          ></Route>
          <Route
            path="/manage/users"
            element={<UserManage></UserManage>}
          ></Route>
          <Route
            path="/manage/add-user"
            element={<UserAddNew></UserAddNew>}
          ></Route>
          <Route
            path="/manage/update-user/:id"
            element={<UserUpdate></UserUpdate>}
          ></Route>
          <Route
            path="/profile"
            element={<UserProfile></UserProfile>}
          ></Route>
        </Route>
      </Routes>
    </Suspense>
  </>;
}

export default App;
