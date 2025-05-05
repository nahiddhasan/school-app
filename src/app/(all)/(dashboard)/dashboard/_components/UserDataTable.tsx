import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { UserWithoutPass } from "@/lib/types";
import Image from "next/image";
import DeleteAlert from "./DeleteAlert";
import UpdateUserModal from "./UpdateUserModal";
type props = {
  users: UserWithoutPass[];
};
const UserDataTable = ({ users }: props) => {
  return (
    <Table className="flex-1">
      <TableCaption>
        {users.length > 0 ? " List of Users" : "Nothing Found!"}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>IsDisabled</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <Image
                src={user.image || "/img/avatar.png"}
                height={28}
                width={28}
                alt={user.name}
                className="rounded-full aspect-square object-cover"
              />
            </TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              {user.isDisabled ? (
                <span className="bg-red-300 text-red-700 text-sm rounded-full px-2">
                  disabled
                </span>
              ) : (
                <span className="bg-green-300 text-green-700 text-sm rounded-full px-2">
                  enabled
                </span>
              )}
            </TableCell>
            <TableCell className=" space-x-2 ">
              <div className="flex items-center gap-2">
                <UpdateUserModal user={user} />
                <DeleteAlert userId={user.id} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserDataTable;
