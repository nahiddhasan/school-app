"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";

import Container from "@/components/Container";
import { NoticesType } from "@/lib/types";
import Link from "next/link";

const MarqueeContainer = ({ notices }: NoticesType) => {
  return (
    <div className="w-full bg-white text-red-700">
      <Container>
        <Carousel
          plugins={[
            AutoScroll({
              AutoScroll: true,
              speed: 0.5,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          opts={{
            loop: true,
            align: "start",
          }}
        >
          <CarouselContent className="ml-[100%]">
            {notices.map((notice) => (
              <CarouselItem key={notice.title} className="basis-auto">
                <Link
                  href={`/notice/${notice.id}`}
                  className="inline-block mr-4 hover:underline py-1 font-semibold"
                >
                  <span>
                    {notice.createdAt.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                    :{" "}
                  </span>
                  <span>{notice.title}</span>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </Container>
    </div>
  );
};

export default MarqueeContainer;
