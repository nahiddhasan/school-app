import { notices } from "@/const/data";
import Marquee2 from "./Marquee2";

const MarqueeContainer = () => {
  return (
    <div className="w-full bg-white text-red-700">
      {/* <Marquee list={notices} /> */}
      <Marquee2 list={notices} />
    </div>
  );
};

export default MarqueeContainer;
