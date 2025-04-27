import { Profile } from "./Profile";

const Navbar = async () => {
  return (
    <div className="w-full h-12 px-4 dark:bg-zinc-900 shadow-2xl shadow-blue-500/20 flex justify-between items-center gap-4">
      <div className="flex items-center justify-between flex-1">
        <h1>School Management System</h1>
      </div>
      <div className="flex-1 flex items-center justify-end">
        <Profile />
      </div>
    </div>
  );
};

export default Navbar;
