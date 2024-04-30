"use client";
import AutoScroll from "embla-carousel-auto-scroll";
import Link from "next/link";
import Container from "../Container";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
interface MarqueeProps {
  list: {
    title: string;
    path: string;
    createdAt: string;
  }[];
}

const Marquee2: React.FC<MarqueeProps> = ({ list }) => {
  return (
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
        <CarouselContent className="ml-[1200px]">
          {list.map((item) => (
            <CarouselItem key={item.title} className="basis-auto">
              <Link
                href={item.path}
                className="inline-block mr-4 hover:underline py-1 font-semibold"
              >
                {item.title}
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Container>
  );
};

export default Marquee2;
