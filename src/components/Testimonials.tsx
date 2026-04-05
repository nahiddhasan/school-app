"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";
import CustomCard from "./CustomCard"; // adjust the path as needed

interface Testimonial {
  author: string;
  role: string;
  message: string;
}

export default function TestimonialSlider({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="my-16">
      <h2 className="text-2xl font-bold mb-4">Testimonials</h2>
      <div className="relative ">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {testimonials.map((t, idx) => (
              <div className="min-w-full md:min-w-[50%] m-4" key={idx}>
                <CustomCard className="p-4 h-full space-y-2">
                  <p className="text-gray-700 italic">{t.message}</p>
                  <div className="text-right">
                    <p className="font-semibold">- {t.author}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </CustomCard>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollPrev}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white p-2 shadow-md rounded-full"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={scrollNext}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white p-2 shadow-md rounded-full"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}
