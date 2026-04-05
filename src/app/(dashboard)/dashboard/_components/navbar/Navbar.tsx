import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { Bell, MessageCircleIcon } from "lucide-react";
import { Profile } from "./Profile";

const Navbar = async () => {
  const session = await auth();
  const schoolInfo = await prisma.schoolInfo.findFirst({
    where: {
      id: session?.user.schoolId,
    },
  });

  return (
    <div className="w-full h-12 px-4 bg-primary shadow-md flex justify-between items-center gap-4">
      <div className="flex items-center justify-between flex-1">
        <h1 className="font-semibold text-lg">{schoolInfo?.name}</h1>
      </div>
      <div className="flex-1 flex gap-2 items-center justify-end">
        <div className="relative cursor-pointer">
          <Bell size={24} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full  px-1 py-0">
            3
          </span>
        </div>
        <div className="relative cursor-pointer">
          <MessageCircleIcon size={24} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 py-0">
            5
          </span>
        </div>
        <Profile />
      </div>
    </div>
  );
};

export default Navbar;
