"use client";
import { useEffect, useState } from "react";
import MenuItems from "./MenuItems";

import { menuItems } from "@/const/data.js";
import { cn } from "@/lib/cn";
import { useSession } from "next-auth/react";
import Link from "next/link";
const MainNav = () => {
  const [active, setActive] = useState(false);
  const isActive = () => {
    window.scrollY > 140 ? setActive(true) : setActive(false);
  };
  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);
  const { status } = useSession();

  return (
    <nav
      className={cn(
        "hidden lg:flex items-center justify-center w-full relative",
        {
          "fixed top-0 left-1/2 -translate-x-1/2 w-full gradient z-50": active,
        }
      )}
    >
      {menuItems.map((menu, index) => {
        const depthLevel = 0;
        return <MenuItems items={menu} key={index} depthLevel={depthLevel} />;
      })}
      {status === "authenticated" ? (
        <Link
          href={"/dashboard"}
          className="absolute top-1/2 -translate-y-1/2 right-2 bg-primary-base-500 hover:bg-primary-base-600 transition-all duration-300 text-white rounded-full px-4 py-1"
        >
          Dashboard
        </Link>
      ) : (
        <Link
          href={"/login"}
          className="absolute top-1/2 -translate-y-1/2 right-2 bg-primary-base-500 hover:bg-primary-base-600 transition-all duration-300 text-white rounded-full px-4 py-1"
        >
          Login
        </Link>
      )}
    </nav>
  );
};

export default MainNav;
