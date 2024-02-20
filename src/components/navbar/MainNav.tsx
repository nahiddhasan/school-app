"use client";
import { useEffect, useState } from "react";
import MenuItems from "./MenuItems";

import { menuItems } from "@/const/data.js";
import { cn } from "@/utills/cn";
const MainNav = () => {
  const [active, setActive] = useState(false);
  const isActive = () => {
    window.scrollY > 200 ? setActive(true) : setActive(false);
  };
  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  return (
    <nav
      className={cn("items-center justify-center hidden lg:flex", {
        "fixed top-0 left-1/2 -translate-x-1/2 w-full gradient z-50": active,
      })}
    >
      {menuItems.map((menu, index) => {
        const depthLevel = 0;
        return <MenuItems items={menu} key={index} depthLevel={depthLevel} />;
      })}
    </nav>
  );
};

export default MainNav;
