"use client";
import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

import { cn } from "@/utills/cn";
import { MenuItem } from "@/utills/types";
import Link from "next/link";
import MobileDropdown from "./MobileDropdown";

type props = {
  items: MenuItem;
  depthLevel: number;
};

const MobileMenuItems = ({ items, depthLevel }: props) => {
  const [dropdown, setDropdown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      if (
        dropdown &&
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [dropdown]);

  const onMouseEnter = () => {
    window.innerWidth > 960 && setDropdown(true);
  };

  const onMouseLeave = () => {
    window.innerWidth > 960 && setDropdown(false);
  };

  return (
    <div
      className={cn(
        "flex flex-col justify-center h-full gap-2 text-white transition px-3 py-1 relative",
        {
          "py-3": depthLevel === 0,
        }
      )}
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {items.submenu ? (
        <>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdown ? "true" : "false"}
            onClick={() => setDropdown((prev) => !prev)}
            className={cn(
              "flex items-center gap-1 whitespace-nowrap w-max text-2xl",
              {
                "hover:bg-primary-600 px-3 py-1 rounded-sm w-max transition-all":
                  depthLevel > 0,
              }
            )}
          >
            {items.title}
            {depthLevel > 0 ? (
              <span> &raquo; </span>
            ) : (
              <span
                className={`${dropdown && "rotate-90"} transition duration-300`}
              >
                <MdKeyboardArrowRight />
              </span>
            )}
          </button>
          <MobileDropdown
            depthLevel={depthLevel}
            submenus={items.submenu}
            dropdown={dropdown}
          />
        </>
      ) : (
        <Link
          href={items.path!}
          className={cn(
            "flex items-center gap-1 whitespace-nowrap w-max text-2xl",
            {
              "hover:bg-primary-600 px-3 py-1 rounded-sm transition-all duration-300":
                depthLevel > 0,
            }
          )}
        >
          {items.title}
        </Link>
      )}
    </div>
  );
};

export default MobileMenuItems;
