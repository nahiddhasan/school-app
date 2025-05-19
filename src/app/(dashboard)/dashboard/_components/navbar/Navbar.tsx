import { Bell, MessageCircleIcon } from "lucide-react";
import { Profile } from "./Profile";

const Navbar = async () => {
  return (
    <div className="w-full h-12 px-4 bg-primary shadow-md flex justify-between items-center gap-4">
      <div className="flex items-center justify-between flex-1">
        <h1>School Management System</h1>
      </div>
      <div className="flex-1 flex gap-2 items-center justify-end">
        <Bell size={24} />
        <MessageCircleIcon size={24} />
        <Profile />
      </div>
    </div>
  );
};

export default Navbar;
