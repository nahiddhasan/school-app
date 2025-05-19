import { Loader as Loading } from "lucide-react";

const Loader = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Loading className="animate-spin" />
    </div>
  );
};

export default Loader;
