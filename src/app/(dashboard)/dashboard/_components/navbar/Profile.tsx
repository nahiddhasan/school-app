"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/actions";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function Profile() {
  const { data: session } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={session?.user.image || "/img/avatar.png"} />
          <AvatarFallback>profile</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-4 space-y-4 min-w-[300px]">
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24 aspect-square">
            <AvatarImage src={session?.user.image || "/img/avatar.png"} />
            <AvatarFallback>profile</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xl">{session?.user?.name}</span>
            <span className="text-xs truncate">{session?.user.email}</span>
            <span>{session?.user.role}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <DropdownMenuItem asChild>
            <Link href={"/dashboard/settings/update-profile"}>
              Update Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => logout()}>
            Logout
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
