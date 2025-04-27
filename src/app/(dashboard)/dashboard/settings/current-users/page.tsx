import { getCurrentUsers } from "@/lib/protectedDataFetch/currentUsers.data";
import SearchFilter from "../../_components/SearchFilter";
import PaginationCom from "../../_components/pagination/Pagination";
import UserDataTable from "../_components/UserDataTable";
type props = {
  searchParams: {
    pageSize?: string;
    search?: string;
  };
};
const CurrentUsers = async ({ searchParams }: props) => {
  const { users, usersCount } = await getCurrentUsers(searchParams);
  return (
    <div className="p-4 px-16 h-full overflow-y-auto">
      <h1 className="text-2xl py-2">List of all users</h1>
      <div className="flex flex-col pb-10">
        <SearchFilter inputLabel="Search By Name or Email..." />
        <hr />
        <UserDataTable users={users} />
        <hr className="my-2" />
        {usersCount > Number(searchParams.pageSize || "10") && (
          <PaginationCom totalCount={usersCount} />
        )}
      </div>
    </div>
  );
};

export default CurrentUsers;
