import { cn } from "@/utills/cn";
import { MenuItem } from "@/utills/types";
import MenuItems from "./MenuItems";

type props = {
  submenus: MenuItem[];
  dropdown: boolean;
  depthLevel: number;
};
const Dropdown = ({ submenus, dropdown, depthLevel }: props) => {
  depthLevel = depthLevel + 1;

  return (
    <div
      className={cn(
        "absolute min-w-[120px] w-max right-0 left-0 z-[9999] gradient ring-white transition",
        {
          "visible opacity-100 m-0 transition-all duration-300": dropdown,
          "invisible opacity-0 -m-4 transition-all duration-300": !dropdown,
          "rounded-b-md top-full": depthLevel > 0,
          "left-full top-1/2 border-l border-white": depthLevel > 1,
        }
      )}
    >
      {submenus.map((submenu, index) => (
        <MenuItems items={submenu} key={index} depthLevel={depthLevel} />
      ))}
    </div>
  );
};

export default Dropdown;
