// "use client";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";
// import { NoticesType } from "@/lib/types";
// import AutoScroll from "embla-carousel-auto-scroll";
// import Image from "next/image";
// import Link from "next/link";
// import Container from "../../Container";
// const NoticeBoard = ({ notices, slug }: NoticesType) => {
//   return (
//     <div>
//       <Container className="flex items-center justify-center">
//         <div className="hidden md:w-[90%] h-full lg:h-[500px] md:flex flex-col lg:flex-row items-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-300 via-red-500 to-red-700 rounded-lg p-4">
//           <div className="md:w-1/2 lg:w-[30%] flex items-center justify-center flex-col ">
//             <h1 className="text-4xl my-8 text-white font-bold">
//               Recent Notices
//             </h1>
//             <Image
//               src={"/img/marketing.svg"}
//               height={200}
//               width={200}
//               alt="announcement"
//             />
//           </div>
//           {/* notice carousel  */}

//           <div className="w-full lg:w-[70%] h-[70vh] lg:h-[90%] relative rounded-2xl px-4 pt-4 bg-[url('/img/notice-bnr.png')] bg-contain bg-no-repeat bg-center">
//             <div className="w-[350px] h-[230px] absolute top-14 left-56 overflow-hidden ">
//               <Carousel
//                 plugins={[
//                   AutoScroll({
//                     AutoScroll: true,
//                     speed: 0.25,
//                     stopOnInteraction: false,
//                     stopOnMouseEnter: true,
//                   }),
//                 ]}
//                 opts={{
//                   loop: true,
//                   align: "start",
//                 }}
//                 orientation="vertical"
//               >
//                 <CarouselContent className="h-[220px]">
//                   {notices.map((notice) => (
//                     <CarouselItem key={notice.title} className="basis-auto">
//                       <Link
//                         href={`/${slug}/notice/${notice.id}`}
//                         className="text-primary-base-700 hover:underline truncate"
//                       >
//                         <span className="font-bold text-primary-base-950 whitespace-nowrap">
//                           {notice.createdAt.toLocaleDateString("en-GB", {
//                             day: "numeric",
//                             month: "short",
//                           })}
//                           :
//                         </span>
//                         {notice.title}
//                       </Link>
//                     </CarouselItem>
//                   ))}
//                 </CarouselContent>
//               </Carousel>
//             </div>
//           </div>
//         </div>
//       </Container>
//     </div>
//   );
// };

// export default NoticeBoard;

"use client";

import { NoticesType } from "@/lib/types";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Container from "../../Container";

const SCROLL_SPEED = 20; // pixels per second

const NoticeBoard = ({ notices, slug }: NoticesType) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const scrollHeight = containerRef.current?.scrollHeight || 0;
    const containerHeight = containerRef.current?.offsetHeight || 0;

    if (scrollHeight <= containerHeight) return;

    const distance = scrollHeight;

    controls.start({
      y: [`0%`, `-${distance}px`],
      transition: {
        duration: distance / SCROLL_SPEED,
        ease: "linear",
        repeat: Infinity,
      },
    });
  }, [notices.length, controls]);

  return (
    <div className="my-16">
      <Container className="flex items-center justify-center">
        <div className="hidden md:w-[90%] h-full lg:h-[500px] md:flex flex-col lg:flex-row items-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-300 via-red-500 to-red-700 rounded-lg p-4">
          {/* Left Side */}
          <div className="md:w-1/2 lg:w-[30%] flex items-center justify-center flex-col">
            <h1 className="text-4xl my-8 text-white font-bold">
              Recent Notices
            </h1>
            <Image
              src={"/img/marketing.svg"}
              height={200}
              width={200}
              alt="announcement"
            />
          </div>

          {/* Notice Scroller */}
          <div className="w-full lg:w-[70%] h-[70vh] lg:h-[90%] relative rounded-2xl px-4 pt-4 bg-[url('/img/notice-bnr.png')] bg-contain bg-no-repeat bg-center">
            <div className="w-[350px] h-[230px] absolute top-14 left-56 overflow-hidden">
              <div className="relative h-full" ref={containerRef}>
                <motion.div
                  animate={controls}
                  className="absolute top-0 left-0 w-full"
                >
                  {/* Duplicate notices for smooth infinite scroll */}
                  {[...notices, ...notices].map((notice, i) => (
                    <div key={`${notice.id}-${i}`} className="py-2">
                      <Link
                        href={`/${slug}/notice/${notice.id}`}
                        className="text-primary-base-700 hover:underline truncate"
                      >
                        <span className="font-bold text-primary-base-950 whitespace-nowrap">
                          {new Date(notice.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                            }
                          )}
                          :
                        </span>{" "}
                        {notice.title}
                      </Link>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NoticeBoard;
