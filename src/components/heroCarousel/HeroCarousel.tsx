"use client";

import { SliderImage } from "@/app/generated/prisma";
import { sliders } from "@/const/data";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { DotButton, useDotButton } from "./DotButton";

const HeroCarousel = ({ slides }: { slides: SliderImage }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
    Fade(),
  ]);
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  return (
    <div className="relative w-full h-[75vh]">
      <div className="embla__viewport h-full" ref={emblaRef}>
        <div className="embla__container relative h-full">
          {sliders.map((slide, index) => (
            <div key={index} className={`absolute top-0 left-0 w-full h-full`}>
              <div className="w-full h-full relative rounded-xl overflow-hidden">
                <Image
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={
              "w-3 h-3 rounded-full transition " +
              (selectedIndex === index
                ? "bg-white scale-110"
                : "bg-white/40 hover:bg-white/60")
            }
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
