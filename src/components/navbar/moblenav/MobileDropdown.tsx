import { cn } from "@/lib/cn";
import { MenuItem } from "@/lib/types";
import MobileMenuItems from "./MobileMenuItems";

type props = {
  submenus: MenuItem[];
  dropdown: boolean;
  depthLevel: number;
};
const MobileDropdown = ({ submenus, dropdown, depthLevel }: props) => {
  depthLevel = depthLevel + 1;

  return (
    <div
      className={cn(" flex-col min-w-[120px] w-max z-[9999] gradient hidden", {
        flex: dropdown,
        "ml-4": depthLevel > 1,
      })}
    >
      {submenus.map((submenu, index) => (
        <MobileMenuItems items={submenu} key={index} depthLevel={depthLevel} />
      ))}
    </div>
  );
};

export default MobileDropdown;
