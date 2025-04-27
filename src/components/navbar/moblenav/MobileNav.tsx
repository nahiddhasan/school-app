"use client";
import { menuItems } from "@/const/data";
import { cn } from "@/lib/cn";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import MobileMenuItems from "./MobileMenuItems";

const MobileNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="">
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="absolute top-6 right-6 text-white lg:hidden"
      >
        <Menu />
      </button>
      <div
        className={cn(
          "sidebar_left hidden fixed top-0 left-0 gradient h-full w-full z-[9999] p-4 overflow-y-auto",
          {
            block: menuOpen,
          }
        )}
      >
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6 text-white z-[999999]"
        >
          <X />
        </button>

        <div className="flex flex-col sm:flex-row items-center w-full">
          {/* logo */}
          <div className="w-[100px] sm:w-[200px] aspect-square flex items-center justify-center mb-2 lg:mb-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              fill="none"
              viewBox="0 0 40 40"
            >
              <path
                fill="#F06225"
                d="M20 0c11.046 0 20 8.954 20 20v14a6 6 0 0 1-6 6H21v-8.774c0-2.002.122-4.076 1.172-5.78a10 10 0 0 1 6.904-4.627l.383-.062a.8.8 0 0 0 0-1.514l-.383-.062a10 10 0 0 1-8.257-8.257l-.062-.383a.8.8 0 0 0-1.514 0l-.062.383a9.999 9.999 0 0 1-4.627 6.904C12.85 18.878 10.776 19 8.774 19H.024C.547 8.419 9.29 0 20 0Z"
              ></path>
              <path
                fill="#F06225"
                d="M0 21h8.774c2.002 0 4.076.122 5.78 1.172a10.02 10.02 0 0 1 3.274 3.274C18.878 27.15 19 29.224 19 31.226V40H6a6 6 0 0 1-6-6V21ZM40 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
              ></path>
            </svg>
          </div>
          {/* name  of school*/}
          <div className="flex flex-col text-white w-full">
            <h1 className="text-lg text-center sm:text-left xs:text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-bold mb-2 ">
              XYZ High School,Dhaka,Bangladesh
            </h1>
            <h2
              className={` text-xl text-center sm:text-left sm:text-2xl lg:text-4xl xl:text-5xl mb-4 lg:mb-0`}
            >
              কখগ উচ্চ বিদ্যালয়,ঢাকা,বাংলাদেশ
            </h2>
          </div>
        </div>
        <nav className={cn("")}>
          {menuItems.map((menu, index) => {
            const depthLevel = 0;
            return (
              <MobileMenuItems
                items={menu}
                key={index}
                depthLevel={depthLevel}
              />
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;
