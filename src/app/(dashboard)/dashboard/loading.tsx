import { Loader } from "lucide-react";

const loading = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
};

export default loading;
