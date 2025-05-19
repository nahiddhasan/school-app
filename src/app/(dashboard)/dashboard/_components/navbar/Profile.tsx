"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import UpdateProfileModal from "../UpdateProfileModal";

export function Profile() {
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  if (status === "loading") {
    return <Loader2 className="animate-spin" />;
  }
  const url =
    session?.user.role === "ADMIN"
      ? `/dashboard/admin/${session.user.id}`
      : session?.user.role === "TEACHER"
      ? `/dashboard/teacher/${session.user.teacherId}`
      : session?.user.role === "STUDENT"
      ? `/dashboard/student/${session.user.studentId}`
      : "/";

  if (status === "authenticated") {
    return (
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={session?.user.image || "/img/avatar.png"} />
              <AvatarFallback>profile</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="p-4 space-y-4 max-w-[350px]"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24 aspect-square">
                <AvatarImage src={session?.user.image || "/img/avatar.png"} />
                <AvatarFallback>profile</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <Link
                  href={url}
                  onClick={() => setOpen(!open)}
                  className="text-xl"
                >
                  {session?.user?.name}
                </Link>
                <span className="text-xs ">{session?.user.email}</span>
                <span>{session?.user.role}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              {/* <DropdownMenuItem asChild>
              <Link href={"/dashboard/users/update-profile"}>Update Profile</Link>
            </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => setOpen(!open)}>
                Update Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={loading}
                className="cursor-pointer"
                onClick={async () => {
                  setLoading(true);
                  await logout();
                  localStorage.clear();
                  setLoading(false);
                }}
              >
                Logout
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <div>
          {session.user && (
            <UpdateProfileModal
              user={session.user}
              open={open}
              setOpen={setOpen}
            />
          )}
        </div>
      </div>
    );
  }
}
