"use client";
import { cn } from "@/lib/cn";
import Link from "next/link";
import React, { useState } from "react";

interface MarqueeProps {
  list: {
    title: string;
    path: string;
    createdAt: string;
  }[];
}
// TODO: need to change createdAt type letter
const Marquee: React.FC<MarqueeProps> = ({ list }) => {
  const [paused, setPaused] = useState(false);

  return (
    <div className="overflow-hidden flex w-full">
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className={cn(
          "w-full flex-shrink-0 flex items-center  whitespace-nowrap animate-marquee select-none py-1 font-bold",
          {
            paused: paused,
          }
        )}
      >
        {list.map((item) => (
          <Link
            href={item.path}
            key={item.title}
            className="inline-block mr-4 hover:underline"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
