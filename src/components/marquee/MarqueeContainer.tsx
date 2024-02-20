import { notices } from "@/const/data";
import Marquee from "./Marquee";

const MarqueeContainer = () => (
  <div className="w-full bg-white text-red-700">
    <Marquee list={notices} />
  </div>
);

export default MarqueeContainer;
