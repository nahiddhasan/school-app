"use client";

import CountUp from "react-countup";

const CountUpNumber = ({ number }: { number: number }) => {
  return <CountUp end={number} />;
};

export default CountUpNumber;
