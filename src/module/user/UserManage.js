import React, { useEffect } from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import UserTable from "./UserTable";
import Button from "../../components/button/Button";
import { useUserStore } from "../../zustand/newsStore";
import { userRole } from "../../utils/constants";

const UserManage = () => {
  const { userInfo } = useUserStore(state => state);
  
  useEffect(() => {
    document.title = "Monkey Blogging - Manage User"
  }, [])

  if (userInfo?.role !== userRole.ADMIN) {
    return null;
  }
  return (
    <div>
      <DashboardHeading
        title="Users"
        desc="Manage your user"
      ></DashboardHeading>
      <div className="flex justify-end mb-10">
        <Button kind="ghost" to="/manage/add-user">Add new User</Button>
      </div>
      <UserTable></UserTable>
    </div>
  );
};

export default UserManage;