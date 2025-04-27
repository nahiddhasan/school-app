import React from "react";
import SettingsSidebar from "./_components/SettingsSidebar";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="w-full h-full flex">
      <div className="flex-1 ">
        <SettingsSidebar />
      </div>
      <div className="flex-[3]">{children}</div>
    </div>
  );
};

export default layout;
