import { cn } from "@/lib/cn";
type props = {
  children: React.ReactNode;
  className?: string;
};
const Container = ({ className, children }: props) => {
  return (
    <div
      className={cn(
        "max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
