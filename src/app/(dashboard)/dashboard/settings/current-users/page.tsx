import { getCurrentUsers } from "@/lib/data";
import UserDataTable from "../_components/UserDataTable";

const CurrentUsers = async () => {
  const users = await getCurrentUsers();
  return (
    <div className="p-4 px-16">
      <h1 className="text-2xl py-4">List of all users</h1>
      <UserDataTable users={users} />
    </div>
  );
};

export default CurrentUsers;
