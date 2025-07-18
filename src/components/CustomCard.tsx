import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const CustomCard = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-center shadow-md hover:shadow-xl transition-all duration-300 rounded-md",
        className
      )}
    >
      {children}
    </div>
  );
};

export default CustomCard;
