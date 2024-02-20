"use client";
import { sliders } from "@/const/data";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
const Slider = () => {
  return (
    <div>
      <Carousel
        autoPlay
        showStatus={false}
        infiniteLoop={true}
        showThumbs={false}
        stopOnHover={false}
        interval={3000}
      >
        {sliders.map((slide) => (
          <div
            key={slide.image}
            className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600] 2xl:h-[700px]"
          >
            <Image
              src={slide.image}
              alt="slide"
              fill
              className="object-cover"
            />

            {slide.title && <p className="legend">{slide.title}</p>}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Slider;
